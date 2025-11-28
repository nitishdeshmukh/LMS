import React from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CreditCard,
  BookOpen,
  CheckCircle,
  X,
} from 'lucide-react';

const StudentDetail = ({ student, onClose }) => {
  // Mock Data (will be replaced by actual student prop from backend)
  const studentData = student || {
    studentName: 'Aditya Verma',
    email: 'aditya.v@example.com',
    phone: '+91 98765 00000',
    college: 'Indian Institute of Technology',
    course: 'Full Stack Web Development',
    degree: 'B.Tech Computer Science',
    year: '4th Year',
    date: '2022-08-15',
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm text-zinc-200 p-4 md:p-8 flex justify-center items-start overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Student Details</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Profile Summary */}
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0">
              {(studentData.studentName || studentData.name)?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {studentData.studentName || studentData.name}
              </h1>
              <p className="text-zinc-400 flex items-center gap-2 text-sm mb-1">
                <Mail size={14} /> {studentData.email}
              </p>
              <p className="text-zinc-400 flex items-center gap-2 text-sm">
                <Phone size={14} /> {studentData.phone || '+91 98765 43210'}
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                  Active
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                  Student
                </span>
              </div>
            </div>
          </div>

          {/* 1. Enrollment Details */}
          <section className="bg-black/20 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-purple-400" /> Academic Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm">
              <div>
                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">College</p>
                <p className="text-zinc-200">{studentData.college || 'N/A'}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Degree / Course</p>
                <p className="text-zinc-200">{studentData.degree || 'B.Tech CS'}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Year</p>
                <p className="text-zinc-200">{studentData.year || '3rd Year'}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Joined On</p>
                <p className="text-zinc-200 flex items-center gap-2">
                  <Calendar size={14} />{' '}
                  {studentData.date || studentData.joinDate || 'Oct 24, 2025'}
                </p>
              </div>
            </div>
          </section>

          {/* 2. Enrolled Courses */}
          <section className="bg-black/20 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-blue-400" /> Enrolled Courses
            </h3>
            <div className="space-y-4">
              {/* Mock Data Loop */}
              {[1].map((courseItem, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                >
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">
                      {studentData.course || 'Full Stack Web Development'}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1">
                      Enrolled: {studentData.date || 'Oct 24, 2025'}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-block text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded">
                      Active
                    </span>
                    <p className="text-xs text-zinc-500 mt-1">Progress: 45%</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Payment History */}
          <section className="bg-black/20 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-green-400" /> Payment History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-zinc-400 min-w-[500px]">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-800/50">
                    <td className="px-4 py-3">Oct 24, 2025</td>
                    <td className="px-4 py-3 text-white font-medium">₹500</td>
                    <td className="px-4 py-3 font-mono text-xs">TXN_123456789</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                        <CheckCircle size={12} /> Verified
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        /* Smooth scrolling styles */
        .scrollbar-smooth {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Custom scrollbar for better appearance */
        .scrollbar-smooth::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-smooth::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .scrollbar-smooth::-webkit-scrollbar-thumb {
          background: rgba(113, 113, 122, 0.5);
          border-radius: 4px;
        }
        
        .scrollbar-smooth::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.7);
        }
      `}</style>
    </div>
  );
};

export default StudentDetail;
