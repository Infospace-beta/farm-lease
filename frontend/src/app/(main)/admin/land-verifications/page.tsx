"use client";

import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Copy,
  AlertCircle,
  ChevronRight,
  Download,
} from "lucide-react";

const statCards = [
  {
    label: "Pending Verification",
    value: "12",
    sub: "Requires manual check",
    icon: Clock,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    label: "Verified Today",
    value: "48",
    sub: "Approved manually",
    icon: ShieldCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Flagged Discrepancies",
    value: "3",
    sub: "Issues with Title Deed Numbers",
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const verificationRows = [
  {
    name: "John Doe",
    initials: "JD",
    avatarBg: "bg-emerald-100",
    avatarColor: "text-emerald-700",
    submitted: "2 hrs ago",
    plotId: "LR-4521/11",
    titleDeed: "KJI-9928-XX",
    valid: true,
    region: "Kiambu County",
    status: "Pending",
    statusStyle: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dotColor: "bg-yellow-600",
    showActions: true,
  },
  {
    name: "Jane Smith",
    initials: "JS",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-700",
    submitted: "5 hrs ago",
    plotId: "LR-8829/04",
    titleDeed: "NBI-2210-AB",
    valid: true,
    region: "Nairobi",
    status: "Verified",
    statusStyle: "bg-green-100 text-green-800 border-green-200",
    dotColor: "bg-green-600",
    showActions: false,
  },
  {
    name: "Michael Kimani",
    initials: "MK",
    avatarBg: "bg-purple-100",
    avatarColor: "text-purple-700",
    submitted: "1 day ago",
    plotId: "LR-1029/99",
    titleDeed: "KJI-INVALID",
    valid: false,
    region: "Nakuru",
    status: "Flagged",
    statusStyle: "bg-red-100 text-red-800 border-red-200",
    dotColor: "bg-red-600",
    showActions: true,
    ownerUpdated: true,
  },
  {
    name: "Alice Wanjiku",
    initials: "AW",
    avatarBg: "bg-amber-100",
    avatarColor: "text-amber-700",
    submitted: "2 days ago",
    plotId: "LR-3310/12",
    titleDeed: "MRU-5541-XY",
    valid: true,
    region: "Meru",
    status: "Pending",
    statusStyle: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dotColor: "bg-yellow-600",
    showActions: true,
  },
];

export default function LandVerificationsPage() {
  const [search, setSearch] = useState("");
  const [actions, setActions] = useState<Record<string, "verified" | "flagged">>({});

  const filtered = verificationRows.filter((r) => {
    if (!search) return true;
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.plotId.toLowerCase().includes(search.toLowerCase()) ||
      r.titleDeed.toLowerCase().includes(search.toLowerCase()) ||
      r.region.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-earth" />
            <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
              Land Verifications
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-xl">
            Manual validation of property titles. Cross-reference the Title Deed
            Numbers below with the national land registry to approve or flag
            listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Plot ID or Title..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-56 shadow-sm"
            />
          </div>
            <button
              onClick={() => { setSearch(""); setActions({}); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="text-earth text-[10px] font-bold uppercase tracking-widest mb-1">
                  {card.label}
                </h3>
                <span className="text-3xl font-bold text-gray-800">
                  {card.value}
                </span>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
              <span
                className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-base font-bold text-earth font-serif">
            Title Deed Verification Queue
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-sidebar-bg bg-white border border-gray-200 rounded-md shadow-sm transition-colors flex items-center gap-1">
              <Download className="w-3 h-3" /> Export List
            </button>
            <button
              onClick={() => { setSearch(""); setActions({}); }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-sidebar-bg hover:opacity-90 rounded-md shadow-sm transition-colors flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Refresh Data
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                  Owner Name
                </th>
                <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                  Plot ID
                </th>
                <th className="py-4 px-5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50/30 border-x border-gray-100">
                  Title Deed Number
                </th>
                <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                  Region
                </th>
                <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest">
                  Status
                </th>
                <th className="py-4 px-5 text-[10px] font-bold text-earth uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filtered.map((row) => (
                <tr
                  key={row.plotId}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${row.avatarBg} ${row.avatarColor} flex items-center justify-center font-bold text-xs border border-gray-200`}
                      >
                        {row.initials}
                      </div>
                      <div>
                        <span className="block font-bold text-gray-800">
                          {row.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Submitted {row.submitted}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                      {row.plotId}
                    </span>
                  </td>
                  <td className="py-4 px-5 bg-emerald-50/10 border-x border-gray-50 group-hover:bg-emerald-50/20">
                    <div className="flex items-center gap-2 cursor-pointer group/deed">
                      <span className="font-bold text-base text-sidebar-bg tracking-wide">
                        {row.titleDeed}
                      </span>
                      {row.valid ? (
                        <Copy className="w-3.5 h-3.5 text-emerald-600 opacity-40 group-hover/deed:opacity-100 transition-opacity" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-gray-600">{row.region}</td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${row.statusStyle} w-fit`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${row.dotColor}`}
                        />
                        {row.status}
                      </span>
                      {row.ownerUpdated && (
                        <span className="inline-flex text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 w-fit">
                          Owner Updated
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    {row.showActions ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActions(a => ({...a, [row.plotId]: "flagged"}))}
                          disabled={!!actions[row.plotId]}
                          className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-sm w-32 ${
                            actions[row.plotId] === "flagged"
                              ? "bg-red-600 text-white cursor-default"
                              : "border border-earth text-earth hover:bg-earth hover:text-white"
                          }`}>
                          {actions[row.plotId] === "flagged" ? "✓ Flagged" : "Flag/Correction"}
                        </button>
                        <button
                          onClick={() => setActions(a => ({...a, [row.plotId]: "verified"}))}
                          disabled={!!actions[row.plotId]}
                          className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold rounded-lg transition shadow-sm w-32 ${
                            actions[row.plotId] === "verified"
                              ? "bg-primary text-white cursor-default"
                              : "bg-emerald-700 text-white hover:bg-sidebar-bg"
                          }`}>
                          {actions[row.plotId] === "verified" ? "✓ Verified" : "Verify Property"}
                        </button>
                      </div>
                    ) : (
                      <button className="text-gray-400 hover:text-earth text-sm font-medium transition flex items-center justify-end gap-1 ml-auto">
                        View Details <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing <span className="font-bold text-gray-700">1-4</span> of{" "}
            <span className="font-bold text-gray-700">12</span> pending
            verifications
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-300 cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-earth transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-sidebar-bg rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <ShieldCheck className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <h4 className="font-serif text-lg font-bold mb-2">
              Manual Verification Protocol
            </h4>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-medium text-yellow-200 uppercase tracking-wider">
                Review Required
              </span>
            </div>
            <ul className="text-sm text-green-100/80 mb-4 space-y-2 list-disc pl-4 max-w-lg">
              <li>
                Cross-check the <strong>Title Deed Number</strong> with the
                physical land registry ledger or government portal.
              </li>
              <li>
                Verify the <strong>Owner Name</strong> matches the deed holder
                exactly.
              </li>
              <li>
                Confirm the <strong>Plot ID</strong> corresponds to the correct
                region.
              </li>
            </ul>
            <button className="text-xs font-bold text-white border border-white/30 px-3 py-1.5 rounded hover:bg-white/10 transition flex items-center gap-1">
              <Download className="w-3 h-3" /> Download Guidelines PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h4 className="font-bold text-earth mb-4 text-sm uppercase tracking-widest">
            Quick Filters
          </h4>
          <div className="space-y-3">
            {[
              "Show Pending Only",
              "High Priority Plots",
              "Flagged for Fraud",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-sidebar-bg focus:ring-sidebar-bg"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
