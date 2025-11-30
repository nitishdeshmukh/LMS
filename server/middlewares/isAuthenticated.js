import jwt from "jsonwebtoken";
import { Student, Admin } from "../models/index.js";
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
                    return res.status(401).json({
                        success: false,
                        message: "Access token has expired",
                        code: "TOKEN_EXPIRED",
                    });
                }
                if (err.name === "JsonWebTokenError") {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid access token",
                        code: "INVALID_TOKEN",
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: "Token verification failed",
                    code: "TOKEN_VERIFICATION_FAILED",
                });
            }

            const { id, role } = decoded;

            let user;
            if (role === "admin") {
                user = await Admin.findById(id).select("-password -refreshToken");
            } else {
                user = await Student.findById(id).select("-lmsPassword -refreshToken");
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    code: "USER_NOT_FOUND",
                });
            }

            // Check if user is blocked (for students)
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
            req.userRole = role || "student";
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

            const { role } = decoded;
            let user;
            if (role === "admin") {
                user = await Admin.findById(decoded.id);
            } else {
                user = await Student.findById(decoded.id);
            }

            if (user && user.accountStatus !== "blocked") {
                req.user = user;
                req.userId = user._id;
                req.userRole = role || "student";
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
