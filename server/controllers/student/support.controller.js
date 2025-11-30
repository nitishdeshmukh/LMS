import SupportQuery from "../../models/SupportQuery.js";
import { createSupportQuerySchema } from "../../validation/student.zod.js";

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
      message: "Support query submitted successfully. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

    res.json({ success: true, data: queries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
