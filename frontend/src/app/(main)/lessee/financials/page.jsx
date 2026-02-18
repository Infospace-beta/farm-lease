"use client";

import { useState } from "react";
import Link from "next/link";
import LesseeSidebar from "../../../../components/shared/LesseeSidebar";
import LesseeHeader from "../../../../components/shared/LesseeHeader";
import {
  Download,
  Plus,
  Search,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Calendar,
  CalendarClock,
  TrendingUp,
} from "lucide-react";

function LesseeFinancials() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample expenditure data for the chart
  const expenditureData = [
    { month: "Jan", amount: 32000, height: 40 },
    { month: "Feb", amount: 28000, height: 35 },
    { month: "Mar", amount: 45000, height: 55 },
    { month: "Apr", amount: 38000, height: 45 },
    { month: "May", amount: 52000, height: 65 },
    { month: "Jun", amount: 85000, height: 85 },
  ];

  // Sample transaction data
  const transactions = [
    {
      id: "MP-8X92-J7K",
      date: "Jun 15, 2024",
      time: "10:42 AM",
      description: "Lease Payment (Escrow)",
      item: "Plot A4 - North",
      amount: -45000,
      status: "Completed",
      statusColor: "green",
    },
    {
      id: "MP-7Y22-L9M",
      date: "Jun 12, 2024",
      time: "02:15 PM",
      description: "Input Purchase",
      item: "DAP Fertilizer (x5)",
      amount: -17500,
      status: "Completed",
      statusColor: "green",
    },
    {
      id: "MP-5B11-Q2P",
      date: "Jun 08, 2024",
      time: "09:30 AM",
      description: "Soil Test Fee",
      item: "Lab Analysis - Plot B2",
      amount: -3000,
      status: "Completed",
      statusColor: "green",
    },
    {
      id: "MP-2A44-Z8R",
      date: "May 30, 2024",
      time: "04:20 PM",
      description: "Wallet Deposit",
      item: "M-Pesa Topup",
      amount: 50000,
      status: "Received",
      statusColor: "green",
    },
  ];

  // Sample upcoming payments
  const upcomingPayments = [
    {
      id: 1,
      title: "Plot B2 - East",
      subtitle: "Lease Installment 2/4",
      amount: 22000,
      dueText: "Due in 5 days",
      urgent: true,
    },
    {
      id: 2,
      title: "Plot C1 - South",
      subtitle: "Final Payment",
      amount: 18500,
      dueText: "Due: Jul 15",
      urgent: false,
    },
  ];

  const formatCurrency = (amount) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000) {
      return `${amount < 0 ? "- " : "+ "}Ksh ${(absAmount / 1000).toFixed(0)}k`;
    }
    return `${amount < 0 ? "- " : "+ "}Ksh ${absAmount.toLocaleString()}`;
  };

  const formatAmount = (amount) => {
    return `${amount < 0 ? "- " : "+ "}Ksh ${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <div className="bg-background-light min-h-screen flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <LesseeSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <LesseeHeader
          title="Financials & Payments"
          subtitle="Track your lease expenditures, upcoming escrow payments, and transaction history."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          rightContent={
            <>
              <button className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm">
                <Download className="w-4 h-4" />
                <span className="font-medium text-sm hidden sm:inline">
                  Export Report
                </span>
              </button>
              <button className="flex px-5 py-2.5 bg-forest-green text-white rounded-lg items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-forest-green/20">
                <Plus className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm hidden sm:inline">
                  Add Funds
                </span>
              </button>
            </>
          }
        />

        {/* Content area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 bg-background-light p-4 lg:p-8 overflow-y-auto">
            <div className="grid grid-cols-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-8">
              {/* Left Column - Charts & Transactions */}
              <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8 flex flex-col min-w-0">
                {/* Expenditure Trends Chart */}
                <div className="bg-white p-6 lg:p-8 rounded-3xl border border-gray-100 shadow-soft">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 font-serif">
                        Expenditure Trends (Ksh)
                      </h3>
                      <p className="text-sm text-gray-400">
                        Monthly spending across all active leases
                      </p>
                    </div>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      {["1M", "6M", "1Y", "ALL"].map((period) => (
                        <button
                          key={period}
                          onClick={() => setSelectedPeriod(period)}
                          className={`px-3 py-1 text-xs font-bold transition rounded ${
                            selectedPeriod === period
                              ? "text-white bg-forest-green shadow-sm"
                              : "text-gray-500 hover:text-forest-green"
                          }`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="relative h-80 w-full rounded-xl p-4 bg-gradient-to-br from-gray-50/50 to-transparent">
                    {/* Grid Background */}
                    <div className="absolute inset-0 opacity-20">
                      <div
                        className="h-full w-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
                          backgroundSize: "40px 40px",
                        }}
                      ></div>
                    </div>

                    {/* Bar Chart */}
                    <div className="absolute inset-0 flex items-end justify-between px-4 sm:px-12 pb-8 pt-12 gap-2 sm:gap-4">
                      {expenditureData.map((data, index) => (
                        <div
                          key={data.month}
                          className="flex flex-col items-center justify-end h-full w-full gap-1 group cursor-pointer"
                        >
                          <div
                            className={`w-full max-w-[6px] sm:max-w-[8px] rounded-t-lg transition-all relative ${
                              index === expenditureData.length - 1
                                ? "bg-primary shadow-[0_0_10px_rgba(19,236,128,0.4)]"
                                : "bg-gray-200 group-hover:bg-primary"
                            }`}
                            style={{ height: `${data.height}%` }}
                          >
                            <div
                              className={`absolute -top-9 left-1/2 -translate-x-1/2 bg-forest-green text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10 transition-opacity ${
                                index === expenditureData.length - 1
                                  ? "opacity-100 font-bold"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                            >
                              {formatCurrency(-data.amount)}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-mono mt-2 ${
                              index === expenditureData.length - 1
                                ? "text-forest-green font-bold"
                                : "text-gray-400"
                            }`}
                          >
                            {data.month}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Trend Line */}
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none px-4 sm:px-12 pb-10 pt-12"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <path
                        d="M5,60 L20,65 L35,45 L50,55 L65,35 L80,15"
                        fill="none"
                        stroke="#13ec80"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M5,60 L20,65 L35,45 L50,55 L65,35 L80,15 V100 H5 Z"
                        fill="url(#gradient)"
                        opacity="0.1"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#13ec80" />
                          <stop
                            offset="100%"
                            stopColor="#ffffff"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-bold text-earth-brown font-serif">
                      Recent Transactions
                    </h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-forest-green"
                        placeholder="Search M-Pesa Code..."
                      />
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                          <th className="px-6 py-4">Transaction ID</th>
                          <th className="px-6 py-4">Date & Time</th>
                          <th className="px-6 py-4">Description</th>
                          <th className="px-6 py-4">Lease / Item</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {transactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="hover:bg-gray-50 transition-colors group"
                          >
                            <td className="px-6 py-4 font-mono text-gray-600">
                              {transaction.id}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {transaction.date}
                              <span className="text-xs text-gray-400 block">
                                {transaction.time}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-800">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {transaction.item}
                            </td>
                            <td
                              className={`px-6 py-4 font-bold ${
                                transaction.amount < 0
                                  ? "text-forest-green"
                                  : "text-earth-brown"
                              }`}
                            >
                              {formatAmount(transaction.amount)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 bg-${transaction.statusColor}-100 text-${transaction.statusColor}-700 rounded-full text-xs font-bold`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-gray-400 hover:text-forest-green transition">
                                <Receipt className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden divide-y divide-gray-100">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-mono text-xs text-gray-500 mb-1">
                              {transaction.id}
                            </p>
                            <p className="font-medium text-gray-800">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {transaction.item}
                            </p>
                          </div>
                          <button className="text-gray-400 hover:text-forest-green transition">
                            <Receipt className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <div className="text-xs text-gray-500">
                            {transaction.date} • {transaction.time}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                              {transaction.status}
                            </span>
                            <span
                              className={`font-bold ${
                                transaction.amount < 0
                                  ? "text-forest-green"
                                  : "text-earth-brown"
                              }`}
                            >
                              {formatAmount(transaction.amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Showing 4 of 128 transactions
                    </p>
                    <div className="flex gap-2">
                      <button className="p-1 rounded hover:bg-white disabled:opacity-50 transition text-gray-400">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button className="p-1 rounded hover:bg-white transition text-gray-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Summary Cards */}
              <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
                {/* Total Paid Card */}
                <div className="bg-forest-green rounded-3xl p-6 shadow-xl relative overflow-hidden text-white group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-white/90">
                        Total Paid (YTD)
                      </h3>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold font-display tracking-tight">
                        Ksh 248k
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +15%
                        </span>
                        <span className="text-xs text-white/60">
                          vs last year
                        </span>
                      </div>
                    </div>

                    <button className="w-full py-3 bg-white text-forest-green font-bold rounded-xl hover:bg-gray-50 transition shadow-lg">
                      View Analysis
                    </button>
                  </div>
                </div>

                {/* Upcoming Escrow Payments */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-earth-brown font-serif">
                      Upcoming Escrow
                    </h3>
                    <button className="text-xs font-bold text-forest-green hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {upcomingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className={`p-4 rounded-2xl border relative group transition-colors ${
                          payment.urgent
                            ? "bg-gray-50 border-gray-100 hover:border-primary/30"
                            : "bg-white border-gray-100 hover:border-gray-300 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">
                              {payment.dueText}
                            </p>
                            <h4 className="font-bold text-gray-800">
                              {payment.title}
                            </h4>
                          </div>
                          <div
                            className={`p-1.5 rounded-lg shadow-sm border ${
                              payment.urgent
                                ? "bg-white border-gray-100"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            {payment.urgent ? (
                              <Calendar className="w-4 h-4 text-forest-green" />
                            ) : (
                              <CalendarClock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <p className="text-sm text-gray-500">
                            {payment.subtitle}
                          </p>
                          <p
                            className={`font-bold text-lg ${
                              payment.urgent
                                ? "text-forest-green"
                                : "text-earth-brown"
                            }`}
                          >
                            Ksh {payment.amount.toLocaleString()}
                          </p>
                        </div>

                        {payment.urgent && (
                          <button className="mt-4 w-full py-2 bg-forest-green text-white text-sm font-bold rounded-lg hover:bg-forest-light transition shadow-md shadow-forest-green/20">
                            Pay Now
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LesseeFinancials;
