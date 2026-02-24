import LesseePageHeader from "@/components/lessee/LesseePageHeader";

const transactions = [
  {
    id: "TXN-0041",
    description: "Plot A4-North — Monthly Lease Payment",
    date: "Jun 1, 2024",
    amount: "Ksh 37,500",
    method: "Escrow",
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-700",
    amountColor: "text-red-500",
  },
  {
    id: "TXN-0040",
    description: "Plot D1-River Bank — Monthly Lease Payment",
    date: "Jun 1, 2024",
    amount: "Ksh 24,000",
    method: "M-Pesa",
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-700",
    amountColor: "text-red-500",
  },
  {
    id: "TXN-0039",
    description: "Plot B2-East — Escrow Deposit",
    date: "May 28, 2024",
    amount: "Ksh 22,000",
    method: "Escrow",
    status: "In Escrow",
    statusColor: "bg-amber-100 text-amber-600",
    amountColor: "text-amber-600",
  },
  {
    id: "TXN-0038",
    description: "Plot A4-North — Monthly Lease Payment",
    date: "May 1, 2024",
    amount: "Ksh 37,500",
    method: "Escrow",
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-700",
    amountColor: "text-red-500",
  },
];

const monthlyData = [
  { month: "Jan", amount: 61.5 },
  { month: "Feb", amount: 61.5 },
  { month: "Mar", amount: 83.5 },
  { month: "Apr", amount: 61.5 },
  { month: "May", amount: 61.5 },
  { month: "Jun", amount: 61.5 },
];

const maxAmount = 100;

export default function FinancialsPage() {
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

      <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Expenditure Trends */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className="font-bold text-gray-800 text-lg"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Expenditure Trends
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Monthly lease payment breakdown
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                  {["3M", "6M", "1Y"].map((t, i) => (
                    <button
                      key={t}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${i === 1 ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="relative h-48 flex items-end gap-3 pl-10">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-400">
                  <span>100k</span>
                  <span>75k</span>
                  <span>50k</span>
                  <span>25k</span>
                  <span>0</span>
                </div>

                {monthlyData.map((d, i) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center justify-end gap-1"
                  >
                    <span className="text-[10px] font-bold text-[#047857]">
                      {d.amount}k
                    </span>
                    <div
                      className={`w-full rounded-t-xl transition-all ${i === 5 ? "bg-[#0f392b]" : "bg-[#047857]/30 hover:bg-[#047857]/50"}`}
                      style={{ height: `${(d.amount / maxAmount) * 160}px` }}
                    />
                    <span className="text-[10px] text-gray-400 mt-1">
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-4">
                {[
                  {
                    label: "Average Monthly",
                    value: "Ksh 61.5k",
                    color: "text-gray-800",
                  },
                  {
                    label: "Highest Month",
                    value: "Ksh 83.5k (Mar)",
                    color: "text-[#047857]",
                  },
                  {
                    label: "6-Month Total",
                    value: "Ksh 369k",
                    color: "text-[#0f392b]",
                  },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className={`text-base font-extrabold ${s.color}`}>
                      {s.value}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3
                  className="font-bold text-gray-800"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Recent Transactions
                </h3>
                <button className="text-xs text-[#047857] font-semibold hover:text-emerald-700">
                  View All
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/70">
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                      Transaction
                    </th>
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                      Date
                    </th>
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                      Method
                    </th>
                    <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-gray-800 text-sm">
                          {txn.description}
                        </div>
                        <div className="text-xs text-gray-400">{txn.id}</div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600">
                        {txn.date}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                          {txn.method}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${txn.statusColor}`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-3.5 text-right font-extrabold text-sm ${txn.amountColor}`}
                      >
                        {txn.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Total Paid YTD */}
            <div className="bg-gradient-to-br from-[#0f392b] to-[#1c4a3a] rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-icons-round text-[#13ec80] text-xl">
                  account_balance_wallet
                </span>
                <span className="text-sm font-medium text-[#13ec80]">
                  Total Paid YTD
                </span>
              </div>
              <div className="text-4xl font-extrabold mt-3 mb-1">Ksh 248k</div>
              <div className="text-sm text-white/60">January — June 2024</div>

              <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-white/50 mb-1">
                    Active Leases
                  </div>
                  <div className="text-lg font-bold">3 Plots</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Avg / Month</div>
                  <div className="text-lg font-bold">Ksh 41.3k</div>
                </div>
              </div>
            </div>

            {/* Upcoming Escrow */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3
                className="font-bold text-gray-800 mb-4 flex items-center gap-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-amber-500 text-xl">
                  lock_clock
                </span>
                Upcoming Escrow
              </h3>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-800">
                      Plot B2-East
                    </span>
                    <span className="text-xs font-extrabold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      Due in 5 days
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-[#0f392b] mb-1">
                    Ksh 22,000
                  </div>
                  <div className="text-xs text-gray-500">
                    July 1, 2024 · Escrow Release
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                    <span className="material-icons-round text-base">info</span>
                    Awaiting lessor sign-off
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-800">
                      Plot C1-South
                    </span>
                    <span className="text-xs text-gray-500">Jul 15, 2024</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#0f392b] mb-1">
                    Ksh 18,500
                  </div>
                  <div className="text-xs text-gray-500">
                    Monthly lease payment
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3
                className="font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Payment Methods
              </h3>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#047857] rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-white text-lg">
                      phone_android
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      M-Pesa
                    </div>
                    <div className="text-[10px] text-gray-500">
                      +254 712 *** 890
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-[#13ec80] text-[#0f392b] px-2 py-0.5 rounded-full font-extrabold">
                  Primary
                </span>
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
