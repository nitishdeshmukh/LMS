import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

const RevokeAccess = ({ studentName, onConfirm, student, onClose }) => {
  const handleCancel = () => {
    onClose(); // Close the popup
    toast.info(`Access revocation cancelled for ${student?.studentName}`);
  };

  const handleConfirm = () => {
    onClose(); // Close the popup
    toast.success(`${student?.studentName} has been revoked successfully`);
    // Add your revoke logic here (API call, etc.)
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-red-900/50 rounded-3xl max-w-md w-full p-8 relative shadow-2xl shadow-red-900/20 animate-fadeIn">
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-6 border border-red-900/30">
            <AlertTriangle size={40} className="text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Revoke Access?</h2>
          <p className="text-zinc-400 mb-6">
            Are you sure you want to revoke access for{' '}
            <span className="text-white font-bold">{student?.studentName || studentName}</span>?
            <br />
            <br />
            <span className="text-red-400 text-sm bg-red-900/10 px-3 py-1 rounded-full border border-red-900/30">
              This action is irreversible.
            </span>
          </p>

          <p className="text-xs text-zinc-500 mb-8">
            This will permanently delete the user's progress, certificates, and account data from
            the LMS.
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 transition-colors"
            >
              Confirm Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevokeAccess;

