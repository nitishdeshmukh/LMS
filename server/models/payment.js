import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        // Relations
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        enrollment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },

        // Bank Details (submitted by student)
        accountHolderName: { type: String, required: true },
        bankName: { type: String, required: true },
        ifscCode: { type: String, required: true },
        accountNumber: { type: String, required: true },

        // Payment Proof
        transactionId: { type: String, required: true, index: true },
        screenshotUrl: { type: String }, // optional file upload URL

        // Payment Meta
        amount: { type: Number, default: 500 }, // or dynamic
        currency: { type: String, default: "INR" },

        // Status of validation
        status: {
            type: String,
            enum: ["Submitted", "Verified", "Rejected"],
            default: "Submitted",
            index: true,
        },

        // Admin verification notes
        adminRemarks: { type: String },

        // Auto timestamps
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
