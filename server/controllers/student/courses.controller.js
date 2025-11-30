import Course from "../../models/Course.js";
import Enrollment from "../../models/Enrollment.js";

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
      .populate("course", "title slug thumbnail modules")
      .sort({ updatedAt: -1 });

    const courses = enrollments.map((enrollment) => {
      const course = enrollment.course;
      const totalModules = course.modules.length;
      const completedModules = course.modules.filter((module) => {
        const moduleLessons = module.lessons.map((l) => l._id.toString());
        return moduleLessons.every((lessonId) =>
          enrollment.completedLessons.includes(lessonId)
        );
      }).length;

      return {
        id: course._id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        progress: enrollment.progressPercentage,
        totalModules,
        completedModules,
        lastAccessed: enrollment.updatedAt,
        isCompleted: enrollment.isCompleted,
      };
    });

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(404).json({ success: false, message: "Course not found" });
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
      });
    }

    // Calculate module completion status
    const modules = course.modules.map((module, index) => {
      const moduleLessons = module.lessons.map((l) => l._id.toString());
      const completedLessonsInModule = moduleLessons.filter((lessonId) =>
        enrollment.completedLessons.includes(lessonId)
      );

      const isCompleted = completedLessonsInModule.length === moduleLessons.length;

      // Check if module is locked (previous module not completed)
      let isLocked = false;
      if (index > 0) {
        const prevModule = course.modules[index - 1];
        const prevModuleLessons = prevModule.lessons.map((l) => l._id.toString());
        const prevCompleted = prevModuleLessons.every((lessonId) =>
          enrollment.completedLessons.includes(lessonId)
        );
        isLocked = !prevCompleted;
      }

      return {
        id: module._id,
        title: module.title,
        description: module.description,
        isLocked,
        isCompleted,
        lessons: module.lessons.map((lesson) => ({
          id: lesson._id,
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration,
          completed: enrollment.completedLessons.includes(lesson._id.toString()),
        })),
        tasks: module.tasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
        })),
        quizzes: module.quizzes.map((quiz) => ({
          id: quiz._id,
          title: quiz.title,
          questionsCount: quiz.questions.length,
        })),
      };
    });

    // Check capstone status
    const allModulesCompleted = modules.every((m) => m.isCompleted);

    res.json({
      success: true,
      data: {
        id: course._id,
        title: course.title,
        slug: course.slug,
        progress: enrollment.progressPercentage,
        modules,
        capstone: {
          ...course.capstoneProjects[0]?.toObject(),
          isLocked: !allModulesCompleted,
        },
        isCompleted: enrollment.isCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(404).json({ success: false, message: "Course not found" });
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
      });
    }

    const modules = course.modules.map((module, index) => {
      const moduleLessons = module.lessons.map((l) => l._id.toString());
      const completedLessonsInModule = moduleLessons.filter((lessonId) =>
        enrollment.completedLessons.includes(lessonId)
      );

      const isCompleted = completedLessonsInModule.length === moduleLessons.length;

      // Check if module is locked
      let isLocked = false;
      if (index > 0) {
        const prevModule = course.modules[index - 1];
        const prevModuleLessons = prevModule.lessons.map((l) => l._id.toString());
        isLocked = !prevModuleLessons.every((lessonId) =>
          enrollment.completedLessons.includes(lessonId)
        );
      }

      return {
        id: module._id,
        title: module.title,
        description: module.description,
        isLocked,
        isCompleted,
        lessonsCount: module.lessons.length,
        completedLessons: completedLessonsInModule.length,
        lessons: module.lessons.map((lesson) => ({
          id: lesson._id,
          title: lesson.title,
          type: lesson.type,
          duration: lesson.duration,
          completed: enrollment.completedLessons.includes(lesson._id.toString()),
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
    res.status(500).json({ success: false, message: error.message });
  }
};
