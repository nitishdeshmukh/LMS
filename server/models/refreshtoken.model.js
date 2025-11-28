import mongoose from "mongoose";
import crypto from "crypto";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

// Helper function for token family generation
const generateTokenFamily = () => {
    return crypto.randomBytes(16).toString("hex");
};

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        // Device/session info (optional but useful)
        userAgent: { type: String },
        ipAddress: { type: String },
        // For revoking specific sessions
        isRevoked: {
            type: Boolean,
            default: false,
        },
        // For token rotation - track if token was already used
        isUsed: {
            type: Boolean,
            default: false,
        },
        usedAt: {
            type: Date,
        },
        // Link to the token that replaced this one (for tracking chain)
        replacedByToken: {
            type: String,
        },
        // Token family for detecting reuse attacks
        family: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Index for efficient cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for finding tokens by user
refreshTokenSchema.index({ user: 1, isRevoked: 1 });

// Index for token family (for revoking entire chain on reuse detection)
refreshTokenSchema.index({ family: 1 });

// ============================================
// STATIC METHODS
// ============================================

// Save refresh token with cleanup (replaces standalone function)
refreshTokenSchema.statics.saveRefreshToken = async function (
    userId,
    token,
    req,
    family = null
) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    // Generate new family if not provided (new login session)
    const tokenFamily = family || generateTokenFamily();

    // Create the refresh token
    await this.create({
        user: userId,
        token,
        expiresAt,
        family: tokenFamily,
        userAgent: req.headers["user-agent"],
        ipAddress: req.ip || req.connection?.remoteAddress,
    });

    // Cleanup old tokens for this user (keep max 5 active families/sessions)
    const userFamilies = await this.aggregate([
        { $match: { user: userId, isRevoked: false, isUsed: false } },
        { $group: { _id: "$family", latestToken: { $last: "$createdAt" } } },
        { $sort: { latestToken: -1 } },
        { $skip: 5 },
    ]);

    if (userFamilies.length > 0) {
        const familiesToDelete = userFamilies.map((f) => f._id);
        await this.deleteMany({ family: { $in: familiesToDelete } });
    }

    return tokenFamily;
};

// Static method to clean up expired/revoked tokens for a user
refreshTokenSchema.statics.cleanupUserTokens = async function (userId) {
    await this.deleteMany({
        user: userId,
        $or: [{ expiresAt: { $lt: new Date() } }, { isRevoked: true }],
    });
};

// Static method to revoke all tokens for a user (logout from all devices)
refreshTokenSchema.statics.revokeAllUserTokens = async function (userId) {
    await this.updateMany({ user: userId }, { isRevoked: true });
};

// Static method to revoke entire token family (on reuse detection)
refreshTokenSchema.statics.revokeTokenFamily = async function (family) {
    await this.updateMany({ family }, { isRevoked: true });
};

export default mongoose.model("RefreshToken", refreshTokenSchema);
