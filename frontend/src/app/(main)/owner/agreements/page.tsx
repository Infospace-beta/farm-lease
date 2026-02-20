"use client";

import { useState } from "react";
import PageHeader from "@/components/owner/PageHeader";

type AgreementStatus = "signed" | "draft" | "expired" | "pending";

const agreements = [
  {
    id: "AGR-001", plot: "Highland North", plotId: "PL-A401",
    tenant: "John Doe",    tenantId: "T-1042",
    startDate: "Jan 1, 2024",  endDate: "Dec 31, 2024",
    rent: "Ksh 50,000 / month", status: "signed" as AgreementStatus,
    createdAt: "Dec 20, 2023",
  },
  {
    id: "AGR-002", plot: "Sunset Orchards", plotId: "PL-E220",
    tenant: "GreenLeaf Co.", tenantId: "T-2031",
    startDate: "Jul 1, 2024",  endDate: "Jun 30, 2026",
    rent: "Ksh 120,000 / month", status: "signed" as AgreementStatus,
    createdAt: "Jun 15, 2024",
  },
  {
    id: "AGR-003", plot: "Valley Farms", plotId: "PL-C109",
    tenant: "Michael K.",  tenantId: "T-3087",
    startDate: "Mar 1, 2026",  endDate: "Feb 28, 2029",
    rent: "Ksh 60,000 / month", status: "draft" as AgreementStatus,
    createdAt: "Feb 18, 2026",
  },
  {
    id: "AGR-004", plot: "Eastern Ridge", plotId: "PL-B205",
    tenant: "Jane Smith",  tenantId: "T-4015",
    startDate: "Mar 1, 2026",  endDate: "Feb 28, 2028",
    rent: "Ksh 45,000 / month", status: "pending" as AgreementStatus,
    createdAt: "Feb 19, 2026",
  },
];

const STATUS_MAP: Record<AgreementStatus, { bg: string; text: string; icon: string; label: string }> = {
  signed:  { bg: "bg-emerald-100", text: "text-emerald-700", icon: "task_alt",  label: "Signed" },
  draft:   { bg: "bg-slate-100",   text: "text-slate-600",   icon: "edit_note", label: "Draft" },
  expired: { bg: "bg-red-100",     text: "text-red-700",     icon: "event_busy",label: "Expired" },
  pending: { bg: "bg-amber-100",   text: "text-amber-700",   icon: "schedule",  label: "Awaiting Signature" },
};

export default function AgreementsPage() {
  const [search, setSearch] = useState("");

  const filtered = agreements.filter(
    (a) =>
      a.plot.toLowerCase().includes(search.toLowerCase()) ||
      a.tenant.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="Agreements"
          description="View, review and manage all lease contracts for your land assets."
          actions={[
            { label: "Download All", icon: "download" },
          ]}
        />

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total",        value: agreements.length,                                       color: "text-slate-800" },
            { label: "Signed",       value: agreements.filter((a) => a.status === "signed").length,  color: "text-emerald-600" },
            { label: "Draft",        value: agreements.filter((a) => a.status === "draft").length,   color: "text-slate-600" },
            { label: "Pending Sign", value: agreements.filter((a) => a.status === "pending").length, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plot, tenant, or agreement ID..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none shadow-sm"
          />
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.map((a) => {
            const s = STATUS_MAP[a.status];
            return (
              <div key={a.id} className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                      <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">{a.id}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        <span className="font-medium">{a.plot}</span>
                        {" · "}{a.tenant}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {a.startDate} – {a.endDate} · {a.rent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === "signed" && (
                      <button className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">
                        <span className="material-symbols-outlined text-sm">download</span>
                        PDF
                      </button>
                    )}
                    {(a.status === "draft" || a.status === "pending") && (
                      <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-sm">draw</span>
                        {a.status === "draft" ? "Review & Sign" : "Send for Signing"}
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      View
                    </button>
                  </div>
                </div>

                {/* Footer meta */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-6 text-xs text-slate-400">
                  <span>Plot ID: <span className="font-medium text-slate-600">{a.plotId}</span></span>
                  <span>Tenant ID: <span className="font-medium text-slate-600">{a.tenantId}</span></span>
                  <span>Created: <span className="font-medium text-slate-600">{a.createdAt}</span></span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <span className="material-symbols-outlined text-5xl mb-3">folder_open</span>
              <p className="text-sm font-medium">No agreements found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
