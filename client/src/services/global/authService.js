import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// ============================================
// TOKEN MANAGEMENT
// ============================================

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const setUser = user => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ============================================
// AXIOS INSTANCE WITH INTERCEPTORS
// ============================================

const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track refresh token promise to avoid multiple refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = callback => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = accessToken => {
  refreshSubscribers.forEach(callback => callback(accessToken));
  refreshSubscribers = [];
};

const onRefreshError = error => {
  refreshSubscribers.forEach(callback => callback(null, error));
  refreshSubscribers = [];
};

// Request interceptor - Add access token to all requests
authApi.interceptors.request.use(
  config => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor - Handle token expiration and auto-refresh
authApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((accessToken, err) => {
            if (err) {
              reject(err);
            } else {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              resolve(authApi(originalRequest));
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        setTokens(accessToken, newRefreshToken || refreshToken);
        isRefreshing = false;
        onTokenRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshError(refreshError);
        clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (
        error.response?.data?.code === 'REFRESH_TOKEN_INVALID' ||
        error.response?.data?.code === 'TOKEN_REUSE_DETECTED' ||
        error.response?.data?.code === 'REFRESH_TOKEN_REVOKED' ||
        error.response?.data?.code === 'ACCOUNT_BLOCKED'
      ) {
        clearAuth();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

// ============================================
// AUTH SERVICE FUNCTIONS
// ============================================

const authService = {
  // Register new user
  register: async userData => {
    const response = await authApi.post('/auth/register', userData);
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    }
    return response.data;
  },

  // Login with LMS credentials
  lmsLogin: async (lmsId, lmsPassword) => {
    const response = await authApi.post('/auth/lms-login', { lmsId, lmsPassword });
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
    return authService.getCurrentUser();
  },

  // Logout from current session
  logout: async () => {
    try {
      const refreshToken = getRefreshToken();
      await authApi.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  },

  // Logout from all devices
  logoutAll: async () => {
    try {
      await authApi.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      clearAuth();
    }
  },

  // Get current authenticated user
  getCurrentUser: async () => {
    const response = await authApi.get('/auth/me');
    if (response.data.success) {
      setUser(response.data.data.user);
    }
    return response.data;
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
    const response = await authApi.get('/auth/sessions');
    return response.data;
  },

  // Forgot password
  forgotPassword: async email => {
    const response = await authApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    const response = await authApi.post('/auth/reset-password', {
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
export { authApi };
