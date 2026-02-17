import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, ArrowRight } from 'lucide-react';

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead, onViewAll }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9999]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">No notifications</p>
          </div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0 ${
                  !notification.read ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="flex gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h4 className={`text-xs leading-tight ${
                        !notification.read ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 mb-1 leading-snug">
                      {notification.message}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
          <button 
            onClick={onViewAll}
            className="w-full text-xs font-bold text-forest-green hover:text-emerald-600 transition-colors flex items-center justify-center gap-1"
          >
            View All
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
