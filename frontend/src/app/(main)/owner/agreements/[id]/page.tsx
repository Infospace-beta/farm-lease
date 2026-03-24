"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";
import ESignatureInput from "@/components/lessee/ESignatureInput";
import LeaseAgreementPanel from "@/components/lessee/LeaseAgreementPanel";

interface Agreement {
  id: number;
  land: { id: number; title: string; location?: string };
  lessee: { id: number; first_name: string; last_name: string; email?: string };
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: "active" | "pending" | "draft" | "expired";
  created_at: string;
  intended_use?: string;
  special_conditions?: string;
  lessee_submitted: boolean;
  lessee_submitted_at?: string;
  owner_signed: boolean;
  lessee_signed: boolean;
  owner_signature?: string;
  lessee_signature?: string;
  witness_name?: string;
  witness_id_number?: string;
  witness_phone?: string;
  witness_signature?: string;
  witness_signed_at?: string;
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

function SignBadge({ label, signed }: { label: string; signed: boolean }) {
  return (
    <span
      className={`flex items-center gap-1 font-medium ${signed ? "text-emerald-600" : "text-slate-400"}`}
    >
      <span className="material-icons-round text-sm">
        {signed ? "check_circle" : "radio_button_unchecked"}
      </span>
      <span className="text-xs">{label}</span>
    </span>
  );
}

export default function AgreementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agreementId = Number(params.id);

  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sign modal
  const [showSignModal, setShowSignModal] = useState(false);
  const [ownerSig, setOwnerSig] = useState("");
  const [signing, setSigning] = useState(false);

  // View panel
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!agreementId || isNaN(agreementId)) {
      setError("Invalid agreement ID.");
      setLoading(false);
      return;
    }
    loadAgreement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreementId]);

  const loadAgreement = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ownerApi.agreementDetail(agreementId);
      setAgreement(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Agreement not found.");
      } else {
        setError(err.response?.data?.detail || "Failed to load agreement.");
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmSign = async () => {
    if (!agreement || !ownerSig.trim()) return;
    setSigning(true);
    try {
      await ownerApi.signAgreement(agreement.id, ownerSig.trim());
      setShowSignModal(false);
      setOwnerSig("");
      await loadAgreement();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to sign agreement. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  const formatDate = (ds: string) =>
    new Date(ds).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  const formatCurrency = (n: number) => `Ksh ${n.toLocaleString()}`;

  const agrid = agreement ? `AGR-${agreement.id.toString().padStart(3, "0")}` : "";

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Agreement Detail"
        subtitle="View and manage this lease agreement."
      />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="w-full max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            href="/owner/agreements"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
          >
            <span className="material-icons-round text-base">arrow_back</span>
            Back to Agreements
          </Link>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div
                  className="animate-spin rounded-full h-10 w-10 border-b-2 mx-auto mb-4"
                  style={{ borderColor: "#16a34a" }}
                />
                <p className="text-sm text-slate-500">Loading agreement…</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <span className="material-icons-round text-4xl text-red-400 mb-3 block">error_outline</span>
              <p className="text-sm font-medium text-red-700 mb-4">{error}</p>
              {error !== "Agreement not found." && (
                <button
                  onClick={loadAgreement}
                  className="text-sm font-semibold text-red-700 hover:underline"
                >
                  Try Again
                </button>
              )}
              {error === "Agreement not found." && (
                <button
                  onClick={() => router.push("/owner/agreements")}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                >
                  <span className="material-icons-round text-base">arrow_back</span>
                  Back to Agreements
                </button>
              )}
            </div>
          )}

          {/* Agreement Detail */}
          {!loading && !error && agreement && (() => {
            const stage = agreementStage(agreement);
            const tenantName = agreement.lessee_name ?? `${agreement.lessee.first_name} ${agreement.lessee.last_name}`;
            const landTitle = agreement.land_name ?? agreement.land.title;
            const needsSign = agreement.lessee_submitted && !agreement.owner_signed;

            return (
              <div className="space-y-5">
                {/* Header card */}
                <div
                  className="rounded-2xl bg-white border shadow-sm p-6"
                  style={{ borderColor: needsSign ? "#16a34a66" : "#e2e8f0" }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: "#f0fdf4", color: "#16a34a" }}
                      >
                        <span className="material-icons-round text-3xl">description</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-base font-bold text-slate-800">{agrid}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${stage.bg} ${stage.color}`}>
                            {stage.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold">{landTitle}</span>
                          {" · "}
                          <span>{tenantName}</span>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Created {formatDate(agreement.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        onClick={() => setShowPanel(true)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-icons-round text-base">visibility</span>
                        View Full Agreement
                      </button>

                      {needsSign && (
                        <button
                          onClick={() => { setShowSignModal(true); setOwnerSig(""); }}
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors"
                          style={{ backgroundColor: "#16a34a" }}
                        >
                          <span className="material-icons-round text-base">draw</span>
                          Sign Agreement
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Signature progress */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Signature Progress</p>
                    <div className="flex flex-wrap gap-5">
                      <SignBadge label="Lessee" signed={agreement.lessee_signed} />
                      <SignBadge label="Owner (You)" signed={agreement.owner_signed} />
                      <SignBadge label="Witness" signed={!!agreement.witness_signature} />
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Lease info */}
                  <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Lease Details</p>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Land</dt>
                        <dd className="font-semibold text-slate-800 text-right">{landTitle}</dd>
                      </div>
                      {(agreement.land_location ?? agreement.land.location) && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Location</dt>
                          <dd className="font-medium text-slate-700 text-right">
                            {agreement.land_location ?? agreement.land.location}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Start Date</dt>
                        <dd className="font-medium text-slate-700">{formatDate(agreement.start_date)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">End Date</dt>
                        <dd className="font-medium text-slate-700">{formatDate(agreement.end_date)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Monthly Rent</dt>
                        <dd className="font-bold" style={{ color: "#16a34a" }}>
                          {formatCurrency(agreement.monthly_rent)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Parties */}
                  <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Parties</p>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Lessor (You)</dt>
                        <dd className="font-semibold text-slate-800 text-right">
                          {agreement.lessor_name || "—"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Lessee / Tenant</dt>
                        <dd className="font-semibold text-slate-800 text-right">{tenantName}</dd>
                      </div>
                      {agreement.lessee.email && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Tenant Email</dt>
                          <dd className="font-medium text-slate-600 text-right text-xs">{agreement.lessee.email}</dd>
                        </div>
                      )}
                      {agreement.lessee_submitted_at && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500">Submitted</dt>
                          <dd className="font-medium text-slate-700">{formatDate(agreement.lessee_submitted_at)}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Witness section (if present) */}
                {(agreement.witness_name || agreement.witness_signature) && (
                  <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Witness Information</p>
                    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      {agreement.witness_name && (
                        <div>
                          <dt className="text-xs text-slate-400 mb-0.5">Name</dt>
                          <dd className="font-semibold text-slate-800">{agreement.witness_name}</dd>
                        </div>
                      )}
                      {agreement.witness_id_number && (
                        <div>
                          <dt className="text-xs text-slate-400 mb-0.5">ID Number</dt>
                          <dd className="font-medium text-slate-700">{agreement.witness_id_number}</dd>
                        </div>
                      )}
                      {agreement.witness_phone && (
                        <div>
                          <dt className="text-xs text-slate-400 mb-0.5">Phone</dt>
                          <dd className="font-medium text-slate-700">{agreement.witness_phone}</dd>
                        </div>
                      )}
                      {agreement.witness_signed_at && (
                        <div>
                          <dt className="text-xs text-slate-400 mb-0.5">Signed At</dt>
                          <dd className="font-medium text-slate-700">{formatDate(agreement.witness_signed_at)}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Needs-sign call-to-action banner */}
                {needsSign && (
                  <div
                    className="rounded-2xl border p-5 flex items-center gap-4"
                    style={{ borderColor: "#16a34a33", backgroundColor: "#f0fdf4" }}
                  >
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                    >
                      <span className="material-icons-round text-2xl">draw</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">Your signature is required</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        The lessee has submitted this agreement. Review it and add your co-signature to proceed.
                      </p>
                    </div>
                    <button
                      onClick={() => { setShowSignModal(true); setOwnerSig(""); }}
                      className="shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors"
                      style={{ backgroundColor: "#16a34a" }}
                    >
                      <span className="material-icons-round text-base">draw</span>
                      Sign Now
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Sign Modal ──────────────────────────────────────────────────────── */}
      {showSignModal && agreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-sidebar-bg">
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-xl" style={{ color: "#13ec80" }}>draw</span>
                <div>
                  <p className="text-sm font-bold text-white">Co-sign Agreement</p>
                  <p className="text-xs" style={{ color: "#13ec8099" }}>
                    {agrid} · {agreement.land_name ?? agreement.land.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
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
                    {agreement.lessee_name ?? `${agreement.lessee.first_name} ${agreement.lessee.last_name}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Land</span>
                  <span className="font-medium text-slate-800">
                    {agreement.land_name ?? agreement.land.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Term</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(agreement.start_date)} – {formatDate(agreement.end_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Rent</span>
                  <span className="font-bold" style={{ color: "#16a34a" }}>
                    {formatCurrency(agreement.monthly_rent)}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <span className="material-icons-round text-sm mt-0.5 text-amber-600">info</span>
                <p className="text-xs text-amber-700">
                  By signing below you confirm you have reviewed the full lease agreement and agree
                  to all terms. This signature is legally binding.
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
                onClick={() => setShowSignModal(false)}
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
      {showPanel && agreement && (
        <LeaseAgreementPanel
          agreement={{
            id: agreement.id,
            land: agreement.land.id,
            land_name: agreement.land_name ?? agreement.land.title,
            land_location: agreement.land_location ?? agreement.land.location ?? "",
            owner: 0,
            lessor_name: agreement.lessor_name ?? "",
            lessee: agreement.lessee.id,
            lessee_name: agreement.lessee_name ?? `${agreement.lessee.first_name} ${agreement.lessee.last_name}`,
            start_date: agreement.start_date,
            end_date: agreement.end_date,
            monthly_rent: agreement.monthly_rent,
            status: agreement.status,
            lessee_submitted: agreement.lessee_submitted,
            lessee_submitted_at: agreement.lessee_submitted_at,
            owner_signed: agreement.owner_signed,
            lessee_signed: agreement.lessee_signed,
            owner_signature: agreement.owner_signature,
            lessee_signature: agreement.lessee_signature,
            intended_use: agreement.intended_use,
            special_conditions: agreement.special_conditions,
            witness_name: agreement.witness_name,
            witness_id_number: agreement.witness_id_number,
            witness_phone: agreement.witness_phone,
            witness_signature: agreement.witness_signature,
            witness_signed_at: agreement.witness_signed_at,
          }}
          myName=""
          onClose={() => setShowPanel(false)}
          onSubmitted={() => { setShowPanel(false); loadAgreement(); }}
        />
      )}
    </div>
  );
}
