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
    screenshotUrl: '',
  },
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
  },
});

export const {
  setEnrollmentDetails,
  setPaymentDetails,
  setReferralCode,
  setCurrentStep,
  setIsSubmitted,
  resetEnrollment,
  updateEnrollmentField,
  updatePaymentField,
} = enrollmentSlice.actions;

export const selectEnrollment = state => state.enrollment;
export const selectEnrollmentDetails = state => state.enrollment.enrollmentDetails;
export const selectPaymentDetails = state => state.enrollment.paymentDetails;
export const selectReferralCode = state => state.enrollment.referralCode;
export const selectCurrentStep = state => state.enrollment.currentStep;
export const selectIsSubmitted = state => state.enrollment.isSubmitted;

export const selectFullEnrollmentData = state => ({
  ...state.enrollment.enrollmentDetails,
  ...state.enrollment.paymentDetails,
  referralCode: state.enrollment.referralCode,
});

export default enrollmentSlice.reducer;
