"use client";

import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { FileDown } from "lucide-react";

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

const disputesData = [
  { id: 1, raiser: "Jane Smith", against: "John Doe", landTitle: "Fertile Valley Farm", reason: "Non-refund of deposit after early exit.", filed: "Apr 20, 2025", status: "Open" },
  { id: 2, raiser: "Moses Kariuki", against: "Grace Achieng", landTitle: "Highland Pastures", reason: "Undisclosed drainage issues on the property.", filed: "May 2, 2025", status: "Under Review" },
  { id: 3, raiser: "David Kamau", against: "Alice Wanjiku", landTitle: "Riverside Plots", reason: "Unpaid rent for March 2025.", filed: "Apr 8, 2025", status: "Resolved" },
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

const DISPUTE_STATUS = {
  Open: "bg-red-100 text-red-700",
  "Under Review": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function FinanceContractsPage() {
  const [tab, setTab] = useState<"payments" | "agreements" | "disputes">("payments");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <AdminPageHeader
        title="Finance & Contracts"
        subtitle="Monitor lease payments, review signed agreements, and manage tenant-landowner disputes."
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
          { key: "agreements", label: "Agreements", icon: "description" },
          { key: "disputes", label: "Disputes", icon: "gavel", badge: disputesData.filter((d) => d.status !== "Resolved").length },
        ] as { key: "payments" | "agreements" | "disputes"; label: string; icon: string; badge?: number }[]).map((t) => (
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

      {/* ═══ DISPUTES TAB ═══ */}
      {tab === "disputes" && (
        <div className="flex-1 overflow-y-auto p-5 lg:p-8 bg-slate-50">
          {disputesData.length === 0 ? (
            <div className="py-24 text-center text-gray-400">
              <span className="material-symbols-outlined text-5xl mb-3 block">gavel</span>
              <p className="font-semibold text-gray-500">No disputes on record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputesData.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-400" style={{ fontSize: 18 }}>gavel</span>
                      <span className="font-bold text-gray-800 text-sm">Dispute #{String(d.id).padStart(4, "0")}</span>
                      <span className="text-xs text-gray-400">Filed {d.filed}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${DISPUTE_STATUS[d.status as keyof typeof DISPUTE_STATUS]}`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="px-6 py-4 grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Raised By</p>
                      <p className="font-semibold text-gray-800">{d.raiser}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Against</p>
                      <p className="font-semibold text-gray-800">{d.against}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Land</p>
                      <p className="text-gray-600">{d.landTitle}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Issue</p>
                      <p className="text-gray-700">{d.reason}</p>
                    </div>
                    {d.status !== "Resolved" && (
                      <div className="col-span-3 flex gap-2 pt-2">
                        <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                          Mark as Resolved
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition flex items-center gap-1.5">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>visibility</span>
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
