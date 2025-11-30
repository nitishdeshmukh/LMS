import User from "../../models/User.js";
import Enrollment from "../../models/Enrollment.js";
import Certificate from "../../models/Certificate.js";
import Submission from "../../models/Submission.js";

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
