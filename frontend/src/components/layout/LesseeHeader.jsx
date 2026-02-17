import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import NotificationDropdown from '../common/NotificationDropdown';

const LesseeHeader = ({ 
  title, 
  subtitle, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  rightContent,
  showNotification = true,
  notifications = [],
  onMarkNotificationAsRead,
  onViewAllNotifications
}) => {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationRef = useRef(null);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotificationDropdown]);

  const handleMarkAsRead = (id) => {
    if (onMarkNotificationAsRead) {
      onMarkNotificationAsRead(id);
    }
  };

  const handleViewAll = () => {
    setShowNotificationDropdown(false);
    if (onViewAllNotifications) {
      onViewAllNotifications();
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-50">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden text-forest-green p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-6">
        {/* Custom right content (search, tabs, buttons, etc.) */}
        {rightContent}
        
        {/* Notification Bell */}
        {showNotification && (
          <div className="relative z-[9999]" ref={notificationRef}>
            <button 
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            
            {showNotificationDropdown && (
              <NotificationDropdown
                notifications={notifications}
                onClose={() => setShowNotificationDropdown(false)}
                onMarkAsRead={handleMarkAsRead}
                onViewAll={handleViewAll}
              />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default LesseeHeader;
