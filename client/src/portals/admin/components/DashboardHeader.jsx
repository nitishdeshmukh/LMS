import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

const DashboardHeader = () => {
  const [activeFilter, setActiveFilter] = useState('last7days');

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 mb-6">
          <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors">
            <span className="text-zinc-200 font-medium">Filter by College</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors">
            <span className="text-zinc-200 font-medium">Filter by Course</span>
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
        {/* Time Filter Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveFilter('today')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'today'
                ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveFilter('last7days')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'last7days'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setActiveFilter('last30days')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'last30days'
                ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-700'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
