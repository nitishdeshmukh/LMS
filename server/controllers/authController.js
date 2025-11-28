import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  registerSchema,
  loginSchema,
  lmsLoginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validation/auth.zod.js";

// ============================================
// TOKEN CONFIGURATION
// ============================================

const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days

// Get JWT Secret (fallback chain for compatibility)
const getJwtSecret = () => {
  return process.env.JWT_ACCESS_SECRET || process.env.OAUTH_SECRET || process.env.JWT_SECRET;
};

// Generate Access Token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token (long-lived, stored in DB)
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// Generate Token Family ID (for tracking token chains)
const generateTokenFamily = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Save Refresh Token to DB (with family support for rotation)
const saveRefreshToken = async (userId, token, req, family = null) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  // Generate new family if not provided (new login session)
  const tokenFamily = family || generateTokenFamily();

  await RefreshToken.create({
    user: userId,
    token,
    expiresAt,
    family: tokenFamily,
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip || req.connection?.remoteAddress,
  });

  // Cleanup old tokens for this user (keep max 5 active families/sessions)
  const userFamilies = await RefreshToken.aggregate([
    { $match: { user: userId, isRevoked: false, isUsed: false } },
    { $group: { _id: "$family", latestToken: { $last: "$createdAt" } } },
    { $sort: { latestToken: -1 } },
    { $skip: 5 },
  ]);

  if (userFamilies.length > 0) {
    const familiesToDelete = userFamilies.map((f) => f._id);
    await RefreshToken.deleteMany({ family: { $in: familiesToDelete } });
  }

  return tokenFamily;
};

// ============================================
// REGISTER
// ============================================

export const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.errors,
      });
    }

    const { email, password, name, lastName, phoneNumber, collegeName, courseName, yearOfStudy } =
      validation.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      lastName,
      phoneNumber,
      collegeName,
      courseName,
      yearOfStudy,
      role: "student",
      accountStatus: "pending",
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // Save refresh token to DB
    await saveRefreshToken(user._id, refreshToken, req);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          lmsId: user.lmsId,
          role: user.role,
          accountStatus: user.accountStatus,
        },
        accessToken,
        refreshToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// ============================================
// LMS LOGIN (for students with issued credentials)
// ============================================

export const lmsLogin = async (req, res) => {
  try {
    const validation = lmsLoginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.errors,
      });
    }

    const { lmsId, lmsPassword } = validation.data;

    // Find user by LMS ID
    const user = await User.findOne({ lmsId }).select("+lmsPassword");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid LMS ID or password",
      });
    }

    // Verify LMS password
    const isPasswordValid = await user.matchLmsPassword(lmsPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid LMS ID or password",
      });
    }

    // Check account status
    if (user.accountStatus === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // Save refresh token to DB
    await saveRefreshToken(user._id, refreshToken, req);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: "LMS Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          lastName: user.lastName,
          lmsId: user.lmsId,
          role: user.role,
          accountStatus: user.accountStatus,
          avatar: user.avatar,
        },
        accessToken,
        refreshToken,
        expiresIn: 15 * 60,
      },
    });
  } catch (error) {
    console.error("LMS Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// ============================================
// REFRESH TOKEN (with Rotation & Reuse Detection)
// ============================================

export const refreshAccessToken = async (req, res) => {
  try {
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const { refreshToken: oldRefreshToken } = validation.data;

    // Step 1: Find the refresh token in DB (including used ones for reuse detection)
    const tokenDoc = await RefreshToken.findOne({
      token: oldRefreshToken,
    }).populate("user");

    // Token not found at all
    if (!tokenDoc) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
        code: "REFRESH_TOKEN_INVALID",
      });
    }

    // Step 2: REUSE DETECTION - If token was already used, it's a potential attack!
    if (tokenDoc.isUsed) {
      console.warn(`⚠️ SECURITY ALERT: Refresh token reuse detected for user ${tokenDoc.user?._id}`);
      console.warn(`Token family: ${tokenDoc.family}, Used at: ${tokenDoc.usedAt}`);
      
      // Revoke the ENTIRE token family (all tokens in this chain)
      await RefreshToken.revokeTokenFamily(tokenDoc.family);
      
      return res.status(401).json({
        success: false,
        message: "Token reuse detected. All sessions have been revoked for security. Please login again.",
        code: "TOKEN_REUSE_DETECTED",
      });
    }

    // Step 3: Check if token is revoked
    if (tokenDoc.isRevoked) {
      return res.status(401).json({
        success: false,
        message: "Refresh token has been revoked",
        code: "REFRESH_TOKEN_REVOKED",
      });
    }

    // Step 4: Check if token is expired
    if (tokenDoc.expiresAt < new Date()) {
      await tokenDoc.deleteOne();
      return res.status(401).json({
        success: false,
        message: "Refresh token has expired",
        code: "REFRESH_TOKEN_EXPIRED",
      });
    }

    const user = tokenDoc.user;

    // Step 5: Check if user still exists
    if (!user) {
      await RefreshToken.revokeTokenFamily(tokenDoc.family);
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Step 6: Check if user is blocked
    if (user.accountStatus === "blocked") {
      await RefreshToken.revokeAllUserTokens(user._id);
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked",
        code: "ACCOUNT_BLOCKED",
      });
    }

    // Step 7: Mark old token as USED (not deleted, for reuse detection)
    const newRefreshToken = generateRefreshToken();
    
    tokenDoc.isUsed = true;
    tokenDoc.usedAt = new Date();
    tokenDoc.replacedByToken = newRefreshToken;
    await tokenDoc.save();

    // Step 8: Generate new tokens
    const accessToken = generateAccessToken(user);

    // Step 9: Save new refresh token (same family for chain tracking)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await RefreshToken.create({
      user: user._id,
      token: newRefreshToken,
      expiresAt,
      family: tokenDoc.family, // Same family for tracking
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip || req.connection?.remoteAddress,
    });

    // Step 10: Return new tokens
    res.json({
      success: true,
      message: "Tokens refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken, // NEW refresh token
        expiresIn: 15 * 60, // 15 minutes in seconds
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      error: error.message,
    });
  }
};

// ============================================
// LOGOUT
// ============================================

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Revoke the specific refresh token
      await RefreshToken.findOneAndUpdate({ token: refreshToken }, { isRevoked: true });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// ============================================
// LOGOUT FROM ALL DEVICES
// ============================================

export const logoutAll = async (req, res) => {
  try {
    const userId = req.userId;

    // Revoke all refresh tokens for this user
    await RefreshToken.revokeAllUserTokens(userId);

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// ============================================
// GET CURRENT USER
// ============================================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -lmsPassword -resetPasswordToken -resetPasswordExpire -googleId -githubId"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};

// ============================================
// FORGOT PASSWORD
// ============================================

export const forgotPassword = async (req, res) => {
  try {
    const validation = forgotPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const { email } = validation.data;

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link",
      });
    }

    // Generate reset token
    const resetToken = user.createResetPasswordToken();
    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    // await sendEmail({ to: user.email, subject: 'Password Reset', ... });

    res.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link",
      // DEV ONLY: Remove in production
      devToken: process.env.NODE_ENV === "development" ? resetToken : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
    });
  }
};

// ============================================
// RESET PASSWORD
// ============================================

export const resetPassword = async (req, res) => {
  try {
    const validation = resetPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        errors: validation.error.errors,
      });
    }

    const { token, password } = validation.data;

    // Hash the token to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Revoke all existing refresh tokens (force re-login)
    await RefreshToken.revokeAllUserTokens(user._id);

    res.json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};

// ============================================
// GET ACTIVE SESSIONS
// ============================================

export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await RefreshToken.find({
      user: req.userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .select("userAgent ipAddress createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get sessions",
    });
  }
};

// ============================================
// OAUTH CALLBACK HANDLER (for Google/GitHub)
// ============================================

export const handleOAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    // Save refresh token to DB
    await saveRefreshToken(user._id, refreshToken, req);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Redirect to client with tokens
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(
      `${clientUrl}/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientUrl}/auth-error?message=${encodeURIComponent(error.message)}`);
  }
};
