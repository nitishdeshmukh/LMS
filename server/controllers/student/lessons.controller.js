import User from "../../models/User.js";
import Course from "../../models/Course.js";
import Enrollment from "../../models/Enrollment.js";
import { markLessonCompleteSchema } from "../../validation/student.zod.js";
import { updateLeaderboard } from "./leaderboard.controller.js";

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
