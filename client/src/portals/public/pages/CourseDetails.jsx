import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen,
  Code,
  CreditCard,
  Tag,
  Briefcase,
  ShieldCheck,
  Share2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, openLoginPopup } from '../../../redux/slices';
import { setReferralCode, setCourseId } from '@/redux/slices/enrollmentSlice';
import { getPublicCourseBySlug } from '@/services';

const CourseDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const navigateAndStore = useNavigateWithRedux();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  // State
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getPublicCourseBySlug(slug);

        if (result.success && result.data) {
          setCourseData(result.data);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  // Set page title when course data loads
  useEffect(() => {
    if (courseData?.courseDetails?.title) {
      document.title = `${courseData.courseDetails.title} | Code2Debug`;
    }

    return () => {
      document.title = 'Code2Debug';
    };
  }, [courseData]);

  const handleApplyCoupon = referralCode => {
    if (!isAuthenticated) {
      dispatch(openLoginPopup());
      toast.warning('Please log in to apply a coupon code', { duration: 3000 });
      return;
    }

    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code', { duration: 3000 });
      return;
    }

    dispatch(setReferralCode(referralCode));
    toast.success('You have applied the referral code!', {
      icon: (
        <svg
          className="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      duration: 5000,
    });
  };

  const handleEnrollNow = () => {
    if (!isAuthenticated) {
      dispatch(openLoginPopup());
      toast.warning('Please log in to enroll in the course', { duration: 3000 });
      return;
    }

    // Save courseId to Redux
    if (courseData?.courseDetails?.id) {
      dispatch(setCourseId(courseData.courseDetails.id));
      console.log('Course ID saved to Redux:', courseData.courseDetails.id);
    }

    // Navigate to enrollment page
    navigateAndStore('/enroll');
  };

  const toggleModule = id => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <p className="text-xl text-gray-400">Loading course details...</p>
      </div>
    );
  }

  // Error State
  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || 'The course you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Destructure course data
  const {
    courseDetails,
    learningPoints,
    curriculum,
    capstoneProject,
    benefitsAfterPayment,
    internshipIncludes,
    paymentInfo,
  } = courseData;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      <div className="pt-20 pb-20">
        {/* Hero Banner */}
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-4">
                <span>Internship</span>
                <span>•</span>
                <span>Self-Paced</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                {courseDetails?.title || 'Course Title'}
              </h1>
              <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
                {courseDetails?.subtitle || 'Course description'}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
                {courseDetails?.lastUpdated && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="shrink-0" />
                    <span>Last updated {courseDetails.lastUpdated}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="shrink-0" />
                  <span>Job Ready Curriculum</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-12">
              {/* Payment Info */}
              {paymentInfo && (
                <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                  <h2 className="text-xl font-bold mb-3 text-blue-100 flex items-center gap-2">
                    <CreditCard size={20} className="text-blue-400" /> {paymentInfo.title}
                  </h2>
                  <p className="text-zinc-300 leading-relaxed">
                    {paymentInfo.description}
                    <br />
                    <br />
                    {paymentInfo.note}
                  </p>
                </div>
              )}

              {/* What You'll Learn */}
              {learningPoints && learningPoints.length > 0 && (
                <div className="relative overflow-hidden p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30">
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

                  <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 flex items-center gap-3">
                    <Zap className="text-yellow-400 fill-yellow-400" size={28} />
                    What You'll Learn
                  </h2>

                  <div className="grid grid-cols-1 gap-6 relative z-10">
                    {learningPoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group cursor-default"
                      >
                        <div className="mt-1 p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors shrink-0">
                          <CheckCircle
                            size={18}
                            className="text-blue-400 group-hover:text-blue-300"
                          />
                        </div>
                        <span className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed pt-1 group-hover:text-white transition-colors">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Content */}
              {curriculum && curriculum.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                  <div className="flex justify-between text-sm text-zinc-400 mb-4">
                    <span>{curriculum.length} Modules</span>
                  </div>

                  <div className="border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900/20">
                    {curriculum.map(module => (
                      <div key={module.id} className="border-b border-zinc-700 last:border-0">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-5 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-lg ${expandedModule === module.id ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}
                            >
                              {expandedModule === module.id ? (
                                <ChevronUp size={20} />
                              ) : (
                                <ChevronDown size={20} />
                              )}
                            </div>
                            <div>
                              <span className="font-bold block text-lg">{module.title}</span>
                              {module.timeline && (
                                <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                                  {module.timeline}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>

                        {expandedModule === module.id && (
                          <div className="bg-black/50 border-t border-zinc-800 divide-y divide-zinc-800/50">
                            {/* Topics */}
                            {module.topics && module.topics.length > 0 && (
                              <div className="p-5">
                                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                  <BookOpen size={14} /> Topics Covered
                                </h4>
                                <ul className="space-y-2 pl-2">
                                  {module.topics.map((topic, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2.5 text-sm text-zinc-300"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0"></div>
                                      <span>{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Practice */}
                            {module.practice && (
                              <div className="p-5 bg-blue-900/5">
                                <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                  <Code size={14} /> Hands-on Practice
                                </h4>
                                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-green-500/30 pl-3">
                                  {module.practice}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Capstone Project */}
              {capstoneProject && (
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                    <Briefcase size={24} className="text-purple-400" /> Capstone Project
                  </h2>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">
                    {capstoneProject.title}
                  </h3>
                  <p className="text-zinc-300 leading-relaxed mb-2">
                    {capstoneProject.description}
                  </p>
                  {capstoneProject.timeline && (
                    <span className="text-sm text-zinc-500 font-mono">
                      {capstoneProject.timeline}
                    </span>
                  )}
                </div>
              )}

              {/* Premium Benefits */}
              {benefitsAfterPayment && benefitsAfterPayment.length > 0 && (
                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Award size={24} className="text-yellow-500" /> Unlocked After Full Payment
                  </h2>
                  <div className="space-y-4">
                    {benefitsAfterPayment.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex gap-4 items-start p-4 rounded-xl bg-black/40 border border-zinc-800"
                      >
                        <div className="mt-1 bg-green-500/20 p-1 rounded-full text-green-500">
                          <CheckCircle size={16} />
                        </div>
                        <span className="text-zinc-300 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Pricing Card */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
                <div className="p-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold text-white">
                      {courseDetails?.price || '₹500'}
                    </span>
                    <span className="text-zinc-500 line-through text-lg mb-1">
                      {courseDetails?.originalPrice || '₹5000'}
                    </span>
                  </div>
                  <p className="text-green-400 font-bold mb-6">
                    {courseDetails?.discount || 'Pay 10% Now'}
                  </p>

                  <button
                    onClick={handleEnrollNow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Enroll Now
                  </button>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    {!showCouponInput ? (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="text-blue-400 text-sm hover:underline flex items-center gap-2 mx-auto"
                      >
                        <Tag size={16} /> Have a referral code?
                      </button>
                    ) : (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          placeholder="Enter code"
                          className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon(couponCode)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors border border-zinc-700"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-zinc-500 text-xs mb-6">
                    Secure Payment • Instant Access
                  </p>

                  {/* Includes */}
                  {internshipIncludes && internshipIncludes.length > 0 && (
                    <div className="space-y-4 border-t border-zinc-800 pt-6">
                      <h4 className="font-bold text-sm text-white">This Internship includes:</h4>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        {internshipIncludes.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle size={16} className="text-blue-400 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <button className="hover:text-blue-400 transition-colors flex items-center gap-2">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
