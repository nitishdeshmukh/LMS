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
    },
    {
      name: 'Cody Fisher',
      email: 'cody.fisher@example.com',
      college: 'MIT',
      year: '4th',
      currentProgress: 75,
      capstoneStatus: 'Submitted',
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      college: 'Harvard',
      year: '2nd',
      currentProgress: 50,
      capstoneStatus: 'In Progress',
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      college: 'Harvard',
      year: '2nd',
      currentProgress: 50,
      capstoneStatus: 'In Progress',
    },
    {
      name: 'Esther Howard',
      email: 'esther.howard@example.com',
      college: 'Harvard',
      year: '2nd',
      currentProgress: 50,
      capstoneStatus: 'In Progress',
    },
  ]);

  return (
    <div>
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard: Active Students</h1>

          {/* Statistics Section */}
          <StatisticsSection />
        </div>
        <div>
          <StudentsTable data={studentsData} />
        </div>
      </main>
    </div>
  );
};

export default ActiveStudents;
