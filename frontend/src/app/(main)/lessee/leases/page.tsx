"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

interface Lease {
  id: number;
  land_title: string;
  land_description?: string;
  land_area?: number;
  lessor_name: string;
  lessor_initials: string;
  start_date: string;
  end_date: string;
  progress: number;
  monthly_rent?: number;
  status: string;
  next_payment?: string;
}

function mapLease(l: Record<string, unknown>): Lease {
  const land = (l.land ?? {}) as Record<string, unknown>;
  const owner = (l.owner ?? {}) as Record<string, unknown>;
  const rawName = ((l.lessor_name ?? l.owner_name ?? `${owner.first_name ?? ""} ${owner.last_name ?? ""}`.trim()) || "Land Owner") as string;
  const name = rawName;
  const initials = name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "LO";
  const start = new Date(l.start_date as string || l.proposed_start_date as string || Date.now());
  const end = new Date(l.end_date as string || l.proposed_end_date as string || Date.now());
  const now = new Date();
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  const progress = total > 0 ? Math.min(100, Math.max(0, Math.round((elapsed / total) * 100))) : 0;
  const fmt = (d: Date) => d.toLocaleDateString("en-KE", { month: "short", year: "numeric" });
  return {
    id: l.id as number,
    land_title: (l.land_title ?? land.title ?? "Land Plot") as string,
    land_description: (l.land_description ?? land.location ?? "") as string,
    land_area: l.land_area ? Number(l.land_area) : (land.total_area ? Number(land.total_area) : undefined),
    lessor_name: name,
    lessor_initials: initials,
    start_date: fmt(start),
    end_date: fmt(end),
    progress,
    monthly_rent: l.monthly_rent ? Number(l.monthly_rent) : (l.proposed_rent ? Number(l.proposed_rent) : undefined),
    status: (l.status ?? "Active") as string,
    next_payment: (l.next_payment_date ?? "") as string,
  };
}

function getStatusColor(status: string) {
  const s = status?.toLowerCase();
  if (s === "active") return "bg-emerald-100 text-emerald-700";
  if (s === "pending") return "bg-amber-100 text-amber-600";
  if (s === "expired" || s === "terminated") return "bg-gray-100 text-gray-500";
  return "bg-blue-100 text-blue-600";
}

export default function LeasesPage() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All Status");

  const fetchLeases = () => {
    setLoading(true);
    setError(null);
    lesseeApi.myLeases()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setLeases(data.map(mapLease));
      })
      .catch(() => setError("Could not load leases. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeases(); }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "All Status") return leases;
    return leases.filter((l) => l.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [leases, statusFilter]);

  const stats = useMemo(() => ({
    totalArea: leases.reduce((s, l) => s + (l.land_area ?? 0), 0),
    active: leases.filter((l) => l.status?.toLowerCase() === "active").length,
    pending: leases.filter((l) => l.status?.toLowerCase() === "pending").length,
    upcomingPayment: leases.find((l) => l.monthly_rent && l.status?.toLowerCase() === "active")?.monthly_rent,
  }), [leases]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="My Leases"
        subtitle="Track and manage all your active land lease agreements"
      >
        <Link
          href="/lessee/leases/new"
          className="flex items-center gap-2 bg-[#0f392b] hover:bg-[#1c4a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-colors"
        >
          <span className="material-icons-round text-lg">add</span>
          New Lease
        </Link>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f8fafc]">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { label: "Total Leased Area", value: loading ? "—" : `${stats.totalArea.toFixed(1)} Acres`, icon: "landscape", color: "text-[#047857]", bg: "bg-emerald-50" },
            { label: "Active Agreements", value: loading ? "—" : `${stats.active}`, icon: "check_circle", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending Actions", value: loading ? "—" : `${stats.pending}`, icon: "pending_actions", color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Upcoming Payments", value: loading ? "—" : stats.upcomingPayment ? `Ksh ${Math.round(stats.upcomingPayment / 1000)}k` : "—", icon: "account_balance_wallet", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <span className={`material-icons-round ${stat.color}`}>{stat.icon}</span>
              </div>
              {loading ? (
                <div className="h-7 w-20 bg-gray-100 animate-pulse rounded mb-1" />
              ) : (
                <div className="text-2xl font-extrabold text-gray-900 mb-0.5">{stat.value}</div>
              )}
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leases Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
              All Leases
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-[#047857]"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Expired</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-base pointer-events-none">expand_more</span>
              </div>
              <button className="text-xs font-medium text-[#047857] flex items-center gap-1 hover:text-emerald-700">
                <span className="material-icons-round text-base">file_download</span>
                Export
              </button>
            </div>
          </div>

          {error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-icons-round text-5xl text-red-200 mb-3">error_outline</span>
              <p className="text-gray-500 font-medium">{error}</p>
              <button onClick={fetchLeases} className="mt-4 px-5 py-2 bg-[#0f392b] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90">Retry</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    {["Plot / Location", "Lessor", "Lease Period", "Progress", "Monthly Rent", "Status", "Next Payment", "Actions"].map((h) => (
                      <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    [0, 1, 2, 3].map((i) => (
                      <tr key={i}>
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-20 text-center text-gray-400">
                        <span className="material-icons-round text-4xl text-gray-200 block mb-2">description</span>
                        No leases found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((lease) => (
                      <tr key={lease.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0f392b]/10 to-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="material-icons-round text-[#047857] text-xl">landscape</span>
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-sm">{lease.land_title}</div>
                              <div className="text-xs text-gray-500">{lease.land_description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#0f392b] text-[#13ec80] flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {lease.lessor_initials}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{lease.lessor_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 font-medium">{lease.start_date}</div>
                          <div className="text-xs text-gray-400">to {lease.end_date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-32">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                              <span>{lease.start_date}</span>
                              <span className="font-bold text-[#047857]">{lease.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-[#047857] to-[#13ec80] rounded-full" style={{ width: `${lease.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 text-sm">
                            {lease.monthly_rent ? `Ksh ${lease.monthly_rent.toLocaleString()}` : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusColor(lease.status)}`}>
                            {lease.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-gray-600">
                            {lease.next_payment ? new Date(lease.next_payment).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[#047857] hover:bg-emerald-50 rounded-lg transition-colors" title="View Agreement">
                              <span className="material-icons-round text-lg">description</span>
                            </button>
                            <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="More Options">
                              <span className="material-icons-round text-lg">more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

