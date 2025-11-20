import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import FilterSection from '../components/FilterSection';
import StatsCardsSection from '../components/StatsCardsSection';
import EnrollmentsTable from '../components/EnrollmentsTable';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import ColumnWithRotatedLabels from '../components/ColumnWithRotatedLabels';
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
    <div className=" flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar className="h-24" />
        <div className="max-w-full mx-[2vw] py-[1vw]  overflow-x-auto ">
          {/* Header with Time Filters */}
          <DashboardHeader />

          {/* College and Course Filters */}
          <FilterSection />

          {/* Statistics Cards */}
          <StatsCardsSection />

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-5 mb-5 ">
            <div className="bg-white rounded-xl p-1 border border-gray-200">
              <h2 className="text-xl text-black font-semibold mb-4"></h2>
              <ColumnWithRotatedLabels data={chartData} height={350} />
            </div>
            <div className="bg-white rounded-xl p-1 border border-gray-200">
              <DoughnutChart data={donutData} height={360} innerRadiusPercent={60} />
            </div>
          </div>

          {/* Recent Enrollments Table */}
          <EnrollmentsTable />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
