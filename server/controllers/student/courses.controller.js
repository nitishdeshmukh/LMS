import { Course, Enrollment } from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * Helper function to calculate module completion
 * A module is complete when all its quizzes and tasks are done
 */
const isModuleCompleted = (module, completedQuizzes, completedTasks) => {
    const moduleQuizIds = module.quizzes.map((q) => q._id.toString());
    const moduleTaskIds = module.tasks.map((t) => t._id.toString());

    const allQuizzesCompleted = moduleQuizIds.every((id) =>
        completedQuizzes.includes(id)
    );
    const allTasksCompleted = moduleTaskIds.every((id) =>
        completedTasks.includes(id)
    );

    // If module has no quizzes and no tasks, it's considered complete (reading module)
    if (moduleQuizIds.length === 0 && moduleTaskIds.length === 0) {
        return true;
    }

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
        const enrollments = await Enrollment.find({
            student: req.userId,
            paymentStatus: "paid",
        })
            .populate(
                "course",
                "title slug thumbnail modules level stream tags totalDuration"
            )
            .sort({ updatedAt: -1 });

        const courses = enrollments.map((enrollment) => {
            const course = enrollment.course;
            const totalModules = course.modules.length;

            const completedQuizzes = enrollment.completedQuizzes.map((id) =>
                id.toString()
            );
            const completedTasks = enrollment.completedTasks.map((id) =>
                id.toString()
            );

            const completedModulesCount = course.modules.filter((module) =>
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
                progress: enrollment.progressPercentage,
                totalModules,
                completedModules: completedModulesCount,
                lastAccessed: enrollment.updatedAt,
                isCompleted: enrollment.isCompleted,
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
            paymentStatus: "paid",
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        const completedQuizzes = enrollment.completedQuizzes.map((id) =>
            id.toString()
        );
        const completedTasks = enrollment.completedTasks.map((id) =>
            id.toString()
        );

        // Sort modules by order
        const sortedModules = [...course.modules].sort(
            (a, b) => (a.order || 0) - (b.order || 0)
        );

        // Calculate module completion status
        const modules = sortedModules.map((module, index) => {
            const moduleCompleted = isModuleCompleted(
                module,
                completedQuizzes,
                completedTasks
            );

            // Check if module is locked (previous module not completed)
            let isLocked = false;
            if (index > 0) {
                const prevModule = sortedModules[index - 1];
                const prevCompleted = isModuleCompleted(
                    prevModule,
                    completedQuizzes,
                    completedTasks
                );
                isLocked = !prevCompleted;
            }

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

        // Check capstone status
        const allModulesCompleted = modules.every((m) => m.isCompleted);

        // Get capstone projects
        const capstoneProjects = course.capstoneProjects?.map((cp) => ({
            id: cp._id,
            title: cp.title,
            description: cp.description,
            isLocked: !allModulesCompleted,
        }));

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
                capstone: capstoneProjects?.[0] || null,
                capstoneProjects,
                isCompleted: enrollment.isCompleted,
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
            paymentStatus: "paid",
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        const completedQuizzes = enrollment.completedQuizzes.map((id) =>
            id.toString()
        );
        const completedTasks = enrollment.completedTasks.map((id) =>
            id.toString()
        );

        // Sort modules by order
        const sortedModules = [...course.modules].sort(
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
