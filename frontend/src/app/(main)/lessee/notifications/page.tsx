"use client";
import { useState } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";

const tabs = [
  { key: "all", label: "All Notifications", count: 12 },
  { key: "payments", label: "Payments", count: 3 },
  { key: "ai", label: "AI Reports", count: 5 },
  { key: "agreements", label: "Agreements", count: 4 },
];

const notifications = [
  {
    id: 1,
    group: "Today",
    icon: "account_balance_wallet",
    iconBg: "bg-emerald-100",
    iconColor: "text-[#047857]",
    title: "Payment Released from Escrow",
    body: "Your escrow payment of Ksh 45,000 for Plot A4-North has been successfully released to the landlord. Transaction ID: TXN-0041.",
    time: "2 hours ago",
    unread: true,
    category: "payments",
    action: "View Receipt",
  },
  {
    id: 2,
    group: "Today",
    icon: "psychology",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Soil Analysis Report Ready",
    body: "Your AI-generated soil analysis for Rift Valley region is complete. Recommended crops: Maize, Wheat. Match confidence: 98%.",
    time: "5 hours ago",
    unread: true,
    category: "ai",
    action: "View AI Report",
  },
  {
    id: 3,
    group: "Yesterday",
    icon: "description",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "New Agreement Draft Available",
    body: "James Mwangi has submitted a revised lease agreement for Plot A4-North. Please review and sign by June 30, 2024.",
    time: "Yesterday, 3:45 PM",
    unread: false,
    category: "agreements",
    action: "Review PDF",
  },
  {
    id: 4,
    group: "Yesterday",
    icon: "build_circle",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    title: "Platform Maintenance Completed",
    body: "Scheduled maintenance has been completed. All services including AI Predictor, Escrow, and Land Browse are fully operational.",
    time: "Yesterday, 1:00 AM",
    unread: false,
    category: "all",
    action: null,
  },
  {
    id: 5,
    group: "Older",
    icon: "account_balance_wallet",
    iconBg: "bg-emerald-100",
    iconColor: "text-[#047857]",
    title: "Plot B2-East Escrow Deposit Confirmed",
    body: "Your escrow deposit of Ksh 22,000 for Plot B2-East Highlands has been confirmed and is held securely. Release upon agreement execution.",
    time: "Jun 20, 2024",
    unread: false,
    category: "payments",
    action: "View Details",
  },
  {
    id: 6,
    group: "Older",
    icon: "psychology",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "AI Recommendation: Central Kenya",
    body: "Based on your profile and current climate data, avocado farming shows 92% match rate for Central Kenya region. View full analysis.",
    time: "Jun 18, 2024",
    unread: false,
    category: "ai",
    action: "View Analysis",
  },
  {
    id: 7,
    group: "Older",
    icon: "verified",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Land Listing Verified: Thika Road Plot",
    body: "Thika Road Plot (12 Acres, Kiambu) has passed verification. The listing is now fully available for leasing.",
    time: "Jun 15, 2024",
    unread: false,
    category: "agreements",
    action: "View Listing",
  },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const groups = ["Today", "Yesterday", "Older"];

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter(
        (n) => n.category === activeTab || n.category === "all",
      );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="Notifications"
        subtitle="Stay updated on payments, AI reports and lease activity"
      >
        <button className="text-xs text-[#047857] font-semibold hover:text-emerald-700 flex items-center gap-1">
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
        <div className="flex-1 overflow-y-auto p-6 w-full max-w-7xl mx-auto">
          {groups.map((group) => {
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
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${notif.unread
                          ? "bg-white border-[#047857]/20 shadow-sm"
                          : "bg-white/60 border-gray-100 hover:bg-white hover:border-gray-200"
                        }`}
                    >
                      <div
                        className={`w-11 h-11 ${notif.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}
                      >
                        <span
                          className={`material-icons-round text-xl ${notif.iconColor}`}
                        >
                          {notif.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h5
                              className={`text-sm font-bold ${notif.unread ? "text-gray-900" : "text-gray-700"}`}
                            >
                              {notif.title}
                            </h5>
                            {notif.unread && (
                              <span className="w-2 h-2 bg-[#13ec80] rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          {notif.body}
                        </p>
                        {notif.action && (
                          <button className="mt-2 text-xs font-bold text-[#047857] hover:text-emerald-700 flex items-center gap-1 transition-colors">
                            {notif.action}
                            <span className="material-icons-round text-sm">
                              arrow_forward
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
