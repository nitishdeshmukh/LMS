import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        
        partialPaymentDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
        fullPaymentDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
        paymentStatus: {
            type: String,
            enum: ["UNPAID", "PARTIAL_PAYMENT_VERIFICATION_PENDING", "PARTIAL_PAID", "FULLY_PAYMENT_VERIFICATION_PENDING", "FULLY_PAID"],
            default: "UNPAID",
        },

        courseAmount: { type: Number },
        amountPaid: { type: Number },
        amountRemaining: { type: Number },
        enrollmentDate: { type: Date, default: Date.now },

        // Progress tracking - completed quizzes and tasks
        completedQuizzes: [{ type: mongoose.Schema.Types.ObjectId }],
        completedTasks: [{ type: mongoose.Schema.Types.ObjectId }],
        completedModules: [{ type: mongoose.Schema.Types.ObjectId }],

        progressPercentage: { type: Number, default: 0 },

        lastAccessedModule: { type: mongoose.Schema.Types.ObjectId },

        isCompleted: { type: Boolean, default: false },
        completionDate: { type: Date },
        certificateId: { type: String },
    },
    { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
