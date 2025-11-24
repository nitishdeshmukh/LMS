import React, { useState, useEffect } from 'react';
import {
  Users,
  Target,
  Globe,
  Code,
  Server,
  Cpu,
  Menu,
  X,
  ChevronDown,
  Play,
  Quote,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/common/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

const AboutUs = () => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const leadership = [
    {
      name: 'Amit Sharma',
      role: 'Chief Executive Officer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      message:
        "We aren't building another ed-tech giant. We are building a bridge. A bridge between the raw potential of Indian students and the practical demands of the global industry.",
    },
    {
      name: 'Priya Singh',
      role: 'Chief Technology Officer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      message:
        "Technology changes every day, but our curriculum was stuck in the past. We decided to democratize access to 'real' engineering work through open-source intelligence.",
    },
  ];

  const developers = [
    {
      name: 'Rupesh Kumar Sahu',
      role: 'Senior Frontend Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rupesh',
      tech: <Code size={18} className="text-blue-400" />,
      message:
        'Crafting pixels into experiences. I wanted to build a platform that feels as premium as the skills we teach.',
    },
    {
      name: 'Nitish Deshmukh',
      role: 'Backend Developer',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nitish',
      tech: <Server size={18} className="text-green-400" />,
      message:
        "Scalability isn't just for servers, it's for careers. I built the engine that powers thousands of student journeys.",
    },
    {
      name: 'Mayank Kushwaha',
      role: 'Full Stack Intern',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mayank',
      tech: <Cpu size={18} className="text-purple-400" />,
      message:
        "From a student to a builder. This platform gave me my first break, and now I'm helping build it for others.",
    },
  ];

  // Video testimonials data
  const videoTestimonials = [
    {
      id: 1,
      name: 'Rahul Verma',
      role: 'Software Engineer',
      company: 'Google',
      // Placeholder for a working, generic video URL:
      videoUrl: 'https://www.youtube.com/embed/eizmCZv3aKI?si=O59LRJbKmHp7sLVS',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    },
    {
      id: 2,
      name: 'Sneha Patel',
      role: 'Full Stack Developer',
      company: 'Microsoft',
      // Rick Roll - working URL
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    },
    {
      id: 3,
      name: 'Arjun Singh',
      role: 'DevOps Engineer',
      company: 'Amazon',
      // Rick Roll - working URL
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    },
  ];

  const plugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* --- HERO SECTION: The Problem --- */}
      <div className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-blue-900/10 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            Our Mission
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight max-w-4xl">
            Fighting India's <br />
            <span className="text-white">Jobless Growth Crisis</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xl text-gray-400 leading-relaxed mb-6">
                While India produces over{' '}
                <span className="text-white font-bold">1.5 million engineers</span> annually,
                reports suggest that less than <span className="text-white font-bold">20%</span> are
                employable for core software jobs.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Colleges focus on rote learning and outdated theories from the 90s. Meanwhile, the
                industry creates AI, Blockchain, and Cloud systems. This gap creates a paradox:{' '}
                <strong>Millions of jobless graduates, and thousands of unfilled tech jobs.</strong>
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl"></div>
              <h3 className="text-2xl font-bold mb-6">The Reality Check</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-800">
                  <span className="text-zinc-400">Graduates/Year</span>
                  <span className="text-white font-bold">1,500,000+</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-800">
                  <span className="text-zinc-400">Employable Skills</span>
                  <span className="text-red-400 font-bold">~20%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-black rounded-xl border border-zinc-800">
                  <span className="text-zinc-400">Skill Gap</span>
                  <span className="text-blue-400 font-bold">Huge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- THE SOLUTION --- */}
      <section className="py-20 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              We Are Not A Coaching Institute.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              We don't sell courses. We sell{' '}
              <span className="text-white font-bold">Discipline & Direction</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Open Source Intelligence</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We curate the best free content from the internet. Why pay for knowledge that is
                already free? We structure it into a job-ready roadmap.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-400 mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Execution Theory</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You don't learn swimming by reading a book. You learn coding by building projects.
                Our platform forces you to build, not just watch.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">CommunityBridge</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We act as the bridge between your raw skills and the industry requirements. We
                verify your skills so recruiters can trust your resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- IMPACT STATS --- */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">15K+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">
                Students Upskilled
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-blue-500 mb-2">500+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">
                Projects Deployed
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">50+</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">College Partners</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-extrabold text-green-500 mb-2">₹0</div>
              <div className="text-sm text-zinc-500 uppercase tracking-wider">Content Cost</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- LEADERSHIP --- */}
      <section className="py-20 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Leadership Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {leadership.map((leader, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-black p-8 rounded-2xl border border-zinc-800"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-24 h-24 rounded-full border-4 border-zinc-800"
                />
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white">{leader.name}</h3>
                  <p className="text-blue-400 text-sm mb-4">{leader.role}</p>
                  <p className="text-zinc-400 italic">"{leader.message}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- DEVELOPERS (THE BUILDERS) --- */}
      <section className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Built By Students, For Students</h2>
            <p className="text-gray-400">
              Meet the engineering team that turned this vision into code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {developers.map((dev, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-16 h-16 rounded-full border-2 border-zinc-700 group-hover:border-blue-500 transition-colors"
                  />
                  <div>
                    <h4 className="font-bold text-white">{dev.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-blue-400 mt-1">
                      {dev.tech} {dev.role}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-4xl text-zinc-700 font-serif leading-none">
                    "
                  </span>
                  <p className="text-zinc-400 text-sm leading-relaxed pl-4">{dev.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VIDEO TESTIMONIALS CAROUSEL (WITH FUNCTIONAL INDICATORS) --- */}
      <section className="py-20 bg-zinc-900 border-y border-zinc-800 relative overflow-hidden">
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
            className="w-full max-w-3xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: 'center',
              loop: true,
            }}
          >
            <CarouselContent>
              {videoTestimonials.map(testimonial => (
                <CarouselItem key={testimonial.id} className="basis-full">
                  <div className="p-2">
                    <div className="bg-zinc-900/80 backdrop-blur-sm border-2 border-zinc-800/50 rounded-xl overflow-hidden hover:border-blue-500/40 transition-all duration-300">
                      {/* Video Embed - Reduced Height */}
                      <div className="relative w-full" style={{ paddingBottom: '45%' }}>
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
                      <div className="p-6 bg-gradient-to-b from-zinc-900 to-black">
                        <div className="flex items-center gap-4">
                          <img
                            src={testimonial.thumbnail}
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full border-2 border-zinc-700/50"
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-blue-400">{testimonial.role}</p>
                            <p className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
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
            <CarouselPrevious className="hidden md:flex -left-14 bg-zinc-900/90 border-2 border-zinc-700/50 hover:bg-zinc-800 hover:border-blue-500/50 text-white h-10 w-10 backdrop-blur-sm" />
            <CarouselNext className="hidden md:flex -right-14 bg-zinc-900/90 border-2 border-zinc-700/50 hover:bg-zinc-800 hover:border-blue-500/50 text-white h-10 w-10 backdrop-blur-sm" />
          </Carousel>

          {/* Functional Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {videoTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`rounded-full transition-all ${
                  current === index
                    ? 'w-8 h-2 bg-blue-500'
                    : 'w-2 h-2 bg-zinc-700 hover:bg-blue-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

