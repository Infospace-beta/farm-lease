"use client";

import { useState, useEffect } from "react";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";
import AgreementDetailModal from "@/components/shared/AgreementDetailModal";

// ── Types ─────────────────────────────────────────────────────────────────────
type ReqStatus = "pending" | "review" | "accepted" | "rejected";
type ReqTab   = "all" | ReqStatus;
type AgrmTab  = "all" | "active" | "pending" | "expired";
type MainTab  = "requests" | "agreements";

interface LeaseRequest {
  id: number;
  land: { id: number; title: string; location?: string; total_area?: number; price_per_month?: number; images?: { id: number; image: string }[] };
  lessee: { id: number; first_name: string; last_name: string; email: string; profile_image?: string };
  proposed_start_date: string; proposed_end_date: string;
  proposed_rent?: number; message?: string; requested_area?: number;
  status: ReqStatus; created_at: string;
}

interface Agreement {
  id: number;
  land: { id: number; title: string; location?: string };
  lessee: { id: number; first_name: string; last_name: string; email?: string };
  start_date: string; end_date: string; monthly_rent: number;
  status: "active" | "pending" | "draft" | "expired";
  created_at: string;
  intended_use?: string; special_conditions?: string;
  lessee_submitted: boolean; lessee_submitted_at?: string;
  owner_signed: boolean; lessee_signed: boolean;
  owner_signature?: string; lessee_signature?: string;
  witness_name?: string; witness_id_number?: string; witness_phone?: string;
  witness_signature?: string; witness_signed_at?: string;
  land_name?: string; land_location?: string; lessor_name?: string; lessee_name?: string;
}

// ── Shared helpers ─────────────────────────────────────────────────────────
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
const imgUrl = (src: string) => src.startsWith("http") ? src : `${BACKEND}${src}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
const relTime = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today"; if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`; if (days < 14) return "1w ago";
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(d).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
};
const duration = (s: string, e: string) => {
  const m = Math.round((new Date(e).getTime() - new Date(s).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
  if (m < 12) return `${m} mo`; const y = Math.floor(m / 12), r = m % 12;
  return r ? `${y}y ${r}mo` : `${y} yr${y > 1 ? "s" : ""}`;
};
const initials = (f: string, l: string) => `${f[0] ?? ""}${l[0] ?? ""}`.toUpperCase();

// ── Status configs ─────────────────────────────────────────────────────────
const REQ_STATUS: Record<ReqStatus, { bg: string; text: string; border: string; dot: string; label: string; icon: string }> = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400",   label: "Pending",      icon: "hourglass_top" },
  review:   { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "bg-blue-400",    label: "Under Review", icon: "manage_search" },
  accepted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400", label: "Accepted",     icon: "check_circle"  },
  rejected: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-400",     label: "Rejected",     icon: "cancel"        },
};

function agrmStage(a: Agreement) {
  if (a.status === "active")            return { label: "Active",              color: "text-emerald-700", bg: "bg-emerald-100" };
  if (a.owner_signed && !a.witness_signed_at) return { label: "Awaiting Witness", color: "text-sky-700",     bg: "bg-sky-100"     };
  if (a.lessee_submitted && !a.owner_signed)  return { label: "Needs Your Signature", color: "text-amber-700", bg: "bg-amber-100"  };
  if (!a.lessee_submitted)              return { label: "Awaiting Lessee",     color: "text-slate-600",   bg: "bg-slate-100"   };
  if (a.status === "expired")           return { label: "Expired",             color: "text-red-700",     bg: "bg-red-100"     };
  return { label: "Draft", color: "text-slate-600", bg: "bg-slate-100" };
}

// ── Confirm Modal ──────────────────────────────────────────────────────────
function ConfirmModal({ open, mode, applicantName, landTitle, onConfirm, onCancel }: {
  open: boolean; mode: "approve" | "reject" | null;
  applicantName: string; landTitle: string;
  onConfirm: (reason?: string) => void | Promise<void>; onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => { if (open) { setReason(""); setSubmitting(false); } }, [open]);
  if (!open || !mode) return null;

  const handleConfirm = async () => {
    if (mode === "reject" && !reason.trim()) return;
    setSubmitting(true);
    await onConfirm(mode === "reject" ? reason.trim() : undefined);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${mode === "approve" ? "bg-emerald-50" : "bg-red-50"}`}>
            <span className={`material-symbols-outlined text-3xl ${mode === "approve" ? "text-emerald-600" : "text-red-600"}`}>
              {mode === "approve" ? "check_circle" : "cancel"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 text-center">{mode === "approve" ? "Accept Lease Request" : "Decline Lease Request"}</h3>
          <p className="mt-2 text-sm text-slate-500 text-center">
            {mode === "approve"
              ? <><strong>{applicantName}</strong> for <strong>{landTitle}</strong>. A formal agreement will be generated.</>
              : <>Declining <strong>{applicantName}&apos;s</strong> request for <strong>{landTitle}</strong>.</>}
          </p>
          {mode === "reject" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason <span className="text-red-500">*</span></label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} placeholder="Provide a reason…"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:border-[#13ec80] focus:ring-2 focus:ring-[#13ec80]/20 outline-none resize-none" />
              {!reason.trim() && <p className="mt-1 text-xs text-red-500">Required</p>}
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleConfirm} disabled={submitting || (mode === "reject" && !reason.trim())}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 ${mode === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}>
              {submitting ? "Processing…" : mode === "approve" ? "Confirm Accept" : "Confirm Decline"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// SignModal replaced by shared AgreementDetailModal (see import above)

// ── Requests Tab ──────────────────────────────────────────────────────────
function RequestsTab() {
  const [tab, setTab]       = useState<ReqTab>("all");
  const [requests, setReqs] = useState<LeaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [toast, setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [confirmModal, setCM] = useState<{ open: boolean; mode: "approve" | "reject" | null; id: number | null; applicantName: string; landTitle: string }>({
    open: false, mode: null, id: null, applicantName: "", landTitle: "",
  });

  useEffect(() => { load(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); } }, [toast]);

  const load = async () => {
    try { setLoading(true); setError(null);
      const r = await ownerApi.leaseRequests();
      setReqs(Array.isArray(r.data) ? r.data : r.data?.results ?? []);
    } catch (e: any) { setError(e.response?.data?.detail || "Failed to load lease requests"); setReqs([]); }
    finally { setLoading(false); }
  };

  const openConfirm = (mode: "approve" | "reject", req: LeaseRequest) =>
    setCM({ open: true, mode, id: req.id, applicantName: `${req.lessee.first_name} ${req.lessee.last_name}`, landTitle: req.land.title });

  const handleConfirm = async (reason?: string) => {
    const { mode, id } = confirmModal;
    if (!mode || !id) return;
    setCM(p => ({ ...p, open: false }));
    try {
      if (mode === "approve") { await ownerApi.approveLeaseRequest(id); setToast({ type: "success", msg: "Lease request accepted. A formal agreement has been generated." }); }
      else { await ownerApi.rejectLeaseRequest(id, reason!); setToast({ type: "success", msg: "Lease request declined. The applicant has been notified." }); }
      await load();
    } catch (e: any) { setToast({ type: "error", msg: e.response?.data?.detail || `Failed to ${mode} request.` }); }
  };

  const counts = {
    all: requests.length, pending: requests.filter(r => r.status === "pending").length,
    review: requests.filter(r => r.status === "review").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  };
  const TABS: { key: ReqTab; label: string }[] = [
    { key: "all", label: "All" }, { key: "pending", label: "Pending" },
    { key: "review", label: "Under Review" }, { key: "accepted", label: "Accepted" }, { key: "rejected", label: "Declined" },
  ];
  const filtered = tab === "all" ? requests : requests.filter(r => r.status === tab);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-4 border-[#13ec80]/30 border-t-[#13ec80] rounded-full animate-spin" />
    </div>
  );
  if (error) return (
    <div className="text-center py-16"><span className="material-symbols-outlined text-5xl text-red-400 mb-3">error</span><p className="text-red-600 font-medium">{error}</p><button onClick={load} className="mt-4 px-4 py-2 rounded-lg bg-[#0f392b] text-white text-sm font-medium">Retry</button></div>
  );

  return (
    <>
      {toast && (
        <div className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <span className="material-symbols-outlined text-lg shrink-0">{toast.type === "success" ? "check_circle" : "error"}</span>
          <p className="text-sm font-medium flex-1">{toast.msg}</p>
          <button onClick={() => setToast(null)}><span className="material-symbols-outlined text-base opacity-60">close</span></button>
        </div>
      )}

      {/* Stats strip */}
      {requests.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Total",    count: counts.all,      icon: "inbox",         color: "text-slate-600",   bg: "bg-slate-50",    border: "border-slate-200" },
            { label: "Pending",  count: counts.pending,  icon: "hourglass_top", color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200" },
            { label: "Accepted", count: counts.accepted, icon: "check_circle",  color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200" },
            { label: "Declined", count: counts.rejected, icon: "cancel",        color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} px-4 py-3 flex items-center gap-3`}>
              <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
              <div><p className="text-2xl font-bold text-slate-900">{s.count}</p><p className={`text-xs font-medium ${s.color}`}>{s.label}</p></div>
            </div>
          ))}
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-white text-[#0f392b] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label}
            {t.key !== "all" && counts[t.key] > 0 && (
              <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-bold ${tab === t.key ? "bg-[#0f392b] text-white" : "bg-slate-300 text-slate-700"}`}>{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">inbox</span>
          <p className="text-slate-500 font-medium">{tab === "all" ? "No lease requests yet" : `No ${tab} requests`}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => {
            const s = REQ_STATUS[req.status];
            const thumb = req.land.images?.[0]?.image;
            return (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row">
                  {thumb && (
                    <div className="sm:w-32 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                      <img src={imgUrl(thumb)} alt={req.land.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-bold text-slate-900 text-base">{req.land.title}</p>
                        {req.land.location && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-xs">location_on</span>{req.land.location}</p>}
                      </div>
                      <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
                        <span className="material-symbols-outlined text-sm">{s.icon}</span>{s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 p-2.5 bg-slate-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-[#0f392b] text-[#13ec80] flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {initials(req.lessee.first_name, req.lessee.last_name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{req.lessee.first_name} {req.lessee.last_name}</p>
                        <p className="text-xs text-slate-500">{req.lessee.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
                      <span><strong>Period:</strong> {fmtDate(req.proposed_start_date)} – {fmtDate(req.proposed_end_date)} • {duration(req.proposed_start_date, req.proposed_end_date)}</span>
                      {req.requested_area && <span><strong>Area:</strong> {req.requested_area} acres</span>}
                      <span className="text-slate-400">{relTime(req.created_at)}</span>
                    </div>
                    {req.message && <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 mb-3 italic line-clamp-2">&ldquo;{req.message}&rdquo;</p>}
                    {(req.status === "pending" || req.status === "review") && (
                      <div className="flex gap-2">
                        <button onClick={() => openConfirm("approve", req)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
                          <span className="material-symbols-outlined text-sm">check</span>Accept
                        </button>
                        <button onClick={() => openConfirm("reject", req)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                          <span className="material-symbols-outlined text-sm">close</span>Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={confirmModal.open} mode={confirmModal.mode}
        applicantName={confirmModal.applicantName} landTitle={confirmModal.landTitle}
        onConfirm={handleConfirm} onCancel={() => setCM(p => ({ ...p, open: false }))}
      />
    </>
  );
}

// ── Agreements Tab ────────────────────────────────────────────────────────
function AgreementsTab() {
  const [tab, setTab] = useState<AgrmTab>("all");
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [signTarget, setSignTarget] = useState<Agreement | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => { load(); }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4000); return () => clearTimeout(t); } }, [toast]);

  const load = async () => {
    try { setLoading(true); setError(null);
      const r = await ownerApi.myAgreements();
      setAgreements(Array.isArray(r.data) ? r.data : r.data?.results ?? []);
    } catch (e: any) { setError(e.response?.data?.detail || "Failed to load agreements"); setAgreements([]); }
    finally { setLoading(false); }
  };

  const ATABS: { key: AgrmTab; label: string }[] = [
    { key: "all", label: "All" }, { key: "active", label: "Active" },
    { key: "pending", label: "Pending" }, { key: "expired", label: "Expired" },
  ];

  const filtered = agreements
    .filter(a => tab === "all" || a.status === tab)
    .filter(a => !search || a.land?.title?.toLowerCase().includes(search.toLowerCase()) || (a.lessee_name ?? "").toLowerCase().includes(search.toLowerCase()) || `${a.lessee?.first_name} ${a.lessee?.last_name}`.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-[#13ec80]/30 border-t-[#13ec80] rounded-full animate-spin" /></div>;
  if (error) return <div className="text-center py-16"><span className="material-symbols-outlined text-5xl text-red-400 mb-3">error</span><p className="text-red-600">{error}</p><button onClick={load} className="mt-4 px-4 py-2 rounded-lg bg-[#0f392b] text-white text-sm">Retry</button></div>;

  return (
    <>
      {toast && (
        <div className={`mb-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <span className="material-symbols-outlined text-lg">{toast.type === "success" ? "check_circle" : "error"}</span>
          <p className="text-sm flex-1">{toast.msg}</p>
          <button onClick={() => setToast(null)}><span className="material-symbols-outlined text-base opacity-60">close</span></button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">search</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by land or lessee…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:border-[#13ec80] focus:ring-2 focus:ring-[#13ec80]/20 outline-none bg-white" />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 overflow-x-auto">
          {ATABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-white text-[#0f392b] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">description</span>
          <p className="text-slate-500 font-medium">No agreements found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ag => {
            const stage = agrmStage(ag);
            const lesseeLabel = ag.lessee_name || `${ag.lessee?.first_name} ${ag.lessee?.last_name}`;
            return (
              <div key={ag.id} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-bold text-slate-900">{ag.land?.title || ag.land_name}</p>
                    {(ag.land?.location || ag.land_location) && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-xs">location_on</span>{ag.land?.location || ag.land_location}
                      </p>
                    )}
                  </div>
                  <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${stage.bg} ${stage.color}`}>{stage.label}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                  <div className="bg-slate-50 rounded-lg px-3 py-2"><p className="text-slate-500">Lessee</p><p className="font-semibold text-slate-800 mt-0.5">{lesseeLabel}</p></div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2"><p className="text-slate-500">Monthly Rent</p><p className="font-semibold text-slate-800 mt-0.5">KES {ag.monthly_rent?.toLocaleString()}</p></div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2"><p className="text-slate-500">Start</p><p className="font-semibold text-slate-800 mt-0.5">{fmtDate(ag.start_date)}</p></div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2"><p className="text-slate-500">End</p><p className="font-semibold text-slate-800 mt-0.5">{fmtDate(ag.end_date)}</p></div>
                </div>
                {/* Signature progress */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { label: "Lessee signed", done: ag.lessee_signed || ag.lessee_submitted },
                    { label: "Owner signed",  done: ag.owner_signed },
                    { label: "Witness signed", done: !!ag.witness_signed_at },
                  ].map(step => (
                    <span key={step.label} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${step.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      <span className="material-symbols-outlined text-xs">{step.done ? "check_circle" : "radio_button_unchecked"}</span>{step.label}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {ag.lessee_submitted && !ag.owner_signed && (
                    <button onClick={() => setSignTarget(ag)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0f392b] text-[#13ec80] text-xs font-semibold hover:bg-[#1a5c42] transition-colors">
                      <span className="material-symbols-outlined text-sm">draw</span>View &amp; Sign
                    </button>
                  )}
                  {(ag.owner_signed || ag.status === "active") && (
                    <button onClick={() => setSignTarget(ag)} className="text-xs text-slate-400 hover:text-slate-600 font-medium underline flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">description</span>View Agreement
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {signTarget && (
        <AgreementDetailModal
          agreement={signTarget}
          role="owner"
          onClose={() => setSignTarget(null)}
          onSigned={() => { setSignTarget(null); load(); setToast({ type: "success", msg: "Agreement signed successfully." }); }}
        />
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function RequestsAgreementsPage() {
  const [main, setMain] = useState<MainTab>("requests");

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Requests & Agreements"
        subtitle="Manage incoming lease applications and formal lease agreements."
      />

      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-4 lg:p-6 max-w-6xl mx-auto w-full">

          {/* Main tab switcher */}
          <div className="flex gap-0 bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
            {([
              { key: "requests",   label: "Lease Requests",  icon: "inbox" },
              { key: "agreements", label: "Agreements",       icon: "description" },
            ] as { key: MainTab; label: string; icon: string }[]).map(t => (
              <button key={t.key} onClick={() => setMain(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all ${main === t.key ? "bg-[#0f392b] text-[#13ec80]" : "text-slate-600 hover:bg-slate-50"}`}>
                <span className="material-symbols-outlined text-lg">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {main === "requests" ? <RequestsTab /> : <AgreementsTab />}
        </div>
      </div>
    </div>
  );
}
