import { Payment, Enrollment, Course, Student } from "../../models/index.js";
import mongoose from "mongoose";

/**
 * Create enrollment with payment proof in single request
 * POST /api/public/enrollment
 */
export const createEnrollmentWithPayment = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {
            // Personal Info (from Redux enrollmentDetails)
            firstName, // Maps to Student.name
            middleName,
            lastName,
            collegeName,
            degreeCourse, // Maps to Student.courseName
            yearOfStudy,
            email,
            phoneNumber,
            alternatePhone,
            // Course Selection
            courseId,
            referralCode,
            // Payment Details (from Redux paymentDetails)
            accountHolderName,
            bankName,
            ifscCode,
            accountNumber,
            transactionId,
            paymentType = "partial",
        } = req.validatedData;

        // Get screenshot URL from uploaded file
        const screenshotUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // Verify course exists and get details
        const course = await Course.findById(courseId).session(session);
        if (!course || !course.isPublished) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Course not found or not available",
            });
        }

        // Get authenticated user ID (student)
        const studentId = req.user?._id || req.user?.id;
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
        const coursePrice = course.price || 500;
        const partialAmount = Math.ceil(coursePrice * 0.1); // 10% for partial payment
        const amount = paymentType === "partial" ? partialAmount : coursePrice;

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
                    amount,
                    currency: "INR",
                },
            ],
            { session }
        );

        // Determine initial payment status
        const paymentStatus =
            paymentType === "partial"
                ? "PARTIAL_PAYMENT_VERIFICATION_PENDING"
                : "FULLY_PAYMENT_VERIFICATION_PENDING";

        // Create enrollment record
        const enrollment = await Enrollment.create(
            [
                {
                    student: studentId,
                    course: courseId,
                    // Payment tracking
                    courseAmount: coursePrice,
                    amountPaid: 0, // Will be updated after payment verification
                    amountRemaining: coursePrice,
                    paymentStatus,
                    partialPaymentDetails:
                        paymentType === "partial" ? payment[0]._id : undefined,
                    fullPaymentDetails:
                        paymentType === "full" ? payment[0]._id : undefined,
                    // Progress tracking
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
            accountStatus: "pending", // Will be "verified" after payment approval
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
                amount: payment[0].amount,
                currency: payment[0].currency,
                paymentType,
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
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    } finally {
        session.endSession();
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
        const { action, paymentType, rejectionReason } = req.body;

        // Validate action
        if (!["approve", "reject"].includes(action)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Invalid action. Must be 'approve' or 'reject'",
            });
        }

        // Validate paymentType
        if (!["partial", "full"].includes(paymentType)) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Invalid payment type. Must be 'partial' or 'full'",
            });
        }

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate("partialPaymentDetails")
            .populate("fullPaymentDetails")
            .populate("course", "title price")
            .session(session);

        if (!enrollment) {
            await session.abortTransaction();
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
                    Math.ceil(coursePrice * 0.1);
                enrollment.paymentStatus = "PARTIAL_PAID";
                enrollment.amountPaid = partialAmount;
                enrollment.amountRemaining = coursePrice - partialAmount;

                // Update student status to "verified" on first payment
                await Student.findByIdAndUpdate(
                    enrollment.student,
                    { accountStatus: "verified" },
                    { session }
                );
            } else {
                const fullAmount =
                    enrollment.fullPaymentDetails?.amount ||
                    enrollment.amountRemaining ||
                    coursePrice;
                enrollment.paymentStatus = "FULLY_PAID";
                enrollment.amountPaid = coursePrice;
                enrollment.amountRemaining = 0;

                // Update student status to "verified"
                await Student.findByIdAndUpdate(
                    enrollment.student,
                    { accountStatus: "verified" },
                    { session }
                );

                // Check if student used a referral code - unlock premium for referrer if 3+ referrals
                const student = await Student.findById(
                    enrollment.student
                ).session(session);
                if (student.referredBy) {
                    const referrer = await Student.findOne({
                        myReferralCode: student.referredBy,
                    }).session(session);

                    if (
                        referrer &&
                        referrer.referralCount >= 3 &&
                        !referrer.isPremiumUnlocked
                    ) {
                        await Student.findByIdAndUpdate(
                            referrer._id,
                            { isPremiumUnlocked: true },
                            { session }
                        );
                    }
                }
            }
        } else {
            // Reject - remove payment reference
            if (paymentType === "partial") {
                enrollment.paymentStatus = "UNPAID";

                // Delete the payment record on rejection
                if (enrollment.partialPaymentDetails) {
                    await Payment.findByIdAndDelete(
                        enrollment.partialPaymentDetails._id,
                        { session }
                    );
                }

                enrollment.partialPaymentDetails = null;

                // Update student status back to "pending"
                await Student.findByIdAndUpdate(
                    enrollment.student,
                    { accountStatus: "pending" },
                    { session }
                );
            } else {
                enrollment.paymentStatus = enrollment.partialPaymentDetails
                    ? "PARTIAL_PAID"
                    : "UNPAID";

                // Delete the payment record on rejection
                if (enrollment.fullPaymentDetails) {
                    await Payment.findByIdAndDelete(
                        enrollment.fullPaymentDetails._id,
                        { session }
                    );
                }

                enrollment.fullPaymentDetails = null;
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
                rejectionReason:
                    action === "reject"
                        ? rejectionReason || "Payment verification failed"
                        : undefined,
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

/**
 * Get enrollment details with student and payment info
 * GET /api/public/enrollment/:enrollmentId
 */
export const getEnrollmentDetails = async (req, res) => {
    try {
        const { enrollmentId } = req.params;

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate(
                "student",
                "name middleName lastName email phoneNumber collegeName courseName yearOfStudy avatar"
            )
            .populate("course", "title slug price thumbnail")
            .populate("partialPaymentDetails")
            .populate("fullPaymentDetails");

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found",
            });
        }

        // Check if user is authorized
        const userId = req.user?._id || req.user?.id;
        if (
            enrollment.student._id.toString() !== userId.toString() &&
            !req.user?.role?.includes("admin")
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this enrollment",
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
        });
    }
};
