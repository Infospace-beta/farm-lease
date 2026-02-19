import PageHeader from "@/components/owner/PageHeader";

const escrows = [
  {
    id: "ESC-001", plot: "Highland North", tenant: "John Doe",
    amount: "Ksh 50,000", deposited: "Jan 28, 2026", releaseDate: "Feb 28, 2026",
    status: "released", stages: [
      { label: "Lease Signed",      done: true,  date: "Jan 20, 2026" },
      { label: "Escrow Deposited",  done: true,  date: "Jan 28, 2026" },
      { label: "30-day Hold",       done: true,  date: "Jan 28 – Feb 27" },
      { label: "Released to Owner", done: true,  date: "Feb 28, 2026" },
    ],
  },
  {
    id: "ESC-002", plot: "Valley Farms", tenant: "Michael K.",
    amount: "Ksh 60,000", deposited: "Feb 10, 2026", releaseDate: "Mar 11, 2026",
    status: "holding", stages: [
      { label: "Lease Signed",      done: true,  date: "Feb 5, 2026" },
      { label: "Escrow Deposited",  done: true,  date: "Feb 10, 2026" },
      { label: "30-day Hold",       done: false, date: "Feb 10 – Mar 11" },
      { label: "Released to Owner", done: false, date: "Est. Mar 11, 2026" },
    ],
  },
  {
    id: "ESC-003", plot: "Eastern Ridge", tenant: "Jane Smith",
    amount: "Ksh 45,000", deposited: "—", releaseDate: "—",
    status: "pending", stages: [
      { label: "Lease Signed",      done: false, date: "Awaiting signature" },
      { label: "Escrow Deposited",  done: false, date: "—" },
      { label: "30-day Hold",       done: false, date: "—" },
      { label: "Released to Owner", done: false, date: "—" },
    ],
  },
];

const STATUS = {
  released: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Released" },
  holding:  { bg: "bg-blue-100",    text: "text-blue-700",    label: "In Escrow" },
  pending:  { bg: "bg-amber-100",   text: "text-amber-700",   label: "Pending Deposit" },
} as const;

export default function EscrowStatusPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          title="Escrow Status"
          description="Track escrow deposits and release timelines for all active leases."
        />

        {/* Summary cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Total in Escrow",   value: "Ksh 60,000",   icon: "lock",          color: "text-blue-600",    bg: "bg-blue-50" },
            { label: "Released This Month", value: "Ksh 50,000", icon: "payments",       color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending Deposit",   value: "Ksh 45,000",   icon: "pending",       color: "text-amber-600",   bg: "bg-amber-50" },
          ].map((c) => (
            <div key={c.label} className={`rounded-2xl ${c.bg} border border-slate-100 p-5 flex items-center gap-4`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm`}>
                <span className={`material-symbols-outlined text-2xl ${c.color}`}>{c.icon}</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</p>
                <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Escrow cards */}
        <div className="space-y-6">
          {escrows.map((e) => {
            const s = STATUS[e.status as keyof typeof STATUS];
            return (
              <div key={e.id} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{e.id}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}>{s.label}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mt-1">{e.plot}</h3>
                    <p className="text-xs text-slate-500">Tenant: {e.tenant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Escrow Amount</p>
                    <p className="text-xl font-bold text-primary mt-0.5">{e.amount}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex gap-0 overflow-x-auto">
                  {e.stages.map((stage, i) => (
                    <div key={stage.label} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {i > 0 && (
                          <div className={`h-0.5 flex-1 ${
                            e.stages[i - 1].done && stage.done ? "bg-primary" :
                            e.stages[i - 1].done ? "bg-primary/30" : "bg-slate-200"
                          }`} />
                        )}
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          stage.done
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white text-slate-400"
                        }`}>
                          {stage.done ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </div>
                        {i < e.stages.length - 1 && (
                          <div className={`h-0.5 flex-1 ${
                            stage.done && e.stages[i + 1]?.done ? "bg-primary" :
                            stage.done ? "bg-primary/30" : "bg-slate-200"
                          }`} />
                        )}
                      </div>
                      <div className="mt-2 text-center px-1">
                        <p className={`text-xs font-semibold ${
                          stage.done ? "text-primary" : "text-slate-400"
                        }`}>{stage.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{stage.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">Deposited</p>
                    <p className="text-sm font-semibold text-slate-800">{e.deposited}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Release Date</p>
                    <p className="text-sm font-semibold text-slate-800">{e.releaseDate}</p>
                  </div>
                  {e.status === "holding" && (
                    <div className="ml-auto">
                      <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">notifications</span>
                        Set Release Reminder
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
