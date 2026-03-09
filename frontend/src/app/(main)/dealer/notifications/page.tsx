"use client";
import { useState, useEffect, useMemo } from "react";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";
import { dealerApi } from "@/lib/services/api";

interface Notification {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  msg: string;
  time: string;
  unread: boolean;
  actions: { label: string; primary: boolean }[];
  _date: Date;
}

function getGroup(dateStr: string): "today" | "yesterday" | "earlier" {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays < 1) return "today";
  if (diffDays < 2) return "yesterday";
  return "earlier";
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const secs = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)} min ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} hr ago`;
  if (secs < 172800) return `Yesterday, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

type CategoryKey = "order" | "payment" | "inventory" | "dispute" | "system";

function getCategoryKey(n: any): CategoryKey {
  const t = ((n.notification_type ?? n.type ?? n.category ?? n.title ?? "") as string).toLowerCase();
  if (t.includes("order") || t.includes("deliver")) return "order";
  if (t.includes("payment") || t.includes("mpesa") || t.includes("ksh")) return "payment";
  if (t.includes("stock") || t.includes("inventory") || t.includes("restock")) return "inventory";
  if (t.includes("dispute") || t.includes("refund") || t.includes("complaint")) return "dispute";
  return "system";
}

const CATEGORY_STYLE: Record<CategoryKey, { icon: string; iconBg: string; iconColor: string }> = {
  order: { icon: "check_circle", iconBg: "bg-green-100", iconColor: "text-green-600" },
  payment: { icon: "payments", iconBg: "bg-emerald-100", iconColor: "text-[#047857]" },
  inventory: { icon: "warning", iconBg: "bg-orange-100", iconColor: "text-orange-500" },
  dispute: { icon: "gavel", iconBg: "bg-gray-100", iconColor: "text-gray-700" },
  system: { icon: "info", iconBg: "bg-blue-100", iconColor: "text-blue-500" },
};

function mapNotification(n: any): Notification {
  const category = getCategoryKey(n);
  const { icon, iconBg, iconColor } = CATEGORY_STYLE[category];
  const rawDate: string = n.created_at ?? n.timestamp ?? new Date().toISOString();
  return {
    id: String(n.id ?? Math.random()),
    title: n.title ?? n.subject ?? "Notification",
    subtitle: n.subtitle ?? n.summary ?? "",
    icon,
    iconBg,
    iconColor,
    msg: n.message ?? n.body ?? n.description ?? "",
    time: timeAgo(rawDate),
    unread: !(n.is_read ?? n.read ?? false),
    actions: [],
    _date: new Date(rawDate),
  };
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    dealerApi
      .notifications({ page: 1 } as any)
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setNotifications(raw.map(mapNotification));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const dismiss = (id: string) =>
    setDismissed((prev) => new Set([...prev, id]));

  const markAllRead = () => {
    (dealerApi as any).markAllNotificationsRead?.().catch(() => { });
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("All notifications marked as read");
  };

  const handleMarkRead = (id: string) => {
    (dealerApi as any).markNotificationRead?.(id).catch(() => { });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const grouped = useMemo(() => {
    const visible = notifications.filter((n) => !dismissed.has(n.id));
    return {
      today: visible.filter((n) => getGroup(n._date.toISOString()) === "today"),
      yesterday: visible.filter((n) => getGroup(n._date.toISOString()) === "yesterday"),
      earlier: visible.filter((n) => getGroup(n._date.toISOString()) === "earlier"),
    };
  }, [notifications, dismissed]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const renderSection = (
    title: string,
    items: Notification[],
    badge?: string,
  ) => {
    if (!items.length) return null;
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
          {items.map((notif) => (
            <div
              key={notif.id}
              onClick={() => notif.unread && handleMarkRead(notif.id)}
              className={`bg-white rounded-2xl border p-5 transition cursor-pointer ${notif.unread ? "border-emerald-200 shadow-sm" : "border-gray-100"}`}
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
                      {notif.subtitle && (
                        <p className="text-xs text-gray-400">{notif.subtitle}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                      {notif.time}
                    </span>
                  </div>
                  {notif.msg && (
                    <p className="text-xs text-gray-500 leading-relaxed mt-2 mb-3">
                      {notif.msg}
                    </p>
                  )}
                  {notif.actions.length > 0 && (
                    <div className="flex gap-2">
                      {notif.actions.map((action) => (
                        <button
                          key={action.label}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.label === "Dismiss"
                              ? dismiss(notif.id)
                              : showToast(`${action.label}: action triggered`);
                          }}
                          className={`text-xs font-bold px-4 py-2 rounded-xl transition ${action.primary
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
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="Notifications"
        subtitle="Stay updated with alerts, orders and platform announcements."
      >
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
      </DealerPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        <div className="max-w-3xl">
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 animate-pulse"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              <span className="material-icons-round text-4xl mb-3 block">notifications_none</span>
              No notifications yet.
            </div>
          ) : (
            <>
              {renderSection(
                "Today",
                grouped.today,
                unreadCount > 0 ? `${unreadCount} New` : undefined,
              )}
              {renderSection("Yesterday", grouped.yesterday)}
              {renderSection("Earlier", grouped.earlier)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
