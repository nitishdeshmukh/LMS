import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectIsAuthenticated } from '@/redux/slices';

/**
 * ProtectedRoute component that wraps routes requiring authentication.
 * Redirects to login page if user is not authenticated.
 * 
 * @param {Object} props
 * @param {string} props.loginPath - Path to redirect unauthenticated users (default: '/student/login')
 */
const ProtectedRoute = ({ loginPath = '/student/login' }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted URL for redirect after login
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
