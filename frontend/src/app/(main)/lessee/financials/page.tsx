"use client";
import { useState, useEffect, useMemo } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

interface Payment {
  id: string;
  description: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

function mapPayment(p: Record<string, unknown>): Payment {
  const amt = Number(p.amount ?? 0);
  const lease = (p.lease ?? {}) as Record<string, unknown>;
  return {
    id: (p.id ?? p.transaction_id ?? "—") as string,
    description: (p.description ?? `${lease.land_title ?? "Lease"} — Payment`) as string,
    date: p.payment_date ? new Date(p.payment_date as string).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" }) : "—",
    amount: amt,
    method: (p.payment_method ?? p.method ?? "M-Pesa") as string,
    status: (p.status ?? "Completed") as string,
  };
}

function getStatusColors(status: string): { statusColor: string; amountColor: string } {
  const s = status?.toLowerCase();
  if (s === "completed") return { statusColor: "bg-emerald-100 text-emerald-700", amountColor: "text-red-500" };
  if (s === "in escrow" || s === "escrow") return { statusColor: "bg-amber-100 text-amber-600", amountColor: "text-amber-600" };
  if (s === "pending") return { statusColor: "bg-blue-100 text-blue-700", amountColor: "text-gray-700" };
  return { statusColor: "bg-gray-100 text-gray-600", amountColor: "text-gray-700" };
}

export default function FinancialsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = () => {
    setLoading(true);
    setError(null);
    lesseeApi.myPayments()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setPayments(data.map(mapPayment));
      })
      .catch(() => setError("Could not load payment history."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const summary = useMemo(() => {
    const completed = payments.filter((p) => p.status?.toLowerCase() === "completed");
    const total = completed.reduce((s, p) => s + p.amount, 0);
    const avg = completed.length > 0 ? total / completed.length : 0;
    return { total, avg, count: completed.length };
  }, [payments]);

  // Build last-6-month bar chart from actual payments
  const monthlyChart = useMemo(() => {
    const now = new Date();
    const months: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-KE", { month: "short" });
      const amount = payments
        .filter((p) => {
          if (!p.date || p.date === "—") return false;
          const pd = new Date(p.date);
          return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth();
        })
        .reduce((s, p) => s + p.amount, 0);
      months.push({ month: label, amount });
    }
    return months;
  }, [payments]);

  const maxChart = Math.max(...monthlyChart.map((m) => m.amount), 1);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="Financials"
        subtitle="Track payments, escrow balances and expenditure trends"
      >
        <button className="flex items-center gap-2 border border-gray-200 hover:border-[#047857] text-gray-700 hover:text-[#047857] text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
          <span className="material-icons-round text-lg">file_download</span>
          Export Statement
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Expenditure Trends */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "Playfair Display, serif" }}>
                    Expenditure Trends
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Monthly lease payment breakdown</p>
                </div>
              </div>

              {/* Bar Chart */}
              {loading ? (
                <div className="h-48 bg-gray-50 animate-pulse rounded-xl" />
              ) : (
                <div className="relative h-48 flex items-end gap-3 pl-10">
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-400">
                    <span>{Math.round(maxChart / 1000)}k</span>
                    <span>{Math.round(maxChart * 0.75 / 1000)}k</span>
                    <span>{Math.round(maxChart * 0.5 / 1000)}k</span>
                    <span>{Math.round(maxChart * 0.25 / 1000)}k</span>
                    <span>0</span>
                  </div>
                  {monthlyChart.map((d, i) => (
                    <div key={d.month} className="flex-1 flex flex-col items-center justify-end gap-1">
                      {d.amount > 0 && <span className="text-[10px] font-bold text-[#047857]">{Math.round(d.amount / 1000)}k</span>}
                      <div
                        className={`w-full rounded-t-xl transition-all ${i === monthlyChart.length - 1 ? "bg-[#0f392b]" : "bg-[#047857]/30 hover:bg-[#047857]/50"}`}
                        style={{ height: `${(d.amount / maxChart) * 160}px`, minHeight: d.amount > 0 ? "4px" : "0" }}
                      />
                      <span className="text-[10px] text-gray-400 mt-1">{d.month}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4">
                {loading ? (
                  [0, 1, 2].map((i) => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)
                ) : [
                  { label: "Average Monthly", value: summary.avg >= 1000 ? `Ksh ${Math.round(summary.avg / 1000)}k` : `Ksh ${summary.avg.toLocaleString()}`, color: "text-gray-800" },
                  { label: "Total YTD", value: summary.total >= 1000 ? `Ksh ${Math.round(summary.total / 1000)}k` : `Ksh ${summary.total.toLocaleString()}`, color: "text-[#047857]" },
                  { label: "Transactions", value: `${summary.count}`, color: "text-[#0f392b]" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`text-base font-extrabold ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>
                  Recent Transactions
                </h3>
                <button className="text-xs text-[#047857] font-semibold hover:text-emerald-700">View All</button>
              </div>
              {error ? (
                <div className="flex flex-col items-center py-12">
                  <p className="text-gray-500 text-sm">{error}</p>
                  <button onClick={fetchPayments} className="mt-3 px-4 py-2 bg-[#0f392b] text-white text-xs font-semibold rounded-xl">Retry</button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/70">
                        {["Transaction", "Date", "Method", "Status", "Amount"].map((h) => (
                          <th key={h} className={`text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3 ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loading ? (
                        [0, 1, 2, 3].map((i) => (
                          <tr key={i}>
                            {[0, 1, 2, 3, 4].map((j) => (
                              <td key={j} className="px-6 py-4"><div className="h-4 bg-gray-100 animate-pulse rounded" /></td>
                            ))}
                          </tr>
                        ))
                      ) : payments.length === 0 ? (
                        <tr><td colSpan={5} className="py-16 text-center text-gray-400 text-sm">No transactions yet</td></tr>
                      ) : (
                        payments.map((txn) => {
                          const { statusColor, amountColor } = getStatusColors(txn.status);
                          return (
                            <tr key={txn.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-3.5">
                                <div className="font-medium text-gray-800 text-sm">{txn.description}</div>
                                <div className="text-xs text-gray-400">{txn.id}</div>
                              </td>
                              <td className="px-6 py-3.5 text-sm text-gray-600">{txn.date}</td>
                              <td className="px-6 py-3.5">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{txn.method}</span>
                              </td>
                              <td className="px-6 py-3.5">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusColor}`}>{txn.status}</span>
                              </td>
                              <td className={`px-6 py-3.5 text-right font-extrabold text-sm ${amountColor}`}>
                                Ksh {txn.amount.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Total Paid YTD */}
            <div className="bg-gradient-to-br from-[#0f392b] to-[#1c4a3a] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-[#13ec80] text-xl">account_balance_wallet</span>
                <span className="text-sm font-medium text-[#13ec80]">Total Paid YTD</span>
              </div>
              {loading ? (
                <div className="h-10 w-40 bg-white/10 animate-pulse rounded mt-3 mb-1" />
              ) : (
                <div className="text-4xl font-extrabold mt-3 mb-1">
                  {summary.total >= 1000 ? `Ksh ${Math.round(summary.total / 1000)}k` : `Ksh ${summary.total.toLocaleString()}`}
                </div>
              )}
              <div className="text-sm text-white/60">This year</div>
              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/50 mb-1">Transactions</div>
                  <div className="text-lg font-bold">{loading ? "—" : summary.count}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Avg / Month</div>
                  <div className="text-lg font-bold">
                    {loading ? "—" : summary.avg >= 1000 ? `Ksh ${Math.round(summary.avg / 1000)}k` : `Ksh ${summary.avg.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Payment Methods
              </h3>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#047857] rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-white text-lg">phone_android</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">M-Pesa</div>
                    <div className="text-[10px] text-gray-500">+254 712 *** 890</div>
                  </div>
                </div>
                <span className="text-[10px] bg-[#13ec80] text-[#0f392b] px-2 py-0.5 rounded-full font-extrabold">Primary</span>
              </div>
              <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#047857] text-gray-500 hover:text-[#047857] text-sm font-medium py-3 rounded-xl transition-all">
                <span className="material-icons-round text-lg">add</span>
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
