import mongoose from "mongoose";

const supportQuerySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    email: { type: String, required: true },

    category: {
      type: String,
      enum: ["courses", "assignments", "quizzes", "certificates", "other"],
      required: true,
    },

    message: { type: String, required: true },

    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "closed"],
      default: "open",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    adminResponse: { type: String },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    respondedAt: { type: Date },

    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for efficient queries
supportQuerySchema.index({ student: 1, status: 1 });
supportQuerySchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("SupportQuery", supportQuerySchema);
