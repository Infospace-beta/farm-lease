"use client";
import { useState } from "react";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";

const PERIOD_LABELS: Record<string, string> = {
  "This Month": "August 2024",
  "Last Month": "July 2024",
  "This Year": "Year 2024",
};

const stats = [
  {
    label: "Total Revenue",
    value: "Ksh 2.4M",
    trend: "+12.5%",
    trendUp: true,
    icon: "trending_up",
    iconBg: "bg-emerald-50",
    iconColor: "text-[#047857]",
  },
  {
    label: "Total Orders",
    value: "856",
    trend: "+5.2%",
    trendUp: true,
    icon: "shopping_basket",
    iconBg: "bg-emerald-50",
    iconColor: "text-[#047857]",
  },
  {
    label: "Avg Order Value",
    value: "Ksh 2,800",
    trend: "-2.1%",
    trendUp: false,
    icon: "receipt",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    label: "Customer Retention",
    value: "68%",
    trend: "+8%",
    trendUp: true,
    icon: "group",
    iconBg: "bg-emerald-50",
    iconColor: "text-[#047857]",
  },
];

const categories = [
  { name: "Fertilizers", value: 850000, color: "#047857", pct: 88 },
  { name: "Seeds", value: 620000, color: "#5D4037", pct: 64 },
  { name: "Pesticides", value: 480000, color: "#0f392b", pct: 50 },
  { name: "Equipment", value: 320000, color: "#6B7280", pct: 33 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("This Month");
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="Sales Analytics"
        subtitle="In-depth analysis of your store performance and sales trends."
      >
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu((v) => !v)}
            className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 shadow-sm text-sm"
          >
            <span className="material-icons-round text-base">
              calendar_today
            </span>
            {period}
            <span className="material-icons-round text-sm text-gray-400">
              expand_more
            </span>
          </button>
          {showPeriodMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[140px] overflow-hidden">
              {["This Month", "Last Month", "This Year"].map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriodMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${period === p ? "font-bold text-[#047857]" : "text-gray-700"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => showToast("Report exported")}
          className="flex px-4 py-2 text-sm bg-[#0f392b] text-white rounded-lg items-center gap-2 hover:opacity-90 shadow-lg shadow-[#0f392b]/20"
        >
          <span className="material-icons-round text-sm">download</span>
          Export Report
        </button>
      </DealerPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-9 h-9 ${s.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <span
                    className={`material-icons-round ${s.iconColor} text-lg`}
                  >
                    {s.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.trendUp ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}
                >
                  {s.trend}
                </span>
              </div>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                {s.label}
              </p>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Trend Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3
                  className="font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Revenue &amp; Orders Trend
                </h3>
                <p className="text-xs text-gray-400">{PERIOD_LABELS[period]}</p>
              </div>
              <div className="flex gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#047857]" />
                  Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#5D4037]" />
                  Orders
                </span>
              </div>
            </div>
            <div className="relative h-56 w-full">
              <svg
                className="w-full h-44"
                preserveAspectRatio="none"
                viewBox="0 0 800 180"
              >
                <defs>
                  <linearGradient
                    id="revGrad"
                    x1="0%"
                    x2="0%"
                    y1="0%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#047857", stopOpacity: 0.15 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#047857", stopOpacity: 0 }}
                    />
                  </linearGradient>
                </defs>
                <line x1="0" x2="800" y1="45" y2="45" stroke="#f1f5f9" />
                <line x1="0" x2="800" y1="90" y2="90" stroke="#f1f5f9" />
                <line x1="0" x2="800" y1="135" y2="135" stroke="#f1f5f9" />
                {/* Revenue line */}
                <path
                  d="M0,130 C60,100 100,80 160,70 C220,60 280,90 340,50 C400,10 440,40 500,30 C560,20 620,60 680,40 L800,50"
                  fill="none"
                  stroke="#047857"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M0,130 C60,100 100,80 160,70 C220,60 280,90 340,50 C400,10 440,40 500,30 C560,20 620,60 680,40 L800,50 L800,180 L0,180Z"
                  fill="url(#revGrad)"
                  stroke="none"
                />
                {/* Orders line */}
                <path
                  d="M0,150 C60,140 120,120 180,130 C240,140 300,100 360,110 C420,120 460,90 520,80 C580,70 640,90 720,85 L800,90"
                  fill="none"
                  stroke="#5D4037"
                  strokeWidth="2"
                  strokeDasharray="6,3"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Tooltip dot */}
                <circle
                  cx="400"
                  cy="30"
                  r="5"
                  fill="#047857"
                  stroke="white"
                  strokeWidth="2"
                />
              </svg>
              {/* Tooltip */}
              <div className="absolute top-0 left-[calc(50%-60px)] bg-[#0f392b] text-white text-[10px] py-1.5 px-3 rounded-lg pointer-events-none shadow-xl">
                <p className="font-bold">Aug 15</p>
                <p>Rev: Ksh 150k</p>
                <p>Ord: 42</p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0f392b] rotate-45" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>Aug 01</span>
                <span>Aug 08</span>
                <span>Aug 15</span>
                <span>Aug 22</span>
                <span>Aug 30</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Rate Donut */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
            <h3
              className="font-bold text-gray-900 mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Fulfillment Rate
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Delivery vs Store Pick-up
            </p>
            <div className="flex items-center justify-center flex-1">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#5D4037"
                    strokeWidth="12"
                    strokeDasharray="220 251"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="12"
                    strokeDasharray="163 251"
                    strokeDashoffset="-88"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#047857]">98%</span>
                  <span className="text-[10px] text-gray-400">Success</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-5">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#047857]" />
                  Home Delivery
                </span>
                <span className="font-bold text-gray-700">65%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#5D4037]" />
                  Store Pick-up
                </span>
                <span className="font-bold text-gray-700">35%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3
              className="font-bold text-gray-900 mb-1"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Regional Distribution
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Sales across key counties
            </p>
            <div className="relative bg-gradient-to-br from-emerald-50 to-gray-100 rounded-2xl h-48 overflow-hidden flex items-center justify-center">
              <span className="material-icons-round text-[80px] text-gray-200">
                map
              </span>
              {[
                {
                  name: "Nairobi",
                  x: "55%",
                  y: "55%",
                  size: "w-5 h-5",
                  color: "bg-orange-500",
                  primary: true,
                },
                {
                  name: "Nakuru",
                  x: "42%",
                  y: "42%",
                  size: "w-3.5 h-3.5",
                  color: "bg-[#047857]",
                  primary: false,
                },
                {
                  name: "Eldoret",
                  x: "30%",
                  y: "35%",
                  size: "w-3 h-3",
                  color: "bg-[#047857]",
                  primary: false,
                },
                {
                  name: "Meru",
                  x: "65%",
                  y: "40%",
                  size: "w-3 h-3",
                  color: "bg-[#047857]",
                  primary: false,
                },
              ].map((dot) => (
                <div
                  key={dot.name}
                  className="absolute flex flex-col items-center"
                  style={{
                    left: dot.x,
                    top: dot.y,
                    transform: "translate(-50%,-50%)",
                  }}
                >
                  <div
                    className={`${dot.size} ${dot.color} rounded-full border-2 border-white shadow-lg ${dot.primary ? "animate-pulse" : ""}`}
                  />
                  <span className="text-[8px] font-bold text-gray-700 mt-0.5">
                    {dot.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3
                  className="font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Top Categories
                </h3>
                <p className="text-xs text-gray-400">By revenue this month</p>
              </div>
              <a
                href="/dealer/inventory"
                className="text-xs text-[#047857] font-bold hover:underline flex items-center gap-0.5"
              >
                View All{" "}
                <span className="material-icons-round text-sm">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="space-y-5">
              {categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-700">
                      Ksh {(cat.value / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{
                        width: `${cat.pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
