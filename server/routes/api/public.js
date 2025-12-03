import express from "express";
import {
    courseListingController,
    enrollmentController,
} from "../../controllers/public/index.js";
import { StudentEnrollmentValidation } from "../../validation/index.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = express.Router();

router.post(
    "/enroll",
    isAuthenticated,
    StudentEnrollmentValidation.validateEnrollment,
    enrollmentController.createEnrollmentWithPayment
);
router.get("/get/all/courses", courseListingController.getAllCourses);
router.get(
    "/get/course/deatils/:slug",
    courseListingController.getCourseDetails
);

export default router;
