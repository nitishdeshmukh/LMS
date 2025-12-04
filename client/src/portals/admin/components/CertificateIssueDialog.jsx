import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { ScrollArea } from '@/common/components/ui/scroll-area';

const PaymentDetailsCard = ({ title, details }) => {
  // Extra safety check to ensure we have valid data
  if (!details || !details.accountHolderName) return null;

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 mb-4 border border-zinc-700/50">
      <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <span className="text-zinc-500 block text-xs">Account Holder</span>
          <span className="text-zinc-200 font-medium">{details.accountHolderName}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-xs">Bank Name</span>
          <span className="text-zinc-200 font-medium">{details.bankName}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-xs">Account Number</span>
          <span className="text-zinc-200 font-medium font-mono">{details.accountNumber}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-xs">IFSC Code</span>
          <span className="text-zinc-200 font-medium font-mono">{details.ifscCode}</span>
        </div>
        <div className="col-span-2 mt-2 pt-2 border-t border-zinc-700/50 flex justify-between items-center">
          <div>
            <span className="text-zinc-500 block text-xs">Transaction ID</span>
            <span className="text-blue-400 font-mono text-xs">{details.transactionId}</span>
          </div>
          <div className="text-right">
            <span className="text-zinc-500 block text-xs">Amount</span>
            <span className="text-green-400 font-bold">₹{details.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateIssueDialog = ({ isOpen, onOpenChange, student, onConfirm, isIssuing }) => {
  const [step, setStep] = React.useState(1);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!student) return null;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      onConfirm(student);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <svg
              className="w-5 h-5 text-yellow-500"
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
            Issue Certificate
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {step === 1
              ? "Review the project links submitted by the student."
              : `Review payment details before issuing the certificate for `}
            {step === 2 && (
              <span className="text-zinc-200 font-medium">{student.name}</span>
            )}
            {step === 2 && "."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-4 py-2">
            {step === 1 ? (
              <div className="space-y-4">
                {/* GitHub Link Display */}
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
                    GitHub Repository
                  </h4>
                  <a
                    href={student.githubLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm hover:underline break-all"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    {student.githubLink || 'Not provided'}
                  </a>
                </div>

                {/* Live Link Display */}
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <h4 className="text-sm font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
                    Live Project Link
                  </h4>
                  <a
                    href={student.liveLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm hover:underline break-all"
                  >
                    <svg
                      className="w-4 h-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {student.liveLink || 'Not provided'}
                  </a>
                </div>
              </div>
            ) : (
              <>
            {/* Student Details */}
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
                Student Details
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-zinc-500 block text-xs">Name</span>
                  <span className="text-zinc-200 font-medium">{student.name}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs">Email</span>
                  <span className="text-zinc-200 font-medium break-all">{student.email}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs">College</span>
                  <span className="text-zinc-200 font-medium">{student.college || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-xs">Year</span>
                  <span className="text-zinc-200 font-medium">{student.year || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block text-xs">Course</span>
                  <span className="text-zinc-200 font-medium">{student.courseName || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Course & Payment Summary */}
            <div className="grid grid-cols-2 gap-4 bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <div>
                <span className="text-zinc-500 block text-xs mb-1">
                  Total Course Fee
                </span>
                <span className="text-xl font-bold text-white">
                  ₹{student.courseAmount || 0}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs mb-1">
                  Amount Remaining
                </span>
                <span
                  className={`text-xl font-bold ${
                    student.amountRemaining > 0
                      ? 'text-red-400'
                      : 'text-green-400'
                  }`}
                >
                  ₹{student.amountRemaining || 0}
                </span>
              </div>
            </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  {student.partialPaymentDetails ? (
                    <PaymentDetailsCard
                      title="Partial Payment Details"
                      details={student.partialPaymentDetails}
                    />
                  ) : (
                    <div className="text-zinc-500 text-sm italic text-center py-2">
                      No partial payment details available
                    </div>
                  )}

                  {student.fullPaymentDetails ? (
                    <PaymentDetailsCard
                      title="Full Payment Details"
                      details={student.fullPaymentDetails}
                    />
                  ) : (
                    <div className="text-zinc-500 text-sm italic text-center py-2">
                      No full payment details available
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 pt-4 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={() => {
                if (step === 2) {
                    handleBack();
                } else {
                    onOpenChange(false);
                }
            }}
            disabled={isIssuing}
            className="border-zinc-700 text-zinc-100 hover:bg-zinc-800"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={isIssuing}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {step === 1 ? (
              'Continue'
            ) : isIssuing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Issuing...
              </>
            ) : (
              'Issue Certificate'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateIssueDialog;
