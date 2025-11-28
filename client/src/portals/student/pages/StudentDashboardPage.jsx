import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, PlayCircle, Loader2, Zap } from 'lucide-react';

import { getDashboard } from '@/services/student/studentService';

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Get user name from localStorage or use default
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentName = user?.name || 'Student';

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboard();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchDashboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, xp, activeCourse, upcomingDeadlines } = dashboardData || {};

  const statsConfig = [
    {
      title: 'Enrolled Courses',
      value: stats?.enrolledCourses || 0,
      icon: <BookOpen size={24} className="text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Hours Learned',
      value: stats?.hoursLearned || 0,
      icon: <Clock size={24} className="text-green-500" />,
      color: 'bg-green-500/10 border-green-500/20',
    },
    {
      title: 'Avg. Quiz Score',
      value: `${stats?.avgQuizScore || 0}%`,
      icon: <TrendingUp size={24} className="text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Certificates',
      value: stats?.certificates || 0,
      icon: <Award size={24} className="text-yellow-500" />,
      color: 'bg-yellow-500/10 border-yellow-500/20',
    },
  ];

  const formatDueDate = dueInDays => {
    if (dueInDays === 0) return 'Due Today';
    if (dueInDays === 1) return 'Due Tomorrow';
    return `Due in ${dueInDays} Days`;
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Welcome back, {studentName.split(' ')[0]}! 👋</h2>
          <p className="text-zinc-400">Keep up your learning!</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold">Current XP</p>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
            <Zap size={16} className="mr-2 opacity-70" /> {xp.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsConfig.map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-2xl border ${stat.color} relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-black/20">{stat.icon}</div>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-zinc-400 font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning Card */}
          {activeCourse ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-1 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="p-6 sm:p-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                      In Progress
                    </span>
                    <h3 className="text-2xl font-bold mt-1">{activeCourse.title}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-zinc-800 flex items-center justify-center text-xs font-bold bg-zinc-900 text-white">
                    {activeCourse.progress}%
                  </div>
                </div>

                <div className="w-full bg-zinc-800 rounded-full h-2 mb-6 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${activeCourse.progress}%` }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/30 rounded-xl p-4 border border-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <PlayCircle size={20} className="ml-1 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold">Up Next</p>
                      <p className="text-sm font-medium text-white">{activeCourse.nextLesson}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/student/courses/${activeCourse.slug}`)}
                    className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition-colors w-full sm:w-auto"
                  >
                    Resume
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center">
              <BookOpen size={48} className="mx-auto text-zinc-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Active Course</h3>
              <p className="text-zinc-400 mb-4">Start learning by enrolling in a course</p>
              <button
                onClick={() => navigate('/courses')}
                className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Deadlines */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock size={18} className="text-orange-500" /> Upcoming Deadlines
            </h3>
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(task => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-black/40 border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded bg-zinc-800 ${task.type === 'Assignment' ? 'text-orange-400' : 'text-blue-400'}`}
                      >
                        {task.type}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {formatDueDate(task.dueInDays)}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-tight">{task.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-4">No upcoming deadlines</p>
              )}
            </div>
            <button className="w-full mt-6 text-sm text-zinc-500 hover:text-white transition-colors">
              View All Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
