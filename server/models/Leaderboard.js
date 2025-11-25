import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    score: { type: Number, default: 0 },
    rank: { type: Number },

    type: { type: String, enum: ["global", "course"], default: "global" },
  },
  { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
