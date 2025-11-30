import crypto from "crypto";
import { User, RefreshToken } from "../../models/index.js";
import ms from "ms";

/**
 * Generates secure cookie options for access tokens.
 * Implements security best practices including XSS and CSRF protection.
 *
 * @function getAccessTokenCookieOptions
 * @returns {Object} Cookie configuration object
 * @returns {boolean} returns.httpOnly - Prevents client-side JavaScript access (XSS protection)
 * @returns {boolean} returns.secure - Enforces HTTPS-only transmission in production
 * @returns {string} returns.sameSite - "strict" prevents CSRF attacks
 * @returns {number} returns.maxAge - Token lifetime in milliseconds from ACCESS_TOKEN_EXPIRY env var
 */
const getAccessTokenCookieOptions = () => ({
    httpOnly: true, // Prevents XSS attacks - JavaScript cannot access
    secure: true, // HTTPS only in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: ms(process.env.ACCESS_TOKEN_EXPIRY),
});

/**
 * Generates secure cookie options for refresh tokens.
 * Implements security best practices including XSS and CSRF protection.
 *
 * @function getRefreshTokenCookieOptions
 * @returns {Object} Cookie configuration object
 * @returns {boolean} returns.httpOnly - Prevents client-side JavaScript access (XSS protection)
 * @returns {boolean} returns.secure - Enforces HTTPS-only transmission in production
 * @returns {string} returns.sameSite - "strict" prevents CSRF attacks
 * @returns {number} returns.maxAge - Token lifetime in milliseconds from REFRESH_TOKEN_EXPIRY env var
 */
const getRefreshTokenCookieOptions = () => ({
    httpOnly: true, // Prevents XSS attacks
    secure: true, // HTTPS only in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: ms(process.env.REFRESH_TOKEN_EXPIRY),
});

/**
 * Authenticates a user with email and password credentials.
 * Validates credentials, checks account status, generates JWT tokens, and sets secure HTTP-only cookies.
 *
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.validatedData - Validated request data from middleware
 * @param {string} req.validatedData.email - User's email address
 * @param {string} req.validatedData.password - User's password (plain text, will be hashed for comparison)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with authentication result
 * @throws {Error} 401 - Invalid credentials or OAuth-only account
 * @throws {Error} 403 - Account blocked
 * @throws {Error} 500 - Server error during login process
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.validatedData;

        // Find user with password field
        const user = await User.findOne({ email: email.toLowerCase() }).select(
            "+password"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check if user has a password (OAuth users might not)
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "Please login using Google or GitHub",
            });
        }

        // Verify password
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check account status
        if (user.accountStatus === "blocked") {
            return res.status(403).json({
                success: false,
                message:
                    "Your account has been blocked. Please contact support.",
            });
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to DB
        await RefreshToken.saveRefreshToken(user._id, refreshToken, req);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // ✅ Set tokens in httpOnly cookies
        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
        res.cookie(
            "refreshToken",
            refreshToken,
            getRefreshTokenCookieOptions()
        );

        res.json({
            success: true,
            message: "Login successful",
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
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

/**
 * Authenticates students using Learning Management System (LMS) issued credentials.
 * Validates LMS ID and password, checks account status, generates tokens, and sets secure cookies.
 *
 * @async
 * @function lmsLogin
 * @param {Object} req - Express request object
 * @param {Object} req.validatedData - Validated request data from middleware
 * @param {string} req.validatedData.lmsId - Student's LMS ID
 * @param {string} req.validatedData.lmsPassword - Student's LMS password issued by institution
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with authentication result and tokens
 * @throws {Error} 401 - Invalid LMS credentials
 * @throws {Error} 403 - Account blocked
 * @throws {Error} 500 - Server error during LMS login process
 */
export const lmsLogin = async (req, res) => {
    try {
        const { lmsId, lmsPassword } = req.validatedData;

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
                message:
                    "Your account has been blocked. Please contact support.",
            });
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to DB
        await RefreshToken.saveRefreshToken(user._id, refreshToken, req);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // ✅ Set tokens in httpOnly cookies
        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
        res.cookie(
            "refreshToken",
            refreshToken,
            getRefreshTokenCookieOptions()
        );

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

/**
 * Refreshes access and refresh tokens with automatic rotation and reuse detection.
 * Implements token rotation strategy to prevent token replay attacks and detects potential security breaches.
 * When token reuse is detected, all tokens in the family are revoked for security.
 *
 * @async
 * @function refreshAccessToken
 * @param {Object} req - Express request object
 * @param {Object} req.cookies - HTTP cookies containing refreshToken
 * @param {string} [req.cookies.refreshToken] - Current refresh token from cookie
 * @param {Object} [req.validatedData] - Validated request data (fallback)
 * @param {string} [req.validatedData.refreshToken] - Current refresh token from body (fallback)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with new token pair
 * @throws {Error} 401 - TOKEN_REUSE_DETECTED (all family tokens revoked, requires re-login)
 * @throws {Error} 401 - REFRESH_TOKEN_INVALID/REVOKED/EXPIRED
 * @throws {Error} 401 - USER_NOT_FOUND
 * @throws {Error} 403 - ACCOUNT_BLOCKED
 * @throws {Error} 500 - Server error during token refresh
 */
export const refreshAccessToken = async (req, res) => {
    try {
        // ✅ Try to get refresh token from cookie first, fallback to body
        const oldRefreshToken =
            req.cookies?.refreshToken || req.validatedData?.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        // Find the refresh token in DB
        const tokenDoc = await RefreshToken.findOne({
            token: oldRefreshToken,
        }).populate("user");

        // Token not found
        if (!tokenDoc) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
                code: "REFRESH_TOKEN_INVALID",
            });
        }

        // REUSE DETECTION
        if (tokenDoc.isUsed) {
            console.warn(
                `⚠️ SECURITY ALERT: Refresh token reuse detected for user ${tokenDoc.user?._id}`
            );
            console.warn(
                `Token family: ${tokenDoc.family}, Used at: ${tokenDoc.usedAt}`
            );

            await RefreshToken.revokeTokenFamily(tokenDoc.family);

            return res.status(401).json({
                success: false,
                message:
                    "Token reuse detected. All sessions have been revoked for security. Please login again.",
                code: "TOKEN_REUSE_DETECTED",
            });
        }

        // Check if token is revoked
        if (tokenDoc.isRevoked) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked",
                code: "REFRESH_TOKEN_REVOKED",
            });
        }

        // Check if token is expired
        if (tokenDoc.expiresAt < new Date()) {
            await tokenDoc.deleteOne();
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
                code: "REFRESH_TOKEN_EXPIRED",
            });
        }

        const user = tokenDoc.user;

        // Check if user still exists
        if (!user) {
            await RefreshToken.revokeTokenFamily(tokenDoc.family);
            return res.status(401).json({
                success: false,
                message: "User not found",
                code: "USER_NOT_FOUND",
            });
        }

        // Check if user is blocked
        if (user.accountStatus === "blocked") {
            await RefreshToken.revokeAllUserTokens(user._id);
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked",
                code: "ACCOUNT_BLOCKED",
            });
        }

        // Mark old token as USED
        const newRefreshToken = user.generateRefreshToken();

        tokenDoc.isUsed = true;
        tokenDoc.usedAt = new Date();
        tokenDoc.replacedByToken = newRefreshToken;
        await tokenDoc.save();

        // Generate new tokens
        const accessToken = user.generateAccessToken();

        // Save new refresh token (same family for chain tracking)
        await RefreshToken.saveRefreshToken(
            user._id,
            newRefreshToken,
            req,
            tokenDoc.family
        );

        // ✅ Set new tokens in httpOnly cookies
        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
        res.cookie(
            "refreshToken",
            newRefreshToken,
            getRefreshTokenCookieOptions()
        );

        res.json({
            success: true,
            message: "Tokens refreshed successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
                expiresIn: 15 * 60,
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

/**
 * Logs out the current user session by revoking the refresh token and clearing authentication cookies.
 * Only invalidates the current device/session.
 *
 * @async
 * @function logout
 * @param {Object} req - Express request object
 * @param {Object} [req.cookies] - HTTP cookies
 * @param {string} [req.cookies.refreshToken] - Refresh token to revoke
 * @param {Object} [req.body] - Request body (fallback)
 * @param {string} [req.body.refreshToken] - Refresh token to revoke (fallback)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response confirming logout
 * @throws {Error} 500 - Server error during logout
 */
export const logout = async (req, res) => {
    try {
        // ✅ Get refresh token from cookie or body
        const refreshToken =
            req.cookies?.refreshToken || req.body?.refreshToken;

        if (refreshToken) {
            // Revoke the specific refresh token
            await RefreshToken.findOneAndUpdate(
                { token: refreshToken },
                { isRevoked: true }
            );
        }

        // ✅ Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

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

/**
 * Logs out user from all devices by revoking all refresh tokens associated with the user account.
 * Clears authentication cookies for the current session and invalidates all other active sessions.
 *
 * @async
 * @function logoutAll
 * @param {Object} req - Express request object
 * @param {string} req.userId - Authenticated user ID from auth middleware
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response confirming logout from all devices
 * @throws {Error} 500 - Server error during logout process
 */
export const logoutAll = async (req, res) => {
    try {
        const userId = req.userId;

        // Revoke all refresh tokens for this user
        await RefreshToken.revokeAllUserTokens(userId);

        // ✅ Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken", { path: "/api/auth/refresh" });

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

/**
 * Initiates password reset process by generating a secure reset token.
 * Returns generic success message regardless of whether email exists to prevent email enumeration attacks.
 * Token should be sent via email to the user.
 *
 * @async
 * @function forgotPassword
 * @param {Object} req - Express request object
 * @param {Object} req.validatedData - Validated request data from middleware
 * @param {string} req.validatedData.email - User's email address
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response with generic success message
 * @throws {Error} 500 - Server error during password reset request
 * @todo Implement email sending functionality with reset link
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.validatedData;

        const user = await User.findOne({ email: email.toLowerCase() });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({
                success: true,
                message:
                    "If an account exists with this email, you will receive a password reset link",
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
            message:
                "If an account exists with this email, you will receive a password reset link",
            // DEV ONLY: Remove in production
            devToken:
                process.env.NODE_ENV === "development" ? resetToken : undefined,
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to process request",
        });
    }
};

/**
 * Resets user password using a valid reset token from forgot password flow.
 * Validates token, updates password, and revokes all existing refresh tokens for security.
 *
 * @async
 * @function resetPassword
 * @param {Object} req - Express request object
 * @param {Object} req.validatedData - Validated request data from middleware
 * @param {string} req.validatedData.token - Password reset token from email link
 * @param {string} req.validatedData.password - New password (will be hashed before saving)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} JSON response confirming password reset
 * @throws {Error} 400 - Invalid or expired reset token
 * @throws {Error} 500 - Server error during password reset
 */
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.validatedData;

        // Hash token to query database
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Find user and select reset fields
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
        }).select("+resetPasswordToken +resetPasswordExpire");

        if (!user || !user.matchResetPasswordToken(token)) {
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

        // Revoke all existing refresh tokens
        await RefreshToken.revokeAllUserTokens(user._id);

        res.json({
            success: true,
            message:
                "Password reset successful. Please login with your new password.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
        });
    }
};

/**
 * Handles OAuth authentication callback from providers (Google, GitHub).
 * Processes authenticated user from Passport.js strategy, generates tokens, and redirects to client.
 * Sets secure HTTP-only cookies and redirects to success/error pages based on authentication result.
 *
 * @async
 * @function handleOAuthCallback
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user object populated by Passport.js OAuth strategy
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Redirects to client URL with authentication status
 * @see {@link https://www.passportjs.org/packages/passport-google-oauth20/|Passport Google OAuth}
 * @see {@link https://www.passportjs.org/packages/passport-github2/|Passport GitHub OAuth}
 */
export const handleOAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to DB
        await RefreshToken.saveRefreshToken(user._id, refreshToken, req);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // ✅ Set tokens in httpOnly cookies
        res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
        res.cookie(
            "refreshToken",
            refreshToken,
            getRefreshTokenCookieOptions()
        );

        // Redirect to client
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        res.redirect(`${clientUrl}/auth-success`);
    } catch (error) {
        console.error("OAuth callback error:", error);
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        res.redirect(
            `${clientUrl}/auth-error?message=${encodeURIComponent(
                error.message
            )}`
        );
    }
};
