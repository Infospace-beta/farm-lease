import PageHeader from "@/components/owner/PageHeader";
import StatCard from "@/components/owner/StatCard";

const transactions = [
  { id: "TXN-001", plot: "Highland North", tenant: "John Doe",   amount: "Ksh 50,000",  type: "credit",  date: "Feb 01, 2026", status: "Completed" },
  { id: "TXN-002", plot: "Sunset Orchards", tenant: "GreenLeaf", amount: "Ksh 120,000", type: "credit",  date: "Feb 01, 2026", status: "Completed" },
  { id: "TXN-003", plot: "Highland North", tenant: "John Doe",   amount: "Ksh 50,000",  type: "credit",  date: "Jan 01, 2026", status: "Completed" },
  { id: "TXN-004", plot: "Eastern Ridge",  tenant: "Jane Smith", amount: "Ksh 45,000",  type: "pending", date: "Feb 15, 2026", status: "Pending" },
  { id: "TXN-005", plot: "Valley Farms",   tenant: "Michael K.", amount: "Ksh 60,000",  type: "escrow",  date: "Feb 10, 2026", status: "In Escrow" },
  { id: "TXN-006", plot: "Sunset Orchards", tenant: "GreenLeaf", amount: "Ksh 120,000", type: "credit",  date: "Jan 01, 2026", status: "Completed" },
];

const MONTHS = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
const VALUES = [180, 210, 195, 220, 250, 320, 170];
const MAX = 320;

export default function FinancialsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
        <PageHeader
          title="Financials"
          description="Track your revenue, escrow releases and payment history."
          actions={[
            { label: "Download Statement", icon: "download" },
            { label: "Request Withdrawal", icon: "payments", variant: "primary" },
          ]}
        />

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Revenue (YTD)" value="Ksh 1.94M" badge="+22.4%" badgeUp={true} sub="vs last year"
            chart={
              <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                <path d="M0 35 Q25 30 40 20 T70 15 T100 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            }
          />
          <StatCard label="Monthly Revenue" value="Ksh 170k" badge="−32%" badgeUp={false} sub="vs last month"
            chart={
              <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                <path d="M0 10 L25 15 L50 8 L75 18 L100 30" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            }
          />
          <StatCard label="In Escrow" value="Ksh 60k" badge="0.0%" badgeUp={null} sub="awaiting release"
            chart={
              <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                <path d="M0 20 H100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
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
            {MONTHS.map((m, i) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-slate-500">{Math.round(VALUES[i])}k</span>
                <div
                  className="w-full rounded-t-md bg-primary/20 hover:bg-primary/40 transition-colors"
                  style={{ height: `${(VALUES[i] / MAX) * 120}px` }}
                  title={`Ksh ${VALUES[i]}k`}
                />
                <span className="text-xs text-slate-400">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions table */}
        <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-earth" style={{ fontFamily: "'Playfair Display', serif" }}>Transaction History</h3>
            <button className="text-xs font-semibold text-primary hover:underline">View All</button>
          </div>
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
                    <td className="px-6 py-4 font-medium text-slate-800">{t.plot}</td>
                    <td className="px-6 py-4 text-slate-600">{t.tenant}</td>
                    <td className="px-6 py-4 text-slate-500">{t.date}</td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      t.type === "credit" ? "text-emerald-600" :
                      t.type === "pending" ? "text-amber-600" : "text-blue-600"
                    }`}>{t.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        t.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                        t.status === "Pending"   ? "bg-amber-100 text-amber-700" :
                                                   "bg-blue-100 text-blue-700"
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
