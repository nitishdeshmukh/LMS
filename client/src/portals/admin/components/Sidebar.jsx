import React from 'react';
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
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const sidebarContent = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, isButton: false },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3, isButton: false },
  { label: 'Students', to: '/admin/students', icon: Users, isButton: false },
  { label: 'Courses', to: '/admin/courses', icon: BookOpen, isButton: false },
  { label: 'Announcements', to: '/admin/announcements', icon: Megaphone, isButton: false },
  { label: 'Manage Certificate', to: '/admin/certificate', icon: FileBadge, isButton: false },
  { label: 'Settings', to: '/admin/settings', icon: Settings, isButton: false },
  { label: 'Support', to: '/admin/support', icon: HelpCircle, isButton: false },
  { label: 'Logout', icon: LogOut, isButton: true },
];

const Sidebar = () => {
  const handleLogout = () => {
    // TODO: Add your logout logic here
  };

  const mainItems = sidebarContent.filter((item) => !['Support', 'Logout'].includes(item.label));
  const bottomItems = sidebarContent.filter((item) => ['Support', 'Logout'].includes(item.label));

  return (
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
          {mainItems.map(({ label, to, icon: Icon }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                  )
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        {bottomItems.map(({ label, to, icon: Icon, isButton }) =>
          isButton ? (
            <button
              key={label}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ) : (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-medium'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ),
        )}
      </div>
    </div>
  );
};

export default Sidebar;
