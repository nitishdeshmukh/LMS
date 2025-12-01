import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/global/authService';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

function AuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve tokens from cookies
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (accessToken && refreshToken) {
      authService.handleOAuthSuccess(accessToken, refreshToken).then(() => {
        navigate(-2);
      });
    } else {
      toast.error('Authentication tokens not found. Please log in again.');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="relative flex flex-col min-h-screen w-screen items-center justify-center text-center">
      {/* Spinner wrapper */}
      <div className="relative mb-6 h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-zinc-100 mb-1">Authentication Successful!</h2>
        <p className="text-zinc-400">Your tokens have been securely stored. Redirecting...</p>
      </div>
    </div>
  );
}

export default AuthSuccess;

