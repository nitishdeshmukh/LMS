import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  UploadCloud,
  CheckCircle,
  Copy,
  ShieldCheck,
  User,
  Building,
  Hash,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import {
  setPaymentDetails,
  updatePaymentField,
  setIsSubmitted,
  selectPaymentDetails,
  selectFullEnrollmentData,
  selectIsSubmitted,
  setCurrentStep,
  setScreenshot,
  clearScreenshot,
} from '@/redux/slices';
import { submitEnrollment } from '@/services/public/publicService';

const EnrollmentPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigateWithRedux();
  const fileInputRef = useRef(null);

  const paymentDetails = useSelector(selectPaymentDetails);
  const fullEnrollmentData = useSelector(selectFullEnrollmentData);
  const isSubmitted = useSelector(selectIsSubmitted);

  const [paymentData, setPaymentData] = useState(paymentDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(paymentDetails.screenshotUrl || '');

  useEffect(() => {
    dispatch(setCurrentStep(2));
  }, [dispatch]);

  const bankDetails = {
    bankName: 'Punjab National Bank',
    accountName: 'LMS Portal Edutech Pvt Ltd',
    accountNumber: '09876543210987',
    ifscCode: 'PUNB0123456',
  };

  const handleCopy = text => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => toast.success('Copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Copied to clipboard!');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
    dispatch(updatePaymentField({ field: name, value }));
  };

  // Handle file selection
  const handleFileSelect = e => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please upload a JPG, PNG, or WebP image',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Please upload an image smaller than 5MB',
      });
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);

    // Save to Redux
    dispatch(setScreenshot({ file, url }));

    toast.success('Screenshot uploaded successfully!');
  };

  // Remove screenshot
  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl('');
    dispatch(clearScreenshot());
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Screenshot removed');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    dispatch(setPaymentDetails(paymentData));

    // Prepare form data for file upload
    const formData = new FormData();

    // Add enrollment details
    const enrollmentData = fullEnrollmentData;
    Object.keys(enrollmentData).forEach(key => {
      if (key !== 'screenshot' && key !== 'screenshotUrl') {
        formData.append(key, enrollmentData[key]);
      }
    });

    // Add screenshot file if exists
    if (selectedFile) {
      formData.append('screenshot', selectedFile);
    }

    console.log('📦 Submitting Full Enrollment Data with screenshot');

    try {
      // ✅ Use the service function
      const result = await submitEnrollment(formData);

      console.log('✅ Enrollment Successful:', result);

      // Show success toast
      toast.success('Thank you for the payment!', {
        description:
          'Your payment is being verified and your login credentials will be sent to your email within 24 hours.',
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
        duration: 8000,
      });

      // Set submitted state after showing toast
      setTimeout(() => {
        dispatch(setIsSubmitted(true));
      }, 8000);
    } catch (error) {
      console.error('❌ Enrollment submission error:', error);

      const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';

      toast.error('Submission failed. Please try again.', {
        description: errorMessage,
        duration: 5000,
      });

      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 max-w-lg w-full text-center animate-fadeIn">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Proof Submitted!</h2>
          <p className="text-zinc-400 mb-8">
            We have received your payment details. Our team will verify the transaction ID{' '}
            <strong>{paymentData.transactionId}</strong> and send you the login credentials within
            24 hours.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors"
          >
            Go to Home page
          </button>
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
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Bank Details Information */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl h-fit">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-blue-500" /> Bank Transfer Details
            </h2>
            <p className="text-zinc-400 text-sm mb-8">
              Please make a transfer of <span className="text-white font-bold">₹500</span> to the
              account below.
            </p>

            <div className="space-y-4">
              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Beneficiary Name</p>
                  <p className="font-medium text-lg">{bankDetails.accountName}</p>
                </div>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Bank Name</p>
                  <p className="font-medium text-lg">{bankDetails.bankName}</p>
                </div>
              </div>
              <div
                className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group cursor-pointer hover:border-blue-500/50 transition-colors"
                onClick={() => handleCopy(bankDetails.accountNumber)}
              >
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">Account Number</p>
                  <p className="font-mono text-lg tracking-wide text-blue-400">
                    {bankDetails.accountNumber}
                  </p>
                </div>
                <Copy size={18} className="text-zinc-600 group-hover:text-blue-400" />
              </div>
              <div
                className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex justify-between items-center group cursor-pointer hover:border-blue-500/50 transition-colors"
                onClick={() => handleCopy(bankDetails.ifscCode)}
              >
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold">IFSC Code</p>
                  <p className="font-mono text-lg tracking-wide text-white">
                    {bankDetails.ifscCode}
                  </p>
                </div>
                <Copy size={18} className="text-zinc-600 group-hover:text-blue-400" />
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-green-500 bg-green-500/10 p-3 rounded-lg">
              <ShieldCheck size={16} />
              <span>Secure Payment Gateway 100% Safe</span>
            </div>
          </div>

          {/* Right: Submit Proof Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl h-fit">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2 text-green-500">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle size={16} />
                </div>
                <span className="font-bold text-sm">Details</span>
              </div>
              <div className="w-16 h-0.5 bg-blue-600 mx-4"></div>
              <div className="flex items-center gap-2 text-blue-500">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <span className="font-bold text-sm">Verify</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">Submit Payment Proof</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Enter the details of the account you paid from.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Account Holder Name *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    size={18}
                  />
                  <input
                    type="text"
                    name="accountHolderName"
                    required
                    disabled={isSubmitting}
                    value={paymentData.accountHolderName}
                    onChange={handleChange}
                    className="w-full bg-black border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="As per passbook"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    Bank Name *
                  </label>
                  <div className="relative">
                    <Building
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={18}
                    />
                    <input
                      type="text"
                      name="bankName"
                      required
                      disabled={isSubmitting}
                      value={paymentData.bankName}
                      onChange={handleChange}
                      className="w-full bg-black border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Your Bank"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                    IFSC Code *
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                      size={18}
                    />
                    <input
                      type="text"
                      name="ifscCode"
                      required
                      disabled={isSubmitting}
                      value={paymentData.ifscCode}
                      onChange={handleChange}
                      className="w-full bg-black border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="ABCD0123456"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  required
                  disabled={isSubmitting}
                  value={paymentData.accountNumber}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="000000000000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Transaction ID / UTR *
                </label>
                <input
                  type="text"
                  name="transactionId"
                  required
                  disabled={isSubmitting}
                  value={paymentData.transactionId}
                  onChange={handleChange}
                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none placeholder-zinc-700 font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g. 1234567890"
                />
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">
                  Upload Screenshot (Optional)
                </label>

                {!previewUrl ? (
                  <div
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-zinc-700 rounded-xl p-4 hover:border-blue-500 hover:bg-zinc-800/50 transition-all cursor-pointer text-center flex items-center justify-center gap-3"
                  >
                    <UploadCloud size={20} className="text-zinc-500" />
                    <span className="text-sm text-zinc-400">Click to upload proof</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </div>
                ) : (
                  <div className="relative border-2 border-blue-500 rounded-xl p-3 bg-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                        <img
                          src={previewUrl}
                          alt="Screenshot preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {selectedFile?.name || 'Screenshot'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {selectedFile ? (selectedFile.size / 1024).toFixed(2) : '0'} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-zinc-500 mt-1 ml-1">
                  Accepted formats: JPG, PNG, WebP • Max size: 5MB
                </p>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => navigate('/enroll/details')}
                  className="px-6 py-3 border border-zinc-700 rounded-xl text-zinc-400 font-bold hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={
                    !paymentData.transactionId || !paymentData.accountNumber || isSubmitting
                  }
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
                    paymentData.transactionId && paymentData.accountNumber && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPayment;

