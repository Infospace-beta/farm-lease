"use client";

import { useState, useEffect } from "react";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";

type StatusKey = "pending" | "review" | "accepted" | "rejected";
type TabKey = "all" | StatusKey;

interface LeaseRequest {
  id: number;
  land: {
    id: number;
    title: string;
    location?: string;
    total_area?: number;
    price_per_month?: number;
    images?: Array<{ id: number; image: string }>;
  };
  lessee: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
  };
  proposed_start_date: string;
  proposed_end_date: string;
  proposed_rent?: number;
  message?: string;
  requested_area?: number;
  status: StatusKey;
  created_at: string;
}

const STATUS_STYLES: Record<StatusKey, { bg: string; text: string; border: string; dot: string; label: string; icon: string }> = {
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",  dot: "bg-amber-400",   label: "Pending",      icon: "hourglass_top" },
  review:   { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",   dot: "bg-blue-400",    label: "Under Review", icon: "manage_search" },
  accepted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",dot: "bg-emerald-400", label: "Accepted",     icon: "check_circle"  },
  rejected: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",    dot: "bg-red-400",     label: "Rejected",     icon: "cancel"        },
};

/* ── Confirmation modal ─────────────────────────────────────────────── */
interface ConfirmModalProps {
  open: boolean;
  mode: "approve" | "reject" | null;
  requestId: number | null;
  applicantName: string;
  landTitle: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

function ConfirmModal({ open, mode, applicantName, landTitle, onConfirm, onCancel }: ConfirmModalProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (open) { setRejectReason(""); setSubmitting(false); } }, [open]);
  if (!open || !mode) return null;

  const handleConfirm = async () => {
    if (mode === "reject" && !rejectReason.trim()) return;
    setSubmitting(true);
    await onConfirm(mode === "reject" ? rejectReason.trim() : undefined);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${mode === "approve" ? "bg-emerald-50" : "bg-red-50"}`}>
            <span className={`material-symbols-outlined text-3xl ${mode === "approve" ? "text-emerald-600" : "text-red-600"}`}>
              {mode === "approve" ? "check_circle" : "cancel"}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 text-center">
            {mode === "approve" ? "Accept Lease Request" : "Decline Lease Request"}
          </h3>
          <p className="mt-2 text-sm text-slate-500 text-center">
            {mode === "approve"
              ? <>You are accepting <strong>{applicantName}&apos;s</strong> request for <strong>{landTitle}</strong>. A formal lease agreement will be generated.</>
              : <>You are declining <strong>{applicantName}&apos;s</strong> request for <strong>{landTitle}</strong>.</>
            }
          </p>

          {mode === "reject" && (
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Reason for Decline <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Please provide a reason so the applicant can improve their future applications…"
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              />
              {rejectReason.trim().length === 0 && (
                <p className="mt-1 text-xs text-red-500">A reason is required</p>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting || (mode === "reject" && !rejectReason.trim())}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                mode === "approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {submitting ? "Processing…" : mode === "approve" ? "Confirm Accept" : "Confirm Decline"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────── */
export default function LeaseRequestsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [requests, setRequests] = useState<LeaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  /* confirm modal state */
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean; mode: "approve" | "reject" | null; requestId: number | null; applicantName: string; landTitle: string;
  }>({ open: false, mode: null, requestId: null, applicantName: "", landTitle: "" });

  useEffect(() => { loadRequests(); }, []);
  useEffect(() => {
    if (actionResult) { const t = setTimeout(() => setActionResult(null), 4000); return () => clearTimeout(t); }
  }, [actionResult]);

  const loadRequests = async () => {
    try {
      setLoading(true); setError(null);
      const response = await ownerApi.leaseRequests();
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      setRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load lease requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const openConfirm = (mode: "approve" | "reject", req: LeaseRequest) => {
    setConfirmModal({
      open: true, mode, requestId: req.id,
      applicantName: `${req.lessee.first_name} ${req.lessee.last_name}`,
      landTitle: req.land.title,
    });
  };

  const handleConfirm = async (reason?: string) => {
    const { mode, requestId } = confirmModal;
    if (!mode || !requestId) return;
    setConfirmModal((p) => ({ ...p, open: false }));
    try {
      if (mode === "approve") {
        await ownerApi.approveLeaseRequest(requestId);
        setActionResult({ type: "success", msg: "Lease request accepted. A formal agreement has been generated." });
      } else {
        await ownerApi.rejectLeaseRequest(requestId, reason!);
        setActionResult({ type: "success", msg: "Lease request declined. The applicant has been notified." });
      }
      await loadRequests();
    } catch (err: any) {
      setActionResult({ type: "error", msg: err.response?.data?.detail || `Failed to ${mode} request.` });
    }
  };

  /* ── Computed ─────────────────────────────────────── */
  const counts = {
    all: requests.length,
    pending:  requests.filter((r) => r.status === "pending").length,
    review:   requests.filter((r) => r.status === "review").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all",      label: "All"          },
    { key: "pending",  label: "Pending"      },
    { key: "review",   label: "Under Review" },
    { key: "accepted", label: "Accepted"     },
    { key: "rejected", label: "Rejected"     },
  ];

  const filtered = tab === "all" ? requests : requests.filter((r) => r.status === tab);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 14) return "1w ago";
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
  };

  const calcDuration = (start: string, end: string) => {
    const months = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    if (months < 12) return `${months} mo`;
    const y = Math.floor(months / 12), m = months % 12;
    return m ? `${y}y ${m}mo` : `${y} yr${y > 1 ? "s" : ""}`;
  };

  const initials = (f: string, l: string) => `${f[0] ?? ""}${l[0] ?? ""}`.toUpperCase();

  const imgUrl = (src: string) =>
    src.startsWith("http") ? src : `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000"}${src}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Lease Requests"
        subtitle="Review and respond to incoming lease applications for your properties."
      >
        <button
          onClick={loadRequests}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </OwnerPageHeader>

      <div className="flex-1 overflow-y-auto bg-slate-50">
        {/* ── Toast banner ─────────────────────────────────── */}
        {actionResult && (
          <div
            className={`mx-4 mt-4 flex items-center gap-3 rounded-xl border px-4 py-3 ${
              actionResult.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <span className="material-symbols-outlined text-lg shrink-0">
              {actionResult.type === "success" ? "check_circle" : "error"}
            </span>
            <p className="text-sm font-medium flex-1">{actionResult.msg}</p>
            <button onClick={() => setActionResult(null)} className="shrink-0 opacity-60 hover:opacity-100">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        )}

        <div className="p-4 lg:p-6 max-w-6xl mx-auto w-full">

          {/* ── Stats overview ───────────────────────────────── */}
          {!loading && !error && requests.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Total",         count: counts.all,      icon: "inbox",        color: "text-slate-600",   bg: "bg-slate-50",    border: "border-slate-200"  },
                { label: "Pending",       count: counts.pending,  icon: "hourglass_top",color: "text-amber-600",   bg: "bg-amber-50",    border: "border-amber-200"  },
                { label: "Accepted",      count: counts.accepted, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-50",  border: "border-emerald-200"},
                { label: "Declined",      count: counts.rejected, icon: "cancel",       color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200"    },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} px-4 py-3 flex items-center gap-3`}>
                  <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{s.count}</p>
                    <p className={`text-xs font-medium ${s.color}`}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Loading ──────────────────────────────────────── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Loading lease requests…</p>
            </div>
          )}

          {/* ── Error ────────────────────────────────────────── */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400 mb-3 block">error_outline</span>
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button onClick={loadRequests} className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* ── Tabs ─────────────────────────────────────── */}
              <div className="mb-5 flex gap-1 bg-white border border-slate-200 rounded-xl p-1 overflow-x-auto">
                {TABS.map((t) => {
                  const s = t.key !== "all" ? STATUS_STYLES[t.key as StatusKey] : null;
                  return (
                    <button
                      key={t.key}
                      onClick={() => setTab(t.key)}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                        tab === t.key ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {s && (
                        <span className="material-symbols-outlined text-[15px]">{s.icon}</span>
                      )}
                      {t.label}
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold min-w-[18px] text-center ${
                        tab === t.key ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {counts[t.key]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ── Empty state ──────────────────────────────── */}
              {filtered.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
                    <span className="material-symbols-outlined text-4xl text-slate-300">inbox</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No requests found</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {tab === "all"
                      ? "No lease applications have been submitted yet."
                      : `No ${STATUS_STYLES[tab as StatusKey]?.label ?? tab} requests at this time.`}
                  </p>
                </div>
              )}

              {/* ── Request cards ────────────────────────────── */}
              <div className="space-y-4">
                {filtered.map((req) => {
                  const s = STATUS_STYLES[req.status];
                  const applicantName = `${req.lessee.first_name} ${req.lessee.last_name}`;
                  const duration = calcDuration(req.proposed_start_date, req.proposed_end_date);
                  const isPartial = req.requested_area != null && req.land.total_area != null && req.requested_area < req.land.total_area;
                  const canAct = req.status === "pending" || req.status === "review";

                  return (
                    <div key={req.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                      {/* ── Card top accent bar ──────────────── */}
                      <div className={`h-1 w-full ${
                        req.status === "accepted" ? "bg-emerald-400" :
                        req.status === "rejected" ? "bg-red-400" :
                        req.status === "review"   ? "bg-blue-400" : "bg-amber-400"
                      }`} />

                      <div className="p-5 lg:p-6">
                        <div className="flex flex-col lg:flex-row gap-5">

                          {/* ── Land image ───────────────────── */}
                          <div className="relative rounded-xl overflow-hidden shrink-0 w-full lg:w-52 h-40 lg:h-auto bg-slate-100">
                            {req.land.images && req.land.images.length > 0 ? (
                              <img
                                src={imgUrl(req.land.images[0].image)}
                                alt={req.land.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                                <span className="material-symbols-outlined text-4xl">landscape</span>
                                <span className="text-xs mt-1">No photo</span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white text-xs font-bold truncate">{req.land.title}</p>
                              {req.land.price_per_month && (
                                <p className="text-white/80 text-[11px] mt-0.5">
                                  Listed @ Ksh {req.land.price_per_month.toLocaleString()}/mo
                                </p>
                              )}
                            </div>
                            {/* Partial badge */}
                            {isPartial && (
                              <div className="absolute top-2 right-2">
                                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                                  PARTIAL
                                </span>
                              </div>
                            )}
                          </div>

                          {/* ── Main content ─────────────────── */}
                          <div className="flex-1 min-w-0 flex flex-col gap-4">

                            {/* Header row */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                {/* Applicant avatar */}
                                {req.lessee.profile_image ? (
                                  <img src={imgUrl(req.lessee.profile_image)} alt={applicantName}
                                    className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                                  />
                                ) : (
                                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold border-2 border-white shadow-sm shrink-0">
                                    {initials(req.lessee.first_name, req.lessee.last_name)}
                                  </div>
                                )}
                                <div>
                                  <p className="text-base font-bold text-slate-900">{applicantName}</p>
                                  <p className="text-xs text-slate-500">{req.lessee.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Status badge */}
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${s.bg} ${s.text} ${s.border}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                  {s.label}
                                </span>
                                {/* Request ID */}
                                <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-mono font-bold text-slate-600">
                                  REQ-{req.id.toString().padStart(4, "0")}
                                </span>
                              </div>
                            </div>

                            {/* Details grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3 rounded-xl bg-slate-50 border border-slate-100 p-4">
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Proposed Rent</p>
                                <p className="mt-0.5 text-sm font-bold text-primary">
                                  {req.proposed_rent ? `Ksh ${req.proposed_rent.toLocaleString()}/mo` : "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Duration</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-800">{duration}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Start Date</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-800">
                                  {new Date(req.proposed_start_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">End Date</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-800">
                                  {new Date(req.proposed_end_date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                              {req.requested_area != null && (
                                <div className="col-span-2">
                                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Requested Area</p>
                                  <p className="mt-0.5 text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    {req.requested_area} ac
                                    {isPartial && (
                                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                                        Partial — of {req.land.total_area} ac total
                                      </span>
                                    )}
                                  </p>
                                </div>
                              )}
                              <div className="col-span-2 sm:col-span-1">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Applied</p>
                                <p className="mt-0.5 text-sm font-bold text-slate-800">{formatDate(req.created_at)}</p>
                              </div>
                            </div>

                            {/* Applicant message */}
                            {req.message && (
                              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Applicant&apos;s Note</p>
                                <p className="text-sm text-slate-700 leading-relaxed">&ldquo;{req.message}&rdquo;</p>
                              </div>
                            )}

                            {/* Action buttons */}
                            {canAct ? (
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                <button
                                  onClick={() => openConfirm("approve", req)}
                                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[.98] transition-all shadow-sm shadow-emerald-200"
                                >
                                  <span className="material-symbols-outlined text-base">check_circle</span>
                                  Accept Application
                                </button>
                                <button
                                  onClick={() => openConfirm("reject", req)}
                                  className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 active:scale-[.98] transition-all"
                                >
                                  <span className="material-symbols-outlined text-base">cancel</span>
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${s.bg} ${s.text} ${s.border} self-start`}>
                                <span className="material-symbols-outlined text-base">{s.icon}</span>
                                {req.status === "accepted"
                                  ? "Accepted — agreement generated"
                                  : "Application declined"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Confirmation modal ─────────────────────────────────────── */}
      <ConfirmModal
        open={confirmModal.open}
        mode={confirmModal.mode}
        requestId={confirmModal.requestId}
        applicantName={confirmModal.applicantName}
        landTitle={confirmModal.landTitle}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
