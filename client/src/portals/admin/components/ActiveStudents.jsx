import React, { useState } from 'react';
import StudentsTable from '../components/StudentsTable';
import StatisticsSection from './StatisticsSection';

const ActiveStudents = () => {
  const [studentsData, setStudentsData] = useState([
    {
      name: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      college: 'Stanford University',
      year: '3rd',
      currentProgress: 100,
      capstoneStatus: 'Graded',
      paymentStatus: 'Full Paid', // Add this
    },
    {
      name: 'Cody Fisher',
      email: 'cody.fisher@example.com',
      college: 'MIT',
      year: '4th',
      currentProgress: 75,
      capstoneStatus: 'Submitted',
      paymentStatus: 'Unpaid', // Add this
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      college: 'Harvard',
      year: '2nd',
      currentProgress: 50,
      capstoneStatus: 'In Progress',
      paymentStatus: 'Half Paid', // Add this
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      college: 'Harvard',
      year: '2nd',
      currentProgress: 50,
      capstoneStatus: 'In Progress',
      paymentStatus: 'Half Paid', // Add this
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      college: 'Harvard',
      year: '2nd',
      currentProgress: 50,
      capstoneStatus: 'In Progress',
      paymentStatus: 'Unpaid', // Add this
    },
  ]);

  return (
    <div className=" min-h-screen">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Statistics Section */}
          <StatisticsSection />
        </div>
        <div className="mt-8">
          <StudentsTable data={studentsData} />
        </div>
      </main>
    </div>
  );
};

export default ActiveStudents;
