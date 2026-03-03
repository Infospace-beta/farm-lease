"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { landsApi } from "@/lib/services/api";

interface Notification {
  id: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

interface NotificationBellProps {
  href: string;
  variant?: "dealer" | "lessee" | "owner" | "admin";
}

export default function NotificationBell({
  href,
  variant = "owner",
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications when dropdown opens (for owner variant)
  useEffect(() => {
    if (open && variant === "owner" && notifications.length === 0) {
      const fetchNotifications = async () => {
        setLoading(true);
        try {
          const { data } = await landsApi.ownerNotifications();
          setNotifications(data);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchNotifications();
    }
  }, [open, variant]);

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = (id: string | number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <span className="material-icons-round text-gray-500 text-xl">
          notifications
        </span>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              {unread > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-[#047857] hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                <span className="material-icons-round text-sm">done_all</span>
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="py-10 text-center">
                <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                <p className="text-sm text-gray-400 mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <span className="material-icons-round text-4xl text-gray-200 block mb-2">
                  notifications_off
                </span>
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !n.read ? "bg-blue-50/40" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <span
                      className={`material-icons-round text-sm ${n.iconColor}`}
                    >
                      {n.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {n.msg}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All */}
          <Link
            href={href}
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#047857] hover:bg-emerald-50 transition-colors border-t border-gray-100"
          >
            View all notifications
            <span className="material-icons-round text-sm">arrow_forward</span>
          </Link>
        </div>
      )}
    </div>
  );
}
