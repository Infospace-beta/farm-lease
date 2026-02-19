"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

/**
 * DealerHeader Component
 *
 * Props:
 *  - title: string
 *  - subtitle: string
 *  - isSidebarOpen: boolean
 *  - setIsSidebarOpen: function
 *  - notifications: array of { id, type, title, message, timestamp, read }
 *  - onMarkNotificationAsRead: function(id)
 *  - onViewAllNotifications: function
 *  - rightContent: ReactNode
 */
const DealerHeader = ({
  title,
  subtitle,
  isSidebarOpen,
  setIsSidebarOpen,
  notifications = [],
  onMarkNotificationAsRead,
  onViewAllNotifications,
  rightContent,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.floor(
      (Date.now() - new Date(timestamp).getTime()) / 60000,
    );
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const typeIcon = (type) => {
    if (type === "success")
      return { icon: "check_circle", color: "text-emerald-600" };
    if (type === "warning")
      return { icon: "warning", color: "text-orange-500" };
    return { icon: "info", color: "text-blue-500" };
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex-shrink-0">
      <div className="flex justify-between items-end gap-4">
        {/* Left — Hamburger + Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={() => setIsSidebarOpen && setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-[#0f392b]"
          >
            <span className="material-icons-round text-2xl">menu</span>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-emerald-900 mb-1 font-serif truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-500 text-sm max-w-xl truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right — custom content + notifications */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {rightContent}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 w-80">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((n) => {
                      const { icon, color } = typeIcon(n.type);
                      return (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !n.read ? "bg-emerald-50/40" : ""
                          }`}
                          onClick={() =>
                            onMarkNotificationAsRead &&
                            onMarkNotificationAsRead(n.id)
                          }
                        >
                          <div className="flex items-start gap-3">
                            <span
                              className={`material-icons-round text-xl mt-0.5 ${color}`}
                            >
                              {icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {n.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {formatTime(n.timestamp)}
                              </p>
                            </div>
                            {!n.read && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onViewAllNotifications && onViewAllNotifications();
                    }}
                    className="w-full text-sm text-emerald-700 font-medium hover:text-emerald-800 text-center"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DealerHeader;
