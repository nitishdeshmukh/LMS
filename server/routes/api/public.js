import express from "express";
import {
    courseListingController,
    enrollmentController,
} from "../../controllers/public/index.js";
import { StudentEnrollmentValidation } from "../../validation/index.js";

const router = express.Router();

// router.post(
//     "/enroll",
//     StudentEnrollmentValidation.validateEnrollment,
//     enrollmentController.createEnrollment
// );
router.get("/get/all/courses", courseListingController.getAllCourses);
router.get("/get/course/deatils/:slug", courseListingController.getCourseDetails);

export default router;
