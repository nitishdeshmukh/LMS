import React, { useState } from 'react';
import {
  PlayCircle,
  Award,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Infinity,
  Menu,
  X,
  ShieldCheck,
  Share2,
  Briefcase,
  CreditCard,
  Tag,
  Zap,
  BookOpen,
  Code,
  ExternalLink,
} from 'lucide-react';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import { toast } from 'sonner';
import { Toaster } from '@/common/components/ui/sonner';

const Fullstack = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const navigateAndStore = useNavigateWithRedux();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code', {
        duration: 3000,
      });
      return;
    }

    toast.success('You have applied the coupon code!', {
      description: `Coupon "${couponCode}" has been applied successfully.`,
      icon: (
        <svg
          className="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      duration: 5000,
    });
  };

  // --- UPDATED DATA FOR FULL STACK ROADMAP ---
  const courseDetails = {
    title: 'Full Stack Web Development Self-Paced Internship',
    subtitle:
      'A highly structured, intensive 30-Day MERN Stack Roadmap. Build real-world projects, master the stack, and get career-ready.',
    lastUpdated: 'November 2025',
    price: '₹500',
    originalPrice: '₹5000',
    discount: 'Pay 10% Now',
  };

  const learningPoints = [
    'Semantic HTML5 & Modern CSS3 (Flexbox, Grid)',
    'Responsive UI Design with Tailwind CSS',
    'JavaScript ES6+, DOM Manipulation & Async Programming',
    'React.js: Components, Hooks, and State Management',
    'Backend API Development with Node.js & Express',
    'Database Management with MongoDB & Mongoose',
    'Authentication using JWT & Security Best Practices',
  ];

  // 30-Day Full Stack Roadmap Data - SIMPLIFIED FORMAT
  const curriculum = [
    {
      id: 1,
      title: 'Module 1: Prerequisites & HTML Structure',
      timeline: 'Days 1-2',
      topics: [
        'VS Code Setup & Extensions',
        'Git Basics: Init, Add, Commit, Push',
        'HTML5 Tags & Semantic Elements',
        'Forms & Input Handling',
      ],
      practice:
        "Create a Registration Form: Build a static HTML page with a signup form containing Name, Email, Password, and a 'Role' dropdown. Use semantic tags (<header>, <footer>, <main>). Push this code to a GitHub repository.",
    },
    {
      id: 2,
      title: 'Module 2: CSS & Responsive Design',
      timeline: 'Days 3-5',
      topics: [
        'CSS Box Model (Margin, Border, Padding)',
        'Flexbox Layout (Align, Justify)',
        'CSS Grid System',
        'Media Queries for Responsive Design',
      ],
      practice:
        "Responsive Navbar: Create a navigation bar that displays links horizontally on a desktop but collapses into a 'Hamburger Menu' icon on mobile screens using CSS Media Queries.",
    },
    {
      id: 3,
      title: 'Module 3: Modern Styling (Tailwind CSS)',
      timeline: 'Day 6',
      topics: [
        'Tailwind Utility Classes',
        'Flex & Grid Layouts in Tailwind',
        'Responsive Breakpoints (sm, md, lg)',
        'Component Styling',
      ],
      practice:
        "Pricing Card Component: Re-create a modern 'Subscription Pricing Card' (e.g., Basic, Pro, Enterprise) using only Tailwind utility classes.",
    },
    {
      id: 4,
      title: 'Module 4: JavaScript Core & DOM',
      timeline: 'Days 7-9',
      topics: [
        'JS Variables, Functions, Arrays, Objects',
        'DOM Manipulation (Selecting & Modifying elements)',
        'Event Listeners & Handling',
        'Basic Logic Building',
      ],
      practice:
        'Interactive Calculator: Build a calculator where users can click buttons to perform addition, subtraction, multiplication, and division. The result must display on the screen using DOM manipulation.',
    },
    {
      id: 5,
      title: 'Module 5: Advanced JS & Async',
      timeline: 'Days 10-12',
      topics: [
        'ES6 Features: Arrow functions, Destructuring',
        'Asynchronous JS: Promises',
        'Async/Await Syntax',
        'Fetch API for external data',
      ],
      practice:
        'Weather App (Fetch API): Build an app where a user types a city name, and you use fetch() to call a public Weather API (like OpenWeatherMap) to display the current temperature.',
    },
    {
      id: 6,
      title: 'Module 6: React.js Fundamentals',
      timeline: 'Days 13-16',
      topics: [
        'React Components & JSX',
        'Props for Data Passing',
        'useState Hook for State Management',
        'useEffect & Conditional Rendering',
      ],
      practice:
        'Todo App: Create a React app where users can add tasks to a list, check them off (line-through style), and delete them.',
    },
    {
      id: 7,
      title: 'Module 7: Advanced React (Router & Hooks)',
      timeline: 'Days 17-19',
      topics: [
        'React Router (v6) Navigation',
        'Dynamic Routes',
        'Custom Hooks',
        'Context API for Global State',
      ],
      practice:
        'Movie Search App (Multi-page): Create an app with two pages: Home (search movies) and Details (click a movie to see description). Use React Router to navigate.',
    },
    {
      id: 8,
      title: 'Module 8: Node.js & Express (Backend)',
      timeline: 'Days 20-22',
      topics: [
        'Node.js Runtime Environment',
        'Express Server Setup',
        'REST API Design Principles',
        'Middleware Implementation',
      ],
      practice:
        'Backend Setup: Create an Express server with endpoints to GET a list of products and POST a new product. Test it using Postman or Thunder Client.',
    },
    {
      id: 9,
      title: 'Module 9: MongoDB & Integration',
      timeline: 'Days 23-26',
      topics: [
        'NoSQL Database Concepts',
        'Mongoose Schemas & Models',
        'CRUD Operations (Create, Read, Update, Delete)',
        'Connecting React Frontend to Node Backend',
      ],
      practice:
        "Full Stack Integration: Connect your React 'Todo App' (from Module 6) to a MongoDB database. Ensure that when you refresh the page, the Todos remain (data persistence).",
    },
    {
      id: 10,
      title: 'Module 10: The Capstone Project',
      timeline: 'Days 27-30',
      topics: [
        'Full Stack Build Process',
        'Debugging & Optimization',
        'Deployment (Vercel/Render)',
        'Project Documentation (README)',
      ],
      practice:
        'Final Deliverable: Choose one project (Student Management, Blog, E-commerce, Job Board, etc.). Build Frontend + Backend + DB. Deploy it and submit the Live Link + GitHub Repo.',
    },
  ];

  const benefitsAfterPayment = [
    'Fully Verifiable Internship Certificate (Verifiable on website)',
    'Skill Certificate to prove your technical expertise',
    'Official Letter of Recommendation (LOR)',
    'Premium Benefits worth ₹20,000 (Resume, LinkedIn, Mock Interviews)',
  ];

  const toggleModule = id => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* --- NAVBAR --- */}
      <Toaster position="top-center" duration={5000} />

      {/* --- MAIN CONTAINER --- */}
      <div className="pt-20 pb-20">
        {/* Hero Banner (Dark Theme) */}
        <div className="bg-zinc-900 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col lg:flex-row gap-12">
            {/* Left Content */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 text-blue-400 text-sm font-bold mb-4">
                <span>Internship</span>
                <span>•</span>
                <span>Web Development</span>
                <span>•</span>
                <span>MERN Stack</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
                {courseDetails.title}
              </h1>
              <p className="text-lg text-zinc-300 mb-6 leading-relaxed">{courseDetails.subtitle}</p>

              <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} /> Last updated {courseDetails.lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} /> Job Ready Curriculum
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* --- LEFT COLUMN (Course Info) --- */}
            <div className="lg:col-span-2 space-y-12">
              {/* Payment Structure Info Box */}
              <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-2xl">
                <h2 className="text-xl font-bold mb-3 text-blue-100 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-400" /> How the Payment Works
                </h2>
                <p className="text-zinc-300 leading-relaxed">
                  You only pay <strong>10% of ({courseDetails.price})</strong> now to enroll and
                  start the internship. The course content itself is a curated roadmap of
                  high-quality, freely available resources. We do not charge for the content.
                  <br />
                  <br />
                  The fee covers our{' '}
                  <strong>
                    LMS infrastructure, progress tracking, and the verification systems
                  </strong>
                  . You will pay the remaining amount only after completing the internship to unlock
                  your certificates and premium career benefits.
                </p>
              </div>

              {/* What you'll learn */}
              <div className="relative overflow-hidden p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30">
                {/* Decorational background blobs */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 flex items-center gap-3">
                  <Zap className="text-yellow-400 fill-yellow-400" size={28} />
                  Master MERN Stack
                </h2>

                <div className="grid grid-cols-1  gap-6 relative z-10">
                  {learningPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group cursor-default"
                    >
                      <div className="mt-1 p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors shrink-0">
                        <CheckCircle
                          size={18}
                          className="text-blue-400 group-hover:text-blue-300"
                        />
                      </div>
                      <span className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed pt-1 group-hover:text-white transition-colors">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Internship Roadmap</h2>
                <div className="flex justify-between text-sm text-zinc-400 mb-4">
                  <span>30-Day Plan • 10 Modules</span>
                </div>

                <div className="border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900/20">
                  {curriculum.map(module => (
                    <div key={module.id} className="border-b border-zinc-700 last:border-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-5 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${expandedModule === module.id ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}
                          >
                            {expandedModule === module.id ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </div>
                          <div>
                            <span className="font-bold block text-lg">{module.title}</span>
                            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                              {module.timeline}
                            </span>
                          </div>
                        </div>
                      </button>

                      {expandedModule === module.id && (
                        <div className="bg-black/50 border-t border-zinc-800 divide-y divide-zinc-800/50">
                          {/* TOPICS SECTION */}
                          <div className="p-5">
                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <BookOpen size={14} /> Course Topics
                            </h4>
                            <ul className="space-y-2 pl-2">
                              {module.topics.map((topic, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2.5 text-sm text-zinc-300"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0"></div>
                                  <span>{topic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* PRACTICE SECTION */}
                          <div className="p-5 bg-blue-900/5">
                            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                              <Code size={14} /> Hands-on Practice
                            </h4>
                            <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-green-500/30 pl-3">
                              {module.practice}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Benefits Section */}
              <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award size={24} className="text-yellow-500" /> Unlocked After Full Payment
                </h2>
                <div className="space-y-4">
                  {benefitsAfterPayment.map((benefit, i) => (
                    <div
                      key={i}
                      className="flex gap-4 items-start p-4 rounded-xl bg-black/40 border border-zinc-800"
                    >
                      <div className="mt-1 bg-green-500/20 p-1 rounded-full text-green-500">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-zinc-300 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-zinc-500 text-center">
                  Use your coupon code (which you will get from any existing paid user) to redeem
                  the ₹20,000 worth of premium benefits.
                </p>
              </div>
            </div>

            {/* --- RIGHT COLUMN (Sticky Pricing Card) --- */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">
                <div className="p-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold text-white">₹50</span>
                    <span className="text-zinc-500 line-through text-lg mb-1">
                      {courseDetails.originalPrice}
                    </span>
                  </div>
                  <p className="text-green-400 font-bold  mb-6">
                    Pay just 10% of the course to Start Learning
                  </p>

                  <button
                    onClick={() => navigateAndStore('/enroll')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Enroll Now
                  </button>

                  {/* Coupon Code Section */}
                  <div className="mb-6">
                    {!showCouponInput ? (
                      <button
                        onClick={() => setShowCouponInput(true)}
                        className="text-blue-400 text-sm hover:underline flex items-center gap-2 mx-auto"
                      >
                        <Tag size={16} /> Have a coupon code?
                      </button>
                    ) : (
                      <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input
                          type="text"
                          value={couponCode} // Add this
                          onChange={e => setCouponCode(e.target.value)} // Add this
                          placeholder="Enter code"
                          className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors border border-zinc-700"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-zinc-500 text-xs mb-6">
                    Secure Payment • Instant Access
                  </p>

                  <div className="space-y-4 border-t border-zinc-800 pt-6">
                    <h4 className="font-bold text-sm text-white">This Internship includes:</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                      <li className="flex items-center gap-3">
                        <Infinity size={16} /> 30-Day Structured Roadmap
                      </li>
                      <li className="flex items-center gap-3">
                        <Video size={16} /> Curated Free Resources
                      </li>
                      <li className="flex items-center gap-3">
                        <Briefcase size={16} /> Capstone Project
                      </li>
                      <li className="flex items-center gap-3">
                        <Award size={16} /> Internship Certificate (Post-Completion)
                      </li>
                      <li className="flex items-center gap-3">
                        <FileText size={16} /> Letter of Recommendation
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <button className="hover:text-blue-400 transition-colors flex items-center gap-2">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fullstack;
