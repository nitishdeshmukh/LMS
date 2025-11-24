import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Menu, X } from 'lucide-react';

const Events = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const events = [
    {
      id: 1,
      title: 'Tech Talk: Future of AI',
      date: 'Nov 15, 2025',
      time: '5:00 PM IST',
      type: 'Webinar',
      status: 'Upcoming',
      image: 'bg-linear-to-br from-purple-900 to-black',
    },
    {
      id: 2,
      title: 'Hackathon 2025',
      date: 'Dec 01, 2025',
      time: '48 Hours',
      type: 'Contest',
      status: 'Registering',
      image: 'bg-linear-to-br from-blue-900 to-black',
    },
    {
      id: 3,
      title: 'Campus Meetup: Delhi',
      date: 'Oct 20, 2025',
      time: '11:00 AM',
      type: 'In-Person',
      status: 'Completed',
      image: 'bg-linear-to-br from-zinc-800 to-black',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* --- NAVBAR (Reused) --- */}
      {/* <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="shrink-0 font-bold text-2xl tracking-tighter">
              LMS<span className="text-blue-500">PORTAL</span>
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <a href="/events" className="text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Events</a>
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
                <a href="/events" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400">Events</a>
            </div>
            </div>
        )}
      </nav> */}

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold mb-4">
            Upcoming <span className="text-blue-500">Events</span>
          </h1>
          <p className="text-gray-400">Join webinars, hackathons, and community meetups.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all group"
            >
              <div className={`h-40 w-full ${event.image} relative`}>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                  {event.status}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">
                  {event.type}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" /> {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" /> {event.time}
                  </div>
                </div>

                <button className="mt-6 w-full py-2 rounded-lg bg-white text-black font-bold hover:bg-blue-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
