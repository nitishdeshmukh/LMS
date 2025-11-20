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

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="size-[2.95rem] bg-blue-500 rounded-lg flex items-center justify-center border">
            <span className="text-white font-bold text-sm">C2</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Code2Dbug</h2>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/students"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Students</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Courses</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/announcements"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <Megaphone className="w-5 h-5" />
              <span className="font-medium">Announcements</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/certificate"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <FileBadge className="w-5 h-5" />
              <span className="font-medium">Manage Certificate</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive && 'text-blue-600 bg-blue-50',
                )
              }
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <NavLink
          to="/admin/support"
          className={({ isActive }) =>
            cn(
              'flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors',
              isActive && 'text-blue-600 bg-blue-50',
            )
          }
        >
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Support</span>
        </NavLink>
        <button
          onClick={() => {
            /* Add logout logic */
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

