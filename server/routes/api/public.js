import express from "express";
import multer from "multer";
import {
    courseListingController,
    enrollmentController,
} from "../../controllers/public/index.js";
import { StudentEnrollmentValidation } from "../../validation/index.js";
import { isAuthenticated } from "../../middlewares/isAuthenticated.js";

const router = express.Router();

// Use memory storage for R2 uploads
const uploadMemory = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        // Allow only image files for payment screenshots
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
    },
}).single("screenshot");

const uploadPaymentScreenshot = (req, res, next) => {
    uploadMemory(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed",
            });
        }
        next();
    });
};

router.post(
    "/enroll",
    isAuthenticated,
    uploadPaymentScreenshot,
    StudentEnrollmentValidation.validateEnrollment,
    enrollmentController.createEnrollmentWithPayment
);
router.get("/get/all/courses", courseListingController.getAllCourses);
router.get(
    "/get/course/deatils/:slug",
    courseListingController.getCourseDetails
);

export default router;
