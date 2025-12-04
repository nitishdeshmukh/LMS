import React, { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle, ClipboardList, CheckCircle, Lock } from 'lucide-react';
import { useParams } from 'react-router-dom';

import QuizCard from '../components/QuizCard';
import { useCourseQuizzes } from '../hooks';

const StudentCourseQuizzesPage = () => {
  const { coursename } = useParams();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const { quizzes, courseId, courseTitle, loading, error, refetch } = useCourseQuizzes(coursename);

  const handleQuizComplete = () => {
    refetch();
    setSelectedQuiz(null);
  };

  const getStatusBadge = quiz => {
    if (quiz.status === 'Locked' || quiz.isModuleLocked) {
      return (
        <span className="flex items-center gap-1 text-zinc-500 text-sm">
          <Lock size={14} />
          Locked
        </span>
      );
    }
    if (quiz.status === 'Submitted' || quiz.isCompleted) {
      return (
        <span className="flex items-center gap-1 text-green-400 text-sm">
          <CheckCircle size={14} />
          Completed
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-blue-400 text-sm">
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

  if (selectedQuiz) {
    return (
      <div className="p-6 sm:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="flex gap-2 cursor-pointer p-2 mb-4 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft /> <span>Back to quizzes</span>
        </button>
        <QuizCard
          courseSlug={coursename}
          quizId={selectedQuiz.id}
          courseId={courseId}
          moduleId={selectedQuiz.moduleId}
          onComplete={handleQuizComplete}
          isSubmitted={selectedQuiz.status === 'Submitted' || selectedQuiz.isCompleted}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 h-full overflow-y-auto custom-scrollbar bg-black text-white w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{courseTitle} - Quizzes</h1>

      {!quizzes || quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <ClipboardList size={48} className="sm:w-16 sm:h-16 text-zinc-600 mb-4" />
          <p className="text-zinc-400 text-sm sm:text-base">No quizzes available for this course</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {quizzes.map(quiz => {
            const isLocked = quiz.status === 'Locked' || quiz.isModuleLocked;
            const isSubmitted = quiz.status === 'Submitted' || quiz.isCompleted;

            return (
              <div
                key={quiz.id}
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
                        <ClipboardList size={18} className="text-blue-400 shrink-0" />
                      )}
                      <h3 className="font-bold text-base sm:text-lg line-clamp-1">{quiz.title}</h3>
                      {getStatusBadge(quiz)}
                    </div>
                    <p className="text-zinc-500 text-xs sm:text-sm mb-1 truncate">{quiz.moduleTitle}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <span className="text-zinc-400">{quiz.questionsCount} Questions</span>
                      {quiz.score && (
                        <span className="text-green-400">Score: {quiz.score}</span>
                      )}
                      {quiz.submissionDetails && (
                        <span className="text-green-400">
                          ({quiz.submissionDetails.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                  {isLocked ? (
                    <div className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-zinc-800 text-zinc-500 rounded-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock size={14} className="sm:w-4 sm:h-4" />
                      Locked
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedQuiz(quiz)}
                      className={`w-full sm:w-auto px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
                        isSubmitted
                          ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isSubmitted ? 'View Results' : 'Start Quiz'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCourseQuizzesPage;
