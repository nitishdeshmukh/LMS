import React, { useState } from 'react';
import ActiveStudents from '../components/ActiveStudents';
import PendingVerifications from '../components/PendingVerifications';

const Students = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Tab Navigation - Pill Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-center items-center">
          <div className="inline-flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Active Students
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'ongoing'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Ongoing Students
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'active' && <ActiveStudents />}
        {activeTab === 'ongoing' && <PendingVerifications />}
      </div>
    </div>
  );
};

export default Students;
