import { applyReferralCodeSchema } from "../../validation/student.zod.js";
import { Student, Referral } from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * GET /api/student/referral
 * Get referral info
 */
export const getReferralInfo = async (req, res) => {
    try {
        const student = await Student.findById(req.userId).select(
            "myReferralCode referralCount isPremiumUnlocked"
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
                code: ERROR_CODES.USER_NOT_FOUND,
            });
        }

        const referrals = await Referral.find({ referrer: req.userId })
            .populate("referee", "name createdAt")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                referralCode: student.myReferralCode,
                referralCount: student.referralCount,
                isPremiumUnlocked: student.isPremiumUnlocked,
                referrals: referrals.map((r) => ({
                    name: r.referee.name,
                    joinedAt: r.referee.createdAt,
                    credited: r.credited,
                })),
            },
        });
    } catch (error) {
        console.error("Get referral info error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch referral info",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * POST /api/student/referral/apply
 * Apply referral code
 */
export const applyReferralCode = async (req, res) => {
    try {
        const validation = applyReferralCodeSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const { referralCode } = validation.data;
        const student = await Student.findById(req.userId);

        // Check if student already used a referral code
        if (student.referredBy) {
            return res.status(400).json({
                success: false,
                message: "You have already used a referral code",
                code: ERROR_CODES.BAD_REQUEST,
            });
        }

        // Find referrer
        const referrer = await Student.findOne({
            myReferralCode: referralCode,
        });
        if (!referrer) {
            return res.status(404).json({
                success: false,
                message: "Invalid referral code",
                code: ERROR_CODES.RESOURCE_NOT_FOUND,
            });
        }

        // Can't use own code
        if (referrer._id.toString() === req.userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot use your own referral code",
                code: ERROR_CODES.BAD_REQUEST,
            });
        }

        // Create referral record
        await Referral.create({
            referrer: referrer._id,
            referee: req.userId,
            referralCode,
        });

        // Update student
        student.referredBy = referralCode;
        await student.save();

        // Update referrer's count
        referrer.referralCount += 1;
        if (referrer.referralCount >= 3 && !referrer.isPremiumUnlocked) {
            referrer.isPremiumUnlocked = true;
        }
        await referrer.save();

        // Unlock benefits for referee
        student.isPremiumUnlocked = true;
        await student.save();

        res.status(200).json({
            success: true,
            message:
                "Referral code applied successfully! Premium benefits unlocked.",
            data: { isPremiumUnlocked: true },
        });
    } catch (error) {
        console.error("Apply referral code error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to apply referral code",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
