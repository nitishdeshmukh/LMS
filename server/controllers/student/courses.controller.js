import { Course, Enrollment, Submission, Payment } from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * Helper function to calculate module completion
 * A module is complete when all its quizzes and tasks are done
 */
const isModuleCompleted = (module, completedQuizzes, completedTasks) => {
    const moduleQuizzes = module.quizzes || [];
    const moduleTasks = module.tasks || [];

    const moduleQuizIds = moduleQuizzes.map((q) => q._id.toString());
    const moduleTaskIds = moduleTasks.map((t) => t._id.toString());

    // If module has no quizzes and no tasks, it's considered complete (reading-only module)
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
 * GET /api/student/courses
 * Get enrolled courses
 */
export const getMyCourses = async (req, res) => {
    try {
        // Find all enrollments for this student that have some payment
        const enrollments = await Enrollment.find({
            student: req.userId,
            paymentStatus: {
                $nin: ["UNPAID"], // Show all except UNPAID
            },
        })
            .populate(
                "course",
                "title slug thumbnail modules level stream tags totalDuration"
            )
            .sort({ updatedAt: -1 });

        const courses = enrollments
            .filter((enrollment) => enrollment.course) // Filter out enrollments with no course
            .map((enrollment) => {
                const course = enrollment.course;
                const modules = course.modules || [];
                const totalModules = modules.length;

                const completedQuizzes = (
                    enrollment.completedQuizzes || []
                ).map((id) => id.toString());
                const completedTasks = (enrollment.completedTasks || []).map(
                    (id) => id.toString()
                );

                const completedModulesCount = modules.filter((module) =>
                    isModuleCompleted(module, completedQuizzes, completedTasks)
                ).length;

                return {
                    id: course._id,
                    title: course.title,
                    slug: course.slug,
                    thumbnail: course.thumbnail,
                    level: course.level,
                    stream: course.stream,
                    tags: course.tags,
                    totalDuration: course.totalDuration,
                    progress: enrollment.progressPercentage || 0,
                    totalModules,
                    completedModules: completedModulesCount,
                    lastAccessed: enrollment.updatedAt,
                    isCompleted: enrollment.isCompleted || false,
                };
            });

        res.json({ success: true, data: courses });
    } catch (error) {
        console.error("Get courses error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * GET /api/student/courses/:slug
 * Get course details for learning
 */
export const getCourseDetails = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({ slug, isPublished: true });
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
            paymentStatus: {
                $nin: ["UNPAID"], // Allow access for any payment status except UNPAID
            },
        }).populate("partialPaymentDetails");

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        // Get assignment submissions for this course
        const submissions = await Submission.find({
            student: req.userId,
            course: course._id,
            type: "assignment",
        });

        // Get capstone submission if exists
        const capstoneSubmission = await Submission.findOne({
            student: req.userId,
            course: course._id,
            type: "capstone",
        });

        const completedQuizzes = (enrollment.completedQuizzes || []).map((id) =>
            id.toString()
        );
        const completedTasks = (enrollment.completedTasks || []).map((id) =>
            id.toString()
        );

        // Sort modules by order
        const sortedModules = [...(course.modules || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
        );

        // First, calculate completion status for all modules
        const moduleCompletionStatus = sortedModules.map((module) =>
            isModuleCompleted(module, completedQuizzes, completedTasks)
        );

        // Determine which modules are locked
        // A module is locked if ANY previous module is not completed
        const moduleLockStatus = sortedModules.map((_, index) => {
            if (index === 0) return false; // First module is never locked
            // Check if all previous modules are completed
            for (let i = 0; i < index; i++) {
                if (!moduleCompletionStatus[i]) {
                    return true; // Lock if any previous module is not completed
                }
            }
            return false;
        });

        // Build module response data
        const modules = sortedModules.map((module, index) => {
            const isLocked = moduleLockStatus[index];
            const moduleCompleted = moduleCompletionStatus[index];

            // Base module info (always sent)
            const baseInfo = {
                id: module._id,
                title: module.title,
                maxTimelineInDays: module.maxTimelineInDays,
                description: module.description,
                order: module.order,
                isLocked,
                isCompleted: moduleCompleted,
            };

            // For locked modules, only send basic info with counts
            if (isLocked) {
                return {
                    ...baseInfo,
                    quizzesCount: module.quizzes?.length || 0,
                    tasksCount: module.tasks?.length || 0,
                    textLinksCount: (module.textLinks || []).length,
                    videoLinksCount: (module.videoLinks || []).length,
                };
            }

            // For unlocked modules, send full details
            return {
                ...baseInfo,
                textLinks: module.textLinks || [],
                videoLinks: module.videoLinks || [],
                quizzes: (module.quizzes || []).map((quiz) => ({
                    id: quiz._id,
                    title: quiz.title,
                    questionsCount: quiz.questions?.length || 0,
                    isCompleted: completedQuizzes.includes(quiz._id.toString()),
                })),
                tasks: (module.tasks || []).map((task) => {
                    const submission = submissions.find(
                        (s) => s.taskId?.toString() === task._id.toString()
                    );
                    const isSubmitted = !!submission;
                    return {
                        id: task._id,
                        title: task.title,
                        description: task.description,
                        isCompleted: completedTasks.includes(
                            task._id.toString()
                        ),
                        isSubmitted,
                        status: isSubmitted ? "Submitted" : "Open",
                        githubLink: submission?.githubLink,
                        submissionStatus: submission?.status || "pending",
                        grade: submission?.grade,
                        feedback: submission?.feedback,
                    };
                }),
            };
        });

        // Check capstone status
        const allModulesCompleted = modules.every((m) => m.isCompleted);

        // Get capstone project (single object, not array)
        const capstone = course.capstoneProject
            ? {
                  title: course.capstoneProject.title,
                  description: course.capstoneProject.description,
                  isLocked: !allModulesCompleted,
                  isCompleted: course.capstoneProject.isCapstoneCompleted,
                  isSubmitted: !!capstoneSubmission,
                  githubLink: capstoneSubmission?.githubLink || null,
                  liveLink: capstoneSubmission?.liveLink || null,
                  submissionStatus: capstoneSubmission?.status || null,
                  grade: capstoneSubmission?.grade || null,
                  feedback: capstoneSubmission?.feedback || null,
              }
            : null;

        // Build payment info from partial payment details (for prefilling form)
        const bankDetails = enrollment.partialPaymentDetails
            ? {
                  accountHolderName: enrollment.partialPaymentDetails.accountHolderName,
                  bankName: enrollment.partialPaymentDetails.bankName,
                  ifscCode: enrollment.partialPaymentDetails.ifscCode,
                  accountNumber: enrollment.partialPaymentDetails.accountNumber,
              }
            : null;

        res.json({
            success: true,
            data: {
                id: course._id,
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnail: course.thumbnail,
                level: course.level,
                stream: course.stream,
                totalDuration: course.totalDuration,
                tags: course.tags,
                progress: enrollment.progressPercentage,
                modules,
                capstone,
                isCompleted: enrollment.isCompleted,
                // Payment related fields
                enrollmentId: enrollment._id,
                paymentStatus: enrollment.paymentStatus,
                courseAmount: enrollment.courseAmount || course.price || 500,
                amountPaid: enrollment.amountPaid || 0,
                amountRemaining: enrollment.amountRemaining || (enrollment.courseAmount || course.price || 500),
                bankDetails,
            },
        });
    } catch (error) {
        console.error("Get course details error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * GET /api/student/courses/:slug/modules
 * Get course modules
 */
export const getCourseModules = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({ slug, isPublished: true }).select(
            "title modules"
        );
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
            paymentStatus: {
                $nin: ["UNPAID"], // Allow access for any payment status except UNPAID
            },
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        const completedQuizzes = (enrollment.completedQuizzes || []).map((id) =>
            id.toString()
        );
        const completedTasks = (enrollment.completedTasks || []).map((id) =>
            id.toString()
        );

        // Sort modules by order
        const sortedModules = [...(course.modules || [])].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
        );

        const modules = sortedModules.map((module, index) => {
            const moduleCompleted = isModuleCompleted(
                module,
                completedQuizzes,
                completedTasks
            );

            // Check if module is locked
            let isLocked = false;
            if (index > 0) {
                const prevModule = sortedModules[index - 1];
                isLocked = !isModuleCompleted(
                    prevModule,
                    completedQuizzes,
                    completedTasks
                );
            }

            const completedQuizzesCount = module.quizzes.filter((q) =>
                completedQuizzes.includes(q._id.toString())
            ).length;
            const completedTasksCount = module.tasks.filter((t) =>
                completedTasks.includes(t._id.toString())
            ).length;

            return {
                id: module._id,
                title: module.title,
                maxTimelineInDays: module.maxTimelineInDays,
                description: module.description,
                textLinks: module.textLinks || [],
                videoLinks: module.videoLinks || [],
                isLocked,
                isCompleted: moduleCompleted,
                order: module.order,
                quizzesCount: module.quizzes.length,
                tasksCount: module.tasks.length,
                completedQuizzes: completedQuizzesCount,
                completedTasks: completedTasksCount,
                quizzes: module.quizzes.map((quiz) => ({
                    id: quiz._id,
                    title: quiz.title,
                    questionsCount: quiz.questions.length,
                    isCompleted: completedQuizzes.includes(quiz._id.toString()),
                })),
                tasks: module.tasks.map((task) => ({
                    id: task._id,
                    title: task.title,
                    description: task.description,
                    isCompleted: completedTasks.includes(task._id.toString()),
                })),
            };
        });

        res.json({
            success: true,
            data: {
                courseTitle: course.title,
                modules,
            },
        });
    } catch (error) {
        console.error("Get course modules error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch course modules",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
