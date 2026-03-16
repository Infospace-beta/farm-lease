"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import LeaseAgreementPanel from "@/components/lessee/LeaseAgreementPanel";
import PaymentModal from "@/components/lessee/PaymentModal";
import AgreementDetailModal from "@/components/shared/AgreementDetailModal";
import { lesseeApi } from "@/lib/services/api";

// ── Types ────────────────────────────────────────────────────────────────────

interface LeaseRequest {
  id: number;
  land: {
    id: number;
    title?: string;
    location?: string;
    total_area?: number;
    owner_name?: string;
    price_per_month?: number;
  };
  proposed_start_date?: string;
  proposed_end_date?: string;
  proposed_rent?: number;
  status: "pending" | "review" | "accepted" | "rejected";
  rejection_reason?: string;
  created_at?: string;
}

interface Agreement {
  id: number;
  land: number;
  land_name: string;
  land_location: string;
  land_area?: number;
  land_county?: string;
  owner: number;
  lessor_name: string;
  lessor_id_number?: string;
  lessee: number;
  lessee_name: string;
  lessee_id_number?: string;
  start_date: string;
  end_date: string;
  monthly_rent: number | string;
  status: string;
  intended_use?: string;
  special_conditions?: string;
  lessee_signature?: string;
  owner_signature?: string;
  lessee_signed: boolean;
  owner_signed: boolean;
  lessee_submitted: boolean;
  lessee_submitted_at?: string;
  owner_signed_at?: string;
  witness_name?: string;
  witness_id_number?: string;
  witness_phone?: string;
  witness_signature?: string;
  witness_signed_at?: string;
  lease_request_id?: number;
}

// A unified item for the timeline
interface LeaseItem {
  _type: "request" | "agreement";
  id: number;
  landName: string;
  landLocation: string;
  landArea?: number;
  lessorName: string;
  monthlyRent?: number;
  stage: 1 | 2 | 3 | 4 | 5;
  stageLabel: string;
  statusColor: string;
  actionLabel?: string;
  actionVariant?: "primary" | "muted" | "danger" | "outline";
  // Original data for panel/modal
  request?: LeaseRequest;
  agreement?: Agreement;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildItem(req?: LeaseRequest, agr?: Agreement): LeaseItem {
  if (agr) {
    const rent = Number(agr.monthly_rent) || 0;
    // Stage 3: submitted, owner not signed — lessee can view the signed agreement
    if (agr.lessee_submitted && !agr.owner_signed) {
      return {
        _type: "agreement", id: agr.id, landName: agr.land_name,
        landLocation: agr.land_location, landArea: agr.land_area, lessorName: agr.lessor_name,
        monthlyRent: rent, stage: 3, stageLabel: "Awaiting Owner Signature",
        statusColor: "bg-amber-100 text-amber-700",
        actionLabel: "View Agreement", actionVariant: "outline", agreement: agr,
      };
    }
    // Stage 4: both signed, witness not yet
    if (agr.owner_signed && !agr.witness_signed_at && agr.status !== "active") {
      return {
        _type: "agreement", id: agr.id, landName: agr.land_name,
        landLocation: agr.land_location, landArea: agr.land_area, lessorName: agr.lessor_name,
        monthlyRent: rent, stage: 4, stageLabel: "Pending Witness",
        statusColor: "bg-violet-100 text-violet-700",
        actionLabel: "Make First Payment", actionVariant: "primary", agreement: agr,
      };
    }
    // Stage 5: active
    if (agr.status === "active") {
      return {
        _type: "agreement", id: agr.id, landName: agr.land_name,
        landLocation: agr.land_location, landArea: agr.land_area, lessorName: agr.lessor_name,
        monthlyRent: rent, stage: 5, stageLabel: "Active Lease",
        statusColor: "bg-emerald-100 text-emerald-700",
        actionLabel: "Make Payment", actionVariant: "primary", agreement: agr,
      };
    }
    // Stage 2: accepted, not yet submitted
    return {
      _type: "agreement", id: agr.id, landName: agr.land_name,
      landLocation: agr.land_location, landArea: agr.land_area, lessorName: agr.lessor_name,
      monthlyRent: rent, stage: 2, stageLabel: "Fill Agreement",
      statusColor: "bg-blue-100 text-blue-700",
      actionLabel: "Fill Agreement", actionVariant: "primary", agreement: agr,
    };
  }
  // Pure request (no agreement yet)
  const r = req!;
  const land = r.land ?? {};
  const rent = r.proposed_rent ?? (land.price_per_month || 0);
  if (r.status === "rejected") {
    return {
      _type: "request", id: r.id, landName: land.title ?? "Land Plot",
      landLocation: land.location ?? "", landArea: land.total_area,
      lessorName: land.owner_name ?? "—", monthlyRent: Number(rent),
      stage: 1, stageLabel: "Rejected",
      statusColor: "bg-red-100 text-red-600",
      actionLabel: "View Reason", actionVariant: "outline", request: r,
    };
  }
  return {
    _type: "request", id: r.id, landName: land.title ?? "Land Plot",
    landLocation: land.location ?? "", landArea: land.total_area ?? undefined,
    lessorName: land.owner_name ?? "—", monthlyRent: Number(rent),
    stage: 1, stageLabel: r.status === "review" ? "Under Review" : "Requested",
    statusColor: r.status === "review" ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-700",
    actionLabel: "Cancel", actionVariant: "danger", request: r,
  };
}

const STAGE_LABELS = ["Requested", "Agreement", "Submitted", "Witness", "Active"];

// ── Payment types ─────────────────────────────────────────────────────────────
interface Payment {
  id: number;
  amount: number | string;
  status: string;
  payment_method?: string;
  transaction_id?: string;
  mpesa_code?: string;
  land_name?: string;
  agreement?: number;
  agreement_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface EscrowAccountItem {
  id: number;
  agreement_id: number;
  land_name?: string;
  amount: number | string;
  held_amount: number | string;
  released_amount: number | string;
  status: string;
}

interface EscrowBalanceResponse {
  held_amount: number | string;
  released_amount: number | string;
  accounts: EscrowAccountItem[];
}

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-700", icon: "check_circle" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: "schedule" },
  stk_initiated: { label: "STK Sent", color: "bg-blue-100 text-blue-700", icon: "phonelink_ring" },
  in_escrow: { label: "In Escrow", color: "bg-violet-100 text-violet-700", icon: "lock" },
  processing: { label: "Processing", color: "bg-blue-100 text-blue-700", icon: "autorenew" },
  failed: { label: "Failed", color: "bg-red-100 text-red-600", icon: "cancel" },
  refunded: { label: "Refunded", color: "bg-violet-100 text-violet-700", icon: "undo" },
};

function PaymentRow({ payment }: { payment: Payment }) {
  const status = PAYMENT_STATUS_CONFIG[payment.status] ?? {
    label: payment.status,
    color: "bg-slate-100 text-slate-600",
    icon: "receipt",
  };
  const date = payment.created_at
    ? new Date(payment.created_at).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "—";
  const method =
    payment.payment_method === "mpesa"
      ? "M-Pesa"
      : payment.payment_method === "cash"
        ? "Cash"
        : payment.payment_method ?? "—";

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <span className="material-icons-round text-[#0f392b] text-lg">receipt_long</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">
            {payment.land_name ?? `Agreement #${payment.agreement ?? payment.agreement_id ?? payment.id}`}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {method} · {date}
          </p>
          {(payment.transaction_id ?? payment.mpesa_code) && (
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Txn: {payment.transaction_id ?? payment.mpesa_code}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-sm font-extrabold text-[#0f392b]">
          KES {Number(payment.amount).toLocaleString()}
        </span>
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${status.color}`}>
          <span className="material-icons-round text-[10px]">{status.icon}</span>
          {status.label}
        </span>
      </div>
    </div>
  );
}

function ProgressBar({ stage }: { stage: number }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {STAGE_LABELS.map((label, i) => {
        const active = i + 1 === stage;
        const done = i + 1 < stage;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full transition-all ${done ? "bg-[#16a34a]" : active ? "bg-[#13ec80]" : "bg-slate-200"
                }`}
            />
            <span
              className={`text-[9px] font-semibold hidden sm:block ${done ? "text-emerald-600" : active ? "text-[#16a34a]" : "text-slate-300"
                }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function LeasesPage() {
  const [requests, setRequests] = useState<LeaseRequest[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAgreement, setActiveAgreement] = useState<Agreement | null>(null);
  const [paymentAgreement, setPaymentAgreement] = useState<Agreement | null>(null);
  const [detailAgreement, setDetailAgreement] = useState<Agreement | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [myName, setMyName] = useState("");

  // ── Tab state ─────────────────────────────────────────────────────────────
  const [tab, setTab] = useState<"leases" | "payments">("leases");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [escrow, setEscrow] = useState<EscrowBalanceResponse | null>(null);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [escrowError, setEscrowError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setPaymentsLoading(true);
    setPaymentsError(null);
    try {
      const res = await lesseeApi.myPayments();
      const data = res.data?.results ?? res.data;
      setPayments(Array.isArray(data) ? data : []);
    } catch {
      setPaymentsError("Could not load payment history.");
    } finally {
      setPaymentsLoading(false);
    }
  }, []);

  const fetchEscrow = useCallback(async () => {
    setEscrowLoading(true);
    setEscrowError(null);
    try {
      const res = await lesseeApi.escrowBalance();
      setEscrow(res.data);
    } catch {
      setEscrowError("Could not load escrow balance.");
    } finally {
      setEscrowLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "payments" && payments.length === 0 && !paymentsLoading) {
      fetchPayments();
    }
    if (tab === "payments" && !escrow && !escrowLoading) {
      fetchEscrow();
    }
  }, [tab, payments.length, paymentsLoading, fetchPayments, escrow, escrowLoading, fetchEscrow]);

  const paymentStats = useMemo(() => ({
    total: payments.length,
    totalPaid: payments
      .filter((p) => p.status === "completed")
      .reduce((s, p) => s + Number(p.amount), 0),
    pending: payments.filter((p) => p.status === "pending" || p.status === "processing").length,
  }), [payments]);

  const escrowStats = useMemo(() => ({
    held: Number(escrow?.held_amount ?? 0),
    released: Number(escrow?.released_amount ?? 0),
    accounts: escrow?.accounts?.length ?? 0,
  }), [escrow]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reqRes, agrRes] = await Promise.all([
        lesseeApi.myLeaseRequests(),
        lesseeApi.myAgreements(),
      ]);
      const reqs: LeaseRequest[] = Array.isArray(reqRes.data)
        ? reqRes.data
        : (reqRes.data?.results ?? []);
      const agrs: Agreement[] = Array.isArray(agrRes.data)
        ? agrRes.data
        : (agrRes.data?.results ?? []);
      setRequests(reqs);
      setAgreements(agrs);
      if (agrs.length > 0) setMyName(agrs[0].lessee_name ?? "");
    } catch {
      setError("Could not load your leases. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const items: LeaseItem[] = useMemo(() => {
    const agrRequestIds = new Set(agreements.map((a) => a.lease_request_id).filter(Boolean));
    return [
      ...agreements.map((a) => buildItem(undefined, a)),
      ...requests.filter((r) => !agrRequestIds.has(r.id)).map((r) => buildItem(r, undefined)),
    ];
  }, [requests, agreements]);

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((i) => i.stage === 5).length,
    pendingAction: items.filter((i) => i.actionVariant === "primary").length,
    awaitingOwner: items.filter((i) => i.stage === 3).length,
  }), [items]);

  const handleAction = (item: LeaseItem) => {
    if (item.agreement) {
      if (item.stage === 5 || item.stage === 4) setPaymentAgreement(item.agreement);
      else if (item.stage === 3) setDetailAgreement(item.agreement);
      else setActiveAgreement(item.agreement);
    } else if (item.request?.status === "rejected") {
      setRejectionReason(item.request.rejection_reason ?? "No reason provided.");
    }
  };

  const handleCancel = async (req: LeaseRequest) => {
    if (!confirm("Cancel this lease request?")) return;
    try {
      await lesseeApi.cancelLeaseRequest(req.id);
      fetchAll();
    } catch {
      alert("Could not cancel request.");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Agreement Detail Modal (view-only for stage 3+) */}
      {detailAgreement && (
        <AgreementDetailModal
          agreement={detailAgreement}
          role="lessee"
          onClose={() => setDetailAgreement(null)}
          onPaymentOpen={() => {
            const agreement = detailAgreement;
            setDetailAgreement(null);
            setPaymentAgreement(agreement);
          }}
        />
      )}

      {/* Agreement Panel */}
      {activeAgreement && (
        <LeaseAgreementPanel
          agreement={activeAgreement}
          myName={myName}
          onClose={() => setActiveAgreement(null)}
          onSubmitted={() => { setActiveAgreement(null); fetchAll(); }}
        />
      )}

      {/* Payment Modal */}
      {paymentAgreement && (
        <PaymentModal
          agreementId={paymentAgreement.id}
          monthlyRent={Number(paymentAgreement.monthly_rent)}
          landName={paymentAgreement.land_name}
          onClose={() => setPaymentAgreement(null)}
          onSuccess={() => {
            setPaymentAgreement(null);
            fetchAll();
            fetchPayments();
          }}
        />
      )}

      {/* Rejection Reason Modal */}
      {rejectionReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRejectionReason(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-icons-round text-red-500">cancel</span>
              <h3 className="font-bold text-slate-800">Request Rejected</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed bg-red-50 rounded-xl p-4 border border-red-100">
              {rejectionReason}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRejectionReason(null)}
                className="bg-slate-100 text-slate-700 px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Close
              </button>
              <Link
                href="/lessee/browse"
                className="bg-[#0f392b] text-white px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Browse Other Lands
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <LesseePageHeader
        title="My Leases"
        subtitle="Manage your lease requests, agreements, and payments"
      >
        <Link
          href="/lessee/browse"
          className="flex items-center gap-2 bg-[#0f392b] hover:bg-[#1c4a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-colors"
        >
          <span className="material-icons-round text-lg">search</span>
          Browse Lands
        </Link>
      </LesseePageHeader>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-8">
        <div className="flex gap-1">
          {["leases", "payments"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as "leases" | "payments")}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors capitalize ${tab === t
                ? "border-[#0f392b] text-[#0f392b]"
                : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              {t === "leases" ? "My Leases" : "Payment History"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#f8fafc]">
        {/* Payment History Tab */}
        {tab === "payments" && (
          <div>
            {/* Payment stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Payments", value: paymentStats.total, icon: "receipt_long", color: "text-slate-700", bg: "bg-slate-100" },
                { label: "Total Paid", value: `KES ${paymentStats.totalPaid.toLocaleString()}`, icon: "account_balance_wallet", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending", value: paymentStats.pending, icon: "pending_actions", color: "text-amber-600", bg: "bg-amber-50" },
                {
                  label: "Escrow Held",
                  value: escrowLoading ? "..." : `KES ${escrowStats.held.toLocaleString()}`,
                  icon: "lock",
                  color: "text-violet-700",
                  bg: "bg-violet-50",
                },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <span className={`material-icons-round ${s.color}`}>{s.icon}</span>
                  </div>
                  {paymentsLoading ? (
                    <div className="h-7 w-20 bg-slate-100 animate-pulse rounded mb-1" />
                  ) : (
                    <div className="text-xl font-extrabold text-slate-900 mb-0.5">{s.value}</div>
                  )}
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Escrow panel */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Escrow Balance</h3>
                {!escrowLoading && (
                  <button onClick={fetchEscrow} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <span className="material-icons-round text-sm">refresh</span> Refresh
                  </button>
                )}
              </div>

              {escrowLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-pulse">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-20 rounded-xl bg-slate-100" />
                  ))}
                </div>
              )}

              {!escrowLoading && escrowError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {escrowError}
                </div>
              )}

              {!escrowLoading && !escrowError && escrow && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3">
                      <p className="text-xs text-violet-700 font-semibold">Held in Escrow</p>
                      <p className="text-lg font-extrabold text-violet-900">KES {escrowStats.held.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                      <p className="text-xs text-emerald-700 font-semibold">Released to Owners</p>
                      <p className="text-lg font-extrabold text-emerald-900">KES {escrowStats.released.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                      <p className="text-xs text-slate-500 font-semibold">Escrow Accounts</p>
                      <p className="text-lg font-extrabold text-slate-900">{escrowStats.accounts}</p>
                    </div>
                  </div>

                  {escrow.accounts.length > 0 ? (
                    <div className="space-y-2">
                      {escrow.accounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl px-3 py-2.5">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {account.land_name ?? `Agreement #${account.agreement_id}`}
                            </p>
                            <p className="text-xs text-slate-400">Status: {account.status}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-violet-800">Held: KES {Number(account.held_amount).toLocaleString()}</p>
                            <p className="text-xs text-slate-400">Total paid: KES {Number(account.amount).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No escrow accounts yet.</p>
                  )}
                </>
              )}
            </div>

            {/* Payment list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Transaction History</h3>
                {!paymentsLoading && (
                  <button onClick={fetchPayments} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                    <span className="material-icons-round text-sm">refresh</span> Refresh
                  </button>
                )}
              </div>

              {paymentsLoading && (
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-4 border-b border-slate-100 animate-pulse">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-1/3" />
                        <div className="h-2 bg-slate-100 rounded w-1/4" />
                      </div>
                      <div className="w-16 h-5 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {!paymentsLoading && paymentsError && (
                <div className="flex flex-col items-center py-10">
                  <span className="material-icons-round text-4xl text-slate-200 mb-2">cloud_off</span>
                  <p className="text-slate-500 text-sm mb-3">{paymentsError}</p>
                  <button onClick={fetchPayments} className="bg-[#0f392b] text-white px-4 py-2 rounded-xl text-sm font-semibold">Retry</button>
                </div>
              )}

              {!paymentsLoading && !paymentsError && payments.length === 0 && (
                <div className="flex flex-col items-center py-12 text-center">
                  <span className="material-icons-round text-5xl text-slate-200 mb-3">receipt_long</span>
                  <p className="text-slate-600 font-semibold mb-1">No payments yet</p>
                  <p className="text-slate-400 text-sm">Payments made for your active leases will appear here.</p>
                </div>
              )}

              {!paymentsLoading && !paymentsError && payments.length > 0 && (
                <div>
                  {payments.map((p) => (
                    <PaymentRow key={p.id} payment={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leases Tab */}
        {tab === "leases" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Leases", value: stats.total, icon: "description", color: "text-slate-700", bg: "bg-slate-100" },
                { label: "Active Leases", value: stats.active, icon: "check_circle", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Pending Action", value: stats.pendingAction, icon: "pending_actions", color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Awaiting Owner", value: stats.awaitingOwner, icon: "schedule", color: "text-violet-600", bg: "bg-violet-50" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <span className={`material-icons-round ${s.color}`}>{s.icon}</span>
                  </div>
                  {loading ? (
                    <div className="h-7 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                  ) : (
                    <div className="text-2xl font-extrabold text-slate-900 mb-0.5">{s.value}</div>
                  )}
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Journey Guide */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lease Journey</p>
              <div className="flex items-start">
                {[
                  { label: "Request", icon: "send", color: "#64748b" },
                  { label: "Agreement", icon: "edit_note", color: "#2563eb" },
                  { label: "Submitted", icon: "pending_actions", color: "#d97706" },
                  { label: "Witness", icon: "supervised_user_circle", color: "#7c3aed" },
                  { label: "Active", icon: "account_balance_wallet", color: "#16a34a" },
                ].map((s, i) => (
                  <div key={s.label} className="flex-1 flex items-start gap-0">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: s.color }}
                      >
                        <span className="material-icons-round text-white text-sm">{s.icon}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1.5 text-center">{s.label}</p>
                    </div>
                    {i < 4 && <div className="mt-4 flex-none w-8 flex items-center"><div className="h-0.5 w-full bg-slate-200" /></div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Item Cards */}
            <div className="space-y-4">
              {error ? (
                <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
                  <span className="material-icons-round text-4xl text-red-200 mb-2 block">error_outline</span>
                  <p className="text-slate-500 font-medium mb-3">{error}</p>
                  <button onClick={fetchAll} className="bg-[#0f392b] text-white text-sm font-semibold px-5 py-2 rounded-xl">Retry</button>
                </div>
              ) : loading ? (
                [0, 1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-2 bg-slate-100 rounded w-full mt-3" />
                      </div>
                    </div>
                  </div>
                ))
              ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
                  <span className="material-icons-round text-5xl text-slate-200 block mb-3">description</span>
                  <p className="text-slate-500 font-semibold mb-1">No leases yet</p>
                  <p className="text-slate-400 text-sm mb-6">Browse available lands and send a lease request to get started.</p>
                  <Link href="/lessee/browse" className="inline-flex items-center gap-2 bg-[#0f392b] text-white text-sm font-semibold px-6 py-2.5 rounded-xl">
                    <span className="material-icons-round text-base">search</span>Browse Lands
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item._type}-${item.id}`}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0f392b]/10 to-emerald-50 flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-[#047857] text-2xl">landscape</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm">{item.landName}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.landLocation}{item.landArea ? ` · ${item.landArea} acres` : ""}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">Landlord: {item.lessorName}</p>
                          {item.monthlyRent ? (
                            <p className="text-xs font-semibold text-[#047857] mt-0.5">
                              KES {item.monthlyRent.toLocaleString()} / month
                            </p>
                          ) : null}
                          <ProgressBar stage={item.stage} />
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.statusColor}`}>
                          {item.stageLabel}
                        </span>

                        {item.actionLabel && (
                          item.actionVariant === "muted" ? (
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                              <span className="material-icons-round text-sm">schedule</span>
                              {item.actionLabel}
                            </span>
                          ) : item.actionVariant === "danger" && item.request ? (
                            <button
                              onClick={() => handleCancel(item.request!)}
                              className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-xl transition-colors"
                            >
                              Cancel Request
                            </button>
                          ) : item.actionVariant === "outline" ? (
                            <button
                              onClick={() => handleAction(item)}
                              className="text-xs font-semibold text-slate-600 border border-slate-300 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                              {item.actionLabel}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(item)}
                              className={`text-xs font-bold px-5 py-2.5 rounded-xl text-white transition-colors flex items-center gap-2 ${item.stage === 5 ? "bg-[#16a34a] hover:bg-emerald-700" : "bg-[#0f392b] hover:bg-emerald-900"
                                }`}
                            >
                              {item.stage === 2 && <span className="material-icons-round text-sm">edit_note</span>}
                              {item.stage === 5 && <span className="material-icons-round text-sm">account_balance_wallet</span>}
                              {item.actionLabel}
                            </button>
                          )
                        )}

                        {item._type === "agreement" && item.stage >= 3 && (
                          <button
                            onClick={() => item.agreement && setDetailAgreement(item.agreement)}
                            className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
                          >
                            View Agreement
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
