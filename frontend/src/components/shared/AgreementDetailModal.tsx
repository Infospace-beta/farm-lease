"use client";
import { useState } from "react";
import { ownerApi } from "@/lib/services/api";

// ── Flexible Agreement type (works for both owner & lessee API shapes) ─────
export interface AgreementForModal {
  id: number;
  // land info — may come as nested object (owner) or flat strings (lessee)
  land?: { id?: number; title?: string; location?: string } | number | null;
  land_name?: string;
  land_location?: string;
  land_area?: number;
  land_county?: string;
  // parties
  owner?: number | { id?: number };
  lessor_name?: string;
  lessor_id_number?: string;
  lessee?: { id?: number; first_name?: string; last_name?: string } | number;
  lessee_name?: string;
  lessee_id_number?: string;
  // terms
  start_date: string;
  end_date: string;
  monthly_rent: number | string;
  status: string;
  intended_use?: string;
  special_conditions?: string;
  // signatures
  lessee_signature?: string;
  owner_signature?: string;
  lessee_signed: boolean;
  owner_signed: boolean;
  lessee_submitted: boolean;
  lessee_submitted_at?: string;
  owner_signed_at?: string;
  // witness
  witness_name?: string;
  witness_id_number?: string;
  witness_phone?: string;
  witness_signature?: string;
  witness_signed_at?: string;
}

interface Props {
  agreement: AgreementForModal;
  /** "owner" shows sign input; "lessee" shows payment CTA when both signed */
  role: "owner" | "lessee";
  onClose: () => void;
  /** Called after owner successfully signs */
  onSigned?: () => void;
  /** Called when lessee clicks "Pay Now" — caller opens PaymentModal */
  onPaymentOpen?: () => void;
}

const fmt = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-KE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "—";

function getLandName(ag: AgreementForModal): string {
  if (ag.land_name) return ag.land_name;
  if (ag.land && typeof ag.land === "object" && !Array.isArray(ag.land)) {
    const l = ag.land as { title?: string };
    if (l.title) return l.title;
  }
  return "Lease Agreement";
}

function getLandLocation(ag: AgreementForModal): string | undefined {
  if (ag.land_location) return ag.land_location;
  if (ag.land && typeof ag.land === "object" && !Array.isArray(ag.land)) {
    const l = ag.land as { location?: string };
    return l.location;
  }
  return undefined;
}

function getLesseeName(ag: AgreementForModal): string {
  if (ag.lessee_name) return ag.lessee_name;
  if (ag.lessee && typeof ag.lessee === "object") {
    const l = ag.lessee as { first_name?: string; last_name?: string };
    return `${l.first_name ?? ""} ${l.last_name ?? ""}`.trim() || "—";
  }
  return "—";
}

export default function AgreementDetailModal({
  agreement,
  role,
  onClose,
  onSigned,
  onPaymentOpen,
}: Props) {
  const [sig, setSig] = useState("");
  const [signing, setSigning] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const rent = Number(agreement.monthly_rent) || 0;
  const bothSigned = agreement.owner_signed && agreement.lessee_signed;
  const witnessConfirmed = !!agreement.witness_signed_at;
  const isActive = agreement.status === "active";
  const canOwnerSign = role === "owner" && !agreement.owner_signed && agreement.lessee_submitted;

  const landName = getLandName(agreement);
  const landLocation = getLandLocation(agreement);
  const lessorName = agreement.lessor_name ?? "—";
  const lesseeName = getLesseeName(agreement);

  const statusInfo = isActive
    ? { label: "Active", bg: "bg-emerald-100", color: "text-emerald-700" }
    : bothSigned
    ? { label: "Awaiting Witness", bg: "bg-violet-100", color: "text-violet-700" }
    : agreement.lessee_submitted
    ? { label: "Awaiting Owner Signature", bg: "bg-amber-100", color: "text-amber-700" }
    : { label: "Draft", bg: "bg-slate-100", color: "text-slate-600" };

  const handleOwnerSign = async () => {
    if (!sig.trim()) { setErr("Please enter your full legal name as your signature."); return; }
    setSigning(true);
    setErr(null);
    try {
      await ownerApi.signAgreement(agreement.id, sig.trim());
      onSigned?.();
    } catch (e: unknown) {
      const axErr = e as { response?: { data?: { detail?: string } } };
      setErr(axErr.response?.data?.detail ?? "Failed to sign. Please try again.");
    } finally {
      setSigning(false);
    }
  };

  const signatureSteps = [
    {
      label: "Lessee",
      signed: agreement.lessee_signed || agreement.lessee_submitted,
      name: agreement.lessee_signature,
      date: agreement.lessee_submitted_at,
      icon: "person",
    },
    {
      label: "Owner (Lessor)",
      signed: agreement.owner_signed,
      name: agreement.owner_signature,
      date: agreement.owner_signed_at,
      icon: "domain",
    },
    {
      label: "Witness",
      signed: witnessConfirmed,
      name: agreement.witness_name,
      date: agreement.witness_signed_at,
      icon: "supervised_user_circle",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92dvh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="bg-sidebar-bg px-6 py-5 flex items-start justify-between shrink-0">
          <div>
            <p className="text-[#13ec80] text-[10px] font-bold uppercase tracking-widest mb-1">
              Lease Agreement
            </p>
            <h2 className="text-white font-bold text-lg leading-tight">{landName}</h2>
            {landLocation && (
              <p className="text-white/60 text-xs mt-0.5 flex items-center gap-1">
                <span className="material-icons-round text-xs">location_on</span>
                {landLocation}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 shrink-0">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 transition-colors"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {/* Parties */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              PARTIES
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  LESSOR (Owner)
                </p>
                <p className="font-bold text-slate-900 text-sm">{lessorName}</p>
                {agreement.lessor_id_number && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    ID: {agreement.lessor_id_number}
                  </p>
                )}
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  LESSEE (Tenant)
                </p>
                <p className="font-bold text-slate-900 text-sm">{lesseeName}</p>
                {agreement.lessee_id_number && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    ID: {agreement.lessee_id_number}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Lease terms */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              LEASE TERMS
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Start Date</span>
                <span className="font-semibold text-slate-800">{fmt(agreement.start_date)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">End Date</span>
                <span className="font-semibold text-slate-800">{fmt(agreement.end_date)}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-slate-200 pt-3">
                <span className="text-slate-500">Monthly Rent</span>
                <span className="font-extrabold text-sidebar-bg text-base">
                  KES {rent.toLocaleString()}
                </span>
              </div>
              {agreement.land_area && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Area</span>
                  <span className="font-semibold text-slate-800">
                    {agreement.land_area} acres
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Intended use / conditions */}
          {(agreement.intended_use || agreement.special_conditions) && (
            <div className="space-y-3">
              {agreement.intended_use && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    INTENDED USE
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 leading-relaxed">
                    {agreement.intended_use}
                  </p>
                </div>
              )}
              {agreement.special_conditions && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    SPECIAL CONDITIONS
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 leading-relaxed">
                    {agreement.special_conditions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Witness details (if present) */}
          {agreement.witness_name && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                WITNESS
              </p>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-semibold text-slate-800">{agreement.witness_name}</span>
                </div>
                {agreement.witness_id_number && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ID Number</span>
                    <span className="font-semibold text-slate-800">{agreement.witness_id_number}</span>
                  </div>
                )}
                {agreement.witness_phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-semibold text-slate-800">{agreement.witness_phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Signature timeline */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              SIGNATURES
            </p>
            <div className="space-y-2">
              {signatureSteps.map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    step.signed
                      ? "bg-emerald-50 border-emerald-100"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.signed ? "bg-emerald-100" : "bg-slate-200"
                    }`}
                  >
                    {step.signed ? (
                      <span className="material-icons-round text-emerald-600 text-sm">check</span>
                    ) : (
                      <span className="material-icons-round text-slate-400 text-sm">
                        {step.icon}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700">{step.label}</p>
                    {step.signed && step.name && (
                      <p className="text-xs text-slate-500 truncate italic">&ldquo;{step.name}&rdquo;</p>
                    )}
                    {step.signed && step.date && (
                      <p className="text-[10px] text-slate-400">
                        {new Date(step.date).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      step.signed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step.signed ? "Signed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Both signed → payment CTA for lessee */}
          {bothSigned && !isActive && role === "lessee" && onPaymentOpen && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-icons-round text-emerald-600">verified</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      Both parties have signed!
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Initiate the first payment to activate your lease.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onPaymentOpen(); }}
                  className="shrink-0 bg-sidebar-bg text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#1a5c42] transition-colors flex items-center gap-2"
                >
                  <span className="material-icons-round text-sm">account_balance_wallet</span>
                  Make First Payment
                </button>
              </div>
            </div>
          )}

          {/* Both signed → informational banner for owner */}
          {bothSigned && !isActive && role === "owner" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <span className="material-icons-round text-emerald-600 shrink-0">verified</span>
              <p className="text-sm text-emerald-800">
                <strong>Agreement fully signed.</strong> The lessee has been notified to
                initiate the first payment to activate this lease.
              </p>
            </div>
          )}

          {/* Active lease notice */}
          {isActive && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <span className="material-icons-round text-emerald-600 shrink-0">check_circle</span>
              <div>
                <p className="text-sm font-bold text-emerald-800">Lease Active</p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  This lease is currently active and running.
                </p>
              </div>
            </div>
          )}

          {/* Owner sign section */}
          {canOwnerSign && (
            <div className="border-t border-slate-200 pt-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                SIGN THIS AGREEMENT
              </p>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                By entering your full legal name below you confirm that you have reviewed all
                terms above and agree to be bound by this lease agreement.
              </p>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Legal Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={sig}
                onChange={(e) => setSig(e.target.value)}
                placeholder="e.g. John Kamau Mwangi"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 focus:border-[#13ec80] focus:ring-2 focus:ring-[#13ec80]/20 outline-none italic"
              />
              {err && <p className="mt-2 text-xs text-red-500">{err}</p>}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOwnerSign}
                  disabled={signing || !sig.trim()}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white bg-sidebar-bg hover:bg-[#1a5c42] disabled:opacity-50 transition-colors"
                >
                  {signing ? "Signing…" : "Sign Agreement"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
