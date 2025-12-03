import { Certificate, Course, Enrollment } from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * GET /api/student/certificates
 * Get all student certificates
 */
export const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ student: req.userId })
            .populate("course", "title slug thumbnail")
            .sort({ issueDate: -1 });

        res.status(200).json({ success: true, data: certificates });
    } catch (error) {
        console.error("Get certificates error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificates",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * GET /api/student/certificates/:courseSlug
 * Get certificate for a specific course
 */
export const getCourseCertificate = async (req, res) => {
    try {
        const { courseSlug } = req.params;

        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
                code: ERROR_CODES.COURSE_NOT_FOUND,
            });
        }

        // Check enrollment and payment status
        const enrollment = await Enrollment.findOne({
            student: req.userId,
            course: course._id,
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                message: "You are not enrolled in this course",
                code: ERROR_CODES.NOT_ENROLLED,
            });
        }

        // Check if payment is complete
        if (enrollment.paymentStatus !== "FULLY_PAID") {
            const statusMessages = {
                "UNPAID": "Please complete payment to access your certificate",
                "PARTIAL_PAYMENT_VERIFICATION_PENDING": "Your partial payment is being verified",
                "PARTIAL_PAID": "Please complete full payment to access your certificate",
                "FULLY_PAYMENT_VERIFICATION_PENDING": "Your payment is being verified. Certificate will be available once approved.",
            };
            
            return res.status(403).json({
                success: false,
                message: statusMessages[enrollment.paymentStatus] || "Payment required for certificate",
                code: ERROR_CODES.PAYMENT_REQUIRED,
                paymentStatus: enrollment.paymentStatus,
            });
        }

        const certificate = await Certificate.findOne({
            student: req.userId,
            course: course._id,
        }).populate("course", "title");

        if (!certificate) {
            // Check if course is completed
            if (!enrollment.isCompleted) {
                return res.status(404).json({
                    success: false,
                    message: "Complete the course to earn a certificate",
                    code: ERROR_CODES.RESOURCE_NOT_FOUND,
                });
            }

            return res.status(404).json({
                success: false,
                message: "Certificate not yet issued. Please contact support.",
                code: ERROR_CODES.RESOURCE_NOT_FOUND,
            });
        }

        res.status(200).json({ success: true, data: certificate });
    } catch (error) {
        console.error("Get course certificate error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificate",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
