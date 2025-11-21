import { Github, Linkedin, MessageSquareQuote, Twitter } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <div className=" bg-black text-white font-sans selection:bg-blue-500 selection:text-white">
        {/* --- FOOTER --- */}
        <footer className="bg-black border-t border-zinc-800 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <Link to="/">
                  <div className="font-bold text-xl tracking-tighter mb-4">
                    LMS<span className="text-blue-500">PORTAL</span>
                  </div>
                </Link>

                <p className="text-gray-500 text-sm">
                  Empowering students with practical skills and industry-ready projects.
                </p>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-lg text-white">Platform</h4>
                <ul className="space-y-2 text-lg text-gray-500">
                  <li>
                    <Link to="/browse" className="hover:text-blue-400">
                      Browse Streams
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-blue-400">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/verification" className="hover:text-blue-400">
                      Verification
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-lg text-white">Community</h4>
                <ul className="space-y-2 text-lg text-gray-500">
                  <li>
                    <Link to="/campus" className="hover:text-blue-400  ">
                      Campus Ambassador
                    </Link>
                  </li>
                  <li>
                    <Link to="/events" className="hover:text-blue-400">
                      Events
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4 text-lg  text-white">Connect</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li className='flex ' >
                    <Link to="#" className="hover:text-blue-400 gap-3 text-lg  flex flex-row ">
                      <Twitter />  Twitter / X
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-blue-400 gap-3 text-lg  flex flex-row ">
                      <Linkedin />  LinkedIn
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-blue-400  gap-3 text-lg  flex flex-row ">
                      <Github />  Github
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="hover:text-blue-400  gap-3 text-lg  flex flex-row ">
                     <MessageSquareQuote />  Discord
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} LMS Portal. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link
                  to="/privacy"
                  className="text-gray-600  hover:text-blue-600 hover:underline transition duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="text-gray-600  hover:text-blue-600 hover:underline transition duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
