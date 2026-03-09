"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";
import { dealerApi } from "@/lib/services/api";

const CHART_DATA: Record<string, { label: string; value: number }[]> = {
  "This Week": [
    { label: "Mon", value: 85 },
    { label: "Tue", value: 120 },
    { label: "Wed", value: 95 },
    { label: "Thu", value: 145 },
    { label: "Fri", value: 110 },
    { label: "Sat", value: 160 },
    { label: "Sun", value: 90 },
  ],
  "Last Week": [
    { label: "Mon", value: 70 },
    { label: "Tue", value: 105 },
    { label: "Wed", value: 80 },
    { label: "Thu", value: 130 },
    { label: "Fri", value: 95 },
    { label: "Sat", value: 140 },
    { label: "Sun", value: 75 },
  ],
  "Last Month": [
    { label: "W1", value: 320 },
    { label: "W2", value: 450 },
    { label: "W3", value: 390 },
    { label: "W4", value: 500 },
  ],
};

function buildChartPath(data: { value: number }[]) {
  if (data.length < 2) return "";
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 800,
    y: 180 - ((d.value - min) / (max - min || 1)) * 160,
  }));
  let path = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const cp1x = (pts[i - 1].x + pts[i].x) / 2;
    path += ` C${cp1x},${pts[i - 1].y} ${cp1x},${pts[i].y} ${pts[i].x},${pts[i].y}`;
  }
  return path;
}

function buildAreaPath(data: { value: number }[]) {
  if (data.length < 2) return "";
  const line = buildChartPath(data);
  const lastIdx = data.length - 1;
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const lastY = 180 - ((data[lastIdx].value - min) / (max - min || 1)) * 160;
  return line + ` L800,${lastY} L800,200 L0,200 Z`;
}

function buildSparkPath(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 28 - ((v - min) / (max - min || 1)) * 26;
      return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");
}

const INITIAL_INQUIRIES: { id: number; name: string; time: string; msg: string; read: boolean }[] = [];

const INVENTORY_PRODUCTS: { name: string; category: string; price: string; qty: string; qtyColor: string; badge: string; badgeClass: string; icon: string }[] = [];

const DEFAULT_STATS = [
  { label: "Total Sales", value: "—", trend: "", trendUp: true, icon: "payments", iconBg: "bg-emerald-50", iconColor: "text-[#047857]", sparkPath: "M0,25 C20,25 20,5 40,15 C60,25 80,5 100,0" },
  { label: "Active Orders", value: "—", trend: "", trendUp: true, icon: "shopping_bag", iconBg: "bg-emerald-50", iconColor: "text-[#047857]", sparkPath: "M0,20 C30,20 40,5 60,15 C80,25 90,10 100,5" },
  { label: "Low Stock", value: "—", unit: "Items", trend: "", trendUp: false, icon: "warning", iconBg: "bg-orange-50", iconColor: "text-orange-600", sparkPath: "M0,10 C20,10 40,25 60,15 C80,5 90,20 100,20" },
  { label: "Store Rating", value: "—", unit: "/ 5.0", trend: "", trendUp: true, icon: "star", iconBg: "bg-emerald-50", iconColor: "text-[#047857]", sparkPath: "M0,25 C20,15 40,20 60,10 C80,5 90,10 100,0" },
];

export default function DealerDashboardPage() {
  const [chartPeriod, setChartPeriod] = useState("This Week");
  const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [period, setPeriod] = useState("This Month");
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [inventoryProducts, setInventoryProducts] = useState(INVENTORY_PRODUCTS);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dealerApi.dashboard().catch(() => ({ data: null })),
      dealerApi.inventoryAlerts().catch(() => ({ data: [] })),
      dealerApi.queries({ page: 1 }).catch(() => ({ data: { results: [] } })),
    ]).then(([dashRes, alertsRes, queriesRes]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d: any = dashRes.data ?? {};
      setStats([
        { label: "Total Sales", value: d.total_sales ? `Ksh ${Number(d.total_sales).toLocaleString()}` : "—", trend: d.sales_trend ? `${d.sales_trend > 0 ? "+" : ""}${d.sales_trend}%` : "", trendUp: (d.sales_trend ?? 1) >= 0, icon: "payments", iconBg: "bg-emerald-50", iconColor: "text-[#047857]", sparkPath: "M0,25 C20,25 20,5 40,15 C60,25 80,5 100,0" },
        { label: "Active Orders", value: d.active_orders != null ? String(d.active_orders) : "—", trend: d.orders_trend ? `${d.orders_trend > 0 ? "+" : ""}${d.orders_trend}%` : "", trendUp: (d.orders_trend ?? 1) >= 0, icon: "shopping_bag", iconBg: "bg-emerald-50", iconColor: "text-[#047857]", sparkPath: "M0,20 C30,20 40,5 60,15 C80,25 90,10 100,5" },
        { label: "Low Stock", value: d.low_stock_count != null ? String(d.low_stock_count) : "—", unit: "Items", trend: d.low_stock_count > 0 ? "Needs Action" : "OK", trendUp: (d.low_stock_count ?? 1) === 0, icon: "warning", iconBg: "bg-orange-50", iconColor: "text-orange-600", sparkPath: "M0,10 C20,10 40,25 60,15 C80,5 90,20 100,20" },
        { label: "Store Rating", value: d.store_rating != null ? String(d.store_rating) : "—", unit: "/ 5.0", trend: d.rating_change ? `+${d.rating_change}` : "", trendUp: true, icon: "star", iconBg: "bg-emerald-50", iconColor: "text-[#047857]", sparkPath: "M0,25 C20,15 40,20 60,10 C80,5 90,10 100,0" },
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const alerts: any[] = Array.isArray(alertsRes.data) ? alertsRes.data : (alertsRes.data?.results ?? []);
      setInventoryProducts(alerts.slice(0, 5).map((a) => ({
        name: a.name ?? a.product_name ?? "Item",
        category: a.category ?? "",
        price: a.price ? `Ksh ${Number(a.price).toLocaleString()}` : "—",
        qty: `${a.stock ?? a.quantity ?? 0} ${a.unit ?? "Units"}`,
        qtyColor: (a.stock ?? a.quantity ?? 0) <= (a.reorder_level ?? 20) ? "text-orange-600" : "text-gray-800",
        badge: (a.stock ?? a.quantity ?? 0) === 0 ? "Out of Stock" : (a.stock ?? a.quantity ?? 0) <= (a.reorder_level ?? 20) ? "Low Stock" : "In Stock",
        badgeClass: (a.stock ?? a.quantity ?? 0) === 0 ? "bg-red-100 text-red-800" : (a.stock ?? a.quantity ?? 0) <= (a.reorder_level ?? 20) ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800",
        icon: a.icon ?? "inventory_2",
      })));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const qs: any[] = Array.isArray(queriesRes.data) ? queriesRes.data : (queriesRes.data?.results ?? []);
      if (qs.length > 0) {
        setInquiries(qs.slice(0, 5).map((q, i) => ({
          id: q.id ?? i,
          name: q.customer_name ?? q.buyer_name ?? `Customer ${i + 1}`,
          time: q.created_at ? new Date(q.created_at).toLocaleDateString() : "—",
          msg: q.message ?? q.question ?? "",
          read: q.is_read ?? q.read ?? false,
        })));
      }
    }).finally(() => setStatsLoading(false));
  }, []);

  const chartData = CHART_DATA[chartPeriod];
  const chartPath = buildChartPath(chartData);
  const areaPath = buildAreaPath(chartData);
  const peakVal = Math.max(...chartData.map((d) => d.value));
  const sparkValues = chartData.map((d) => d.value);

  const markRead = (id: number) =>
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read: true } : i)),
    );
  const archiveInquiry = (id: number) =>
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  const markAllRead = () =>
    setInquiries((prev) => prev.map((i) => ({ ...i, read: true })));
  const unreadCount = inquiries.filter((i) => !i.read).length;

  const sendReply = (id: number) => {
    if (!replyText.trim()) return;
    markRead(id);
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <DealerPageHeader
        title="Dashboard"
        subtitle="Welcome back to your Agro-Dealer Hub. Here&apos;s what&apos;s happening in your store today."
      >
        <button
          onClick={() =>
            setPeriod((p) =>
              p === "This Month" ? "Last Month" : "This Month",
            )
          }
          className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm"
        >
          <span className="material-icons-round text-lg">calendar_today</span>
          <span className="font-medium text-sm">{period}</span>
          <span className="material-icons-round text-sm">expand_more</span>
        </button>
        <Link
          href="/dealer/products/add"
          className="flex px-5 py-2.5 bg-[#0f392b] text-white rounded-lg items-center gap-2 hover:opacity-90 transition shadow-lg shadow-[#0f392b]/20"
        >
          <span className="material-icons-round text-white text-sm">add</span>
          <span className="font-medium text-sm">New Product</span>
        </Link>
      </DealerPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-8">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8 flex flex-col min-w-0">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsLoading ? (
                [0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm animate-pulse">
                    <div className="h-3 bg-gray-100 rounded w-24 mb-3" />
                    <div className="h-7 bg-gray-100 rounded w-16 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-12" />
                  </div>
                ))
              ) : stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition group relative overflow-hidden cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      {s.label}
                    </h3>
                    <div className={`p-1.5 ${s.iconBg} rounded-lg`}>
                      <span className={`material-icons-round ${s.iconColor} text-base`}>{s.icon}</span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-bold text-gray-800">{s.value}</span>
                    {s.unit && <span className="text-xs text-gray-400">{s.unit}</span>}
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <span className={`text-[10px] font-bold flex items-center gap-0.5 ${s.trendUp ? "text-green-600" : "text-orange-600"}`}>
                      {s.trendUp && <span className="material-icons-round text-[10px]">trending_up</span>}
                      {s.trend}
                    </span>
                    <svg className="w-16 h-8 text-[#047857] stroke-current fill-none opacity-80" preserveAspectRatio="none" viewBox="0 0 100 30">
                      <path d={buildSparkPath(sparkValues)} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Fulfillment Overview */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3
                  className="font-bold text-lg text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Fulfillment Overview
                </h3>
                <span className="text-xs text-gray-400">
                  Today&apos;s Activity
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <span className="material-icons-round text-[#047857]">
                        local_shipping
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        Delivery to Address
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        Logistics
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      ["12", "Pending", "text-orange-600 bg-orange-50"],
                      ["5", "In Transit", "text-[#047857] bg-emerald-50"],
                      ["28", "Delivered", "text-gray-500 bg-gray-100"],
                    ].map(([n, l, cls]) => (
                      <Link
                        key={l}
                        href="/dealer/orders"
                        className={`text-center hover:opacity-80 transition ${l !== "Pending" ? "border-l border-gray-100" : ""}`}
                      >
                        <span className="block text-2xl font-bold text-gray-800">
                          {n}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${cls}`}
                        >
                          {l}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <span className="material-icons-round text-[#5D4037]">
                        store
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">
                        Customer Pick-up
                      </h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        In-Store
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      ["8", "Pending", "text-orange-600 bg-orange-50"],
                      ["3", "Ready", "text-[#5D4037] bg-orange-100/50"],
                      ["15", "Collected", "text-gray-500 bg-gray-100"],
                    ].map(([n, l, cls]) => (
                      <Link
                        key={l}
                        href="/dealer/orders"
                        className={`text-center hover:opacity-80 transition ${l !== "Pending" ? "border-l border-gray-100" : ""}`}
                      >
                        <span className="block text-2xl font-bold text-gray-800">
                          {n}
                        </span>
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${cls}`}
                        >
                          {l}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sales Performance Chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3
                    className="text-lg font-bold text-gray-900"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Sales Performance
                  </h3>
                  <p className="text-xs text-gray-400">
                    Peak this period: Ksh {(peakVal * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={chartPeriod}
                    onChange={(e) => setChartPeriod(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg text-gray-600 py-1.5 px-2 focus:outline-none focus:ring-1 focus:ring-[#047857] cursor-pointer"
                  >
                    {Object.keys(CHART_DATA).map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                  <button className="p-1.5 text-gray-400 hover:text-[#0f392b] hover:bg-gray-50 rounded-lg transition">
                    <span className="material-icons-round text-lg">
                      download
                    </span>
                  </button>
                </div>
              </div>
              <div className="relative h-56 w-full rounded-xl overflow-hidden">
                <svg
                  className="w-full h-44"
                  preserveAspectRatio="none"
                  viewBox="0 0 800 200"
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0%"
                      x2="0%"
                      y1="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#047857", stopOpacity: 0.3 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#047857", stopOpacity: 0 }}
                      />
                    </linearGradient>
                  </defs>
                  {[50, 100, 150].map((y) => (
                    <line
                      key={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      x1="0"
                      x2="800"
                      y1={y}
                      y2={y}
                    />
                  ))}
                  <path
                    d={chartPath}
                    strokeLinecap="round"
                    strokeWidth="3"
                    stroke="#047857"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path d={areaPath} fill="url(#salesGradient)" stroke="none" />
                </svg>
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium px-1">
                {chartData.map((d) => (
                  <span key={d.label}>{d.label}</span>
                ))}
              </div>
            </div>

            {/* Product Inventory Overview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Product Inventory Overview
                </h3>
                <Link
                  className="text-xs font-bold text-[#047857] hover:underline flex items-center gap-1"
                  href="/dealer/inventory"
                >
                  View Full Inventory{" "}
                  <span className="material-icons-round text-sm">
                    arrow_forward
                  </span>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INVENTORY_PRODUCTS.map((p) => (
                  <Link
                    key={p.name}
                    href="/dealer/inventory"
                    className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col hover:shadow-lg transition cursor-pointer group"
                  >
                    <div className="relative h-40 w-full bg-gray-50 rounded-2xl overflow-hidden mb-4 border border-gray-50 flex items-center justify-center">
                      <span className="material-icons-round text-[80px] text-gray-200 group-hover:scale-110 transition-transform duration-500">
                        {p.icon}
                      </span>
                      <div className="absolute top-3 right-3">
                        <span
                          className={`${p.badgeClass} text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide`}
                        >
                          {p.badge}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 group-hover:text-[#047857] transition">
                        {p.name}
                      </h4>
                      <p className="text-xs text-gray-400 mb-3">
                        Category: {p.category}
                      </p>
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                            Price
                          </p>
                          <p className="font-bold text-gray-700">{p.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                            Qty
                          </p>
                          <p className={`font-bold ${p.qtyColor}`}>{p.qty}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Customer Inquiries */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="font-bold text-lg text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Customer Inquiries
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <span className="bg-[#047857]/10 text-[#047857] text-[10px] font-bold px-2 py-1 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[9px] text-gray-400 hover:text-[#047857] underline transition"
                    >
                      Mark all
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`relative pl-4 border-l-2 ${inq.read ? "border-gray-100" : "border-[#047857]/30 hover:border-[#047857]"} transition-colors`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`text-sm font-bold ${inq.read ? "text-gray-600" : "text-gray-800"}`}
                      >
                        {inq.name}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {inq.time}
                      </span>
                    </div>
                    <p
                      className={`text-xs mb-2 line-clamp-2 ${inq.read ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {inq.msg}
                    </p>
                    {replyingTo === inq.id ? (
                      <div className="mb-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={2}
                          placeholder="Type reply..."
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#047857] resize-none"
                          autoFocus
                        />
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => sendReply(inq.id)}
                            disabled={!replyText.trim()}
                            className="text-[10px] bg-[#047857] text-white px-3 py-1 rounded-lg disabled:opacity-40 hover:opacity-90 transition"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="text-[10px] text-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 flex-wrap">
                        {!inq.read && (
                          <>
                            <button
                              onClick={() => setReplyingTo(inq.id)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-[#047857]/5 text-[#047857] hover:bg-[#047857] hover:text-white transition"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => markRead(inq.id)}
                              className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition"
                            >
                              Mark Read
                            </button>
                          </>
                        )}
                        {inq.read && (
                          <button
                            onClick={() => archiveInquiry(inq.id)}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24">
                    <span className="material-icons-round text-gray-200 text-3xl mb-1">
                      mark_email_read
                    </span>
                    <p className="text-xs text-gray-400">All caught up!</p>
                  </div>
                )}
              </div>
              <Link
                href="/dealer/queries"
                className="block w-full mt-4 py-2 text-xs font-bold text-center text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
              >
                View All Messages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
