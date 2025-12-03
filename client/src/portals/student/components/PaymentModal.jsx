import React, { useState, useEffect } from 'react';
import { X, Loader2, Upload, CreditCard, Building2, User, Hash, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { submitFullPayment } from '../../../services/student/studentService';

const PaymentModal = ({ isOpen, onClose, enrollmentId, courseTitle, amountRemaining, bankDetails, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    ifscCode: '',
    accountNumber: '',
    transactionId: '',
  });
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Prefill bank details from previous partial payment
  useEffect(() => {
    if (bankDetails) {
      setFormData({
        accountHolderName: bankDetails.accountHolderName || '',
        bankName: bankDetails.bankName || '',
        ifscCode: bankDetails.ifscCode || '',
        accountNumber: bankDetails.accountNumber || '',
        transactionId: '',
      });
    }
  }, [bankDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.accountHolderName || !formData.bankName || !formData.ifscCode || !formData.accountNumber || !formData.transactionId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        ...formData,
        screenshot,
      };
      
      await submitFullPayment(enrollmentId, paymentData);
      toast.success('Payment proof submitted successfully! It will be verified within 24-48 hours.');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Complete Payment</h2>
            <p className="text-sm text-zinc-400 mt-1">{courseTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-zinc-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Amount to Pay</span>
              <span className="text-2xl font-bold text-blue-400">₹{amountRemaining}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Transfer the above amount to our bank account and submit the payment proof below.
            </p>
          </div>

          {/* Bank Details Info */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Transfer to:</h4>
            <div className="space-y-1 text-sm">
              <p className="text-zinc-400">Account Name: <span className="text-white">Code2Dbug Pvt Ltd</span></p>
              <p className="text-zinc-400">Bank: <span className="text-white">HDFC Bank</span></p>
              <p className="text-zinc-400">Account No: <span className="text-white">501004656578</span></p>
              <p className="text-zinc-400">IFSC: <span className="text-white">HDFC0001234</span></p>
            </div>
          </div>

          {/* Your Bank Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 size={16} className="text-zinc-400" />
              Your Bank Details
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-zinc-400 mb-1">
                  Account Holder Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Bank Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    placeholder="HDFC Bank"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  IFSC Code <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    placeholder="HDFC0001234"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm text-zinc-400 mb-1">
                  Account Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="XXXXXXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileText size={16} className="text-zinc-400" />
              Transaction Details
            </h4>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Transaction ID / UTR Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                placeholder="Enter transaction ID or UTR number"
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">
                Payment Screenshot <span className="text-zinc-500">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 border border-zinc-700 border-dashed rounded-lg text-zinc-400 hover:bg-zinc-700/50 hover:border-zinc-600 cursor-pointer transition-colors"
                >
                  <Upload size={18} />
                  {screenshot ? screenshot.name : 'Click to upload screenshot'}
                </label>
                {previewUrl && (
                  <div className="mt-3">
                    <img
                      src={previewUrl}
                      alt="Payment screenshot preview"
                      className="w-full h-32 object-cover rounded-lg border border-zinc-700"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Submit Payment Proof
              </>
            )}
          </button>

          <p className="text-xs text-zinc-500 text-center">
            Your payment will be verified within 24-48 hours. You will receive a notification once verified.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
