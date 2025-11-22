import React from 'react';
import { TrendingUp } from 'lucide-react';
import ColumnChart from './ColumnChart';

const StatsCard = ({ title, value, change, type }) => {
  return (
    <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
      <h3 className="text-sm font-medium text-zinc-400 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-zinc-100">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatisticsSection = () => {
  const chartData = [
    { category: 'webdev', value: 50 },
    { category: 'ui/ux', value: 80 },
    { category: 'Python', value: 65 },
    { category: 'Backend', value: 40 },
    { category: 'DS', value: 45 },
    { category: 'Devops', value: 20 },
    { category: 'Frontend', value: 22 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Total Enrolled */}
      <StatsCard title="Total Enrolled" value="1,482" change="+52% this month" />

      {/* Students per Domain - Chart Card */}
      <div className="bg-zinc-800 rounded-xl col-span-2 border border-zinc-700">
        <ColumnChart data={chartData} height={200} />
      </div>

      {/* Completion Statistics */}
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">Completion Statistics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-zinc-400">Certificates Issued</span>
              <span className="text-2xl font-bold text-zinc-100">973</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-zinc-400">Avg. Completion Rate</span>
              <span className="text-2xl font-bold text-zinc-100">88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
