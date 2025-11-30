import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: `${API_URL}/student`,
});

// Add auth token to requests dynamically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// DASHBOARD
// ============================================

export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

// ============================================
// PROFILE
// ============================================

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async profileData => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

export const updateAvatar = async avatarUrl => {
  const response = await api.put('/profile/avatar', { avatar: avatarUrl });
  return response.data;
};

// ============================================
// SETTINGS
// ============================================

export const updatePrivacy = async isProfileLocked => {
  const response = await api.put('/settings/privacy', { isProfileLocked });
  return response.data;
};

export const changePassword = async passwordData => {
  const response = await api.put('/settings/password', passwordData);
  return response.data;
};

// ============================================
// COURSES
// ============================================

export const getMyCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const getCourseDetails = async slug => {
  const response = await api.get(`/courses/${slug}`);
  return response.data;
};

export const getCourseModules = async slug => {
  const response = await api.get(`/courses/${slug}/modules`);
  return response.data;
};

// ============================================
// QUIZZES
// ============================================

export const getQuizzesByCourse = async () => {
  const response = await api.get('/quizzes');
  return response.data;
};

export const getCourseQuizzes = async slug => {
  const response = await api.get(`/courses/${slug}/quizzes`);
  return response.data;
};

export const getQuizQuestions = async (slug, quizId) => {
  const response = await api.get(`/courses/${slug}/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async quizData => {
  const response = await api.post('/quizzes/submit', quizData);
  return response.data;
};

// ============================================
// ASSIGNMENTS
// ============================================

export const getAssignmentsByCourse = async () => {
  const response = await api.get('/assignments');
  return response.data;
};

export const getCourseAssignments = async slug => {
  const response = await api.get(`/courses/${slug}/assignments`);
  return response.data;
};

export const submitAssignment = async assignmentData => {
  const response = await api.post('/assignments/submit', assignmentData);
  return response.data;
};

// ============================================
// LESSONS
// ============================================

export const markLessonComplete = async lessonData => {
  const response = await api.post('/lessons/complete', lessonData);
  return response.data;
};

// ============================================
// CERTIFICATES
// ============================================

export const getCertificates = async () => {
  const response = await api.get('/certificates');
  return response.data;
};

export const getCourseCertificate = async courseSlug => {
  const response = await api.get(`/certificates/${courseSlug}`);
  return response.data;
};

// ============================================
// LEADERBOARD
// ============================================

export const getLeaderboard = async (params = {}) => {
  const response = await api.get('/leaderboard', { params });
  return response.data;
};

// ============================================
// REFERRAL
// ============================================

export const getReferralInfo = async () => {
  const response = await api.get('/referral');
  return response.data;
};

export const applyReferralCode = async referralCode => {
  const response = await api.post('/referral/apply', { referralCode });
  return response.data;
};

// ============================================
// SUPPORT
// ============================================

export const createSupportQuery = async queryData => {
  const response = await api.post('/support', queryData);
  return response.data;
};

export const getSupportQueries = async () => {
  const response = await api.get('/support');
  return response.data;
};

// ============================================
// STREAK
// ============================================

export const updateStreak = async () => {
  const response = await api.post('/streak/update');
  return response.data;
};

export default api;
