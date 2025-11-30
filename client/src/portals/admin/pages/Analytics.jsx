'use client';

import React from 'react';
import { Users, BookOpen, TrendingUp, Award, Clock, Target } from 'lucide-react';
import TopPerformingCoursesChart from '../components/TopPerformingCoursesChart';
import PerformanceMetricsChart from '../components/PerformanceMetricsChart';
import StudentGrowthChartWithFilter from '../components/StudentGrowthChartWithFilter';
import EnrollmentCompletionWithFilter from '../components/EnrollmentCompletionWithFilter';
import CourseCompletionStatusChart from '../components/CourseCompletionStatusChart';
import EnrollmentByCategoryChart from '../components/EnrollmentByCategoryChart';
import MonthlyEnrollmentsTrendChart from '../components/MonthlyEnrollmentsTrendChart';
import CourseCompletionsByMonthChart from '../components/CourseCompletionsByMonthChart';

// Sample data - replace with your actual API data
const courseCompletionData = [
  { category: 'Completed', value: 68, color: '#10b981' },
  { category: 'In Progress', value: 22, color: '#3b82f6' },
  { category: 'Not Started', value: 10, color: '#ef4444' },
];

const enrollmentByCategory = [
  { category: 'Web Development', value: 450, color: '#3b82f6' },
  { category: 'Data Science', value: 320, color: '#8b5cf6' },
  { category: 'Design', value: 280, color: '#ec4899' },
  { category: 'Marketing', value: 190, color: '#f59e0b' },
  { category: 'Business', value: 150, color: '#10b981' },
];

const monthlyEnrollments = [
  { category: 'Jan', value: 145 },
  { category: 'Feb', value: 189 },
  { category: 'Mar', value: 223 },
  { category: 'Apr', value: 198 },
  { category: 'May', value: 267 },
  { category: 'Jun', value: 312 },
];

const courseCompletionByMonth = [
  { category: 'Jan', value: 89 },
  { category: 'Feb', value: 112 },
  { category: 'Mar', value: 145 },
  { category: 'Apr', value: 134 },
  { category: 'May', value: 178 },
  { category: 'Jun', value: 201 },
];

const assessmentPerformance = [
  { category: 'Excellent (90-100%)', value: 35, color: '#10b981' },
  { category: 'Good (75-89%)', value: 42, color: '#3b82f6' },
  { category: 'Average (60-74%)', value: 18, color: '#f59e0b' },
  { category: 'Below Average (<60%)', value: 5, color: '#ef4444' },
];

const userEngagement = [
  { category: 'Highly Active', value: 28, color: '#10b981' },
  { category: 'Active', value: 45, color: '#3b82f6' },
  { category: 'Moderate', value: 20, color: '#f59e0b' },
  { category: 'Inactive', value: 7, color: '#ef4444' },
];

// Performance Radar Chart Data
const performanceMetrics = [
  { category: 'Course Completion', value: 85, full: 100 },
  { category: 'Student Engagement', value: 72, full: 100 },
  { category: 'Assessment Scores', value: 91, full: 100 },
  { category: 'Attendance Rate', value: 78, full: 100 },
  { category: 'Assignment Submission', value: 88, full: 100 },
];

// Smooth Line Chart Data (Enrollment vs Completion)
const enrollmentTrend = [
  { date: new Date(2024, 0, 1).getTime(), enrollments: 120, completions: 95, revenue: 85 },
  { date: new Date(2024, 1, 1).getTime(), enrollments: 145, completions: 110, revenue: 102 },
  { date: new Date(2024, 2, 1).getTime(), enrollments: 178, completions: 125, revenue: 118 },
  { date: new Date(2024, 3, 1).getTime(), enrollments: 165, completions: 140, revenue: 135 },
  { date: new Date(2024, 4, 1).getTime(), enrollments: 198, completions: 155, revenue: 148 },
  { date: new Date(2024, 5, 1).getTime(), enrollments: 223, completions: 180, revenue: 172 },
  { date: new Date(2024, 6, 1).getTime(), enrollments: 245, completions: 200, revenue: 195 },
];

// Simple Line Chart Data (Student Growth)
const studentGrowth = [
  { date: new Date(2024, 0, 1).getTime(), value: 1240 },
  { date: new Date(2024, 1, 1).getTime(), value: 1385 },
  { date: new Date(2024, 2, 1).getTime(), value: 1563 },
  { date: new Date(2024, 3, 1).getTime(), value: 1728 },
  { date: new Date(2024, 4, 1).getTime(), value: 1926 },
  { date: new Date(2024, 5, 1).getTime(), value: 2149 },
  { date: new Date(2024, 6, 1).getTime(), value: 2394 },
];

// Top Performing Courses Data (for Doughnut Chart)
const topPerformingCourses = [
  { category: 'React Masterclass', value: 286, color: '#3b82f6' },
  { category: 'Python Data Science', value: 241, color: '#8b5cf6' },
  { category: 'UI/UX Design', value: 209, color: '#ec4899' },
  { category: 'Digital Marketing', value: 186, color: '#f59e0b' },
  { category: 'Node.js Backend', value: 174, color: '#10b981' },
  { category: 'Mobile App Dev', value: 159, color: '#06b6d4' },
];

// Stats cards data
const statsCards = [
  {
    title: 'Total Users',
    value: '2,547',
    change: '+12.5%',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'Active Courses',
    value: '87',
    change: '+5.2%',
    icon: BookOpen,
    color: 'bg-emerald-500',
  },
  {
    title: 'Avg. Completion Rate',
    value: '68%',
    change: '+8.1%',
    icon: Target,
    color: 'bg-violet-500',
  },
  {
    title: 'Certificates Issued',
    value: '1,234',
    change: '+15.3%',
    icon: Award,
    color: 'bg-amber-500',
  },
  {
    title: 'Avg. Time Spent',
    value: '4.2h',
    change: '+3.7%',
    icon: Clock,
    color: 'bg-cyan-500',
  },
  {
    title: 'Total Revenue',
    value: '$45.2K',
    change: '+18.9%',
    icon: TrendingUp,
    color: 'bg-pink-500',
  },
];

export default function Analytics() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-emerald-400 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-zinc-400 text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Radar Chart with Date Filter */}
          <PerformanceMetricsChart data={performanceMetrics} height={400} />

          {/* Student Growth Line Chart with Date Filter */}
          <StudentGrowthChartWithFilter data={studentGrowth} height={400} />
        </div>

        {/* Enrollment Trend - Full Width */}
        <div className="mb-6">
          <EnrollmentCompletionWithFilter
            data={enrollmentTrend}
            height={400}
            series={[
              { name: 'Enrollments', valueField: 'enrollments', color: '#3b82f6' },
              { name: 'Completions', valueField: 'completions', color: '#10b981' },
              { name: 'Revenue ($K)', valueField: 'revenue', color: '#f59e0b' },
            ]}
          />
        </div>

        {/* Doughnut Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CourseCompletionStatusChart
            data={courseCompletionData}
            height={320}
            innerRadiusPercent={60}
          />
          <EnrollmentByCategoryChart
            data={enrollmentByCategory}
            height={320}
            innerRadiusPercent={50}
          />
        </div>

        {/* Column Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MonthlyEnrollmentsTrendChart data={monthlyEnrollments} height={320} />
          <CourseCompletionsByMonthChart data={courseCompletionByMonth} height={320} />
        </div>

        {/* Top Performing Courses - Radial Histogram - Full Width */}
        <div className="mb-6">
          <TopPerformingCoursesChart
            data={topPerformingCourses}
            height={400}
            innerRadiusPercent={60}
          />
        </div>

        {/* Additional Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Leaderboard Performers */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Top Leaderboard Performers</h3>
            <div className="space-y-2.5">
              {[
                { name: 'Sarah Johnson', course: 'Web Development Pro', score: 96 },
                { name: 'Michael Chen', course: 'Data Analytics', score: 90 },
                { name: 'Emily Davis', course: 'Digital Marketing', score: 89 },
                { name: 'James Wilson', course: 'UI/UX Design', score: 85 },
                { name: 'Lisa Anderson', course: 'React Masterclass', score: 83 },
              ].map((performer, index) => {
                const rank = index + 1;
                const rankColors =
                  rank === 1
                    ? 'from-amber-500 to-amber-600'
                    : rank === 2
                      ? 'from-slate-400 to-slate-500'
                      : rank === 3
                        ? 'from-amber-700 to-amber-800'
                        : 'from-zinc-700 to-zinc-800';

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-zinc-800/40 border border-zinc-700/50 rounded-lg hover:bg-zinc-800/60 transition-colors"
                  >
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${rankColors} flex items-center justify-center shrink-0 shadow-lg`}
                    >
                      <span className="text-xs font-bold text-white">#{rank}</span>
                    </div>

                    {/* Name and Course */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-zinc-100 truncate">
                          {performer.name}
                        </p>
                        <span className="text-sm font-bold text-emerald-400 shrink-0">
                          {performer.score}
                        </span>
                      </div>
                      <p className="text-md text-zinc-500 truncate">{performer.course}</p>
                    </div>

                    {/* Score Progress Bar */}
                    <div className="w-16 shrink-0">
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                          style={{ width: `${performer.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Certifications */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">Recent Certifications</h3>
            <div className="space-y-3">
              {[
                { name: 'Sarah Johnson', course: 'Web Development Pro', time: '2 hours ago' },
                { name: 'Michael Chen', course: 'Data Analytics', time: '5 hours ago' },
                { name: 'Emily Davis', course: 'Digital Marketing', time: '1 day ago' },
                { name: 'James Wilson', course: 'UI/UX Design', time: '1 day ago' },
              ].map((cert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 truncate">{cert.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{cert.course}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{cert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">System Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Server Uptime', value: '99.9%', status: 'excellent' },
                { label: 'Average Load Time', value: '1.2s', status: 'good' },
                { label: 'Active Sessions', value: '847', status: 'excellent' },
                { label: 'Storage Used', value: '67%', status: 'warning' },
              ].map((metric, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-zinc-400">{metric.label}</span>
                    <span className="text-sm font-medium text-zinc-200">{metric.value}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        metric.status === 'excellent'
                          ? 'bg-emerald-500'
                          : metric.status === 'good'
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                      }`}
                      style={{
                        width:
                          metric.status === 'excellent'
                            ? '100%'
                            : metric.status === 'good'
                              ? '75%'
                              : '67%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

