import React, { useState } from 'react';
import {
  Award,
  ArrowLeft,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  BookOpen,
  CreditCard,
  Clock,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useCourseCertificate, useCourseDetails } from '../hooks';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import PaymentModal from '../components/PaymentModal';

const StudentCourseCertificatesPage = () => {
  const { coursename } = useParams();
  const navigate = useNavigateWithRedux();
  const { certificate, loading, error, refetch, paymentStatus } = useCourseCertificate(coursename);
  const { course } = useCourseDetails(coursename);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Show payment required state
  if (paymentStatus && paymentStatus !== 'FULLY_PAID') {
    const isPending = paymentStatus === 'FULLY_PAYMENT_VERIFICATION_PENDING';
    
    return (
      <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
        <button
          onClick={() => navigate('/student/certificates')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Certificates</span>
        </button>

        <div className="max-w-lg mx-auto text-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            {isPending ? (
              <>
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock size={40} className="text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Payment Verification Pending</h2>
                <p className="text-zinc-400 mb-6">
                  Your payment is being verified. Certificate will be available once approved (usually within 24-48 hours).
                </p>
                <button
                  onClick={() => navigate('/student/certificates')}
                  className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Back to Certificates
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard size={40} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Payment Required</h2>
                <p className="text-zinc-400 mb-4">
                  Complete your payment to access the course certificate.
                </p>
                {course && (
                  <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Amount Remaining:</span>
                      <span className="text-xl font-bold text-blue-400">₹{course.amountRemaining || 0}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} />
                  Pay & Get Certificate
                </button>
              </>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {course && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            enrollmentId={course.enrollmentId}
            courseTitle={course.title}
            amountRemaining={course.amountRemaining}
            bankDetails={course.bankDetails}
            onSuccess={() => {
              refetch();
              toast.success('Payment submitted! Certificate will be available after verification.');
            }}
          />
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-black text-white">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-red-400">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/student/certificates')}
            className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
          >
            Back to Certificates
          </button>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white">
        <Award size={64} className="text-zinc-600 mb-4" />
        <p className="text-zinc-400">Certificate not found</p>
      </div>
    );
  }

  const formattedDate = certificate.issueDate
    ? new Date(certificate.issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate('/student/certificates')}
        className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Certificates</span>
      </button>

      {/* Certificate Display */}
      <div className="max-w-4xl mx-auto">
        {/* Certificate Card */}
        <div className="bg-linear-to-br from-yellow-900/30 to-zinc-900 border border-yellow-500/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full translate-x-1/4 translate-y-1/4" />

          {/* Certificate Content */}
          <div className="relative z-10 text-center">
            {/* Award Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-yellow-500/20 rounded-full">
                <Award size={48} className="text-yellow-400" />
              </div>
            </div>

            {/* Certificate Title */}
            <h2 className="text-sm uppercase tracking-widest text-yellow-400 mb-2">
              Certificate of Completion
            </h2>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              {certificate.course?.title || certificate.courseNameSnapshot}
            </h1>

            {/* Recipient */}
            <p className="text-zinc-400 mb-2">This certifies that</p>
            <p className="text-xl sm:text-2xl font-semibold text-white mb-8">
              {certificate.studentNameSnapshot}
            </p>

            {/* Completion Info */}
            <p className="text-zinc-400 mb-8">
              has successfully completed all requirements for this course
            </p>

            {/* Certificate Details */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar size={18} />
                <span>Issued: {formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <User size={18} />
                <span>ID: {certificate.certificateId}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              {certificate.pdfUrl && (
                <a
                  href={certificate.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  <Download size={18} />
                  Download PDF
                </a>
              )}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/verify/${certificate.certificateId}`,
                  );
                  alert('Certificate verification link copied!');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen size={20} className="text-blue-400" />
              <h3 className="font-semibold">Course</h3>
            </div>
            <p className="text-zinc-400">
              {certificate.course?.title || certificate.courseNameSnapshot}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Award size={20} className="text-yellow-400" />
              <h3 className="font-semibold">Verification</h3>
            </div>
            <p className="text-zinc-400 text-sm break-all">{certificate.certificateId}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseCertificatesPage;
