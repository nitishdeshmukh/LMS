import express from "express";
import { dashboardController } from "../../controllers/index.js";

const router = express.Router();

router.get("/stats", dashboardController.getDashboardCardStats);
router.get(
    "/enrollments/by/course",
    dashboardController.getTotalEnrolledStudentInEveryActiveCourse
);
router.get("/colleges", dashboardController.getCollegesList);
router.get("/courses", dashboardController.getCoursesList);
router.get("/enrollments", dashboardController.getAllEnrolledStudents);
router.get("/student/info/:id", dashboardController.getStudentInfoById);

export default router;
