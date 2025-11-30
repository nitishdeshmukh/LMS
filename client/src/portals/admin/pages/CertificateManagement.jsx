import React, { useState } from 'react';
import { Badge } from '../../../common/components/ui/badge';
import { Search, Eye, Award, RotateCw } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

const CertificateManagement = () => {
  const [activeTab, setActiveTab] = useState('ready');
  const [searchQuery, setSearchQuery] = useState('');

  const studentsReadyToIssue = [
    {
      id: 1,
      name: 'Eleanor Pena',
      course: 'Advanced Python Programming',
      avatar: 'https://i.pravatar.cc/150?img=1',
      completedDate: '15 Aug 2024',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Jane Cooper',
      course: 'UI/UX Design Fundamentals',
      avatar: 'https://i.pravatar.cc/150?img=5',
      completedDate: '10 Aug 2024',
      status: 'Completed',
    },
  ];

  const studentsIssued = [
    {
      id: 3,
      name: 'Cameron Williamson',
      course: 'Data Science with R',
      avatar: 'https://i.pravatar.cc/150?img=8',
      issuedDate: '12 Aug 2024',
      status: 'Issued',
    },
    {
      id: 4,
      name: 'Cody Fisher',
      course: 'Machine Learning Basics',
      avatar: 'https://i.pravatar.cc/150?img=12',
      issuedDate: '05 Aug 2024',
      status: 'Issued',
    },
    {
      id: 5,
      name: 'Randy Orton',
      course: 'Machine Learning Basics',
      avatar: 'https://i.pravatar.cc/150?img=12',
      issuedDate: '05 Aug 2024',
      status: 'Issued',
    },
  ];

  const filteredReadyStudents = studentsReadyToIssue.filter(
    student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredIssuedStudents = studentsIssued.filter(
    student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* Search and Tabs Section - Same Row */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name or course..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-zinc-800 text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'ready'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Ready to Issue
            </button>
            <button
              onClick={() => setActiveTab('issued')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'issued'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Issued
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === 'ready'
            ? filteredReadyStudents.map(student => (
                <div
                  key={student.id}
                  className="bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-700 hover:shadow-md hover:border-zinc-600 transition-all"
                >
                  {/* Student Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">{student.name}</h3>
                        <p className="text-sm text-zinc-400">{student.course}</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20">
                      {student.status}
                    </Badge>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm text-zinc-400">Completed: {student.completedDate}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Award className="w-4 h-4" />
                        Issue Certificate
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : filteredIssuedStudents.map(student => (
                <div
                  key={student.id}
                  className="bg-zinc-800 rounded-xl p-6 shadow-sm border border-zinc-700 hover:shadow-md hover:border-zinc-600 transition-all"
                >
                  {/* Student Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">{student.name}</h3>
                        <p className="text-sm text-zinc-400">{student.course}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20">
                      {student.status}
                    </Badge>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm text-zinc-400">Issued: {student.issuedDate}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-zinc-600 bg-zinc-700 text-zinc-200 hover:bg-zinc-600"
                      >
                        <RotateCw className="w-4 h-4" />
                        Re-issue
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {((activeTab === 'ready' && filteredReadyStudents.length === 0) ||
          (activeTab === 'issued' && filteredIssuedStudents.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No students found</p>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default CertificateManagement;
