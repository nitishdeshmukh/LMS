import React, { useState, useRef, useEffect } from 'react';
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
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgramsGrid from '../components/ProgramGrid';
import Counter from '../components/Counter';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/common/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ceoHomeImg from '@/assets/images/CEO-HOME-IMAGE.jpeg';

function Home() {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [testimonialApi, setTestimonialApi] = React.useState();
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const testimonialPlugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  React.useEffect(() => {
    if (!testimonialApi) return;

    setCurrentTestimonial(testimonialApi.selectedScrollSnap());

    testimonialApi.on('select', () => {
      setCurrentTestimonial(testimonialApi.selectedScrollSnap());
    });
  }, [testimonialApi]);
  const textTestimonials = [
    {
      id: 1,
      quote:
        'The internship model helped me build a real portfolio. I got my certificate immediately after my Capstone review.',
      name: 'Deepak Agrawal',
      cohort: 'Web Dev Cohort',
      linkedin: 'https://www.linkedin.com/in/agrawaldeepak05/',
      initial: 'D',
    },
    {
      id: 2,
      quote:
        'Machine Learning concepts were explained so clearly. The project-based approach really cemented my understanding.',
      name: 'Rupesh Kumar Sahu',
      cohort: 'Data Science Cohort',
      linkedin: 'https://www.linkedin.com/in/rupesh-kumar-sahu-80bb51304/',
      initial: 'R',
    },
    {
      id: 3,
      quote:
        'Building a Flutter app from scratch gave me confidence to apply for jobs. Mentor feedback was crucial.',
      name: 'Mayank Kushvaha',
      cohort: 'Mobile App Dev',
      linkedin: 'https://www.linkedin.com/in/mayankleo/',
      initial: 'M',
    },
    {
      id: 4,
      name: 'Nitish Deshmukh',
      cohort: 'UI/UX Design',
      quote:
        'I finally mastered auto-layout. The design challenges feel exactly like real-world client tasks.',
      color: 'from-pink-400 to-rose-500',
      linkedin: 'https://www.linkedin.com/in/nitish-deshmukh-a9093b25a/',
      initial: 'N',
    },
    {
      id: 5,
      name: 'Tanisha Hanspal',
      cohort: 'Backend Dev',
      quote: 'Node.js architecture and DB optimization changed how I write code!',
      color: 'from-purple-400 to-indigo-500',
      linkedin: 'https://www.linkedin.com/in/agrawaldeepak05/',
      initial: 'T',
    },
    {
      id: 6,
      name: 'Nainshi Roy',
      cohort: 'Full Stack',
      quote: '24/7 mentor support actually helped me debug real issues. Best learning platform!',
      color: 'from-yellow-400 to-orange-500',
      linkedin: 'https://www.linkedin.com/in/nainshi-roy-2b8310256/',
      initial: 'N',
    },
    {
      id: 7,
      name: 'Nawazish Niyazi',
      cohort: 'Python Cohort',
      quote: 'The automation scripts we built saved me hours at my internship.',
      color: 'from-teal-400 to-emerald-500',
      linkedin: 'https://www.linkedin.com/in/nawazish-niyazi/',
      initial: 'N',
    },
    {
      id: 8,
      name: 'Antra Sharma',
      cohort: 'Data Analytics',
      quote: 'Tableau & PowerBI dashboards are now the strongest part of my resume.',
      color: 'from-blue-500 to-cyan-400',
      linkedin: 'https://www.linkedin.com/in/antra-sharma15/',
      initial: 'A',
    },
    {
      id: 9,
      name: 'Piyush Bramhankar',
      cohort: 'Database Mgmt',
      quote: 'Complex SQL joins now feel extremely easy.',
      color: 'from-indigo-400 to-purple-500',
      linkedin: 'https://www.linkedin.com/in/piyush-bramhankar-a041b638b/',
      initial: 'P',
    },
    {
      id: 10,
      name: 'Bishnu Prasad Sahu',
      cohort: 'Frontend Dev',
      quote: 'React Hooks finally make sense! Loved the structured curriculum.',
      color: 'from-red-400 to-pink-500',
      linkedin: 'https://in.linkedin.com/in/mebishnusahu05',
      initial: 'B',
    },
  ];

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
      link: '/github',
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

  // IBM-style testimonials
  const testimonial = [
    {
      id: 1,
      image: ceoHomeImg,
      quote:
        'You need to understand that you will make mistakes. I made so many when I first started ... But the more mistakes you make, and the more you fail initially, the stronger you become later on.',
      name: 'Pravin R Nair',
      role: 'CEO',
      redirectLink: 'https://www.linkedin.com/in/pravin-r-nair-964847318',
    },
  ];

  // Video testimonials data
  const videoTestimonials = [
    {
      id: 1,
      name: 'Rahul Verma',
      role: 'Software Engineer',
      company: 'Google',
      videoUrl: 'https://www.youtube.com/embed/P5rkkl18nb0?si=Civb6yCAJe7p92gC',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Full Stack Developer',
      company: 'Microsoft',
      videoUrl: 'https://www.youtube.com/embed/RGaW82k4dK4?si=4nJWYGIQse44Drnt',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    },
    {
      id: 3,
      name: 'Arjun Singh',
      role: 'DevOps Engineer',
      company: 'Amazon',
      videoUrl: 'https://www.youtube.com/embed/8ashfLSm3tc?si=I_wyatJNJRtXQcw0',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    },
    {
      id: 4,
      name: 'Sneha Patel',
      role: 'Data Scientist',
      company: 'Netflix',
      videoUrl: 'https://www.youtube.com/embed/lt-9uqa7A6c?si=JI9yVaEPyNAyc9in',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    },
    {
      id: 5,
      name: 'Karthik Reddy',
      role: 'Product Manager',
      company: 'Meta',
      videoUrl: 'https://www.youtube.com/embed/2g3l5q2nPkE?si=YiVHZX_sjcmcTf6g',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik',
    },
    {
      id: 6,
      name: 'Ananya Desai',
      role: 'AI/ML Engineer',
      company: 'Adobe',
      videoUrl: 'https://www.youtube.com/embed/k-PFsbZ9yVs?si=CuG0At6X1-TGv_yG',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    },
  ];

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

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

  // Track carousel current slide
  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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
                className="px-8 py-4 rounded-full cursor-pointer bg-blue-600 hover:bg-blue-700 font-bold text-lg transition shadow-[0_0_20px_rgba(37,99,235,0.5)]"
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
                <div className="text-3xl font-bold">
                  <Counter target={500} suffix="+" />
                </div>
                <div className="text-sm text-gray-500 uppercase">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <Counter target={10} suffix="+" />
                </div>
                <div className="text-sm text-gray-500 uppercase">Tech Streams</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <Counter target={100} suffix="%" />
                </div>
                <div className="text-sm text-gray-500 uppercase">Project Based</div>
              </div>
              <div>
                <div className="text-3xl font-bold">
                  <Counter target={24} suffix="/7" />
                </div>
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

        <section className="py-16 bg-black relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold">
                Becoming Stronger Through Challenges
              </h2>
            </div>

            <div className="space-y-4">
              {testimonial.map(testimonial => (
                <div
                  key={testimonial.id}
                  className="bg-gradient-to-r from-zinc-900/50 to-transparent group overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
                    {/* Left: Image - 50% */}
                    <div className="relative h-full min-h-[280px] md:min-h-[400px]">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* Gradient overlay for better text visibility on mobile */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                    </div>

                    {/* Right: Content - 50% */}
                    <div className="flex flex-col justify-center p-6 md:p-8 bg-gradient-to-r from-zinc-900/80 to-zinc-900/40">
                      <div className="relative mb-6">
                        <p className="text-base md:text-lg lg:text-xl text-zinc-100 leading-relaxed font-light">
                          "{testimonial.quote}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {testimonial.name}
                          </h3>
                          <p className="text-xs text-zinc-400">{testimonial.role}</p>
                        </div>
                        <a
                          href={testimonial.redirectLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-all"
                          aria-label={`Visit ${testimonial.name}'s profile`}
                        >
                          <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-2 transition-transform cursor-pointer hover:text-blue-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TEXT TESTIMONIALS CAROUSEL --- */}
        <section className="py-20 bg-zinc-900 border border-zinc-700 relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Student Success Stories</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Hear what our students have to say about their learning experience
              </p>
            </div>

            <Carousel
              setApi={setTestimonialApi}
              plugins={[testimonialPlugin.current]}
              className="w-full mx-auto"
              onMouseEnter={testimonialPlugin.current.stop}
              onMouseLeave={testimonialPlugin.current.reset}
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent className="-ml-4">
                {textTestimonials.map(testimonial => (
                  <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                      <Link to={testimonial.linkedin} target="_blank" className="block h-full">
                        <div className="relative bg-black border-2 border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 shadow-lg h-full flex flex-col group">
                          {/* Gradient border effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>

                          {/* Testimonial Content */}
                          <div className="relative p-6 flex-1 flex flex-col">
                            {/* Star Rating */}
                            <div className="flex gap-1 mb-4">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className="w-5 h-5 fill-yellow-500"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>

                            {/* Testimonial Text */}
                            <blockquote className="text-gray-300 text-sm leading-relaxed italic flex-1">
                              "{testimonial.quote}"
                            </blockquote>
                          </div>

                          {/* User Info */}
                          <div className="relative p-4 bg-black border-t border-zinc-800/50">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-zinc-700 group-hover:border-blue-500 transition-colors shadow-lg">
                                {testimonial.initial}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                                <p className="text-xs text-blue-400">{testimonial.cohort}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Enhanced Previous Button */}
              <CarouselPrevious className="hidden lg:flex -left-12 bg-zinc-900 border-2 border-zinc-700 hover:bg-zinc-800 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white h-12 w-12 backdrop-blur-sm transition-all duration-300 hover:scale-110" />

              {/* Enhanced Next Button */}
              <CarouselNext className="hidden lg:flex -right-12 bg-zinc-900 border-2 border-zinc-700 hover:bg-zinc-800 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white h-12 w-12 backdrop-blur-sm transition-all duration-300 hover:scale-110" />
            </Carousel>

            {/* Enhanced Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {textTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => testimonialApi?.scrollTo(index)}
                  className={`rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'w-8 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                      : 'w-2 h-2 bg-zinc-700 hover:bg-blue-400 hover:shadow-[0_0_8px_rgba(96,165,250,0.4)] hover:scale-125'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* --- VIDEO TESTIMONIALS CAROUSEL  --- */}
        <section className="py-20 bg-black relative overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Their Journey</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Real stories from students who transformed their careers
              </p>
            </div>

            <Carousel
              setApi={setApi}
              plugins={[plugin.current]}
              className="w-full mx-auto"
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent className="-ml-4">
                {videoTestimonials.map(testimonial => (
                  <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="h-full">
                      <div className="relative bg-zinc-900 border-2 border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 shadow-lg h-full flex flex-col group">
                        {/* Gradient border effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>

                        {/* Video Embed */}
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={testimonial.videoUrl}
                            title={`${testimonial.name} testimonial`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>

                        {/* Testimonial Info */}
                        <div className="relative p-4 bg-zinc-900 flex-1 border-t border-zinc-800/50">
                          <div className="flex items-center gap-3">
                            <img
                              src={testimonial.thumbnail}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full border-2 border-zinc-700 group-hover:border-blue-500 transition-colors shadow-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-sm">{testimonial.name}</h4>
                              <p className="text-xs text-blue-400">{testimonial.role}</p>
                              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.6)]"></span>
                                {testimonial.company}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Enhanced Previous Button */}
              <CarouselPrevious className="hidden lg:flex -left-12 bg-zinc-900 border-2 border-zinc-700 hover:bg-zinc-800 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white h-12 w-12 backdrop-blur-sm transition-all duration-300 hover:scale-110" />

              {/* Enhanced Next Button */}
              <CarouselNext className="hidden lg:flex -right-12 bg-zinc-900 border-2 border-zinc-700 hover:bg-zinc-800 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] text-white h-12 w-12 backdrop-blur-sm transition-all duration-300 hover:scale-110" />
            </Carousel>

            {/* Enhanced Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {videoTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`rounded-full transition-all duration-300 ${
                    current === index
                      ? 'w-8 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
                      : 'w-2 h-2 bg-zinc-700 hover:bg-blue-400 hover:shadow-[0_0_8px_rgba(96,165,250,0.4)] hover:scale-125'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
