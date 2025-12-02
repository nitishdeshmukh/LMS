import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, openLoginPopup } from '../../redux/slices';
import { toast } from 'sonner';
import { useNavigateWithRedux } from '../hooks/useNavigateWithRedux';

const PublicProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigateWithRedux();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(openLoginPopup());
      toast.info('Please log in to access this page', { duration: 3000 });
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return null;
  }

  return children ?? null;
};

export default PublicProtectedRoute;
