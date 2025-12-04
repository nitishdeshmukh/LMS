import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Counter from '../../public/components/Counter';
import adminService from '@/services/admin/adminService';

const StatCard = ({ title, value, bgColor = 'bg-zinc-800', isLoading }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-zinc-700 shadow-sm`}>
      <h3 className="text-sm font-medium text-zinc-400 mb-3">{title}</h3>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          <span className="text-zinc-400 text-sm">Loading...</span>
        </div>
      ) : (
        <p className="text-4xl font-bold text-blue-400">{value}</p>
      )}
    </div>
  );
};

const StatsCardsSection = ({ college, fromDate, toDate }) => {
  const [stats, setStats] = useState({
    enrolledToday: 0,
    enrolledThisWeek: 0,
    totalActive: 0,
    totalCourses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = {};
        if (college) {
          params.college = college;
        }
        // Note: Backend getDashboardCardStats doesn't support date filtering yet
        // These params are here for future enhancement
        if (fromDate) {
          params.fromDate = fromDate.toISOString();
        }
        if (toDate) {
          params.toDate = toDate.toISOString();
        }

        const response = await adminService.getDashboardStats(params);
        
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard stats');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [college, fromDate, toDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Enrolled Today"
        value={isLoading ? null : <Counter target={stats.enrolledToday} />}
        isLoading={isLoading}
      />
      <StatCard
        title="Enrolled This Week"
        value={isLoading ? null : <Counter target={stats.enrolledThisWeek} />}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Active Students"
        value={isLoading ? null : <Counter target={stats.totalActive} />}
        isLoading={isLoading}
      />
      <StatCard
        title="Total Courses"
        value={isLoading ? null : <Counter target={stats.totalCourses} />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatsCardsSection;
