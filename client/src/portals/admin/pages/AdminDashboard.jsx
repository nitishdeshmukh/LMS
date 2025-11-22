import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import StatsCardsSection from '../components/StatsCardsSection';
import EnrollmentsTable from '../components/EnrollmentsTable';
import ColumnWithRotatedLabels from '../components/ColumnChart';
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
    { category: 'Organic', value: 20, color: '#4DFF88' },
    { category: 'Ads', value: 10, color: '#B84DFF' },
  ];
  return (
    <main className="flex-1 overflow-y-auto p-8">
      {/* Header with Time Filters */}
      <DashboardHeader />

      {/* Statistics Cards */}
      <StatsCardsSection />

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-5 mb-5 ">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-2">
          <ColumnWithRotatedLabels data={chartData} height={350}/>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-2">
          <DoughnutChart data={donutData} height={360} innerRadiusPercent={60} />
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <EnrollmentsTable />
    </main>
  );
}

export default AdminDashboard;

