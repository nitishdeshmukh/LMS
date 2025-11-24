import React, { useState, useRef } from 'react';
import {
  Code,
  Database,
  Smartphone,
  BrainCircuit,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Award,
  Users,
  Rocket,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgramsGrid from '../components/ProgramGrid';
import Counter from '../components/Counter';

function Home() {
  const programs = [
    {
      title: 'Full Stack Web Development',
      description:
        'Master the MERN stack. Build scalable web applications from scratch with real-world projects.',
      icon: <Code className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/fullstack',
    },
    {
      title: 'Data Science & AI',
      description:
        'Analyze complex data and build predictive models using Python, Pandas, and Scikit-learn.',
      icon: <BrainCircuit className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Filling Fast',
      link: '/datascience',
    },
    {
      title: 'Mobile App Development',
      description:
        'Create cross-platform applications for iOS and Android using React Native and Flutter.',
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Open',
      link: '/mobiledev',
    },
    {
      title: 'Data Analytics',
      description: 'Turn raw data into actionable insights using SQL, Tableau, and PowerBI.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/dataanalytics',
    },
    {
      title: 'FrontEnd Development',
      description:
        'Learn HTML, CSS, JavaScript, and modern frameworks like React to build fast, responsive user interfaces.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹300',
      slots: 'Limited Seats',
      link: '/frontend',
    },
    {
      title: 'BackEnd Development',
      description:
        'Work with Node.js, APIs, authentication, and server-side programming to create scalable backends.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹300',
      slots: 'Limited Seats',
      link: '/backend',
    },
    {
      title: 'Database',
      description:
        'Learn SQL for relational databases and MongoDB for NoSQL applications to handle real-world data efficiently.',
      icon: <Database className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/database',
    },
    {
      title: 'Python with Django + Flask',
      description:
        'Build production-ready web apps using Django’s structured approach and Flask’s lightweight flexibility.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/python',
    },
    {
      title: 'UI/UX Design',
      description:
        'Learn design principles, Figma workflows, and how to create intuitive user-friendly interfaces.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/UX',
    },
    {
      title: 'Version Control with Git & GitHub',
      description:
        'Understand branching, pull requests, conflict resolution, and how to collaborate using Git.',
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      price: '₹500',
      slots: 'Limited Seats',
      link: '/git',
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
      desc: 'Receive a verifiable certificate after your capstone project and final assessment.',
      icon: <Award />,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Deepak Agrawal',
      role: 'Web Dev Cohort',
      text: 'The internship model helped me build a real portfolio. I got my certificate immediately after my Capstone review.',
      color: 'from-blue-400 to-purple-500',
      linkedin: 'https://www.linkedin.com/in/agrawaldeepak05/',
    },
    {
      id: 2,
      name: 'Rupesh Kumar Sahu',
      role: 'Data Science Cohort',
      text: 'Machine Learning concepts were explained so clearly. The project-based approach really cemented my understanding.',
      color: 'from-green-400 to-cyan-500',
      linkedin: 'https://www.linkedin.com/in/rupesh-kumar-sahu-80bb51304/',
    },
    {
      id: 3,
      name: 'Mayank Kushvaha',
      role: 'Mobile App Dev',
      text: 'Building a Flutter app from scratch gave me confidence to apply for jobs. Mentor feedback was crucial.',
      color: 'from-orange-400 to-red-500',
      linkedin: 'https://www.linkedin.com/in/mayankleo/',
    },
    {
      id: 4,
      name: 'Nitish Deshmukh',
      role: 'UI/UX Design',
      text: 'I finally mastered auto-layout. The design challenges feel exactly like real-world client tasks.',
      color: 'from-pink-400 to-rose-500',
      linkedin: 'https://www.linkedin.com/in/nitish-deshmukh-a9093b25a/',
    },
    {
      id: 5,
      name: 'Tanisha Hanspal',
      role: 'Backend Dev',
      text: 'Node.js architecture and DB optimization changed how I write code!',
      color: 'from-purple-400 to-indigo-500',
      linkedin: 'https://www.linkedin.com/in/agrawaldeepak05/',
    },
    {
      id: 6,
      name: 'Nainshi Roy',
      role: 'Full Stack',
      text: '24/7 mentor support actually helped me debug real issues. Best learning platform!',
      color: 'from-yellow-400 to-orange-500',
      linkedin: 'https://www.linkedin.com/in/nainshi-roy-2b8310256/',
    },
    {
      id: 7,
      name: 'Nawazish Niyazi',
      role: 'Python Cohort',
      text: 'The automation scripts we built saved me hours at my internship.',
      color: 'from-teal-400 to-emerald-500',
      linkedin: 'https://www.linkedin.com/in/nawazish-niyazi/',
    },
    {
      id: 8,
      name: 'Antra Sharma',
      role: 'Data Analytics',
      text: 'Tableau & PowerBI dashboards are now the strongest part of my resume.',
      color: 'from-blue-500 to-cyan-400',
      linkedin: 'https://www.linkedin.com/in/antra-sharma15/',
    },
    {
      id: 9,
      name: 'Piyush Bramhankar',
      role: 'Database Mgmt',
      text: 'Complex SQL joins now feel extremely easy.',
      color: 'from-indigo-400 to-purple-500',
      linkedin: 'https://www.linkedin.com/in/piyush-bramhankar-a041b638b/',
    },
    {
      id: 10,
      name: 'Bishnu Prasad Sahu',
      role: 'Frontend Dev',
      text: 'React Hooks finally make sense! Loved the structured curriculum.',
      color: 'from-red-400 to-pink-500',
      linkedin: 'https://in.linkedin.com/in/mebishnusahu05',
    },
  ];

  const scrollRef = useRef(null);

  const scroll = direction => {
    if (scrollRef.current) {
      const distance =
        direction === 'left' ? -scrollRef.current.offsetWidth : scrollRef.current.offsetWidth;

      scrollRef.current.scrollBy({
        left: distance,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white font-sans">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
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
                  document.getElementById('programs').scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-lg transition shadow-[0_0_20px_rgba(37,99,235,0.5)]"
              >
                Explore Programs
              </button>

              <Link
                to="/howitworks"
                className="px-8 py-4 rounded-full border border-gray-600 hover:border-blue-500 hover:text-blue-400 font-bold text-lg transition"
              >
                How it Works
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-800 pt-8">
              <div>
                <div className="text-3xl font-bold"><Counter target={500} suffix="+" /></div>
                <div className="text-sm text-gray-500 uppercase">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold"><Counter target={10} suffix="+" /></div>
                <div className="text-sm text-gray-500 uppercase">Tech Streams</div>
              </div>
              <div>
                <div className="text-3xl font-bold"><Counter target={100} suffix="%" /></div>
                <div className="text-sm text-gray-500 uppercase">Project Based</div>
              </div>
              <div>
                <div className="text-3xl font-bold"><Counter target={24} suffix="/7" /></div>
                <div className="text-sm text-gray-500 uppercase">Mentor Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-20 bg-zinc-900/50 border-y border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Why this Program?</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Traditional education focuses on theory. We focus on{' '}
              <span className="text-blue-400 font-semibold">Implementation</span>. Our modules take
              you from fundamentals to deploying a Capstone project.
            </p>
          </div>
        </section>

        {/* PROGRAM CARDS */}
        <section id="programs" className="py-24 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Premium Streams</h2>
            <p className="text-gray-400">Curated paths for the most in-demand tech roles.</p>
          </div>

          <ProgramsGrid programs={programs} />
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-24 bg-linear-to-b from-black to-zinc-900">
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">More Than Just A Course</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Learning is gamified with tasks, checkpoints, rewards, and real-world projects.
              </p>

              <div className="space-y-8">
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                      {b.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{b.title}</h3>
                      <p className="text-gray-500">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UI Mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/20 blur-xl rounded-full"></div>

              <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-700 pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">Student Dashboard</div>
                </div>

                <div className="space-y-4">
                  <div className="h-24 bg-black/50 rounded-lg border border-zinc-800 p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-900/30 border border-green-500/30 flex items-center justify-center text-green-500">
                      ✓
                    </div>
                    <div>
                      <div className="text-sm font-bold">Module 1 Completed</div>
                      <div className="text-xs text-gray-500">React Fundamentals</div>
                    </div>
                  </div>

                  <div className="h-24 bg-black/50 rounded-lg border border-blue-500/30 p-4 flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400 animate-pulse">
                      ●
                    </div>
                    <div>
                      <div className="text-sm font-bold">In Progress</div>
                      <div className="text-xs text-gray-500">Capstone Project Upload</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIAL CAROUSEL */}
        <section className="py-24 max-w-7xl mx-auto px-4 relative">
          <h2 className="text-3xl font-bold text-center mb-12">Student Stories</h2>

          <div className="relative group">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 rounded-full bg-zinc-800 border border-zinc-700 text-white hover:bg-blue-600 hover:border-blue-500 transition opacity-0 group-hover:opacity-100 hidden md:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 rounded-full bg-zinc-800 border border-zinc-700 text-white hover:bg-blue-600 hover:border-blue-500 transition opacity-0 group-hover:opacity-100 hidden md:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map(item => (
                <div
                  key={item.id}
                  className="min-w-[85vw] md:min-w-[calc(33%-1rem)] snap-center bg-zinc-900 p-8 rounded-2xl border border-zinc-800 flex flex-col justify-between hover:border-blue-500/50 transition"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, star) => (
                        <span key={star} className="text-yellow-500 text-sm">
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-400 italic mb-6">"{item.text}"</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full bg-linear-to-br ${item.color} flex items-center justify-center text-white font-bold hover:scale-110 transition`}
                    >
                      {item.name.charAt(0)}
                    </a>

                    <div>
                      <div className="font-bold text-sm">{item.name}</div>
                      <div className="text-xs text-blue-400">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
