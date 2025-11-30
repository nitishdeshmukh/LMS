import express from "express";
import { userController } from "../../controllers/public/index.js";
import { StudentEnrollmentValidation } from "../../validation/index.js";

const router = express.Router();

router.post(
    "/student-enrollment",
    StudentEnrollmentValidation.validateEnrollment,
    userController.createEnrollment
);

export default router;
