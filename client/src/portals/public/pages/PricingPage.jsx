import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Menu, X } from 'lucide-react';

const Pricing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                <a href="/browse" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Browse Streams</a>
                <a href="/pricing" className="text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
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
                <a href="/pricing" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400">Pricing</a>
                <a href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400">Login</a>
            </div>
            </div>
        )}
      </nav> */}

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Simple, Transparent <span className="text-blue-500">Pricing</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We believe in your potential. Pay a small enrollment fee to start learning, and the rest
            only after you complete the program.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Free Tier (Comparison) */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-400 mb-2">Free Resources</h3>
            <div className="text-4xl font-bold mb-6">₹0</div>
            <p className="text-sm text-gray-500 mb-8">
              Good for getting a taste, but lacks structure.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-400">
                <CheckCircle2 size={18} className="text-zinc-600 mr-2" /> Basic Tutorials
              </li>
              <li className="flex items-center text-gray-400">
                <XCircle size={18} className="text-red-500/50 mr-2" /> No Certificates
              </li>
              <li className="flex items-center text-gray-400">
                <XCircle size={18} className="text-red-500/50 mr-2" /> No Mentor Support
              </li>
              <li className="flex items-center text-gray-400">
                <XCircle size={18} className="text-red-500/50 mr-2" /> No Projects
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition-colors font-medium">
              Browse Blog
            </button>
          </div>

          {/* Main Plan (Highlighted) */}
          <div className="bg-zinc-900 border-2 border-blue-600 p-8 rounded-3xl relative transform md:-translate-y-4 shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Full Program Access</h3>
            <div className="flex items-end gap-2 mb-6">
              <span className="text-5xl font-extrabold">₹50</span>
              <span className="text-gray-400 mb-2 line-through">₹500</span>
            </div>
            <p className="text-sm text-blue-200 mb-8">
              Pay just 10% now to enroll. Pay the rest 90% only after you complete the course
              and get certified.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle2 size={20} className="text-blue-500 mr-3" /> Full LMS Access
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={20} className="text-blue-500 mr-3" /> Verified Certificates
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={20} className="text-blue-500 mr-3" /> Capstone Projects
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={20} className="text-blue-500 mr-3" /> 24/7 Mentor Support
              </li>
              <li className="flex items-center">
                <CheckCircle2 size={20} className="text-blue-500 mr-3" /> Internship Opportunities
              </li>
            </ul>
            <button className="w-full py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-bold shadow-lg shadow-blue-600/40">
              Get Started Now
            </button>
          </div>

          {/* Corporate/Bulk */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-gray-400 mb-2">Campus / Bulk</h3>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <p className="text-sm text-gray-500 mb-8">
              For colleges and student clubs wanting to enroll in bulk.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <CheckCircle2 size={18} className="text-zinc-500 mr-2" /> Bulk Discounts
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle2 size={18} className="text-zinc-500 mr-2" /> Dedicated Dashboard
              </li>
              <li className="flex items-center text-gray-300">
                <CheckCircle2 size={18} className="text-zinc-500 mr-2" /> Progress Reports
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl border border-zinc-700 text-white hover:bg-zinc-800 transition-colors font-medium">
              Contact Sales
            </button>
          </div>
        </div>

        {/* FAQ Lite */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Common Questions</h2>
          <div className="space-y-6">
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h4 className="font-bold mb-2 flex items-center">
                <HelpCircle size={18} className="mr-2 text-blue-500" /> When do I pay the rest?
              </h4>
              <p className="text-gray-400 text-sm">
                You only pay the remaining balance when you have completed all modules and wish to
                download your final Internship Certificate and Letter of Recommendation.
              </p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
              <h4 className="font-bold mb-2 flex items-center">
                <HelpCircle size={18} className="mr-2 text-blue-500" /> Is the enrollment fee
                refundable?
              </h4>
              <p className="text-gray-400 text-sm">
                The ₹500 fee covers your initial server setup, LMS access, and basic administrative
                costs, so it is non-refundable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
