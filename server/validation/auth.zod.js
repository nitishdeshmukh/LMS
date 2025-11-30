import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

// Middleware function for Login Validation
export const validateLogin = (req, res, next) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        handleZodError(error, res);
    }
};

// LMS Login Schema (for students with issued credentials)
export const lmsLoginSchema = z.object({
    lmsId: z.string().min(1, "LMS ID is required"),
    lmsPassword: z.string().min(1, "Password is required"),
});

// Middleware function for LMS Login Validation
export const validateLmsLogin = (req, res, next) => {
    try {
        const validatedData = lmsLoginSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        handleZodError(error, res);
    }
};

// Refresh Token Schema
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

// Middleware function for Refresh Token Validation
export const validateRefreshToken = (req, res, next) => {
    try {
        const validatedData = refreshTokenSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        handleZodError(error, res);
    }
};


// Forgot Password Schema
export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email address"),
});

// Middleware function for Forgot Password Validation
export const validateForgotPassword = (req, res, next) => {
    try {
        const validatedData = forgotPasswordSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        handleZodError(error, res);
    }
};

// Reset Password Schema
export const resetPasswordSchema = z
    .object({
        token: z.string().min(1, "Reset token is required"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });


// Middleware function for Reset Password Validation
export const validateResetPassword = (req, res, next) => {
    try {
        const validatedData = resetPasswordSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        handleZodError(error, res);
    }
};

// Utility function to handle Zod validation errors
const handleZodError = (error, res) => {
    if (error instanceof z.ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }

    return res.status(500).json({
        success: false,
        message: "An unexpected error occurred during validation",
        error: error?.message || "Unknown error",
    });
};
