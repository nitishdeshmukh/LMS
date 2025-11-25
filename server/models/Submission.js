import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

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

    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },

    type: { type: String, enum: ["assignment", "quiz"], required: true },

    fileUrl: { type: String },
    githubLink: { type: String },

    quizScore: { type: Number },
    totalQuestions: { type: Number },

    status: {
      type: String,
      enum: ["submitted", "graded", "rejected"],
      default: "submitted",
    },

    grade: { type: String },
    feedback: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
