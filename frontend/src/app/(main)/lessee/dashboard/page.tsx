"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

interface DashboardStats {
  total_leased_acres: number;
  monthly_expenditure: number;
  avg_soil_health: number;
  active_leases: number;
}

interface LeaseCard {
  id: number;
  land_title: string;
  land_location?: string;
  land_area?: number;
  land_soil?: string;
  owner_name: string;
  next_payment?: number;
  status: string;
  end_date?: string;
  image?: string;
}

export default function LesseeDashboard() {
  const [showReport, setShowReport] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leases, setLeases] = useState<LeaseCard[]>([]);
  const [activities, setActivities] = useState<{ id: number; title: string; body: string; time: string; type: string }[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setStatsLoading(true);
        const [dashRes, leasesRes, notifRes] = await Promise.all([
          lesseeApi.dashboard().catch(() => ({ data: null })),
          lesseeApi.myLeases().catch(() => ({ data: [] })),
          lesseeApi.notifications({ page: 1 }).catch(() => ({ data: { results: [] } })),
        ]);

        if (dashRes.data) {
          setStats({
            total_leased_acres: dashRes.data.total_leased_acres ?? 0,
            monthly_expenditure: dashRes.data.monthly_expenditure ?? 0,
            avg_soil_health: dashRes.data.avg_soil_health ?? 0,
            active_leases: dashRes.data.active_leases ?? 0,
          });
        }

        const leasesData = Array.isArray(leasesRes.data)
          ? leasesRes.data
          : (leasesRes.data?.results ?? []);
        setLeases(
          leasesData.slice(0, 4).map((l: Record<string, unknown>) => {
            const land = (l.land ?? {}) as Record<string, unknown>;
            return {
              id: l.id as number,
              land_title: (l.land_title ?? land.title ?? "Land Plot") as string,
              land_location: (l.land_location ?? land.location ?? "") as string,
              land_area: l.land_area ? Number(l.land_area) : undefined,
              land_soil: (l.land_soil ?? land.soil_type ?? "") as string,
              owner_name: (l.owner_name ?? land.owner_name ?? "Land Owner") as string,
              next_payment: l.next_payment_amount ? Number(l.next_payment_amount) : undefined,
              status: (l.status ?? "Active") as string,
              end_date: (l.end_date ?? "") as string,
            };
          })
        );

        const notifData = Array.isArray(notifRes.data)
          ? notifRes.data
          : (notifRes.data?.results ?? []);
        setActivities(
          notifData.slice(0, 4).map((n: Record<string, unknown>) => ({
            id: n.id as number,
            title: (n.title ?? "Notification") as string,
            body: (n.message ?? n.body ?? "") as string,
            time: (n.created_at ?? n.time ?? "") as string,
            type: (n.category ?? n.type ?? "info") as string,
          }))
        );
      } catch {
        // fail silently — UI shows fallback
      } finally {
        setStatsLoading(false);
      }
    };
    fetchDashboard();
  }, []);
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="Dashboard"
        subtitle="Monitor your lease portfolio, manage agreements and track crop yield predictions."
      >
        <button
          onClick={() => setShowReport(true)}
          className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm"
        >
          <span className="material-icons-round text-lg">description</span>
          <span className="font-medium text-sm">Report</span>
        </button>
        <Link
          href="/lessee/browse"
          className="flex px-5 py-2.5 bg-[#0f392b] text-white rounded-lg items-center gap-2 hover:bg-opacity-90 transition shadow-lg"
        >
          <span className="material-icons-round text-[#13ec80] text-sm">
            search
          </span>
          <span className="font-medium text-sm">Browse Land</span>
        </Link>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 w-full pb-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8 flex flex-col min-w-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Leased Acres */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition group">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Total Leased Acres
                </h3>
                {statsLoading ? (
                  <div className="h-9 w-28 bg-gray-100 animate-pulse rounded mb-4" />
                ) : (
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gray-800">{stats?.total_leased_acres ?? 0}</span>
                    <span className="text-sm text-gray-400">Acres</span>
                  </div>
                )}
                <div className="flex items-end justify-between">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded flex items-center gap-1">
                    <span className="material-icons-round text-[10px]">trending_up</span> +12%
                  </span>
                  <svg className="w-24 h-8 text-[#047857] stroke-current fill-none" preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,25 C10,25 20,10 30,15 C40,20 50,5 60,10 C70,15 80,5 100,0" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">vs last season</p>
              </div>

              {/* Monthly Expenditure */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition group">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Monthly Expenditure
                </h3>
                {statsLoading ? (
                  <div className="h-9 w-32 bg-gray-100 animate-pulse rounded mb-4" />
                ) : (
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gray-800">
                      {stats?.monthly_expenditure
                        ? `Ksh ${stats.monthly_expenditure >= 1000 ? `${Math.round(stats.monthly_expenditure / 1000)}k` : stats.monthly_expenditure.toLocaleString()}`
                        : "Ksh 0"}
                    </span>
                  </div>
                )}
                <div className="flex items-end justify-between">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded flex items-center gap-1">
                    <span className="material-icons-round text-[10px]">trending_down</span> -5%
                  </span>
                  <svg className="w-24 h-8 text-[#047857] stroke-current fill-none" preserveAspectRatio="none" viewBox="0 0 100 30">
                    <path d="M0,15 C20,25 40,5 60,15 C80,25 100,10" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">vs last month</p>
              </div>

              {/* Avg Soil Health */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-md transition group">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Avg Soil Health
                </h3>
                {statsLoading ? (
                  <div className="h-9 w-20 bg-gray-100 animate-pulse rounded mb-4" />
                ) : (
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-gray-800">{stats?.avg_soil_health ?? 0}%</span>
                  </div>
                )}
                <div className="flex items-end justify-between">
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded flex items-center gap-1">
                    <span className="material-icons-round text-[10px]">remove</span> 0.0%
                  </span>
                  <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#047857] h-full rounded-full" style={{ width: `${stats?.avg_soil_health ?? 0}%` }}></div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">vs last test</p>
              </div>
            </div>

            {/* My Lease Portfolio */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <h3
                    className="text-xl font-bold text-[#5D4037]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    My Lease Portfolio
                  </h3>
                  <a
                    href="#"
                    className="text-xs font-bold text-[#0f392b] hover:underline flex items-center gap-1"
                  >
                    View All My Leases{" "}
                    <span className="material-icons-round text-sm">
                      arrow_forward
                    </span>
                  </a>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-[#0f392b] hover:bg-gray-100 rounded-lg transition">
                    <span className="material-icons-round">grid_view</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-[#0f392b] hover:bg-gray-100 rounded-lg transition">
                    <span className="material-icons-round">list</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statsLoading ? (
                  [0, 1].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] animate-pulse">
                      <div className="h-48 w-full bg-gray-100 rounded-xl mb-4" />
                      <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded" />
                    </div>
                  ))
                ) : leases.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center">
                    <span className="material-icons-round text-5xl text-gray-200 mb-3">landscape</span>
                    <p className="text-gray-400 font-medium">No active leases yet</p>
                    <Link href="/lessee/browse" className="mt-4 px-5 py-2 bg-[#0f392b] text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition">
                      Browse Land
                    </Link>
                  </div>
                ) : (
                  leases.map((lease) => {
                    const isActive = lease.status?.toLowerCase() === "active";
                    const isPending = lease.status?.toLowerCase() === "pending";
                    return (
                      <div key={lease.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col hover:shadow-lg transition cursor-pointer">
                        <div className="relative h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden mb-4 group">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className={`w-32 h-24 ${isActive ? "bg-[#13ec80]/40 border-[#13ec80]/60" : "bg-[#5D4037]/40 border-[#5D4037]/60"} border-2 backdrop-blur-sm shadow-lg transform group-hover:scale-105 transition-transform duration-500`}
                              style={{ clipPath: "polygon(20% 0%, 100% 10%, 80% 100%, 0% 90%)" }}
                            ></div>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className={`${isActive ? "bg-[#13ec80] text-[#0f392b]" : isPending ? "bg-[#5D4037] text-white" : "bg-gray-500 text-white"} text-[10px] font-bold px-2 py-1 rounded-full shadow-md uppercase tracking-wide`}>
                              {lease.status}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                            <p className="font-bold text-lg">{lease.land_title}</p>
                            <p className="text-xs opacity-90">
                              {lease.land_area ? `${lease.land_area} Acres` : ""}{lease.land_soil ? ` · ${lease.land_soil}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-end mt-auto px-1">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-200">
                              <span className="material-icons-round text-sm text-gray-500">person</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Land Owner</p>
                              <p className="text-sm font-semibold text-gray-700">{lease.owner_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">{isActive ? "Next Payment" : "Offer"}</p>
                            <p className={`text-sm font-bold ${isActive ? "text-[#0f392b]" : "text-[#5D4037]"}`}>
                              {lease.next_payment ? `Ksh ${lease.next_payment.toLocaleString()}` : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center px-1">
                          <span className={`text-xs ${isPending ? "text-orange-500 font-medium" : "text-gray-400"}`}>
                            {isPending ? "Action Required" : lease.end_date ? `Ends: ${new Date(lease.end_date).toLocaleDateString("en-KE", { month: "short", year: "numeric" })}` : "—"}
                          </span>
                          {isPending ? (
                            <button className="px-3 py-1 bg-[#0f392b] text-white text-xs font-bold rounded-lg hover:bg-opacity-90">Review</button>
                          ) : (
                            <button className="text-xs font-bold text-[#0f392b] hover:underline">Manage Lease</button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Inputs Quick-Shop */}
            <div className="bg-white border border-gray-200 shadow-soft rounded-2xl px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="font-bold text-lg text-[#5D4037]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Inputs Quick-Shop
                </h3>
                <a
                  href="#"
                  className="text-xs font-bold text-[#0f392b] hover:underline flex items-center gap-1"
                >
                  View Full Shop{" "}
                  <span className="material-icons-round text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
              <div
                className="flex gap-4 overflow-x-auto pb-2"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {[
                  {
                    name: "DAP Fertilizer - 50kg",
                    desc: "Planting essentials",
                    price: "Ksh 3,500",
                    icon: "compost",
                  },
                  {
                    name: "Hybrid Maize Seeds",
                    desc: "Drought resistant",
                    price: "Ksh 2,000",
                    icon: "grass",
                  },
                  {
                    name: "Pesticide Ultra",
                    desc: "500ml concentrate",
                    price: "Ksh 1,200",
                    icon: "pest_control",
                  },
                  {
                    name: "Drip Irrigation Kit",
                    desc: "Quarter acre kit",
                    price: "Ksh 15,000",
                    icon: "water_drop",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex-none w-64 p-3 border border-gray-100 rounded-xl hover:border-[#13ec80]/30 transition-colors group bg-gray-50/50"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-white shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                        <span className="material-icons-round text-3xl text-gray-300">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate group-hover:text-[#0f392b] transition">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 mb-2">
                          {item.desc}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm text-[#5D4037]">
                            {item.price}
                          </span>
                          <button className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-[#0f392b] hover:text-white hover:border-[#0f392b] transition shadow-sm">
                            <span className="material-icons-round text-sm">
                              add
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Activity Pulse */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] h-full">
              <div className="flex items-center gap-2 mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f392b] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0f392b]"></span>
                </span>
                <h3
                  className="font-bold text-lg text-[#5D4037]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Activity Pulse
                </h3>
              </div>
              <div className="relative border-l border-gray-200 ml-1.5 space-y-8 pb-2">
                {statsLoading ? (
                  [0, 1, 2].map((i) => (
                    <div key={i} className="ml-6 animate-pulse">
                      <div className="h-3 w-16 bg-gray-100 rounded mb-2" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded mb-1" />
                      <div className="h-3 w-full bg-gray-100 rounded" />
                    </div>
                  ))
                ) : activities.length === 0 ? (
                  <p className="ml-6 text-sm text-gray-400 py-4">No recent activity</p>
                ) : (
                  activities.map((act, i) => {
                    const dotColors = ["bg-[#0f392b]", "bg-[#5D4037]", "bg-blue-400", "bg-gray-400"];
                    return (
                      <div key={act.id} className="ml-6 relative">
                        <span className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full ${dotColors[i % dotColors.length]} ring-4 ring-white`}></span>
                        <span className="text-xs text-gray-400 block mb-1">
                          {act.time ? new Date(act.time).toLocaleString("en-KE", { dateStyle: "short", timeStyle: "short" }) : ""}
                        </span>
                        <h4 className="text-sm font-bold text-gray-800">{act.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{act.body}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
              <div>
                <h2
                  className="text-2xl font-bold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Portfolio Report
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Generated on {new Date().toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
              <button
                onClick={() => setShowReport(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-6 overflow-y-auto max-h-[65vh]">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Leased Acres", value: `${stats?.total_leased_acres ?? 0} ac`, icon: "landscape", color: "text-[#047857] bg-emerald-50" },
                  { label: "Monthly Expenditure", value: stats?.monthly_expenditure ? `Ksh ${stats.monthly_expenditure.toLocaleString()}` : "Ksh 0", icon: "payments", color: "text-amber-700 bg-amber-50" },
                  { label: "Avg Soil Health", value: `${stats?.avg_soil_health ?? 0}%`, icon: "eco", color: "text-teal-700 bg-teal-50" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <span className={`material-icons-round text-2xl mb-2 block ${item.color.split(" ")[0]}`}>{item.icon}</span>
                    <div className="text-sm font-bold text-gray-800">{item.value}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Active Leases */}
              <div>
                <h3 className="text-sm font-bold text-[#5D4037] uppercase tracking-wider mb-3">Active Leases</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-2">Plot</th>
                      <th className="pb-2">Owner</th>
                      <th className="pb-2">Size</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {leases.length === 0 ? (
                      <tr><td colSpan={5} className="py-4 text-center text-sm text-gray-400">No active leases</td></tr>
                    ) : leases.map((l) => (
                      <tr key={l.id} className="py-2">
                        <td className="py-2.5 font-medium text-gray-800">{l.land_title}</td>
                        <td className="py-2.5 text-gray-500">{l.owner_name}</td>
                        <td className="py-2.5 text-gray-500">{l.land_area ? `${l.land_area} ac` : "—"}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.status?.toLowerCase() === "active" ? "text-[#047857] bg-emerald-50" : "text-amber-700 bg-amber-50"}`}>{l.status}</span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-[#0f392b]">{l.next_payment ? `Ksh ${l.next_payment.toLocaleString()}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AI Crop Recommendations */}
              <div>
                <h3 className="text-sm font-bold text-[#5D4037] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="material-icons-round text-amber-500 text-base">auto_awesome</span>
                  AI Crop Recommendations
                </h3>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-3">Based on your current plots' soil data and regional climate history:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Maize", "Wheat", "Avocado", "Pyrethrum"].map((crop) => (
                      <span key={crop} className="inline-flex items-center bg-[#0f392b] text-emerald-100 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm">
                        <span className="material-icons-round text-[13px] mr-1.5 text-[#13ec80]">auto_awesome</span>
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowReport(false)}
                className="px-5 py-2.5 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => { window.print(); }}
                className="px-5 py-2.5 text-sm bg-[#0f392b] text-white rounded-xl hover:bg-opacity-90 transition shadow-lg flex items-center gap-2"
              >
                <span className="material-icons-round text-sm">download</span>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
