import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import StatsCardsSection from '../components/StatsCardsSection';
import EnrollmentsTable from '../components/EnrollmentsTable';
import CourseEnrollmentChart from '../components/CourseEnrollmentChart';
import ReferralSourceChart from '../components/ReferralSourceChart';

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
      <DashboardHeader />
      <StatsCardsSection />

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <CourseEnrollmentChart data={chartData} />
        <ReferralSourceChart data={donutData} />
      </div>

      <EnrollmentsTable />
    </main>
  );
}

export default AdminDashboard;

