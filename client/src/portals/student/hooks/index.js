// Dashboard Hook
export { useDashboard } from './useDashboard';

// Course Hooks
export {
  useMyCourses,
  useCourseDetails,
  useCourseModules,
  useMarkModuleAccessed,
  useCourseProgress,
  useQuizQuestions,
  useSubmitQuiz,
  useQuizzesByCourse,
  useCourseQuizzes,
  useAssignmentsByCourse,
  useCourseAssignments,
  useSubmitAssignment,
  useLeaderboard,
} from './useCourses';

// Profile Hooks
export {
  useProfile,
  useUpdateProfile,
  useUpdateAvatar,
  useUpdatePrivacy,
  useChangePassword,
} from './useProfile';

// Certificates Hook
export { useCertificates, useCourseCertificate } from './useCertificates';

// Support Hooks
export { useSupportQueries, useCreateSupportQuery } from './useSupport';

// Referral Hooks
export { useReferralInfo, useApplyReferralCode } from './useReferral';
