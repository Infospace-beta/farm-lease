"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/owner/StatCard";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";

interface Transaction {
  id: string;
  land_title: string;
  lessee_name: string;
  amount: number;
  type: "credit" | "pending" | "escrow";
  date: string;
  status: "Completed" | "Pending" | "In Escrow";
}

interface RevenueSummary {
  total_revenue_ytd: number;
  monthly_revenue: number;
  in_escrow: number;
  ytd_change_percent: number;
  monthly_change_percent: number;
}

const MONTHS = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

export default function FinancialsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [chartData, setChartData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all financial data in parallel
      const [transactionsRes, summaryRes, chartRes] = await Promise.all([
        ownerApi.transactions({ period: "all" }),
        ownerApi.revenueSummary(),
        ownerApi.revenueChart("7months"),
      ]);

      setTransactions(transactionsRes.data.results || []);
      setSummary(summaryRes.data);
      setChartData(chartRes.data.values || []);
    } catch (err: any) {
      console.error("Failed to load financial data:", err);
      setError(err.response?.data?.detail || "Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Ksh ${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
      return `Ksh ${(amount / 1000).toFixed(0)}k`;
    }
    return `Ksh ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const MAX = chartData.length > 0 ? Math.max(...chartData) : 320;
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Financials"
        subtitle="Track your revenue, escrow releases and payment history."
      >
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-base">download</span>
          Download Statement
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors">
          <span className="material-symbols-outlined text-base">payments</span>
          Request Withdrawal
        </button>
      </OwnerPageHeader>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-slate-500">Loading financial data...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadFinancialData}
                className="mt-3 text-sm font-semibold text-red-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Total Revenue (YTD)"
                  value={summary ? formatCurrency(summary.total_revenue_ytd) : "Ksh 0"}
                  badge={summary ? `${summary.ytd_change_percent > 0 ? '+' : ''}${summary.ytd_change_percent.toFixed(1)}%` : "0%"}
                  badgeUp={summary ? summary.ytd_change_percent > 0 : null}
                  sub="vs last year"
                  chart={
                    <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                      <path d="M0 35 Q25 30 40 20 T70 15 T100 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  }
                />
                <StatCard
                  label="Monthly Revenue"
                  value={summary ? formatCurrency(summary.monthly_revenue) : "Ksh 0"}
                  badge={summary ? `${summary.monthly_change_percent > 0 ? '+' : ''}${summary.monthly_change_percent.toFixed(1)}%` : "0%"}
                  badgeUp={summary ? summary.monthly_change_percent > 0 : null}
                  sub="vs last month"
                  chart={
                    <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                      <path d="M0 10 L25 15 L50 8 L75 18 L100 30" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  }
                />
                <StatCard
                  label="In Escrow"
                  value={summary ? formatCurrency(summary.in_escrow) : "Ksh 0"}
                  badge="0.0%"
                  badgeUp={null}
                  sub="awaiting release"
                  chart={
                    <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                      <path d="M0 20 H100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  }
                />
              </div>

              {/* Revenue chart */}
              <div className="mb-6 rounded-lg bg-white border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-earth" style={{ fontFamily: "'Playfair Display', serif" }}>Revenue Trend</h3>
                  <span className="text-xs text-slate-400">Last 7 months</span>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {chartData.length > 0 ? (
                    chartData.map((value, i) => (
                      <div key={MONTHS[i] || i} className="flex flex-1 flex-col items-center gap-1">
                        <span className="text-xs text-slate-500">{Math.round(value / 1000)}k</span>
                        <div
                          className="w-full rounded-t-md bg-primary/20 hover:bg-primary/40 transition-colors"
                          style={{ height: `${(value / MAX) * 120}px` }}
                          title={formatCurrency(value)}
                        />
                        <span className="text-xs text-slate-400">{MONTHS[i] || ""}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 text-center text-sm text-slate-400">
                      No chart data available
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions table */}
              <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-earth" style={{ fontFamily: "'Playfair Display', serif" }}>Transaction History</h3>
                  <button className="text-xs font-semibold text-primary hover:underline">View All</button>
                </div>

                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                      receipt_long
                    </span>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-sm text-slate-500">
                      Your transaction history will appear here once you start receiving payments.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-6 py-3 text-left">ID</th>
                          <th className="px-6 py-3 text-left">Plot</th>
                          <th className="px-6 py-3 text-left">Tenant</th>
                          <th className="px-6 py-3 text-left">Date</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-slate-500">{t.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">{t.land_title}</td>
                            <td className="px-6 py-4 text-slate-600">{t.lessee_name}</td>
                            <td className="px-6 py-4 text-slate-500">{formatDate(t.date)}</td>
                            <td className={`px-6 py-4 text-right font-bold ${
                              t.type === "credit" ? "text-emerald-600" :
                              t.type === "pending" ? "text-amber-600" : "text-blue-600"
                            }`}>
                              {formatCurrency(t.amount)}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                t.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                                t.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                "bg-blue-100 text-blue-700"
                              }`}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
