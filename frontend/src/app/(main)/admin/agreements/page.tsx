"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminApi } from "@/lib/services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface AgreementRow {
  id: number;
  ref: string;
  created: string | null;
  lessee_name: string;
  lessee_initials: string;
  lessor_name: string;
  lessor_initials: string;
  land_title: string;
  land_area: number;
  land_location: string;
  land_ref: string;
  start_date: string | null;
  end_date: string | null;
  duration: string;
  date_range: string;
  progress: number;
  status: string;
  status_label: string;
  status_note: string;
  status_bg: string;
  status_dot: string;
  lessee_signed: boolean;
  owner_signed: boolean;
  can_download: boolean;
}

interface Counts {
  all: number;
  pending_signature: number;
  active: number;
  completed: number;
  terminated: number;
}

interface ApiResponse {
  counts: Counts;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: AgreementRow[];
}

// ── Tab definitions ────────────────────────────────────────────────────────────

const TAB_STATUSES = ["all", "pending_signature", "active", "completed", "terminated"] as const;
type TabStatus = typeof TAB_STATUSES[number];

const TAB_LABELS: Record<TabStatus, string> = {
  all: "All Contracts",
  pending_signature: "Pending Signatures",
  active: "Active",
  completed: "Completed",
  terminated: "Terminated",
};

// ── Avatar colours cycle ───────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-[#0f392b]", "bg-blue-600", "bg-purple-600", "bg-teal-600",
  "bg-rose-600", "bg-orange-500", "bg-indigo-600", "bg-[#5D4037]",
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AgreementsPage() {
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await adminApi.adminAgreements({
        status: activeTab,
        search: debouncedSearch || undefined,
        page,
        page_size: 20,
      });
      setData(res);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to load agreements. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const counts = data?.counts;
  const agreements = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Agreements & Contracts Oversight"
        subtitle="Monitor, audit, and manage all active lease agreements between parties."
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, land, location..."
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-56 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 px-6 pt-6 border-b border-gray-100 pb-4">
            {TAB_STATUSES.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold pb-1 px-1 transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-sidebar-bg border-sidebar-bg"
                    : "text-gray-500 border-transparent hover:text-earth"
                }`}
              >
                {TAB_LABELS[tab]}{" "}
                <span className="text-xs text-gray-400">
                  ({counts ? (tab === "all" ? counts.all : counts[tab as keyof Counts] ?? 0) : "—"})
                </span>
              </button>
            ))}
          </div>

          <div className="overflow-x-auto min-h-100">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-sidebar-bg" />
              </div>
            ) : agreements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <FileText className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No agreements found</p>
                <p className="text-xs mt-1">
                  {debouncedSearch ? "Try a different search term." : "No contracts have been created yet."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                    {[
                      "Agreement ID",
                      "Parties (Lessee & Lessor)",
                      "Land Plot",
                      "Duration",
                      "Signature Status",
                      "Actions",
                    ].map((h, i) => (
                      <th key={h} className={`py-3 px-5 ${i === 5 ? "text-right" : ""}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {agreements.map((c) => (
                    <tr key={c.id} className="group hover:bg-gray-50/40 transition-colors text-sm">
                      {/* ID */}
                      <td className="py-4 px-5 align-top">
                        <span className="font-mono text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded text-xs">
                          {c.ref}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">Created: {c.created ?? "—"}</p>
                      </td>

                      {/* Parties */}
                      <td className="py-4 px-5 align-top">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full ${colorFor(c.lessee_name)} text-white flex items-center justify-center font-bold text-[10px]`}
                            >
                              {c.lessee_initials}
                            </div>
                            <div>
                              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                                Lessee
                              </span>
                              <span className="font-semibold text-gray-700 text-xs">{c.lessee_name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full ${colorFor(c.lessor_name + "x")} text-white flex items-center justify-center font-bold text-[10px]`}
                            >
                              {c.lessor_initials}
                            </div>
                            <div>
                              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                                Lessor
                              </span>
                              <span className="font-semibold text-gray-700 text-xs">{c.lessor_name}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Land Plot */}
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-sidebar-bg mt-0.5 shrink-0" />
                          <div>
                            <p className="font-bold text-earth text-xs">
                              {c.land_title} ({c.land_area} Acres)
                            </p>
                            <p className="text-xs text-gray-500">{c.land_location}</p>
                            {c.land_ref && (
                              <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{c.land_ref}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-5 align-top">
                        <p className="font-semibold text-gray-700 text-sm">{c.duration}</p>
                        <p className="text-xs text-gray-500 mt-1">{c.date_range}</p>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${c.progress}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">{c.progress}% elapsed</p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 align-top">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-bold ${c.status_bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status_dot}`} />
                          {c.status_label}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-2 max-w-40">{c.status_note}</p>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 align-top text-right">
                        <div className="flex flex-col items-end gap-2">
                          <button
                            disabled={!c.can_download}
                            className={`flex items-center gap-2 px-3 py-1.5 bg-sidebar-bg text-white text-xs font-bold rounded-lg shadow-sm transition ${
                              c.can_download ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Download PDF
                          </button>
                          {!c.lessee_signed && c.status === "pending_signature" && (
                            <button className="text-[10px] text-primary hover:underline font-bold">
                              Resend Notification
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && data && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-800">
                  {agreements.length > 0
                    ? `${(page - 1) * 20 + 1}–${(page - 1) * 20 + agreements.length}`
                    : "0"}
                </span>{" "}
                of <span className="font-bold text-gray-800">{data.total}</span> contracts
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition ${
                        n === page
                          ? "bg-sidebar-bg text-white shadow"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">...</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

