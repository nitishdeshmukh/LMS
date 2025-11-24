import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Megaphone,
  FileBadge,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigateWithRedux } from '@/common/hooks/useNavigateWithRedux';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/common/components/ui/alert-dialog';

const sidebarContent = [
  { label: 'Dashboard', navigation: '/admin', icon: LayoutDashboard, isButton: false },
  { label: 'Analytics', navigation: '/admin/analytics', icon: BarChart3, isButton: false },
  { label: 'Students', navigation: '/admin/students', icon: Users, isButton: false },
  { label: 'Courses', navigation: '/admin/courses', icon: BookOpen, isButton: false },
  { label: 'Announcements', navigation: '/admin/announcements', icon: Megaphone, isButton: false },
  {
    label: 'Manage Certificate',
    navigation: '/admin/certificate',
    icon: FileBadge,
    isButton: false,
  },
  { label: 'Settings', navigation: '/admin/settings', icon: Settings, isButton: false },
  { label: 'Support', navigation: '/admin/support', icon: HelpCircle, isButton: false },
  { label: 'Logout', navigation: '/', icon: LogOut, isButton: true },
];

const Sidebar = () => {
  const navigateAndStore = useNavigateWithRedux();
  const activeTab = useSelector(state => state.global.currentNavigation);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      // Clear authentication token from localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      
      // Clear session storage if you use it
      sessionStorage.clear();
      
      // Optional: Call logout API endpoint
      // await fetch('/api/logout', { method: 'POST' });
      
      // Optional: Clear Redux state
      // dispatch(clearUserData());
      // dispatch(resetStore());
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleClick = item => {
    if (item.isButton) {
      setShowLogoutDialog(true);
    } else {
      navigateAndStore(item.navigation);
    }
  };

  const confirmLogout = async () => {
    // Perform logout operations first
    await handleLogout();
    
    // Close dialog
    setShowLogoutDialog(false);
    
    // Navigate to home page after logout operations complete
    navigateAndStore('/');
  };

  const mainItems = sidebarContent.filter(item => !['Support', 'Logout'].includes(item.label));
  const bottomItems = sidebarContent.filter(item => ['Support', 'Logout'].includes(item.label));

  return (
    <>
      <div className="h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col text-zinc-400">
        {/* Logo Section */}
        <div className="px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="size-[2.95rem] bg-blue-500 rounded-lg flex items-center justify-center border border-blue-500">
              <span className="text-white font-bold text-sm">C2</span>
            </div>
            <div>
              <h2 className="font-semibold text-blue-500">Code2Dbug</h2>
              <p className="text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {mainItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => handleClick(item)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === item.navigation
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-medium'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {bottomItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  item.isButton
                    ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    : activeTab === item.navigation
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-100">Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to log out? You will need to log in again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
