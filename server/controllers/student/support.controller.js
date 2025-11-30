import { createSupportQuerySchema } from "../../validation/student.zod.js";
import { SupportQuery } from "../../models/index.js";
import { ERROR_CODES } from "../../middlewares/globalErrorHandler.js";

/**
 * POST /api/student/support
 * Create support query
 */
export const createSupportQuery = async (req, res) => {
    try {
        const validation = createSupportQuerySchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: ERROR_CODES.VALIDATION_ERROR,
                errors: validation.error.errors,
            });
        }

        const query = await SupportQuery.create({
            student: req.userId,
            ...validation.data,
        });

        res.status(201).json({
            success: true,
            data: query,
            message:
                "Support query submitted successfully. We'll get back to you within 24 hours.",
        });
    } catch (error) {
        console.error("Create support query error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit support query",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};

/**
 * GET /api/student/support
 * Get student's support queries
 */
export const getSupportQueries = async (req, res) => {
    try {
        const queries = await SupportQuery.find({ student: req.userId }).sort({
            createdAt: -1,
        });

        res.status(200).json({ success: true, data: queries });
    } catch (error) {
        console.error("Get support queries error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch support queries",
            code: ERROR_CODES.INTERNAL_ERROR,
        });
    }
};
