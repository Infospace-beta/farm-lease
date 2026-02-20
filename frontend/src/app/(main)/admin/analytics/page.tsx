"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  FileText,
  Leaf,
  Download,
  Bell,
} from "lucide-react";
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
  Legend,
} from "recharts";

const revenueData = [
  { month: "May", fees: 280000, escrow: 1800000 },
  { month: "Jun", fees: 320000, escrow: 2200000 },
  { month: "Jul", fees: 290000, escrow: 1950000 },
  { month: "Aug", fees: 410000, escrow: 2600000 },
  { month: "Sep", fees: 390000, escrow: 2400000 },
  { month: "Oct", fees: 520000, escrow: 3100000 },
  { month: "Nov", fees: 480000, escrow: 2900000 },
];

const userData = [
  { month: "May", farmers: 720, landowners: 280 },
  { month: "Jun", farmers: 810, landowners: 310 },
  { month: "Jul", farmers: 870, landowners: 340 },
  { month: "Aug", farmers: 950, landowners: 380 },
  { month: "Sep", farmers: 1020, landowners: 410 },
  { month: "Oct", farmers: 1100, landowners: 440 },
  { month: "Nov", farmers: 1240, landowners: 460 },
];

const cropData = [
  { name: "Maize", value: 35, color: "#0f392b" },
  { name: "Wheat", value: 25, color: "#13ec80" },
  { name: "Tea", value: 20, color: "#5D4037" },
  { name: "Other", value: 20, color: "#e5e7eb" },
];

const regions = [
  { name: "Kiambu County", share: 32, leases: 274, color: "bg-[#0f392b]" },
  { name: "Nakuru County", share: 24, leases: 205, color: "bg-[#13ec80]" },
  { name: "Uasin Gishu", share: 15, leases: 128, color: "bg-[#5D4037]" },
  { name: "Muranga County", share: 12, leases: 103, color: "bg-blue-500" },
  { name: "Trans Nzoia", share: 10, leases: 86, color: "bg-purple-500" },
  { name: "Other Regions", share: 7, leases: 60, color: "bg-gray-300" },
];

const statCards = [
  {
    label: "Total Revenue",
    value: "Ksh 4.2M",
    change: "+18%",
    up: true,
    icon: <TrendingUp className="w-5 h-5" />,
    iconBg: "bg-emerald-50 text-emerald-700",
    note: "Platform fees + subscriptions",
  },
  {
    label: "New Users",
    value: "1,240",
    change: "+12%",
    up: true,
    icon: <Users className="w-5 h-5" />,
    iconBg: "bg-blue-50 text-blue-600",
    note: "This month vs. last month",
  },
  {
    label: "Active Leases",
    value: "856",
    change: "+7%",
    up: true,
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-amber-50 text-amber-700",
    note: "Verified & in-progress",
  },
  {
    label: "Total Yield",
    value: "12.5k Tons",
    change: "+5%",
    up: true,
    icon: <Leaf className="w-5 h-5" />,
    iconBg: "bg-[#0f392b]/10 text-[#0f392b]",
    note: "Combined platform yield",
  },
];

const fmtK = (v: number) =>
  v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}k`;

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 7 Months");
  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
            Analytics &amp; Reports
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-lg">
            Platform-wide performance metrics, revenue trends, and regional
            activity insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-gray-600 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20">
            <option>Last 7 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg text-white rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

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
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}
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
        {/* Revenue Trends — spans 2 cols */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-earth font-bold text-base font-serif">
                Revenue Trends
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Monthly platform fees vs escrow volume
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-sidebar-bg rounded-full" />
                Platform Fees
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-0.5 rounded-full"
                  style={{
                    background: "#13ec80",
                    borderTop: "2px dashed #13ec80",
                  }}
                />
                Escrow Volume
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={revenueData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f392b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0f392b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="escrow" x1="0" y1="0" x2="0" y2="1">
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
                formatter={((v: number) => [`Ksh ${fmtK(v)}`, ""]) as any}
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
                name="Platform Fees"
              />
              <Area
                type="monotone"
                dataKey="escrow"
                stroke="#13ec80"
                strokeWidth={2}
                strokeDasharray="5 4"
                fill="url(#escrow)"
                name="Escrow Volume"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Crops Pie */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="mb-4">
              <h3 className="text-earth font-bold text-base font-serif">
              Top Performing Crops
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Distribution across leased land
            </p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={cropData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {cropData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={((v: number) => [`${v}%`, ""]) as any}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {cropData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
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
                <span className="w-3 h-3 rounded bg-earth" />
                Farmers
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sidebar-bg" />
                Landowners
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={userData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              barCategoryGap="30%"
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
              <Bar dataKey="farmers" fill="#5D4037" radius={[4, 4, 0, 0]} name="Farmers" />
              <Bar dataKey="landowners" fill="#0f392b" radius={[4, 4, 0, 0]} name="Landowners" />
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
              Top hotspots by lease count
            </p>
          </div>
          <div className="space-y-4">
            {regions.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-gray-700">
                    {r.name}
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-800">
                      {r.share}%
                    </span>
                    <span className="text-[10px] text-gray-400 ml-1">
                      ({r.leases} leases)
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
        </div>
      </div>
    </div>
  );
}
