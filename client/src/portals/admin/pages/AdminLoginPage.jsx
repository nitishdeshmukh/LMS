import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import authService from '@/services/global/authService';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import { login, selectIsAuthenticated } from '@/redux/slices';

const AdminLoginPage = () => {
  const navigate = useNavigateWithRedux();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async e => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        // Extract auth data from response - tokens are already stored in localStorage by authService
        const { accessToken, refreshToken, user } = response.data;

        // Verify user is admin
        if (user.role !== 'admin') {
          setError('Access denied. Admin credentials required.');
          setIsLoading(false);
          return;
        }

        // Store auth data in Redux for app-wide access
        dispatch(login({ accessToken, refreshToken, user }));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      alert(err);
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-zinc-400">Secure access to administrative dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex gap-2 items-center justify-center mb-6 text-white text-xl font-semibold">
            <Shield className="size-6 text-red-500" />
            Admin Login
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder:text-zinc-500 hover:border-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-zinc-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm placeholder:text-zinc-500 hover:border-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-600/50 disabled:cursor-not-allowed text-white text-base font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <Link
              to="/admin/forgot-password"
              className="text-sm text-zinc-400 hover:text-red-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-lg">
              <Shield className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400 leading-relaxed">
                <strong className="text-yellow-500">Security Notice:</strong> This is a restricted
                area. Unauthorized access attempts are logged and monitored.
              </div>
            </div>
          </div>
        </div>

        {/* Back to Public Site */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1"
          >
            ← Back to main site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
