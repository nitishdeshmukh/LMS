import {
    Student,
    Certificate,
    Enrollment,
    Submission,
} from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * GET /api/student/dashboard
 * Get student dashboard data
 */
export const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        // Get user with gamification stats
        const student = await Student.findById(userId).select(
            "name xp streak hoursLearned quizzesCompleted assignmentsCompleted"
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
                code: ERROR_CODES.USER_NOT_FOUND,
            });
        }

        // Get enrolled courses count
        const enrolledCourses = await Enrollment.countDocuments({
            student: userId,
        });

        // Get certificates count
        const certificatesCount = await Certificate.countDocuments({
            student: userId,
        });

        // Get average quiz score
        const quizSubmissions = await Submission.find({
            student: userId,
            type: "quiz",
            status: "graded",
        }).select("quizScore totalQuestions");

        let avgQuizScore = 0;
        if (quizSubmissions.length > 0) {
            const totalScore = quizSubmissions.reduce((acc, sub) => {
                return acc + (sub.quizScore / sub.totalQuestions) * 100;
            }, 0);
            avgQuizScore = Math.round(totalScore / quizSubmissions.length);
        }

        // Get active course (most recently accessed)
        const activeEnrollment = await Enrollment.findOne({
            student: userId,
            isCompleted: false,
        })
            .sort({ updatedAt: -1 })
            .populate("course", "title slug modules");

        // Get pending tasks from enrolled courses
        const enrollments = await Enrollment.find({
            student: userId,
            isCompleted: false,
        }).populate("course", "title modules");

        const pendingTasks = [];
        enrollments.forEach((enrollment) => {
            const completedTaskIds = enrollment.completedTasks.map((id) =>
                id.toString()
            );
            enrollment.course.modules.forEach((module) => {
                module.tasks?.forEach((task) => {
                    if (!completedTaskIds.includes(task._id.toString())) {
                        pendingTasks.push({
                            id: task._id,
                            title: task.title,
                            type: "Assignment",
                            courseName: enrollment.course.title,
                            moduleTitle: module.title,
                            dueInDays: module.maxTimelineInDays,
                        });
                    }
                });
            });
        });

        res.json({
            success: true,
            data: {
                stats: {
                    enrolledCourses,
                    hoursLearned: student.hoursLearned || 0,
                    avgQuizScore,
                    certificates: certificatesCount,
                },
                xp: student.xp || 0,
                activeCourse: activeEnrollment
                    ? {
                          id: activeEnrollment.course._id,
                          title: activeEnrollment.course.title,
                          slug: activeEnrollment.course.slug,
                          progress: activeEnrollment.progressPercentage,
                          nextModule: getNextModule(activeEnrollment),
                      }
                    : null,
                pendingTasks: pendingTasks.slice(0, 5),
            },
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

// Helper function to get next module with incomplete items
const getNextModule = (enrollment) => {
    const course = enrollment.course;
    const completedQuizzes = enrollment.completedQuizzes || [];
    const completedTasks = enrollment.completedTasks || [];

    for (const module of course.modules) {
        // Check if module has any incomplete quizzes
        const hasIncompleteQuiz = module.quizzes?.some(
            (quiz) => !completedQuizzes.includes(quiz._id.toString())
        );
        // Check if module has any incomplete tasks
        const hasIncompleteTask = module.tasks?.some(
            (task) => !completedTasks.includes(task._id.toString())
        );

        if (hasIncompleteQuiz || hasIncompleteTask) {
            return module.title;
        }
    }
    return "Course completed!";
};
