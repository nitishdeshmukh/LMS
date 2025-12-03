import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Notebook,
  FileText,
  CheckCircle,
  UploadCloud,
  Award,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Video,
  Lock,
  Download,
  Clock,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import QuizCard from '../components/QuizCard';
import AssignmentCard from '../components/AssignmentCard';
import CapstoneCard from '../components/CapstoneCard';
import PaymentModal from '../components/PaymentModal';
import { useCourseDetails, useMarkModuleAccessed, useCourseProgress, useProfile } from '../hooks';
import { downloadModuleCertificate } from '../utils/downloadModuleCertificate';

const StudentLearningPage = () => {
  const { coursename } = useParams();
  const [activeModule, setActiveModule] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [bar, setbar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [downloadingCertificate, setDownloadingCertificate] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch course details and progress
  const { course, loading, error, refetch } = useCourseDetails(coursename);
  const { progress, refetch: refetchProgress } = useCourseProgress(coursename);
  const { markAccessed } = useMarkModuleAccessed();
  const { profile } = useProfile();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set first module as active when course loads
  useEffect(() => {
    if (course?.modules && activeModule === null) {
      const firstModule = course.modules[0];
      if (firstModule) {
        setActiveModule(firstModule._id || firstModule.id);
      }
    }
  }, [course, activeModule]);

  // Track module access
  const handleModuleAccess = async moduleId => {
    if (!course) return;
    try {
      await markAccessed(course._id || course.id, moduleId);
    } catch (err) {
      // Silently fail - this is just for tracking
      console.error('Failed to track module access:', err);
    }
  };

  const handleQuizComplete = () => {
    refetch();
    refetchProgress();
    toast.success('Quiz completed!');
  };

  const handleTaskComplete = () => {
    refetch();
    refetchProgress();
    toast.success('Assignment submitted!');
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

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white">
        <BookOpen size={64} className="text-zinc-600 mb-4" />
        <p className="text-zinc-400">Course not found</p>
      </div>
    );
  }

  // Calculate overall progress
  const overallProgress = progress?.progressPercentage || course.progress || 0;

  // Check if all modules are completed for capstone unlock
  const allModulesCompleted = course.modules?.every(module => module.isCompleted) ?? false;

  return (
    <div className="flex h-full relative bg-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* Main Content Area */}
      <div
        className={`grow overflow-y-auto p-6 md:p-10 transition-all duration-300 ${bar ? 'mr-0 lg:mr-0' : 'mr-0'}`}
      >
        {/* No selection state */}
        {!activeContent && (
          <div className="container mx-auto flex flex-col items-center justify-center h-full text-zinc-500">
            <Notebook size={64} className="mb-4 opacity-20" />
            <h2 className="text-2xl font-bold text-zinc-300">Select content to start learning</h2>
            <p>Choose a module from the sidebar.</p>
          </div>
        )}

        {/* Text Link Content */}
        {activeContent?.type === 'textLink' && (
          <div className="container mx-autospace-y-6">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText size={32} className="text-blue-400" />
                <h2 className="text-2xl font-bold">{activeContent.data.title}</h2>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <p className="text-zinc-400">
                  Click the link below to access the reading material for this section.
                </p>
              </div>

              <a
                href={activeContent.data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
              >
                <ExternalLink size={18} />
                Open Reading Material
              </a>
            </div>
          </div>
        )}

        {/* All Resources Content */}
        {activeContent?.type === 'allResources' && (
          <div className="container mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={32} className="text-blue-400" />
              <div>
                <h2 className="text-2xl font-bold">Resources</h2>
                <p className="text-zinc-400 text-sm">{activeContent.moduleTitle}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {activeContent.data.map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <FileText size={24} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        Reading Material {idx + 1}
                      </h3>
                      <p className="text-zinc-500 text-sm wrap-anywhere">{url}</p>
                    </div>
                    <ExternalLink
                      size={20}
                      className="text-zinc-500 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Video Link Content */}
        {activeContent?.type === 'videoLink' && (
          <div className=" container mx-auto space-y-6">
            <div className="aspect-video bg-black rounded-xl border border-zinc-800 overflow-hidden">
              {activeContent.data.url.includes('youtube.com') ||
              activeContent.data.url.includes('youtu.be') ? (
                <iframe
                  src={activeContent.data.url
                    .replace('watch?v=', 'embed/')
                    .replace('youtu.be/', 'youtube.com/embed/')}
                  title={activeContent.data.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Video size={64} className="text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-4">{activeContent.data.title}</h3>
                  <a
                    href={activeContent.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                  >
                    <ExternalLink size={18} />
                    Watch Video
                  </a>
                </div>
              )}
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
              <h3 className="text-lg font-bold mb-2">{activeContent.data.title}</h3>
              {activeContent.data.description && (
                <p className="text-zinc-400">{activeContent.data.description}</p>
              )}
            </div>
          </div>
        )}

        {/* All Videos Content */}
        {activeContent?.type === 'allVideos' && (
          <div className="container mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Video size={32} className="text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold">Videos</h2>
                <p className="text-zinc-400 text-sm">{activeContent.moduleTitle}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {activeContent.data.map((url, idx) => {
                const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
                return (
                  <div
                    key={idx}
                    className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                  >
                    {isYoutube ? (
                      <div className="aspect-video">
                        <iframe
                          src={url
                            .replace('watch?v=', 'embed/')
                            .replace('youtu.be/', 'youtube.com/embed/')}
                          title={`Video ${idx + 1}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-6 flex items-center gap-4 hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Video size={24} className="text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                            Video {idx + 1}
                          </h3>
                          <p className="text-zinc-500 text-sm truncate">{url}</p>
                        </div>
                        <ExternalLink
                          size={20}
                          className="text-zinc-500 group-hover:text-purple-400 transition-colors"
                        />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quiz Content */}
        {activeContent?.type === 'quiz' && (
          <QuizCard
            courseSlug={coursename}
            quizId={activeContent.data._id || activeContent.data.id}
            courseId={course._id || course.id}
            moduleId={activeContent.moduleId}
            onComplete={handleQuizComplete}
          />
        )}

        {/* All Quizzes Content */}
        {activeContent?.type === 'allQuizzes' && (
          <div className="container mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Notebook size={32} className="text-green-400" />
              <div>
                <h2 className="text-2xl font-bold">Quizzes</h2>
                <p className="text-zinc-400 text-sm">{activeContent.moduleTitle}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {activeContent.data.map(quiz => {
                const quizId = quiz._id || quiz.id;
                return (
                  <button
                    key={quizId}
                    onClick={() =>
                      setActiveContent({
                        type: 'quiz',
                        data: quiz,
                        moduleId: activeContent.moduleId,
                      })
                    }
                    className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-green-500/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Notebook size={24} className="text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                          {quiz.title}
                        </h3>
                        <p className="text-zinc-500 text-sm">
                          {quiz.questionsCount || 0} questions
                        </p>
                      </div>
                      {quiz.isCompleted ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle size={20} />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : (
                        <ChevronRight
                          size={20}
                          className="text-zinc-500 group-hover:text-green-400 transition-colors"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Task/Assignment Content */}
        {activeContent?.type === 'task' && (
          <AssignmentCard
            task={activeContent.data}
            courseId={course._id || course.id}
            moduleId={activeContent.moduleId}
            onComplete={handleTaskComplete}
          />
        )}

        {/* All Tasks Content */}
        {activeContent?.type === 'allTasks' && (
          <div className="container mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <UploadCloud size={32} className="text-yellow-400" />
              <div>
                <h2 className="text-2xl font-bold">Assignments</h2>
                <p className="text-zinc-400 text-sm">{activeContent.moduleTitle}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {activeContent.data.map(task => {
                const taskId = task._id || task.id;
                const isSubmitted = task.status === 'Submitted' || task.isSubmitted;
                return (
                  <button
                    key={taskId}
                    onClick={() =>
                      setActiveContent({
                        type: 'task',
                        data: task,
                        moduleId: activeContent.moduleId,
                      })
                    }
                    className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 hover:border-yellow-500/50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                        <UploadCloud size={24} className="text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-yellow-400 transition-colors">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-zinc-500 text-sm line-clamp-1">{task.description}</p>
                        )}
                        {/* Show submitted link for submitted tasks */}
                        {isSubmitted && task.githubLink && (
                          <div
                            className="mt-2 flex items-center gap-2"
                            onClick={e => e.stopPropagation()}
                          >
                            <span className="text-zinc-500 text-sm">Submitted:</span>
                            <a
                              href={task.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                            >
                              {task.githubLink.length > 40
                                ? `${task.githubLink.substring(0, 40)}...`
                                : task.githubLink}
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                      </div>
                      {task.isCompleted ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle size={20} />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      ) : isSubmitted ? (
                        <div className="flex items-center gap-2 text-yellow-400">
                          <CheckCircle size={20} />
                          <span className="text-sm font-medium">Submitted</span>
                        </div>
                      ) : (
                        <ChevronRight
                          size={20}
                          className="text-zinc-500 group-hover:text-yellow-400 transition-colors"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Capstone Project Content */}
        {activeContent?.type === 'capstone' && (
          <CapstoneCard
            capstone={activeContent.data}
            courseId={course._id || course.id}
            allModulesCompleted={allModulesCompleted}
            onComplete={() => {
              refetch();
              refetchProgress();
              toast.success('Capstone project submitted!');
            }}
          />
        )}
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setbar(!bar)}
        className={`fixed top-24 z-30 p-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-l-full shadow-lg transition-all duration-300 ${
          bar ? 'right-80' : 'right-0'
        }`}
      >
        {bar ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {bar && isMobile && (
        <div className="inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setbar(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static right-0 h-[calc(100vh-5rem)] shrink-0 overflow-hidden transition-all duration-300 ease-in-out z-30 lg:z-auto ${
          bar ? 'w-80' : 'w-0'
        }`}
      >
        <div className="w-80 h-full bg-zinc-900 border-l border-zinc-800 flex flex-col">
          {/* Course Header */}
          <div className="p-6 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
            <h2 className="font-bold text-lg leading-tight line-clamp-1">{course.title}</h2>
            <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
              <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-green-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="font-medium text-zinc-300">{overallProgress}%</span>
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {course.modules?.map((module, moduleIndex) => {
              const moduleId = module._id || module.id;
              const isLocked = module.isLocked;
              const isModuleCompleted = module.isCompleted;

              return (
                <div
                  key={moduleId}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    isLocked
                      ? 'border-zinc-800 bg-zinc-900/50'
                      : isModuleCompleted
                        ? 'border-green-500/30 bg-green-950/30'
                        : 'border-zinc-700 bg-zinc-800/30'
                  }`}
                >
                  {/* Module Header */}
                  <button
                    onClick={() =>
                      !isLocked && setActiveModule(activeModule === moduleId ? null : moduleId)
                    }
                    disabled={isLocked}
                    className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                      isLocked
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-zinc-800/50 active:bg-zinc-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isLocked ? (
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">
                          <Lock size={12} className="text-zinc-500" />
                        </div>
                      ) : isModuleCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle size={14} className="text-green-500" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400">
                          {moduleIndex + 1}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`font-semibold text-sm block wrap-anywhere ${
                            isLocked ? 'text-zinc-500' : 'text-white'
                          }`}
                        >
                          {module.title}
                        </span>
                        {isLocked && (
                          <span className="text-xs text-yellow-500/80">
                            Complete previous module
                          </span>
                        )}
                        {!isLocked && module.maxTimelineInDays && (
                          <span className="text-xs text-zinc-500">
                            {module.maxTimelineInDays} days
                          </span>
                        )}
                      </div>
                    </div>
                    {!isLocked && (
                      <div className="shrink-0 ml-2">
                        {activeModule === moduleId ? (
                          <ChevronUp size={16} className="text-zinc-400" />
                        ) : (
                          <ChevronDown size={16} className="text-zinc-400" />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Module Content - Only show for unlocked modules */}
                  {!isLocked && activeModule === moduleId && (
                    <div className="bg-zinc-950/50 border-t border-zinc-800">
                      {/* Content Type Buttons */}
                      {(() => {
                        const hasResources = module.textLinks?.length > 0;
                        const hasVideos = module.videoLinks?.length > 0;
                        const hasQuizzes = module.quizzes?.length > 0;
                        const hasTasks = module.tasks?.length > 0;

                        const contentTypes = [];
                        if (hasResources)
                          contentTypes.push({
                            id: 'resources',
                            label: 'Resources',
                            icon: FileText,
                            count: module.textLinks.length,
                          });
                        if (hasVideos)
                          contentTypes.push({
                            id: 'videos',
                            label: 'Videos',
                            icon: Video,
                            count: module.videoLinks.length,
                          });
                        if (hasQuizzes)
                          contentTypes.push({
                            id: 'quizzes',
                            label: 'Quizzes',
                            icon: Notebook,
                            count: module.quizzes.length,
                          });
                        if (hasTasks)
                          contentTypes.push({
                            id: 'tasks',
                            label: 'Tasks',
                            icon: UploadCloud,
                            count: module.tasks.length,
                          });

                        if (contentTypes.length === 0) {
                          return (
                            <div className="p-4 text-center text-zinc-500 text-sm">
                              No content available
                            </div>
                          );
                        }

                        const handleTypeClick = typeId => {
                          handleModuleAccess(moduleId);
                          if (isMobile) setbar(false);

                          if (typeId === 'resources') {
                            setActiveContent({
                              type: 'allResources',
                              data: module.textLinks,
                              moduleId,
                              moduleTitle: module.title,
                            });
                          } else if (typeId === 'videos') {
                            setActiveContent({
                              type: 'allVideos',
                              data: module.videoLinks,
                              moduleId,
                              moduleTitle: module.title,
                            });
                          } else if (typeId === 'quizzes') {
                            // Directly open the quiz (only one per module)
                            const quiz = module.quizzes[0];
                            if (quiz) {
                              setActiveContent({
                                type: 'quiz',
                                data: quiz,
                                moduleId,
                              });
                            }
                          } else if (typeId === 'tasks') {
                            // Directly open the task (only one per module)
                            const task = module.tasks[0];
                            if (task) {
                              setActiveContent({
                                type: 'task',
                                data: task,
                                moduleId,
                              });
                            }
                          }
                        };

                        return (
                          <>
                            {/* Content Type Buttons */}
                            <div className="p-2 space-y-1">
                              {contentTypes.map(type => {
                                const Icon = type.icon;
                                const isActive =
                                  (type.id === 'resources' &&
                                    activeContent?.type === 'allResources' &&
                                    activeContent?.moduleId === moduleId) ||
                                  (type.id === 'videos' &&
                                    activeContent?.type === 'allVideos' &&
                                    activeContent?.moduleId === moduleId) ||
                                  (type.id === 'quizzes' &&
                                    activeContent?.type === 'quiz' &&
                                    activeContent?.moduleId === moduleId) ||
                                  (type.id === 'tasks' &&
                                    activeContent?.type === 'task' &&
                                    activeContent?.moduleId === moduleId);

                                // Check if this type has multiple items (show count only for resources/videos)
                                const showCount = type.id === 'resources' || type.id === 'videos';

                                return (
                                  <button
                                    key={type.id}
                                    onClick={() => handleTypeClick(type.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                      isActive
                                        ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
                                    }`}
                                  >
                                    <Icon size={16} />
                                    <span className="flex-1 text-left">{type.label}</span>
                                    {showCount && (
                                      <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                          isActive
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-zinc-800 text-zinc-500'
                                        }`}
                                      >
                                        {type.count}
                                      </span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Module Completion Status */}
                            {isModuleCompleted && (
                              <div className="px-3 pb-3 space-y-2">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 flex items-center justify-center gap-2">
                                  <CheckCircle size={14} className="text-green-500" />
                                  <span className="text-xs text-green-400 font-medium">
                                    Module Completed!
                                  </span>
                                </div>
                                <button
                                  onClick={async e => {
                                    e.stopPropagation();
                                    const moduleId = module._id || module.id;
                                    setDownloadingCertificate(moduleId);
                                    try {
                                      await downloadModuleCertificate({
                                        studentName: profile?.name || 'Student',
                                        courseName: course?.title || 'Course',
                                        moduleTitle: module.title,
                                      });
                                      toast.success('Certificate downloaded!');
                                    } catch {
                                      toast.error('Failed to download certificate');
                                    } finally {
                                      setDownloadingCertificate(null);
                                    }
                                  }}
                                  disabled={downloadingCertificate === (module._id || module.id)}
                                  className="w-full flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-50 rounded-lg p-2.5 transition-colors"
                                >
                                  {downloadingCertificate === (module._id || module.id) ? (
                                    <Loader2 size={14} className="text-amber-400 animate-spin" />
                                  ) : (
                                    <Download size={14} className="text-amber-400" />
                                  )}
                                  <span className="text-xs text-amber-400 font-medium">
                                    Download Certificate
                                  </span>
                                </button>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Capstone Project - Before Certificate */}
            {course.capstone?.title && (
              <button
                onClick={() => {
                  if (allModulesCompleted) {
                    setActiveContent({
                      type: 'capstone',
                      data: course.capstone,
                    });
                    if (isMobile) setbar(false);
                  }
                }}
                disabled={!allModulesCompleted}
                className={`w-full text-left border rounded-xl p-4 transition-all duration-200 ${
                  !allModulesCompleted
                    ? 'border-zinc-800 bg-zinc-900/50 opacity-60 cursor-not-allowed'
                    : course.capstone.isCompleted || course.capstone.isSubmitted
                      ? 'border-green-500/30 bg-green-950/30 hover:bg-green-950/40'
                      : 'border-yellow-500/30 bg-yellow-950/20 hover:bg-yellow-950/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  {!allModulesCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                      <Lock size={14} className="text-zinc-500" />
                    </div>
                  ) : course.capstone.isCompleted || course.capstone.isSubmitted ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Award size={16} className="text-yellow-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <span
                      className={`font-bold text-sm block ${
                        !allModulesCompleted ? 'text-zinc-500' : 'text-white'
                      }`}
                    >
                      Capstone Project
                    </span>
                    <span className="text-xs text-zinc-500">{course.capstone.title}</span>
                    {!allModulesCompleted && (
                      <p className="text-xs text-yellow-500/70 mt-1">
                        Complete all modules to unlock
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )}

            {/* Certification */}
            <div className="mt-4 p-4 bg-linear-to-br from-blue-900/30 to-blue-950/30 border border-blue-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <CreditCard size={16} className="text-blue-400" />
                </div>
                <span className="font-bold text-sm text-white">Final Certification</span>
              </div>
              
              {/* Different states based on course completion and payment */}
              {(() => {
                const capstoneComplete = course.capstone?.isCompleted || course.capstone?.isSubmitted;
                const isFullyPaid = course.paymentStatus === 'FULLY_PAID';
                const isPaymentPending = course.paymentStatus === 'FULLY_PAYMENT_VERIFICATION_PENDING';
                const courseComplete = allModulesCompleted && capstoneComplete;

                // State 1: Course not complete
                if (!courseComplete) {
                  return (
                    <>
                      <p className="text-xs text-zinc-400 mb-4">
                        Complete all modules and capstone to earn your certificate.
                      </p>
                      <button
                        disabled
                        className="w-full bg-zinc-800 text-zinc-500 text-sm font-semibold py-2.5 rounded-lg cursor-not-allowed"
                      >
                        {!allModulesCompleted
                          ? `${overallProgress}% Complete`
                          : 'Complete Capstone First'}
                      </button>
                    </>
                  );
                }

                // State 2: Course complete but not fully paid
                if (!isFullyPaid && !isPaymentPending) {
                  return (
                    <>
                      <p className="text-xs text-zinc-400 mb-2">
                        Course completed! Pay remaining amount to get your certificate.
                      </p>
                      <div className="flex items-center justify-between text-xs mb-4 bg-zinc-800/50 rounded-lg p-2">
                        <span className="text-zinc-500">Amount Remaining:</span>
                        <span className="text-blue-400 font-bold">₹{course.amountRemaining || 0}</span>
                      </div>
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CreditCard size={16} />
                        Pay & Request Certificate
                      </button>
                    </>
                  );
                }

                // State 3: Payment verification pending
                if (isPaymentPending) {
                  return (
                    <>
                      <p className="text-xs text-zinc-400 mb-4">
                        Your payment is being verified. Certificate will be available once approved.
                      </p>
                      <div className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2">
                        <Clock size={16} />
                        Payment Verification Pending
                      </div>
                    </>
                  );
                }

                // State 4: Fully paid - can get certificate
                return (
                  <>
                    <p className="text-xs text-zinc-400 mb-4">
                      Congratulations! Your certificate is ready to download.
                    </p>
                    <button
                      onClick={() => window.open(`/student/certificates/${coursename}`, '_blank')}
                      className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Award size={16} />
                      Get Certificate
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        enrollmentId={course?.enrollmentId}
        courseTitle={course?.title}
        amountRemaining={course?.amountRemaining}
        bankDetails={course?.bankDetails}
        onSuccess={() => {
          refetch();
          toast.success('Payment submitted! Certificate will be available after verification.');
        }}
      />
    </div>
  );
};

export default StudentLearningPage;
