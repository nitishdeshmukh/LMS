import React from 'react';
import { Bell, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { setStudentSidebarOpen } from '@/redux/slice';

const StudentTopBar = () => {
  const dispatch = useDispatch();
  const studentSidebarOpen = useSelector(state => state.global.studentSidebarOpen);
  const currentNavigation = useSelector(state => state.global.currentNavigation);
  const toggleSidebar = () => {
    dispatch(setStudentSidebarOpen(!studentSidebarOpen));
  };
  return (
    <div className="h-20 bg-black/50 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between pe-4 sm:pe-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => toggleSidebar()}
          className={`text-zinc-400 hover:text-white cursor-pointer transition-all md:m-0 ${studentSidebarOpen ? 'ms-64' : 'ms-0'}`}
        >
          <div className="size-12 rounded-e-full bg-zinc-900 flex items-center justify-center">
            {studentSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </div>
        </button>
        <h1
          className={`text-xl font-bold capitalize transition-all ${
            studentSidebarOpen ? 'hidden md:block' : 'block'
          }`}
        >
          {currentNavigation.split('/').slice(-1)[0].replaceAll('-', ' ') || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="relative group">
          <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-black"></div>
          <Bell
            size={20}
            className="text-zinc-400 hover:text-white cursor-pointer transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentTopBar;
