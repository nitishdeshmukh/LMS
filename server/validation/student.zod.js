import { z } from "zod";

// Profile Update Schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  collegeName: z.string().min(1, "College name is required"),
  courseName: z.string().min(1, "Course name is required"),
  yearOfStudy: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year"], {
    errorMap: () => ({ message: "Please select a valid year" }),
  }),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
});

// Avatar Update Schema
export const updateAvatarSchema = z.object({
  avatar: z.string().url("Invalid avatar URL"),
});

// Privacy Settings Schema
export const updatePrivacySchema = z.object({
  isProfileLocked: z.boolean(),
});

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Support Query Schema
export const createSupportQuerySchema = z.object({
  email: z.string().email("Invalid email address"),
  category: z.enum(["courses", "assignments", "quizzes", "certificates", "other"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Referral Code Schema
export const applyReferralCodeSchema = z.object({
  referralCode: z.string().min(1, "Referral code is required"),
});

// Quiz Submission Schema
export const submitQuizSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  quizId: z.string().min(1, "Quiz ID is required"),
  answers: z.record(z.string(), z.number()), // { questionId: selectedOptionIndex }
});

// Assignment Submission Schema
export const submitAssignmentSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  taskId: z.string().min(1, "Task ID is required"),
  githubLink: z.string().url("Invalid GitHub URL").refine(
    (url) => url.includes("github.com"),
    { message: "Must be a valid GitHub repository URL" }
  ),
  additionalNotes: z.string().optional(),
});

// Lesson Completion Schema
export const markLessonCompleteSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  moduleId: z.string().min(1, "Module ID is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
});

// Leaderboard Query Schema
export const leaderboardQuerySchema = z.object({
  type: z.enum(["global", "course"]).optional().default("global"),
  courseId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  page: z.coerce.number().min(1).optional().default(1),
});

// Courses Query Schema
export const coursesQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(10),
  search: z.string().optional(),
});
