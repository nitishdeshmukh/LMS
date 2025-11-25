import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    // BASIC AUTH
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email"],
    },

    password: { type: String, select: false }, // Login password IF using email

    googleId: { type: String, select: false },
    githubId: { type: String, select: false },

    // PROFILE
    name: { type: String, required: true, trim: true },
    middleName: { type: String },
    lastName: { type: String },

    phoneNumber: { type: String },
    alternatePhone: { type: String },

    collegeName: { type: String },
    courseName: { type: String }, // Degree like B.Tech/BCA
    yearOfStudy: { type: String },

    avatar: {
      type: String,
      default:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    },

    // ROLES & ACCOUNT STATE
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      index: true,
    },

    accountStatus: {
      type: String,
      enum: ["pending", "verified", "blocked"],
      default: "pending",
    },

    // ⚡ LMS LOGIN CREDENTIALS (Admin-assigned)
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

    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// HASH NORMAL LOGIN PASSWORD
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Hash LMS password
  if (this.isModified("lmsPassword") && this.lmsPassword) {
    const salt = await bcrypt.genSalt(10);
    this.lmsPassword = await bcrypt.hash(this.lmsPassword, salt);
  }

  next();
});

// PASSWORD CHECK
userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.matchLmsPassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.lmsPassword);
};

// RESET TOKEN
userSchema.methods.createResetPasswordToken = function () {
  const rawToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 3600000;
  return rawToken;
};

// AUTO REFERRAL CODE
userSchema.pre("validate", function (next) {
  if (!this.myReferralCode && this.name) {
    const prefix = this.name
      .replace(/[^A-Za-z]/g, "")
      .substring(0, 4)
      .toUpperCase();
    const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
    this.myReferralCode = `${prefix}-${rand}`;
  }
  next();
});

export default mongoose.model("User", userSchema);
