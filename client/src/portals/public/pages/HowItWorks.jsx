import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Lock, MonitorPlay, FileText, Award, Briefcase, Menu, X } from 'lucide-react';

// --- Reveal Animation Component ---
const RevealOnScroll = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  );
};

function HowItWorks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const journeySteps = [
    {
      title: 'Enrollment',
      desc: 'Secure your spot by paying just 10% of the total fee. The rest is paid only after program completion.',
      icon: <CheckCircle />,
      color: 'from-green-400 to-emerald-600',
    },
    {
      title: 'Credentials',
      desc: 'Receive your unique ID and secure password to access our state-of-the-art LMS Portal.',
      icon: <Lock />,
      color: 'from-blue-400 to-indigo-600',
    },
    {
      title: 'LMS Access',
      desc: 'Log in to your personalized dashboard. Track progress, view schedules, and access resources.',
      icon: <MonitorPlay />,
      color: 'from-purple-400 to-violet-600',
    },
    {
      title: 'Modules & Tasks',
      desc: 'Watch tutorials, solve quizzes, and complete hands-on assignments for every module.',
      icon: <FileText />,
      color: 'from-pink-400 to-rose-600',
    },
    {
      title: 'Milestone Certificates',
      desc: 'Earn a completion certificate for every module you finish, validating your incremental skills.',
      icon: <Award />,
      color: 'from-yellow-400 to-orange-600',
    },
    {
      title: 'Capstone & Graduation',
      desc: 'Submit your final project. Pay the remaining fee to download your Internship Certificate and LOR.',
      icon: <Briefcase />,
      color: 'from-cyan-400 to-blue-600',
    },
  ];

  return (
    <>
      <section className="pt-32 pb-10 bg-black relative">
        <div className="absolute top-0 left-1/2 w-full h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl text-white md:text-6xl font-extrabold mb-6">
            Your Journey to <span className="text-blue-500">Mastery</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A structured, transparent path from your first day to your dream job.
          </p>
        </div>
      </section>

      {/* --- STAIRCASE JOURNEY --- */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative">
            {/* Central Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-zinc-800 transform -translate-x-1/2"></div>

            <div className="space-y-12 md:space-y-0">
              {journeySteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} relative`}
                >
                  <div className="hidden md:block md:w-1/2"></div>

                  {/* Connector Node */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border-4 border-zinc-800 z-20 hidden md:flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,1)]">
                    <div className={`w-3 h-3 rounded-full bg-linear-to-r ${step.color}`}></div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 p-4 md:px-10">
                    <RevealOnScroll>
                      <div className="relative bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-600 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] group">
                        {/* Mobile Connector Line */}
                        <div className="md:hidden absolute left-6 top-[-48px] bottom-[-48px] w-0.5 bg-zinc-800 -z-10"></div>

                        <div
                          className={`w-12 h-12 rounded-xl bg-linear-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-lg`}
                        >
                          {step.icon}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </RevealOnScroll>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HowItWorks;
