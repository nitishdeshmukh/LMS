import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
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

    // Checkout Form Details
    checkoutDetails: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
      collegeName: { type: String, required: true },
      degreeCourseName: { type: String, required: true },
      yearOfStudy: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      alternatePhone: { type: String },
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    transactionId: { type: String },
    amountPaid: { type: Number },
    enrollmentDate: { type: Date, default: Date.now },

    // ADDED: Admin Issues LMS Credentials
    lmsIssuedId: { type: String },
    lmsIssuedPassword: { type: String },

    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    progressPercentage: { type: Number, default: 0 },

    lastAccessedLesson: { type: mongoose.Schema.Types.ObjectId },

    isCompleted: { type: Boolean, default: false },
    completionDate: { type: Date },
    certificateId: { type: String },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
