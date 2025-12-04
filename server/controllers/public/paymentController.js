import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Payment, Student, Course, Enrollment } from "../../models/index.js";
import { r2 } from "../../config/r2.js";
import crypto from "crypto";

/**
 * Upload file to R2 and return the URL
 */
const uploadToR2 = async (file) => {
    const uniqueKey = `final-payment-screenshots/${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;
    
    const uploadParams = {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: uniqueKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await r2.send(new PutObjectCommand(uploadParams));
    
    // Return the R2 public URL or custom domain URL
    const publicUrl = process.env.R2_PUBLIC_URL 
        ? `${process.env.R2_PUBLIC_URL}/${uniqueKey}`
        : `/api/file/${uniqueKey}`;
    
    return publicUrl;
};

/**
 * Submit payment proof for partial or full payment
 * POST /api/public/payment/:enrollmentId
 */
export const submitPaymentProof = async (req, res) => {
    try {
        const {
            accountHolderName,
            bankName,
            ifscCode,
            accountNumber,
            transactionId,
            paymentType, // 'partial' or 'full'
        } = req.validatedData;

        const { enrollmentId } = req.params;

        // Upload screenshot to R2 and get URL
        let screenshotUrl = null;
        if (req.file) {
            try {
                screenshotUrl = await uploadToR2(req.file);
            } catch (uploadError) {
                console.error("R2 upload error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload payment screenshot. Please try again.",
                });
            }
        }

        // Verify enrollment exists and get details
        const enrollment = await Enrollment.findById(enrollmentId).populate(
            "course",
            "title price"
        );
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
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

        // Determine payment amount based on type
        const coursePrice =
            enrollment.courseAmount || enrollment.course.price || 500;
        const amount =
            paymentType === "partial"
                ? Math.ceil(coursePrice / 2)
                : enrollment.amountRemaining || coursePrice;

        // Create payment record
        const payment = await Payment.create({
            accountHolderName,
            bankName,
            ifscCode,
            accountNumber,
            transactionId,
            screenshotUrl,
            amount,
            currency: "INR",
        });

        // Update enrollment with payment reference and status
        if (paymentType === "partial") {
            enrollment.partialPaymentDetails = payment._id;
            enrollment.paymentStatus = "PARTIAL_PAYMENT_VERIFICATION_PENDING";
        } else {
            enrollment.fullPaymentDetails = payment._id;
            enrollment.paymentStatus = "FULLY_PAYMENT_VERIFICATION_PENDING";
        }

        await enrollment.save();

        res.status(201).json({
            success: true,
            message:
                "Payment proof submitted successfully. It will be verified within 24-48 hours.",
            data: {
                paymentId: payment._id,
                transactionId: payment.transactionId,
                amount: payment.amount,
                currency: payment.currency,
                paymentType,
                screenshotUrl: payment.screenshotUrl,
                submittedAt: payment.createdAt,
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

/**
 * Verify/Reject payment (Admin only)
 * PATCH /api/admin/payment/:enrollmentId/verify
 */
export const updatePaymentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { action, paymentType } = req.body; // action: 'approve' or 'reject', paymentType: 'partial' or 'full'

        // Validate action
        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Invalid action. Must be 'approve' or 'reject'",
            });
        }

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("partialPaymentDetails")
            .populate("fullPaymentDetails")
            .populate("course", "title price");

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        const coursePrice =
            enrollment.courseAmount || enrollment.course.price || 500;

        if (action === "approve") {
            if (paymentType === "partial") {
                const partialAmount =
                    enrollment.partialPaymentDetails?.amount ||
                    Math.ceil(coursePrice / 2);
                enrollment.paymentStatus = "PARTIAL_PAID";
                enrollment.amountPaid = partialAmount;
                enrollment.amountRemaining = coursePrice - partialAmount;
            } else {
                const fullAmount =
                    enrollment.fullPaymentDetails?.amount ||
                    enrollment.amountRemaining ||
                    coursePrice;
                enrollment.paymentStatus = "FULLY_PAID";
                enrollment.amountPaid = coursePrice;
                enrollment.amountRemaining = 0;
            }
        } else {
            // Reject - reset to previous state
            if (paymentType === "partial") {
                enrollment.paymentStatus = "UNPAID";
                enrollment.partialPaymentDetails = null;
            } else {
                enrollment.paymentStatus = enrollment.partialPaymentDetails
                    ? "PARTIAL_PAID"
                    : "UNPAID";
                enrollment.fullPaymentDetails = null;
            }
        }

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: `Payment ${action === "approve" ? "approved" : "rejected"} successfully`,
            data: {
                enrollmentId: enrollment._id,
                paymentStatus: enrollment.paymentStatus,
                amountPaid: enrollment.amountPaid,
                amountRemaining: enrollment.amountRemaining,
            },
        });
    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
        });
    }
};
