"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

const contracts = [
  {
    id: "#FL-2023-892",
    created: "Oct 24, 2023",
    lesseeInitials: "JD",
    lesseeBg: "bg-[#0f392b]",
    lesseeName: "John Doe",
    lessorInitials: "JS",
    lessorBg: "bg-blue-600",
    lessorName: "Jane Smith",
    plot: "Plot B-14 (5 Acres)",
    location: "Nakuru County, Rongai",
    ref: "LR-4521/11",
    duration: "3 Years",
    dateRange: "Nov 1, 2023 – Oct 31, 2026",
    progress: 8,
    statusBg: "bg-green-50 border-green-100 text-green-700",
    statusDot: "bg-green-500",
    statusLabel: "Fully Signed",
    statusNote: "Last signed by Lessor on Oct 25, 2023",
    canDownload: true,
    resend: false,
  },
  {
    id: "#FL-2023-895",
    created: "Nov 02, 2023",
    lesseeInitials: "MK",
    lesseeBg: "bg-purple-600",
    lesseeName: "Michael Kimani",
    lessorInitials: "AW",
    lessorBg: "bg-[#5D4037]",
    lessorName: "Alice Wanjiku",
    plot: "Plot K-22 (12 Acres)",
    location: "Uasin Gishu, Eldoret",
    ref: "LR-1029/99",
    duration: "1 Year",
    dateRange: "Jan 1, 2024 – Dec 31, 2024",
    progress: 0,
    statusBg: "bg-yellow-50 border-yellow-100 text-yellow-700",
    statusDot: "bg-yellow-500 animate-pulse",
    statusLabel: "Pending Lessor",
    statusNote: "Lessee signed Nov 03, 2023. Awaiting Alice Wanjiku.",
    canDownload: false,
    resend: true,
  },
  {
    id: "#FL-2022-104",
    created: "Jun 15, 2022",
    lesseeInitials: "SK",
    lesseeBg: "bg-blue-500",
    lesseeName: "Samuel K.",
    lessorInitials: "CL",
    lessorBg: "bg-orange-500",
    lessorName: "Cooperative Land",
    plot: "Plot M-05 (2 Acres)",
    location: "Muranga, Makuyu",
    ref: "LR-3310/12",
    duration: "2 Years",
    dateRange: "Jul 1, 2022 – Jun 30, 2024",
    progress: 75,
    statusBg: "bg-green-50 border-green-100 text-green-700",
    statusDot: "bg-green-500",
    statusLabel: "Active",
    statusNote: "Expiring in 7 months.",
    canDownload: true,
    resend: false,
  },
  {
    id: "#FL-2023-901",
    created: "Nov 10, 2023",
    lesseeInitials: "FO",
    lesseeBg: "bg-teal-600",
    lesseeName: "Faith Odhiambo",
    lessorInitials: "PM",
    lessorBg: "bg-rose-600",
    lessorName: "Peter Mwangi",
    plot: "Plot R-08 (7 Acres)",
    location: "Kiambu County, Limuru",
    ref: "LR-7790/04",
    duration: "5 Years",
    dateRange: "Dec 1, 2023 – Nov 30, 2028",
    progress: 2,
    statusBg: "bg-yellow-50 border-yellow-100 text-yellow-700",
    statusDot: "bg-yellow-500 animate-pulse",
    statusLabel: "Pending Lessee",
    statusNote: "Lessor signed Nov 11, 2023. Awaiting Faith Odhiambo.",
    canDownload: false,
    resend: false,
  },
];

const tabs = [
  { label: "All Contracts", count: "1,284" },
  { label: "Pending Signatures", count: "42" },
  { label: "Active", count: "1,150" },
  { label: "Expiring Soon", count: "15" },
];

const TAB_STATUS: Record<number, string> = {
  1: "pending",
  2: "active",
  3: "expiring",
};

export default function AgreementsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = contracts.filter((c) => {
    const matchTab =
      activeTab === 0 ||
      (activeTab === 1 && (c.statusLabel.toLowerCase().includes("pending"))) ||
      (activeTab === 2 && (c.statusLabel === "Fully Signed" || c.statusLabel === "Active")) ||
      (activeTab === 3 && c.statusLabel === "Active" && c.progress > 60);
    const matchSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.lesseeName.toLowerCase().includes(search.toLowerCase()) ||
      c.lessorName.toLowerCase().includes(search.toLowerCase()) ||
      c.plot.toLowerCase().includes(search.toLowerCase()) ||
      c.ref.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
            Agreements &amp; Contracts Oversight
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Monitor, audit, and manage all active lease agreements between
            parties.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name or plot..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-56 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="relative p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 px-6 pt-6 border-b border-gray-100 pb-4">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={`text-sm font-semibold pb-1 px-1 transition-colors border-b-2 ${
                activeTab === i
                  ? "text-sidebar-bg border-sidebar-bg"
                  : "text-gray-500 border-transparent hover:text-earth"
              }`}
            >
              {tab.label}{" "}
              <span className="text-xs text-gray-400">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                {[
                  "Agreement ID",
                  "Parties (Lessee & Lessor)",
                  "Land Plot",
                  "Duration",
                  "Signature Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 px-5 ${i === 5 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="group hover:bg-gray-50/40 transition-colors text-sm"
                >
                  {/* ID */}
                  <td className="py-4 px-5 align-top">
                    <span className="font-mono text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {c.id}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Created: {c.created}
                    </p>
                  </td>

                  {/* Parties */}
                  <td className="py-4 px-5 align-top">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full ${c.lesseeBg} text-white flex items-center justify-center font-bold text-[10px]`}
                        >
                          {c.lesseeInitials}
                        </div>
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                            Lessee
                          </span>
                          <span className="font-semibold text-gray-700 text-xs">
                            {c.lesseeName}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full ${c.lessorBg} text-white flex items-center justify-center font-bold text-[10px]`}
                        >
                          {c.lessorInitials}
                        </div>
                        <div>
                          <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">
                            Lessor
                          </span>
                          <span className="font-semibold text-gray-700 text-xs">
                            {c.lessorName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Land Plot */}
                  <td className="py-4 px-5 align-top">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-sidebar-bg mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-earth text-xs">
                          {c.plot}
                        </p>
                        <p className="text-xs text-gray-500">{c.location}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                          {c.ref}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="py-4 px-5 align-top">
                    <p className="font-semibold text-gray-700 text-sm">
                      {c.duration}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{c.dateRange}</p>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {c.progress}% elapsed
                    </p>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 align-top">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-bold ${c.statusBg}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${c.statusDot}`}
                      />
                      {c.statusLabel}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-2 max-w-40">
                      {c.statusNote}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 align-top text-right">
                    <div className="flex flex-col items-end gap-2">
                      <button
                        disabled={!c.canDownload}
                        className={`flex items-center gap-2 px-3 py-1.5 bg-sidebar-bg text-white text-xs font-bold rounded-lg shadow-sm transition ${
                          c.canDownload
                            ? "hover:opacity-90"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Download PDF
                      </button>
                      {c.resend && (
                        <button className="text-[10px] text-primary hover:underline font-bold">
                          Resend Notification
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-bold text-gray-800">1–{filtered.length}</span>{" "}
            of <span className="font-bold text-gray-800">1,284</span> contracts
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition ${
                  n === 1
                    ? "bg-sidebar-bg text-white shadow"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">
              ...
            </span>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">
              32
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
