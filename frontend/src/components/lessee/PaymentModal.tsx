"use client";
import { useState } from "react";
import { lesseeApi } from "@/lib/services/api";

interface PaymentModalProps {
  agreementId: number;
  monthlyRent: number;
  landName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentModal({
  agreementId,
  monthlyRent,
  landName,
  onSuccess,
  onClose,
}: PaymentModalProps) {
  const [phone, setPhone] = useState("07");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [txnId, setTxnId] = useState("");

  const handlePay = async () => {
    const cleaned = phone.replace(/\s/g, "");
    if (!/^(07|01)\d{8}$/.test(cleaned)) {
      setError("Enter a valid Safaricom or Airtel number (e.g. 0712345678)");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await lesseeApi.initiatePayment({
        lease: agreementId,
        amount: monthlyRent,
        method: "escrow",
      });
      setTxnId(res.data?.transaction_id ?? "");
      setDone(true);
      onSuccess();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      setError(err.response?.data?.detail ?? "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#0f392b] px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[#13ec80] text-xs font-semibold uppercase tracking-widest">Escrow Payment</p>
            <h2 className="text-white text-lg font-bold mt-0.5">{landName}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <span className="material-icons-round text-2xl">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {done ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <span className="material-icons-round text-emerald-600 text-3xl">check_circle</span>
              </div>
              <h3 className="text-slate-900 font-bold text-xl">Payment Held in Escrow</h3>
              <p className="text-slate-500 text-sm">
                Your security deposit of <span className="font-semibold text-slate-700">KES {monthlyRent.toLocaleString()}</span> has
                been placed in escrow. The lease will activate once all conditions are confirmed.
              </p>
              {txnId && (
                <p className="text-xs text-slate-400 font-mono bg-slate-50 rounded-lg px-3 py-2">
                  Ref: {txnId}
                </p>
              )}
              <button
                onClick={onClose}
                className="mt-4 bg-[#16a34a] text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Amount */}
              <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Security Deposit (1st month)</p>
                  <p className="text-2xl font-bold text-slate-900">KES {monthlyRent.toLocaleString()}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-center">
                  <span className="material-icons-round text-amber-500 text-2xl block">account_balance</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Escrow</p>
                </div>
              </div>

              {/* Escrow info */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-3">
                <span className="material-icons-round text-blue-500 text-lg mt-0.5 shrink-0">info</span>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Funds are held securely in escrow and released to the landowner only after all lease conditions are met. You retain full control until release is confirmed.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0712 345 678"
                  className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-4 py-3 outline-none text-slate-900 transition-colors"
                  maxLength={12}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 flex items-center gap-1.5">
                  <span className="material-icons-round text-base">error_outline</span>
                  {error}
                </p>
              )}

              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full bg-[#16a34a] hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <span className="material-icons-round text-base animate-spin">progress_activity</span>
                    Processing…
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-base">payments</span>
                    Pay KES {monthlyRent.toLocaleString()} via M-Pesa
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
