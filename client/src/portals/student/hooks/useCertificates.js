import { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchCertificates, selectCertificates } from '@/redux/slices';
import { getCourseCertificate } from '@/services/student/studentService';

// Cache duration: 10 minutes for certificates (rarely updated)
const CACHE_DURATION = 10 * 60 * 1000;

/**
 * Check if cache is still valid
 */
const isCacheValid = lastFetched => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < CACHE_DURATION;
};

/**
 * Hook for fetching certificates (Redux-powered)
 */
export const useCertificates = () => {
  const dispatch = useDispatch();
  const { list: certificates, loading, error, lastFetched } = useSelector(selectCertificates);

  const fetchCertificatesData = useCallback(
    (force = false) => {
      if (force || !isCacheValid(lastFetched)) {
        dispatch(fetchCertificates());
      }
    },
    [dispatch, lastFetched],
  );

  useEffect(() => {
    fetchCertificatesData();
  }, [fetchCertificatesData]);

  return {
    certificates,
    loading,
    error,
    refetch: () => fetchCertificatesData(true),
  };
};

/**
 * Hook for fetching a single course certificate
 */
export const useCourseCertificate = courseSlug => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificate = useCallback(async () => {
    if (!courseSlug) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCourseCertificate(courseSlug);
      setCertificate(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch certificate');
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  return {
    certificate,
    loading,
    error,
    refetch: fetchCertificate,
  };
};
