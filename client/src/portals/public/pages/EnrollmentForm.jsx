import React, { useState, useEffect } from 'react';
import { User, GraduationCap, Mail, Phone, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import {
  setEnrollmentDetails,
  updateEnrollmentField,
  selectEnrollmentDetails,
  setCurrentStep,
  selectUser,
  openLoginPopup,
} from '@/redux/slices';

const EnrollmentForm = () => {
  const dispatch = useDispatch();
  const navigateAndStore = useNavigateWithRedux();
  const enrollmentDetails = useSelector(selectEnrollmentDetails);
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState(enrollmentDetails);
  const [isFormValid, setIsFormValid] = useState(false);

  // ← Check for user email, open login popup if not found
  useEffect(() => {
    if (!user?.email) {
      dispatch(openLoginPopup());
      toast.error('Please log in to continue with enrollment.', { duration: 3000 });
    }
  }, [dispatch, user, navigateAndStore]);

  useEffect(() => {
    dispatch(setCurrentStep(1));

    // Pre-fill email from logged-in user
    if (user?.email && !formData.email) {
      const updatedFormData = { ...formData, email: user.email };
      setFormData(updatedFormData);
      dispatch(updateEnrollmentField({ field: 'email', value: user.email }));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const checkFormValidity = () => {
      const requiredFields = [
        'firstName',
        'lastName',
        'collegeName',
        'degreeCourse',
        'yearOfStudy',
        'email',
        'phoneNumber',
      ];

      const allFieldsFilled = requiredFields.every(
        field => formData[field] && formData[field].trim() !== '',
      );

      setIsFormValid(allFieldsFilled);
    };

    checkFormValidity();
  }, [formData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    dispatch(updateEnrollmentField({ field: name, value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (isFormValid) {
      dispatch(setEnrollmentDetails(formData));
      navigateAndStore('/enroll/payment');
    }
  };

  // ← Render nothing or loading state until user is verified
  if (!user?.email) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Please login to continue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      <header className="h-20 border-b border-zinc-800 flex items-center px-8 bg-zinc-900/50 backdrop-blur-md">
        <span className="text-2xl font-bold tracking-tighter">
          LMS<span className="text-blue-500">PORTAL</span>
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-3xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-center mb-10">
            <div className="flex items-center gap-2 text-blue-500">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <span className="font-bold text-sm">Your Details</span>
            </div>
            <div className="w-16 h-0.5 bg-zinc-700 mx-4"></div>
            <div className="flex items-center gap-2 text-zinc-500">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold">
                2
              </div>
              <span className="font-bold text-sm">Payment</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-2 text-center">Student Enrollment Form</h1>
          <p className="text-zinc-400 text-center mb-8">
            Please fill in your details accurately for your internship records.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
                <User size={18} /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder=""
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                <GraduationCap size={18} /> Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    College Name *
                  </label>
                  <input
                    type="text"
                    name="collegeName"
                    required
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Institute of Technology"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Degree / Course *
                  </label>
                  <input
                    type="text"
                    name="degreeCourse"
                    required
                    value={formData.degreeCourse}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="B.Tech CS"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Year of Study *
                  </label>
                  <select
                    name="yearOfStudy"
                    required
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-green-400 flex items-center gap-2">
                <Phone size={18} /> Contact Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      readOnly
                      disabled
                      value={formData.email || user?.email || ''}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-zinc-400 cursor-not-allowed focus:outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {user?.email && (
                    <p className="text-xs text-zinc-500 mt-1 ml-1">
                      Email is auto-filled from your account
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center gap-2 ${
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/20 cursor-pointer'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Proceed to Payment <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;

