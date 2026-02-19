"use client";
import { useState } from "react";
import Link from "next/link";

const REGIONS = [
  "North Rift Region",
  "Central Rift",
  "Nairobi Metro",
  "Western Kenya",
  "Coast Region",
];

const alerts = [
  {
    title: "Stock Up on Urea",
    badge: "AI FORECAST",
    badgeClass: "bg-emerald-300/20 text-emerald-300",
    icon: "psychology",
    bg: "bg-[#0a261c]",
    textLight: true,
    desc: "Demand for Urea fertilizer is expected to spike +40% in the next 2 weeks ahead of long rains season.",
    action: "View Suppliers",
    actionClass: "bg-white/20 text-white hover:bg-white/30",
  },
  {
    title: "Pest Control Alert",
    badge: "HOT ITEM",
    badgeClass: "bg-orange-100 text-orange-700",
    icon: "local_fire_dept",
    bg: "bg-white",
    textLight: false,
    desc: "+215% Search Volume for fall armyworm pesticides in the North Rift region over the past 3 days.",
    action: "View Products",
    actionClass: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  },
  {
    title: "Irrigation Prep Season",
    badge: "SEASONAL",
    badgeClass: "bg-teal-100 text-teal-700",
    icon: "water_drop",
    bg: "bg-white",
    textLight: false,
    desc: "Irrigation equipment is seeing high viewing interest as dry spell conditions are forecasted.",
    action: "High Viewing Interest ↗",
    actionClass: "bg-teal-100 text-teal-700 hover:bg-teal-200",
  },
];

const demandItems = [
  {
    product: "Urea Fertilizer 50kg",
    category: "Fertilizers",
    trend: "+42%",
    trendUp: true,
    price: "Ksh 2,900",
    action: "Restock",
  },
  {
    product: "Fall Armyworm Pesticide",
    category: "Pesticides",
    trend: "+215%",
    trendUp: true,
    price: "Ksh 850",
    action: "Add Product",
  },
  {
    product: "Drip Irrigation Kit",
    category: "Equipment",
    trend: "+38%",
    trendUp: true,
    price: "Ksh 15,000",
    action: "Restock",
  },
  {
    product: "Hybrid Seeds DH04",
    category: "Seeds",
    trend: "+29%",
    trendUp: true,
    price: "Ksh 2,200",
    action: "Add Product",
  },
];

export default function TrendsPage() {
  const [region, setRegion] = useState("North Rift Region");
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2
            className="text-3xl font-bold tracking-tight text-gray-900 mb-1"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Market Trends
          </h2>
          <p className="text-gray-500 text-sm">
            AI-powered insights into regional agricultural input demand and
            seasonal patterns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowRegionMenu((v) => !v)}
              className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 shadow-sm text-sm"
            >
              <span className="material-icons-round text-base">
                location_on
              </span>
              {region}
              <span className="material-icons-round text-sm text-gray-400">
                expand_more
              </span>
            </button>
            {showRegionMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 min-w-[180px] overflow-hidden">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      setShowRegionMenu(false);
                      showToast(`Region: ${r}`);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${region === r ? "font-bold text-[#047857]" : "text-gray-700"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => showToast("Filters applied")}
            className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 bg-white text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <span className="material-icons-round text-base">tune</span>
            Filters
          </button>
        </div>
      </header>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className={`${alert.bg} p-5 rounded-3xl border ${alert.textLight ? "border-transparent" : "border-gray-100"} shadow-sm`}
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${alert.badgeClass}`}
              >
                {alert.badge}
              </span>
              <span
                className={`material-icons-round text-2xl ${alert.textLight ? "text-emerald-300" : "text-[#0f392b]"}`}
              >
                {alert.icon}
              </span>
            </div>
            <h3
              className={`font-bold text-base mb-2 ${alert.textLight ? "text-white" : "text-gray-800"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {alert.title}
            </h3>
            <p
              className={`text-xs mb-4 leading-relaxed ${alert.textLight ? "text-white/70" : "text-gray-500"}`}
            >
              {alert.desc}
            </p>
            <button
              onClick={() => showToast(`${alert.title}: action triggered`)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${alert.actionClass}`}
            >
              {alert.action}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Regional Demand Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3
                className="font-bold text-gray-900"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Regional Input Demand
              </h3>
              <p className="text-xs text-gray-400">4-week demand forecast</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#047857] rounded" />
                Fertilizer
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-[#5D4037] rounded border-dashed border border-[#5D4037]" />
                Seeds
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-1 bg-gray-300 rounded" />
                Chemicals
              </span>
            </div>
          </div>
          <div className="relative h-56">
            <svg
              className="w-full h-44"
              preserveAspectRatio="none"
              viewBox="0 0 800 180"
            >
              <line x1="0" x2="800" y1="45" y2="45" stroke="#f1f5f9" />
              <line x1="0" x2="800" y1="90" y2="90" stroke="#f1f5f9" />
              <line x1="0" x2="800" y1="135" y2="135" stroke="#f1f5f9" />
              <path
                d="M0,120 C150,90 250,50 400,20 C500,5 600,40 800,30"
                fill="none"
                stroke="#047857"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0,150 C150,130 300,100 450,110 C600,120 700,90 800,80"
                fill="none"
                stroke="#5D4037"
                strokeWidth="2"
                strokeDasharray="8,4"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d="M0,160 C150,155 300,140 450,145 C600,150 700,130 800,125"
                fill="none"
                stroke="#d1d5db"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Peak tooltip dot */}
              <circle
                cx="400"
                cy="20"
                r="5"
                fill="#047857"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute top-0 left-[calc(50%-60px)] bg-[#0f392b] text-white text-[10px] py-1.5 px-3 rounded-lg shadow-xl pointer-events-none">
              <p className="font-bold">Peak Demand</p>
              <p>Urea: 450 Bags</p>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0f392b] rotate-45" />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Calendar + Regional Updates */}
        <div className="space-y-5">
          {/* Seasonal Planting Calendar */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-[#047857]">event</span>
              <h3 className="font-bold text-gray-800 text-sm">
                Seasonal Planting Calendar
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl mb-3 border border-emerald-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#047857]">
                  Current Phase
                </span>
                <span className="text-[9px] font-bold bg-[#047857] text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 mb-1">
                Long Rains Planting
              </p>
              <div className="flex gap-1 flex-wrap">
                {["Maize", "Beans", "Sorghum"].map((c) => (
                  <span
                    key={c}
                    className="text-[9px] bg-white border border-emerald-200 text-[#047857] px-2 py-0.5 rounded-full font-semibold"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  Coming Soon
                </span>
                <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  In 2 Weeks
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-600">
                First Weeding &amp; Top Dressing
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Stock up on CAN &amp; top-dress inputs
              </p>
            </div>
          </div>

          {/* Regional Updates */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons-round text-[#5D4037]">
                  notifications_active
                </span>
                <h3 className="font-bold text-gray-800 text-sm">
                  Regional Updates
                </h3>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition">
                <span className="material-icons-round text-sm">refresh</span>
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  time: "Today 9AM",
                  msg: "Subsidized Fertilizer Arrival: The government has announced subsidized urea deliveries to Eldoret depot.",
                  badge: "NEW",
                  badgeClass: "bg-green-100 text-green-700",
                },
                {
                  time: "Yesterday",
                  msg: "Heavy Rainfall Warning: Met dept forecasts 60mm+ rainfall in North Rift this weekend.",
                  badge: "WEATHER",
                  badgeClass: "bg-blue-100 text-blue-700",
                },
              ].map((u, i) => (
                <div key={i} className="border-l-2 border-[#047857]/20 pl-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] text-gray-400">{u.time}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${u.badgeClass}`}
                    >
                      {u.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {u.msg}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Highest Demand Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3
            className="font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Highest Demand Inputs
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Top searched products in your region this week
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Product Name
                </th>
                <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Category
                </th>
                <th className="text-center py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Search Trend
                </th>
                <th className="text-right py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Avg Market Price
                </th>
                <th className="text-center py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {demandItems.map((item) => (
                <tr
                  key={item.product}
                  className="hover:bg-gray-50/50 transition"
                >
                  <td className="py-4 px-5 text-sm font-bold text-gray-800">
                    {item.product}
                  </td>
                  <td className="py-4 px-5 text-xs text-gray-500 font-semibold">
                    {item.category}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center justify-center gap-0.5 w-fit mx-auto">
                      <span className="material-icons-round text-sm">
                        trending_up
                      </span>
                      {item.trend}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right text-sm font-bold text-gray-700">
                    {item.price}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <Link
                      href={
                        item.action === "Restock"
                          ? "/dealer/inventory"
                          : "/dealer/products/add"
                      }
                      className="text-xs font-bold px-4 py-1.5 bg-[#047857] text-white rounded-lg hover:opacity-90 transition inline-block"
                    >
                      {item.action}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
