import React from 'react';
import { Award } from 'lucide-react';

import LearningCard from '../components/LearningCard';

const StudentCertificatesPage = () => {
  const courses = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      progress: 65,
      type: 'Certificates',
      total: 8,
      completed: 5,
      lastAccessed: '2 hours ago',
      image: 'bg-linear-to-br from-blue-900 to-slate-900',
      icon: <Award size={32} className="text-blue-400" />,
      buttonText: 'View Certificate',
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      progress: 10,
      type: 'Certificates',
      total: 12,
      completed: 1,
      lastAccessed: '3 days ago',
      image: 'bg-linear-to-br from-purple-900 to-slate-900',
      icon: <Award size={32} className="text-purple-400" />,
      buttonText: 'View Certificate',
    },
  ];

  return (
    <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <LearningCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default StudentCertificatesPage;
