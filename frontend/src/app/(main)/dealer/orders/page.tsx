"use client";
import { useState } from "react";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";

type Order = {
  id: string;
  customer: string;
  initials: string;
  type: string;
  typeIcon: string;
  amount: number;
  status: string;
  statusClass: string;
  phone?: string;
  address?: string;
};

type TimelineStep = { label: string; done: boolean; current: boolean };

const tabs = ["All Orders", "Delivery", "Pick-up", "Pending", "Completed"];

const orders = [
  {
    id: "#ORD-2489",
    customer: "Grace N.",
    initials: "GN",
    type: "Delivery",
    typeIcon: "local_shipping",
    amount: 72500,
    status: "Pending",
    statusClass: "bg-orange-100 text-orange-700",
  },
  {
    id: "#ORD-2488",
    customer: "Samuel K.",
    initials: "SK",
    type: "Pickup",
    typeIcon: "store",
    amount: 3500,
    status: "Ready",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "#ORD-2487",
    customer: "FarmCorp Ltd.",
    initials: "FC",
    type: "Delivery",
    typeIcon: "local_shipping",
    amount: 145200,
    status: "Dispute",
    statusClass: "bg-red-100 text-red-700",
  },
  {
    id: "#ORD-2486",
    customer: "John D.",
    initials: "JD",
    type: "Pickup",
    typeIcon: "store",
    amount: 12000,
    status: "Collected",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    id: "#ORD-2485",
    customer: "Mary W.",
    initials: "MW",
    type: "Delivery",
    typeIcon: "local_shipping",
    amount: 45600,
    status: "Pending",
    statusClass: "bg-orange-100 text-orange-700",
  },
];

const TIMELINE: Record<string, TimelineStep[]> = {
  Pending: [
    { label: "Order Received", done: true, current: false },
    { label: "Processing", done: false, current: true },
    { label: "Ready for Dispatch", done: false, current: false },
    { label: "Delivered", done: false, current: false },
  ],
  Ready: [
    { label: "Order Received", done: true, current: false },
    { label: "Processing", done: true, current: false },
    { label: "Ready for Dispatch", done: false, current: true },
    { label: "Delivered", done: false, current: false },
  ],
  Delivered: [
    { label: "Order Received", done: true, current: false },
    { label: "Processing", done: true, current: false },
    { label: "Ready for Dispatch", done: true, current: false },
    { label: "Delivered", done: false, current: true },
  ],
  Collected: [
    { label: "Order Received", done: true, current: false },
    { label: "Processing", done: true, current: false },
    { label: "Ready for Dispatch", done: true, current: false },
    { label: "Collected", done: true, current: false },
  ],
  Dispute: [
    { label: "Order Received", done: true, current: false },
    { label: "Dispute Filed", done: false, current: true },
    { label: "Resolution Pending", done: false, current: false },
    { label: "Resolved", done: false, current: false },
  ],
};

const ORDER_DETAILS: Record<
  string,
  {
    phone: string;
    address: string;
    items: { name: string; desc: string; amount: number }[];
  }
> = {
  "#ORD-2489": {
    phone: "+254 712 345 678",
    address: "Green Valley Farm, Plot 45B, Nakuru County",
    items: [
      {
        name: "DAP Fertilizer 50kg",
        desc: "20 Bags × Ksh 3,500",
        amount: 70000,
      },
      { name: "Delivery Fee", desc: "Flat rate", amount: 2500 },
    ],
  },
  "#ORD-2488": {
    phone: "+254 721 999 100",
    address: "—",
    items: [
      { name: "DAP Fertilizer 50kg", desc: "1 Bag × Ksh 3,500", amount: 3500 },
    ],
  },
  "#ORD-2487": {
    phone: "+254 733 200 400",
    address: "FarmCorp HQ, Industrial Area, Nairobi",
    items: [
      {
        name: "Drip Irrigation Kit",
        desc: "9 Sets × Ksh 15,000",
        amount: 135000,
      },
      { name: "Delivery Fee", desc: "Flat rate", amount: 10200 },
    ],
  },
  "#ORD-2486": {
    phone: "+254 705 100 200",
    address: "—",
    items: [
      {
        name: "Hybrid Maize Seeds",
        desc: "6 Packs × Ksh 2,000",
        amount: 12000,
      },
    ],
  },
  "#ORD-2485": {
    phone: "+254 718 555 777",
    address: "Sunrise Estate, Eldoret",
    items: [
      {
        name: "Knapsack Sprayer 16L",
        desc: "5 Units × Ksh 3,200",
        amount: 16000,
      },
      {
        name: "Broad Spectrum Insecticide",
        desc: "30 Bottles × Ksh 850",
        amount: 25500,
      },
      { name: "Delivery Fee", desc: "Flat rate", amount: 4100 },
    ],
  },
};

function getStatusClass(status: string) {
  if (status === "Pending") return "bg-orange-100 text-orange-700";
  if (status === "Ready") return "bg-blue-100 text-blue-700";
  if (status === "Dispute") return "bg-red-100 text-red-700";
  if (status === "Collected" || status === "Delivered")
    return "bg-green-100 text-green-700";
  if (status === "Cancelled") return "bg-gray-100 text-gray-500";
  return "bg-gray-100 text-gray-600";
}

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>(orders);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [selectedId, setSelectedId] = useState("#ORD-2489");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = (id: string, newStatus: string) => {
    setAllOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? { ...o, status: newStatus, statusClass: getStatusClass(newStatus) }
          : o,
      ),
    );
  };

  const markReady = () => {
    const order = allOrders.find((o) => o.id === selectedId);
    if (!order) return;
    const next = order.type === "Pickup" ? "Ready" : "Delivered";
    updateStatus(selectedId, next);
    showToast(
      next === "Ready" ? "Order marked as Ready" : "Order marked as Delivered",
    );
  };

  const cancelOrder = () => {
    if (!confirm("Cancel this order?")) return;
    updateStatus(selectedId, "Cancelled");
    showToast("Order cancelled");
  };

  const printInvoice = () => window.print();

  const selected = allOrders.find((o) => o.id === selectedId) ?? allOrders[0];
  const selDetail = ORDER_DETAILS[selectedId] ?? ORDER_DETAILS["#ORD-2489"];
  const timeline = TIMELINE[selected.status] ?? TIMELINE["Pending"];

  const filtered = allOrders.filter((o) => {
    const matchTab =
      activeTab === "All Orders" ||
      (activeTab === "Delivery" && o.type === "Delivery") ||
      (activeTab === "Pick-up" && o.type === "Pickup") ||
      (activeTab === "Pending" && o.status === "Pending") ||
      (activeTab === "Completed" &&
        (o.status === "Collected" || o.status === "Delivered"));
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const canAct =
    selected.status !== "Cancelled" &&
    selected.status !== "Collected" &&
    selected.status !== "Delivered";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="Incoming Orders"
        subtitle="Review, process and track customer orders."
      >
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-base">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857]"
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
          <span className="material-icons-round text-base">tune</span>
        </button>
        <button className="flex px-4 py-2 text-sm bg-[#0f392b] text-white rounded-lg items-center gap-2 hover:opacity-90 shadow-lg shadow-[#0f392b]/20">
          <span className="material-icons-round text-sm">download</span>
          Export
        </button>
      </DealerPageHeader>

      <div className="flex gap-6 flex-1 min-h-0 p-4 lg:p-8 bg-[#f8fafc]">
        {/* Left — Orders Table */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-3 text-sm font-semibold whitespace-nowrap transition border-b-2 -mb-px ${activeTab === tab ? "border-[#047857] text-[#047857]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50/80 backdrop-blur-sm">
                <tr>
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Type
                  </th>
                  <th className="text-right py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Amount
                  </th>
                  <th className="text-center py-3 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedId(order.id)}
                    className={`cursor-pointer transition ${selectedId === order.id ? "bg-emerald-50/50" : "hover:bg-gray-50/50"}`}
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`text-sm font-bold font-mono ${selectedId === order.id ? "text-[#047857]" : "text-gray-700"}`}
                      >
                        {order.id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0f392b] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {order.initials}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {order.customer}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <span className="material-icons-round text-sm">
                          {order.typeIcon}
                        </span>
                        {order.type}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-bold text-gray-800">
                      Ksh {order.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${order.statusClass}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              Showing 1 to {filtered.length} of 124 results
            </p>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`px-3 py-1.5 text-xs rounded-lg ${p === 1 ? "bg-[#047857] text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
              <span className="px-2 py-1.5 text-xs text-gray-400">...</span>
              <button className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right — Order Detail Panel */}
        <div className="w-80 xl:w-96 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-y-auto flex flex-col flex-shrink-0">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <span className="font-bold text-[#047857] font-mono text-sm">
              {selected.id}
            </span>
            <div className="flex gap-2">
              <button
                onClick={printInvoice}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <span className="material-icons-round text-base">print</span>
              </button>
            </div>
          </div>

          <div className="p-5 space-y-6 flex-1">
            {/* Timeline */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                Order Status
              </h4>
              <div className="relative">
                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-100" />
                {timeline.map((step, i) => (
                  <div
                    key={i}
                    className="relative flex items-start gap-3 mb-4 last:mb-0"
                  >
                    <div
                      className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.done ? "bg-[#047857]" : step.current ? "bg-orange-500" : "bg-gray-200"}`}
                    >
                      {step.done ? (
                        <span className="material-icons-round text-white text-xs">
                          check
                        </span>
                      ) : step.current ? (
                        <span className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <span className="w-2 h-2 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p
                        className={`text-xs font-semibold ${step.done ? "text-[#047857]" : step.current ? "text-orange-700" : "text-gray-400"}`}
                      >
                        {step.label}
                      </p>
                      {step.current && (
                        <p className="text-[10px] text-orange-500">
                          In Progress
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Customer
              </h4>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#0f392b] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {selected.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {selected.customer}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="material-icons-round text-xs">phone</span>
                    {selDetail.phone}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selDetail.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Items
              </h4>
              <div className="space-y-2">
                {selDetail.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start text-sm py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-gray-400">{item.desc}</p>
                    </div>
                    <span className="font-bold text-gray-700 text-xs">
                      Ksh {item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 mt-1">
                  <span className="text-xs font-bold text-gray-700">Total</span>
                  <span className="text-base font-bold text-[#047857]">
                    Ksh {selected.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 border-t border-gray-100 space-y-3">
            {canAct ? (
              <button
                onClick={markReady}
                className="w-full py-3 bg-[#047857] text-white rounded-xl text-sm font-bold hover:opacity-90 transition shadow-lg shadow-[#047857]/20"
              >
                {selected.type === "Pickup"
                  ? "Mark as Ready"
                  : "Mark as Delivered"}
              </button>
            ) : (
              <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-xl text-sm font-bold text-center">
                {selected.status}
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={printInvoice}
                className="py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <span className="material-icons-round text-sm">print</span>Print
                Invoice
              </button>
              {canAct ? (
                <button
                  onClick={cancelOrder}
                  className="py-2 border border-red-200 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                  <span className="material-icons-round text-sm">cancel</span>
                  Cancel Order
                </button>
              ) : (
                <div className="py-2 border border-gray-100 text-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5">
                  <span className="material-icons-round text-sm">cancel</span>
                  Cancel Order
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
