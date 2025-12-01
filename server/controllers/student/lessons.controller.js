import { Student, Course, Enrollment } from "../../models/index.js";
import { z } from "zod";

// Validation schemas for module progress
const markModuleAccessedSchema = z.object({
    courseId: z.string().min(1, "Course ID is required"),
    moduleId: z.string().min(1, "Module ID is required"),
});

/**
 * POST /api/student/modules/access
 * Mark module as last accessed (for tracking progress through text/video content)
 */
export const markModuleAccessed = async (req, res) => {
    try {
        const validation = markModuleAccessedSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.errors,
            });
        }

        const { courseId, moduleId } = validation.data;

        const enrollment = await Enrollment.findOne({
            student: req.userId,
            course: courseId,
            paymentStatus: { $in: ["PARTIAL_PAID", "FULLY_PAYMENT_VERIFICATION_PENDING", "FULLY_PAID"] },
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        // Update last accessed module
        enrollment.lastAccessedModule = moduleId;
        await enrollment.save();

        res.json({
            success: true,
            data: {
                lastAccessedModule: moduleId,
            },
            message: "Module access recorded",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/student/courses/:slug/progress
 * Get detailed progress for a course
 */
export const getCourseProgress = async (req, res) => {
    try {
        const { slug } = req.params;

        const course = await Course.findOne({ slug });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const enrollment = await Enrollment.findOne({
            student: req.userId,
            course: course._id,
            paymentStatus: { $in: ["PARTIAL_PAID", "FULLY_PAYMENT_VERIFICATION_PENDING", "FULLY_PAID"] },
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        // Calculate totals
        const totalQuizzes = course.modules.reduce(
            (acc, module) => acc + (module.quizzes?.length || 0),
            0
        );
        const totalTasks = course.modules.reduce(
            (acc, module) => acc + (module.tasks?.length || 0),
            0
        );

        // Get progress per module
        const moduleProgress = course.modules.map((module) => {
            const moduleQuizIds =
                module.quizzes?.map((q) => q._id.toString()) || [];
            const moduleTaskIds =
                module.tasks?.map((t) => t._id.toString()) || [];

            const completedModuleQuizzes = enrollment.completedQuizzes.filter(
                (id) => moduleQuizIds.includes(id.toString())
            ).length;
            const completedModuleTasks = enrollment.completedTasks.filter(
                (id) => moduleTaskIds.includes(id.toString())
            ).length;

            const totalModuleItems =
                moduleQuizIds.length + moduleTaskIds.length;
            const completedModuleItems =
                completedModuleQuizzes + completedModuleTasks;

            return {
                moduleId: module._id,
                title: module.title,
                totalQuizzes: moduleQuizIds.length,
                completedQuizzes: completedModuleQuizzes,
                totalTasks: moduleTaskIds.length,
                completedTasks: completedModuleTasks,
                progressPercentage:
                    totalModuleItems > 0
                        ? Math.round(
                              (completedModuleItems / totalModuleItems) * 100
                          )
                        : 100,
            };
        });

        res.json({
            success: true,
            data: {
                courseId: course._id,
                courseTitle: course.title,
                totalQuizzes,
                totalTasks,
                completedQuizzes: enrollment.completedQuizzes.length,
                completedTasks: enrollment.completedTasks.length,
                progressPercentage: enrollment.progressPercentage,
                isCompleted: enrollment.isCompleted,
                lastAccessedModule: enrollment.lastAccessedModule,
                moduleProgress,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
