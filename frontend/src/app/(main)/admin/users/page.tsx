"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

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

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [suspendedMap, setSuspendedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(users.map((u) => [u.email, u.suspended]))
  );

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
        subtitle="Manage Farmers and Landowners accounts, review profiles, and handle suspensions."
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium">
          <FileDown className="w-4 h-4" />
          Export
        </button>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
        {/* Stat Cards */}}
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
      );
}
