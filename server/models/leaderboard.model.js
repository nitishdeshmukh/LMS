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

    // XP and Points
    xp: { type: Number, default: 0 },
    
    // Learning Stats
    streak: { type: Number, default: 0 },
    hoursLearned: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    assignmentsCompleted: { type: Number, default: 0 },
    
    // Calculated rank
    rank: { type: Number },

    type: { type: String, enum: ["global", "course"], default: "global" },
    
    // Period for time-based leaderboards
    period: { type: String, enum: ["weekly", "monthly", "alltime"], default: "alltime" },
  },
  { timestamps: true }
);

// Compound index for efficient queries
leaderboardSchema.index({ type: 1, course: 1, xp: -1 });
leaderboardSchema.index({ student: 1, type: 1, course: 1 }, { unique: true });

export default mongoose.model("Leaderboard", leaderboardSchema);
