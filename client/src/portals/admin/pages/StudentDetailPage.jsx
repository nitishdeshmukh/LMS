'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, GraduationCap, School, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/common/components/ui/button';

/**
 * Fetches student data from fallback or API
 * @param {string|number} studentId - Student identifier
 * @returns {Object|null} Student data or null if not found
 */
const fetchStudentData = async studentId => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Convert studentId to number for comparison
  const id = parseInt(studentId, 10);

  // Find student by ID in fallback data
  const student = FALLBACK_STUDENTS.find(s => s.id === id);

  return student || null;

  // For production, replace above with actual API call:
  // try {
  //   const response = await fetch(`/api/students/${studentId}`);
  //   if (!response.ok) return null;
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error fetching student:', error);
  //   return null;
  // }
};

/**
 * StudentDetailPage - Displays detailed information about a student
 */
const StudentDetailPage = () => {
  const { studentId } = useParams(); // Get dynamic parameter from URL
  const location = useLocation(); // Get navigation state
  const navigate = useNavigate();

  const [student, setStudent] = useState(location.state?.student);
  const [loading, setLoading] = useState(!location.state?.student);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // If student data is not in navigation state, fetch it
    if (!location.state?.student && studentId) {
      setLoading(true);
      fetchStudentData(studentId)
        .then(data => {
          if (data) {
            setStudent(data);
            setNotFound(false);
          } else {
            setNotFound(true);
          }
        })
        .catch(error => {
          console.error('Error loading student data:', error);
          setNotFound(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [studentId, location.state]);

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Loading Student Data...</h2>
            <p className="text-zinc-400">Please wait while we fetch the information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where student is not found
  if (notFound || !student) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Student Not Found</h2>
            <p className="text-zinc-400 mb-6">
              No student data available for ID: <span className="font-mono">#{studentId}</span>
            </p>
            <Button
              onClick={() => navigate('/admin/students')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>

        {/* Student Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {student.studentName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-zinc-100 mb-2">{student.studentName}</h1>
              <p className="text-zinc-400">Student ID: #{student.id}</p>
            </div>
          </div>
        </div>

        {/* Student Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Email */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-medium text-zinc-400">Email Address</h3>
            </div>
            <p className="text-lg text-zinc-100">{student.email}</p>
          </div>

          {/* Course */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <GraduationCap className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-sm font-medium text-zinc-400">Enrolled Course</h3>
            </div>
            <p className="text-lg text-zinc-100">{student.course}</p>
          </div>

          {/* College */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <School className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-medium text-zinc-400">College</h3>
            </div>
            <p className="text-lg text-zinc-100">{student.college}</p>
          </div>

          {/* Enrollment Date */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-sm font-medium text-zinc-400">Enrollment Date</h3>
            </div>
            <p className="text-lg text-zinc-100">
              {new Date(student.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-zinc-100 mb-4">Additional Information</h2>
          <div className="space-y-3 text-zinc-300">
            <p>Course progress, certificates, and other details can be displayed here.</p>
            {/* Add more detailed information as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
