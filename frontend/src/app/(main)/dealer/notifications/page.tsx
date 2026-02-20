"use client";
import { useState } from "react";

const notifications = {
  today: [
    {
      id: "N1",
      title: "Low Stock Alert",
      subtitle: "Hybrid Maize Seeds (10kg)",
      icon: "warning",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
      msg: "Your stock of Hybrid Maize Seeds (10kg) has dropped to 12 units, which is below your alert threshold of 30 units.",
      time: "2 hrs ago",
      unread: true,
      actions: [
        { label: "Restock Now", primary: true },
        { label: "Dismiss", primary: false },
      ],
    },
    {
      id: "N2",
      title: "Order #4492 Completed",
      subtitle: "DAP Fertilizer — FarmCorp Ltd.",
      icon: "check_circle",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      msg: "Your order #4492 for DAP Fertilizer has been successfully delivered to FarmCorp Ltd. and marked as complete.",
      time: "4 hrs ago",
      unread: true,
      actions: [{ label: "View Receipt", primary: false }],
    },
    {
      id: "N3",
      title: "Platform Maintenance Scheduled",
      subtitle: "System downtime notice",
      icon: "info",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-500",
      msg: "FarmLease platform maintenance is scheduled for Saturday 24th Aug from 2:00 AM – 4:00 AM EAT. Some services will be unavailable.",
      time: "5 hrs ago",
      unread: false,
      actions: [],
    },
  ],
  yesterday: [
    {
      id: "N4",
      title: "New Dispute Report",
      subtitle: "Order #4480 — Incorrect item delivered",
      icon: "gavel",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-700",
      msg: "A dispute has been raised on order #4480. The buyer reports receiving an incorrect product. Please review and respond within 48 hours.",
      time: "Yesterday 4:30 PM",
      unread: false,
      actions: [
        { label: "Resolve Dispute", primary: true },
        { label: "Contact Buyer", primary: false },
      ],
    },
    {
      id: "N5",
      title: "New Inventory Added",
      subtitle: "Solar Water Pump Kit — 50 units",
      icon: "inventory",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      msg: "50 units of Solar Water Pump Kit have been successfully added to your inventory by your store manager.",
      time: "Yesterday 10:15 AM",
      unread: false,
      actions: [],
    },
  ],
  earlier: [
    {
      id: "N6",
      title: "Direct Payment Received",
      subtitle: "Ksh 4,500 from Order #4415",
      icon: "payments",
      iconBg: "bg-emerald-100",
      iconColor: "text-[#047857]",
      msg: "You have received a direct M-Pesa payment of Ksh 4,500 for Order #4415 (DAP Fertilizer). Funds are being processed.",
      time: "Mon 14 Aug, 2:12 PM",
      unread: false,
      actions: [],
    },
  ],
};

type Notification = (typeof notifications.today)[0];
type Section = { title: string; items: Notification[]; badge?: string };

export default function NotificationsPage() {
  const [allNotifications, setAllNotifications] = useState(() => ({
    today: notifications.today.map((n) => ({ ...n })),
    yesterday: notifications.yesterday.map((n) => ({ ...n })),
    earlier: notifications.earlier.map((n) => ({ ...n })),
  }));
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const dismiss = (id: string) =>
    setDismissed((prev) => new Set([...prev, id]));

  const markAllRead = () => {
    setAllNotifications((prev) => ({
      today: prev.today.map((n) => ({ ...n, unread: false })),
      yesterday: prev.yesterday.map((n) => ({ ...n, unread: false })),
      earlier: prev.earlier.map((n) => ({ ...n, unread: false })),
    }));
    showToast("All notifications marked as read");
  };

  const renderSection = (
    title: string,
    items: Notification[],
    badge?: string,
  ) => {
    const visible = items.filter((n) => !dismissed.has(n.id));
    if (!visible.length) return null;
    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-bold bg-[#047857] text-white px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <div className="space-y-3">
          {visible.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white rounded-2xl border p-5 transition ${notif.unread ? "border-emerald-200 shadow-sm" : "border-gray-100"}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 ${notif.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <span className={`material-icons-round ${notif.iconColor}`}>
                    {notif.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-0.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-bold ${notif.unread ? "text-gray-900" : "text-gray-700"}`}
                        >
                          {notif.title}
                        </h4>
                        {notif.unread && (
                          <span className="w-2 h-2 bg-[#047857] rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{notif.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2 mb-3">
                    {notif.msg}
                  </p>
                  {notif.actions.length > 0 && (
                    <div className="flex gap-2">
                      {notif.actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={() =>
                            action.label === "Dismiss"
                              ? dismiss(notif.id)
                              : showToast(`${action.label}: action triggered`)
                          }
                          className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                            action.primary
                              ? "bg-[#047857] text-white hover:opacity-90"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Notifications
          </h2>
          <p className="text-gray-500 text-sm">
            Stay updated with alerts, orders and platform announcements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="text-sm text-[#047857] font-bold hover:underline"
          >
            Mark all as read
          </button>
          <button
            onClick={() => showToast("Filters applied")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 bg-white rounded-lg text-gray-500 hover:bg-gray-50"
          >
            <span className="material-icons-round text-base">filter_list</span>
            Filter
          </button>
        </div>
      </header>

      <div className="max-w-3xl">
        {renderSection("Today", allNotifications.today, "3 New")}
        {renderSection("Yesterday", allNotifications.yesterday)}
        {renderSection("Earlier This Week", allNotifications.earlier)}
      </div>
    </div>
  );
}
