import { publicApi } from '../api';
import api from '../api';

// ============================================
// LANDING PAGE
// ============================================

export const getLandingPageData = async () => {
  const response = await publicApi.get('/public/landing');
  return response.data;
};

export const getFeaturedCourses = async () => {
  const response = await publicApi.get('/public/courses/featured');
  return response.data;
};

export const getTestimonials = async () => {
  const response = await publicApi.get('/public/testimonials');
  return response.data;
};

// ============================================
// ABOUT
// ============================================

export const getAboutPageData = async () => {
  const response = await publicApi.get('/public/about');
  return response.data;
};

export const getTeamMembers = async () => {
  const response = await publicApi.get('/public/team');
  return response.data;
};

// ============================================
// COURSES (Public)
// ============================================

export const getPublicCourses = async () => {
  const response = await publicApi.get('/public/get/all/courses');
  return response.data;
};

export const getPublicCourseBySlug = async slug => {
  const response = await publicApi.get(`/public/get/course/deatils/${slug}`);
  return response.data;
};

// ============================================
// CONTACT
// ============================================

export const submitContactForm = async contactData => {
  const response = await publicApi.post('/public/contact', contactData);
  return response.data;
};

// ============================================
// FAQ
// ============================================

export const getFAQs = async () => {
  const response = await publicApi.get('/public/faqs');
  return response.data;
};

// ============================================
// ENROLLMENT
// ============================================

export const submitEnrollment = async enrollmentData => {
  const response = await api.post('/public/enroll', enrollmentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Export all public service functions as a single object
const publicService = {
  getLandingPageData,
  getFeaturedCourses,
  getTestimonials,
  getAboutPageData,
  getTeamMembers,
  getPublicCourses,
  getPublicCourseBySlug,
  submitContactForm,
  getFAQs,
  submitEnrollment,
};

export default publicService;
