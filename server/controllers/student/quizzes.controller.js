import { submitQuizSchema } from "../../validation/student.zod.js";
import { updateLeaderboard } from "./leaderboard.controller.js";
import { Student, Course, Enrollment, Submission } from "../../models/index.js";
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
 * GET /api/student/quizzes
 * Get all courses with quiz progress
 */
export const getQuizzesByCourse = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.userId,
            paymentStatus: { $nin: ["UNPAID"] },
        }).populate("course", "title slug thumbnail modules");

        const coursesWithQuizzes = enrollments.map((enrollment) => {
            const course = enrollment.course;
            let totalQuizzes = 0;
            let completedQuizzes = 0;

            const completedQuizIds = enrollment.completedQuizzes.map((id) =>
                id.toString()
            );

            course.modules.forEach((module) => {
                totalQuizzes += module.quizzes.length;
                completedQuizzes += module.quizzes.filter((q) =>
                    completedQuizIds.includes(q._id.toString())
                ).length;
            });

            return {
                id: course._id,
                title: course.title,
                slug: course.slug,
                thumbnail: course.thumbnail,
                totalQuizzes,
                completedQuizzes,
                progress:
                    totalQuizzes > 0
                        ? Math.round((completedQuizzes / totalQuizzes) * 100)
                        : 0,
            };
        });

        res.status(200).json({ success: true, data: coursesWithQuizzes });
    } catch (error) {
        console.error("Get quizzes by course error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch quizzes",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
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
 * GET /api/student/courses/:slug/quizzes
 * Get quizzes for a specific course
 */
export const getCourseQuizzes = async (req, res) => {
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

        // Get quiz submissions
        const submissions = await Submission.find({
            student: req.userId,
            course: course._id,
            type: "quiz",
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

        const quizzes = [];
        sortedModules.forEach((module, moduleIndex) => {
            // First module is always open, others depend on previous module completion
            const isModuleLocked =
                moduleIndex > 0 && !moduleCompletionStatus[moduleIndex - 1];

            module.quizzes.forEach((quiz) => {
                const submission = submissions.find(
                    (s) => s.quizId?.toString() === quiz._id.toString()
                );
                const isSubmitted = !!submission;

                // Determine quiz status: Locked, Open, or Submitted
                let status;
                if (isModuleLocked) {
                    status = "Locked";
                } else if (isSubmitted) {
                    status = "Submitted";
                } else {
                    status = "Open";
                }

                quizzes.push({
                    id: quiz._id,
                    moduleId: module._id,
                    moduleTitle: module.title,
                    title: quiz.title,
                    questionsCount: quiz.questions.length,
                    isCompleted: completedQuizIds.includes(quiz._id.toString()),
                    status,
                    isModuleLocked,
                    score: submission
                        ? `${submission.quizScore}/${submission.totalQuestions}`
                        : null,
                    submissionDetails: submission
                        ? {
                              quizScore: submission.quizScore,
                              totalQuestions: submission.totalQuestions,
                              percentage: Math.round(
                                  (submission.quizScore /
                                      submission.totalQuestions) *
                                      100
                              ),
                          }
                        : null,
                });
            });
        });

        res.status(200).json({
            success: true,
            data: {
                courseId: course._id,
                courseTitle: course.title,
                quizzes,
            },
        });
    } catch (error) {
        console.error("Get course quizzes error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch course quizzes",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * GET /api/student/courses/:slug/quizzes/:quizId
 * Get quiz questions
 */
export const getQuizQuestions = async (req, res) => {
    try {
        const { slug, quizId } = req.params;

        const course = await Course.findOne({ slug });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                code: ERROR_CODES.COURSE_NOT_FOUND,
            });
        }

        // Check enrollment
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

        // Find the quiz and its module
        let quiz = null;
        let moduleTitle = "";
        let moduleIndex = -1;
        let foundModule = null;
        for (let i = 0; i < sortedModules.length; i++) {
            const module = sortedModules[i];
            const foundQuiz = module.quizzes.find(
                (q) => q._id.toString() === quizId
            );
            if (foundQuiz) {
                quiz = foundQuiz;
                moduleTitle = module.title;
                moduleIndex = i;
                foundModule = module;
                break;
            }
        }

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
                code: ERROR_CODES.RESOURCE_NOT_FOUND,
            });
        }

        // Check if module is locked (first module is always open)
        let isModuleLocked = false;
        if (moduleIndex > 0) {
            const prevModule = sortedModules[moduleIndex - 1];
            isModuleLocked = !isModuleCompleted(
                prevModule,
                completedQuizIds,
                completedTaskIds
            );
        }

        if (isModuleLocked) {
            return res.status(403).json({
                success: false,
                message:
                    "This quiz is locked. Complete the previous module first.",
                code: ERROR_CODES.MODULE_LOCKED,
            });
        }

        // Check if quiz is already submitted
        const submission = await Submission.findOne({
            student: req.userId,
            course: course._id,
            quizId: quizId,
            type: "quiz",
        });

        const isSubmitted = !!submission;

        // Return questions (without correct answers for open quiz, with results for submitted)
        const questions = quiz.questions.map((q) => {
            const baseQuestion = {
                id: q._id,
                question: q.questionText,
                options: q.options,
            };

            // If submitted, include correct answer for review
            if (isSubmitted) {
                baseQuestion.correctAnswer = q.correctAnswer;
            }

            return baseQuestion;
        });

        res.status(200).json({
            success: true,
            data: {
                title: quiz.title,
                moduleTitle,
                questions,
                totalQuestions: questions.length,
                status: isSubmitted ? "Submitted" : "Open",
                isSubmitted,
                submissionDetails: submission
                    ? {
                          quizScore: submission.quizScore,
                          totalQuestions: submission.totalQuestions,
                          percentage: Math.round(
                              (submission.quizScore /
                                  submission.totalQuestions) *
                                  100
                          ),
                      }
                    : null,
            },
        });
    } catch (error) {
        console.error("Get quiz questions error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch quiz questions",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * POST /api/student/quizzes/submit
 * Submit quiz answers
 */
export const submitQuiz = async (req, res) => {
    try {
        const validation = submitQuizSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const { courseId, moduleId, quizId, answers, answerTimes = {} } = validation.data;

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

        // Find quiz and its module index
        let quiz = null;
        let moduleIndex = -1;
        for (let i = 0; i < sortedModules.length; i++) {
            const module = sortedModules[i];
            const foundQuiz = module.quizzes.find(
                (q) => q._id.toString() === quizId
            );
            if (foundQuiz) {
                quiz = foundQuiz;
                moduleIndex = i;
                break;
            }
        }

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
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
                        "Cannot submit quiz. The module is locked. Complete the previous module first.",
                    code: ERROR_CODES.MODULE_LOCKED,
                });
            }
        }

        // Check if quiz is already submitted (no retakes allowed)
        const existingSubmission = await Submission.findOne({
            student: req.userId,
            course: courseId,
            quizId: quizId,
            type: "quiz",
        });

        if (existingSubmission) {
            return res.status(403).json({
                success: false,
                message:
                    "You have already submitted this quiz. Retakes are not allowed.",
                code: ERROR_CODES.ALREADY_SUBMITTED,
            });
        }

        // Helper function to calculate XP based on time
        // Max XP: 100 (instant answer), Min XP: 40 (after 60 seconds)
        // Decreases by 1 XP per second for the first 60 seconds
        const calculateTimeBasedXP = (timeInSeconds) => {
            const MAX_XP = 100;
            const MIN_XP = 40;
            const DECAY_DURATION = 60; // seconds
            
            if (timeInSeconds <= 0) return MAX_XP;
            if (timeInSeconds >= DECAY_DURATION) return MIN_XP;
            
            // Linear decay: 100 - (time * 1) but not below 40
            return Math.max(MIN_XP, MAX_XP - Math.floor(timeInSeconds));
        };

        // Calculate score and XP
        let score = 0;
        let totalXP = 0;
        const results = [];
        quiz.questions.forEach((question) => {
            const questionId = question._id.toString();
            const userAnswer = answers[questionId];
            const isCorrect = userAnswer === question.correctAnswer;
            
            if (isCorrect) {
                score++;
                // Calculate XP based on answer time (only for correct answers)
                const answerTime = answerTimes[questionId] || 60; // Default to 60s if no time recorded
                const questionXP = calculateTimeBasedXP(answerTime);
                totalXP += questionXP;
            }
            
            results.push({
                questionId: question._id,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
            });
        });

        // Create submission
        const submission = await Submission.create({
            enrollment: enrollment._id,
            student: req.userId,
            course: courseId,
            moduleId: moduleId,
            quizId: quizId,
            type: "quiz",
            quizScore: score,
            totalQuestions: quiz.questions.length,
            status: "graded",
        });

        // Mark quiz as completed and award XP
        enrollment.completedQuizzes.push(quizId);

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

        // Update user stats with time-based XP
        await Student.findByIdAndUpdate(req.userId, {
            $inc: { xp: totalXP, quizzesCompleted: 1 },
        });

        // Update leaderboard with XP and quiz completion
        await updateLeaderboard(req.userId, courseId, totalXP, {
            quizzesCompleted: 1,
        });

        res.status(200).json({
            success: true,
            data: {
                score,
                totalQuestions: quiz.questions.length,
                percentage: Math.round((score / quiz.questions.length) * 100),
                results,
            },
            message: `Quiz submitted! You scored ${score}/${quiz.questions.length}`,
        });
    } catch (error) {
        console.error("Submit quiz error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit quiz",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
