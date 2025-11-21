import React, { useState } from 'react';
import {
  PlayCircle,
  FileQuestion,
  UploadCloud,
  CheckCircle,
  Award,
  ChevronLeft,
  Clock,
  BarChart,
  Code,
  Menu,
  X,
  Lock,
} from 'lucide-react';
// Removed Link import to prevent Router context errors in preview
// import { Link } from 'react-router-dom';

const ProgramDetails = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);

  // Mock Data for Modules
  const moduleData = [
    {
      id: 1,
      title: 'Module 1: Frontend Fundamentals',
      desc: 'Master the building blocks of the web: HTML5, CSS3, and Responsive Design.',
      status: 'Completed',
      tasks: [
        { type: 'tutorial', title: 'HTML5 Semantic Structure', link: '#' },
        { type: 'tutorial', title: 'CSS Flexbox & Grid', link: '#' },
        { type: 'quiz', title: 'Frontend Basics Quiz', link: '#' },
        { type: 'assignment', title: 'Build a Portfolio Site', link: '#' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: JavaScript Mastery',
      desc: 'Deep dive into ES6+, DOM manipulation, and asynchronous programming.',
      status: 'In Progress',
      tasks: [
        { type: 'tutorial', title: 'Variables, Loops & Functions', link: '#' },
        { type: 'tutorial', title: 'Async/Await & Promises', link: '#' },
        { type: 'quiz', title: 'JS Logic Assessment', link: '#' },
        { type: 'assignment', title: 'Interactive To-Do App', link: '#' },
      ],
    },
    {
      id: 3,
      title: 'Module 3: React.js Framework',
      desc: 'Learn component-based architecture, Hooks, and State Management.',
      status: 'Locked',
      tasks: [
        { type: 'tutorial', title: 'React Components & Props', link: '#' },
        { type: 'tutorial', title: 'useState & useEffect', link: '#' },
        { type: 'quiz', title: 'React Lifecycle Quiz', link: '#' },
        { type: 'assignment', title: 'E-commerce Product Page', link: '#' },
      ],
    },
  ];

  // --- Certificate Modal Component ---
  const CertificateModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={() => setShowCertModal(false)}
    >
      <div
        className="bg-white text-black p-8 rounded-lg max-w-2xl w-full relative text-center border-4 border-blue-600"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="absolute top-4 right-4 cursor-pointer p-2 hover:bg-gray-100 rounded-full"
          onClick={() => setShowCertModal(false)}
        >
          <X size={24} />
        </div>

        <div className="border-2 border-gray-200 p-8 outline outline-2 outline-offset-4 outline-blue-100">
          <div className="flex justify-center mb-4 text-blue-600">
            <Award size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2 uppercase tracking-widest">
            Certificate of Completion
          </h2>
          <p className="text-gray-500 italic mb-6">This certifies that</p>
          <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 inline-block min-w-[200px]">
            Student Name
          </h3>
          <p className="text-gray-600 mb-8">Has successfully completed the module</p>
          <h4 className="text-xl font-bold text-blue-600 mb-8">Module 1: Frontend Fundamentals</h4>
          <div className="flex justify-between text-xs text-gray-400 mt-8">
            <span>Date: Oct 24, 2025</span>
            <span>ID: LMS-MOD-001</span>
          </div>
        </div>
        <button
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={() => setShowCertModal(false)}
        >
          Download PDF
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {showCertModal && <CertificateModal />}

      {/* --- NAVBAR (Reused) --- */}
      {/* <nav className="fixed w-full z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex-shrink-0 font-bold text-2xl tracking-tighter">
              LMS<span className="text-blue-500">PORTAL</span>
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="/#programs" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Programs</a>
                <a href="/how-it-works" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">How it Works</a>
                <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105">Login</a>
              </div>
            </div>
             <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">Home</a>
              <a href="/#programs" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">Programs</a>
              <a href="/how-it-works" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">How it Works</a>
              <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400">Login</a>
            </div>
          </div>
        )}
      </nav> */}

      {/* --- HERO SECTION --- */}
      <div className="relative bg-zinc-900/50 border-b border-zinc-800 pt-32 pb-16">
        <div className="absolute top-0 left-1/2 w-full h-full bg-blue-600/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <a
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} className="mr-1" /> Back to Programs
          </a>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                Best Seller
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                Full Stack Web Development
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed mb-8">
                Become a complete developer capable of building robust, scalable web applications
                from scratch using the MERN (MongoDB, Express, React, Node.js) stack.
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-10">
                <div className="flex items-center bg-black/30 px-4 py-2 rounded-lg border border-zinc-800">
                  <Clock size={18} className="mr-2 text-blue-500" /> 6 Months Duration
                </div>
                <div className="flex items-center bg-black/30 px-4 py-2 rounded-lg border border-zinc-800">
                  <BarChart size={18} className="mr-2 text-blue-500" /> Beginner to Advanced
                </div>
                <div className="flex items-center bg-black/30 px-4 py-2 rounded-lg border border-zinc-800">
                  <Code size={18} className="mr-2 text-blue-500" /> 10+ Real Projects
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Enroll Now for ₹500
                </button>
                <span className="text-gray-500 text-sm">Limited seats available</span>
              </div>
            </div>

            {/* Hero Graphic */}
            <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-zinc-800 to-black rounded-3xl p-1 border border-zinc-700 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
              <div className="h-full w-full bg-zinc-900 rounded-2xl flex items-center justify-center relative z-10">
                <Code size={80} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LEARNING OUTCOMES --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-zinc-800">
        <h2 className="text-2xl font-bold mb-8">What you will learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {[
            'Master HTML5, CSS3, and JavaScript (ES6+)',
            'Build responsive UIs with React and Tailwind',
            'Create backend APIs with Node.js and Express',
            'Manage databases using MongoDB',
            'Version control with Git & GitHub',
            'Deploy applications to the cloud',
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50"
            >
              <CheckCircle size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODULES GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Course Curriculum</h2>
          <p className="text-gray-400">A structured journey from basics to mastery.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {moduleData.map(module => (
            <div
              key={module.id}
              className={`bg-zinc-900 border ${module.status === 'Locked' ? 'border-zinc-800 opacity-60' : 'border-zinc-700'} rounded-2xl overflow-hidden flex flex-col hover:border-zinc-600 transition-all duration-300`}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-zinc-800 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      module.status === 'Completed'
                        ? 'bg-green-900/30 text-green-400 border border-green-900'
                        : module.status === 'In Progress'
                          ? 'bg-blue-900/30 text-blue-400 border border-blue-900'
                          : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                    }`}
                  >
                    {module.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{module.desc}</p>
              </div>

              {/* Card Body (Tasks) */}
              <div className="p-6 flex-grow space-y-3">
                {module.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-sm group cursor-pointer hover:bg-zinc-800 p-2 -mx-2 rounded-lg transition-colors"
                  >
                    {task.type === 'tutorial' && (
                      <PlayCircle size={16} className="text-blue-400 mr-3" />
                    )}
                    {task.type === 'quiz' && (
                      <FileQuestion size={16} className="text-purple-400 mr-3" />
                    )}
                    {task.type === 'assignment' && (
                      <UploadCloud size={16} className="text-orange-400 mr-3" />
                    )}
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Footer (Certificate) */}
              <div className="p-4 bg-black/20 border-t border-zinc-800">
                {module.status === 'Completed' ? (
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 py-3 rounded-xl transition-all text-sm font-bold"
                  >
                    <Award size={18} />
                    View Module Certificate
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800/50 text-zinc-600 border border-zinc-700/50 py-3 rounded-xl text-sm font-bold cursor-not-allowed"
                  >
                    <Lock size={16} />
                    Certificate Locked
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER --- */}
      {/* <footer className="bg-black border-t border-zinc-800 pt-16 pb-8 text-center text-gray-600 text-sm">
        <p>&copy; 2025 LMS Portal. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default ProgramDetails;
