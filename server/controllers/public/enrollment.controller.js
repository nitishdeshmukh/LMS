import { Payment, Enrollment, Course, Student } from "../../models/index.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../../config/r2.js";
import mongoose from "mongoose";
import crypto from "crypto";

/**
 * Upload file to R2 and return the URL
 */
const uploadToR2 = async (file) => {
    const uniqueKey = `initial-payment-screenshots/${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;

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
 * Create enrollment with payment proof in single request
 * POST /api/public/enrollment
 */
export const createEnrollmentWithPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            firstName,
            middleName,
            lastName,
            collegeName,
            degreeCourse,
            yearOfStudy,
            email,
            phoneNumber,
            alternatePhone,
            courseId,
            referralCode,
            accountHolderName,
            bankName,
            ifscCode,
            accountNumber,
            transactionId,
        } = req.validatedData;

        // Upload screenshot to R2 and get URL
        let screenshotUrl = null;
        if (req.file) {
            try {
                screenshotUrl = await uploadToR2(req.file);
            } catch (uploadError) {
                console.error("R2 upload error:", uploadError);
                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to upload payment screenshot. Please try again.",
                });
            }
        }

        // Verify course exists and get details
        const course = await Course.findById(courseId).session(session);
        if (!course.isPublished) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Course not found or not available",
            });
        }

        // Get authenticated user ID (student)
        const studentId = req.user?._id;
        if (!studentId) {
            await session.abortTransaction();
            return res.status(401).json({
                success: false,
                message: "User authentication required",
            });
        }

        // Get student details
        const student = await Student.findById(studentId).session(session);
        if (!student) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        // Check for duplicate transaction ID
        const duplicateTransaction = await Payment.findOne({
            transactionId,
        }).session(session);
        if (duplicateTransaction) {
            await session.abortTransaction();
            return res.status(409).json({
                success: false,
                message:
                    "Payment with this transaction ID already exists. Please use a different transaction ID.",
            });
        }

        // Check if user already enrolled in this course
        const existingEnrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
        }).session(session);

        if (existingEnrollment) {
            await session.abortTransaction();
            return res.status(409).json({
                success: false,
                message: "You are already enrolled in this course",
            });
        }

        // Determine payment amount based on type
        const coursePrice = course.price;

        // Create payment record
        const payment = await Payment.create(
            [
                {
                    accountHolderName,
                    bankName,
                    ifscCode,
                    accountNumber,
                    transactionId,
                    screenshotUrl,
                    currency: "INR",
                },
            ],
            { session }
        );
        const paymentStatus = "PARTIAL_PAYMENT_VERIFICATION_PENDING";

        const enrollment = await Enrollment.create(
            [
                {
                    student: studentId,
                    course: courseId,
                    courseAmount: coursePrice,
                    amountRemaining: coursePrice,
                    paymentStatus,
                    partialPaymentDetails: payment[0]._id,
                    progressPercentage: 0,
                    completedQuizzes: [],
                    completedTasks: [],
                    completedModules: [],
                    isCompleted: false,
                },
            ],
            { session }
        );

        // Update Student profile with enrollment data
        const updateData = {
            name: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            collegeName: collegeName,
            courseName: degreeCourse,
            yearOfStudy: yearOfStudy,
        };

        // Add optional fields if provided
        if (middleName) updateData.middleName = middleName;
        if (alternatePhone) updateData.alternatePhone = alternatePhone;
        if (referralCode) updateData.referredBy = referralCode;

        // Add course to student's courses array if not already present
        if (!student.courses.includes(courseId)) {
            updateData.$addToSet = { courses: courseId };
        }

        await Student.findByIdAndUpdate(studentId, updateData, { session });

        // If referral code provided, update referrer's count
        if (referralCode) {
            await Student.findOneAndUpdate(
                { myReferralCode: referralCode },
                { $inc: { referralCount: 1 } },
                { session }
            );
        }

        // Commit transaction
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message:
                "Enrollment and payment proof submitted successfully. Payment will be verified within 24-48 hours.",
            data: {
                enrollmentId: enrollment[0]._id,
                studentId: studentId,
                studentName: `${firstName} ${
                    middleName ? middleName + " " : ""
                }${lastName}`,
                studentEmail: email,
                courseTitle: course.title,
                courseSlug: course.slug,
                paymentId: payment[0]._id,
                transactionId: payment[0].transactionId,
                currency: payment[0].currency,
                paymentStatus: enrollment[0].paymentStatus,
                screenshotUrl: payment[0].screenshotUrl,
                submittedAt: enrollment[0].createdAt,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        console.error("Enrollment submission error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Duplicate entry detected. You may already be enrolled in this course.",
            });
        }

        res.status(500).json({
            success: false,
            message: "Enrollment submission failed. Please try again later.",
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};
