import LesseePageHeader from "@/components/lessee/LesseePageHeader";

const leases = [
  {
    id: 1,
    plot: "Plot A4-North",
    description: "Nakuru Rift Valley · 20 Acres · Loam Soil",
    lessorName: "James Mwangi",
    lessorInitials: "JM",
    startDate: "Jan 2024",
    endDate: "Dec 2024",
    progress: 75,
    monthlyRent: "Ksh 37,500",
    status: "Active",
    statusColor: "bg-emerald-100 text-emerald-700",
    nextPayment: "Jul 1, 2024",
  },
  {
    id: 2,
    plot: "Plot B2-East Highlands",
    description: "Narok Rift Valley · 15 Acres · Volcanic Soil",
    lessorName: "Sarah Kamau",
    lessorInitials: "SK",
    startDate: "Mar 2024",
    endDate: "Feb 2025",
    progress: 30,
    monthlyRent: "Ksh 22,500",
    status: "Pending",
    statusColor: "bg-amber-100 text-amber-600",
    nextPayment: "Awaiting sign-off",
  },
  {
    id: 3,
    plot: "Plot C7-Valley Bottom",
    description: "Nyeri Central · 50 Acres · Red Clay",
    lessorName: "Peter Njoroge",
    lessorInitials: "PN",
    startDate: "Jul 2023",
    endDate: "Jun 2024",
    progress: 100,
    monthlyRent: "Ksh 75,000",
    status: "Expired",
    statusColor: "bg-gray-100 text-gray-500",
    nextPayment: "—",
  },
  {
    id: 4,
    plot: "Plot D1-River Bank",
    description: "Kiambu Central · 12 Acres · Loam Soil",
    lessorName: "Grace Wanjiku",
    lessorInitials: "GW",
    startDate: "Apr 2024",
    endDate: "Mar 2025",
    progress: 15,
    monthlyRent: "Ksh 24,000",
    status: "Active",
    statusColor: "bg-emerald-100 text-emerald-700",
    nextPayment: "Jul 1, 2024",
  },
];

export default function LeasesPage() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="My Leases"
        subtitle="Track and manage all your active land lease agreements"
      >
        <button className="flex items-center gap-2 bg-[#0f392b] hover:bg-[#1c4a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-colors">
          <span className="material-icons-round text-lg">add</span>
          New Lease
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Leased Area",
              value: "24.5 Acres",
              icon: "landscape",
              color: "text-[#047857]",
              bg: "bg-emerald-50",
            },
            {
              label: "Active Agreements",
              value: "3",
              icon: "check_circle",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Pending Actions",
              value: "1",
              icon: "pending_actions",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              label: "Upcoming Payments",
              value: "Ksh 45k",
              icon: "account_balance_wallet",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div
                className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}
              >
                <span className={`material-icons-round ${stat.color}`}>
                  {stat.icon}
                </span>
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mb-0.5">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Leases Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3
              className="font-bold text-gray-800"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              All Leases
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select className="appearance-none text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-[#047857]">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Expired</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-base pointer-events-none">
                  expand_more
                </span>
              </div>
              <button className="text-xs font-medium text-[#047857] flex items-center gap-1 hover:text-emerald-700">
                <span className="material-icons-round text-base">
                  file_download
                </span>
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Plot / Location
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Lessor
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Lease Period
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Progress
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Monthly Rent
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Next Payment
                  </th>
                  <th className="text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leases.map((lease) => (
                  <tr
                    key={lease.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0f392b]/10 to-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="material-icons-round text-[#047857] text-xl">
                            landscape
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {lease.plot}
                          </div>
                          <div className="text-xs text-gray-500">
                            {lease.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#0f392b] text-[#13ec80] flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {lease.lessorInitials}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {lease.lessorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 font-medium">
                        {lease.startDate}
                      </div>
                      <div className="text-xs text-gray-400">
                        to {lease.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                          <span>{lease.startDate}</span>
                          <span className="font-bold text-[#047857]">
                            {lease.progress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#047857] to-[#13ec80] rounded-full"
                            style={{ width: `${lease.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 text-sm">
                        {lease.monthlyRent}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${lease.statusColor}`}
                      >
                        {lease.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-600">
                        {lease.nextPayment}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 transition-opacity">
                        <button
                          className="p-1.5 text-[#047857] hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Agreement"
                        >
                          <span className="material-icons-round text-lg">
                            description
                          </span>
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="More Options"
                        >
                          <span className="material-icons-round text-lg">
                            more_vert
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
