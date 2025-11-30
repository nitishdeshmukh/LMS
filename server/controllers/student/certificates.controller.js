import Course from "../../models/Course.js";
import Certificate from "../../models/Certificate.js";
import Enrollment from "../../models/Enrollment.js";

/**
 * GET /api/student/certificates
 * Get all student certificates
 */
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.userId })
      .populate("course", "title slug thumbnail")
      .sort({ issueDate: -1 });

    res.json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      return res.status(404).json({ success: false, message: "Course not found" });
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
        });
      }

      return res.status(404).json({
        success: false,
        message: "Certificate not yet issued. Please contact support.",
      });
    }

    res.json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
