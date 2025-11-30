'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/common/components/ui/alert-dialog';

/**
 * RevokeAccess - Confirmation dialog for revoking student access
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Controls the open state of the dialog
 * @param {Function} props.onOpenChange - Callback when open state changes
 * @param {Object} props.student - Student object containing student data
 * @param {string} props.studentName - Student name (fallback)
 * @param {Function} props.onConfirm - Optional callback after confirmation
 */
const RevokeAccess = ({ open, onOpenChange, student, onConfirm }) => {
  const handleCancel = () => {
    onOpenChange(false);
    toast.info(`Access revocation cancelled for ${student?.studentName}`);
  };

  const handleConfirm = () => {
    onOpenChange(false);
    toast.success(`${student?.studentName} has been revoked successfully`);
    // Add your revoke logic here (API call, etc.)
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-700 sm:max-w-md">
        <AlertDialogHeader className="items-center text-center">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-4 border border-red-900/30">
            <AlertTriangle size={40} className="text-red-500" />
          </div>

          <AlertDialogTitle className="text-2xl font-bold text-white">
            Revoke Access?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-400 space-y-4 text-center">
            <p>
              Are you sure you want to revoke access for{' '}
              <span className="text-white font-bold">{student?.studentName}</span>?
            </p>

            <span className="inline-block text-red-400 text-sm bg-red-900/10 px-3 py-1 rounded-full border border-red-900/30">
              This action is irreversible.
            </span>

            <p className="text-xs text-zinc-500 pt-2">
              This will permanently delete the user's progress, certificates, and account data from
              the LMS.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="sm:space-x-0 gap-4">
          <AlertDialogCancel
            onClick={handleCancel}
            className="flex-1 bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20"
          >
            Confirm Revoke
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RevokeAccess;

