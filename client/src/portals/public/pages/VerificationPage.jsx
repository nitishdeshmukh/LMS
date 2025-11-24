import React, { useState } from 'react';
import { ShieldCheck, Search, Menu, X } from 'lucide-react';

const Verification = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [certId, setCertId] = useState('');
  const [status, setStatus] = useState(null); // 'success', 'error', or null

  const handleVerify = e => {
    e.preventDefault();
    // Mock logic
    if (certId === '12345') {
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

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
                <a href="/verification" className="text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Verification</a>
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
                 <a href="/verification" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400">Verification</a>
            </div>
            </div>
        )}
      </nav> */}

      <div className="pt-40 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center min-h-[80vh]">
        <div className="mb-8 bg-zinc-900 p-4 rounded-full border border-zinc-800">
          <ShieldCheck size={48} className="text-blue-500" />
        </div>

        <h1 className="text-4xl font-extrabold mb-4 text-center">Certificate Verification</h1>
        <p className="text-gray-400 max-w-md text-center mb-12">
          Enter the unique certificate ID provided on the document to verify its authenticity.
        </p>

        <form onSubmit={handleVerify} className="w-full max-w-md relative">
          <input
            type="text"
            placeholder="Enter Certificate ID (e.g., LMS-2025-X89)"
            className="w-full bg-black border border-zinc-700 text-white p-4 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-center tracking-widest text-lg"
            value={certId}
            onChange={e => setCertId(e.target.value)}
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-900/20"
          >
            Verify Now
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-8 p-6 bg-green-900/20 border border-green-900 rounded-xl w-full max-w-md text-center">
            <p className="text-green-400 font-bold text-lg mb-1">Valid Certificate</p>
            <p className="text-green-200/70 text-sm">Issued to: John Doe</p>
            <p className="text-green-200/70 text-sm">Course: Full Stack Web Development</p>
            <p className="text-green-200/70 text-sm">Date: Oct 24, 2025</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-8 p-6 bg-red-900/20 border border-red-900 rounded-xl w-full max-w-md text-center">
            <p className="text-red-400 font-bold text-lg">Invalid ID</p>
            <p className="text-red-200/70 text-sm">
              We couldn't find a certificate with that ID. Please check and try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
