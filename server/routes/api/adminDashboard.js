import express from "express";
import { adminDashboardController } from "../../controllers/admin/index.js";

const router = express.Router();

router.get("/stats", adminDashboardController.getDashboardCardStats);
router.get(
    "/enrollments/by/course",
    adminDashboardController.getTotalEnrolledStudentInEveryActiveCourse
);
router.get("/colleges", adminDashboardController.getCollegesList);
router.get("/courses", adminDashboardController.getCoursesList);
router.get("/enrollments", adminDashboardController.getAllEnrolledStudents);
router.get("/student/info/:id", adminDashboardController.getStudentInfoById);

export default router;
