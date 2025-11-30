import { Student } from "../../models/index.js";
import {
    updatePrivacySchema,
    changePasswordSchema,
} from "../../validation/student.zod.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * PUT /api/student/settings/privacy
 * Update privacy settings
 */
export const updatePrivacy = async (req, res) => {
    try {
        const validation = updatePrivacySchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.userId,
            { isProfileLocked: validation.data.isProfileLocked },
            { new: true }
        ).select("isProfileLocked");

        res.status(200).json({
            success: true,
            data: student,
            message: "Privacy settings updated",
        });
    } catch (error) {
        console.error("Update privacy error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update privacy settings",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * PUT /api/student/settings/password
 * Change password
 */
export const changePassword = async (req, res) => {
    try {
        const validation = changePasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const student = await Student.findById(req.userId).select(
            "+lmsPassword"
        );

        if (!student.lmsPassword) {
            return res.status(400).json({
                success: false,
                message: "Password change not available for OAuth users",
                code: ERROR_CODES.BAD_REQUEST,
            });
        }

        const isMatch = await student.matchLmsPassword(
            validation.data.currentPassword
        );
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
                code: ERROR_CODES.INVALID_CREDENTIALS,
            });
        }

        student.lmsPassword = validation.data.newPassword;
        await student.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
