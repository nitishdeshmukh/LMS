import React from 'react';

const StatCard = ({ title, value, bgColor = 'bg-zinc-800' }) => {
  return (
    <div className={`${bgColor} rounded-xl p-6 border border-zinc-700 shadow-sm`}>
      <h3 className="text-sm font-medium text-zinc-400 mb-3">{title}</h3>
      <p className="text-4xl font-bold text-blue-400">{value}</p>
    </div>
  );
};

const StatsCardsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Enrolled Students" value="12" />
      <StatCard title="Total Active Students" value="1,234" />
      <StatCard title="Total Ongpoing Students" value="85" />
      <StatCard title="Total Courses Offered" value="28" />
    </div>
  );
};

export default StatsCardsSection;

