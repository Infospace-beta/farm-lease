"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  MapPin,
  Download,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminApi } from "@/lib/services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────────

interface MonthlyPoint {
  month: string;
  fees: number;
  escrow: number;
}

interface UserPoint {
  month: string;
  farmers: number;
  landowners: number;
}

interface LandStatusSlice {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface RegionRow {
  name: string;
  share: number;
  leases: number;
  color: string;
}

interface AnalyticsData {
  total_revenue: number;
  revenue_change: string;
  revenue_up: boolean;
  new_users_this_month: number;
  user_change: string;
  user_up: boolean;
  active_leases: number;
  lease_change: string;
  lease_up: boolean;
  total_land_area: number;
  land_area_change: string;
  land_area_up: boolean;
  revenue_data: MonthlyPoint[];
  land_status_data: LandStatusSlice[];
  user_data: UserPoint[];
  regions: RegionRow[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const fmtK = (v: number) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `${(v / 1_000).toFixed(0)}k`
    : String(v);

const fmtKsh = (v: number) => `Ksh ${fmtK(v)}`;

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await adminApi.adminAnalytics();
        setData(res);
      } catch (err: unknown) {
        const e = err as { response?: { status?: number } };
        setError(
          e?.response?.status === 403
            ? "Access denied. Admin privileges required."
            : "Failed to load analytics. Please try again."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statCards = data
    ? [
        {
          label: "Total Revenue",
          value: fmtKsh(data.total_revenue),
          change: data.revenue_change,
          up: data.revenue_up,
          icon: <TrendingUp className="w-5 h-5" />,
          iconBg: "bg-emerald-50 text-emerald-700",
          note: "Completed transactions (all time)",
        },
        {
          label: "New Users",
          value: data.new_users_this_month.toLocaleString(),
          change: data.user_change,
          up: data.user_up,
          icon: <Users className="w-5 h-5" />,
          iconBg: "bg-blue-50 text-blue-600",
          note: "This month vs. last month",
        },
        {
          label: "Active Leases",
          value: data.active_leases.toLocaleString(),
          change: data.lease_change,
          up: data.lease_up,
          icon: <FileText className="w-5 h-5" />,
          iconBg: "bg-amber-50 text-amber-700",
          note: "Currently active agreements",
        },
        {
          label: "Total Land Area",
          value: `${fmtK(data.total_land_area)} Acres`,
          change: data.land_area_change,
          up: data.land_area_up,
          icon: <MapPin className="w-5 h-5" />,
          iconBg: "bg-sidebar-bg/10 text-sidebar-bg",
          note: "All registered land listings",
        },
      ]
    : [];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Analytics & Reports"
        subtitle="Platform-wide performance metrics, revenue trends, and regional activity insights."
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg text-white rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-sidebar-bg" />
          </div>
        ) : data ? (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}
                    >
                      {s.icon}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        s.up
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {s.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-bold uppercase tracking-widest">
                    {s.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.note}</p>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Revenue Trends */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-earth font-bold text-base font-serif">
                      Revenue Trends
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Monthly completed payments vs escrow volume
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-sidebar-bg rounded-full inline-block" />
                      Payments
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-0.5 rounded-full inline-block"
                        style={{ background: "#13ec80" }}
                      />
                      Escrow
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart
                    data={data.revenue_data}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0f392b" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0f392b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="escrowGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#13ec80" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#13ec80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={fmtK}
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      width={45}
                    />
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={((v: number) => [fmtKsh(v), ""]) as any}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="fees"
                      stroke="#0f392b"
                      strokeWidth={2}
                      fill="url(#feeGrad)"
                      name="Payments"
                    />
                    <Area
                      type="monotone"
                      dataKey="escrow"
                      stroke="#13ec80"
                      strokeWidth={2}
                      strokeDasharray="5 4"
                      fill="url(#escrowGrad)"
                      name="Escrow"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Land Status Pie */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-earth font-bold text-base font-serif">
                    Land Status
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Distribution of all land listings
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={data.land_status_data}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.land_status_data.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={((v: number, _: string, props: { payload: LandStatusSlice }) => [
                        `${v}% (${props.payload.count} plots)`,
                        "",
                      ]) as any}
                      contentStyle={{ fontSize: 11, borderRadius: 8 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {data.land_status_data.map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: c.color }}
                        />
                        <span className="text-xs text-gray-600">{c.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-800">
                        {c.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Growth Bar Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-earth font-bold text-base font-serif">
                      User Growth
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Monthly new registrations by role
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-earth inline-block" />
                      Farmers
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-sidebar-bg inline-block" />
                      Landowners
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.user_data}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    barCategoryGap="30%"
                    barGap={4}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                    <Bar
                      dataKey="farmers"
                      fill="#5D4037"
                      radius={[4, 4, 0, 0]}
                      name="Farmers"
                    />
                    <Bar
                      dataKey="landowners"
                      fill="#0f392b"
                      radius={[4, 4, 0, 0]}
                      name="Landowners"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Activity */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="mb-5">
                  <h3 className="text-earth font-bold text-base font-serif">
                    Regional Activity
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Top locations by lease count
                  </p>
                </div>
                {data.regions.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-8">
                    No regional data yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.regions.map((r) => (
                      <div key={r.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-gray-700 truncate max-w-32.5">
                            {r.name}
                          </span>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-gray-800">
                              {r.share}%
                            </span>
                            <span className="text-[10px] text-gray-400 ml-1">
                              ({r.leases})
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${r.color} transition-all duration-700`}
                            style={{ width: `${r.share}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
