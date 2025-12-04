import { Enrollment, Student, Payment } from "../../models/index.js";
import mongoose from "mongoose";
import {
    sendEnrollmentConfirmationEmail,
    sendPaymentRejectionEmail,
} from "../../services/email.js";

/**
 * Get all pending users (students awaiting verification)
 * 
 */
export const getOngoingUsers = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            paymentStatus: "PARTIAL_PAYMENT_VERIFICATION_PENDING",
        }).select(
                "-completedQuizzes -completedTasks -completedModules -progressPercentage -isCompleted"
            )
            .populate("student")
            .populate("course", "title slug price thumbnail")
            .populate("partialPaymentDetails")
            .populate("fullPaymentDetails")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Pending enrollments retrieved successfully",
            data: enrollments,
        });
    } catch (error) {
        console.error("Get pending enrollments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get pending enrollments",
            error: error.message,
        });
    }
};

/**
 * Verify/Reject payment (Admin only)
 * PATCH /api/admin/enrollment/:enrollmentId/payment
 */
export const updatePaymentStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { enrollmentId } = req.params;
        const { action, paymentType, rejectionReason, amountPaid } = req.body;

        const enrollment = await Enrollment.findById(enrollmentId)
        .select(
                "-completedQuizzes -completedTasks -completedModules -progressPercentage -isCompleted"
            )
            .populate("partialPaymentDetails")
            .populate("fullPaymentDetails")
            .populate("course", "title price")
            .populate("student")
            .session(session);

        if (!enrollment) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }
        const coursePrice = enrollment.courseAmount || enrollment.course.price;

        if (action === "approve") {
            if (paymentType === "partial") {
                enrollment.paymentStatus = "PARTIAL_PAID";
                enrollment.amountPaid = amountPaid;
                enrollment.amountRemaining = coursePrice - amountPaid;
            } else if (paymentType === "full") {
                enrollment.paymentStatus = "FULLY_PAID";
                enrollment.amountPaid = coursePrice;
                enrollment.amountRemaining = 0;
            }

            const student = enrollment.student;

            const lmsPassword = await student.generateLmsPassword();
            const lmsId = await student.generateLmsId();

            try {
                await sendEnrollmentConfirmationEmail(
                    student.email,
                    student.name,
                    enrollment.course.title,
                    lmsId,
                    lmsPassword,
                    process.env.LMS_LOGIN_URL
                );
                await student.save({ session });
            } catch (emailError) {
                console.error("Email sending failed:", emailError);
                await session.abortTransaction();
                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to send enrollment email. Payment not approved.",
                    error: emailError.message,
                });
            }
        } else if (action === "reject" && paymentType === "partial") {
            // Send rejection email
            try {
                await sendPaymentRejectionEmail(
                    enrollment.student.email,
                    enrollment.student.name,
                    "Payment Rejected",
                    rejectionReason
                );
            } catch (emailError) {
                console.error("Rejection email sending failed:", emailError);
            }

            // Reset payment status and remove payment details
            if (paymentType === "partial") {
                enrollment.paymentStatus = "UNPAID";
                if (enrollment.partialPaymentDetails) {
                    await Payment.findByIdAndDelete(
                        enrollment.partialPaymentDetails._id,
                        { session }
                    );
                    enrollment.partialPaymentDetails = null;
                }
            } else {
                enrollment.paymentStatus = enrollment.partialPaymentDetails
                    ? "PARTIAL_PAID"
                    : "UNPAID";
                if (enrollment.fullPaymentDetails) {
                    await Payment.findByIdAndDelete(
                        enrollment.fullPaymentDetails._id,
                        { session }
                    );
                    enrollment.fullPaymentDetails = null;
                }
            }
        }

        await enrollment.save({ session });
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: `Payment ${
                action === "approve" ? "approved" : "rejected"
            } successfully`,
            data: {
                enrollmentId: enrollment._id,
                paymentStatus: enrollment.paymentStatus,
                amountPaid: enrollment.amountPaid,
                amountRemaining: enrollment.amountRemaining,
                rejectionReason: rejectionReason,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Update payment status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    } finally {
        session.endSession();
    }
};

export const getEnrollmentDetails = async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const enrollment = await Enrollment.findById(enrollmentId)
            .select(
                "-completedQuizzes -completedTasks -completedModules -progressPercentage -isCompleted"
            )
            .populate(
                "student",
                "name middleName lastName email phoneNumber collegeName courseName yearOfStudy avatar"
            )
            .populate("course", "title slug price thumbnail")
            .populate(
                "partialPaymentDetails",
                "accountHolderName bankName ifscCode accountNumber transactionId screenshotUrl currency"
            )
            .populate(
                "fullPaymentDetails",
                "accountHolderName bankName ifscCode accountNumber transactionId screenshotUrl currency"
            );

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        res.status(200).json({
            success: true,
            data: enrollment,
        });
    } catch (error) {
        console.error("Get enrollment error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get enrollment details",
            error: error.message,
        });
    }
};
