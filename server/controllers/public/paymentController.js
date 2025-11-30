import { Payment, User, Course, Enrollment } from "../../models/index.js";

export const submitPaymentProof = async (req, res) => {
    try {
        const {
            accountHolderName,
            bankName,
            ifscCode,
            accountNumber,
            transactionId,
        } = req.validatedData;

        // Get IDs from URL params or auth (adjust based on your flow)
        const { studentId, courseId, enrollmentId } = req.params;

        // Get screenshot URL from uploaded file
        const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Verify student exists
        const studentUser = await User.findById(studentId);
        if (!studentUser) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Verify course exists
        const courseDoc = await Course.findById(courseId);
        if (!courseDoc) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Verify enrollment exists
        const enrollmentDoc = await Enrollment.findById(enrollmentId);
        if (!enrollmentDoc) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        // Check if payment already exists for this enrollment
        const existingPayment = await Payment.findOne({
            enrollment: enrollmentId,
        });
        if (existingPayment) {
            return res.status(409).json({
                success: false,
                message: "Payment already submitted for this enrollment",
            });
        }

        // Check for duplicate transaction ID
        const duplicateTransaction = await Payment.findOne({ transactionId });
        if (duplicateTransaction) {
            return res.status(409).json({
                success: false,
                message: "Payment with this transaction ID already exists",
            });
        }

        // Create payment record
        const payment = await Payment.create({
            student: studentId,
            course: courseId,
            enrollment: enrollmentId,
            accountHolderName,
            bankName,
            ifscCode,
            accountNumber,
            transactionId,
            screenshotUrl,
            amount: 500, // default or get from course
            currency: "INR",
            status: "Submitted",
        });

        // Populate the response
        const populatedPayment = await Payment.findById(payment._id)
            .populate("student", "name email")
            .populate("course", "name")
            .populate("enrollment");

        res.status(201).json({
            success: true,
            message:
                "Payment proof submitted successfully. It will be verified within 24-48 hours.",
            data: {
                paymentId: populatedPayment._id,
                transactionId: populatedPayment.transactionId,
                amount: populatedPayment.amount,
                currency: populatedPayment.currency,
                status: populatedPayment.status,
                screenshotUrl: populatedPayment.screenshotUrl,
                student: populatedPayment.student,
                course: populatedPayment.course,
                submittedAt: populatedPayment.createdAt,
            },
        });
    } catch (error) {
        console.error("Payment submission error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate transaction ID detected",
            });
        }

        res.status(500).json({
            success: false,
            message: "Payment submission failed. Please try again later.",
            error: error.message,
        });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const { status, adminRemarks } = req.body;

        // Validate status
        if (!["submitted", "verified", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid status. Must be submitted, verified, or rejected",
            });
        }

        const payment = await Payment.findByIdAndUpdate(
            paymentId,
            {
                status,
                adminRemarks: adminRemarks || undefined,
                updatedAt: Date.now(),
            },
            { new: true }
        )
            .populate("student", "name email")
            .populate("course", "name");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        res.status(200).json({
            success: true,
            message: `Payment ${status} successfully`,
            data: payment,
        });
    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
        });
    }
};
