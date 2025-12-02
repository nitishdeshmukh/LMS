import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCheck,
  Trash2,
  Info,
  Award,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import Notify from './Notify';

import {
  setStudentSidebarOpen,
  selectStudentSidebarOpen,
  selectCurrentNavigation,
  selectNotifications,
  removeNotification,
  clearNotifications,
} from '@/redux/slices';

const NotificationIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <Award size={16} className="text-green-400" />;
    case 'course':
      return <BookOpen size={16} className="text-blue-400" />;
    case 'warning':
      return <AlertCircle size={16} className="text-yellow-400" />;
    case 'error':
      return <AlertCircle size={16} className="text-red-400" />;
    default:
      return <Info size={16} className="text-blue-400" />;
  }
};

const StudentTopBar = () => {
  const dispatch = useDispatch();
  const studentSidebarOpen = useSelector(selectStudentSidebarOpen);
  const currentNavigation = useSelector(selectCurrentNavigation);
  const notifications = useSelector(selectNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const toggleSidebar = () => {
    dispatch(setStudentSidebarOpen(!studentSidebarOpen));
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemoveNotification = id => {
    dispatch(removeNotification(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const formatTime = timestamp => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.length;

  return (
    <div className="h-20 bg-black/50 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between pe-4 sm:pe-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => toggleSidebar()}
          className={`text-zinc-400 absolute z-50 border-2 border-s-0 rounded-e-full overflow-hidden border-zinc-700 hover:text-white cursor-pointer transition-all md:m-0 ${studentSidebarOpen ? 'ms-64' : 'ms-0'}`}
        >
          <div className="size-12 bg-zinc-900 flex items-center justify-center">
            {studentSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </div>
        </button>
        <h1
          className={`text-xl ms-18 font-bold capitalize transition-all ${
            studentSidebarOpen ? 'hidden md:block' : 'block'
          }`}
        >
          {currentNavigation.split('/').slice(-1)[0].replaceAll('-', ' ') || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <Notify />
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-full hover:bg-zinc-800 transition-colors"
          >
            {unreadCount > 0 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
            <Bell
              size={20}
              className={`transition-colors ${isNotificationOpen ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
            />
          </button>

          {/* Notification Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <h3 className="font-bold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
                    >
                      <CheckCheck size={14} />
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-1 rounded hover:bg-zinc-800 transition-colors"
                  >
                    <X size={16} className="text-zinc-400" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
                          <NotificationIcon type={notification.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white line-clamp-1">
                            {notification.title}
                          </p>
                          <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-zinc-500 mt-2">
                            {formatTime(notification.id)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveNotification(notification.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700 transition-all"
                        >
                          <Trash2 size={14} className="text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Bell size={32} className="mx-auto text-zinc-600 mb-3" />
                    <p className="text-sm text-zinc-400">No notifications yet</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      We'll notify you when something arrives
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {unreadCount > 0 && (
                <div className="p-3 border-t border-zinc-800 bg-zinc-900/50">
                  <p className="text-xs text-zinc-500 text-center">
                    {unreadCount} notification{unreadCount > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentTopBar;
