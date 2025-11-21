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
  ExternalLink
} from 'lucide-react';

const BackEnd = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  // --- UPDATED DATA FOR BACKEND ROADMAP ---
  const courseDetails = {
    title: "Backend Development Self-Paced Internship",
    subtitle: "A highly structured, intensive 30-Day Roadmap. Master Node.js, Express, MongoDB, System Design, and DevOps to build scalable APIs.",
    lastUpdated: "November 2025",
    price: "₹500",
    originalPrice: "₹5000",
    discount: "Pay 10% Now",
  };

  const learningPoints = [
    "Node.js Runtime & Event-Driven Architecture",
    "RESTful API Design & Implementation with Express",
    "Database Management with MongoDB & Mongoose",
    "Authentication & Authorization (JWT, Bcrypt)",
    "MVC Architecture & Clean Code Best Practices",
    "Deployment & DevOps Basics (Docker, Cloud Hosting)",
    "System Design Fundamentals (Caching, Scalability)"
  ];

  // 30-Day Backend Roadmap Data - SIMPLIFIED FORMAT
  const curriculum = [
    {
      id: 1,
      title: "Module 1: The Internet & HTTP Fundamentals",
      timeline: "Days 1-3",
      topics: [
        "How the Web Works: DNS, IP, Client-Server Model",
        "The Request/Response Cycle",
        "HTTP Methods (GET, POST, PUT, DELETE)",
        "HTTP Status Codes (200, 400, 500 series)"
      ],
      practice: "Network Inspector: Use Chrome DevTools Network Tab to analyze requests. Identify a GET request (page load) and a POST request (form submit). Document Headers and Payload."
    },
    {
      id: 2,
      title: "Module 2: Node.js Runtime & Core Modules",
      timeline: "Days 4-7",
      topics: [
        "V8 Engine & Non-blocking I/O",
        "Node.js Event Loop Basics",
        "Core Modules: File System (fs), Path, OS",
        "Creating a basic HTTP Server"
      ],
      practice: "CLI File Manager: Write a Node.js script (no Express) that creates a folder, writes a file inside it with text, and reads the content back to the console."
    },
    {
      id: 3,
      title: "Module 3: Express.js & REST APIs",
      timeline: "Days 8-12",
      topics: [
        "Express Framework Setup & Routing",
        "Middleware: Built-in & Custom",
        "Handling JSON Data & Body Parsing",
        "Accessing URL Parameters & Query Strings"
      ],
      practice: "Basic CRUD API: Build a 'TaskManager' API using Express with endpoints to GET, POST, and DELETE tasks. Store data in a local array variable for now."
    },
    {
      id: 4,
      title: "Module 4: Databases (MongoDB & Mongoose)",
      timeline: "Days 13-17",
      topics: [
        "NoSQL vs SQL Databases",
        "MongoDB Atlas Cloud Setup",
        "Mongoose: Schemas, Models, Validation",
        "Performing Complex Queries"
      ],
      practice: "Database Integration: Connect your 'TaskManager' API to MongoDB Atlas. Replace the local array storage with actual Mongoose queries (find, create, deleteOne)."
    },
    {
      id: 5,
      title: "Module 5: Authentication & Security",
      timeline: "Days 18-21",
      topics: [
        "Password Security: Hashing & Salting (Bcrypt)",
        "JWT (JSON Web Tokens) Strategy",
        "Creating Protected Routes Middleware",
        "Security Risks (OWASP Top 10 Basics)"
      ],
      practice: "Auth System: Implement /register and /login routes. Hash passwords before saving. Create middleware to block access to /tasks unless a valid JWT is provided."
    },
    {
      id: 6,
      title: "Module 6: Architecture & Advanced Concepts",
      timeline: "Days 22-25",
      topics: [
        "MVC Pattern (Model-View-Controller)",
        "Directory Structure Best Practices",
        "Environment Variables (dotenv)",
        "Basic Caching Concepts (Redis intro)"
      ],
      practice: "Refactor to MVC: Reorganize your Task Manager code into /models, /controllers, and /routes folders. Use a .env file to secure your MongoDB URI."
    },
    {
      id: 7,
      title: "Module 7: DevOps & Deployment",
      timeline: "Days 26-28",
      topics: [
        "Docker Basics: Images & Containers",
        "Dockerfile Creation",
        "CI/CD Concepts Overview",
        "Cloud Deployment (Render/Railway)"
      ],
      practice: "Go Live: Deploy your Task Manager API to a free hosting service like Render or Railway. Test the live public URL using Postman."
    },
    {
      id: 8,
      title: "Module 8: The Capstone Project",
      timeline: "Days 29-30",
      topics: [
        "System Design Planning",
        "Production-Ready Error Handling",
        "API Documentation (Swagger/Postman)",
        "Final Build & Optimization"
      ],
      practice: "Final Deliverable: Build a complete Backend System (URL Shortener, Blog API, E-commerce Backend, etc.) with Auth and DB. Submit the Live URL and GitHub Repo."
    }
  ];

  const benefitsAfterPayment = [
    "Fully Verifiable Internship Certificate (Verifiable on website)",
    "Skill Certificate to prove your technical expertise",
    "Official Letter of Recommendation (LOR)",
    "Premium Benefits worth ₹20,000 (Resume, LinkedIn, Mock Interviews)"
  ];

  const toggleModule = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">


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
                <span>Backend Development</span>
                <span>•</span>
                <span>Node.js & Express</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">{courseDetails.title}</h1>
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
                  You only pay <strong>10% of ({courseDetails.price})</strong> now to enroll and start the internship. The course content itself is a curated roadmap of high-quality, freely available resources. We do not charge for the content.
                  <br /><br />
                  The fee covers our <strong>LMS infrastructure, progress tracking, and the verification systems</strong>. You will pay the remaining amount only after completing the internship to unlock your certificates and premium career benefits.
                </p>
              </div>

              {/* What you'll learn */}
              <div className="relative overflow-hidden p-8 rounded-3xl border border-zinc-800 bg-zinc-900/30">
                {/* Decorational background blobs */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 flex items-center gap-3">
                  <Zap className="text-yellow-400 fill-yellow-400" size={28} />
                  Master Backend Engineering
                </h2>

                <div className="grid grid-cols-1  gap-6 relative z-10">
                  {learningPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-black/40 border border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group cursor-default">
                      <div className="mt-1 p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors shrink-0">
                        <CheckCircle size={18} className="text-blue-400 group-hover:text-blue-300" />
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
                  <span>30-Day Plan • 8 Modules</span>
                </div>

                <div className="border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900/20">
                  {curriculum.map((module) => (
                    <div key={module.id} className="border-b border-zinc-700 last:border-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-5 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${expandedModule === module.id ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                            {expandedModule === module.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                          <div>
                            <span className="font-bold block text-lg">{module.title}</span>
                            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{module.timeline}</span>
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
                                <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
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
                    <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-black/40 border border-zinc-800">
                      <div className="mt-1 bg-green-500/20 p-1 rounded-full text-green-500">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-zinc-300 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-xs text-zinc-500 text-center">
                  Use your coupon code (which you will get from any existing paid user) to redeem the ₹20,000 worth of premium benefits on LMS.
                </p>
              </div>

            </div>

            {/* --- RIGHT COLUMN (Sticky Pricing Card) --- */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10">


                <div className="p-6">
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-4xl font-bold text-white">₹50</span>
                    <span className="text-zinc-500 line-through text-lg mb-1">{courseDetails.originalPrice}</span>
                  </div>
                  <p className="text-green-400 font-bold  mb-6">Pay just 10% to Start Learning</p>

                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl mb-4 transition-colors shadow-lg shadow-blue-600/25">
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
                          placeholder="Enter code"
                          className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors border border-zinc-700">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-zinc-500 text-xs mb-6">Secure Payment • Instant Access</p>

                  <div className="space-y-4 border-t border-zinc-800 pt-6">
                    <h4 className="font-bold text-sm text-white">This Internship includes:</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                      <li className="flex items-center gap-3"><Infinity size={16} /> 30-Day Structured Roadmap</li>
                      <li className="flex items-center gap-3"><Video size={16} /> Curated Free Resources</li>
                      <li className="flex items-center gap-3"><Briefcase size={16} /> Capstone Project</li>
                      <li className="flex items-center gap-3"><Award size={16} /> Internship Certificate (Post-Completion)</li>
                      <li className="flex items-center gap-3"><FileText size={16} /> Letter of Recommendation</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                    <button className="hover:text-blue-400 transition-colors flex items-center gap-2"><Share2 size={16} /> Share</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-black border-t border-zinc-800 pt-16 pb-8 text-center text-gray-600 text-sm">
        <p>&copy; 2025 LMS Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BackEnd;