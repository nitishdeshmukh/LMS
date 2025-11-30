import User from "../../models/User.js";
import Course from "../../models/Course.js";
import Enrollment from "../../models/Enrollment.js";
import Submission from "../../models/Submission.js";
import { submitAssignmentSchema } from "../../validation/student.zod.js";
import { updateLeaderboard } from "./leaderboard.controller.js";

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
