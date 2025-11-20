import React, { useState } from 'react';
import ActiveStudents from './ActiveStudents';
import PendingVerifications from './PendingVerifications';

const StudentsPage = () => {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Active Students
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'ongoing'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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

export default StudentsPage;
