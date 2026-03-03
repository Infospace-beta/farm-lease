"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  RefreshCw,
  Copy,
  AlertCircle,
  ChevronRight,
  Download,
  CheckCircle2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { landsApi } from "@/lib/services/api";
import { useAuth } from "@/providers/AuthContext";

/* ─── Types ───────────────────────────────────────────── */
interface LandListing {
  id: number;
  title: string;
  title_deed_number: string;
  owner: number;
  status: string;
  is_verified: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  created_at: string;
  total_area: number;
  images: Array<{ id: number; image: string }>;
}

interface AdminStats {
  total_lands: number;
  pending_verification: number;
  verified: number;
  flagged: number;
}

/* ─── Helpers ─────────────────────────────────────────── */
function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const AVATAR_COLORS = [
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
];
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length];

function initials(id: number): string {
  return `O${id}`;
}

/* ─── Page ────────────────────────────────────────────── */
export default function LandVerificationsPage() {
  const { user } = useAuth();
  const [lands, setLands] = useState<LandListing[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_lands: 0,
    pending_verification: 0,
    verified: 0,
    flagged: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>(
    {},
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "verified" | "flagged"
  >("all");
  const [flagModalId, setFlagModalId] = useState<number | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Debug: Log user authentication
  useEffect(() => {
    console.log("=== USER AUTH DEBUG ===");
    console.log("User:", user);
    console.log("Is Authenticated:", !!user);
    console.log("User Role:", user?.role);
  }, [user]);

  /* ── Fetch data ─────────────────────────────────────── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("=== ADMIN DATA FETCH ===");
      const [landsRes, statsRes] = await Promise.all([
        landsApi.adminAllLands(),
        landsApi.adminStats(),
      ]);
      console.log("Lands response:", landsRes.data);
      console.log("Stats response:", statsRes.data);
      setLands(landsRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      console.error("=== ADMIN DATA FETCH ERROR ===");
      console.error("Error:", err);
      console.error("Response:", err?.response);
      console.error("Status:", err?.response?.status);
      console.error("Data:", err?.response?.data);
      setToast({
        msg: `Failed to load data: ${err?.response?.data?.detail || err.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Toast helper ───────────────────────────────────── */
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ── Verify ─────────────────────────────────────────── */
  const handleVerify = async (id: number) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      await landsApi.verifyLand(id);
      setLands((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
              ...l,
              is_verified: true,
              is_flagged: false,
              flag_reason: undefined,
              status: 'Vacant', // Update status to Vacant
            }
            : l,
        ),
      );
      setStats((s) => ({
        ...s,
        pending_verification: Math.max(0, s.pending_verification - 1),
        verified: s.verified + 1,
      }));
      showToast("Land verified successfully ✓ — Status updated to Vacant");
    } catch {
      showToast("Failed to verify land.", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  /* ── Flag ───────────────────────────────────────────── */
  const handleFlag = async (id: number, reason: string) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    setFlagModalId(null);
    try {
      await landsApi.flagLand(id, reason);
      setLands((prev) =>
        prev.map((l) =>
          l.id === id
            ? {
              ...l,
              is_verified: false,
              is_flagged: true,
              flag_reason: reason,
            }
            : l,
        ),
      );
      setStats((s) => ({
        ...s,
        pending_verification: Math.max(0, s.pending_verification - 1),
        flagged: s.flagged + 1,
      }));
      showToast("Land flagged for correction.");
    } catch {
      showToast("Failed to flag land.", "error");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
      setFlagReason("");
    }
  };

  /* ── Copy title deed ────────────────────────────────── */
  const copyDeed = (id: number, deed: string) => {
    navigator.clipboard.writeText(deed);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  /* ── Filter ─────────────────────────────────────────── */
  const filtered = lands.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.title.toLowerCase().includes(q) ||
      (l.title_deed_number ?? "").toLowerCase().includes(q) ||
      String(l.id).includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "pending" && !l.is_verified && !l.is_flagged) ||
      (filter === "verified" && l.is_verified) ||
      (filter === "flagged" && l.is_flagged);
    return matchSearch && matchFilter;
  });

  const statCards = [
    {
      label: "Pending Verification",
      value: stats.pending_verification,
      sub: "Requires manual check",
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      label: "Verified",
      value: stats.verified,
      sub: "Approved manually",
      icon: ShieldCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Flagged",
      value: stats.flagged,
      sub: "Issues requiring correction",
      icon: AlertTriangle,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  const getRowStatus = (l: LandListing) => {
    if (l.is_flagged)
      return {
        label: "Flagged",
        style: "bg-red-100 text-red-800 border-red-200",
        dot: "bg-red-500",
      };
    if (l.is_verified)
      return {
        label: "Verified",
        style: "bg-green-100 text-green-800 border-green-200",
        dot: "bg-green-500",
      };
    return {
      label: "Pending",
      style: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-sm font-semibold text-white transition-all ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Flag Reason Modal */}
      {flagModalId !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h4 className="font-bold text-lg text-earth mb-2">
              Flag this Listing
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              Provide a reason. The owner will see this message.
            </p>
            <textarea
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none mb-4"
              placeholder="e.g. Title deed number does not match land registry…"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setFlagModalId(null);
                  setFlagReason("");
                }}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFlag(flagModalId, flagReason)}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition"
              >
                Confirm Flag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <div>
          <h2
            className="text-2xl font-bold tracking-tight text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Land Verifications
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manually cross-reference Title Deed Numbers with the national land
            registry to approve or flag listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or deed…"
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-56 shadow-sm"
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h3 className="text-earth text-[10px] font-bold uppercase tracking-widest mb-1">
                    {card.label}
                  </h3>
                  <span className="text-3xl font-bold text-gray-800">
                    {loading ? (
                      <span className="inline-block w-10 h-8 bg-gray-200 rounded animate-pulse" />
                    ) : (
                      card.value
                    )}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </div>
                <span
                  className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </span>
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["all", "pending", "verified", "flagged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${filter === f
                  ? "bg-sidebar-bg text-white border-sidebar-bg"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="text-base font-bold text-earth font-serif">
              Title Deed Verification Queue
            </h3>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-sidebar-bg bg-white border border-gray-200 rounded-md shadow-sm transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-sidebar-bg border-r-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400">Loading land queue…</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                No land listings match your search or filter.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                      Land / Owner
                    </th>
                    <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                      Plot ID
                    </th>
                    <th className="py-4 px-5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50/30 border-x border-gray-100">
                      Title Deed Number
                    </th>
                    <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                      Submitted
                    </th>
                    <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                      Status
                    </th>
                    <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {filtered.map((land) => {
                    const rowStatus = getRowStatus(land);
                    const color = avatarColor(land.owner);
                    const isActing = actionLoading[land.id];

                    return (
                      <tr
                        key={land.id}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Land title + owner */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${color.bg} ${color.text} flex items-center justify-center font-bold text-xs border border-gray-200`}
                            >
                              {initials(land.owner)}
                            </div>
                            <div>
                              <span className="block font-bold text-gray-800 max-w-40 truncate">
                                {land.title}
                              </span>
                              <span className="text-xs text-gray-500">
                                {land.total_area} Acres
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Plot ID */}
                        <td className="py-4 px-5">
                          <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                            PL-{land.id}
                          </span>
                        </td>

                        {/* Title Deed — click to copy */}
                        <td className="py-4 px-5 bg-emerald-50/10 border-x border-gray-50 group-hover:bg-emerald-50/20">
                          <div
                            className="flex items-center gap-2 cursor-pointer group/deed"
                            onClick={() =>
                              copyDeed(land.id, land.title_deed_number ?? "")
                            }
                            title="Click to copy"
                          >
                            <span className="font-bold text-base text-sidebar-bg tracking-wide">
                              {land.title_deed_number || "—"}
                            </span>
                            {copiedId === land.id ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-emerald-600 opacity-40 group-hover/deed:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </td>

                        {/* Submitted */}
                        <td className="py-4 px-5 text-gray-500 text-xs whitespace-nowrap">
                          {timeAgo(land.created_at)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${rowStatus.style} w-fit`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${rowStatus.dot}`}
                              />
                              {rowStatus.label}
                            </span>
                            {land.is_flagged && land.flag_reason && (
                              <span
                                className="text-[10px] text-red-500 max-w-40 truncate"
                                title={land.flag_reason}
                              >
                                {land.flag_reason}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          {!land.is_verified ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  setFlagModalId(land.id);
                                  setFlagReason("");
                                }}
                                disabled={isActing}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg border border-earth text-earth hover:bg-earth hover:text-white transition shadow-sm w-32 disabled:opacity-50"
                              >
                                {isActing ? (
                                  <span className="w-3 h-3 border-2 border-earth border-r-transparent rounded-full animate-spin" />
                                ) : (
                                  "Flag"
                                )}
                              </button>
                              <button
                                onClick={() => handleVerify(land.id)}
                                disabled={isActing}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-sidebar-bg transition shadow-sm w-32 disabled:opacity-50"
                              >
                                {isActing ? (
                                  <span className="w-3 h-3 border-2 border-white border-r-transparent rounded-full animate-spin" />
                                ) : (
                                  "Verify Property"
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1 text-emerald-600 text-xs font-semibold">
                              <ShieldCheck className="w-4 h-4" />
                              Verified
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-bold text-gray-700">{filtered.length}</span>{" "}
              of <span className="font-bold text-gray-700">{lands.length}</span>{" "}
              listings
            </p>
            <div className="flex gap-2">
              <button
                disabled
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-300 cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-earth transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-sidebar-bg rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <ShieldCheck className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h4 className="font-serif text-lg font-bold mb-2">
                Manual Verification Protocol
              </h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-xs font-medium text-yellow-200 uppercase tracking-wider">
                  Review Required
                </span>
              </div>
              <ul className="text-sm text-green-100/80 mb-4 space-y-2 list-disc pl-4 max-w-lg">
                <li>
                  Cross-check the <strong>Title Deed Number</strong> with the
                  physical land registry or government portal.
                </li>
                <li>
                  Verify the <strong>Owner</strong> matches the deed holder
                  exactly.
                </li>
                <li>
                  Confirm the <strong>Plot ID</strong> corresponds to the
                  correct region.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h4 className="font-bold text-earth mb-4 text-sm uppercase tracking-widest">
              Quick Filters
            </h4>
            <div className="space-y-3">
              {(["pending", "verified", "flagged"] as const).map((f, i) => {
                const labels = [
                  "Show Pending Only",
                  "Verified Only",
                  "Flagged for Correction",
                ];
                return (
                  <label
                    key={f}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={filter === f}
                      onChange={() => setFilter(filter === f ? "all" : f)}
                      className="rounded border-gray-300 text-sidebar-bg focus:ring-sidebar-bg"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {labels[i]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
