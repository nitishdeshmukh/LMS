import React, { useState } from 'react';
import { Menu, User, X, Shield, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearStudentData, logout, selectUser } from '@/redux/slices';
import LoginPopup from './LoginPopup';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/common/components/ui/dropdown-menu';
import { closeLoginPopup, openLoginPopup, selectIsLoginPopupOpen } from '@/redux/slices/uiSlice';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigateAndStore = useNavigateWithRedux();
  const user = useSelector(selectUser);
  const isLoginPopupOpen = useSelector(selectIsLoginPopupOpen);
  const dispatch = useDispatch();

  const handleInternalNav = (e, path) => {
    const isLeftClick = e.button === 0;
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;

    if (isLeftClick && !hasModifier) {
      e.preventDefault();
      setIsMenuOpen(false);
      dispatch(closeLoginPopup());
      navigateAndStore(path);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearStudentData());
    navigateAndStore('/');
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              onClick={e => handleInternalNav(e, '/')}
              className="shrink-0 font-bold text-2xl tracking-tighter text-white"
              aria-label="Go to home"
            >
              CODE2DBUG<span className="text-blue-500"></span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link
                  to="/"
                  onClick={e => handleInternalNav(e, '/')}
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  Home
                </Link>

                <Link
                  to="/aboutus"
                  onClick={e => handleInternalNav(e, '/aboutus')}
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  About Us
                </Link>

                <Link
                  to="/howitworks"
                  onClick={e => handleInternalNav(e, '/howitworks')}
                  className="hover:text-blue-400 transition-colors px-3 py-2 text-white rounded-md text-sm font-medium"
                >
                  How it works
                </Link>

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2 focus:outline-none">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all overflow-hidden border-2 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-64 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-md shadow-lg"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user?.name || 'User'}</p>
                          <p className="text-xs text-zinc-400">{user?.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              <Shield className="w-3 h-3" />
                              {user?.role}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator className="bg-zinc-800" />

                      <DropdownMenuItem
                        className="cursor-pointer focus:bg-zinc-800 focus:text-red-400"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(openLoginPopup());
                      setIsMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition-all transform hover:scale-105"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
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
                to="/howitworks"
                onClick={e => handleInternalNav(e, '/howitworks')}
                className="block px-3 py-2 rounded-md text-2xl font-medium hover:bg-gray-800"
              >
                How it works
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none mt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-64 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-md shadow-lg"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name || 'User'}</p>
                        <p className="text-xs text-zinc-400">{user?.email || 'user@example.com'}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            <Shield className="w-3 h-3" />
                            {user?.role || 'User'}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-zinc-800" />

                    <DropdownMenuItem
                      className="cursor-pointer focus:bg-zinc-800 focus:text-red-400"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => {
                    dispatch(openLoginPopup());
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-2xl font-medium text-blue-400"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => dispatch(closeLoginPopup())} />
    </>
  );
}

export default Navbar;

