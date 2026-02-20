"use client";

import { useState } from "react";
import {
  Landmark,
  ArrowUpRight,
  DollarSign,
  SlidersHorizontal,
  TrendingUp,
  Search,
  FileDown,
  Bell,
  Filter,
  MoreVertical,
  FileText,
  History,
  CheckCircle,
} from "lucide-react";

const transactions = [
  {
    id: "TXN-8829-LE",
    date: "Oct 24, 2023, 10:42 AM",
    partyInitials: "JD",
    partyBg: "bg-[#0f392b]",
    beneficiary: "John Doe (Lessor)",
    from: "Alice W. (Lessee)",
    typeBg: "bg-blue-50 text-blue-700",
    typeIcon: "landscape",
    typeLabel: "Lease Escrow",
    detail: "Land Lease - Plot LR-4521/11 (5 Acres)",
    amount: "450,000.00",
    fee: "45,000.00",
    feeRate: "10%",
    statusBg: "bg-orange-100 text-orange-700",
    statusLabel: "Held in Escrow",
    statusNote: "Pending: Lessee confirmation of soil report.",
    pulse: true,
    actionIcon: "more",
  },
  {
    id: "SUB-9921-AD",
    date: "Oct 23, 2023, 09:00 AM",
    partyInitials: "AI",
    partyBg: "bg-purple-700",
    beneficiary: "Agro-Input Ltd",
    from: "Agro-Dealer",
    typeBg: "bg-purple-50 text-purple-700",
    typeIcon: "subscription",
    typeLabel: "Monthly Subscription",
    detail: "Premium Dealer Tier - Oct 2023",
    amount: "5,000.00",
    fee: "Included",
    feeRate: "",
    statusBg: "bg-emerald-100 text-emerald-800",
    statusLabel: "Active",
    statusNote: "Auto-renew enabled.",
    pulse: false,
    actionIcon: "file",
  },
  {
    id: "TXN-6610-LE",
    date: "Oct 22, 2023, 09:00 AM",
    partyInitials: "MK",
    partyBg: "bg-[#5D4037]",
    beneficiary: "Michael Kimani",
    from: "GreenHarvest Co.",
    typeBg: "bg-blue-50 text-blue-700",
    typeIcon: "landscape",
    typeLabel: "Lease Escrow",
    detail: "Land Lease - Plot LR-1029/99",
    amount: "120,000.00",
    fee: "12,000.00",
    feeRate: "10%",
    statusBg: "bg-orange-100 text-orange-700",
    statusLabel: "Held in Escrow",
    statusNote: "Awaiting inspection confirmation.",
    pulse: true,
    actionIcon: "more",
  },
  {
    id: "SUB-8832-KS",
    date: "Oct 22, 2023, 08:30 AM",
    partyInitials: "KS",
    partyBg: "bg-teal-700",
    beneficiary: "Kenya Seeds Co",
    from: "Agro-Dealer",
    typeBg: "bg-purple-50 text-purple-700",
    typeIcon: "subscription",
    typeLabel: "Monthly Subscription",
    detail: "Standard Dealer Tier - Oct 2023",
    amount: "5,000.00",
    fee: "Included",
    feeRate: "",
    statusBg: "bg-emerald-100 text-emerald-800",
    statusLabel: "Active",
    statusNote: "Next billing: Nov 22, 2023",
    pulse: false,
    actionIcon: "history",
  },
  {
    id: "TXN-4412-LE",
    date: "Oct 21, 2023, 04:10 PM",
    partyInitials: "AW",
    partyBg: "bg-emerald-700",
    beneficiary: "Alice Wanjiku",
    from: "AgriCorp Ltd",
    typeBg: "bg-blue-50 text-blue-700",
    typeIcon: "landscape",
    typeLabel: "Lease Escrow",
    detail: "Land Lease - Plot LR-3310/12 (10 Acres)",
    amount: "850,000.00",
    fee: "85,000.00",
    feeRate: "10%",
    statusBg: "bg-green-100 text-green-700",
    statusLabel: "Funds Released",
    statusNote: "Contract signed & verified.",
    pulse: false,
    actionIcon: "file",
  },
];

const actionIcon = (type: string) => {
  switch (type) {
    case "file":
      return <FileText className="w-4 h-4" />;
    case "history":
      return <History className="w-4 h-4" />;
    default:
      return <MoreVertical className="w-4 h-4" />;
  }
};

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = transactions.filter((tx) => {
    const matchSearch =
      !search ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.beneficiary.toLowerCase().includes(search.toLowerCase()) ||
      tx.from.toLowerCase().includes(search.toLowerCase()) ||
      tx.detail.toLowerCase().includes(search.toLowerCase());
    const matchType =
      !typeFilter ||
      (typeFilter === "Lease Escrow" && tx.typeLabel === "Lease Escrow") ||
      (typeFilter === "Subscriptions" && tx.typeLabel === "Monthly Subscription");
    return matchSearch && matchType;
  });
  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
            Escrow &amp; Payments Ledger
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-lg">
            Monitor real-time financial flows, escrow holdings, and subscription
            revenue across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg text-white rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
            <FileDown className="w-4 h-4" />
            Export Ledger
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-52 shadow-sm"
            />
          </div>
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Escrow */}
        <div className="bg-linear-to-br from-sidebar-bg to-[#0a261c] p-5 rounded-2xl shadow-xl text-white relative overflow-hidden group">
          <div className="absolute right-0 top-0 h-28 w-28 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-white/10 transition-all" />
          <div className="relative z-10 flex flex-col justify-between h-full min-h-32.5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Current Escrow Total
                </h3>
                <div className="flex items-center gap-1.5 text-[#13ec80] text-xs bg-white/10 w-fit px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Held Securely
                </div>
              </div>
              <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#13ec80] border border-white/10">
                <Landmark className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight">
                Ksh 24,580,200
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/60">
                <span className="flex items-center text-[#13ec80]">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +3.2%
                </span>
                vs last month
              </div>
            </div>
          </div>
        </div>

        {/* Released Funds */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition relative overflow-hidden">
          <div className="absolute right-0 bottom-0 h-20 w-20 bg-earth/5 rounded-full -mr-6 -mb-6" />
          <div className="flex flex-col justify-between h-full min-h-32.5">
            <div className="flex justify-between items-start">
              <h3 className="text-earth text-[10px] font-bold uppercase tracking-widest">
                Released Funds
              </h3>
              <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-earth">
                <ArrowUpRight className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                Ksh 12,405,000
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center text-sidebar-bg font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-0.5" />
                  85%
                </span>
                release rate
              </div>
            </div>
          </div>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition relative overflow-hidden">
          <div className="absolute right-0 bottom-0 h-20 w-20 bg-[#13ec80]/10 rounded-full -mr-6 -mb-6" />
          <div className="flex flex-col justify-between h-full min-h-32.5">
            <div className="flex justify-between items-start">
              <h3 className="text-sidebar-bg text-[10px] font-bold uppercase tracking-widest">
                Platform Revenue
              </h3>
              <span className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <DollarSign className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                Ksh 2,350,400
              </span>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                <span className="flex items-center text-emerald-700 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +15%
                </span>
                Subscription + Fees
              </div>
            </div>
          </div>
        </div>

        {/* Fee Settings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition relative overflow-hidden">
          <div className="absolute right-0 bottom-0 h-20 w-20 bg-purple-50 rounded-full -mr-6 -mb-6" />
          <div className="flex flex-col justify-between h-full min-h-32.5">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                Platform Fee Settings
              </h3>
              <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                <SlidersHorizontal className="w-5 h-5" />
              </span>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">
                  Lease Service Fee
                </span>
                <span className="text-lg font-bold text-sidebar-bg">10%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                defaultValue="10"
                className="w-full h-1.5 bg-gray-200 rounded-lg accent-sidebar-bg cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-mono">
                <span>0%</span>
                <span>20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-earth font-serif">
              Transaction Log
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-time view of all financial movements including dealer
              subscriptions &amp; Lease Escrow.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20">
              <option value="">All Transactions</option>
              <option value="Lease Escrow">Lease Escrow</option>
              <option value="Subscriptions">Subscriptions</option>
            </select>
            <button
              onClick={() => { setSearch(""); setTypeFilter(""); }}
              className="p-2 text-gray-400 hover:text-sidebar-bg border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              title="Reset Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                {[
                  "Transaction ID / Date",
                  "Beneficiary / Payer",
                  "Type & Details",
                  "Amount (Ksh)",
                  "Platform Fee",
                  "Status & Conditions",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-4 ${h === "Amount (Ksh)" ? "text-right" : h === "Platform Fee" ? "text-center" : h === "Action" ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-green-50/30 transition-colors group"
                >
                  <td className="px-5 py-4 align-top">
                    <span className="block font-mono text-gray-800 font-bold text-xs">
                      {tx.id}
                    </span>
                    <span className="block text-xs text-gray-400 mt-1">
                      {tx.date}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${tx.partyBg} text-white flex items-center justify-center font-bold text-xs`}
                      >
                        {tx.partyInitials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {tx.beneficiary}
                        </p>
                        <p className="text-xs text-gray-500">
                          From: {tx.from}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold mb-1 ${tx.typeBg}`}
                    >
                      {tx.typeLabel}
                    </span>
                    <p className="text-xs text-gray-600">{tx.detail}</p>
                  </td>
                  <td className="px-5 py-4 align-top text-right font-bold text-gray-800">
                    {tx.amount}
                  </td>
                  <td className="px-5 py-4 align-top text-center text-xs text-gray-500">
                    {tx.feeRate ? (
                      <>
                        <span className="font-semibold text-green-600">
                          {tx.fee}
                        </span>{" "}
                        ({tx.feeRate})
                      </>
                    ) : (
                      <span className="font-semibold text-gray-400">
                        {tx.fee}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex w-fit items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tx.statusBg}`}
                      >
                        {tx.pulse && (
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        )}
                        {tx.statusLabel}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {tx.statusNote}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top text-right">
                    <button className="text-gray-400 hover:text-earth transition p-1 rounded hover:bg-gray-100">
                      {actionIcon(tx.actionIcon)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} of 128 transactions
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="px-3 py-1 bg-white border border-gray-200 text-gray-300 rounded text-xs font-medium cursor-not-allowed"
            >
              Previous
            </button>
            <button className="px-3 py-1 bg-sidebar-bg text-white rounded text-xs font-medium hover:opacity-90 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
