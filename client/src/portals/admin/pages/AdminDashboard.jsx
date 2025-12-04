import React, { useState } from 'react';

import DashboardHeader from '../components/DashboardHeader';
import StatsCardsSection from '../components/StatsCardsSection';
import EnrollmentsTable from '../components/EnrollmentsTable';
import CourseEnrollmentChart from '../components/CourseEnrollmentChart';
import ReferralSourceChart from '../components/ReferralSourceChart';

function AdminDashboard() {
  // Header filter state - only affects StatsCardsSection
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [fromDate, setFromDate] = useState(undefined);
  const [toDate, setToDate] = useState(undefined);

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <DashboardHeader
        selectedCollege={selectedCollege}
        setSelectedCollege={setSelectedCollege}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
      {/* Header filters only affect stats cards */}
      <StatsCardsSection college={selectedCollege} fromDate={fromDate} toDate={toDate} />

      {/* Charts Section - Each has independent date pickers */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <CourseEnrollmentChart college={selectedCollege} />
        <ReferralSourceChart college={selectedCollege} />
      </div>

      <EnrollmentsTable />
    </main>
  );
}

export default AdminDashboard;
