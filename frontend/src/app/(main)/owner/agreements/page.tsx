"use client";

import { useState, useEffect, useMemo } from "react";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";
import ESignatureInput from "@/components/lessee/ESignatureInput";
import LeaseAgreementPanel from "@/components/lessee/LeaseAgreementPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AgreementStatus = "active" | "pending" | "draft" | "expired";

interface Agreement {
  id: number;
  land: { id: number; title: string; location?: string };
  lessee: { id: number; first_name: string; last_name: string; email?: string };
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: "active" | "pending" | "draft" | "expired";
  created_at: string;
  // Agreement content
  intended_use?: string;
  special_conditions?: string;
  // Signature state
  lessee_submitted: boolean;
  lessee_submitted_at?: string;
  owner_signed: boolean;
  lessee_signed: boolean;
  owner_signature?: string;
  lessee_signature?: string;
  // Witness
  witness_name?: string;
  witness_id_number?: string;
  witness_phone?: string;
  witness_signature?: string;
  witness_signed_at?: string;
  // Derived names (serializer may provide these)
  land_name?: string;
  land_location?: string;
  lessor_name?: string;
  lessee_name?: string;
}

function agreementStage(a: Agreement): { label: string; color: string; bg: string } {
  if (a.status === "active")
    return { label: "Active", color: "text-emerald-700", bg: "bg-emerald-100" };
  if (a.owner_signed && !a.witness_signed_at)
    return { label: "Awaiting Witness", color: "text-sky-700", bg: "bg-sky-100" };
  if (a.lessee_submitted && !a.owner_signed)
    return { label: "Needs Your Signature", color: "text-amber-700", bg: "bg-amber-100" };
  if (!a.lessee_submitted)
    return { label: "Awaiting Lessee", color: "text-slate-600", bg: "bg-slate-100" };
  if (a.status === "expired")
    return { label: "Expired", color: "text-red-700", bg: "bg-red-100" };
  return { label: "Draft", color: "text-slate-600", bg: "bg-slate-100" };
}

export default function AgreementsPage() {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Sign modal
  const [signTarget, setSignTarget] = useState<Agreement | null>(null);
  const [ownerSig, setOwnerSig] = useState("");
  const [signing, setSigning] = useState(false);

  // View panel
  const [viewTarget, setViewTarget] = useState<Agreement | null>(null);

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ownerApi.myAgreements();
      const data: Agreement[] = Array.isArray(response.data)
        ? response.data
        : (response.data?.results ?? []);
      setAgreements(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load agreements.");
    } finally {
      setLoading(false);
    }
  };

  const confirmSign = async () => {
    if (!signTarget || !ownerSig.trim()) return;
    setSigning(true);
    try {
      await ownerApi.signAgreement(signTarget.id, ownerSig.trim());
      setSignTarget(null);
      setOwnerSig("");
      await loadAgreements();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to sign agreement. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  const filtered = useMemo(
    () =>
      agreements.filter((a) => {
        const q = search.toLowerCase();
        const tenant = `${a.lessee.first_name} ${a.lessee.last_name}`.toLowerCase();
        const land = (a.land_name ?? a.land.title).toLowerCase();
        const id = `agr-${a.id.toString().padStart(3, "0")}`;
        return !q || land.includes(q) || tenant.includes(q) || id.includes(q);
      }),
    [agreements, search]
  );

  const stats = useMemo(
    () => ({
      total: agreements.length,
      needsSign: agreements.filter((a) => a.lessee_submitted && !a.owner_signed).length,
      active: agreements.filter((a) => a.status === "active").length,
      awaiting: agreements.filter(
        (a) => !a.lessee_submitted && a.status !== "active" && a.status !== "expired"
      ).length,
    }),
    [agreements]
  );

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  const formatCurrency = (n: number) => `Ksh ${n.toLocaleString()}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Agreements"
        subtitle="Review and co-sign lease agreements submitted by your tenants."
      />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="w-full max-w-5xl mx-auto">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
                  style={{ borderColor: "#16a34a" }}
                />
                <p className="text-sm text-slate-500">Loading agreements…</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
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
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Total", value: stats.total, color: "text-slate-800" },
                  {
                    label: "Needs Signature",
                    value: stats.needsSign,
                    color: stats.needsSign > 0 ? "text-amber-600" : "text-slate-800",
                  },
                  { label: "Active", value: stats.active, color: "text-emerald-600" },
                  { label: "Awaiting Lessee", value: stats.awaiting, color: "text-slate-500" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white border border-slate-200 p-4 text-center shadow-sm">
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="mb-6 relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by land, tenant, or agreement ID…"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:outline-none shadow-sm"
                />
              </div>

              {/* Needs signature banner */}
              {stats.needsSign > 0 && (
                <div
                  className="mb-6 flex items-center gap-3 rounded-xl border px-4 py-3"
                  style={{ borderColor: "#16a34a33", backgroundColor: "#f0fdf4" }}
                >
                  <span className="material-icons-round text-xl" style={{ color: "#16a34a" }}>draw</span>
                  <p className="text-sm font-medium text-slate-700">
                    <span style={{ color: "#16a34a" }} className="font-bold">{stats.needsSign}</span>{" "}
                    agreement{stats.needsSign > 1 ? "s need" : " needs"} your signature.
                  </p>
                </div>
              )}

              {/* Empty state */}
              {agreements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <span className="material-icons-round text-6xl mb-4">description</span>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">No agreements yet</h3>
                  <p className="text-sm">Lease agreements will appear here once lessees submit them.</p>
                </div>
              )}

              {/* Agreement cards */}
              <div className="space-y-4">
                {filtered.map((a) => {
                  const stage = agreementStage(a);
                  const tenantName = a.lessee_name ?? `${a.lessee.first_name} ${a.lessee.last_name}`;
                  const landTitle = a.land_name ?? a.land.title;
                  const agrid = `AGR-${a.id.toString().padStart(3, "0")}`;
                  const needsSign = a.lessee_submitted && !a.owner_signed;

                  return (
                    <div
                      key={a.id}
                      className="rounded-2xl bg-white border shadow-sm p-5 transition-all hover:shadow-md"
                      style={{ borderColor: needsSign ? "#16a34a66" : "#e2e8f0" }}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        {/* Left info */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                          >
                            <span className="material-icons-round text-2xl">description</span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-slate-800">{agrid}</span>
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${stage.bg} ${stage.color}`}>
                                {stage.label}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5">
                              <span className="font-medium">{landTitle}</span>
                              {" · "}{tenantName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {formatDate(a.start_date)} – {formatDate(a.end_date)}{" "}
                              · {formatCurrency(a.monthly_rent)} / mo
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            onClick={() => setViewTarget(a)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <span className="material-icons-round text-sm">visibility</span>
                            View
                          </button>

                          {needsSign && (
                            <button
                              onClick={() => { setSignTarget(a); setOwnerSig(""); }}
                              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm transition-colors"
                              style={{ backgroundColor: "#16a34a" }}
                            >
                              <span className="material-icons-round text-sm">draw</span>
                              Sign Agreement
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Signature progress */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex flex-wrap gap-4 text-xs">
                          <SignBadge label="Lessee" signed={a.lessee_signed} />
                          <SignBadge label="Owner (You)" signed={a.owner_signed} />
                          <SignBadge label="Witness" signed={!!a.witness_signature} />
                          {a.lessee_submitted_at && (
                            <span className="text-slate-400">
                              Submitted {formatDate(a.lessee_submitted_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && agreements.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <span className="material-icons-round text-5xl mb-3">folder_open</span>
                    <p className="text-sm font-medium">No agreements match your search.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Sign Modal ──────────────────────────────────────────────────────────── */}
      {signTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
              style={{ backgroundColor: "#0f392b" }}
            >
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-xl" style={{ color: "#13ec80" }}>draw</span>
                <div>
                  <p className="text-sm font-bold text-white">Co-sign Agreement</p>
                  <p className="text-xs" style={{ color: "#13ec8099" }}>
                    AGR-{signTarget.id.toString().padStart(3, "0")} ·{" "}
                    {signTarget.land_name ?? signTarget.land.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSignTarget(null)}
                className="rounded-lg p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="material-icons-round text-xl">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Summary */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenant</span>
                  <span className="font-medium text-slate-800">
                    {signTarget.lessee_name ??
                      `${signTarget.lessee.first_name} ${signTarget.lessee.last_name}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Land</span>
                  <span className="font-medium text-slate-800">
                    {signTarget.land_name ?? signTarget.land.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Term</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(signTarget.start_date)} – {formatDate(signTarget.end_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Rent</span>
                  <span className="font-bold" style={{ color: "#16a34a" }}>
                    {formatCurrency(signTarget.monthly_rent)}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <span className="material-icons-round text-sm mt-0.5 text-amber-600">info</span>
                <p className="text-xs text-amber-700">
                  By signing below you confirm you have reviewed the full lease agreement and agree to
                  all terms. This signature is legally binding.
                </p>
              </div>

              {/* Signature */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Your Signature (Type Full Legal Name)
                </p>
                <ESignatureInput
                  value={ownerSig}
                  onChange={setOwnerSig}
                  label="Owner / Lessor Signature"
                  disabled={signing}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setSignTarget(null)}
                disabled={signing}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSign}
                disabled={signing || !ownerSig.trim()}
                className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#16a34a" }}
              >
                {signing ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing…
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-base">check_circle</span>
                    Confirm &amp; Sign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Agreement Panel ─────────────────────────────────────────────── */}
      {viewTarget && (
        <LeaseAgreementPanel
          agreement={{
            id: viewTarget.id,
            land: viewTarget.land.id,
            land_name: viewTarget.land_name ?? viewTarget.land.title,
            land_location: viewTarget.land_location ?? viewTarget.land.location ?? "",
            owner: 0,
            lessor_name: viewTarget.lessor_name ?? "",
            lessee: viewTarget.lessee.id,
            lessee_name: viewTarget.lessee_name ?? `${viewTarget.lessee.first_name} ${viewTarget.lessee.last_name}`,
            start_date: viewTarget.start_date,
            end_date: viewTarget.end_date,
            monthly_rent: viewTarget.monthly_rent,
            status: viewTarget.status,
            lessee_submitted: viewTarget.lessee_submitted,
            lessee_submitted_at: viewTarget.lessee_submitted_at,
            owner_signed: viewTarget.owner_signed,
            lessee_signed: viewTarget.lessee_signed,
            owner_signature: viewTarget.owner_signature,
            lessee_signature: viewTarget.lessee_signature,
            intended_use: viewTarget.intended_use,
            special_conditions: viewTarget.special_conditions,
            witness_name: viewTarget.witness_name,
            witness_id_number: viewTarget.witness_id_number,
            witness_phone: viewTarget.witness_phone,
            witness_signature: viewTarget.witness_signature,
            witness_signed_at: viewTarget.witness_signed_at,
          }}
          myName=""
          onClose={() => setViewTarget(null)}
          onSubmitted={() => { setViewTarget(null); loadAgreements(); }}
        />
      )}
    </div>
  );
}

function SignBadge({ label, signed }: { label: string; signed: boolean }) {
  return (
    <span className={`flex items-center gap-1 font-medium ${signed ? "text-emerald-600" : "text-slate-400"}`}>
      <span className="material-icons-round text-sm">{signed ? "check_circle" : "radio_button_unchecked"}</span>
      {label}
    </span>
  );
}
