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
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{courseTitle} - Assignments</h1>

      {!assignments || assignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <FileText size={48} className="sm:w-16 sm:h-16 text-zinc-600 mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">No assignments available for this course</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {assignments.map(assignment => {
            const isLocked = assignment.status === 'Locked' || assignment.isModuleLocked;
            const isSubmitted = assignment.status === 'Submitted' || assignment.isSubmitted;

            return (
              <div
                key={assignment.id}
                className={`bg-zinc-900 border rounded-lg sm:rounded-xl p-4 sm:p-6 transition-colors ${
                  isLocked ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      {isLocked ? (
                        <Lock size={18} className="text-zinc-500 shrink-0" />
                      ) : (
                        <FileText size={18} className="text-green-400 shrink-0" />
                      )}
                      <h3 className="font-bold text-base sm:text-lg line-clamp-1">{assignment.title}</h3>
                      {getStatusBadge(assignment)}
                    </div>
                    <p className="text-zinc-500 text-xs sm:text-sm mb-1 truncate">{assignment.moduleTitle}</p>
                    {assignment.description && (
                      <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2">{assignment.description}</p>
                    )}
                    {assignment.grade && (
                      <p className="text-green-400 text-xs sm:text-sm mt-2">Grade: {assignment.grade}</p>
                    )}
                    {/* Show submitted link for submitted assignments */}
                    {isSubmitted && assignment.githubLink && (
                      <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-zinc-500 text-xs sm:text-sm">Submitted:</span>
                        <a
                          href={assignment.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm flex items-center gap-1 truncate max-w-[200px] sm:max-w-[300px]"
                        >
                          {assignment.githubLink.substring(0, 30)}...
                          <ExternalLink size={12} className="shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>
                  {isLocked ? (
                    <div className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-zinc-800 text-zinc-500 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock size={14} className="sm:w-4 sm:h-4" />
                      Locked
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
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
              className={`bg-linear-to-br from-zinc-900 to-zinc-900/80 border rounded-lg sm:rounded-xl p-4 sm:p-6 transition-all ${
                !allModulesCompleted
                  ? 'border-zinc-800 opacity-60'
                  : course.capstone.isCompleted
                    ? 'border-green-500/30'
                    : 'border-yellow-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    {!allModulesCompleted ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                        <Lock size={16} className="sm:w-5 sm:h-5 text-zinc-500" />
                      </div>
                    ) : course.capstone.isCompleted ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle size={16} className="sm:w-5 sm:h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                        <Trophy size={16} className="sm:w-5 sm:h-5 text-yellow-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                        <Award size={16} className="sm:w-[18px] sm:h-[18px] text-yellow-400 shrink-0" />
                        <span className="truncate">Capstone Project</span>
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm truncate">{course.capstone.title}</p>
                    </div>
                    <div className="w-full sm:w-auto mt-1 sm:mt-0">
                      {!allModulesCompleted ? (
                        <span className="flex items-center gap-1 text-zinc-500 text-xs sm:text-sm">
                          <Lock size={12} className="sm:w-[14px] sm:h-[14px]" />
                          Locked
                        </span>
                      ) : course.capstone.isCompleted ? (
                        <span className="flex items-center gap-1 text-green-400 text-xs sm:text-sm">
                          <CheckCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-400 text-xs sm:text-sm">
                          <Award size={12} className="sm:w-[14px] sm:h-[14px]" />
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                  {course.capstone.description && (
                    <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2 sm:ml-11">
                      {course.capstone.description}
                    </p>
                  )}
                  {!allModulesCompleted && (
                    <p className="text-yellow-500/70 text-xs mt-2 sm:ml-11">
                      Complete all module assignments to unlock
                    </p>
                  )}
                </div>
                {!allModulesCompleted ? (
                  <div className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-zinc-800 text-zinc-500 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock size={14} className="sm:w-4 sm:h-4" />
                    Locked
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCapstone(true)}
                    className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
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
