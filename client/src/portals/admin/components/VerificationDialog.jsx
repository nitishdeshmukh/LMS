import React, { useState, useMemo, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Label } from '@/common/components/ui/label';
import { Textarea } from '@/common/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/ui/select';
import { cn } from '@/common/lib/utils';
import adminService from '@/services/admin/adminService';

const VerificationDialog = ({ isOpen, onOpenChange, student, onVerificationComplete }) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentType, setPaymentType] = useState('partial');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Reset form when dialog opens/closes or student changes
  useEffect(() => {
    if (isOpen && student) {
      const defaultAmount = Math.ceil(student.coursePrice * 0.1);
      setAmountPaid(defaultAmount.toString());
      setPaymentType('partial');
      setRejectionReason('');
    }
  }, [isOpen, student]);

  // Calculate if rejection reason should be shown
  const showRejectionReason = useMemo(() => {
    if (!student || !amountPaid) return false;
    const minAmount = Math.ceil(student.coursePrice * 0.1);
    return Number(amountPaid) < minAmount;
  }, [amountPaid, student]);

  const handleVerify = async () => {
    if (!student) return;

    try {
      setIsVerifying(true);

      const coursePrice = student.coursePrice;
      const minPartialAmount = Math.ceil(coursePrice * 0.1);
      const isRejection = Number(amountPaid) < minPartialAmount;

      if (isRejection && !rejectionReason.trim()) {
        toast.error('Rejection reason required', {
          description: `Amount is less than 10% (${minPartialAmount}). Please provide a reason for rejection.`,
        });
        setIsVerifying(false);
        return;
      }

      const payload = {
        action: isRejection ? 'reject' : 'approve',
        paymentType: paymentType,
        amountPaid: Number(amountPaid),
        rejectionReason: isRejection ? rejectionReason : undefined,
      };

      const response = await adminService.approveOngoingStudent(student.enrollmentId, payload);

      if (response.success) {
        onOpenChange(false);
        if (onVerificationComplete) onVerificationComplete();

        const actionText = isRejection ? 'rejected' : 'verified';
        toast.success(`Student ${actionText} successfully`, {
          description: `${student.name} has been ${actionText} and will receive an email.`,
          icon: isRejection ? (
             <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          ) : (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          duration: 5000,
        });
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Error verifying student:', err);
      toast.error('Verification failed', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <svg
              className="w-5 h-5 text-green-400"
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
            Verify Payment
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Verify payment details for {student?.name}.
          </DialogDescription>
        </DialogHeader>

        {student && (
          <div className="space-y-4 py-4 border-y border-zinc-800">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-zinc-500 block">Course Price:</span>
                <span className="font-medium text-zinc-100">₹{student.coursePrice}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Min. Partial (10%):</span>
                <span className="font-medium text-zinc-100">
                  ₹{Math.ceil(student.coursePrice * 0.1)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500 block">Payment ID:</span>
                <span className="font-mono text-blue-400">{student.paymentDetails?.transactionId}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentType" className="text-zinc-300">Payment Type</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                  <SelectItem value="partial">Partial Payment</SelectItem>
                  <SelectItem value="full">Full Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountPaid" className="text-zinc-300">Amount Paid</Label>
              <Input
                id="amountPaid"
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-200"
                placeholder="Enter amount paid"
              />
            </div>

            {showRejectionReason && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="rejectionReason" className="text-red-400">
                  Rejection Reason (Amount &lt; 10%)
                </Label>
                <Textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="bg-zinc-800 border-red-500/50 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-red-500"
                  placeholder="Please explain why this payment is being rejected..."
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isVerifying}
            className="border-zinc-700 text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={isVerifying || (showRejectionReason && !rejectionReason.trim())}
            className={cn(
              "text-white",
              showRejectionReason 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-green-600 hover:bg-green-700"
            )}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              showRejectionReason ? 'Reject Payment' : 'Verify & Approve'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
