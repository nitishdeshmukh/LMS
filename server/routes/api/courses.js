// routes/admin/courseManagement.routes.js
import express from "express";
import { courseController } from "../../controllers/admin/index.js";

const router = express.Router();

// GET /api/admin/courses - Get all courses
router.get("/", courseController.getAllCourses);

// GET /api/admin/courses/filter-options - Get filter options
router.get("/filter-options", courseController.getCourseFilterOptions);

// POST /api/admin/courses - Create new course
router.post("/", courseController.createCourse);

// PUT /api/admin/courses/:courseId - Update course
router.put("/:courseId", courseController.updateCourse);

// DELETE /api/admin/courses/:courseId - Delete course
router.delete("/:courseId", courseController.deleteCourse);

// PATCH /api/admin/courses/:courseId/status - Toggle publish status
router.patch("/:courseId/status", courseController.toggleCourseStatus);

export default router;
