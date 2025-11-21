import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import LoginPopup from './LoginPopup';
import { Link } from 'react-router-dom';
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/">
              <div className="shrink-0 font-bold text-2xl tracking-tighter">
                LMS<span className="text-blue-500">PORTAL</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/aboutus"
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  About Us
                </Link>
                <Link
                  to="/howitworks"
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  How it works
                </Link>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              >
                Home
              </a>
              <a
                href="/program"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              >
                Programs
              </a>
              <a
                href="/howitworks"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
              >
                How it works
              </a>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-400"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </nav>

      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={(email, password) => {
          console.log('Login attempt:', { email, password });
          setIsLoginOpen(false);
        }}
      />
    </>
  );
}

export default Navbar;
