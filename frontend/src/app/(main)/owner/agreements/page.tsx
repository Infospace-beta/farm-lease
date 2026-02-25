"use client";

import { useState, useEffect } from "react";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";

type AgreementStatus = "signed" | "draft" | "expired" | "pending";

interface Agreement {
  id: number;
  land: {
    id: number;
    title: string;
  };
  lessee: {
    id: number;
    first_name: string;
    last_name: string;
  };
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: AgreementStatus;
  created_at: string;
  signed_by_owner?: boolean;
  signed_by_lessee?: boolean;
}

const STATUS_MAP: Record<AgreementStatus, { bg: string; text: string; icon: string; label: string }> = {
  signed: { bg: "bg-emerald-100", text: "text-emerald-700", icon: "task_alt", label: "Signed" },
  draft: { bg: "bg-slate-100", text: "text-slate-600", icon: "edit_note", label: "Draft" },
  expired: { bg: "bg-red-100", text: "text-red-700", icon: "event_busy", label: "Expired" },
  pending: { bg: "bg-amber-100", text: "text-amber-700", icon: "schedule", label: "Awaiting Signature" },
};

export default function AgreementsPage() {
  const [search, setSearch] = useState("");
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ownerApi.myAgreements();
      setAgreements(response.data);
    } catch (err: any) {
      console.error("Failed to load agreements:", err);
      setError(err.response?.data?.detail || "Failed to load agreements");
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (id: number) => {
    try {
      await ownerApi.signAgreement(id);
      loadAgreements(); // Reload data
    } catch (err: any) {
      console.error("Failed to sign agreement:", err);
      alert(err.response?.data?.detail || "Failed to sign agreement");
    }
  };

  const handleDownloadPdf = async (id: number) => {
    try {
      const response = await ownerApi.downloadAgreementPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `agreement-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error("Failed to download PDF:", err);
      alert(err.response?.data?.detail || "Failed to download PDF");
    }
  };

  const filtered = agreements.filter(
    (a) =>
      a.land.title.toLowerCase().includes(search.toLowerCase()) ||
      `${a.lessee.first_name} ${a.lessee.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      `AGR-${a.id.toString().padStart(3, "0")}`.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Agreements"
        subtitle="View, review and manage all lease contracts for your land assets."
      >
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-base">download</span>
          Download All
        </button>
      </OwnerPageHeader>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-slate-500">Loading agreements...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadAgreements}
                className="mt-3 text-sm font-semibold text-red-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats */}
              <div className="mb-6 grid gap-3 sm:grid-cols-4">
                {[
                  { label: "Total", value: agreements.length, color: "text-slate-800" },
                  { label: "Signed", value: agreements.filter((a) => a.status === "signed").length, color: "text-emerald-600" },
                  { label: "Draft", value: agreements.filter((a) => a.status === "draft").length, color: "text-slate-600" },
                  { label: "Pending Sign", value: agreements.filter((a) => a.status === "pending").length, color: "text-amber-600" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-white border border-slate-200 p-4 text-center">
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

              {/* Empty state */}
              {agreements.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                    description
                  </span>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">
                    No agreements found
                  </h3>
                  <p className="text-sm text-slate-500">
                    Your lease agreements will appear here once created.
                  </p>
                </div>
              )}

              {/* List */}
              <div className="space-y-4">
                {filtered.map((a) => {
                  const s = STATUS_MAP[a.status];
                  const tenantName = `${a.lessee.first_name} ${a.lessee.last_name}`;
                  const agreementId = `AGR-${a.id.toString().padStart(3, "0")}`;

                  return (
                    <div key={a.id} className="group rounded-2xl bg-white border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary">
                            <span className="material-symbols-outlined text-2xl">description</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-800">{agreementId}</span>
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}>
                                {s.label}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5">
                              <span className="font-medium">{a.land.title}</span>
                              {" · "}{tenantName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {formatDate(a.start_date)} – {formatDate(a.end_date)} · {formatCurrency(a.monthly_rent)} / month
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {a.status === "signed" && (
                            <button
                              onClick={() => handleDownloadPdf(a.id)}
                              className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                              <span className="material-symbols-outlined text-sm">download</span>
                              PDF
                            </button>
                          )}
                          {(a.status === "draft" || a.status === "pending") && !a.signed_by_owner && (
                            <button
                              onClick={() => handleSign(a.id)}
                              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-dark transition-colors shadow-sm"
                            >
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
                        <span>Plot ID: <span className="font-medium text-slate-600">PL-{a.land.id}</span></span>
                        <span>Tenant ID: <span className="font-medium text-slate-600">T-{a.lessee.id}</span></span>
                        <span>Created: <span className="font-medium text-slate-600">{formatDate(a.created_at)}</span></span>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && agreements.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <span className="material-symbols-outlined text-5xl mb-3">folder_open</span>
                    <p className="text-sm font-medium">No agreements found matching your search</p>
                  </div>
                )}
              </div>
            </>
          )}
