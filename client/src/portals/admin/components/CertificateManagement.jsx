import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, Eye, Award, RotateCw } from 'lucide-react';

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
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Jane Cooper',
      course: 'UI/UX Design Fundamentals',
      avatar: 'https://i.pravatar.cc/150?img=5',
      completedDate: '10 Aug 2024',
      status: 'Completed'
    }
  ];

  const studentsIssued = [
    {
      id: 3,
      name: 'Cameron Williamson',
      course: 'Data Science with R',
      avatar: 'https://i.pravatar.cc/150?img=8',
      issuedDate: '12 Aug 2024',
      status: 'Issued'
    },
    {
      id: 4,
      name: 'Cody Fisher',
      course: 'Machine Learning Basics',
      avatar: 'https://i.pravatar.cc/150?img=12',
      issuedDate: '05 Aug 2024',
      status: 'Issued'
    },
    {
      id: 5,
      name: 'Randy Orton',
      course: 'Machine Learning Basics',
      avatar: 'https://i.pravatar.cc/150?img=12',
      issuedDate: '05 Aug 2024',
      status: 'Issued'
    }
  ];

  const filteredReadyStudents = studentsReadyToIssue.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIssuedStudents = studentsIssued.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Certificate Management</h1>

        {/* Search and Tabs Section */}
        <div className="mb-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student name or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('ready')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'ready'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Ready to Issue
            </button>
            <button
              onClick={() => setActiveTab('issued')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'issued'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Issued
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === 'ready' ? (
            filteredReadyStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Student Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.course}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                    {student.status}
                  </Badge>
                </div>

                {/* Date and Actions */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Completed: {student.completedDate}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Award className="w-4 h-4" />
                      Issue Certificate
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            filteredIssuedStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Student Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-600">{student.course}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                    {student.status}
                  </Badge>
                </div>

                {/* Date and Actions */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Issued: {student.issuedDate}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <RotateCw className="w-4 h-4" />
                      Re-issue
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {((activeTab === 'ready' && filteredReadyStudents.length === 0) ||
          (activeTab === 'issued' && filteredIssuedStudents.length === 0)) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagement;
