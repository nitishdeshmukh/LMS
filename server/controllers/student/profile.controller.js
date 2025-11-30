import User from "../../models/User.js";
import {
  updateProfileSchema,
  updateAvatarSchema,
} from "../../validation/student.zod.js";

/**
 * GET /api/student/profile
 * Get student profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -lmsPassword -resetPasswordToken -resetPasswordExpire -googleId -githubId"
    );

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/student/profile
 * Update student profile
 */
export const updateProfile = async (req, res) => {
  try {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: validation.data },
      { new: true, runValidators: true }
    ).select("-password -lmsPassword -resetPasswordToken -resetPasswordExpire");

    res.json({ success: true, data: user, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/student/profile/avatar
 * Update student avatar
 */
export const updateAvatar = async (req, res) => {
  try {
    const validation = updateAvatarSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: validation.data.avatar },
      { new: true }
    ).select("avatar");

    res.json({ success: true, data: user, message: "Avatar updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
