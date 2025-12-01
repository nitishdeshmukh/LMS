import axios from 'axios';
import api, {
  API_URL,
  setTokens,
  setUser,
  clearAuth,
  getRefreshToken,
  getAccessToken,
  getStoredUser,
} from '../api';
import { jwtDecode } from 'jwt-decode';

// Re-export token management functions for external use
export { getAccessToken, getRefreshToken, getStoredUser, setTokens, setUser, clearAuth };

// ============================================
// AUTH SERVICE FUNCTIONS
// ============================================

const authService = {
  // Register new user
  register: async userData => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    }
    return response.data;
  },

  // Login with email/password
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    }
    return response.data;
  },

  // Login with LMS credentials
  lmsLogin: async (lmsId, lmsPassword) => {
    const response = await api.post('/auth/lms-login', { lmsId, lmsPassword });
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    }
    return response.data;
  },

  // Handle OAuth success (called after redirect from OAuth provider)
  handleOAuthSuccess: (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
    return authService.getCurrentUser(accessToken);
  },

  // Logout from current session
  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      await api.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      clearAuth();
    }
  },

  // Get current authenticated user
  getCurrentUser: async accessToken => {
    const user = jwtDecode(accessToken);
    setUser(user);
    return user;
  },

  // Refresh access token manually
  refreshToken: async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });
    if (response.data.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      setTokens(accessToken, newRefreshToken || refreshToken);
    }
    return response.data;
  },

  // Get active sessions
  getActiveSessions: async () => {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  // Forgot password
  forgotPassword: async email => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post('/auth/reset-password', {
      token,
      password,
      confirmPassword,
    });
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    return !!(accessToken && refreshToken);
  },

  // Get stored user data
  getUser: () => getStoredUser(),
};

// ============================================
// EXPORT
// ============================================

export default authService;

