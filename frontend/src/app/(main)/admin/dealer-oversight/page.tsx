"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Store,
  ShieldCheck,
  Search,
  AlertTriangle,
  FileDown,
  Mail,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminApi } from "@/lib/services/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface DealerOversightStats {
  active_dealers: number;
  compliant_dealers: number;
  suspended_dealers: number;
  flagged_listings: number;
  avg_compliance_score: number;
  total_dealers: number;
}

interface DealerRow {
  id: number;
  name: string;
  initials: string;
  email: string;
  county: string;
  is_active: boolean;
  is_verified: boolean;
  total_products: number;
  flagged_items: number;
  status: string;
  violation: string;
  flag_freq: string;
  joined: string;
}

interface OversightData {
  stats: DealerOversightStats;
  dealers: DealerRow[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAvatarBg(name: string): string {
  const colors = [
    "bg-[#8d6e63]",
    "bg-[#5D4037]",
    "bg-emerald-700",
    "bg-blue-700",
    "bg-red-800",
    "bg-gray-500",
    "bg-indigo-700",
    "bg-amber-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

function statusStyle(status: string): string {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700 border-green-100";
    case "Unverified":
      return "bg-orange-50 text-orange-700 border-orange-100";
    case "Suspended":
      return "bg-gray-100 text-gray-600 border-gray-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

function flagStyle(freq: string): string {
  switch (freq) {
    case "Suspended":
      return "bg-gray-100 text-gray-600";
    case "Pending Review":
      return "bg-yellow-100 text-yellow-700";
    case "None":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function violationColor(v: string): string {
  if (v === "None") return "text-emerald-600";
  if (v === "Account Suspended") return "text-gray-500";
  return "text-orange-500";
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function DealerOversightPage() {
  const [activeTab, setActiveTab] = useState<"violations" | "history">("violations");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<OversightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suspending, setSuspending] = useState<number | null>(null);

  const fetchData = useCallback(async (q?: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.dealerOversight(q ? { search: q } : undefined);
      setData(res.data);
    } catch {
      setError("Failed to load dealer data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchData(search || undefined), 400);
    return () => clearTimeout(timer);
  }, [search, fetchData]);

  const handleSuspend = async (dealer: DealerRow) => {
    if (!confirm(`${dealer.is_active ? "Suspend" : "Unsuspend"} dealer "${dealer.name}"?`)) return;
    setSuspending(dealer.id);
    try {
      await adminApi.suspendDealer(dealer.id);
      await fetchData(search || undefined);
    } catch {
      alert("Failed to update dealer status.");
    } finally {
      setSuspending(null);
    }
  };

  const stats = data?.stats;
  const dealers = data?.dealers ?? [];

  const statCards = stats
    ? [
        {
          label: "Active Dealers",
          value: String(stats.active_dealers),
          sub: `${stats.compliant_dealers} Fully Compliant`,
          subStyle: "text-emerald-700 bg-green-50",
          icon: Store,
          iconBg: "bg-green-50",
          iconColor: "text-emerald-700",
        },
        {
          label: "Avg Compliance Score",
          value: `${stats.avg_compliance_score}%`,
          sub: "Target: 90% minimum",
          subStyle: "text-gray-500",
          icon: ShieldCheck,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          label: "Suspended Dealers",
          value: String(stats.suspended_dealers),
          sub: stats.suspended_dealers > 0 ? "Requires immediate review" : "No suspensions",
          subStyle: stats.suspended_dealers > 0
            ? "text-yellow-700 bg-yellow-50"
            : "text-gray-500",
          icon: AlertTriangle,
          iconBg: "bg-yellow-50",
          iconColor: "text-yellow-600",
        },
        {
          label: "Hidden Listings",
          value: String(stats.flagged_listings),
          sub: stats.flagged_listings > 0 ? "Investigate now" : "All listings visible",
          subStyle: stats.flagged_listings > 0
            ? "text-red-600 bg-red-50"
            : "text-gray-500",
          icon: AlertTriangle,
          iconBg: "bg-red-50",
          iconColor: "text-red-600",
        },
      ]
    : [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Agro-Dealer Compliance Oversight"
        subtitle="Monitor dealers, manage compliance violations, and enforce network quality standards."
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dealers..."
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-56 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium whitespace-nowrap">
          <FileDown className="w-4 h-4" />
          Export Log
        </button>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("violations")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "violations"
                ? "text-emerald-800 border-emerald-700"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Active Violations
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "history"
                ? "text-emerald-800 border-emerald-700"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Compliance History
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading dealer data…</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-36"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        {card.label}
                      </h3>
                      <span
                        className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </span>
                    </div>
                    <div>
                      <span className="text-3xl font-bold text-gray-800">
                        {card.value}
                      </span>
                      <div
                        className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${card.subStyle}`}
                      >
                        {card.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dealers Table */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-earth font-serif">
                  Dealer Compliance
                </h3>
                <span className="px-4 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg">
                  {dealers.length} Dealer{dealers.length !== 1 ? "s" : ""}
                </span>
              </div>

              {dealers.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">
                  No dealers found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {[
                          "Dealer Name",
                          "County",
                          "Flag Status",
                          "Total Products",
                          "Hidden Items",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className={`pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                              ["Flag Status", "Total Products", "Hidden Items", "Status"].includes(h)
                                ? "text-center"
                                : h === "Actions"
                                ? "text-right pr-2"
                                : "pl-2"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {dealers.map((dealer) => (
                        <tr
                          key={dealer.id}
                          className={`group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 ${
                            !dealer.is_active ? "bg-red-50/10" : ""
                          }`}
                        >
                          {/* Dealer Name */}
                          <td className="py-4 pl-2 pr-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg ${getAvatarBg(dealer.name)} text-white flex items-center justify-center font-bold text-sm shadow-sm relative`}
                              >
                                {dealer.initials}
                                {!dealer.is_active && (
                                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{dealer.name}</p>
                                <p className="text-xs text-gray-500">{dealer.email}</p>
                                <p className={`text-[10px] mt-1 font-semibold ${violationColor(dealer.violation)}`}>
                                  {dealer.violation !== "None" ? `Violation: ${dealer.violation}` : "Compliant"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* County */}
                          <td className="py-4 pr-4 text-gray-500 text-sm">
                            {dealer.county || <span className="text-gray-300 italic">—</span>}
                          </td>

                          {/* Flag Status */}
                          <td className="py-4 pr-4 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${flagStyle(dealer.flag_freq)}`}>
                              {dealer.flag_freq}
                            </span>
                          </td>

                          {/* Total Products */}
                          <td className="py-4 pr-4 text-center">
                            <span className="font-medium text-gray-600">
                              {dealer.total_products}
                            </span>
                          </td>

                          {/* Hidden Items */}
                          <td className="py-4 pr-4 text-center">
                            {dealer.flagged_items > 0 ? (
                              <button className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                                {dealer.flagged_items} Hidden
                              </button>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                0
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 pr-2 text-center">
                            <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${statusStyle(dealer.status)}`}>
                              {dealer.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 text-right pr-2">
                            <div className="flex justify-end gap-2">
                              <a
                                href={`mailto:${dealer.email}`}
                                className="p-1.5 bg-white text-gray-500 hover:text-earth hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                                title="Send Message"
                              >
                                <Mail className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleSuspend(dealer)}
                                disabled={suspending === dealer.id}
                                className={`px-3 py-1.5 bg-white text-xs font-bold rounded-lg border border-gray-200 transition-colors flex items-center gap-1 ${
                                  suspending === dealer.id
                                    ? "text-gray-300 cursor-not-allowed"
                                    : dealer.is_active
                                    ? "text-red-600 hover:bg-red-50"
                                    : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                {suspending === dealer.id && (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                )}
                                {dealer.is_active ? "Suspend" : "Unsuspend"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
