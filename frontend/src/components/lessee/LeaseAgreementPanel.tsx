"use client";
import { useState } from "react";
import { lesseeApi } from "@/lib/services/api";
import ESignatureInput from "./ESignatureInput";

interface Agreement {
  id: number;
  land: number;
  land_name: string;
  land_location: string;
  land_area?: number;
  land_county?: string;
  agreed_area?: number;
  requested_area?: number;
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
  witness_name?: string;
  witness_id_number?: string;
  witness_phone?: string;
  witness_signature?: string;
  witness_signed_at?: string;
  lessee_submitted_at?: string;
  owner_signed_at?: string;
}

interface Props {
  agreement: Agreement;
  myName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

type PanelStep = "review" | "fill" | "witness" | "done";

const fmt = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-KE", { day: "2-digit", month: "long", year: "numeric" }) : "—";

export default function LeaseAgreementPanel({ agreement, myName, onClose, onSubmitted }: Props) {
  const isViewOnly = agreement.lessee_submitted;

  const [step, setStep] = useState<PanelStep>(isViewOnly ? "done" : "review");

  // Form state
  const [intendedUse, setIntendedUse] = useState(agreement.intended_use ?? "");
  const [conditions, setConditions] = useState(agreement.special_conditions ?? "");
  const [lesseeSig, setLesseeSig] = useState(agreement.lessee_signature ?? "");
  const [witnessName, setWitnessName] = useState(agreement.witness_name ?? "");
  const [witnessId, setWitnessId] = useState(agreement.witness_id_number ?? "");
  const [witnessPhone, setWitnessPhone] = useState(agreement.witness_phone ?? "");

  // Agreed lease terms (lessee can confirm / adjust before locking)
  const [agreedStartDate, setAgreedStartDate] = useState(agreement.start_date ?? "");
  const [agreedEndDate, setAgreedEndDate] = useState(agreement.end_date ?? "");
  const [agreedRent, setAgreedRent] = useState(String(agreement.monthly_rent ?? ""));
  const [agreedArea, setAgreedArea] = useState(
    String(agreement.agreed_area ?? agreement.requested_area ?? ""),
  );

  const [witnessSig, setWitnessSig] = useState(agreement.witness_signature ?? "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rent = Number(agreement.monthly_rent);

  const handleSubmit = async () => {
    if (!intendedUse.trim()) { setError("Intended use is required."); return; }
    if (!lesseeSig.trim()) { setError("Your signature is required."); return; }
    if (!witnessName.trim() || !witnessId.trim() || !witnessPhone.trim()) {
      setError("Witness full name, ID number, and phone are required.");
      return;
    }
    // Witness security checks — name
    if (witnessName.trim().toLowerCase() === myName.trim().toLowerCase()) {
      setError("The witness cannot be the lessee. Please have a neutral third party witness the agreement.");
      return;
    }
    if (agreement.lessor_name && witnessName.trim().toLowerCase() === agreement.lessor_name.trim().toLowerCase()) {
      setError("The witness cannot be the landlord. A neutral third party must witness the agreement.");
      return;
    }
    // Witness security checks — national ID
    if (agreement.lessee_id_number && witnessId.trim() === agreement.lessee_id_number.trim()) {
      setError("The witness's National ID matches the lessee's. The witness must be a neutral third party.");
      return;
    }
    if (agreement.lessor_id_number && witnessId.trim() === agreement.lessor_id_number.trim()) {
      setError("The witness's National ID matches the landlord's. A neutral third party must witness the agreement.");
      return;
    }
    if (!witnessSig.trim()) {
      setError("Witness signature is required. Please have the witness sign above.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await lesseeApi.submitAgreement(agreement.id, {
        intended_use: intendedUse.trim(),
        special_conditions: conditions.trim(),
        lessee_signature: lesseeSig.trim(),
        witness_name: witnessName.trim(),
        witness_id_number: witnessId.trim(),
        witness_phone: witnessPhone.trim(),
        witness_signature: witnessSig,
        agreed_start_date: agreedStartDate || undefined,
        agreed_end_date: agreedEndDate || undefined,
        agreed_monthly_rent: agreedRent ? Number(agreedRent) : undefined,
        agreed_area: agreedArea ? Number(agreedArea) : undefined,
      });
      onSubmitted();
      setStep("done");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      setError(err.response?.data?.detail ?? "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel — centered modal */}
      <div
        className="w-full max-w-3xl bg-white shadow-2xl flex flex-col rounded-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full print:rounded-none"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f392b] px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
          <div>
            <p className="text-[#13ec80] text-xs font-semibold uppercase tracking-widest">Lease Agreement</p>
            <h2 className="text-white font-bold text-lg">{agreement.land_name}</h2>
          </div>
          <div className="flex items-center gap-2">
            {isViewOnly && (
              <button
                onClick={handlePrint}
                className="text-white/70 hover:text-white flex items-center gap-1.5 text-sm border border-white/20 rounded-lg px-3 py-1.5 transition-colors"
              >
                <span className="material-icons-round text-base">print</span>
                PDF / Print
              </button>
            )}
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors ml-2">
              <span className="material-icons-round text-2xl">close</span>
            </button>
          </div>
        </div>

        {/* Step navigation for filling */}
        {!isViewOnly && (
          <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex gap-6 shrink-0 print:hidden">
            {[
              { key: "review", label: "1. Review Terms" },
              { key: "fill", label: "2. Fill Details" },
              { key: "witness", label: "3. Witness & Sign" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStep(key as PanelStep)}
                className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                  step === key
                    ? "border-[#16a34a] text-[#16a34a]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* ── CONTRACT DOCUMENT ── */}
          <div
            id="lease-contract"
            className="px-8 py-6 print:px-12 print:py-10 space-y-6 text-slate-800"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {/* Title */}
            <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Republic of Kenya</p>
              <h1 className="text-2xl font-bold uppercase tracking-wide">Agricultural Land Lease Agreement</h1>
              <p className="text-sm text-slate-500">Pursuant to the Land Act, 2012 &amp; Land Registration Act, 2012</p>
              <p className="text-sm font-semibold">Agreement No. FLA-{String(agreement.id).padStart(6, "0")}</p>
            </div>

            {/* Preamble */}
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                This Agricultural Land Lease Agreement (<strong>&quot;Agreement&quot;</strong>) is entered into as of{" "}
                <strong>{agreement.lessee_submitted_at ? fmt(agreement.lessee_submitted_at) : "________________________"}</strong>{" "}
                by and between the parties identified below:
              </p>
            </div>

            {/* Parties */}
            <section className="space-y-4">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                1. Parties to the Agreement
              </h2>

              <div className="grid grid-cols-2 gap-6 text-sm">
                {/* Landlord */}
                <div className="space-y-1">
                  <p className="font-bold text-[#0f392b] text-xs uppercase tracking-wider">The Landlord (Lessor)</p>
                  <p><span className="text-slate-500">Full Name:</span> <strong>{agreement.lessor_name}</strong></p>
                  {agreement.lessor_id_number && (
                    <p><span className="text-slate-500">National ID:</span> {agreement.lessor_id_number}</p>
                  )}
                </div>
                {/* Tenant */}
                <div className="space-y-1">
                  <p className="font-bold text-[#0f392b] text-xs uppercase tracking-wider">The Tenant (Lessee)</p>
                  <p><span className="text-slate-500">Full Name:</span> <strong>{agreement.lessee_name}</strong></p>
                  {agreement.lessee_id_number && (
                    <p><span className="text-slate-500">National ID:</span> {agreement.lessee_id_number}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Property */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                2. Description of the Property
              </h2>
              <div className="text-sm space-y-1.5">
                <p><span className="text-slate-500">Land Name / Plot ID:</span> <strong>{agreement.land_name}</strong></p>
                <p><span className="text-slate-500">Location / Sub-county:</span> {agreement.land_location || "—"}</p>
                {agreement.land_county && (
                  <p><span className="text-slate-500">County:</span> {agreement.land_county}</p>
                )}
                {agreement.land_area && (
                  <p><span className="text-slate-500">Total Area:</span> {agreement.land_area} acres</p>
                )}
                {(agreement.agreed_area || agreement.requested_area) && (
                  <p>
                    <span className="text-slate-500">Leased Area (this agreement):</span>{" "}
                    <strong>{agreement.agreed_area ?? agreement.requested_area} acres</strong>
                    {agreement.land_area && Number(agreement.agreed_area ?? agreement.requested_area) < Number(agreement.land_area) && (
                      <span className="ml-1 text-xs text-amber-700">(partial lease)</span>
                    )}
                  </p>
                )}
              </div>
            </section>

            {/* Lease Term */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                3. Lease Term &amp; Rent
              </h2>
              {step === "fill" && !isViewOnly ? (
                /* ── Editable in step 2 ── */
                <div className="space-y-3">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5 flex items-start gap-2 text-xs text-amber-800">
                    <span className="material-icons-round text-sm shrink-0 mt-0.5">edit_note</span>
                    <p>Confirm or adjust the lease dates and rent below. These will be <strong>locked</strong> after you submit.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Commencement Date</label>
                      <input
                        type="date"
                        value={agreedStartDate}
                        onChange={(e) => setAgreedStartDate(e.target.value)}
                        className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Expiry Date</label>
                      <input
                        type="date"
                        value={agreedEndDate}
                        onChange={(e) => setAgreedEndDate(e.target.value)}
                        className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Monthly Rent (KES)</label>
                      <input
                        type="number"
                        min={0}
                        value={agreedRent}
                        onChange={(e) => setAgreedRent(e.target.value)}
                        placeholder="e.g. 15000"
                        className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                        Acres to Lease
                        {agreement.land_area && (
                          <span className="ml-1.5 font-normal text-slate-400 normal-case">
                            (land total: {agreement.land_area} ac)
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        max={agreement.land_area ?? undefined}
                        value={agreedArea}
                        onChange={(e) => setAgreedArea(e.target.value)}
                        placeholder={`e.g. ${agreement.land_area ?? "5"}`}
                        className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                      />
                      {agreement.land_area && agreedArea && Number(agreedArea) < Number(agreement.land_area) && (
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <span className="material-icons-round text-sm">info</span>
                          Partial lease — you are requesting {agreedArea} of {agreement.land_area} acres
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ── Read-only once submitted (or in review/witness step) ── */
                <div className={`text-sm space-y-1.5 ${isViewOnly ? "" : "opacity-60"}`}>
                  {isViewOnly && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-2">
                      <span className="material-icons-round text-sm">lock</span>
                      Terms confirmed and locked
                    </div>
                  )}
                  <p><span className="text-slate-500">Commencement Date:</span> <strong>{fmt(agreedStartDate || agreement.start_date)}</strong></p>
                  <p><span className="text-slate-500">Expiry Date:</span> <strong>{fmt(agreedEndDate || agreement.end_date)}</strong></p>
                  <p>
                    <span className="text-slate-500">Monthly Rent:</span>{" "}
                    <strong>Kenya Shillings {Number(agreedRent || rent).toLocaleString()}/= (KES {Number(agreedRent || rent).toLocaleString()})</strong>
                  </p>
                  {(agreedArea || agreement.agreed_area) && (
                    <p>
                      <span className="text-slate-500">Leased Area:</span>{" "}
                      <strong>{agreedArea || agreement.agreed_area} Acres</strong>
                      {agreement.land_area && Number(agreedArea || agreement.agreed_area) < Number(agreement.land_area) && (
                        <span className="ml-1 text-xs text-amber-700">(partial — of {agreement.land_area} ac total)</span>
                      )}
                    </p>
                  )}
                  <p><span className="text-slate-500">Payment Schedule:</span> Monthly, due on the 5th of each month, paid into escrow.</p>
                  <p><span className="text-slate-500">Security Deposit:</span> One (1) month&apos;s rent (KES {Number(agreedRent || rent).toLocaleString()}) held in escrow.</p>
                </div>
              )}
            </section>

            {/* Permitted Use */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                4. Permitted Use of Land
              </h2>
              {step === "fill" || isViewOnly ? (
                isViewOnly ? (
                  <p className="text-sm">{agreement.intended_use || "—"}</p>
                ) : (
                  <textarea
                    value={intendedUse}
                    onChange={(e) => setIntendedUse(e.target.value)}
                    placeholder="Describe the intended agricultural use (e.g., maize cultivation, dairy farming, horticulture)"
                    rows={3}
                    className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-4 py-3 text-sm outline-none text-slate-800 resize-none transition-colors"
                    style={{ fontFamily: "Georgia, serif" }}
                  />
                )
              ) : (
                <p className="text-sm text-slate-400 italic">
                  [Tenant to specify intended agricultural use — step 2]
                </p>
              )}
            </section>

            {/* Covenants */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                5. Covenants &amp; Obligations
              </h2>
              <div className="text-sm space-y-2">
                <p className="font-semibold text-[#0f392b]">The Lessee undertakes to:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 ml-2">
                  <li>Maintain the Land in good agricultural condition and manage it sustainably.</li>
                  <li>Not sub-let or transfer any interest in the Land without prior written consent of the Landlord.</li>
                  <li>Comply with all applicable Kenyan environmental, water-use, and agricultural regulations.</li>
                  <li>Not carry out any permanent construction or structural alterations on the Land.</li>
                  <li>Allow the Landlord reasonable access to inspect the Land upon 48 hours&apos; notice.</li>
                  <li>Pay rent on time and settle any utility or local authority charges relating to the Land.</li>
                </ol>
                <p className="font-semibold text-[#0f392b] mt-3">The Landlord undertakes to:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 ml-2">
                  <li>Ensure the Lessee&apos;s quiet enjoyment of the Land throughout the Lease Term.</li>
                  <li>Not interfere with the Lessee&apos;s lawful agricultural activities.</li>
                  <li>Disclose any encumbrances, third-party claims, or disputes over the Land at the time of signing.</li>
                </ol>
              </div>
            </section>

            {/* Special conditions */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                6. Special Conditions
              </h2>
              {step === "fill" || isViewOnly ? (
                isViewOnly ? (
                  <p className="text-sm">{agreement.special_conditions || "None"}</p>
                ) : (
                  <textarea
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="Any additional or special conditions agreed between parties (leave blank if none)"
                    rows={3}
                    className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-4 py-3 text-sm outline-none text-slate-800 resize-none transition-colors"
                    style={{ fontFamily: "Georgia, serif" }}
                  />
                )
              ) : (
                <p className="text-sm text-slate-400 italic">[To be filled in step 2 — optional]</p>
              )}
            </section>

            {/* Termination */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                7. Termination
              </h2>
              <div className="text-sm space-y-1.5 text-slate-700">
                <p>Either party may terminate this Agreement before its natural expiry by giving <strong>thirty (30) days&apos; written notice</strong> to the other party through the FarmLease platform.</p>
                <p>Grounds for immediate termination include: material breach of any covenant herein, non-payment of rent for two (2) consecutive months, or sub-letting without consent.</p>
                <p>Upon termination, the Lessee shall vacate and restore the Land to its original condition, reasonable wear and tear excepted.</p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                8. Dispute Resolution &amp; Governing Law
              </h2>
              <div className="text-sm space-y-1.5 text-slate-700">
                <p>This Agreement shall be governed by the laws of Kenya, including the Land Act 2012, the Land Registration Act 2012, and the Agricultural Act (Cap. 318).</p>
                <p>Any dispute arising from this Agreement shall first be referred to mediation through the FarmLease platform. If unresolved within 21 days, the dispute shall be referred to the Environment and Land Court of the relevant county.</p>
              </div>
            </section>

            {/* Signatures */}
            <section className="space-y-5">
              <h2 className="text-base font-bold uppercase tracking-wide border-b border-slate-300 pb-1">
                9. Execution &amp; Signatures
              </h2>
              <p className="text-sm text-slate-600">
                By signing below, the parties acknowledge that they have read, understood, and voluntarily agreed to all terms of this Agreement.
              </p>

              {/* Lessee signature block */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <p className="font-bold text-xs uppercase tracking-wider text-[#0f392b]">Signed by the Lessee (Tenant)</p>
                {step === "witness" || isViewOnly ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Electronic Signature</p>
                      {(() => {
                        const sig = agreement.lessee_submitted ? (agreement.lessee_signature || lesseeSig) : lesseeSig;
                        return sig?.startsWith("data:image") ? (
                          <img src={sig} alt="Lessee signature" className="h-12 max-w-full object-contain border-b border-dashed border-slate-400 pb-1" />
                        ) : (
                          <p className="text-2xl border-b border-dashed border-slate-400 pb-2 text-slate-800" style={{ fontFamily: "cursive" }}>
                            {sig || "___________________________"}
                          </p>
                        );
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-slate-500">Full Name:</span> {agreement.lessee_name}</p>
                      {agreement.lessee_id_number && (
                        <p><span className="text-slate-500">National ID:</span> {agreement.lessee_id_number}</p>
                      )}
                      {(agreement.lessee_submitted_at || step === "witness") && (
                        <p>
                          <span className="text-slate-500">Date:</span>{" "}
                          {agreement.lessee_submitted_at ? fmt(agreement.lessee_submitted_at) : new Date().toLocaleDateString("en-KE")}
                        </p>
                      )}
                    </div>
                  </div>
                ) : step === "fill" ? (
                  <ESignatureInput
                    label="Your Electronic Signature (type your full legal name)"
                    value={lesseeSig}
                    onChange={setLesseeSig}
                    placeholder="Type your full legal name exactly"
                  />
                ) : (
                  <div className="h-12 border-b border-dashed border-slate-300 flex items-end pb-1">
                    <p className="text-slate-400 text-sm italic">[Tenant signature — step 2]</p>
                  </div>
                )}
              </div>

              {/* Owner signature block */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3">
                <p className="font-bold text-xs uppercase tracking-wider text-[#0f392b]">Signed by the Landlord (Lessor)</p>
                {agreement.owner_signed ? (
                  <div className="space-y-3">
                    {agreement.owner_signature?.startsWith("data:image") ? (
                      <img src={agreement.owner_signature} alt="Owner signature" className="h-12 max-w-full object-contain border-b border-dashed border-slate-400 pb-1" />
                    ) : (
                      <p className="text-2xl border-b border-dashed border-slate-400 pb-2 text-slate-800" style={{ fontFamily: "cursive" }}>
                        {agreement.owner_signature || "___________________________"}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-slate-500">Full Name:</span> {agreement.lessor_name}</p>
                      {agreement.owner_signed_at && (
                        <p><span className="text-slate-500">Date:</span> {fmt(agreement.owner_signed_at)}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600 text-sm">
                    <span className="material-icons-round text-base">schedule</span>
                    {agreement.lessee_submitted
                      ? "Awaiting landlord's signature…"
                      : "Pending lessee submission"}
                  </div>
                )}
              </div>

              {/* Witness block */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold text-xs uppercase tracking-wider text-[#0f392b]">Witness</p>
                  {step === "witness" && (
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <span className="material-icons-round text-sm">how_to_reg</span>
                      Step 3 — Hand device to witness
                    </div>
                  )}
                </div>

                {isViewOnly && agreement.witness_name ? (
                  <div className="space-y-3">
                    {agreement.witness_signed_at ? (
                      <>
                        {/* Render drawn (base64) or typed signature */}
                        {agreement.witness_signature?.startsWith("data:image") ? (
                          <img
                            src={agreement.witness_signature}
                            alt="Witness signature"
                            className="h-12 max-w-full object-contain border-b border-dashed border-slate-400 pb-1"
                          />
                        ) : (
                          <p
                            className="text-2xl border-b border-dashed border-slate-400 pb-2 text-slate-800"
                            style={{ fontFamily: "cursive" }}
                          >
                            {agreement.witness_signature || "___________________________"}
                          </p>
                        )}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <p><span className="text-slate-500">Full Name:</span> {agreement.witness_name}</p>
                          <p><span className="text-slate-500">National ID:</span> {agreement.witness_id_number}</p>
                          <p><span className="text-slate-500">Phone:</span> {agreement.witness_phone}</p>
                          <p><span className="text-slate-500">Date:</span> {fmt(agreement.witness_signed_at)}</p>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2 text-slate-700">
                          <p><span className="text-slate-500">Name:</span> {agreement.witness_name}</p>
                          <p><span className="text-slate-500">ID:</span> {agreement.witness_id_number}</p>
                          <p><span className="text-slate-500">Phone:</span> {agreement.witness_phone}</p>
                        </div>
                        <p className="flex items-center gap-1.5 text-amber-600">
                          <span className="material-icons-round text-base">schedule</span>
                          Awaiting witness signature…
                        </p>
                      </div>
                    )}
                  </div>
                ) : step === "witness" ? (
                  <div className="space-y-4">
                    {/* Witness identity warning banners */}
                    {witnessName.trim() && witnessName.trim().toLowerCase() === myName.trim().toLowerCase() && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2 text-sm text-red-800">
                        <span className="material-icons-round text-red-500 text-base mt-0.5 shrink-0">warning</span>
                        <div>
                          <p className="font-bold">Witness cannot be the lessee</p>
                          <p className="text-xs mt-0.5">The witness name matches yours. The witness must be a neutral third party who is not a party to this agreement.</p>
                        </div>
                      </div>
                    )}
                    {witnessName.trim() && agreement.lessor_name && witnessName.trim().toLowerCase() === agreement.lessor_name.trim().toLowerCase() && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2 text-sm text-red-800">
                        <span className="material-icons-round text-red-500 text-base mt-0.5 shrink-0">warning</span>
                        <div>
                          <p className="font-bold">Witness cannot be the landlord</p>
                          <p className="text-xs mt-0.5">The witness name matches the landlord&apos;s name. A neutral third party must witness this agreement.</p>
                        </div>
                      </div>
                    )}
                    {witnessId.trim() && agreement.lessee_id_number && witnessId.trim() === agreement.lessee_id_number.trim() && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2 text-sm text-red-800">
                        <span className="material-icons-round text-red-500 text-base mt-0.5 shrink-0">warning</span>
                        <div>
                          <p className="font-bold">Witness ID matches the lessee&apos;s ID</p>
                          <p className="text-xs mt-0.5">The National ID entered belongs to the lessee. The witness must be a different, neutral person.</p>
                        </div>
                      </div>
                    )}
                    {witnessId.trim() && agreement.lessor_id_number && witnessId.trim() === agreement.lessor_id_number.trim() && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2 text-sm text-red-800">
                        <span className="material-icons-round text-red-500 text-base mt-0.5 shrink-0">warning</span>
                        <div>
                          <p className="font-bold">Witness ID matches the landlord&apos;s ID</p>
                          <p className="text-xs mt-0.5">The National ID entered belongs to the landlord. A neutral third party must witness this agreement.</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Full Name</label>
                        <input
                          value={witnessName}
                          onChange={(e) => setWitnessName(e.target.value)}
                          placeholder="Witness full legal name"
                          className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">National ID No.</label>
                        <input
                          value={witnessId}
                          onChange={(e) => setWitnessId(e.target.value)}
                          placeholder="e.g. 12345678"
                          className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Phone Number</label>
                        <input
                          value={witnessPhone}
                          onChange={(e) => setWitnessPhone(e.target.value)}
                          placeholder="e.g. 0712 345 678"
                          className="w-full border-2 border-slate-200 focus:border-[#16a34a] rounded-xl px-3 py-2.5 text-sm outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <ESignatureInput
                        label="Witness Signature"
                        value={witnessSig}
                        onChange={setWitnessSig}
                        placeholder="Witness — type or draw your signature"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-2 text-sm text-blue-800">
                      <span className="material-icons-round text-blue-500 text-base mt-0.5 shrink-0">info</span>
                      <div>
                        <p className="font-semibold text-blue-800 mb-0.5">No login required for the witness</p>
                        <p>
                          The witness is physically present with you. They fill in their details
                          and sign here on this device — no account needed. Their identity is
                          verified by <strong>full name</strong> and <strong>National ID</strong>, which must not match either
                          party&apos;s. This applies equally whether the witness types or draws their
                          signature. The witness must <strong>not</strong> be the lessee or the landlord.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-12 border-b border-dashed border-slate-300 flex items-end pb-1">
                    <p className="text-slate-400 text-sm italic">[Witness details — step 3]</p>
                  </div>
                )}
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-4 text-xs text-slate-400 text-center space-y-0.5">
              <p>This agreement was facilitated through <strong>FarmLease</strong> — Kenya&apos;s trusted agricultural land leasing platform.</p>
              <p>Reference: FLA-{String(agreement.id).padStart(6, "0")}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 px-6 py-4 bg-white shrink-0 print:hidden">
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5 mb-3">
              <span className="material-icons-round text-base">error_outline</span>
              {error}
            </p>
          )}

          {!isViewOnly && (
            <div className="flex gap-3 justify-between items-center">
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {step !== "review" && (
                  <button
                    onClick={() => setStep(step === "fill" ? "review" : "fill")}
                    className="border border-slate-300 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
                  >
                    ← Back
                  </button>
                )}

                {step === "review" && (
                  <button
                    onClick={() => setStep("fill")}
                    className="bg-[#16a34a] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    Fill Agreement Details
                    <span className="material-icons-round text-base">arrow_forward</span>
                  </button>
                )}

                {step === "fill" && (
                  <button
                    onClick={() => {
                      if (!intendedUse.trim()) { setError("Intended use is required."); return; }
                      if (!lesseeSig.trim()) { setError("Your signature (full name) is required."); return; }
                      setError("");
                      setStep("witness");
                    }}
                    className="bg-[#16a34a] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    Next: Add Witness
                    <span className="material-icons-round text-base">arrow_forward</span>
                  </button>
                )}

                {step === "witness" && (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-[#0f392b] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-900 disabled:opacity-60 transition-colors flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="material-icons-round text-base animate-spin">progress_activity</span>
                        Submitting…
                      </>
                    ) : (
                      <>
                        <span className="material-icons-round text-base">send</span>
                        Sign &amp; Send to Landlord
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {isViewOnly && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="material-icons-round text-base text-[#16a34a]">lock</span>
                Agreement locked — cannot be edited after submission
              </div>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
