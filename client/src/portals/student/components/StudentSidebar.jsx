import {
  BookOpen,
  Award,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Gift,
  Headphones,
  Settings,
  Crown,
  Book,
  LogOut,
} from 'lucide-react';
import { useSelector } from 'react-redux';

import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';

const StudentNavbar = () => {
  const navigateAndStore = useNavigateWithRedux();

  const activeTab = useSelector(state => state.global.currentNavigation);

  const sidebarItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, navigation: '/student/' },
    { label: 'My Courses', icon: <Book size={20} />, navigation: '/student/my-courses' },
    {
      label: 'Current Learning',
      icon: <BookOpen size={20} />,
      navigation: '/student/current-learning',
    },
    { label: 'Assignments', icon: <FileText size={20} />, navigation: '/student/assignments' },
    { label: 'Quizzes', icon: <ClipboardList size={20} />, navigation: '/student/quizzes' },
    { label: 'Leaderboard', icon: <Crown size={20} />, navigation: '/student/leaderboard' },
    { label: 'Certificates', icon: <Award size={20} />, navigation: '/student/certificates' },
    { label: 'Refer and Earn', icon: <Gift size={20} />, navigation: '/student/refer-and-earn' },
    { label: 'Support', icon: <Headphones size={20} />, navigation: '/student/support' },
    { label: 'Settings', icon: <Settings size={20} />, navigation: '/student/settings' },
  ];

  const handleClick = item => {
    navigateAndStore(item.navigation);
  };

  return (
    <div className="h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col ">
      {/* Header */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-800">
        <span className="text-xl font-bold tracking-tighter text-white">
          LMS<span className="text-blue-500">PORTAL</span>
        </span>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {sidebarItems.map(item => (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
              ${
                activeTab === item.navigation
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-medium'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }
            `}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div
          onClick={() => navigateAndStore('/student/profile')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
            AJ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">studentName</p>
            <p className="text-xs text-zinc-500 truncate">Student ID: 9021</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNavbar;
