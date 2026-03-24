"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { FileDown } from "lucide-react";
import { adminApi } from "@/lib/services/api";

const paymentsData = [
  { id: 1, ref: "PAY-00341", tenant: "Jane Smith", landTitle: "Fertile Valley Farm", amount: 45000, method: "M-Pesa", date: "May 1, 2025", status: "Completed" },
  { id: 2, ref: "PAY-00342", tenant: "Moses Kariuki", landTitle: "Highland Pastures", amount: 32000, method: "Bank Transfer", date: "May 4, 2025", status: "Completed" },
  { id: 3, ref: "PAY-00343", tenant: "Alice Wanjiku", landTitle: "Riverside Plots", amount: 18000, method: "M-Pesa", date: "May 7, 2025", status: "Pending" },
  { id: 4, ref: "PAY-00344", tenant: "David Kamau", landTitle: "Savanna Grazing Land", amount: 70000, method: "Bank Transfer", date: "May 9, 2025", status: "Failed" },
  { id: 5, ref: "PAY-00345", tenant: "Grace Achieng", landTitle: "Coastal Cropland", amount: 25000, method: "M-Pesa", date: "May 12, 2025", status: "Completed" },
];

const agreementsData = [
  { id: 1, tenant: "Jane Smith", landowner: "John Doe", landTitle: "Fertile Valley Farm", start: "Jan 1, 2025", end: "Dec 31, 2025", rent: 45000, status: "Active" },
  { id: 2, tenant: "Moses Kariuki", landowner: "Grace Achieng", landTitle: "Highland Pastures", start: "Feb 1, 2025", end: "Jan 31, 2026", rent: 32000, status: "Active" },
  { id: 3, tenant: "Alice Wanjiku", landowner: "David Kamau", landTitle: "Riverside Plots", start: "Mar 1, 2024", end: "Feb 28, 2025", rent: 18000, status: "Expired" },
  { id: 4, tenant: "Peter Omondi", landowner: "Hassan Mwangi", landTitle: "Savanna Grazing Land", start: "Jun 1, 2025", end: "May 31, 2026", rent: 70000, status: "Pending" },
];


const PAYMENT_STATUS = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Failed: "bg-red-100 text-red-700",
};

const AGREEMENT_STATUS = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Expired: "bg-gray-100 text-gray-600",
};

type AdminEscrowRow = {
  id: number;
  agreement_id: number | null;
  land_title: string | null;
  owner_name: string | null;
  lessee_name: string | null;
  amount: number;
  held_amount: number;
  released_amount: number;
  status: string;
  amount_received: boolean;
  lessee_agreed: boolean;
  owner_signed: boolean;
  can_be_released: boolean;
  amount_received_at: string | null;
  released_at: string | null;
};

type AdminWithdrawalRow = {
  transaction_id: string;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  amount: number;
  phone_number: string | null;
  created_at: string | null;
  description: string | null;
};

export default function FinanceContractsPage() {
  const [tab, setTab] = useState<"payments" | "escrow" | "agreements">("payments");

  const [escrows, setEscrows] = useState<AdminEscrowRow[]>([]);
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalRow[]>([]);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowError, setEscrowError] = useState<string | null>(null);

  const loadEscrowData = async () => {
    try {
      setEscrowLoading(true);
      setEscrowError(null);
      const [escrowRes, withdrawalRes] = await Promise.all([
        adminApi.escrow(),
        adminApi.withdrawalRequests(),
      ]);
      setEscrows(escrowRes.data?.escrows ?? []);
      setWithdrawals(withdrawalRes.data?.results ?? []);
    } catch {
      setEscrowError("Failed to load escrow data.");
    } finally {
      setEscrowLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "escrow") {
      loadEscrowData();
    }
  }, [tab]);

  const handleReleaseEscrow = async (escrowId: number) => {
    try {
      await adminApi.releaseEscrow(escrowId);
      await loadEscrowData();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.detail || "Failed to release escrow.";
      setEscrowError(msg);
    }
  };

  const handleReleaseWithdrawal = async (transactionId: string) => {
    try {
      await adminApi.releaseWithdrawal(transactionId);
      await loadEscrowData();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to release withdrawal.";
      setEscrowError(msg);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <AdminPageHeader
        title="Finance & Contracts"
        subtitle="Monitor lease payments, review signed agreements, and manage escrow releases."
      >
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition shadow-sm text-sm font-medium">
          <FileDown className="w-4 h-4" />
          Export
        </button>
      </AdminPageHeader>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-5 lg:px-8 pt-4 border-b border-slate-200 bg-white shrink-0">
        {([
          { key: "payments", label: "Payments", icon: "payments" },
          { key: "escrow", label: "Escrow", icon: "lock_clock" },
          { key: "agreements", label: "Agreements", icon: "description" },
        ] as { key: "payments" | "escrow" | "agreements"; label: string; icon: string; badge?: number }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition -mb-px border-b-2 ${tab === t.key
                ? "text-[#0f392b] border-[#0f392b] bg-emerald-50"
                : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
              }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{t.icon}</span>
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="ml-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5">{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ ESCROW TAB ═══ */}
      {tab === "escrow" && (
        <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
          {escrowLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f392b] mx-auto mb-4" />
                <p className="text-sm text-slate-500">Loading escrow…</p>
              </div>
            </div>
          )}

          {escrowError && !escrowLoading && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center mb-4">
              <p className="text-sm text-red-600">{escrowError}</p>
              <button onClick={loadEscrowData} className="mt-2 text-sm font-semibold text-red-700 hover:underline">
                Retry
              </button>
            </div>
          )}

          {!escrowLoading && !escrowError && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  {
                    label: "Total Held",
                    value: `Ksh ${Math.round(escrows.reduce((a, c) => a + Number(c.held_amount || 0), 0)).toLocaleString()}`,
                    color: "text-[#0f392b]",
                    bg: "bg-emerald-50",
                    icon: "lock",
                  },
                  {
                    label: "Ready to Release",
                    value: escrows.filter((e) => e.can_be_released).length,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    icon: "published_with_changes",
                  },
                  {
                    label: "Pending Withdrawals",
                    value: withdrawals.length,
                    color: "text-slate-700",
                    bg: "bg-slate-100",
                    icon: "payments",
                  },
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

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>Escrow Accounts</h3>
                  <span className="text-xs text-gray-400">{escrows.length} record(s)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                      <tr>
                        <th className="px-6 py-3 text-left">Escrow</th>
                        <th className="px-6 py-3 text-left">Land</th>
                        <th className="px-6 py-3 text-left">Lessee</th>
                        <th className="px-6 py-3 text-left">Owner</th>
                        <th className="px-6 py-3 text-right">Held</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {escrows.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">ESC-{e.id}</td>
                          <td className="px-6 py-4 text-gray-700 text-xs">{e.land_title ?? "—"}</td>
                          <td className="px-6 py-4 text-gray-700 text-xs">{e.lessee_name ?? "—"}</td>
                          <td className="px-6 py-4 text-gray-700 text-xs">{e.owner_name ?? "—"}</td>
                          <td className="px-6 py-4 text-right font-bold text-[#0f392b]">Ksh {Math.round(Number(e.held_amount || 0)).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${e.can_be_released ? "bg-amber-100 text-amber-700" : e.status === "released" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}`}>
                              {e.can_be_released ? "Ready" : e.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleReleaseEscrow(e.id)}
                              disabled={!e.can_be_released}
                              className="px-3 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition"
                            >
                              Release Funds
                            </button>
                          </td>
                        </tr>
                      ))}
                      {escrows.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-400">No escrow records yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>Withdrawal Requests</h3>
                  <span className="text-xs text-gray-400">{withdrawals.length} pending</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                      <tr>
                        <th className="px-6 py-3 text-left">Request</th>
                        <th className="px-6 py-3 text-left">Owner</th>
                        <th className="px-6 py-3 text-left">Phone</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {withdrawals.map((w) => (
                        <tr key={w.transaction_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">{w.transaction_id}</td>
                          <td className="px-6 py-4 text-gray-700 text-xs">{w.owner_name}</td>
                          <td className="px-6 py-4 text-gray-500 text-xs">{w.phone_number ?? "—"}</td>
                          <td className="px-6 py-4 text-right font-bold text-[#0f392b]">Ksh {Math.round(Number(w.amount || 0)).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleReleaseWithdrawal(w.transaction_id)}
                              className="px-3 py-2 rounded-lg text-xs font-bold bg-sidebar-bg text-white hover:bg-[#0d2e22] transition"
                            >
                              Release Funds
                            </button>
                          </td>
                        </tr>
                      ))}
                      {withdrawals.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">No pending withdrawal requests.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══ PAYMENTS TAB ═══ */}
      {tab === "payments" && (
        <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Collected",
                value: `Ksh ${paymentsData.filter((p) => p.status === "Completed").reduce((a, c) => a + c.amount, 0).toLocaleString()}`,
                color: "text-[#0f392b]",
                bg: "bg-emerald-50",
                icon: "payments",
              },
              {
                label: "Pending Payments",
                value: paymentsData.filter((p) => p.status === "Pending").length,
                color: "text-amber-600",
                bg: "bg-amber-50",
                icon: "schedule",
              },
              {
                label: "Failed Transactions",
                value: paymentsData.filter((p) => p.status === "Failed").length,
                color: "text-red-600",
                bg: "bg-red-50",
                icon: "error",
              },
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
              <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>Payment Records</h3>
              <span className="text-xs text-gray-400">{paymentsData.length} transactions</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Reference</th>
                  <th className="px-6 py-3 text-left">Tenant</th>
                  <th className="px-6 py-3 text-left">Land</th>
                  <th className="px-6 py-3 text-left">Method</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paymentsData.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p.ref}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{p.tenant}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{p.landTitle}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{p.method}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{p.date}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#0f392b]">
                      Ksh {p.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PAYMENT_STATUS[p.status as keyof typeof PAYMENT_STATUS]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ AGREEMENTS TAB ═══ */}
      {tab === "agreements" && (
        <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Active Leases", value: agreementsData.filter((a) => a.status === "Active").length, color: "text-[#0f392b]", bg: "bg-emerald-50", icon: "description" },
              { label: "Pending Signatures", value: agreementsData.filter((a) => a.status === "Pending").length, color: "text-amber-600", bg: "bg-amber-50", icon: "edit_document" },
              { label: "Expired Leases", value: agreementsData.filter((a) => a.status === "Expired").length, color: "text-gray-500", bg: "bg-gray-50", icon: "event_busy" },
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
              <h3 className="font-bold text-gray-800" style={{ fontFamily: "Playfair Display, serif" }}>Lease Agreements</h3>
              <span className="text-xs text-gray-400">{agreementsData.length} agreements</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Tenant</th>
                  <th className="px-6 py-3 text-left">Landowner</th>
                  <th className="px-6 py-3 text-left">Land Title</th>
                  <th className="px-6 py-3 text-left">Period</th>
                  <th className="px-6 py-3 text-right">Monthly Rent</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {agreementsData.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{a.tenant}</td>
                    <td className="px-6 py-4 text-gray-600">{a.landowner}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{a.landTitle}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{a.start} — {a.end}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#0f392b]">Ksh {a.rent.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${AGREEMENT_STATUS[a.status as keyof typeof AGREEMENT_STATUS]}`}>
                        {a.status}
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
