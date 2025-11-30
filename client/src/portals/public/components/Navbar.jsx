import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import LoginPopup from './LoginPopup';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigateAndStore = useNavigateWithRedux();

  // Handles internal navigation while preserving middle-click / open-in-new-tab behavior
  const handleInternalNav = (e, path) => {
    // If left click without modifiers => intercept and use navigateAndStore
    const isLeftClick = e.button === 0;
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

    if (isLeftClick && !hasModifier) {
      e.preventDefault();
      // close menus/popups before navigation so UI matches the route
      setIsMenuOpen(false);
      setIsLoginOpen(false);
      navigateAndStore(path);
    }
    // else let browser handle (open in new tab, etc.)
  };

  return (
    <>
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  h-20">
            {/* Logo: use anchor so middle-click works, but intercept left-click */}
            <a
              href="/"
              onClick={e => handleInternalNav(e, '/')}
              className="shrink-0 font-bold text-2xl tracking-tighter"
              aria-label="Go to home"
            >
              CODE2DBUG<span className="text-blue-500"></span>
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="/"
                  onClick={e => handleInternalNav(e, '/')}
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  Home
                </a>

                <a
                  href="/aboutus"
                  onClick={e => handleInternalNav(e, '/aboutus')}
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  About Us
                </a>

                <a
                  href="/howitworks"
                  onClick={e => handleInternalNav(e, '/howitworks')}
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  How it works
                </a>

                <button
                  onClick={() => {
                    // Open login popup (no navigation)
                    setIsLoginOpen(true);
                    // also close mobile menu if open
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105"
                >
                  Login
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className=" flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMenuOpen && (
          <div className="md:hidden h-fit items-center bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 flex flex-col items-center pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                onClick={e => handleInternalNav(e, '/')}
                className="block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-800"
              >
                Home
              </Link>

              <Link
                to="/aboutus"
                onClick={e => handleInternalNav(e, '/aboutus')}
                className="block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-800"
              >
                About Us
              </Link>

              <Link
                href="/howitworks"
                onClick={e => handleInternalNav(e, '/howitworks')}
                className="block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-800"
              >
                How it works
              </Link>

              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block px-3 py-2 rounded-md text-2xl font-medium text-blue-400"
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

