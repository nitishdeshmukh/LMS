import { RefreshToken } from "../../models/index.js";
import { setAuthCookies } from "./utils.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

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
 */
export const refreshAccessToken = async (req, res) => {
    try {
        // Try to get refresh token from cookie first, fallback to body
        const oldRefreshToken =
            req.cookies?.refreshToken || req.validatedData?.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required",
                code: ERROR_CODES.REFRESH_TOKEN_INVALID,
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
                code: ERROR_CODES.REFRESH_TOKEN_INVALID,
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
                code: ERROR_CODES.TOKEN_REUSE_DETECTED,
            });
        }

        // Check if token is revoked
        if (tokenDoc.isRevoked) {
            return res.status(401).json({
                success: false,
                message: "Refresh token has been revoked",
                code: ERROR_CODES.REFRESH_TOKEN_REVOKED,
            });
        }

        // Check if token is expired
        if (tokenDoc.expiresAt < new Date()) {
            await tokenDoc.deleteOne();
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
                code: ERROR_CODES.REFRESH_TOKEN_EXPIRED,
            });
        }

        const user = tokenDoc.user;

        // Check if user still exists
        if (!user) {
            await RefreshToken.revokeTokenFamily(tokenDoc.family);
            return res.status(401).json({
                success: false,
                message: "User not found",
                code: ERROR_CODES.USER_NOT_FOUND,
            });
        }

        // Check if user is blocked
        if (user.accountStatus === "blocked") {
            await RefreshToken.revokeAllUserTokens(user._id);
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked",
                code: ERROR_CODES.ACCOUNT_BLOCKED,
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
            tokenDoc.userModel,
            tokenDoc.family
        );

        // Set new tokens in httpOnly cookies
        setAuthCookies(res, accessToken, newRefreshToken);

        res.status(200).json({
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
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
