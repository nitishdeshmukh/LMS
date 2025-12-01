import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogPortal,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from '@/common/components/ui/dialog';
import { cn } from '@/common/lib/utils';

const LoginPopup = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Close dialog when route changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleGithubLogin = () => {
    window.open('http://localhost:5001/api/auth/github', '_self');
  };

  const handleGoogleLogin = () => {
    window.open('http://localhost:5001/api/auth/google', '_self');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

        <DialogContent
          showCloseButton={false}
          className={cn(
            'bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-md shadow-2xl fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] animate-fadeIn',
          )}
        >
          {/* Header with Close Button */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold text-white mb-2">
                Welcome Back
              </DialogTitle>
              <DialogDescription className="text-sm text-zinc-400">
                Choose your preferred login method
              </DialogDescription>
            </div>

            <DialogClose
              className="text-zinc-400 hover:text-white transition-colors -mt-1"
              aria-label="Close"
            >
              <XIcon className="size-5" />
            </DialogClose>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-6 mb-6">
            <button
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-transparent border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-white rounded-xl transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className="text-sm font-medium">Continue with GitHub</span>
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-transparent border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-white rounded-xl transition-all duration-200"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          </div>

          {/* LMS Account Link */}
          <div className="text-center">
            <Link
              to="/student"
              className="text-sm text-blue-500 hover:underline transition duration-300"
            >
              I already have LMS Account
            </Link>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default LoginPopup;
