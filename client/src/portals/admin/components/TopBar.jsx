import React, { useState } from 'react';
import { Search, Bell, User, ChevronLeft, ChevronRight, Settings, LogOut, UserCircle, Shield } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setAdminSidebarOpen } from '@/redux/slice';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/common/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";

const TopBar = () => {
  const dispatch = useDispatch();
  const currentNavigation = useSelector(state => state.global.currentNavigation);
  const adminSidebarOpen = useSelector(state => state.global.adminSidebarOpen);

  // State for managing notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Instructor Registration",
      description: "John Smith has registered as an instructor",
      time: "5 min ago",
      read: false,
      type: "instructor"
    },
    {
      id: 2,
      title: "Course Submitted for Review",
      description: "Advanced React Development course awaiting approval",
      time: "1 hour ago",
      read: false,
      type: "course"
    },
    {
      id: 3,
      title: "Student Enrollment Spike",
      description: "50+ new enrollments in Web Development course",
      time: "2 hours ago",
      read: false,
      type: "enrollment"
    },
    {
      id: 4,
      title: "Course Completion Alert",
      description: "30 students completed Python Basics this week",
      time: "3 hours ago",
      read: true,
      type: "completion"
    },
    {
      id: 5,
      title: "Instructor Course Updated",
      description: "Sarah Johnson updated JavaScript Fundamentals",
      time: "5 hours ago",
      read: true,
      type: "course"
    }
  ]);

  const toggleSidebar = () => {
    dispatch(setAdminSidebarOpen(!adminSidebarOpen));
  };

  // Extract and format the active tab name from the navigation path
  const getActiveTabName = () => {
    if (!currentNavigation) return 'Dashboard';

    const pathSegments = currentNavigation.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Handle root path (/admin)
    if (lastSegment === 'admin' || !lastSegment) {
      return 'Dashboard';
    }

    // Format: replace dashes/underscores with spaces and capitalize each word
    return lastSegment
      .replace(/-/g, ' ')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single notification as read
  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="h-20 bg-black/50 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between pe-4 sm:pe-8">
      {/* Active Tab with Sidebar Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={`text-zinc-400 hover:text-white cursor-pointer transition-all md:m-0 ${
            adminSidebarOpen ? 'ms-64' : 'ms-0'
          }`}
        >
          <div className="size-12 rounded-e-full bg-zinc-900 flex items-center justify-center">
            {adminSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </div>
        </button>
        <h1
          className={`text-xl font-bold text-zinc-100 capitalize transition-all ${
            adminSidebarOpen ? 'hidden md:block' : 'block'
          }`}
        >
          {getActiveTabName()}
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses, students, instructors..."
            className="bg-zinc-900 w-full pl-10 pr-4 py-2 border-2 border-zinc-400/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-400 text-zinc-100"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notification Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative group">
              <Bell className="w-6 h-6 text-zinc-400 group-hover:text-white cursor-pointer transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-0.5 size-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold animate-pulse">
                  <span className='p-4'>{unreadCount}</span>
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 bg-zinc-900 border-zinc-800 text-zinc-100 p-0">
            {/* Header with Actions */}
            <div className="p-4 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Admin Notifications</h3>
                  <p className="text-sm text-zinc-400">
                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
                {notifications.length > 0 && (
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors px-2 py-1 rounded hover:bg-zinc-800"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notifications List */}
            {notifications.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-zinc-800/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                            notification.type === 'instructor' ? 'bg-purple-500/20 text-purple-400' :
                            notification.type === 'course' ? 'bg-blue-500/20 text-blue-400' :
                            notification.type === 'enrollment' ? 'bg-green-500/20 text-green-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {notification.type}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">{notification.description}</p>
                        <span className="text-xs text-zinc-500 mt-2 inline-block">{notification.time}</span>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm text-zinc-400">No notifications yet</p>
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear all
                </button>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all">
                <User className="w-6 h-6 text-white" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border-zinc-800 text-zinc-100">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Admin Dashboard</p>
                <p className="text-xs text-zinc-400">[email protected]</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                    <Shield className="w-3 h-3" />
                    Super Admin
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
              <UserCircle className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm">My Profile</span>
                <span className="text-xs text-zinc-500">View and edit profile</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-zinc-100">
              <Settings className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-sm">System Settings</span>
                <span className="text-xs text-zinc-500">Configure LMS settings</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="cursor-pointer focus:bg-zinc-800 focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;
