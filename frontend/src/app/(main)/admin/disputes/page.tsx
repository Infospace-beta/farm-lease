import { Gavel } from "lucide-react";

export default function DisputesPage() {
  const disputes = [
    {
      id: "DSP-001",
      leaseId: "#5529",
      type: "Soil Quality",
      raisedBy: "Tenant",
      date: "Feb 14, 2026",
      priority: "High",
      priorityBg: "bg-red-100 text-red-700",
      status: "Open",
      statusBg: "bg-red-50 text-red-700 border-red-100",
    },
    {
      id: "DSP-002",
      leaseId: "#9921",
      type: "Delayed Payment",
      raisedBy: "Landowner",
      date: "Feb 10, 2026",
      priority: "Medium",
      priorityBg: "bg-yellow-100 text-yellow-700",
      status: "Under Review",
      statusBg: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },
    {
      id: "DSP-003",
      leaseId: "#4412",
      type: "Land Boundary",
      raisedBy: "Tenant",
      date: "Jan 28, 2026",
      priority: "Low",
      priorityBg: "bg-blue-100 text-blue-700",
      status: "Resolved",
      statusBg: "bg-green-50 text-green-700 border-green-100",
    },
  ];

  return (
    <div className="p-5 lg:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Gavel className="w-7 h-7 text-earth" />
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
              Dispute Resolution
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Review and resolve lease disputes between tenants and landowners.
            </p>
          </div>
        </div>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Open", value: "1", bg: "bg-red-50", text: "text-red-700" },
          { label: "Under Review", value: "1", bg: "bg-yellow-50", text: "text-yellow-700" },
          { label: "Resolved", value: "1", bg: "bg-green-50", text: "text-green-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 shadow-sm text-center`}>
            <p className={`text-3xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-earth font-serif">All Disputes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-100">
              <tr>
                {["Dispute ID", "Lease", "Type", "Raised By", "Date", "Priority", "Status", "Action"].map((h) => (
                  <th key={h} className={`px-5 py-3 ${h === "Action" ? "text-right" : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {disputes.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-gray-700">{d.id}</td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{d.leaseId}</td>
                  <td className="px-5 py-4 font-semibold text-gray-700">{d.type}</td>
                  <td className="px-5 py-4 text-gray-600">{d.raisedBy}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{d.date}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${d.priorityBg}`}>{d.priority}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 border rounded-full text-xs font-bold ${d.statusBg}`}>{d.status}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      disabled={d.status === "Resolved"}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                        d.status === "Resolved"
                          ? "text-gray-300 border-gray-200 cursor-not-allowed"
                          : "bg-sidebar-bg text-white hover:opacity-90 border-transparent"
                      }`}
                    >
                      {d.status === "Resolved" ? "Closed" : "Resolve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
