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

        const certificate = await Certificate.findOne({
            student: req.userId,
            course: course._id,
        }).populate("course", "title");

        if (!certificate) {
            // Check if eligible for certificate
            const enrollment = await Enrollment.findOne({
                student: req.userId,
                course: course._id,
                isCompleted: true,
            });

            if (!enrollment) {
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
