'use client';

import React, { useState } from 'react';
import { Input } from '../../../common/components/ui/input';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/common/components/ui/alert-dialog';
import { Button } from '../../../common/components/ui/button';

/**
 * PasswordModal - Admin verification dialog using Radix UI AlertDialog
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Controls the open state of the dialog
 * @param {Function} props.onOpenChange - Callback when open state changes
 * @param {Function} props.onSubmit - Callback when password is submitted
 */
const PasswordModal = ({ open, onOpenChange, onSubmit }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(password);
    setPassword(''); // Clear password after submission
    onOpenChange(false); // Close dialog programmatically
  };

  const handleClose = () => {
    setPassword(''); // Clear password on cancel
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-100">Admin Verification</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Enter your admin password to continue with this action.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="admin-password" className="block text-zinc-300 mb-2 text-sm">
              Admin Password
            </label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-zinc-800 text-zinc-200 border-zinc-700 focus:border-blue-500"
              autoFocus
              required
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              type="button"
              onClick={handleClose}
              className="bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100"
            >
              Cancel
            </AlertDialogCancel>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Verify
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordModal;

