"use client";

import { useState, useEffect, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { adminApi } from "@/lib/services/api";
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
  Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface UserStats {
  total_active: number;
  total_farmers: number;
  total_landowners: number;
  total_suspended: number;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  initials: string;
  role: string;
  join_date: string;
  is_active: boolean;
  is_verified: boolean;
}

interface UsersResponse {
  users: UserItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  stats: UserStats;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS: [string, string][] = [
  ["bg-amber-100", "text-amber-700"],
  ["bg-emerald-100", "text-emerald-700"],
  ["bg-blue-100", "text-blue-700"],
  ["bg-purple-100", "text-purple-700"],
  ["bg-green-100", "text-green-700"],
  ["bg-rose-100", "text-rose-700"],
];

function avatarColor(id: number): [string, string] {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function UserManagementPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suspending, setSuspending] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async (opts?: { search?: string; role?: string; status?: string; page?: number }) => {
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await adminApi.listUsers({
        search: opts?.search ?? search,
        role: opts?.role ?? roleFilter,
        status: opts?.status ?? statusFilter,
        page: opts?.page ?? page,
        page_size: 10,
      });
      setData(res as UsersResponse);
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        setError("Failed to load users. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyFilters = () => {
    setPage(1);
    fetchUsers({ search, role: roleFilter, status: statusFilter, page: 1 });
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
    fetchUsers({ search: "", role: "", status: "", page: 1 });
  };

  const handleSuspend = async (user: UserItem) => {
    setSuspending(user.id);
    try {
      const { data: res } = await adminApi.suspendUser(user.id);
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          users: prev.users.map((u) =>
            u.id === user.id ? { ...u, is_active: (res as { is_active: boolean }).is_active } : u
          ),
          stats: {
            ...prev.stats,
            total_active: (res as { is_active: boolean }).is_active
              ? prev.stats.total_active + 1
              : prev.stats.total_active - 1,
            total_suspended: (res as { is_active: boolean }).is_active
              ? prev.stats.total_suspended - 1
              : prev.stats.total_suspended + 1,
          },
        };
      });
    } catch {
      // ignore
    } finally {
      setSuspending(null);
    }
  };

  const stats = data?.stats;
  const statCards = [
    {
      label: "Total Active Users",
      value: stats ? stats.total_active.toLocaleString() : "—",
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Farmers",
      value: stats ? stats.total_farmers.toLocaleString() : "—",
      icon: Sprout,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Landowners",
      value: stats ? stats.total_landowners.toLocaleString() : "—",
      icon: Mountain,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Suspended Accounts",
      value: stats ? stats.total_suspended.toLocaleString() : "—",
      icon: Ban,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      trendColor: "text-red-600 bg-red-50",
    },
  ];

  const totalPages = data?.total_pages ?? 1;

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
                  <div className={`p-2 ${card.iconBg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">{card.label}</p>
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
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Search by name or email..."
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
              <option value="dealer">Dealer</option>
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
              onClick={applyFilters}
              className="px-4 py-2.5 bg-sidebar-bg text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Search
            </button>
            <button
              onClick={resetFilters}
              className="p-2.5 text-gray-500 hover:text-sidebar-bg border border-gray-200 rounded-lg hover:bg-green-50 transition"
              title="Reset Filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {error ? (
            <div className="px-5 py-12 text-center text-red-500 text-sm">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr className="border-b border-gray-100">
                      {["User Name", "Role", "Join Date", "Account Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className={`px-5 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest ${h === "Actions" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                        </td>
                      </tr>
                    ) : data?.users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                          No users match the current filters.
                        </td>
                      </tr>
                    ) : (
                      data?.users.map((user) => {
                        const [avatarBg, avatarText] = avatarColor(user.id);
                        const isActive = user.is_active;
                        const roleLabel =
                          user.role === "farmer"
                            ? "Farmer"
                            : user.role === "landowner"
                            ? "Landowner"
                            : user.role === "dealer"
                            ? "Dealer"
                            : user.role;
                        const roleBg =
                          user.role === "farmer"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : user.role === "landowner"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-blue-50 text-blue-700 border border-blue-100";

                        return (
                          <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full ${avatarBg} ${avatarText} flex items-center justify-center font-bold text-sm border border-gray-200`}
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
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${roleBg}`}
                              >
                                {user.role === "farmer" ? (
                                  <Sprout className="w-3 h-3" />
                                ) : (
                                  <Mountain className="w-3 h-3" />
                                )}
                                {roleLabel}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-gray-600 text-sm">{user.join_date}</td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                  isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
                                />
                                {isActive ? "Active" : "Suspended"}
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
                                  onClick={() => handleSuspend(user)}
                                  disabled={suspending === user.id}
                                  className={`p-1.5 rounded-lg transition ${
                                    !isActive
                                      ? "text-red-600 bg-red-50 hover:bg-red-100"
                                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  title={isActive ? "Suspend" : "Unsuspend"}
                                >
                                  {suspending === user.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Ban className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                <div className="text-sm text-gray-500">
                  {data ? (
                    <>
                      Showing{" "}
                      <span className="font-bold text-gray-800">
                        {(page - 1) * (data.page_size) + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold text-gray-800">
                        {Math.min(page * data.page_size, data.total)}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-gray-800">{data.total.toLocaleString()}</span>{" "}
                      results
                    </>
                  ) : (
                    "Loading..."
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-sidebar-bg hover:bg-green-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition ${
                          p === page
                            ? "bg-sidebar-bg text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {totalPages > 5 && (
                    <>
                      <span className="px-2 text-gray-400 text-sm">...</span>
                      <button
                        onClick={() => setPage(totalPages)}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition ${
                          page === totalPages
                            ? "bg-sidebar-bg text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:text-sidebar-bg hover:bg-green-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

