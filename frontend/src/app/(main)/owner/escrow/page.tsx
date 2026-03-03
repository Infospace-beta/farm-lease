"use client";

import { useState, useEffect } from "react";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";

interface EscrowStage {
  label: string;
  done: boolean;
  date: string;
}

interface EscrowItem {
  id: number;
  land_title: string;
  lessee_name: string;
  amount: number;
  deposited_date?: string;
  release_date?: string;
  status: "released" | "holding" | "pending";
  stages: EscrowStage[];
}

interface EscrowSummary {
  total_in_escrow: number;
  released_this_month: number;
  pending_deposit: number;
}

const STATUS = {
  released: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Released" },
  holding: { bg: "bg-blue-100", text: "text-blue-700", label: "In Escrow" },
  pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending Deposit" },
} as const;

export default function EscrowStatusPage() {
  const [escrows, setEscrows] = useState<EscrowItem[]>([]);
  const [summary, setSummary] = useState<EscrowSummary>({
    total_in_escrow: 0,
    released_this_month: 0,
    pending_deposit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEscrowData();
  }, []);

  const loadEscrowData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ownerApi.escrowStatus();
      setEscrows(response.data.escrows || []);
      setSummary(response.data.summary || summary);
    } catch (err: any) {
      console.error("Failed to load escrow data:", err);
      setError(err.response?.data?.detail || "Failed to load escrow data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Ksh ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Escrow Status"
        subtitle="Track escrow deposits and release timelines for all active leases."
      />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="mx-auto max-w-4xl">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-slate-500">Loading escrow data...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadEscrowData}
                className="mt-3 text-sm font-semibold text-red-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Summary cards */}
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "Total in Escrow",
                    value: formatCurrency(summary.total_in_escrow),
                    icon: "lock",
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                  {
                    label: "Released This Month",
                    value: formatCurrency(summary.released_this_month),
                    icon: "payments",
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    label: "Pending Deposit",
                    value: formatCurrency(summary.pending_deposit),
                    icon: "pending",
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className={`rounded-lg ${c.bg} border border-slate-100 p-4 flex items-center gap-3`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm`}>
                      <span className={`material-symbols-outlined text-2xl ${c.color}`}>{c.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</p>
                      <p className={`text-xl font-bold mt-1 ${c.color}`}>{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state */}
              {escrows.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                    account_balance_wallet
                  </span>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">
                    No escrow accounts found
                  </h3>
                  <p className="text-sm text-slate-500">
                    Escrow deposits will appear here when tenants make payments.
                  </p>
                </div>
              )}

              {/* Escrow cards */}
              <div className="space-y-4">
                {escrows.map((e) => {
                  const s = STATUS[e.status];
                  return (
                    <div key={e.id} className="rounded-lg bg-white border border-slate-200 p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-slate-400">ESC-{e.id.toString().padStart(3, "0")}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}>
                              {s.label}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-800 mt-1">{e.land_title}</h3>
                          <p className="text-xs text-slate-500">Tenant: {e.lessee_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Escrow Amount</p>
                          <p className="text-xl font-bold text-primary mt-0.5">{formatCurrency(e.amount)}</p>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex gap-0 overflow-x-auto">
                        {e.stages.map((stage, i) => (
                          <div key={stage.label} className="flex flex-1 flex-col items-center">
                            <div className="flex w-full items-center">
                              {i > 0 && (
                                <div
                                  className={`h-0.5 flex-1 ${
                                    e.stages[i - 1].done && stage.done
                                      ? "bg-primary"
                                      : e.stages[i - 1].done
                                        ? "bg-primary/30"
                                        : "bg-slate-200"
                                  }`}
                                />
                              )}
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                                  stage.done
                                    ? "border-primary bg-primary text-white"
                                    : "border-slate-300 bg-white text-slate-400"
                                }`}
                              >
                                {stage.done ? (
                                  <span className="material-symbols-outlined text-sm">check</span>
                                ) : (
                                  <span className="text-xs font-bold">{i + 1}</span>
                                )}
                              </div>
                              {i < e.stages.length - 1 && (
                                <div
                                  className={`h-0.5 flex-1 ${
                                    stage.done && e.stages[i + 1]?.done
                                      ? "bg-primary"
                                      : stage.done
                                        ? "bg-primary/30"
                                        : "bg-slate-200"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="mt-2 text-center px-1">
                              <p
                                className={`text-xs font-semibold ${
                                  stage.done ? "text-primary" : "text-slate-400"
                                }`}
                              >
                                {stage.label}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{stage.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="mt-6 flex flex-wrap gap-6 border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs text-slate-400">Deposited</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatDate(e.deposited_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Release Date</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {formatDate(e.release_date)}
                          </p>
                        </div>
                        {e.status === "holding" && (
                          <div className="ml-auto">
                            <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors">
                              <span className="material-symbols-outlined text-lg">notifications</span>
                              Set Release Reminder
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
