import { z } from "zod";

// Simplified Payment Proof validation schema
export const paymentProofSchema = z.object({
    // Bank Details (required)
    accountHolderName: z
        .string()
        .trim()
        .min(3, "Account holder name must be at least 3 characters")
        .max(100, "Account holder name must not exceed 100 characters")
        .regex(
            /^[a-zA-Z\s.]+$/,
            "Account holder name should contain only letters"
        ),

    bankName: z
        .string()
        .trim()
        .min(3, "Bank name must be at least 3 characters")
        .max(100, "Bank name must not exceed 100 characters"),

    ifscCode: z
        .string()
        .trim()
        .length(11, "IFSC code must be exactly 11 characters")
        .regex(
            /^[A-Z]{4}0[A-Z0-9]{6}$/,
            "Invalid IFSC code format (e.g., SBIN0001234)"
        )
        .toUpperCase(),

    accountNumber: z
        .string()
        .trim()
        .min(9, "Account number must be at least 9 digits")
        .max(18, "Account number must not exceed 18 digits")
        .regex(/^[0-9]+$/, "Account number should contain only digits"),

    // Payment Proof (required)
    transactionId: z
        .string()
        .trim()
        .min(10, "Transaction ID/UTR must be at least 10 characters")
        .max(30, "Transaction ID/UTR must not exceed 30 characters")
        .regex(
            /^[A-Z0-9]+$/i,
            "Transaction ID should contain only alphanumeric characters"
        )
        .toUpperCase(),

    // Payment Type (required)
    paymentType: z
        .enum(["partial", "full"], {
            errorMap: () => ({ message: "Payment type must be 'partial' or 'full'" }),
        }),
});

// Middleware function
export const validatePaymentProof = (req, res, next) => {
    try {
        const validatedData = paymentProofSchema.parse(req.body);
        req.validatedData = validatedData;
        next();
    } catch (error) {
        console.error("Payment validation error:", error);

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
