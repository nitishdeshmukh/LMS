import { RefreshToken } from "../../models/index.js";
import { setAuthCookies } from "./utils.js";

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
 */
export const handleOAuthCallback = async (req, res) => {
    try {
        const user = req.user;

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Save refresh token to DB
        await RefreshToken.saveRefreshToken(
            user._id,
            refreshToken,
            req,
            "Student"
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Set tokens in httpOnly cookies
        setAuthCookies(res, accessToken, refreshToken);

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
