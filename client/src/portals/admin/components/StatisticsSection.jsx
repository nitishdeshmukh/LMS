import React from 'react';
import { TrendingUp } from 'lucide-react';
import StudentsPerDomainChart from './StudentsPerDomainChart';

const StatsCard = ({ title, value, change, type }) => {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-100 mb-1">{title}</h2>
        <p className="text-sm text-zinc-400"></p>
      </div>
      <div className="flex flex-col items-start justify-between gap-4 flex-1">
        <div>
          <p className="text-3xl font-bold text-zinc-100">10</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">+26% today</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-zinc-100">38</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400 font-medium">+46% this week</span>
            </div>
          )}
        </div>
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
      {/* Total Active Students */}
      <StatsCard title="Total Active Students" value="1,482" change="+52% this month" />

      {/* Students per Domain Chart */}
      <div className="col-span-2">
        <StudentsPerDomainChart data={chartData} />
      </div>

      {/* Completion Statistics */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 h-full flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">Completion Statistics</h2>
          <p className="text-sm text-zinc-400"></p>
        </div>
        <div className="space-y-6 flex-1 flex flex-col justify-start">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-base text-zinc-400">Certificates Issued</span>
              <span className="text-2xl font-bold text-zinc-100">973</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-base text-zinc-400">Avg. Completion Rate</span>
              <span className="text-2xl font-bold text-zinc-100">88%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;

