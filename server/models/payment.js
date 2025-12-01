import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        // Bank Details (submitted by student)
        accountHolderName: { type: String, required: true },
        bankName: { type: String, required: true },
        ifscCode: { type: String, required: true },
        accountNumber: { type: String, required: true },

        // Payment Proof
        transactionId: { type: String, required: true, index: true },
        screenshotUrl: { type: String }, // optional file upload URL

        // Payment Meta
        amount: { type: Number, default: 500 },
        currency: { type: String, default: "INR" },

        // Auto timestamps
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
