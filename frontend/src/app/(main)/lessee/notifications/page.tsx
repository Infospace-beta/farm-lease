"use client";
import { useState, useEffect, useMemo } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

const CATEGORY_MAP: Record<string, string> = {
  payment: "payments",
  payments: "payments",
  lease: "agreements",
  agreement: "agreements",
  ai: "ai",
  report: "ai",
  verification: "agreements",
};

function getCategoryKey(n: { category?: string; notification_type?: string }): string {
  const raw = (n.category ?? n.notification_type ?? "all").toLowerCase();
  return CATEGORY_MAP[raw] ?? "all";
}

function getIcon(category: string): { icon: string; iconBg: string; iconColor: string } {
  if (category === "payments") return { icon: "account_balance_wallet", iconBg: "bg-emerald-100", iconColor: "text-[#047857]" };
  if (category === "ai") return { icon: "psychology", iconBg: "bg-blue-100", iconColor: "text-blue-600" };
  if (category === "agreements") return { icon: "description", iconBg: "bg-purple-100", iconColor: "text-purple-600" };
  return { icon: "notifications", iconBg: "bg-gray-100", iconColor: "text-gray-500" };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getGroup(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const itemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (itemDay.getTime() === today.getTime()) return "Today";
  if (itemDay.getTime() === yesterday.getTime()) return "Yesterday";
  return "Older";
}

interface Notification {
  id: number;
  group: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  category: string;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lesseeApi.notifications({ page: 1 })
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Notification[] = raw.map((n: any) => {
          const cat = getCategoryKey(n);
          const { icon, iconBg, iconColor } = getIcon(cat);
          const created = n.created_at ?? n.timestamp ?? new Date().toISOString();
          return {
            id: n.id,
            group: getGroup(created),
            icon,
            iconBg,
            iconColor,
            title: n.title ?? n.subject ?? "Notification",
            body: n.message ?? n.body ?? "",
            time: timeAgo(created),
            unread: !(n.is_read ?? n.read ?? false),
            category: cat,
          };
        });
        setNotifications(mapped);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllRead = () => {
    lesseeApi.markAllNotificationsRead?.().catch(() => { });
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkRead = (id: number) => {
    lesseeApi.markNotificationRead(id).catch(() => { });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, unread: false } : n));
  };

  const tabs = useMemo(() => {
    const counts = { all: notifications.length, payments: 0, ai: 0, agreements: 0 };
    notifications.forEach((n) => {
      if (n.category === "payments") counts.payments++;
      else if (n.category === "ai") counts.ai++;
      else if (n.category === "agreements") counts.agreements++;
    });
    return [
      { key: "all", label: "All Notifications", count: counts.all },
      { key: "payments", label: "Payments", count: counts.payments },
      { key: "ai", label: "AI Reports", count: counts.ai },
      { key: "agreements", label: "Agreements", count: counts.agreements },
    ];
  }, [notifications]);

  const groups = ["Today", "Yesterday", "Older"];

  const filtered = useMemo(() =>
    activeTab === "all" ? notifications : notifications.filter((n) => n.category === activeTab),
    [notifications, activeTab]
  );


  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="Notifications"
        subtitle="Stay updated on payments, AI reports and lease activity"
      >
        <button className="text-xs text-[#047857] font-semibold hover:text-emerald-700 flex items-center gap-1" onClick={handleMarkAllRead}>
          <span className="material-icons-round text-base">done_all</span>
          Mark all as read
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-hidden flex flex-col bg-[#f8fafc]">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-8 flex items-center gap-1 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab === tab.key
                ? "text-[#047857] border-[#047857]"
                : "text-gray-500 border-transparent hover:text-gray-800"
                }`}
            >
              {tab.label}
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === tab.key
                  ? "bg-[#047857] text-white"
                  : "bg-gray-100 text-gray-500"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-6 w-full">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
                  <div className="w-11 h-11 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-48" />
                    <div className="h-3 bg-gray-100 rounded w-full" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <span className="material-icons-round text-gray-400 text-3xl">notifications_none</span>
              </div>
              <p className="text-gray-500 font-medium text-sm">No notifications in this category</p>
            </div>
          ) : (
            groups.map((group) => {
              const items = filtered.filter((n) => n.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group} className="mb-6">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 px-1">
                    {group}
                  </h4>
                  <div className="space-y-2">
                    {items.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => notif.unread && handleMarkRead(notif.id)}
                        className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${notif.unread
                          ? "bg-white border-[#047857]/20 shadow-sm"
                          : "bg-white/60 border-gray-100 hover:bg-white hover:border-gray-200"
                          }`}
                      >
                        <div className={`w-11 h-11 ${notif.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`material-icons-round text-xl ${notif.iconColor}`}>{notif.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <h5 className={`text-sm font-bold ${notif.unread ? "text-gray-900" : "text-gray-700"}`}>
                                {notif.title}
                              </h5>
                              {notif.unread && <span className="w-2 h-2 bg-[#13ec80] rounded-full flex-shrink-0" />}
                            </div>
                            <span className="text-[10px] text-gray-400 flex-shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
