import api from '../api';

// ============================================
// DASHBOARD
// ============================================

export const getDashboard = async () => {
  const response = await api.get('/student/dashboard');
  return response.data;
};

// ============================================
// PROFILE
// ============================================

export const getProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const updateProfile = async profileData => {
  const response = await api.put('/student/profile', profileData);
  return response.data;
};

export const updateAvatar = async avatarUrl => {
  const response = await api.put('/student/profile/avatar', { avatar: avatarUrl });
  return response.data;
};

// ============================================
// SETTINGS
// ============================================

export const updatePrivacy = async isProfileLocked => {
  const response = await api.put('/student/settings/privacy', { isProfileLocked });
  return response.data;
};

export const changePassword = async passwordData => {
  const response = await api.put('/student/settings/password', passwordData);
  return response.data;
};

// ============================================
// COURSES
// ============================================

export const getMyCourses = async () => {
  const response = await api.get('/student/courses');
  return response.data;
};

export const getCourseDetails = async slug => {
  const response = await api.get(`/student/courses/${slug}`);
  return response.data;
};

export const getCourseModules = async slug => {
  const response = await api.get(`/student/courses/${slug}/modules`);
  return response.data;
};

// ============================================
// QUIZZES
// ============================================

export const getQuizzesByCourse = async () => {
  const response = await api.get('/student/quizzes');
  return response.data;
};

export const getCourseQuizzes = async slug => {
  const response = await api.get(`/student/courses/${slug}/quizzes`);
  return response.data;
};

export const getQuizQuestions = async (slug, quizId) => {
  const response = await api.get(`/student/courses/${slug}/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async quizData => {
  const response = await api.post('/student/quizzes/submit', quizData);
  return response.data;
};

// ============================================
// ASSIGNMENTS
// ============================================

export const getAssignmentsByCourse = async () => {
  const response = await api.get('/student/assignments');
  return response.data;
};

export const getCourseAssignments = async slug => {
  const response = await api.get(`/student/courses/${slug}/assignments`);
  return response.data;
};

export const submitAssignment = async assignmentData => {
  const response = await api.post('/student/assignments/submit', assignmentData);
  return response.data;
};

// ============================================
// MODULE PROGRESS
// ============================================

export const markModuleAccessed = async moduleData => {
  const response = await api.post('/student/modules/access', moduleData);
  return response.data;
};

export const getCourseProgress = async slug => {
  const response = await api.get(`/student/courses/${slug}/progress`);
  return response.data;
};

// ============================================
// CERTIFICATES
// ============================================

export const getCertificates = async () => {
  const response = await api.get('/student/certificates');
  return response.data;
};

export const getCourseCertificate = async courseSlug => {
  const response = await api.get(`/student/certificates/${courseSlug}`);
  return response.data;
};

// ============================================
// PAYMENT
// ============================================

export const submitFullPayment = async (enrollmentId, paymentData) => {
  const formData = new FormData();
  formData.append('accountHolderName', paymentData.accountHolderName);
  formData.append('bankName', paymentData.bankName);
  formData.append('ifscCode', paymentData.ifscCode);
  formData.append('accountNumber', paymentData.accountNumber);
  formData.append('transactionId', paymentData.transactionId);
  formData.append('paymentType', 'full');
  if (paymentData.screenshot) {
    formData.append('screenshot', paymentData.screenshot);
  }

  const response = await api.post(`/public/payment/${enrollmentId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// ============================================
// LEADERBOARD
// ============================================

export const getLeaderboard = async (params = {}) => {
  const response = await api.get('/student/leaderboard', { params });
  return response.data;
};

// ============================================
// REFERRAL
// ============================================

export const getReferralInfo = async () => {
  const response = await api.get('/student/referral');
  return response.data;
};

export const applyReferralCode = async referralCode => {
  const response = await api.post('/student/referral/apply', { referralCode });
  return response.data;
};

// ============================================
// SUPPORT
// ============================================

export const createSupportQuery = async queryData => {
  const response = await api.post('/student/support', queryData);
  return response.data;
};

export const getSupportQueries = async () => {
  const response = await api.get('/student/support');
  return response.data;
};

// ============================================
// LOGOUT FROM ALL DEVICES
// ============================================

export const logoutFromAllDevices = async () => {
  const response = await api.post('/auth/logout-all');
  return response.data;
};

// Export all student service functions as a single object
const studentService = {
  getDashboard,
  getProfile,
  updateProfile,
  updateAvatar,
  updatePrivacy,
  changePassword,
  getMyCourses,
  getCourseDetails,
  getCourseModules,
  getQuizzesByCourse,
  getCourseQuizzes,
  getQuizQuestions,
  submitQuiz,
  getAssignmentsByCourse,
  getCourseAssignments,
  submitAssignment,
  markModuleAccessed,
  getCourseProgress,
  getCertificates,
  getCourseCertificate,
  submitFullPayment,
  getLeaderboard,
  getReferralInfo,
  applyReferralCode,
  createSupportQuery,
  getSupportQueries,
  logoutFromAllDevices,
};

export default studentService;
