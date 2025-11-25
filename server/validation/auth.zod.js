import { z } from "zod";

// Register Schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  collegeName: z.string().optional(),
  courseName: z.string().optional(),
  yearOfStudy: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// LMS Login Schema (for students with issued credentials)
export const lmsLoginSchema = z.object({
  lmsId: z.string().min(1, "LMS ID is required"),
  lmsPassword: z.string().min(1, "Password is required"),
});

// Refresh Token Schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
