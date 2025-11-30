import mongoose from "mongoose";

const coursePopularitySchema = new mongoose.Schema(
  {
    courseId: mongoose.Schema.Types.ObjectId,
    title: String,
    enrollments: { type: Number, default: 0 },
  },
  { _id: false }
);

const analyticsSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now, index: true },

    totalStudents: { type: Number, default: 0 },
    totalEnrollments: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },

    coursePopularity: [coursePopularitySchema],

    activeUsersToday: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
