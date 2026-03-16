"use client";

import { useMemo, useState } from "react";
import { lesseeApi } from "@/lib/services/api";

interface PaymentModalProps {
  agreementId: number;
  monthlyRent: number;
  landName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  if (digits.startsWith("0") && digits.length === 10) {
    return `254${digits.slice(1)}`;
  }
  if (digits.startsWith("7") && digits.length === 9) {
    return `254${digits}`;
  }
  if (digits.startsWith("254") && digits.length === 12) {
    return digits;
  }

  return null;
}

export default function PaymentModal({
  agreementId,
  monthlyRent,
  landName,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState<number>(Math.max(1, Math.round(monthlyRent || 0)));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const formattedRent = useMemo(
    () => `KES ${Number(monthlyRent || 0).toLocaleString()}`,
    [monthlyRent],
  );

  const handlePay = async () => {
    setError(null);
    setMessage(null);

    const normalized = normalizeKenyanPhone(phoneNumber);
    if (!normalized) {
      setError("Enter a valid M-Pesa number. Example: 07XXXXXXXX.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    try {
      setLoading(true);
      const res = await lesseeApi.initiatePayment({
        lease_agreement_id: agreementId,
        phone_number: normalized,
        amount: Number(amount),
      });

      const apiMessage =
        res.data?.message ?? "STK push sent. Complete payment on your phone.";
      setMessage(apiMessage);
      onSuccess?.();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string; detail?: string } } };
      setError(err.response?.data?.error ?? err.response?.data?.detail ?? "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">M-Pesa Payment</p>
            <h3 className="text-slate-900 font-bold text-lg leading-tight mt-1">{landName}</h3>
            <p className="text-xs text-slate-500 mt-1">Monthly rent: {formattedRent}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Phone number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="07XXXXXXXX"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <p className="text-[11px] text-slate-400 mt-1">Use your Safaricom line linked to M-Pesa.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Amount (KES)</label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</div>
          )}

          {message && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
              {message}
            </div>
          )}
        </div>

        <div className="mt-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#0f392b] hover:bg-[#1a4d3b] text-white disabled:opacity-60"
          >
            {loading ? "Sending STK Push..." : "Pay via M-Pesa"}
          </button>
        </div>
      </div>
    </div>
  );
}
