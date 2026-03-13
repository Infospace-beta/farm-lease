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
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState, useEffect } from "react";
import { adminApi } from "@/lib/services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface VerificationItem {
  id: number;
  name: string;
  initials: string;
  plotId: string;
  submitted: string;
  status: string;
  land_title: string;
}

interface DealerItem {
  id: number;
  name: string;
  initials: string;
  email: string;
  product_count: number;
  is_verified: boolean;
  flagged: number;
}

interface ActivityItem {
  time: string;
  title: string;
  body: string;
  type: string;
  amount?: number;
}

interface DisputeItem {
  id: number;
  label: string;
  note: string;
  priority: "High" | "Medium" | "Low";
}

interface DashboardStats {
  total_users: number;
  total_farmers: number;
  total_landowners: number;
  total_dealers: number;
  pending_land_docs: number;
  escrow_total: number;
  platform_revenue: number;
  active_disputes: number;
  active_leases: number;
  verified_lands: number;
  flagged_lands: number;
  verification_queue: VerificationItem[];
  dealers: DealerItem[];
  activity_pulse: ActivityItem[];
  disputes: DisputeItem[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatKsh(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

const ACTIVITY_DOT: Record<string, string> = {
  registration: "bg-emerald-600",
  payment: "bg-[#5D4037]",
  lease: "bg-blue-400",
  default: "bg-gray-400",
};

const DISPUTE_STYLES: Record<string, { wrapper: string; badge: string }> = {
  High: {
    wrapper: "bg-red-50 border-red-100",
    badge: "bg-red-200 text-red-800",
  },
  Medium: {
    wrapper: "bg-yellow-50 border-yellow-100",
    badge: "bg-yellow-200 text-yellow-800",
  },
  Low: {
    wrapper: "bg-gray-50 border-gray-100",
    badge: "bg-gray-200 text-gray-700",
  },
};


// ── Page Component ─────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await adminApi.dashboardStats();
        setStats(data);
      } catch (err: unknown) {
        const e = err as { response?: { status?: number } };
        if (e?.response?.status === 403) {
          setError("Access denied. Admin privileges required.");
        } else {
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await adminApi.unreadCount();
        setUnreadCount(data.unread_count);
      } catch {
        // silent
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // unreadCount consumed externally via AdminPageHeader context
  void unreadCount;

  const statCards = stats
    ? [
        {
          label: "Total Users",
          value: stats.total_users.toLocaleString(),
          sub: `${stats.total_farmers} farmers · ${stats.total_landowners} owners`,
          up: true,
          icon: Users,
          iconBg: "bg-green-50",
          iconColor: "text-emerald-700",
        },
        {
          label: "Pending Land Docs",
          value: stats.pending_land_docs.toString(),
          sub: `${stats.verified_lands} verified · ${stats.flagged_lands} flagged`,
          up: stats.pending_land_docs > 0,
          icon: FileWarning,
          iconBg: "bg-orange-50",
          iconColor: "text-orange-600",
        },
        {
          label: "Escrow Total (Ksh)",
          value: formatKsh(stats.escrow_total),
          sub: "Active escrow accounts",
          up: true,
          icon: Lock,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          label: "Revenue (Ksh)",
          value: formatKsh(stats.platform_revenue),
          sub: "Completed transactions",
          up: true,
          icon: Wallet,
          iconBg: "bg-purple-50",
          iconColor: "text-purple-600",
        },
        {
          label: "Active Disputes",
          value: stats.active_disputes.toString(),
          sub: `${stats.active_leases} active leases`,
          up: stats.active_disputes === 0,
          icon: Gavel,
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-sidebar-bg" />
          <p className="text-sm font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50">
        <div className="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-sm shadow-sm">
          <p className="text-red-600 font-bold text-base mb-2">⚠ {error}</p>
          <p className="text-xs text-gray-400 mt-1">
            Make sure you are logged in as an admin account.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-sidebar-bg text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
            >
              Retry
            </button>
            <a
              href="/login"
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition"
            >
              Log in as Admin
            </a>
          </div>
        </div>
      </div>
    );
  }

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
                    className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                      card.up ? "text-emerald-700" : "text-red-500"
                    }`}
                  >
                    {card.up ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="truncate">{card.sub}</span>
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

              {stats?.verification_queue.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No pending land verifications.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Owner", "Plot ID", "Submitted", "Status", "Action"].map(
                          (h) => (
                            <th
                              key={h}
                              className={`pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                                h === "Action" ? "text-right" : ""
                              }`}
                            >
                              {h}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {stats?.verification_queue.map((row) => (
                        <tr
                          key={row.id}
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
                            <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">
                              {row.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <Link
                              href="/admin/land-verifications"
                              className="px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-sm bg-sidebar-bg text-white hover:opacity-90"
                            >
                              Review
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                {stats?.dealers.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No dealers registered yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {stats?.dealers.map((d) => (
                      <div
                        key={d.id}
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
                                  className={`w-3 h-3 ${
                                    i < 4
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="text-[10px] text-gray-400 ml-1">
                                {d.product_count} products
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold">
                            Flagged
                          </span>
                          <span
                            className={`block text-sm font-bold ${
                              d.flagged > 0 ? "text-red-500" : "text-gray-300"
                            }`}
                          >
                            {d.flagged}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  {stats?.disputes.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">
                      No active disputes.
                    </p>
                  ) : (
                    stats?.disputes.map((d) => {
                      const s = DISPUTE_STYLES[d.priority] ?? DISPUTE_STYLES.Low;
                      return (
                        <div
                          key={d.id}
                          className={`border ${s.wrapper} p-3 rounded-lg flex justify-between items-center`}
                        >
                          <div>
                            <p className="text-xs font-bold text-gray-800">
                              {d.label}
                            </p>
                            <p className="text-[10px] text-gray-500">{d.note}</p>
                          </div>
                          <span
                            className={`px-2 py-1 ${s.badge} text-[10px] font-bold rounded uppercase`}
                          >
                            {d.priority}
                          </span>
                        </div>
                      );
                    })
                  )}
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

              {stats?.activity_pulse.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No recent activity yet.
                </p>
              ) : (
                <div className="relative border-l border-gray-200 ml-1.5 space-y-7 pb-2">
                  {stats?.activity_pulse.map((item, i) => (
                    <div key={i} className="ml-6 relative">
                      <span
                        className={`absolute -left-7.75 top-1 h-2.5 w-2.5 rounded-full ${
                          ACTIVITY_DOT[item.type] ?? ACTIVITY_DOT.default
                        } ring-4 ring-white`}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

