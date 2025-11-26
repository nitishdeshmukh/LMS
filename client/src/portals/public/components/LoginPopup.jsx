import React, { useState, useEffect } from 'react';
import { X, Github, ChevronDown, ChevronUp } from 'lucide-react';

const LoginPopup = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLMSLogin, setShowLMSLogin] = useState(false);

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

  const handleSubmit = e => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      onSubmit(email, password);
    }
  };

  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setShowLMSLogin(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay with backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-5 right-5 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Welcome Back</h1>
          <p className="text-sm text-zinc-400">Choose your preferred login method</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => window.open('http://localhost:5001/api/auth/github', '_self')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-transparent border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-white rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <Github className="size-5" />
            <span className="text-sm font-medium">Continue with GitHub</span>
          </button>

          <button
            onClick={() => window.open('http://localhost:5001/api/auth/google', '_self')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-transparent border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900 text-white rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
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

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-950 px-2 text-zinc-500">OR</span>
          </div>
        </div>

        {/* Already have LMS account toggle */}
        <button
          onClick={() => setShowLMSLogin(!showLMSLogin)}
          className="w-full flex items-center justify-between py-3 px-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-white rounded-xl transition-all duration-200"
        >
          <span className="text-sm font-medium">Already have an LMS account?</span>
          {showLMSLogin ? (
            <ChevronUp className="size-4 text-zinc-400" />
          ) : (
            <ChevronDown className="size-4 text-zinc-400" />
          )}
        </button>

        {/* LMS Login Form - Collapsible */}
        {showLMSLogin && (
          <div className="mt-6 p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl animate-fadeIn">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-200 mb-2">
                  Login ID
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-500 hover:border-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your Login ID"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-white text-sm placeholder:text-zinc-500 hover:border-zinc-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 px-4 bg-transparent border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginPopup;
