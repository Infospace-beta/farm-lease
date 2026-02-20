import Link from "next/link";

/* ─── Static data ─────────────────────────────────────── */
const stats = [
  {
    label: "Total Valuation",
    value: "Ksh 45.2M",
    badge: "+12.5%",
    badgeUp: true,
    sub: "vs last year",
    chart: (
      <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
        <path d="M0 35 Q 25 35 35 20 T 70 25 T 100 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <path
          d="M0 35 Q 25 35 35 20 T 70 25 T 100 5 V 40 H 0 Z"
          fill="#047857"
          opacity="0.1"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    label: "Monthly Revenue",
    value: "Ksh 450k",
    badge: "+8.2%",
    badgeUp: true,
    sub: "vs last month",
    chart: (
      <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
        <path
          d="M0 30 L 20 25 L 40 32 L 60 15 L 80 20 L 100 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    label: "Occupancy Rate",
    value: "92%",
    badge: "0.0%",
    badgeUp: null,
    sub: "vs last month",
    chart: (
      <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
        <path d="M0 20 H 100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    ),
  },
];

const assets = [
  {
    name: "Plot A4 - North",
    meta: "3.5 Acres • Soil: Loam",
    status: "Leased",
    statusColor: "bg-emerald-500/90",
    svgPath: "M10,10 L90,20 L80,80 L20,90 Z",
    svgFill: "fill-emerald-500/30",
    personLabel: "Tenant",
    personName: "John Doe",
    personAvatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=e2e8f0&color=475569&size=32",
    valueLabel: "Lease Value",
    value: "Ksh 50k",
    valueSuffix: "/yr",
    valueColor: "text-[#047857]",
    footerLeft: "Ends: Dec 2024",
    footerLeftColor: "text-slate-400",
    footerAction: { label: "Manage Land", style: "link", href: "/owner/lands" },
  },
  {
    name: "Plot B2 - East",
    meta: "2.0 Acres • Soil: Clay",
    status: "Pending",
    statusColor: "bg-amber-500/90",
    svgPath: "M15,15 L85,10 L95,70 L25,85 Z",
    svgFill: "fill-amber-500/30",
    personLabel: "Highest Bidder",
    personName: "Jane Smith",
    personAvatar:
      "https://ui-avatars.com/api/?name=Jane+Smith&background=e2e8f0&color=475569&size=32",
    valueLabel: "Offer",
    value: "Ksh 45k",
    valueSuffix: "/yr",
    valueColor: "text-amber-600",
    footerLeft: "Action Required",
    footerLeftColor: "text-amber-600 font-medium",
    footerAction: { label: "Review", style: "button", href: "/owner/lease-requests" },
  },
  {
    name: "Plot C1 - Valley",
    meta: "5.0 Acres • Soil: Silt",
    status: "Reviewing",
    statusColor: "bg-blue-500/90",
    svgPath: "M30,10 L80,10 L90,90 L10,80 Z",
    svgFill: "fill-blue-500/30",
    personLabel: "Potential Tenant",
    personName: "Michael K.",
    personAvatar: null,
    personInitials: "MK",
    valueLabel: "Offer",
    value: "Ksh 60k",
    valueSuffix: "/yr",
    valueColor: "text-blue-600",
    footerLeft: "Docs Submitted",
    footerLeftColor: "text-blue-600 font-medium",
    footerAction: { label: "View Docs", style: "link", href: "/owner/agreements" },
  },
];

const activities = [
  {
    dotColor: "bg-[#047857]",
    time: "10 mins ago",
    title: "Escrow Payment Released",
    body: (
      <p className="text-xs text-slate-500 mt-1">
        Payment of <span className="text-emerald-600 font-bold">Ksh 50,000</span> for Plot A4 released to your wallet.
      </p>
    ),
  },
  {
    dotColor: "bg-amber-500",
    time: "2 hours ago",
    title: "New Bid Received",
    body: (
      <div className="mt-2 rounded bg-slate-50 p-2">
        <div className="flex items-center gap-2">
          <img
            src="https://ui-avatars.com/api/?name=Sarah+L&background=e2e8f0&color=475569&size=32"
            alt="Sarah L."
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-xs font-medium">Sarah L.</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Bid placed on Plot B2 - East</p>
      </div>
    ),
  },
  {
    dotColor: "bg-blue-500",
    time: "Yesterday",
    title: "Agreement Draft Ready",
    body: (
      <>
        <p className="text-xs text-slate-500 mt-1">
          AI-generated lease agreement for Michael K. is ready for review.
        </p>
        <button className="mt-2 text-xs font-bold text-primary hover:underline">Review PDF</button>
      </>
    ),
  },
  {
    dotColor: "bg-slate-300",
    time: "2 days ago",
    title: "Soil Report Updated",
    body: <p className="text-xs text-slate-500 mt-1">New nitrogen levels detected for Plot C1.</p>,
    last: true,
  },
];

/* ─── Page ────────────────────────────────────────────── */
export default function OwnerDashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="text-4xl font-bold tracking-tight text-earth"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Dashboard
            </h2>
            <p className="mt-2 text-slate-500 max-w-2xl">
              Monitor your land portfolio performance, manage lease agreements, and track escrow payments in real-time.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Report
            </button>
            <Link href="/owner/lands/add" className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all">
              <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
              List New Land
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                  <h3 className="mt-2 text-3xl font-bold text-earth">{s.value}</h3>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    {s.badgeUp === true && (
                      <span className="flex items-center text-primary font-bold bg-primary/10 px-2 py-1 rounded text-xs w-fit">
                        <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                        {s.badge}
                      </span>
                    )}
                    {s.badgeUp === false && (
                      <span className="flex items-center text-red-500 font-bold bg-red-50 px-2 py-1 rounded text-xs w-fit">
                        <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
                        {s.badge}
                      </span>
                    )}
                    {s.badgeUp === null && (
                      <span className="flex items-center text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs w-fit">
                        <span className="material-symbols-outlined text-sm mr-1">remove</span>
                        {s.badge}
                      </span>
                    )}
                    <span className="text-xs text-slate-400 mt-1 block">{s.sub}</span>
                  </div>
                  {s.chart}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Land Portfolio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3
                className="text-xl font-bold text-earth"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                My Land Portfolio
              </h3>
              <div className="flex gap-2">
                <button className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                </button>
                <button className="p-1.5 rounded border border-transparent text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">list</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Land cards */}
              {assets.map((a) => (
                <div
                  key={a.name}
                  className="group relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                >
                  <div className="relative h-40 w-full overflow-hidden rounded-xl mini-map-pattern">
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="font-bold text-lg">{a.name}</p>
                      <p className="text-xs opacity-90">{a.meta}</p>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center rounded-full ${a.statusColor} backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white shadow-sm`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <svg
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 stroke-white ${a.svgFill} drop-shadow-lg`}
                      viewBox="0 0 100 100"
                    >
                      <path d={a.svgPath} strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{a.personLabel}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {a.personAvatar ? (
                          <img
                            src={a.personAvatar}
                            alt={a.personName}
                            className="h-6 w-6 rounded-full object-cover bg-slate-200"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-[10px]">
                            {a.personInitials}
                          </div>
                        )}
                        <span className="text-sm font-medium text-slate-800">{a.personName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{a.valueLabel}</p>
                      <p className={`text-sm font-bold ${a.valueColor}`}>
                        {a.value}
                        <span className="text-slate-400 font-normal">{a.valueSuffix}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className={`text-xs ${a.footerLeftColor}`}>{a.footerLeft}</span>
                    {a.footerAction.style === "link" ? (
                      <Link href={(a.footerAction as { href?: string }).href ?? "/owner/lands"} className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline">
                        {a.footerAction.label}
                      </Link>
                    ) : (
                      <Link href={(a.footerAction as { href?: string }).href ?? "/owner/lands"} className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700">
                        {a.footerAction.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {/* Add New Land tile */}
              <Link
                href="/owner/lands/add"
                className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-primary hover:bg-primary/5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">add</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">Add New Land</h4>
                <p className="text-xs text-slate-500 text-center mt-2 max-w-50">
                  Upload deeds, soil reports, and map coordinates.
                </p>
              </Link>
            </div>
          </div>

          {/* Activity Pulse */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </div>
                <h3
                  className="text-lg font-bold text-earth"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Activity Pulse
                </h3>
              </div>

              <div className="space-y-8">
                {activities.map((act, i) => (
                  <div
                    key={i}
                    className={`relative pl-6 ${
                      act.last
                        ? ""
                        : "before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200"
                    }`}
                  >
                    <div
                      className={`absolute -left-1.25 top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${act.dotColor}`}
                    />
                    <p className="text-xs font-medium text-slate-400">{act.time}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{act.title}</p>
                    {act.body}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
