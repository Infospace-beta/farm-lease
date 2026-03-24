"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { lesseeApi } from "@/lib/services/api";
import { useAuth } from "@/providers";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";

interface LandListing {
  id: number;
  title: string;
  description: string;
  total_area: number;
  price_per_month: number | string;
  preferred_duration: string;
  owner_name?: string;
  owner_email?: string;
  latitude?: number | string;
  longitude?: number | string;
  has_irrigation?: boolean;
  has_electricity?: boolean;
  has_road_access?: boolean;
  has_fencing?: boolean;
}

const FREQUENCIES = ["Monthly", "Quarterly", "Annually"];

function calcMonths(start: string, end: string): number | null {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (e <= s) return null;
  return (
    (e.getFullYear() - s.getFullYear()) * 12 +
    (e.getMonth() - s.getMonth())
  );
}

export default function NewLeaseRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const prefillLandId = searchParams.get("landId")
    ? Number(searchParams.get("landId"))
    : null;

  /* ─── Form state ─────────────────────────────────── */
  const [selectedLandId, setSelectedLandId] = useState<number | "">(
    prefillLandId ?? "",
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customTerms, setCustomTerms] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [escrow, setEscrow] = useState(false);

  /* ─── Listing data ───────────────────────────────── */
  const [listings, setListings] = useState<LandListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  /* ─── Submission state ───────────────────────────── */
  const [submitting, setSubmitting] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    lesseeApi
      .listings()
      .then((res) => {
        const raw = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
        setListings(raw);
      })
      .catch(() => { })
      .finally(() => setListingsLoading(false));
  }, []);

  const selectedLand = useMemo(
    () => listings.find((l) => l.id === selectedLandId) ?? null,
    [listings, selectedLandId],
  );

  const filteredListings = listings;

  const durationMonths = calcMonths(startDate, endDate);
  const priceNum = selectedLand ? Number(selectedLand.price_per_month) : 0;
  const totalAmount =
    selectedLand && durationMonths
      ? priceNum * durationMonths
      : null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const validate = (): string | null => {
    if (!selectedLandId) return "Please select a land plot.";
    if (!startDate) return "Please select a start date.";
    if (!endDate) return "Please select an end date.";
    if (new Date(endDate) <= new Date(startDate))
      return "End date must be after the start date.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await lesseeApi.createLeaseRequest({
        land: selectedLandId as number,
        proposed_start_date: startDate,
        proposed_end_date: endDate,
        message: customTerms.trim() || undefined,
      });
      showToast("Lease request sent successfully!");
      setTimeout(() => router.push("/lessee/leases"), 1500);
    } catch (e: unknown) {
      const errData = (
        e as { response?: { data?: Record<string, unknown> } }
      )?.response?.data;
      if (errData) {
        const msgs = Object.entries(errData)
          .map(([k, v]) =>
            `${k}: ${Array.isArray(v) ? v.join(", ") : v}`,
          )
          .join(" | ");
        setError(msgs);
      } else {
        setError("Failed to submit lease request. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setSavingDraft(true);
    setTimeout(() => {
      setSavingDraft(false);
      showToast("Draft saved.");
    }, 800);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-sidebar-bg text-white text-sm px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
          <span className="material-icons-round text-base">check_circle</span>
          {toast}
        </div>
      )}

      {/* Page Header */}
      <LesseePageHeader
        title="New Lease Agreement"
        subtitle="Draft a new contract, set financial terms, and enable escrow protection."
      >
        <Link
          href="/lessee/leases"
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors"
        >
          <span className="material-icons-round text-base">arrow_back</span>
          Back
        </Link>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <span className="material-icons-round text-red-500 text-base shrink-0 mt-0.5">
              error_outline
            </span>
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto shrink-0 text-red-400 hover:text-red-600"
            >
              <span className="material-icons-round text-sm">close</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* ── LEFT: Form panels ─────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* General Information */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <span className="material-icons-round text-[#047857] text-xl">
                    group
                  </span>
                </div>
                <h2
                  className="text-base font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  General Information
                </h2>
              </div>

              {/* Farmer Info (pre-filled from DB) */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Farmer (You)
                </label>
                <div className="flex items-center gap-3 border border-gray-200 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-[#047857] flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">
                      {user ? (user.first_name?.[0] ?? user.email[0]).toUpperCase() : "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user ? (user.name || `${user.first_name} ${user.last_name}`.trim() || user.username) : "Loading..."}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email ?? ""}</p>
                    {user?.phone_number && (
                      <p className="text-xs text-gray-400 truncate">{user.phone_number}</p>
                    )}
                  </div>
                  <span className="material-icons-round text-[#047857] text-base shrink-0">verified_user</span>
                </div>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Your registered account details will be used for this lease agreement.
                </p>
              </div>

              {/* Land Plot */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Land Plot
                </label>
                {listingsLoading ? (
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                ) : (
                  <div className="relative">
                    <select
                      value={selectedLandId}
                      onChange={(e) =>
                        setSelectedLandId(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                      className="w-full appearance-none border border-gray-300 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] transition bg-white"
                    >
                      <option value="">Select a verified plot from your list</option>
                      {filteredListings.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title} – {l.total_area} Acres
                          {l.owner_name ? ` · ${l.owner_name}` : ""}
                        </option>
                      ))}
                    </select>
                    <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-base">
                      expand_more
                    </span>
                  </div>
                )}

                {/* Selected land preview */}
                {selectedLand && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedLand.has_irrigation && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                        <span className="material-icons-round text-[10px]">water_drop</span>
                        Irrigation
                      </span>
                    )}
                    {selectedLand.has_electricity && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">
                        <span className="material-icons-round text-[10px]">bolt</span>
                        Power
                      </span>
                    )}
                    {selectedLand.has_road_access && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        <span className="material-icons-round text-[10px]">route</span>
                        Road Access
                      </span>
                    )}
                    {selectedLand.has_fencing && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">
                        <span className="material-icons-round text-[10px]">fence</span>
                        Fenced
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Lease Terms */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                  <span className="material-icons-round text-[#047857] text-xl">
                    calendar_month
                  </span>
                </div>
                <h2
                  className="text-base font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Lease Terms
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || today}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-2.5 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] transition"
                  />
                </div>
              </div>

              {/* Duration display */}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
                <span className="material-icons-round text-gray-400 text-[18px]">
                  timelapse
                </span>
                <p className="text-sm text-gray-500">
                  Total Duration:{" "}
                  <span className="font-bold text-gray-800">
                    {durationMonths !== null
                      ? `${durationMonths} Month${durationMonths !== 1 ? "s" : ""}`
                      : "-- Months"}
                  </span>
                </p>
                {totalAmount && (
                  <span className="ml-auto text-xs font-semibold text-[#047857]">
                    Est. Total: Ksh {totalAmount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Custom Terms & Conditions */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
                  <span className="material-icons-round text-amber-600 text-xl">
                    description
                  </span>
                </div>
                <h2
                  className="text-base font-bold text-gray-900"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Custom Terms &amp; Conditions
                </h2>
              </div>
              <textarea
                value={customTerms}
                onChange={(e) => setCustomTerms(e.target.value)}
                rows={5}
                placeholder="Enter any specific clauses regarding land usage, water rights, or crop restrictions..."
                className="w-full border border-gray-300 rounded-xl py-3 px-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] resize-none transition"
              />
              <p className="mt-2 text-[11px] text-gray-400">
                These clauses will be included in the agreement and reviewed by the land owner.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Financials */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h2
                className="text-base font-bold text-gray-900 mb-5"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Financials
              </h2>

              {/* Lease Amount */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Lease Amount
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#047857]/30 focus-within:border-[#047857] transition">
                  <span className="pl-4 text-sm font-medium text-gray-500 shrink-0">
                    Ksh
                  </span>
                  <input
                    type="number"
                    readOnly
                    value={
                      selectedLand
                        ? Number(selectedLand.price_per_month).toFixed(2)
                        : "0.00"
                    }
                    className="flex-1 py-2.5 px-2 text-sm text-gray-800 font-semibold bg-transparent outline-none"
                  />
                  <span className="pr-4 text-xs font-bold text-gray-400 shrink-0">
                    KES
                  </span>
                </div>
                {selectedLand && (
                  <p className="mt-1 text-[11px] text-gray-400">
                    per month
                    {selectedLand.preferred_duration ? ` · ${selectedLand.preferred_duration} term` : ""}
                  </p>
                )}
              </div>

              {/* Payment Frequency */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Payment Frequency
                </label>
                <div className="relative">
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-xl py-2.5 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#047857]/30 focus:border-[#047857] transition"
                  >
                    {FREQUENCIES.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                  </select>
                  <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-base">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Escrow Protection */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-icons-round text-[#047857] text-base">
                      security
                    </span>
                    <p className="text-sm font-bold text-gray-800">
                      Escrow Protection
                    </p>
                  </div>
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setEscrow((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${escrow ? "bg-[#047857]" : "bg-gray-300"
                      }`}
                    aria-pressed={escrow}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${escrow ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Secure funds until terms are met
                </p>
                {escrow && (
                  <p className="mt-1.5 text-[11px] text-gray-500 leading-relaxed">
                    Enabling escrow adds a{" "}
                    <span className="font-semibold text-gray-700">
                      1.5% platform fee
                    </span>{" "}
                    deducted from the transaction.{" "}
                    <a
                      href="#"
                      className="text-[#047857] underline"
                      onClick={(e) => e.preventDefault()}
                    >
                      Learn more
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Summary (visible when land + dates selected) */}
            {selectedLand && durationMonths && (
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
                  Request Summary
                </p>
                <div className="space-y-2 text-xs text-emerald-900">
                  <div className="flex justify-between">
                    <span>Plot</span>
                    <span className="font-semibold text-right max-w-[140px] truncate">
                      {selectedLand.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="font-semibold">
                      {durationMonths} Month{durationMonths !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Rate</span>
                    <span className="font-semibold">
                      Ksh {Number(selectedLand.price_per_month).toLocaleString()}
                    </span>
                  </div>
                  {totalAmount && (
                    <>
                      <div className="border-t border-emerald-200 pt-2 flex justify-between font-bold">
                        <span>Est. Total</span>
                        <span>Ksh {totalAmount.toLocaleString()}</span>
                      </div>
                      {escrow && (
                        <div className="flex justify-between text-amber-700">
                          <span>Escrow Fee (1.5%)</span>
                          <span>
                            Ksh {(totalAmount * 0.015).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Action
              </p>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-sidebar-bg hover:bg-[#1c4a3a] disabled:opacity-60 text-white text-sm font-bold py-3 px-5 rounded-xl shadow-lg shadow-sidebar-bg/20 transition-all mb-3"
              >
                {submitting ? (
                  <>
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Review &amp; Send Agreement
                    <span className="material-icons-round text-base">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={handleSaveDraft}
                disabled={savingDraft}
                className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 px-5 rounded-xl transition-all mb-3"
              >
                {savingDraft ? (
                  <span className="inline-block h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-icons-round text-base text-gray-500">
                    save
                  </span>
                )}
                Save Draft
              </button>
              <Link
                href="/lessee/leases"
                className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel and discard changes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
