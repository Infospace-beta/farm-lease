"use client";
import { useState } from "react";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";

const timePeriods = ["All Time", "This Month", "Custom"];
type Transaction = (typeof transactions)[0];

const transactions = [
  {
    id: "#TRX-88210",
    date: "Oct 24",
    desc: "Order #4421 – 50kg DAP Fertilizer (20 Bags)",
    customer: "Grace N.",
    initials: "GN",
    type: "Sale",
    typeClass: "bg-green-100 text-green-800",
    amount: 4500,
    fee: -225,
    status: "Direct Payment",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "#TRX-88209",
    date: "Oct 23",
    desc: "Order #4420 – Solar Pump Kit",
    customer: "FarmCorp Ltd.",
    initials: "FC",
    type: "Sale",
    typeClass: "bg-green-100 text-green-800",
    amount: 45000,
    fee: -2250,
    status: "Direct Payment",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "#TRX-88207",
    date: "Oct 22",
    desc: "Order #4418 – Hybrid Maize Seeds",
    customer: "Samuel K.",
    initials: "SK",
    type: "Sale",
    typeClass: "bg-green-100 text-green-800",
    amount: 12500,
    fee: -625,
    status: "Direct Payment",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "#TRX-88206",
    date: "Oct 22",
    desc: "Order #4417 – Herbicide 1L",
    customer: "Mary W.",
    initials: "MW",
    type: "Sale",
    typeClass: "bg-green-100 text-green-800",
    amount: 8200,
    fee: -410,
    status: "Direct Payment",
    statusClass: "bg-blue-100 text-blue-700",
  },
  {
    id: "#TRX-88205",
    date: "Oct 21",
    desc: "Refund – Order #4402 (Wrong item delivered)",
    customer: "John D.",
    initials: "JD",
    type: "Refund",
    typeClass: "bg-red-100 text-red-800",
    amount: -3200,
    fee: 0,
    status: "Refunded",
    statusClass: "bg-red-100 text-red-700",
  },
];

export default function TransactionsPage() {
  const [activePeriod, setActivePeriod] = useState("All Time");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [viewingTx, setViewingTx] = useState<Transaction | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = transactions.filter(
    (t) =>
      (t.desc.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "All Status" || t.status === statusFilter),
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      {viewingTx && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
          onClick={() => setViewingTx(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">
                Transaction Details
              </h3>
              <button
                onClick={() => setViewingTx(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ID</span>
                <span className="font-mono font-bold text-[#047857]">
                  {viewingTx.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-semibold">{viewingTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Customer</span>
                <span className="font-semibold">{viewingTx.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Description</span>
                <span className="font-semibold text-right max-w-[200px]">
                  {viewingTx.desc}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${viewingTx.typeClass}`}
                >
                  {viewingTx.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span
                  className={`font-bold ${viewingTx.amount < 0 ? "text-red-600" : "text-gray-800"}`}
                >
                  Ksh {Math.abs(viewingTx.amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platform Fee</span>
                <span className="font-semibold text-red-500">
                  {viewingTx.fee !== 0
                    ? `Ksh ${Math.abs(viewingTx.fee).toLocaleString()}`
                    : "–"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${viewingTx.statusClass}`}
                >
                  {viewingTx.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <DealerPageHeader
        title="Financial Transactions"
        subtitle="Track all payments, sales and platform fees in one place."
      >
        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden p-1 gap-1">
          {timePeriods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${activePeriod === p ? "bg-[#0f392b] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {p}
            </button>
          ))}
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
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: "Total Earnings",
              value: "Ksh 1,452,300",
              sub: "+12% from last period",
              icon: "account_balance_wallet",
              iconBg: "bg-emerald-50",
              iconColor: "text-[#047857]",
              trend: true,
            },
            {
              label: "Direct M-Pesa Sales",
              value: "Ksh 1,410,150",
              sub: "Sent to your account",
              icon: "phone_android",
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              trend: null,
            },
            {
              label: "Platform Fees Paid",
              value: "Ksh 42,150",
              sub: "Last 30 days",
              icon: "receipt_long",
              iconBg: "bg-orange-50",
              iconColor: "text-orange-600",
              trend: null,
            },
          ].map((c) => (
            <div
              key={c.label}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <span className={`material-icons-round ${c.iconColor}`}>
                    {c.icon}
                  </span>
                </div>
                {c.trend && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {c.sub.split(" ")[0]}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                {c.label}
              </p>
              <p className="text-2xl font-bold text-gray-800 mb-1">{c.value}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <h3
                className="font-bold text-gray-900"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Transaction History
              </h3>
              <span className="text-xs font-bold text-white bg-[#047857] px-2 py-0.5 rounded-full">
                141
              </span>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">
                  search
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search transactions..."
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] w-48"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#047857]"
              >
                <option>All Status</option>
                <option>Direct Payment</option>
                <option>Refunded</option>
              </select>
              <button className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50">
                <span className="material-icons-round text-base">tune</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Description
                  </th>
                  <th className="text-center py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Type
                  </th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Amount
                  </th>
                  <th className="text-right py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Platform Fee
                  </th>
                  <th className="text-center py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </th>
                  <th className="text-center py-3 px-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-[#047857]">
                      {t.id}
                    </td>
                    <td className="py-4 px-5 text-xs text-gray-500">
                      {t.date}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#0f392b] rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                          {t.initials}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-800 max-w-[180px] truncate">
                            {t.desc}
                          </p>
                          <p className="text-[9px] text-gray-400">
                            {t.customer}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`text-[9px] font-bold px-2 py-1 rounded-full ${t.typeClass}`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`py-4 px-5 text-right text-sm font-bold ${t.amount < 0 ? "text-red-600" : "text-gray-800"}`}
                    >
                      {t.amount < 0 ? "-" : ""}Ksh{" "}
                      {Math.abs(t.amount).toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-right text-xs font-semibold text-red-500">
                      {t.fee !== 0
                        ? `Ksh ${Math.abs(t.fee).toLocaleString()}`
                        : "–"}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`text-[9px] font-bold px-2 py-1 rounded-full ${t.statusClass}`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => setViewingTx(t)}
                        className="p-1.5 text-gray-400 hover:text-[#047857] hover:bg-emerald-50 rounded-lg transition"
                      >
                        <span className="material-icons-round text-base">
                          visibility
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of 141 transactions
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50"
              >
                Previous
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-xs rounded-lg ${page === p ? "bg-[#047857] text-white" : "border border-gray-200 text-gray-400 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
