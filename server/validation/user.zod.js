import { z } from "zod";

export const userSchema = z.object({
    // BASIC AUTH
    email: z.string().email(),
    password: z.string().min(8).optional(), 

    googleId: z.string().optional(),
    githubId: z.string().optional(),

    // PROFILE
    name: z.string().min(1),
    middleName: z.string().optional(),
    lastName: z.string().optional(),

    phoneNumber: z.string().optional(),
    alternatePhone: z.string().optional(),

    collegeName: z.string().optional(),
    courseName: z.string().optional(),
    yearOfStudy: z.string().optional(),

    avatar: z.string().optional(),

  // SOCIAL LINKS
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),

  // PRIVACY
  isProfileLocked: z.boolean().optional(),

  // GAMIFICATION
  xp: z.number().int().optional(),
  streak: z.number().int().optional(),
  lastStreakDate: z.date().optional(),
  hoursLearned: z.number().optional(),
  quizzesCompleted: z.number().int().optional(),
  assignmentsCompleted: z.number().int().optional(),

  // ROLES & ACCOUNT STATE
  role: z.enum(["student", "admin"]).optional(),
  accountStatus: z.enum(["pending", "verified", "blocked"]).optional(),

    // ⚡ LMS LOGIN CREDENTIALS (Admin-assigned)
    lmsId: z.string().optional(),
    lmsPassword: z.string().optional(),

    // REFERRALS
    myReferralCode: z.string().optional(),
    referredBy: z.string().optional(),
    referralCount: z.number().int().optional(),
    isPremiumUnlocked: z.boolean().optional(),

    // SECURITY
    resetPasswordToken: z.string().optional(),
    resetPasswordExpire: z.date().optional(),

    lastLogin: z.date().optional(),
});
