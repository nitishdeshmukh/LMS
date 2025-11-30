import React from 'react';
import { Award, Loader2, AlertCircle, BookOpen } from 'lucide-react';

import LearningCard from '../components/LearningCard';
import { useCertificates } from '../hooks';

const StudentCertificatesPage = () => {
  const { certificates, loading, error, refetch } = useCertificates();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-black text-white">
        <AlertCircle size={48} className="text-red-400" />
        <p className="text-red-400">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white">
        <BookOpen size={64} className="text-zinc-600 mb-4" />
        <p className="text-zinc-400">No certificates available yet</p>
        <p className="text-zinc-500 text-sm mt-2">Complete courses to earn certificates</p>
      </div>
    );
  }

  // Transform API data to match LearningCard format
  const formattedCourses = certificates.map(cert => ({
    id: cert._id || cert.id,
    title: cert.course?.title || cert.courseNameSnapshot,
    link: cert.course?.slug,
    progress: 100,
    type: 'Certificate',
    total: 1,
    completed: 1,
    image: 'bg-linear-to-br from-yellow-900 to-slate-900',
    icon: <Award size={32} className="text-yellow-400" />,
    buttonText: 'View Certificate',
    thumbnail: cert.course?.thumbnail,
    certificateId: cert.certificateId,
    issueDate: cert.issueDate,
  }));

  return (
    <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Certificates</h1>
        <p className="text-zinc-400">Your earned achievements and certifications</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedCourses.map(course => (
          <LearningCard
            key={course.id}
            course={course}
            destination={`certificates/${course.link}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentCertificatesPage;
