import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import errorHandler from "../utils/errorHandler.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new errorHandler(401, "Unauthorized request");
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;

        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    throw new errorHandler(401, "Access token has expired");
                }
                if (err.name === "JsonWebTokenError") {
                    throw new errorHandler(401, "Invalid access token");
                }
                throw new errorHandler(401, "Token verification failed");
            }

            const { id } = decoded;

            const user = await User.findById(id).select(
                "-password -refreshToken"
            );
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    code: "USER_NOT_FOUND",
                });
            }

            // Check if user is blocked
            if (user.accountStatus === "blocked") {
                return res.status(403).json({
                    success: false,
                    message:
                        "Your account has been blocked. Please contact support.",
                    code: "ACCOUNT_BLOCKED",
                });
            }

            req.user = user;
            req.userId = user._id;
            req.userRole = user.role;
            next();
        });
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message,
        });
    }
};

// ============================================
// ROLE-BASED AUTHORIZATION
// ============================================

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(" or ")}`,
                code: "INSUFFICIENT_PERMISSIONS",
            });
        }
        next();
    };
};

// ============================================
// OPTIONAL AUTHENTICATION (for public routes with optional auth)
// ============================================

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // No token provided, continue without authentication
            req.user = null;
            req.userId = null;
            return next();
        }

        const token = authHeader.split(" ")[1];
        const secret =
            process.env.JWT_ACCESS_SECRET ||
            process.env.OAUTH_SECRET ||
            process.env.SECRET_KEY;

        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                // Token is invalid or expired, continue without authentication
                req.user = null;
                req.userId = null;
                return next();
            }

            const user = await User.findById(decoded.id);
            if (user && user.accountStatus !== "blocked") {
                req.user = user;
                req.userId = user._id;
                req.userRole = user.role;
            } else {
                req.user = null;
                req.userId = null;
            }
            next();
        });
    } catch (error) {
        req.user = null;
        req.userId = null;
        next();
    }
};
