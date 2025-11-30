import errorHandler from "../utils/errorHandler.js";

/**
 * Error code mappings for consistent error responses
 */
export const ERROR_CODES = {
    // Authentication errors (401)
    UNAUTHORIZED: "UNAUTHORIZED",
    TOKEN_EXPIRED: "TOKEN_EXPIRED",
    INVALID_TOKEN: "INVALID_TOKEN",
    TOKEN_VERIFICATION_FAILED: "TOKEN_VERIFICATION_FAILED",
    REFRESH_TOKEN_INVALID: "REFRESH_TOKEN_INVALID",
    REFRESH_TOKEN_EXPIRED: "REFRESH_TOKEN_EXPIRED",
    REFRESH_TOKEN_REVOKED: "REFRESH_TOKEN_REVOKED",
    TOKEN_REUSE_DETECTED: "TOKEN_REUSE_DETECTED",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",

    // Authorization errors (403)
    FORBIDDEN: "FORBIDDEN",
    ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",
    INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
    NOT_ENROLLED: "NOT_ENROLLED",

    // Not found errors (404)
    NOT_FOUND: "NOT_FOUND",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    COURSE_NOT_FOUND: "COURSE_NOT_FOUND",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",

    // Validation errors (400)
    VALIDATION_ERROR: "VALIDATION_ERROR",
    BAD_REQUEST: "BAD_REQUEST",
    INVALID_INPUT: "INVALID_INPUT",

    // Conflict errors (409)
    CONFLICT: "CONFLICT",
    DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
    ALREADY_EXISTS: "ALREADY_EXISTS",

    // Server errors (500)
    INTERNAL_ERROR: "INTERNAL_ERROR",
    DATABASE_ERROR: "DATABASE_ERROR",
};

/**
 * Global error handler middleware
 * Catches all errors and sends consistent JSON response
 */
export const globalErrorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error("Error:", {
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });

    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let code = err.code || ERROR_CODES.INTERNAL_ERROR;
    let errors = err.errors || [];

    // Handle specific error types
    if (err.name === "ValidationError") {
        // Mongoose validation error
        statusCode = 400;
        code = ERROR_CODES.VALIDATION_ERROR;
        message = "Validation failed";
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    } else if (err.name === "CastError") {
        // Invalid ObjectId
        statusCode = 400;
        code = ERROR_CODES.INVALID_INPUT;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.code === 11000) {
        // MongoDB duplicate key error
        statusCode = 409;
        code = ERROR_CODES.DUPLICATE_ENTRY;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        code = ERROR_CODES.INVALID_TOKEN;
        message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        code = ERROR_CODES.TOKEN_EXPIRED;
        message = "Token has expired";
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        code,
        ...(errors.length > 0 && { errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

/**
 * 404 Not Found handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
    const error = new errorHandler(
        404,
        `Route ${req.originalUrl} not found`,
        ERROR_CODES.NOT_FOUND
    );
    next(error);
};

export default globalErrorHandler;
