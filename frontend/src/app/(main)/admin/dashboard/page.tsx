"use client";

import {
  Users,
  FileWarning,
  Lock,
  Wallet,
  Gavel,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Star,
  Search,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState, useEffect } from "react";
import { adminApi } from "@/lib/services/api";

const statCards = [
  {
    label: "Total Users",
    value: "12,450",
    trend: "+8.5%",
    up: true,
    icon: Users,
    iconBg: "bg-green-50",
    iconColor: "text-emerald-700",
  },
  {
    label: "Pending Land Docs",
    value: "48",
    trend: "+12 new",
    up: true,
    icon: FileWarning,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    label: "Escrow Total (Ksh)",
    value: "24.5M",
    trend: "+3.2%",
    up: true,
    icon: Lock,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Revenue (Ksh)",
    value: "1.8M",
    trend: "+15%",
    up: true,
    icon: Wallet,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    label: "Active Disputes",
    value: "3",
    trend: "-2",
    up: false,
    icon: Gavel,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const verificationQueue = [
  {
    name: "John Doe",
    initials: "JD",
    plotId: "LR-4521/11",
    submitted: "2 hrs ago",
    status: "Validated",
    statusStyle: "bg-green-100 text-green-700",
    action: "Review Title",
    actionStyle: "bg-[#0f392b] text-white hover:opacity-90",
  },
  {
    name: "Jane Smith",
    initials: "JS",
    plotId: "LR-8829/04",
    submitted: "5 hrs ago",
    status: "Pending Check",
    statusStyle: "bg-yellow-100 text-yellow-700",
    action: "Review Title",
    actionStyle: "bg-[#0f392b] text-white hover:opacity-90",
  },
  {
    name: "Michael Kimani",
    initials: "MK",
    plotId: "LR-1029/99",
    submitted: "1 day ago",
    status: "Discrepancy",
    statusStyle: "bg-red-100 text-red-700",
    action: "Investigate",
    actionStyle:
      "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50",
  },
  {
    name: "Alice Wanjiku",
    initials: "AW",
    plotId: "LR-3310/12",
    submitted: "1 day ago",
    status: "Validated",
    statusStyle: "bg-green-100 text-green-700",
    action: "Review Title",
    actionStyle: "bg-[#0f392b] text-white hover:opacity-90",
  },
];

const dealers = [
  {
    initials: "A",
    name: "Agro-Input Ltd",
    rating: 4.2,
    stars: 4,
    flagged: 0,
    flaggedColor: "text-gray-300",
  },
  {
    initials: "K",
    name: "Kenya Seeds Co",
    rating: 4.9,
    stars: 5,
    flagged: 0,
    flaggedColor: "text-gray-300",
  },
  {
    initials: "G",
    name: "GreenHarvest",
    rating: 2.8,
    stars: 3,
    flagged: 2,
    flaggedColor: "text-red-500",
  },
];

const activityPulse = [
  {
    time: "Just now",
    title: "New User Registration",
    body: "Samuel K. registered as a Lessee. Awaiting email verification.",
    dotColor: "bg-emerald-600",
  },
  {
    time: "15 mins ago",
    title: "Escrow Payout Released",
    body: "Released Ksh 120,000 to Agro-Input Ltd for Order #9921.",
    dotColor: "bg-[#5D4037]",
    highlight: "Ksh 120,000",
  },
  {
    time: "1 hour ago",
    title: "Dispute Flagged",
    body: "Dispute raised on Lease ID #5529 by Tenant regarding soil quality.",
    dotColor: "bg-red-400",
    link: "View Details",
  },
  {
    time: "3 hours ago",
    title: "System Backup",
    body: "Daily database backup completed successfully (4.2GB).",
    dotColor: "bg-blue-400",
  },
  {
    time: "5 hours ago",
    title: "Land Listing Approved",
    body: "Plot B12 (5 Acres) approved for listing after successful verification.",
    dotColor: "bg-gray-400",
  },
];

export default function AdminDashboardPage() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await adminApi.unreadCount();
        setUnreadCount(data.unread_count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Admin Control Center"
        subtitle="Operational oversight, user verification queues, and system-wide financial monitoring."
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search system..."
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-56 shadow-sm"
          />
        </div>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-24 md:h-28"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-tight">
                    {card.label}
                  </h3>
                  <span
                    className={`w-8 h-8 rounded-full ${card.iconBg} flex items-center justify-center`}
                  >
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </span>
                </div>
                <div>
                  <span className="text-lg md:text-xl font-bold text-gray-800">
                    {card.value}
                  </span>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs font-medium ${card.up ? "text-emerald-700" : "text-green-600"
                      }`}
                  >
                    {card.up ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>{card.trend}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-4 md:space-y-6">
            {/* Verification Queue */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-4 md:mb-5">
                <h3 className="text-base md:text-lg font-bold text-earth font-serif">
                  Verification Queue
                </h3>
                <Link
                  href="/admin/land-verifications"
                  className="text-xs font-bold text-sidebar-bg hover:underline flex items-center gap-1"
                >
                  View All Pending <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {[
                        "Owner",
                        "Plot ID",
                        "Submitted",
                        "Ardhisasa Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${h === "Action" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {verificationQueue.map((row) => (
                      <tr
                        key={row.plotId}
                        className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                              {row.initials}
                            </div>
                            <span className="font-semibold text-gray-700">
                              {row.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600 font-mono text-xs">
                          {row.plotId}
                        </td>
                        <td className="py-3 pr-4 text-gray-500 text-xs">
                          {row.submitted}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full ${row.statusStyle}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-sm ${row.actionStyle}`}
                          >
                            {row.action}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom two cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Agro-Dealer Compliance */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-earth font-serif">
                    Agro-Dealer Compliance
                  </h3>
                  <Link
                    href="/admin/dealer-oversight"
                    className="text-xs text-sidebar-bg font-bold hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {dealers.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                          {d.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {d.name}
                          </p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < d.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                            <span className="text-[10px] text-gray-400 ml-1">
                              {d.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">
                          Flagged
                        </span>
                        <span
                          className={`block text-sm font-bold ${d.flaggedColor}`}
                        >
                          {d.flagged}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col">
                <div className="mb-3">
                  <h3 className="text-base font-bold text-earth font-serif mb-1">
                    Dispute Resolution Center
                  </h3>
                  <p className="text-xs text-gray-500">
                    Overview of recent high-priority tickets.
                  </p>
                </div>
                <div className="space-y-2 mb-4 flex-1">
                  <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-red-800">
                        Lease #5529
                      </p>
                      <p className="text-[10px] text-red-600">
                        Soil Quality Dispute
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-200 text-red-800 text-[10px] font-bold rounded uppercase">
                      High
                    </span>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-yellow-800">
                        Lease #9921
                      </p>
                      <p className="text-[10px] text-yellow-600">
                        Delayed Payment
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-[10px] font-bold rounded uppercase">
                      Medium
                    </span>
                  </div>
                </div>
                <Link
                  href="/admin/agreements"
                  className="w-full py-2.5 bg-sidebar-bg text-white text-sm font-bold rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  View All Cases <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Activity Pulse */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sidebar-bg opacity-60" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sidebar-bg" />
                </span>
                <h3 className="font-bold text-lg text-earth font-serif">
                  Activity Pulse
                </h3>
              </div>
              <div className="relative border-l border-gray-200 ml-1.5 space-y-7 pb-2">
                {activityPulse.map((item, i) => (
                  <div key={i} className="ml-6 relative">
                    <span
                      className={`absolute -left-7.75 top-1 h-2.5 w-2.5 rounded-full ${item.dotColor} ring-4 ring-white`}
                    />
                    <span className="text-xs text-gray-400 block mb-0.5">
                      {item.time}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {item.body}
                    </p>
                    {item.link && (
                      <Link
                        href="/admin/land-verifications"
                        className="text-xs font-bold text-red-600 mt-1 inline-block hover:underline"
                      >
                        {item.link}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
