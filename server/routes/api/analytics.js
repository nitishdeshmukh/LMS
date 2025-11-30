import express from "express";
import { analyticsController } from "../../controllers/admin/index.js";

const router = express.Router();

router.get("/dashboard-stats", analyticsController.getDashboardStats);

router.get("/performance-radar", analyticsController.getPerformanceRadar);

router.get("/student-growth", analyticsController.getStudentGrowth);
router.get(
    "/enrollment-completion-revenue",
    analyticsController.getEnrollmentCompletionRevenueTrend
);
router.get(
    "/course-completion-status",
    analyticsController.getCourseCompletionStatus
);
router.get(
    "/enrollment-by-category",
    analyticsController.getEnrollmentByCategory
);
router.get("/monthly-enrollments", analyticsController.getMonthlyEnrollments);

router.get(
    "/course-completions-by-month",
    analyticsController.getCourseCompletionsByMonth
);
router.get(
    "/assessment-performance",
    analyticsController.getAssessmentPerformance
);
router.get("/user-engagement", analyticsController.getUserEngagement);
router.get(
    "/top-performing-courses",
    analyticsController.getTopPerformingCourses
);

router.get("/top-leaderboard", analyticsController.getTopLeaderboard);
router.get(
    "/recent-certifications",
    analyticsController.getRecentCertifications
);
router.get("/system-health", analyticsController.getSystemHealth);

export default router;
