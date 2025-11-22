import React from 'react';
import { Search, Bell, Settings, User, Menu } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="h-20 bg-black/50 backdrop-blur-md border-b border-zinc-800 px-8 flex items-center justify-between">
      {/* active Tab */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => ""}
          className="md:hidden text-zinc-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold hidden sm:block">{"active Tab Name"}</h1>
      </div>
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="bg-zinc-900 w-full pl-10 pr-4 py-2 border-2 border-zinc-400/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-400"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-6">
        {/* Notification Icon */}
        <button className="relative group">
          <Bell className="w-6 h-6 text-zinc-400 group-hover:text-white cursor-pointer transition-colors" />
          <span className="absolute top-0 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>


        {/* User Avatar */}
        <button className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default TopBar;

