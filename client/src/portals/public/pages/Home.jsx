import React, { useState } from 'react';
import {
  Code,
  Database,
  Smartphone,
  BrainCircuit,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Award,
  Users,
  Rocket,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgramsGrid from '../components/ProgramGrid';

function Home() {
  // Data derived from your notes + Industry standards
  const programs = [
    {
      title: 'Full Stack Web Development',
      description:
        'Master the MERN stack. Build scalable web applications from scratch with real-world projects.',
      icon: <Code className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/fullstack'
    },
    {
      title: 'Data Science & AI',
      description:
        'Analyze complex data and build predictive models using Python, Pandas, and Scikit-learn.',
      icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Filling Fast',
      link: '/datascience'
    },
    {
      title: 'Mobile App Development',
      description:
        'Create cross-platform applications for iOS and Android using React Native and Flutter.',
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Open',
      link: '/mobiledev'
    },
    {
      title: 'Data Analytics',
      description: 'Turn raw data into actionable insights using SQL, Tableau, and PowerBI.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/dataanalytics'
    },
    {
      title: 'FrontEnd Developement',
      description: 'Learn HTML, CSS, JavaScript, and modern frameworks like React to build fast, responsive user interfaces.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹300',
      slots: 'Limited Seats',
      link: '/frontend'
    },
    {
      title: 'BackEnd Developement',
      description: 'Work with Node.js, APIs, authentication, and server-side programming to create scalable web backends.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹300',
      slots: 'Limited Seats',
      link: '/backend'
    },
    {
      title: 'DataBase',
      description: 'Learn SQL for relational databases and MongoDB for NoSQL applications to handle real-world data efficiently.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/database'
    },
    {
      title: 'Python with Django + Flask',
      description: 'Build production-ready web apps using Django’s structured approach and Flask’s lightweight flexibility.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/python'
    },
    {
      title: 'UI/UX Design',
      description: 'Learn design principles, Figma workflows, and how to create intuitive, user-friendly interfaces.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/UX'
    },
    {
      title: 'Version Control with Git & GitHub',
      description: 'Understand branching, pull requests, conflict resolution, and how to collaborate professionally using Git.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/python'
    },
  ];

  const benefits = [
    {
      title: 'Internship-Based Learning',
      desc: "Don't just watch videos. Complete tasks, upload projects, and get verified real-world experience.",
      icon: <Rocket />,
    },
    {
      title: 'Campus Ambassador Program',
      desc: "Join our 'Refer and Earn' initiative. Lead your campus and earn rewards while you learn.",
      icon: <Users />,
    },
    {
      title: 'Verified Certification',
      desc: 'Receive a verifiable certificate upon completion of your capstone project and final assessment.',
      icon: <Award />,
    },
  ];


  return (
    <>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
        {/* --- HERO SECTION --- */}
        <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Background decorative blur */}
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Master Tech Skills <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                The Practical Way
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">
              A self-paced, internship-based learning portal designed to bridge the gap between
              university and industry.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  document.getElementById("programs").scrollIntoView({
                    behavior: "smooth"
                  });
                }}
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)]"
              >
                Explore Programs
              </button>

              <Link
                to="/howitworks"
                className="px-8 py-4 rounded-full border border-gray-600 hover:border-blue-500 hover:text-blue-400 font-bold text-lg transition-all"
              >
                How it Works
              </Link>
            </div>

            {/* Stats / Social Proof */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-gray-800 pt-8">
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">10+</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Tech Streams</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Project Based</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Mentor Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PROGRAM INFO / ABOUT --- */}
        <section className="py-20 bg-zinc-900/50 border-y border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Why this Program?</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Traditional education focuses on theory. We focus on{' '}
              <span className="text-blue-400 font-semibold">Implementation</span>. Our modules are
              designed as a journey: from learning the basics to deploying a Capstone project.
              Complete tasks, pass quizzes, and earn a certification that actually proves your
              skills.
            </p>
          </div>
        </section>

        {/* --- PROGRAM CARDS --- */}
        <section id="programs" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Premium Streams</h2>
            <p className="text-gray-400">Curated paths for the most in-demand tech roles.</p>
          </div>

          <ProgramsGrid programs={programs} />

        </section>

        {/* --- BENEFITS SECTION --- */}
        <section id="benefits" className="py-24 bg-linear-to-b from-black to-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">More Than Just A Course</h2>
                <p className="text-gray-400 mb-8 text-lg">
                  We have gamified the learning experience. Join as a student, graduate as a
                  professional, and earn while you learn through our ambassador programs.
                </p>

                <div className="space-y-8">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{benefit.title}</h3>
                        <p className="text-gray-500">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Representation (Abstract UI Mockup) */}
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full"></div>
                <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6 border-b border-zinc-700 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">Task_Dashboard.jsx</div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-24 bg-black/50 rounded-lg border border-zinc-800 p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center text-green-500">
                        ✓
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Module 1 Completed</div>
                        <div className="text-xs text-gray-500">React Fundamentals</div>
                      </div>
                    </div>
                    <div className="h-24 bg-black/50 rounded-lg border border-blue-500/30 p-4 flex items-center gap-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                      <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 animate-pulse">
                        ●
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">In Progress</div>
                        <div className="text-xs text-gray-500">Capstone Project Upload</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Student Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, star) => (
                    <span key={star} className="text-yellow-500 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 mb-6 italic">
                  "The internship model helped me build a real portfolio. I got my certificate
                  immediately after my Capstone review."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500"></div>
                  <div>
                    <div className="font-bold text-sm">Student Name</div>
                    <div className="text-xs text-gray-500">Web Dev Cohort</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
