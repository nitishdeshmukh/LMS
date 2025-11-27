import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // BASIC AUTH
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    googleId: { type: String, select: false },
    githubId: { type: String, select: false },

    // PROFILE
    name: { type: String, required: true, trim: true },
    middleName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    alternatePhone: { type: String },
    collegeName: { type: String },
    courseName: { type: String },
    yearOfStudy: { type: String },

    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },

    // SOCIAL LINKS
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },

    // PRIVACY
    isProfileLocked: { type: Boolean, default: false },

    // GAMIFICATION
    xp: { type: Number, default: 0 },
    hoursLearned: { type: Number, default: 0 },

    // ROLES & ACCOUNT STATE
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      index: true,
    },

    courses: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
      }
    ],

    accountStatus: {
      type: String,
      enum: ["unenrolled", "pending", "verified", "blocked"],
      default: "unenrolled",
    },

    // LMS LOGIN
    lmsId: { type: String, unique: true, sparse: true },
    lmsPassword: { type: String, select: false },

    // REFERRALS
    myReferralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },
    referralCount: { type: Number, default: 0 },
    isPremiumUnlocked: { type: Boolean, default: false },

    // SECURITY
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date },

    lastLogin: { type: Date }
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("lmsPassword") && this.lmsPassword) {
    const salt = await bcrypt.genSalt(10);
    this.lmsPassword = await bcrypt.hash(this.lmsPassword, salt);
  }
  next();
});

// Password checker
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.matchLmsPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.lmsPassword);
};

// Reset token logic
userSchema.methods.createResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 3600000;
  return rawToken;
};

// Generate referral code
userSchema.pre("validate", function (next) {
  if (!this.myReferralCode && this.name) {
    const prefix = this.name.replace(/[^A-Za-z]/g, "").substring(0, 4).toUpperCase();
    const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
    this.myReferralCode = `${prefix}-${rand}`;
  }
  next();
});

export default mongoose.model("User", userSchema);
