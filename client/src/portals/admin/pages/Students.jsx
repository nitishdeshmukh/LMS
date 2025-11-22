import React, { useState } from 'react';
import ActiveStudents from '../components/ActiveStudents';
import PendingVerifications from '../components/PendingVerifications';

const Students = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Tab Navigation - Pill Style */}
      <div className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-center items-center">
          <div className="inline-flex items-center gap-2 bg-zinc-800 p-1 rounded-lg shadow-sm border border-zinc-700">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              Active Students
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'ongoing'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
              }`}
            >
              Ongoing Students
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'active' && <ActiveStudents />}
        {activeTab === 'ongoing' && <PendingVerifications />}
      </div>
    </div>
  );
};

export default Students;
