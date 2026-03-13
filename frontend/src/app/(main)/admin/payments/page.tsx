"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Landmark,
  ArrowUpRight,
  DollarSign,
  SlidersHorizontal,
  TrendingUp,
  Search,
  FileDown,
  Filter,
  MoreVertical,
  FileText,
  History,
  CheckCircle,
  Loader2,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminApi } from "@/lib/services/api";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PaymentStats {
  escrow_total: number;
  released_funds: number;
  platform_revenue: number;
  total_transactions: number;
}

interface TxRow {
  id: string;
  date: string;
  partyInitials: string;
  partyBgHex: string;
  beneficiary: string;
  from: string;
  typeLabel: string;
  isLeaseType: boolean;
  detail: string;
  amount: string;
  fee: string;
  feeRate: string;
  statusLabel: string;
  statusBg: string;
  statusNote: string;
  pulse: boolean;
}

interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface PaymentsData {
  stats: PaymentStats;
  transactions: TxRow[];
  pagination: Pagination;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatKsh(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

const actionIconEl = (type: string) => {
  switch (type) {
    case "file":
      return <FileText className="w-4 h-4" />;
    case "history":
      return <History className="w-4 h-4" />;
    default:
      return <MoreVertical className="w-4 h-4" />;
  }
};

// ── Page ───────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [data, setData] = useState<PaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(
    async (searchVal: string, typeVal: string, pageVal: number) => {
      try {
        setLoading(true);
        setError(null);
        const params: Record<string, string | number> = { page: pageVal, page_size: 20 };
        if (searchVal) params.search = searchVal;
        if (typeVal) params.type = typeVal;
        const { data: resp } = await adminApi.adminPayments(params);
        setData(resp);
      } catch (err: unknown) {
        const e = err as { response?: { status?: number } };
        if (e?.response?.status === 403) {
          setError("Access denied. Admin privileges required.");
        } else {
          setError("Failed to load payments data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(search, typeFilter, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
    fetchData(val, typeFilter, 1);
  };

  const handleTypeFilter = (val: string) => {
    setTypeFilter(val);
    setPage(1);
    fetchData(search, val, 1);
  };

  const handleReset = () => {
    setSearch("");
    setTypeFilter("");
    setPage(1);
    fetchData("", "", 1);
  };

  const handlePrev = () => {
    if (page > 1) {
      const next = page - 1;
      setPage(next);
      fetchData(search, typeFilter, next);
    }
  };

  const handleNext = () => {
    const totalPages = data?.pagination.total_pages ?? 1;
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      fetchData(search, typeFilter, next);
    }
  };

  const stats = data?.stats;
  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Escrow & Payments Ledger"
        subtitle="Monitor real-time financial flows, escrow holdings, and subscription revenue across the platform."
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-sidebar-bg text-white rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
          <FileDown className="w-4 h-4" />
          Export Ledger
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search transactions..."
            className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-52 shadow-sm"
          />
        </div>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

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
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white/60" />
                ) : (
                  <span className="text-2xl font-bold tracking-tight">
                    Ksh {stats ? formatKsh(stats.escrow_total) : "0"}
                  </span>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/60">
                  <span className="flex items-center text-[#13ec80]">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    Active accounts
                  </span>
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
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">
                    Ksh {stats ? formatKsh(stats.released_funds) : "0"}
                  </span>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center text-sidebar-bg font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 mr-0.5" />
                    Released escrow
                  </span>
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
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <span className="text-2xl font-bold text-gray-800 tracking-tight">
                    Ksh {stats ? formatKsh(stats.platform_revenue) : "0"}
                  </span>
                )}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center text-emerald-700 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    Completed transactions
                  </span>
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
                onChange={(e) => handleTypeFilter(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20"
              >
                <option value="">All Transactions</option>
                <option value="rent_payment">Lease Escrow</option>
                <option value="escrow_release">Escrow Release</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="deposit">Deposits</option>
              </select>
              <button
                onClick={handleReset}
                className="p-2 text-gray-400 hover:text-sidebar-bg border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                title="Reset Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 animate-spin text-sidebar-bg" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <DollarSign className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">No transactions found</p>
                <p className="text-xs mt-1">
                  {search || typeFilter ? "Try adjusting your filters." : "No payment records exist yet."}
                </p>
              </div>
            ) : (
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
                  {transactions.map((tx) => (
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
                            className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs"
                            style={{ backgroundColor: tx.partyBgHex }}
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
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold mb-1 ${
                            tx.isLeaseType
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
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
                          {actionIconEl("more")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {pagination
                ? `Showing ${(pagination.page - 1) * pagination.page_size + 1}–${Math.min(
                    pagination.page * pagination.page_size,
                    pagination.total
                  )} of ${pagination.total} transactions`
                : "Loading…"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={page <= 1 || loading}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded text-xs font-medium hover:bg-gray-50 transition disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!pagination || page >= pagination.total_pages || loading}
                className="px-3 py-1 bg-sidebar-bg text-white rounded text-xs font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
