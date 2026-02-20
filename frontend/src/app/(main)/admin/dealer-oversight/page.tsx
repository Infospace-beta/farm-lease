"use client";

import { useState } from "react";
import {
  Store,
  ShieldCheck,
  Search,
  AlertTriangle,
  FileDown,
  Star,
  Mail,
} from "lucide-react";

const statCards = [
  {
    label: "Active Dealers",
    value: "142",
    sub: "138 Fully Compliant",
    subStyle: "text-emerald-700 bg-green-50",
    icon: Store,
    iconBg: "bg-green-50",
    iconColor: "text-emerald-700",
  },
  {
    label: "Avg Compliance Score",
    value: "94%",
    sub: "Target: 90% minimum",
    subStyle: "text-gray-500",
    icon: ShieldCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Under Investigation",
    value: "4",
    sub: "Requires immediate review",
    subStyle: "text-yellow-700 bg-yellow-50",
    icon: AlertTriangle,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
  {
    label: "Flagged Listings",
    value: "7",
    sub: "Investigate now",
    subStyle: "text-red-600 bg-red-50",
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const dealers = [
  {
    initials: "GH",
    name: "GreenHarvest Supplies",
    id: "#DL-4402",
    violation: "Counterfeit Report",
    violationColor: "text-red-500",
    avatarBg: "bg-[#8d6e63]",
    rating: 3.2,
    stars: 3,
    reviews: 45,
    flagFreq: "3rd Violation",
    flagStyle: "bg-red-100 text-red-700",
    products: 12,
    flaggedItems: 3,
    status: "Under Review",
    statusStyle: "bg-red-50 text-red-700 border-red-100",
    rowBg: "bg-red-50/20",
    pulse: true,
  },
  {
    initials: "VZ",
    name: "Vuna Zona",
    id: "#DL-1109",
    violation: "Price Fixing",
    violationColor: "text-orange-500",
    avatarBg: "bg-[#5D4037]",
    rating: 4.1,
    stars: 4,
    reviews: 89,
    flagFreq: "1st Warning",
    flagStyle: "bg-yellow-100 text-yellow-700",
    products: 62,
    flaggedItems: 1,
    status: "Warning Sent",
    statusStyle: "bg-orange-50 text-orange-700 border-orange-100",
    rowBg: "bg-yellow-50/10",
    pulse: false,
  },
  {
    initials: "SA",
    name: "Savanna Agrochemicals",
    id: "#DL-3391",
    violation: "Expired License",
    violationColor: "text-gray-400",
    avatarBg: "bg-gray-500",
    rating: 3.9,
    stars: 4,
    reviews: 12,
    flagFreq: "Repeat",
    flagStyle: "bg-gray-100 text-gray-600",
    products: 18,
    flaggedItems: 0,
    status: "Suspended",
    statusStyle: "bg-gray-100 text-gray-600 border-gray-200",
    rowBg: "",
    pulse: false,
  },
  {
    initials: "TP",
    name: "TopPest Control",
    id: "#DL-9221",
    violation: "Banned Substance",
    violationColor: "text-red-500",
    avatarBg: "bg-red-800",
    rating: 2.1,
    stars: 2,
    reviews: 8,
    flagFreq: "Severe",
    flagStyle: "bg-red-800 text-red-100",
    products: 5,
    flaggedItems: 5,
    status: "Severe Violation",
    statusStyle: "bg-red-100 text-red-700 border-red-200",
    rowBg: "bg-red-50/20",
    pulse: false,
  },
];

export default function DealerOversightPage() {
  const [activeTab, setActiveTab] = useState<"violations" | "history">("violations");
  const [search, setSearch] = useState("");

  const filteredDealers = dealers.filter((d) =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase()) ||
    d.violation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-earth font-serif tracking-tight">
            Agro-Dealer Compliance Oversight
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Monitor flagged dealers, manage compliance violations, and enforce
            network quality standards.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search violations..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-full shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium whitespace-nowrap">
            <FileDown className="w-4 h-4" />
            Export Log
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("violations")}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "violations"
              ? "text-emerald-800 border-emerald-700"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Active Violations
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "history"
              ? "text-emerald-800 border-emerald-700"
              : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Compliance History
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-36"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  {card.label}
                </h3>
                <span
                  className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </span>
              </div>
              <div>
                <span className="text-3xl font-bold text-gray-800">
                  {card.value}
                </span>
                <div
                  className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${card.subStyle}`}
                >
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Violations Table */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-earth font-serif">
            Compliance Violations
          </h3>
          <span className="px-4 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 rounded-lg">
            Flagged Dealers &amp; Violations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {[
                  "Dealer Name",
                  "Ratings",
                  "Flag Frequency",
                  "Total Products",
                  "Flagged Items",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`pb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest ${
                      ["Flag Frequency", "Total Products", "Flagged Items", "Status"].includes(h)
                        ? "text-center"
                        : h === "Actions"
                        ? "text-right pr-2"
                        : "pl-2"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredDealers.map((dealer) => (
                <tr
                  key={dealer.id}
                  className={`group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 ${dealer.rowBg}`}
                >
                  <td className="py-4 pl-2 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${dealer.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm relative`}
                      >
                        {dealer.initials}
                        {dealer.pulse && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{dealer.name}</p>
                        <p className="text-xs text-gray-500">{dealer.id}</p>
                        <p
                          className={`text-[10px] mt-1 font-semibold ${dealer.violationColor}`}
                        >
                          Violation: {dealer.violation}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-gray-700">
                        {dealer.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({dealer.reviews})
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${dealer.flagStyle}`}
                    >
                      {dealer.flagFreq}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-center">
                    <span className="font-medium text-gray-600">
                      {dealer.products}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-center">
                    {dealer.flaggedItems > 0 ? (
                      <button className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white text-emerald-600 border border-emerald-600 hover:bg-emerald-50 transition-colors">
                        {dealer.flaggedItems} Active
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        0
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-2 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-lg border ${dealer.statusStyle}`}
                    >
                      {dealer.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-2">
                    <div className="flex justify-end gap-2">
                      <button
                        className="p-1.5 bg-white text-gray-500 hover:text-earth hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-100 transition-colors">
                        Investigate
                      </button>
                      <button
                        className={`px-3 py-1.5 bg-white text-xs font-bold rounded-lg border border-gray-200 transition-colors ${
                          dealer.status === "Suspended"
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                        disabled={dealer.status === "Suspended"}
                      >
                        Suspend Dealer
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
  );
}
