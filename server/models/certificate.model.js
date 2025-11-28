import mongoose from "mongoose";
import crypto from "crypto";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, unique: true, index: true },

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

    issueDate: { type: Date, default: Date.now },

    studentNameSnapshot: { type: String, required: true },
    courseNameSnapshot: { type: String, required: true },

    pdfUrl: { type: String },
  },
  { timestamps: true }
);

certificateSchema.pre("validate", function (next) {
  if (!this.certificateId) {
    this.certificateId = `C2D-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;
  }
  next();
});

export default mongoose.model("Certificate", certificateSchema);
