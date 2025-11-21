import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  CheckCircle,
  Lock,
  UploadCloud,
  Award,
  CreditCard,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';
// Link removed to prevent Router errors in preview
// import { Link } from 'react-router-dom';

const StudentCurrentLearningPage = () => {
  const [activeModule, setActiveModule] = useState(1); // ID of expanded module
  const [activeLesson, setActiveLesson] = useState(null); // Currently viewing lesson/quiz/task
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- MOCK COURSE DATA ---
  const courseData = {
    id: 1,
    title: 'Full Stack Web Development',
    progress: 40,
    modules: [
      {
        id: 1,
        title: 'Module 1: HTML & CSS Fundamentals',
        isLocked: false,
        isCompleted: true,
        lessons: [
          {
            id: 'l1',
            title: 'Introduction to HTML5',
            type: 'video',
            duration: '10m',
            completed: true,
          },
          {
            id: 'l2',
            title: 'CSS Box Model & Flexbox',
            type: 'video',
            duration: '25m',
            completed: true,
          },
          { id: 'q1', title: 'Frontend Basics Quiz', type: 'quiz', completed: true, score: '8/10' },
          {
            id: 't1',
            title: 'Build a Landing Page',
            type: 'task',
            completed: true,
            status: 'Submitted',
          },
        ],
      },
      {
        id: 2,
        title: 'Module 2: JavaScript Essentials',
        isLocked: false, // Unlocked because Module 1 is done
        isCompleted: false,
        lessons: [
          {
            id: 'l3',
            title: 'Variables, Types & Functions',
            type: 'video',
            duration: '15m',
            completed: false,
          },
          { id: 'l4', title: 'DOM Manipulation', type: 'video', duration: '30m', completed: false },
          { id: 'q2', title: 'JS Logic Quiz', type: 'quiz', completed: false },
          { id: 't2', title: 'Interactive To-Do List', type: 'task', completed: false },
        ],
      },
      {
        id: 3,
        title: 'Module 3: React Framework',
        isLocked: true, // Locked until Module 2 is done
        isCompleted: false,
        lessons: [],
      },
    ],
    capstone: {
      isLocked: true,
      title: 'Capstone: E-Commerce Platform',
    },
  };

  // --- RENDER HELPERS ---

  // Render the Main Content Area (Video, Quiz, or Task)
  const renderContent = () => {
    if (!activeLesson)
      return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
          <PlayCircle size={64} className="mb-4 opacity-20" />
          <h2 className="text-2xl font-bold text-zinc-300">Select a lesson to start</h2>
          <p>Choose a module from the sidebar.</p>
        </div>
      );

    if (activeLesson.type === 'video') {
      return (
        <div className="space-y-6">
          <div className="aspect-video bg-black rounded-xl border border-zinc-800 flex items-center justify-center relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <PlayCircle
              size={80}
              className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all z-10"
            />
            <p className="absolute bottom-6 left-6 font-bold text-xl z-10">{activeLesson.title}</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <h3>Lesson Notes</h3>
            <p>
              In this lesson, we cover the core concepts of {activeLesson.title}. Make sure to
              practice the examples shown in the video.
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors">
            Mark as Completed
          </button>
        </div>
      );
    }

    if (activeLesson.type === 'quiz') {
      return (
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold">{activeLesson.title}</h2>
            <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded text-sm font-bold">
              10 Questions
            </span>
          </div>

          {/* Mock Question */}
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-lg font-medium mb-4">
                1. Which HTML tag is used to define an internal style sheet?
              </p>
              <div className="space-y-3">
                {['<css>', '<script>', '<style>', '<link>'].map((opt, i) => (
                  <label
                    key={i}
                    className="flex items-center p-4 border border-zinc-700 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors"
                  >
                    <input type="radio" name="q1" className="mr-4 accent-blue-600 w-5 h-5" />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-white shadow-lg transition-colors">
              Submit Quiz
            </button>
          </div>
        </div>
      );
    }

    if (activeLesson.type === 'task') {
      return (
        <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud size={32} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{activeLesson.title}</h2>
          <p className="text-zinc-400 mb-8">
            Upload your project files (ZIP or link to GitHub) for review.
          </p>

          <div className="border-2 border-dashed border-zinc-700 rounded-xl p-10 hover:border-blue-500 hover:bg-zinc-800/50 transition-all cursor-pointer mb-6">
            <p className="font-medium text-zinc-300">Drag & Drop or Click to Upload</p>
            <p className="text-xs text-zinc-500 mt-2">Max file size: 10MB</p>
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-white transition-colors">
            Submit Assignment
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
      {/* --- SIDEBAR (Course Modules) --- */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-80 bg-zinc-900 border-l border-zinc-800 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg leading-tight line-clamp-1">{courseData.title}</h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
              <div className="flex-1 h-1.5 bg-zinc-700 rounded-full w-24 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${courseData.progress}%` }}
                ></div>
              </div>
              <span>{courseData.progress}% Done</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-zinc-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {courseData.modules.map(module => (
            <div
              key={module.id}
              className={`border rounded-xl overflow-hidden transition-all ${module.isLocked ? 'border-zinc-800 opacity-60' : 'border-zinc-700 bg-black/20'}`}
            >
              {/* Module Header */}
              <button
                disabled={module.isLocked}
                onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {module.isLocked ? (
                    <Lock size={16} className="text-zinc-500" />
                  ) : module.isCompleted ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500"></div>
                  )}
                  <span
                    className={`font-bold text-sm ${module.isLocked ? 'text-zinc-500' : 'text-white'}`}
                  >
                    {module.title}
                  </span>
                </div>
                {!module.isLocked &&
                  (activeModule === module.id ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  ))}
              </button>

              {/* Module Content (Accordion) */}
              {activeModule === module.id && !module.isLocked && (
                <div className="bg-zinc-900/50 border-t border-zinc-800">
                  {module.lessons.map(lesson => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLesson(lesson);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full p-3 pl-11 flex items-center gap-3 text-sm hover:bg-blue-900/20 transition-colors border-l-2 ${activeLesson?.id === lesson.id ? 'border-blue-500 bg-blue-900/10 text-blue-400' : 'border-transparent text-zinc-400'}`}
                    >
                      {lesson.type === 'video' && <PlayCircle size={14} />}
                      {lesson.type === 'quiz' && <FileText size={14} />}
                      {lesson.type === 'task' && <UploadCloud size={14} />}
                      <span className="truncate">{lesson.title}</span>
                      {lesson.completed && (
                        <CheckCircle size={12} className="ml-auto text-green-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Capstone Section */}
          <div
            className={`border rounded-xl p-4 ${courseData.capstone.isLocked ? 'border-zinc-800 bg-zinc-900/30 opacity-60' : 'border-yellow-500/30 bg-yellow-900/10'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Award
                size={20}
                className={courseData.capstone.isLocked ? 'text-zinc-500' : 'text-yellow-500'}
              />
              <span className="font-bold text-sm">Capstone Project</span>
            </div>
            <p className="text-xs text-zinc-500 mb-3">Complete all modules to unlock.</p>
            {courseData.capstone.isLocked ? (
              <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-900 py-2 px-3 rounded border border-zinc-800">
                <Lock size={12} /> Locked
              </div>
            ) : (
              <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold py-2 rounded transition-colors">
                View Project
              </button>
            )}
          </div>

          {/* Final Payment Prompt (Shown if Capstone is unlocked/completed) */}
          {/* For demo, showing it as a disabled state at bottom */}
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard size={20} className="text-blue-400" />
              <span className="font-bold text-sm text-blue-100">Final Certification</span>
            </div>
            <p className="text-xs text-blue-300/70 mb-3">Pay remaining fee to get certified.</p>
            <button
              disabled={courseData.capstone.isLocked}
              className="w-full bg-blue-600 disabled:bg-zinc-700 disabled:text-zinc-500 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors"
            >
              Pay & Download
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 md:mr-0">
        {' '}
        {/* md:mr-80 if sidebar was not flex */}
        {/* Top Bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur">
          <div className="flex items-center gap-4">
            {/* Replaced Link with <a> for preview compatibility */}
            <a
              href="/app/courses"
              className="text-zinc-400 hover:text-white text-sm flex items-center gap-1"
            >
              ← Back to Courses
            </a>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-zinc-400">
            <Menu size={24} />
          </button>
        </header>
        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentCurrentLearningPage;
