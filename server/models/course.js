import mongoose from "mongoose";
import slugify from "slugify";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

// Quiz questions
const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: true }
);

// Lessons
const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "text", "quiz", "assignment", "project"],
      required: true,
    },
    contentUrls: [{ type: String }],
    duration: { type: Number },
    isFreePreview: { type: Boolean, default: false },
    notes: { type: String },
  },
  { _id: true }
);

// Assignments / Tasks
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueInDays: { type: Number },
    attachments: [{ type: String }],
  },
  { _id: true }
);

// Modules
const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    timeline: { type: String },
    description: { type: String },

    textLinks: [{ type: String }],
    videoLinks: [{ type: String }],

    lessons: [lessonSchema],
    tasks: [taskSchema],

    quizzes: [
      {
        title: { type: String },
        questions: [questionSchema],
      },
    ],

    order: { type: Number, default: 0 },
  },
  { _id: true }
);

// Capstone projects
const capstoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    requirements: [{ type: String }],
    deliverables: [{ type: String }],
    isLocked: { type: Boolean, default: true },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        slug: { type: String, lowercase: true, index: true },
        description: { type: String, required: true },
        thumbnail: { type: String },

        stream: { type: String, required: true, index: true },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },

        price: { type: Number, default: 500 },
        discountedPrice: { type: Number },

        modules: [moduleSchema],
        capstoneProjects: [capstoneSchema],

        totalDuration: { type: String },
        enrolledCount: { type: Number, default: 0, index: true },
        isPublished: { type: Boolean, default: false, index: true },

        courseVersion: { type: String, default: "1.0.0" },
        tags: [{ type: String }],
        difficultyIndex: { type: Number, default: 1, min: 0, max: 5 },

        instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);


courseSchema.plugin(aggregatePaginate);

// Auto slug if missing
courseSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

export default mongoose.model("Course", courseSchema);
