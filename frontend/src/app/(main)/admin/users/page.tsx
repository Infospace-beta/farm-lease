"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  Users,
  Sprout,
  Mountain,
  Ban,
  Eye,
  Search,
  RefreshCw,
  FileDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statCards = [
  {
    label: "Total Active Users",
    value: "11,425",
    trend: "+12%",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Farmers",
    value: "8,320",
    trend: "+5%",
    icon: Sprout,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    label: "Landowners",
    value: "3,105",
    trend: "+2%",
    icon: Mountain,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Suspended Accounts",
    value: "38",
    trend: "+1",
    icon: Ban,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    trendColor: "text-red-600 bg-red-50",
  },
];

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    initials: "JD",
    avatarBg: "bg-amber-100",
    avatarColor: "text-amber-700",
    role: "Landowner",
    roleBg: "bg-amber-50 text-amber-700 border border-amber-100",
    joinDate: "Oct 24, 2023",
    status: "Active",
    statusStyle:
      "bg-green-50 text-green-700",
    dotColor: "bg-green-500",
    suspended: false,
  },
  {
    name: "Jane Smith",
    email: "jane.smith@farmlease.co.ke",
    initials: "JS",
    avatarBg: "bg-emerald-100",
    avatarColor: "text-emerald-700",
    role: "Farmer",
    roleBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    joinDate: "Nov 12, 2023",
    status: "Active",
    statusStyle: "bg-green-50 text-green-700",
    dotColor: "bg-green-500",
    suspended: false,
  },
  {
    name: "Alice Wanjiku",
    email: "alice.w@example.com",
    initials: "AW",
    avatarBg: "bg-purple-100",
    avatarColor: "text-purple-700",
    role: "Farmer",
    roleBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    joinDate: "Jan 10, 2024",
    status: "Active",
    statusStyle: "bg-green-50 text-green-700",
    dotColor: "bg-green-500",
    suspended: false,
  },
  {
    name: "David Kamau",
    email: "david.k@landholdings.co.ke",
    initials: "DK",
    avatarBg: "bg-blue-100",
    avatarColor: "text-blue-700",
    role: "Landowner",
    roleBg: "bg-amber-50 text-amber-700 border border-amber-100",
    joinDate: "Feb 28, 2024",
    status: "Active",
    statusStyle: "bg-green-50 text-green-700",
    dotColor: "bg-green-500",
    suspended: false,
  },
  {
    name: "Peter Omondi",
    email: "peter.omondi@farmers.co.ke",
    initials: "PO",
    avatarBg: "bg-green-100",
    avatarColor: "text-green-700",
    role: "Farmer",
    roleBg: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    joinDate: "Mar 15, 2024",
    status: "Suspended",
    statusStyle: "bg-red-50 text-red-700",
    dotColor: "bg-red-500",
    suspended: true,
  },
];



const oversightData = [
  { id: 1, name: "AgriFresh Supplies", email: "contact@agrifresh.co.ke", products: 34, orders: 128, score: 97, status: "Compliant" },
  { id: 2, name: "FarmMart Kenya", email: "info@farmmart.co.ke", products: 21, orders: 75, score: 84, status: "Compliant" },
  { id: 3, name: "GreenCrop Depot", email: "support@greencrop.co.ke", products: 15, orders: 43, score: 61, status: "Under Review" },
  { id: 4, name: "SeedMaster Ltd", email: "sales@seedmaster.co.ke", products: 9, orders: 20, score: 42, status: "Suspended" },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [suspendedMap, setSuspendedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(users.map((u) => [u.email, u.suspended]))
  );

  const [mainTab, setMainTab] = useState<"users" | "oversight">("users");

  const toggleSuspend = (email: string) =>
    setSuspendedMap((prev) => ({ ...prev, [email]: !prev[email] }));

  const filtered = users.filter((u) => {
    const isSuspended = suspendedMap[u.email];
    const effectiveStatus = isSuspended ? "suspended" : "active";
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole =
      !roleFilter ||
      u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchStatus =
      !statusFilter ||
      effectiveStatus === statusFilter.toLowerCase();
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="User Management"
        subtitle="Manage user accounts and monitor dealer compliance."
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium">
          <FileDown className="w-4 h-4" />
          Export
        </button>
      </AdminPageHeader>

      {/* Outer Tab Bar */}
      <div className="flex items-center gap-1 px-5 lg:px-8 pt-4 border-b border-slate-200 bg-white shrink-0">
        {([
          { key: "users", label: "Users", icon: "group" },
          { key: "oversight", label: "Dealer Oversight", icon: "store" },
        ] as { key: "users" | "oversight"; label: string; icon: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setMainTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition -mb-px border-b-2 ${mainTab === t.key
                ? "text-[#0f392b] border-[#0f392b] bg-emerald-50"
                : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
              }`}
          >
            <span className="material-symbols-outlined text-base" style={{ fontSize: 18 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ USERS TAB ═══ */}
      {mainTab === "users" && (
        <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div
                      className={`p-2 ${card.iconBg} rounded-lg`}
                    >
                      <Icon className={`w-5 h-5 ${card.iconColor}`} />
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${card.trendColor ?? "text-green-600 bg-green-50"}`}
                    >
                      {card.trend}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">
                    {card.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl p-4 mb-5 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or ID..."
                className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 min-w-32 cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="farmer">Farmer</option>
                <option value="landowner">Landowner</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 min-w-32 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("");
                  setStatusFilter("");
                }}
                className="p-2.5 text-gray-500 hover:text-sidebar-bg border border-gray-200 rounded-lg hover:bg-green-50 transition"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50">
                  <tr className="border-b border-gray-100">
                    {["User Name", "Role", "Join Date", "Account Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${h === "Actions" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {filtered.map((user) => (
                    <tr key={user.email} className="group hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${user.avatarBg} ${user.avatarColor} flex items-center justify-center font-bold text-sm border border-gray-200`}
                          >
                            {user.initials}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${user.roleBg}`}
                        >
                          {user.role === "Farmer" ? (
                            <Sprout className="w-3 h-3" />
                          ) : (
                            <Mountain className="w-3 h-3" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-sm">
                        {user.joinDate}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${suspendedMap[user.email]
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${suspendedMap[user.email] ? "bg-red-500" : "bg-green-500"
                              }`}
                          />
                          {suspendedMap[user.email] ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            className="p-1.5 text-gray-400 hover:text-sidebar-bg hover:bg-green-50 rounded-lg transition"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleSuspend(user.email)}
                            className={`p-1.5 rounded-lg transition ${suspendedMap[user.email]
                              ? "text-red-600 bg-red-50 hover:bg-red-100"
                              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                              }`}
                            title={suspendedMap[user.email] ? "Unsuspend" : "Suspend"}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                        No users match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-800">1</span> to{" "}
                <span className="font-bold text-gray-800">{filtered.length}</span>{" "}
                of{" "}
                <span className="font-bold text-gray-800">11,425</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled
                  className="p-2 border border-gray-200 rounded-lg text-gray-300 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition ${p === 1
                      ? "bg-sidebar-bg text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-2 text-gray-400 text-sm">...</span>
                <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 border border-gray-200">
                  12
                </button>
                <button className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:text-sidebar-bg hover:bg-green-50 transition">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DEALER OVERSIGHT TAB ═══ */}
      {mainTab === "oversight" && (
        <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Active Dealers", value: oversightData.length, color: "text-[#0f392b]", bg: "bg-emerald-50", icon: "storefront" },
              { label: "Under Review", value: oversightData.filter((d) => d.status === "Under Review").length, color: "text-amber-600", bg: "bg-amber-50", icon: "manage_search" },
              { label: "Suspended", value: oversightData.filter((d) => d.status === "Suspended").length, color: "text-red-600", bg: "bg-red-50", icon: "block" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center shrink-0 ${s.color}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{s.icon}</span>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>Dealer Compliance</h3>
              <span className="text-xs text-gray-400">{oversightData.length} dealers</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Dealer</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-right">Products</th>
                  <th className="px-6 py-3 text-right">Orders</th>
                  <th className="px-6 py-3 text-right">Compliance Score</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {oversightData.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{d.name}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{d.email}</td>
                    <td className="px-6 py-4 text-right text-gray-700 font-medium">{d.products}</td>
                    <td className="px-6 py-4 text-right text-gray-700 font-medium">{d.orders}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex-1 max-w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${d.score >= 90 ? "bg-emerald-500" : d.score >= 60 ? "bg-amber-400" : "bg-red-500"
                              }`}
                            style={{ width: `${d.score}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${d.score >= 90 ? "text-emerald-600" : d.score >= 60 ? "text-amber-600" : "text-red-600"
                          }`}>{d.score}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${d.status === "Compliant" ? "bg-green-100 text-green-700" :
                          d.status === "Under Review" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                        }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
