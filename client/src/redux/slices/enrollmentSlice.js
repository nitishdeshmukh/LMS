import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  enrollmentDetails: {
    firstName: '',
    middleName: '',
    lastName: '',
    collegeName: '',
    degreeCourse: '',
    yearOfStudy: '',
    email: '',
    phoneNumber: '',
    alternatePhone: '',
  },
  paymentDetails: {
    accountHolderName: '',
    bankName: '',
    ifscCode: '',
    accountNumber: '',
    transactionId: '',
    screenshot: null, // ← Changed to store file object
    screenshotUrl: '', // ← For preview URL
  },
  courseId: '',
  referralCode: '',
  currentStep: 1,
  isSubmitted: false,
};

const enrollmentSlice = createSlice({
  name: 'enrollment',
  initialState,
  reducers: {
    setEnrollmentDetails: (state, action) => {
      state.enrollmentDetails = { ...state.enrollmentDetails, ...action.payload };
    },
    setPaymentDetails: (state, action) => {
      state.paymentDetails = { ...state.paymentDetails, ...action.payload };
    },
    setReferralCode: (state, action) => {
      state.referralCode = action.payload;
    },
    setCourseId: (state, action) => {
      state.courseId = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setIsSubmitted: (state, action) => {
      state.isSubmitted = action.payload;
    },
    resetEnrollment: () => initialState,
    updateEnrollmentField: (state, action) => {
      const { field, value } = action.payload;
      state.enrollmentDetails[field] = value;
    },
    updatePaymentField: (state, action) => {
      const { field, value } = action.payload;
      state.paymentDetails[field] = value;
    },
    setScreenshot: (state, action) => {
      state.paymentDetails.screenshot = action.payload.file;
      state.paymentDetails.screenshotUrl = action.payload.url;
    },
    clearScreenshot: state => {
      state.paymentDetails.screenshot = null;
      state.paymentDetails.screenshotUrl = '';
    },
  },
});

export const {
  setEnrollmentDetails,
  setPaymentDetails,
  setReferralCode,
  setCourseId,
  setCurrentStep,
  setIsSubmitted,
  resetEnrollment,
  updateEnrollmentField,
  updatePaymentField,
  setScreenshot,
  clearScreenshot,
} = enrollmentSlice.actions;

export const selectEnrollment = state => state.enrollment;
export const selectEnrollmentDetails = state => state.enrollment.enrollmentDetails;
export const selectPaymentDetails = state => state.enrollment.paymentDetails;
export const selectReferralCode = state => state.enrollment.referralCode;
export const selectCourseId = state => state.enrollment.courseId;
export const selectCurrentStep = state => state.enrollment.currentStep;
export const selectIsSubmitted = state => state.enrollment.isSubmitted;

export const selectFullEnrollmentData = state => ({
  ...state.enrollment.enrollmentDetails,
  ...state.enrollment.paymentDetails,
  referralCode: state.enrollment.referralCode,
  courseId: state.enrollment.courseId,
});

export default enrollmentSlice.reducer;
