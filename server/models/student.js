// models/student.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const studentSchema = new mongoose.Schema(
    {
        // BASIC AUTH
        email: { type: String, unique: true, lowercase: true, trim: true },
        googleId: { type: String, select: false },
        githubId: { type: String, select: false },

        // PROFILE
        name: { type: String, trim: true },
        middleName: { type: String },
        lastName: { type: String },
        phoneNumber: { type: String },
        alternatePhone: { type: String },
        collegeName: { type: String },
        courseName: { type: String },
        yearOfStudy: { type: String },

        avatar: { type: String },

        // SOCIAL LINKS
        linkedin: { type: String },
        github: { type: String },
        portfolio: { type: String },

        // PRIVACY
        isProfileLocked: { type: Boolean, default: false },

        // GAMIFICATION
        xp: { type: Number, default: 0 },
        hoursLearned: { type: Number, default: 0 },
        quizzesCompleted: { type: Number, default: 0 },
        assignmentsCompleted: { type: Number, default: 0 },

        //ACCOUNT STATE
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],

        accountStatus: {
            type: String,
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

        lastLogin: { type: Date },
    },
    { timestamps: true }
);

studentSchema.plugin(aggregatePaginate);

// Password hashing middleware
studentSchema.pre("save", async function (next) {
    if (this.isModified("lmsPassword") && this.lmsPassword) {
        const salt = await bcrypt.genSalt(10);
        this.lmsPassword = await bcrypt.hash(this.lmsPassword, salt);
    }
    next();
});

studentSchema.methods.matchLmsPassword = function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.lmsPassword);
};

studentSchema.methods.matchResetPasswordToken = function (plainToken) {
    const hashedToken = crypto
        .createHash("sha256")
        .update(plainToken)
        .digest("hex");

    return (
        this.resetPasswordToken === hashedToken &&
        this.resetPasswordExpire > Date.now()
    );
};

studentSchema.methods.createResetPasswordToken = function () {
    const rawToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 3600000;
    return rawToken;
};

studentSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            avatar: this.avatar,
            name: this.name,
            role: "student",
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

studentSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            role: "student",
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

studentSchema.methods.generateLmsId = function () {
    const uuid = crypto.randomUUID();
    this.lmsId = `LMS00-${uuid}`;
    return this.lmsId;
};


studentSchema.pre("validate", function (next) {
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

export default mongoose.model("Student", studentSchema);
