"use client";

import { useState } from "react";
import Link from "next/link";

const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    icon: "shopping_cart",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "New Order Received",
    msg: "Order #ORD-2490 from Grace N. — Ksh 72,500",
    time: "5m ago",
    read: false,
  },
  {
    id: 2,
    icon: "inventory",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    title: "Low Stock Alert",
    msg: "DAP Fertilizer 50kg is below reorder level (4 units left)",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    icon: "support_agent",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    title: "New Customer Query",
    msg: "Samuel K. sent a new inquiry about bulk orders",
    time: "2h ago",
    read: false,
  },
  {
    id: 4,
    icon: "payments",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-700",
    title: "Payment Received",
    msg: "Ksh 145,200 confirmed for Order #ORD-2487",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    icon: "task_alt",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    title: "Lease Application Approved",
    msg: "Your application for Green Valley Plot A was approved",
    time: "2 days ago",
    read: true,
  },
];

interface NotificationBellProps {
  href: string;
  variant?: "dealer" | "lessee" | "owner" | "admin";
}

export default function NotificationBell({
  href,
  variant = "dealer",
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;
  const accentColor = variant === "lessee" ? "#047857" : "#047857";

  const markRead = (id: number) =>
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
            {notifications.length === 0 ? (
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
