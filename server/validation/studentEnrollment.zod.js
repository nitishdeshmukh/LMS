import { z } from "zod";

// Enrollment validation schema
export const enrollmentSchema = z.object({
    // Personal Information
    name: z
        .string()
        .trim()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "First name should contain only letters"),

    middleName: z
        .string()
        .trim()
        .max(50, "Middle name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]*$/, "Middle name should contain only letters")
        .optional()
        .or(z.literal("")),

    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required")
        .max(50, "Last name must not exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Last name should contain only letters"),

    // Academic Details
    collegeName: z
        .string()
        .trim()
        .min(3, "College name must be at least 3 characters")
        .max(200, "College name must not exceed 200 characters"),

    courseName: z
        .string()
        .trim()
        .min(2, "Degree/Course is required")
        .max(100, "Degree/Course must not exceed 100 characters"),

    yearOfStudy: z
        .string()
        .trim()
        .min(1, "Year of study is required")
        .refine((val) => val !== "Select Year", {
            message: "Please select a valid year of study",
        }),

    email: z.email("Please enter a valid email address"),

    phoneNumber: z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must not exceed 15 digits")
        .regex(
            /^\+?[1-9]\d{9,14}$/,
            "Please enter a valid phone number (e.g., +91XXXXXXXXXX)"
        ),

    alternatePhone: z
        .string()
        .trim()
        .regex(
            /^\+?[1-9]\d{9,14}$/,
            "Please enter a valid alternate phone number"
        )
        .optional()
        .or(z.literal("")),
});

// Middleware function - FIXED: Use .issues instead of .errors
export const validateEnrollment = (req, res, next) => {
    try {
        const validatedData = enrollmentSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        // console.error("Validation error:", error);

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
    }
};
