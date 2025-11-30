import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import StatsCardsSection from '../components/StatsCardsSection';
import EnrollmentsTable from '../components/EnrollmentsTable';
import ColumnChart from '../components/ColumnChart';
import DoughnutChart from '../components/DoughnutChart';

function AdminDashboard() {
  const chartData = [
    { category: 'webdev', value: 50 },
    { category: 'ui/ux', value: 80 },
    { category: 'Python', value: 65 },
    { category: 'Backend', value: 40 },
    { category: 'DS', value: 45 },
    { category: 'Devops', value: 20 },
    { category: 'Frontend', value: 22 },
  ];
  const donutData = [
    { category: 'Direct', value: 45, color: '#145efc' },
    { category: 'Referral', value: 25, color: '#FFB84D' },
  ];
  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Header with Time Filters */}
      <DashboardHeader />

      {/* Statistics Cards */}
      <StatsCardsSection />

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-5 mb-5 ">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">
              Total Enrollments by Course
            </h2>
            <p className="text-sm text-zinc-400">
              Total number of students enrolled in each active course
            </p>
          </div>
          <ColumnChart data={chartData} height={350} />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">
              Referral vs Direct Enrollments
            </h2>
            <p className="text-sm text-zinc-400">
              Displays the split between enrollments via direct sign-up and referrals.
            </p>
          </div>
          <DoughnutChart data={donutData} height={360} innerRadiusPercent={60} />
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <EnrollmentsTable />
    </main>
  );
}

export default AdminDashboard;


