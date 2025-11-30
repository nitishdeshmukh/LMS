import express from "express";
import upload from "../../middlewares/uploadMiddleware.js";
import { PaymentController } from "../../controllers/public/index.js";
import { PaymentProofValidation } from "../../validation/index.js";

const router = express.Router();

const uploadPaymentScreenshot = (req, res, next) => {
    const uploadSingle = upload;

    uploadSingle(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed",
            });
        }

        next();
    });
};

// POST /api/payment/submit - Submit payment proof
router.post(
    "/submit",
    uploadPaymentScreenshot,
    PaymentProofValidation.validatePaymentProof,
    PaymentController.submitPaymentProof
);

//Update payment status (Admin only)
router.patch("/:paymentId/status", PaymentController.updatePaymentStatus);

export default router;
