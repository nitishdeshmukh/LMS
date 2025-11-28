import { authApi } from '@/services/global/authService';

// Use authApi which has token refresh interceptor built-in
// baseURL for student endpoints
const STUDENT_BASE = '/student';

// ============================================
// DASHBOARD
// ============================================

export const getDashboard = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/dashboard`);
  return response.data;
};

// ============================================
// PROFILE
// ============================================

export const getProfile = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/profile`);
  return response.data;
};

export const updateProfile = async profileData => {
  const response = await authApi.put(`${STUDENT_BASE}/profile`, profileData);
  return response.data;
};

export const updateAvatar = async avatarUrl => {
  const response = await authApi.put(`${STUDENT_BASE}/profile/avatar`, { avatar: avatarUrl });
  return response.data;
};

// ============================================
// SETTINGS
// ============================================

export const updatePrivacy = async isProfileLocked => {
  const response = await authApi.put(`${STUDENT_BASE}/settings/privacy`, { isProfileLocked });
  return response.data;
};

export const changePassword = async passwordData => {
  const response = await authApi.put(`${STUDENT_BASE}/settings/password`, passwordData);
  return response.data;
};

// ============================================
// COURSES
// ============================================

export const getMyCourses = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/courses`);
  return response.data;
};

export const getCourseDetails = async slug => {
  const response = await authApi.get(`${STUDENT_BASE}/courses/${slug}`);
  return response.data;
};

export const getCourseModules = async slug => {
  const response = await authApi.get(`${STUDENT_BASE}/courses/${slug}/modules`);
  return response.data;
};

// ============================================
// QUIZZES
// ============================================

export const getQuizzesByCourse = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/quizzes`);
  return response.data;
};

export const getCourseQuizzes = async slug => {
  const response = await authApi.get(`${STUDENT_BASE}/courses/${slug}/quizzes`);
  return response.data;
};

export const getQuizQuestions = async (slug, quizId) => {
  const response = await authApi.get(`${STUDENT_BASE}/courses/${slug}/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async quizData => {
  const response = await authApi.post(`${STUDENT_BASE}/quizzes/submit`, quizData);
  return response.data;
};

// ============================================
// ASSIGNMENTS
// ============================================

export const getAssignmentsByCourse = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/assignments`);
  return response.data;
};

export const getCourseAssignments = async slug => {
  const response = await authApi.get(`${STUDENT_BASE}/courses/${slug}/assignments`);
  return response.data;
};

export const submitAssignment = async assignmentData => {
  const response = await authApi.post(`${STUDENT_BASE}/assignments/submit`, assignmentData);
  return response.data;
};

// ============================================
// LESSONS
// ============================================

export const markLessonComplete = async lessonData => {
  const response = await authApi.post(`${STUDENT_BASE}/lessons/complete`, lessonData);
  return response.data;
};

// ============================================
// CERTIFICATES
// ============================================

export const getCertificates = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/certificates`);
  return response.data;
};

export const getCourseCertificate = async courseSlug => {
  const response = await authApi.get(`${STUDENT_BASE}/certificates/${courseSlug}`);
  return response.data;
};

// ============================================
// LEADERBOARD
// ============================================

export const getLeaderboard = async (params = {}) => {
  const response = await authApi.get(`${STUDENT_BASE}/leaderboard`, { params });
  return response.data;
};

// ============================================
// REFERRAL
// ============================================

export const getReferralInfo = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/referral`);
  return response.data;
};

export const applyReferralCode = async referralCode => {
  const response = await authApi.post(`${STUDENT_BASE}/referral/apply`, { referralCode });
  return response.data;
};

// ============================================
// SUPPORT
// ============================================

export const createSupportQuery = async queryData => {
  const response = await authApi.post(`${STUDENT_BASE}/support`, queryData);
  return response.data;
};

export const getSupportQueries = async () => {
  const response = await authApi.get(`${STUDENT_BASE}/support`);
  return response.data;
};

// ============================================
// STREAK
// ============================================

export const updateStreak = async () => {
  const response = await authApi.post(`${STUDENT_BASE}/streak/update`);
  return response.data;
};
