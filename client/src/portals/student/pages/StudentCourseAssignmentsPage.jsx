import React, { useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  CheckCircle,
  Clock,
  Lock,
  ExternalLink,
  Award,
  Trophy,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

import AssignmentCard from '../components/AssignmentCard';
import CapstoneCard from '../components/CapstoneCard';
import { useCourseAssignments, useCourseDetails } from '../hooks';

const StudentCourseAssignmentsPage = () => {
  const { coursename } = useParams();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCapstone, setShowCapstone] = useState(false);
  const { assignments, courseId, courseTitle, loading, error, refetch } =
    useCourseAssignments(coursename);
  const { course } = useCourseDetails(coursename);

  // Check if all modules are completed
  const allModulesCompleted = course?.modules?.every(module => module.isCompleted) ?? false;

  // Check if all assignments are completed
  // const allAssignmentsCompleted = assignments?.every(a => a.isCompleted) ?? false;

  const handleAssignmentComplete = () => {
    refetch();
    setSelectedAssignment(null);
  };

  const handleCapstoneComplete = () => {
    refetch();
    setShowCapstone(false);
  };

  const getStatusBadge = assignment => {
    // Check if module is locked first
    if (assignment.status === 'Locked' || assignment.isModuleLocked) {
      return (
        <span className="flex items-center gap-1 text-zinc-500 text-sm">
          <Lock size={14} />
          Locked
        </span>
      );
    }
    if (assignment.isCompleted) {
      return (
        <span className="flex items-center gap-1 text-green-400 text-sm">
          <CheckCircle size={14} />
          Completed
        </span>
      );
    }
    if (assignment.status === 'Submitted' || assignment.isSubmitted) {
      if (assignment.submissionStatus === 'graded') {
        return (
          <span className="flex items-center gap-1 text-blue-400 text-sm">
            <CheckCircle size={14} />
            Graded
          </span>
        );
      }
      return (
        <span className="flex items-center gap-1 text-yellow-400 text-sm">
          <Clock size={14} />
          Submitted
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-green-400 text-sm">
        <CheckCircle size={14} className="opacity-50" />
        Open
      </span>
    );
  };

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

  if (selectedAssignment) {
    return (
      <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
        <button
          onClick={() => setSelectedAssignment(null)}
          className="flex gap-2 cursor-pointer p-2 mb-4 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft /> <span>Back to assignments</span>
        </button>
        <AssignmentCard
          task={selectedAssignment}
          courseId={courseId}
          moduleId={selectedAssignment.moduleId}
          onComplete={handleAssignmentComplete}
        />
      </div>
    );
  }

  if (showCapstone) {
    return (
      <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
        <button
          onClick={() => setShowCapstone(false)}
          className="flex gap-2 cursor-pointer p-2 mb-4 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft /> <span>Back to assignments</span>
        </button>
        <CapstoneCard
          capstone={course?.capstone}
          courseId={courseId}
          allModulesCompleted={allModulesCompleted}
          onComplete={handleCapstoneComplete}
        />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
      <h1 className="text-2xl font-bold mb-6">{courseTitle} - Assignments</h1>

      {!assignments || assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText size={64} className="text-zinc-600 mb-4" />
          <p className="text-zinc-400">No assignments available for this course</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(assignment => {
            const isLocked = assignment.status === 'Locked' || assignment.isModuleLocked;
            const isSubmitted = assignment.status === 'Submitted' || assignment.isSubmitted;

            return (
              <div
                key={assignment.id}
                className={`bg-zinc-900 border rounded-xl p-6 transition-colors ${
                  isLocked ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isLocked ? (
                        <Lock size={20} className="text-zinc-500" />
                      ) : (
                        <FileText size={20} className="text-green-400" />
                      )}
                      <h3 className="font-bold text-lg">{assignment.title}</h3>
                      {getStatusBadge(assignment)}
                    </div>
                    <p className="text-zinc-500 text-sm mb-1">{assignment.moduleTitle}</p>
                    {assignment.description && (
                      <p className="text-zinc-400 text-sm line-clamp-2">{assignment.description}</p>
                    )}
                    {assignment.grade && (
                      <p className="text-green-400 text-sm mt-2">Grade: {assignment.grade}</p>
                    )}
                    {/* Show submitted link for submitted assignments */}
                    {isSubmitted && assignment.githubLink && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-zinc-500 text-sm">Submitted:</span>
                        <a
                          href={assignment.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          {assignment.githubLink.substring(0, 40)}...
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                  {isLocked ? (
                    <div className="px-6 py-2 bg-zinc-800 text-zinc-500 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed">
                      <Lock size={16} />
                      Locked
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        assignment.isCompleted
                          ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                          : isSubmitted
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {assignment.isCompleted
                        ? 'View Details'
                        : isSubmitted
                          ? 'View Submission'
                          : 'Submit'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Capstone Project Section */}
          {course?.capstone?.title && (
            <div
              className={`bg-linear-to-br from-zinc-900 to-zinc-900/80 border rounded-xl p-6 transition-all ${
                !allModulesCompleted
                  ? 'border-zinc-800 opacity-60'
                  : course.capstone.isCompleted
                    ? 'border-green-500/30'
                    : 'border-yellow-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {!allModulesCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        <Lock size={20} className="text-zinc-500" />
                      </div>
                    ) : course.capstone.isCompleted ? (
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle size={20} className="text-green-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <Trophy size={20} className="text-yellow-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Award size={18} className="text-yellow-400" />
                        Capstone Project
                      </h3>
                      <p className="text-zinc-400 text-sm">{course.capstone.title}</p>
                    </div>
                    {!allModulesCompleted ? (
                      <span className="flex items-center gap-1 text-zinc-500 text-sm ml-2">
                        <Lock size={14} />
                        Locked
                      </span>
                    ) : course.capstone.isCompleted ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm ml-2">
                        <CheckCircle size={14} />
                        Completed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-400 text-sm ml-2">
                        <Award size={14} />
                        Available
                      </span>
                    )}
                  </div>
                  {course.capstone.description && (
                    <p className="text-zinc-400 text-sm line-clamp-2 ml-13 pl-13">
                      {course.capstone.description}
                    </p>
                  )}
                  {!allModulesCompleted && (
                    <p className="text-yellow-500/70 text-xs mt-2 ml-13">
                      Complete all module assignments to unlock
                    </p>
                  )}
                </div>
                {!allModulesCompleted ? (
                  <div className="px-6 py-2 bg-zinc-800 text-zinc-500 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed">
                    <Lock size={16} />
                    Locked
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCapstone(true)}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      course.capstone.isCompleted
                        ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                        : 'bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white'
                    }`}
                  >
                    {course.capstone.isCompleted ? 'View Details' : 'Submit Capstone'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCourseAssignmentsPage;
