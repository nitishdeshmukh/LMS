import { Student, Course, Enrollment, Submission } from "../../models/index.js";
import { submitAssignmentSchema } from "../../validation/student.zod.js";
import { updateLeaderboard } from "./leaderboard.controller.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * Helper function to calculate progress percentage
 */
const calculateProgress = (course, completedQuizzes, completedTasks) => {
    let totalItems = 0;
    let completedItems = 0;

    course.modules.forEach((module) => {
        totalItems += module.quizzes.length + module.tasks.length;
        completedItems += module.quizzes.filter((q) =>
            completedQuizzes.includes(q._id.toString())
        ).length;
        completedItems += module.tasks.filter((t) =>
            completedTasks.includes(t._id.toString())
        ).length;
    });

    if (totalItems === 0) return 0;
    return Math.round((completedItems / totalItems) * 100);
};

/**
 * Helper function to check if a module is completed
 */
const isModuleCompleted = (module, completedQuizzes, completedTasks) => {
    const moduleQuizzes = module.quizzes || [];
    const moduleTasks = module.tasks || [];

    const moduleQuizIds = moduleQuizzes.map((q) => q._id.toString());
    const moduleTaskIds = moduleTasks.map((t) => t._id.toString());

    // If module has no quizzes and no tasks, it's considered complete
    if (moduleQuizIds.length === 0 && moduleTaskIds.length === 0) {
        return true;
    }

    const allQuizzesCompleted = moduleQuizIds.every((id) =>
        completedQuizzes.includes(id)
    );
    const allTasksCompleted = moduleTaskIds.every((id) =>
        completedTasks.includes(id)
    );

    return allQuizzesCompleted && allTasksCompleted;
};

/**
 * GET /api/student/assignments
 * Get all courses with assignment progress
 */
export const getAssignmentsByCourse = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.userId,
            paymentStatus: { $nin: ["UNPAID"] },
        }).populate("course", "title slug thumbnail modules");

        const coursesWithAssignments = enrollments.map((enrollment) => {
            const course = enrollment.course;
            let totalAssignments = 0;
            let completedAssignments = 0;

            const completedTaskIds = enrollment.completedTasks.map((id) =>
                id.toString()
            );

            course.modules.forEach((module) => {
                totalAssignments += module.tasks.length;
                completedAssignments += module.tasks.filter((t) =>
                    completedTaskIds.includes(t._id.toString())
                ).length;
            });

            return {
                id: course._id,
                title: course.title,
                slug: course.slug,
                thumbnail: course.thumbnail,
                totalAssignments,
                completedAssignments,
                progress:
                    totalAssignments > 0
                        ? Math.round(
                              (completedAssignments / totalAssignments) * 100
                          )
                        : 0,
            };
        });

        res.status(200).json({ success: true, data: coursesWithAssignments });
    } catch (error) {
        console.error("Get assignments by course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assignments",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * GET /api/student/courses/:slug/assignments
 * Get assignments for a specific course
 */
export const getCourseAssignments = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({ slug }).select("title modules");
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                code: ERROR_CODES.COURSE_NOT_FOUND,
            });
        }

        const enrollment = await Enrollment.findOne({
            student: req.userId,
            course: course._id,
            paymentStatus: { $nin: ["UNPAID"] },
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        // Get assignment submissions
        const submissions = await Submission.find({
            student: req.userId,
            course: course._id,
            type: "assignment",
        });

        const completedQuizIds = enrollment.completedQuizzes.map((id) =>
            id.toString()
        );
        const completedTaskIds = enrollment.completedTasks.map((id) =>
            id.toString()
        );

        // Sort modules by order
        const sortedModules = [...(course.modules || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
        );

        // Calculate module completion status for lock logic
        const moduleCompletionStatus = sortedModules.map((module) =>
            isModuleCompleted(module, completedQuizIds, completedTaskIds)
        );

        const assignments = [];
        sortedModules.forEach((module, moduleIndex) => {
            // First module is always open, others depend on previous module completion
            const isModuleLocked =
                moduleIndex > 0 && !moduleCompletionStatus[moduleIndex - 1];

            module.tasks.forEach((task) => {
                const submission = submissions.find(
                    (s) => s.taskId?.toString() === task._id.toString()
                );
                const isSubmitted = !!submission;

                // Determine task status: Locked, Open, or Submitted
                let status;
                if (isModuleLocked) {
                    status = "Locked";
                } else if (isSubmitted) {
                    status = "Submitted";
                } else {
                    status = "Open";
                }

                assignments.push({
                    id: task._id,
                    moduleId: module._id,
                    moduleTitle: module.title,
                    title: task.title,
                    description: task.description,
                    status,
                    isModuleLocked,
                    isSubmitted,
                    isCompleted: completedTaskIds.includes(task._id.toString()),
                    submissionStatus: submission?.status || "pending",
                    grade: submission?.grade,
                    feedback: submission?.feedback,
                    githubLink: submission?.githubLink,
                });
            });
        });

        res.status(200).json({
            success: true,
            data: {
                courseId: course._id,
                courseTitle: course.title,
                assignments,
            },
        });
    } catch (error) {
        console.error("Get course assignments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assignments",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * POST /api/student/assignments/submit
 * Submit assignment or capstone
 */
export const submitAssignment = async (req, res) => {
    try {
        const validation = submitAssignmentSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const {
            courseId,
            moduleId,
            taskId,
            githubLink,
            liveLink,
            additionalNotes,
            isCapstone,
        } = validation.data;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                code: ERROR_CODES.COURSE_NOT_FOUND,
            });
        }

        const enrollment = await Enrollment.findOne({
            student: req.userId,
            course: courseId,
            paymentStatus: { $nin: ["UNPAID"] },
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        // Handle Capstone Submission
        if (isCapstone) {
            // Check if all modules are completed
            const completedQuizIds = enrollment.completedQuizzes.map((id) =>
                id.toString()
            );
            const completedTaskIds = enrollment.completedTasks.map((id) =>
                id.toString()
            );

            const sortedModules = [...(course.modules || [])].sort(
                (a, b) => (a.order || 0) - (b.order || 0)
            );

            const allModulesCompleted = sortedModules.every((module) =>
                isModuleCompleted(module, completedQuizIds, completedTaskIds)
            );

            if (!allModulesCompleted) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Complete all modules before submitting the capstone project",
                    code: ERROR_CODES.MODULE_LOCKED,
                });
            }

            // Check if capstone is already submitted
            const existingCapstone = await Submission.findOne({
                student: req.userId,
                course: courseId,
                type: "capstone",
            });

            if (existingCapstone) {
                return res.status(403).json({
                    success: false,
                    message: "You have already submitted the capstone project",
                    code: ERROR_CODES.ALREADY_SUBMITTED,
                });
            }

            // Create capstone submission
            const submission = await Submission.create({
                enrollment: enrollment._id,
                student: req.userId,
                course: courseId,
                type: "capstone",
                githubLink,
                liveLink: liveLink || null,
                status: "submitted",
            });

            // Mark capstone as completed in course (for this student's enrollment tracking)
            // Update user stats (no XP for assignments)
            await Student.findByIdAndUpdate(req.userId, {
                $inc: { assignmentsCompleted: 1 },
            });

            // Update leaderboard with assignment completion (no XP)
            await updateLeaderboard(req.userId, courseId, 0, {
                assignmentsCompleted: 1,
            });

            return res.status(200).json({
                success: true,
                data: submission,
                message: "Capstone project submitted successfully!",
            });
        }

        // Handle Regular Assignment Submission
        const completedQuizIds = enrollment.completedQuizzes.map((id) =>
            id.toString()
        );
        const completedTaskIds = enrollment.completedTasks.map((id) =>
            id.toString()
        );

        // Sort modules by order
        const sortedModules = [...(course.modules || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
        );

        // Find the task's module index
        let moduleIndex = -1;
        let foundTask = null;
        for (let i = 0; i < sortedModules.length; i++) {
            const module = sortedModules[i];
            const task = module.tasks.find((t) => t._id.toString() === taskId);
            if (task) {
                moduleIndex = i;
                foundTask = task;
                break;
            }
        }

        if (!foundTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
                code: ERROR_CODES.RESOURCE_NOT_FOUND,
            });
        }

        // Check if module is locked (first module is always open)
        if (moduleIndex > 0) {
            const prevModule = sortedModules[moduleIndex - 1];
            const isModuleLocked = !isModuleCompleted(
                prevModule,
                completedQuizIds,
                completedTaskIds
            );
            if (isModuleLocked) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Cannot submit assignment. The module is locked. Complete the previous module first.",
                    code: ERROR_CODES.MODULE_LOCKED,
                });
            }
        }

        // Check if assignment is already submitted (no resubmission allowed)
        const existingSubmission = await Submission.findOne({
            student: req.userId,
            course: courseId,
            taskId: taskId,
            type: "assignment",
        });

        if (existingSubmission) {
            return res.status(403).json({
                success: false,
                message:
                    "You have already submitted this assignment. Resubmission is not allowed.",
                code: ERROR_CODES.ALREADY_SUBMITTED,
            });
        }

        // Create submission
        const submission = await Submission.create({
            enrollment: enrollment._id,
            student: req.userId,
            course: courseId,
            moduleId: moduleId,
            taskId: taskId,
            type: "assignment",
            githubLink,
            status: "submitted",
        });

        // Mark task as completed and award XP
        enrollment.completedTasks.push(taskId);

        // Recalculate progress
        const completedQuizzes = enrollment.completedQuizzes.map((id) =>
            id.toString()
        );
        const completedTasks = enrollment.completedTasks.map((id) =>
            id.toString()
        );
        enrollment.progressPercentage = calculateProgress(
            course,
            completedQuizzes,
            completedTasks
        );

        // Check if course is completed
        if (enrollment.progressPercentage === 100) {
            enrollment.isCompleted = true;
            enrollment.completionDate = new Date();
        }

        await enrollment.save();

        // Update user stats (no XP for assignments)
        await Student.findByIdAndUpdate(req.userId, {
            $inc: { assignmentsCompleted: 1 },
        });

        // Update leaderboard with assignment completion (no XP)
        await updateLeaderboard(req.userId, courseId, 0, {
            assignmentsCompleted: 1,
        });

        res.status(200).json({
            success: true,
            data: submission,
            message: "Assignment submitted successfully!",
        });
    } catch (error) {
        console.error("Submit assignment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit assignment",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
