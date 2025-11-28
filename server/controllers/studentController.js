import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Certificate from "../models/Certificate.js";
import Submission from "../models/Submission.js";
import Leaderboard from "../models/Leaderboard.js";
import Referral from "../models/Referral.js";
import SupportQuery from "../models/SupportQuery.js";

import {
  updateProfileSchema,
  updateAvatarSchema,
  updatePrivacySchema,
  changePasswordSchema,
  createSupportQuerySchema,
  applyReferralCodeSchema,
  submitQuizSchema,
  submitAssignmentSchema,
  markLessonCompleteSchema,
  leaderboardQuerySchema,
  coursesQuerySchema,
} from "../validation/student.zod.js";

// ============================================
// DASHBOARD
// ============================================

/**
 * GET /api/student/dashboard
 * Get student dashboard data
 */
export const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user with gamification stats
    const user = await User.findById(userId).select(
      "name xp streak hoursLearned quizzesCompleted assignmentsCompleted"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get enrolled courses count
    const enrolledCourses = await Enrollment.countDocuments({ student: userId });

    // Get certificates count
    const certificatesCount = await Certificate.countDocuments({ student: userId });

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

    // Get upcoming deadlines (assignments/quizzes due)
    const enrollments = await Enrollment.find({
      student: userId,
      isCompleted: false,
    }).populate("course", "modules");

    const upcomingDeadlines = [];
    enrollments.forEach((enrollment) => {
      enrollment.course.modules.forEach((module) => {
        module.tasks.forEach((task) => {
          if (task.dueInDays) {
            upcomingDeadlines.push({
              id: task._id,
              title: task.title,
              type: "Assignment",
              courseName: enrollment.course.title,
              dueInDays: task.dueInDays,
            });
          }
        });
      });
    });

    // Sort by due date
    upcomingDeadlines.sort((a, b) => a.dueInDays - b.dueInDays);

    res.json({
      success: true,
      data: {
        stats: {
          enrolledCourses,
          hoursLearned: user.hoursLearned || 0,
          avgQuizScore,
          certificates: certificatesCount,
        },
        xp: user.xp || 0,
        activeCourse: activeEnrollment
          ? {
              id: activeEnrollment.course._id,
              title: activeEnrollment.course.title,
              slug: activeEnrollment.course.slug,
              progress: activeEnrollment.progressPercentage,
              nextLesson: getNextLesson(activeEnrollment),
            }
          : null,
        upcomingDeadlines: upcomingDeadlines.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get next lesson
const getNextLesson = (enrollment) => {
  const course = enrollment.course;
  const completedLessons = enrollment.completedLessons || [];

  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (!completedLessons.includes(lesson._id.toString())) {
        return lesson.title;
      }
    }
  }
  return "Course completed!";
};

// ============================================
// PROFILE
// ============================================

/**
 * GET /api/student/profile
 * Get student profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -lmsPassword -resetPasswordToken -resetPasswordExpire -googleId -githubId"
    );

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/student/profile
 * Update student profile
 */
export const updateProfile = async (req, res) => {
  try {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: validation.data },
      { new: true, runValidators: true }
    ).select("-password -lmsPassword -resetPasswordToken -resetPasswordExpire");

    res.json({ success: true, data: user, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/student/profile/avatar
 * Update student avatar
 */
export const updateAvatar = async (req, res) => {
  try {
    const validation = updateAvatarSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: validation.data.avatar },
      { new: true }
    ).select("avatar");

    res.json({ success: true, data: user, message: "Avatar updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// SETTINGS
// ============================================

/**
 * PUT /api/student/settings/privacy
 * Update privacy settings
 */
export const updatePrivacy = async (req, res) => {
  try {
    const validation = updatePrivacySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { isProfileLocked: validation.data.isProfileLocked },
      { new: true }
    ).select("isProfileLocked");

    res.json({ success: true, data: user, message: "Privacy settings updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/student/settings/password
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const user = await User.findById(req.userId).select("+password");

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password change not available for OAuth users",
      });
    }

    const isMatch = await user.matchPassword(validation.data.currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = validation.data.newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// COURSES
// ============================================

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

// ============================================
// QUIZZES
// ============================================

/**
 * GET /api/student/quizzes
 * Get all courses with quiz progress
 */
export const getQuizzesByCourse = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.userId,
      paymentStatus: "paid",
    }).populate("course", "title slug thumbnail modules");

    const coursesWithQuizzes = enrollments.map((enrollment) => {
      const course = enrollment.course;
      let totalQuizzes = 0;
      let completedQuizzes = 0;

      course.modules.forEach((module) => {
        totalQuizzes += module.quizzes.length;
      });

      // Count completed quizzes from submissions
      // This would need to be fetched from Submission model
      // For now, returning basic data

      return {
        id: course._id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        totalQuizzes,
        completedQuizzes,
        progress: totalQuizzes > 0 ? Math.round((completedQuizzes / totalQuizzes) * 100) : 0,
      };
    });

    res.json({ success: true, data: coursesWithQuizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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

    // Get quiz submissions
    const submissions = await Submission.find({
      student: req.userId,
      course: course._id,
      type: "quiz",
    });

    const quizzes = [];
    course.modules.forEach((module) => {
      module.quizzes.forEach((quiz) => {
        const submission = submissions.find(
          (s) => s.lessonId.toString() === quiz._id.toString()
        );

        quizzes.push({
          id: quiz._id,
          moduleId: module._id,
          moduleTitle: module.title,
          title: quiz.title,
          questionsCount: quiz.questions.length,
          isCompleted: !!submission,
          score: submission ? `${submission.quizScore}/${submission.totalQuestions}` : null,
        });
      });
    });

    res.json({
      success: true,
      data: {
        courseTitle: course.title,
        quizzes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Check enrollment
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

    // Find the quiz
    let quiz = null;
    let moduleTitle = "";
    for (const module of course.modules) {
      const foundQuiz = module.quizzes.find((q) => q._id.toString() === quizId);
      if (foundQuiz) {
        quiz = foundQuiz;
        moduleTitle = module.title;
        break;
      }
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Return questions without correct answers
    const questions = quiz.questions.map((q) => ({
      id: q._id,
      question: q.questionText,
      options: q.options,
    }));

    res.json({
      success: true,
      data: {
        title: quiz.title,
        moduleTitle,
        questions,
        totalQuestions: questions.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
        errors: validation.error.errors,
      });
    }

    const { courseId, moduleId, quizId, answers } = validation.data;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      student: req.userId,
      course: courseId,
      paymentStatus: "paid",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Find quiz and calculate score
    let quiz = null;
    for (const module of course.modules) {
      const foundQuiz = module.quizzes.find((q) => q._id.toString() === quizId);
      if (foundQuiz) {
        quiz = foundQuiz;
        break;
      }
    }

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Calculate score
    let score = 0;
    const results = [];
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question._id.toString()];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      results.push({
        questionId: question._id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      });
    });

    // Create or update submission
    const submission = await Submission.findOneAndUpdate(
      {
        student: req.userId,
        course: courseId,
        lessonId: quizId,
        type: "quiz",
      },
      {
        enrollment: enrollment._id,
        student: req.userId,
        course: courseId,
        lessonId: quizId,
        type: "quiz",
        quizScore: score,
        totalQuestions: quiz.questions.length,
        status: "graded",
      },
      { upsert: true, new: true }
    );

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { xp: score * 10, quizzesCompleted: 1 },
    });

    // Update leaderboard
    await updateLeaderboard(req.userId, courseId, score * 10);

    res.json({
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ASSIGNMENTS
// ============================================

/**
 * GET /api/student/assignments
 * Get all courses with assignment progress
 */
export const getAssignmentsByCourse = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.userId,
      paymentStatus: "paid",
    }).populate("course", "title slug thumbnail modules");

    const coursesWithAssignments = enrollments.map((enrollment) => {
      const course = enrollment.course;
      let totalAssignments = 0;

      course.modules.forEach((module) => {
        totalAssignments += module.tasks.length;
      });

      return {
        id: course._id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail,
        totalAssignments,
        completedAssignments: 0, // Would need to fetch from submissions
        progress: 0,
      };
    });

    res.json({ success: true, data: coursesWithAssignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    // Get assignment submissions
    const submissions = await Submission.find({
      student: req.userId,
      course: course._id,
      type: "assignment",
    });

    const assignments = [];
    course.modules.forEach((module) => {
      module.tasks.forEach((task) => {
        const submission = submissions.find(
          (s) => s.lessonId.toString() === task._id.toString()
        );

        assignments.push({
          id: task._id,
          moduleId: module._id,
          moduleTitle: module.title,
          title: task.title,
          description: task.description,
          dueInDays: task.dueInDays,
          isSubmitted: !!submission,
          status: submission?.status || "pending",
          grade: submission?.grade,
          feedback: submission?.feedback,
          githubLink: submission?.githubLink,
        });
      });
    });

    res.json({
      success: true,
      data: {
        courseTitle: course.title,
        assignments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/student/assignments/submit
 * Submit assignment
 */
export const submitAssignment = async (req, res) => {
  try {
    const validation = submitAssignmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const { courseId, moduleId, taskId, githubLink, additionalNotes } = validation.data;

    const enrollment = await Enrollment.findOne({
      student: req.userId,
      course: courseId,
      paymentStatus: "paid",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Create or update submission
    const submission = await Submission.findOneAndUpdate(
      {
        student: req.userId,
        course: courseId,
        lessonId: taskId,
        type: "assignment",
      },
      {
        enrollment: enrollment._id,
        student: req.userId,
        course: courseId,
        lessonId: taskId,
        type: "assignment",
        githubLink,
        status: "submitted",
      },
      { upsert: true, new: true }
    );

    // Update user stats
    await User.findByIdAndUpdate(req.userId, {
      $inc: { xp: 50, assignmentsCompleted: 1 },
    });

    // Update leaderboard
    await updateLeaderboard(req.userId, courseId, 50);

    res.json({
      success: true,
      data: submission,
      message: "Assignment submitted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// LESSONS
// ============================================

/**
 * POST /api/student/lessons/complete
 * Mark lesson as complete
 */
export const markLessonComplete = async (req, res) => {
  try {
    const validation = markLessonCompleteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const { courseId, moduleId, lessonId } = validation.data;

    const enrollment = await Enrollment.findOne({
      student: req.userId,
      course: courseId,
      paymentStatus: "paid",
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Add lesson to completed lessons if not already there
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      enrollment.lastAccessedLesson = lessonId;

      // Recalculate progress
      const course = await Course.findById(courseId);
      const totalLessons = course.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
      );
      enrollment.progressPercentage = Math.round(
        (enrollment.completedLessons.length / totalLessons) * 100
      );

      // Check if course is completed
      if (enrollment.progressPercentage === 100) {
        enrollment.isCompleted = true;
        enrollment.completionDate = new Date();
      }

      await enrollment.save();

      // Update user XP and hours
      await User.findByIdAndUpdate(req.userId, {
        $inc: { xp: 20, hoursLearned: 0.5 },
      });

      // Update leaderboard
      await updateLeaderboard(req.userId, courseId, 20);
    }

    res.json({
      success: true,
      data: {
        progress: enrollment.progressPercentage,
        isCompleted: enrollment.isCompleted,
      },
      message: "Lesson marked as complete",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// CERTIFICATES
// ============================================

/**
 * GET /api/student/certificates
 * Get all student certificates
 */
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.userId })
      .populate("course", "title slug thumbnail")
      .sort({ issueDate: -1 });

    res.json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/student/certificates/:courseSlug
 * Get certificate for a specific course
 */
export const getCourseCertificate = async (req, res) => {
  try {
    const { courseSlug } = req.params;

    const course = await Course.findOne({ slug: courseSlug });
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const certificate = await Certificate.findOne({
      student: req.userId,
      course: course._id,
    }).populate("course", "title");

    if (!certificate) {
      // Check if eligible for certificate
      const enrollment = await Enrollment.findOne({
        student: req.userId,
        course: course._id,
        isCompleted: true,
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Complete the course to earn a certificate",
        });
      }

      return res.status(404).json({
        success: false,
        message: "Certificate not yet issued. Please contact support.",
      });
    }

    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// LEADERBOARD
// ============================================

/**
 * GET /api/student/leaderboard
 * Get leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const validation = leaderboardQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const { type, courseId, limit, page } = validation.data;
    const skip = (page - 1) * limit;

    const query = { type };
    if (type === "course" && courseId) {
      query.course = courseId;
    }

    // Get leaderboard entries
    const leaderboard = await Leaderboard.find(query)
      .populate({
        path: "student",
        select: "name collegeName courseName yearOfStudy avatar isProfileLocked linkedin github",
      })
      .sort({ xp: -1 })
      .skip(skip)
      .limit(limit);

    // Get current user's position
    const userEntry = await Leaderboard.findOne({
      student: req.userId,
      type,
      ...(type === "course" && courseId ? { course: courseId } : {}),
    }).populate("student", "name avatar");

    let userRank = null;
    if (userEntry) {
      const higherCount = await Leaderboard.countDocuments({
        type,
        ...(type === "course" && courseId ? { course: courseId } : {}),
        xp: { $gt: userEntry.xp },
      });
      userRank = higherCount + 1;
    }

    // Format response with privacy consideration
    const formattedLeaderboard = leaderboard.map((entry, index) => {
      const student = entry.student;
      const isLocked = student.isProfileLocked;

      return {
        rank: skip + index + 1,
        name: student.name,
        avatar: student.avatar,
        xp: entry.xp,
        streak: entry.streak,
        quizzesCompleted: entry.quizzesCompleted,
        hoursLearned: entry.hoursLearned,
        // Only show social links if profile is not locked
        ...(isLocked
          ? {}
          : {
              college: student.collegeName,
              linkedin: student.linkedin,
              github: student.github,
            }),
        isCurrentUser: entry.student._id.toString() === req.userId.toString(),
      };
    });

    const total = await Leaderboard.countDocuments(query);

    res.json({
      success: true,
      data: {
        leaderboard: formattedLeaderboard,
        userRank,
        userEntry: userEntry
          ? {
              xp: userEntry.xp,
              streak: userEntry.streak,
              rank: userRank,
            }
          : null,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to update leaderboard
const updateLeaderboard = async (userId, courseId, xpGained) => {
  try {
    // Update global leaderboard
    await Leaderboard.findOneAndUpdate(
      { student: userId, type: "global" },
      {
        $inc: { xp: xpGained },
        $set: { student: userId, type: "global" },
      },
      { upsert: true }
    );

    // Update course leaderboard
    if (courseId) {
      await Leaderboard.findOneAndUpdate(
        { student: userId, type: "course", course: courseId },
        {
          $inc: { xp: xpGained },
          $set: { student: userId, type: "course", course: courseId },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("Leaderboard update error:", error);
  }
};

// ============================================
// REFERRAL
// ============================================

/**
 * GET /api/student/referral
 * Get referral info
 */
export const getReferralInfo = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "myReferralCode referralCount isPremiumUnlocked"
    );

    const referrals = await Referral.find({ referrer: req.userId })
      .populate("referee", "name createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        referralCode: user.myReferralCode,
        referralCount: user.referralCount,
        isPremiumUnlocked: user.isPremiumUnlocked,
        referrals: referrals.map((r) => ({
          name: r.referee.name,
          joinedAt: r.referee.createdAt,
          credited: r.credited,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/student/referral/apply
 * Apply referral code
 */
export const applyReferralCode = async (req, res) => {
  try {
    const validation = applyReferralCodeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const { referralCode } = validation.data;
    const user = await User.findById(req.userId);

    // Check if user already used a referral code
    if (user.referredBy) {
      return res.status(400).json({
        success: false,
        message: "You have already used a referral code",
      });
    }

    // Find referrer
    const referrer = await User.findOne({ myReferralCode: referralCode });
    if (!referrer) {
      return res.status(404).json({
        success: false,
        message: "Invalid referral code",
      });
    }

    // Can't use own code
    if (referrer._id.toString() === req.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot use your own referral code",
      });
    }

    // Create referral record
    await Referral.create({
      referrer: referrer._id,
      referee: req.userId,
      referralCode,
    });

    // Update user
    user.referredBy = referralCode;
    await user.save();

    // Update referrer's count
    referrer.referralCount += 1;
    if (referrer.referralCount >= 3 && !referrer.isPremiumUnlocked) {
      referrer.isPremiumUnlocked = true;
    }
    await referrer.save();

    // Unlock benefits for referee
    user.isPremiumUnlocked = true;
    await user.save();

    res.json({
      success: true,
      message: "Referral code applied successfully! Premium benefits unlocked.",
      data: { isPremiumUnlocked: true },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// SUPPORT
// ============================================

/**
 * POST /api/student/support
 * Create support query
 */
export const createSupportQuery = async (req, res) => {
  try {
    const validation = createSupportQuerySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const query = await SupportQuery.create({
      student: req.userId,
      ...validation.data,
    });

    res.status(201).json({
      success: true,
      data: query,
      message: "Support query submitted successfully. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/student/support
 * Get student's support queries
 */
export const getSupportQueries = async (req, res) => {
  try {
    const queries = await SupportQuery.find({ student: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ success: true, data: queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// STREAK MANAGEMENT
// ============================================

/**
 * POST /api/student/streak/update
 * Update daily streak (called on login or activity)
 */
export const updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastStreak = user.lastStreakDate ? new Date(user.lastStreakDate) : null;
    if (lastStreak) {
      lastStreak.setHours(0, 0, 0, 0);
    }

    const oneDayMs = 24 * 60 * 60 * 1000;
    const daysDiff = lastStreak ? Math.floor((today - lastStreak) / oneDayMs) : null;

    if (daysDiff === null || daysDiff > 1) {
      // Reset streak
      user.streak = 1;
    } else if (daysDiff === 1) {
      // Continue streak
      user.streak += 1;
      // Bonus XP for streak milestones
      if (user.streak % 7 === 0) {
        user.xp += 100; // Weekly streak bonus
      }
    }
    // If daysDiff === 0, streak already counted today

    user.lastStreakDate = today;
    await user.save();

    res.json({
      success: true,
      data: { streak: user.streak },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
