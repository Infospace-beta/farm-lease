"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { landsApi } from "@/lib/services/api";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";

/* ─── Step config ─────────────────────────────────────── */
const STEPS = ["Basic Info", "Soil & Climate", "Photos & Submit"];

/* ─── Types ──────────────────────────────────────────────*/
interface BasicForm {
  title: string;
  description: string;
  total_area: string;
  price_per_month: string;
  preferred_duration: string;
  title_deed_number: string;
  latitude: string;
  longitude: string;
  has_irrigation: boolean;
  has_electricity: boolean;
  has_road_access: boolean;
  has_fencing: boolean;
}

interface SoilForm {
  soil_type: string;
  ph_level: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  moisture: string;
  temperature: string;
  rainfall: string;
}

/* ─── Shared input classes ───────────────────────────── */
const INPUT =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition";
const LABEL =
  "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

const SOIL_TYPES = [
  "Sandy",
  "Clay",
  "Loamy",
  "Silt",
  "Peat",
  "Chalk",
  "Sandy Loam",
  "Clay Loam",
  "Other",
];

export default function UploadLandPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [landId, setLandId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<FileList | null>(null);

  const [basic, setBasic] = useState<BasicForm>({
    title: "",
    description: "",
    total_area: "",
    price_per_month: "",
    preferred_duration: "1 Year",
    title_deed_number: "",
    latitude: "0",
    longitude: "0",
    has_irrigation: false,
    has_electricity: false,
    has_road_access: false,
    has_fencing: false,
  });

  const [soil, setSoil] = useState<SoilForm>({
    soil_type: "",
    ph_level: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    moisture: "",
    temperature: "",
    rainfall: "",
  });

  /* ── Helpers ────────────────────────────────────────── */
  /** Returns null for empty string so the backend gets null not "" */
  const numOrNull = (v: string): number | null =>
    v.trim() === "" ? null : parseFloat(v);

  const strOrNull = (v: string): string | null =>
    v.trim() === "" ? null : v.trim();

  /* ── Handlers ───────────────────────────────────────── */
  const handleBasicSubmit = async () => {
    // Validate required fields
    if (!basic.title.trim()) {
      setError("Plot title is required.");
      return;
    }
    if (!basic.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!basic.total_area) {
      setError("Total area is required.");
      return;
    }
    if (!basic.price_per_month) {
      setError("Monthly price is required.");
      return;
    }
    if (!basic.title_deed_number.trim()) {
      setError("Title Deed Number is required for verification.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await landsApi.createBasic(basic);
      setLandId(data.land_id);
      setStep(1);
    } catch (e: unknown) {
      const errData = (e as { response?: { data?: Record<string, unknown> } })
        ?.response?.data;
      if (errData) {
        const msgs = Object.entries(errData)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setError(msgs);
      } else {
        setError("Failed to save basic info. Check your inputs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSoilSubmit = async () => {
    if (!landId) return;
    setLoading(true);
    setError(null);
    try {
      // Send null for any empty field — all optional
      const payload = {
        soil_type: strOrNull(soil.soil_type),
        ph_level: numOrNull(soil.ph_level),
        nitrogen: numOrNull(soil.nitrogen),
        phosphorus: numOrNull(soil.phosphorus),
        potassium: numOrNull(soil.potassium),
        moisture: numOrNull(soil.moisture),
        temperature: numOrNull(soil.temperature),
        rainfall: numOrNull(soil.rainfall),
      };
      await landsApi.addSoil(landId, payload);
      setStep(2);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response
        ?.data?.detail;
      setError(msg ?? "Failed to save soil data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotosSubmit = async () => {
    if (!landId) return;
    setLoading(true);
    setError(null);
    try {
      if (photos && photos.length > 0) {
        const fd = new FormData();
        Array.from(photos).forEach((f) => fd.append("images", f));
        await landsApi.uploadPhotos(landId, fd);
      }
      // Success! Redirect to My Lands page with a success flag
      router.push("/owner/lands?success=true");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response
        ?.data?.detail;
      setError(msg ?? "Failed to upload photos.");
    } finally {
      setLoading(false);
    }
  };

  /* ── UI ─────────────────────────────────────────────── */
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="List New Land"
        subtitle="Upload your land details, soil data and photos to start receiving lease requests."
      />
      <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          {/* Step indicator */}
          <div className="mb-4 md:mb-6 flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full text-xs md:text-sm font-bold transition-colors ${
                      i === step
                        ? "bg-green-600 text-white ring-4 ring-green-600/20"
                        : "bg-white text-slate-600 border-2 border-slate-300"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-1 md:mt-1.5 text-[10px] md:text-xs font-medium hidden sm:block ${
                      i === step ? "text-green-600 font-bold" : "text-slate-500"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-1 md:mx-2 h-0.5 flex-1 mb-0 sm:mb-5 ${
                      i < step ? "bg-green-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 md:mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs md:text-sm text-red-700 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* ── STEP 0: Basic Info ─────────────────────── */}
          {step === 0 && (
            <div className="rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8 space-y-5 md:space-y-6">
              <h3 className="text-base md:text-lg font-bold text-slate-800">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="sm:col-span-2">
                  <label className={LABEL}>
                    Plot Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={INPUT}
                    placeholder="e.g. Highland North Plot"
                    value={basic.title}
                    onChange={(e) =>
                      setBasic({ ...basic, title: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={LABEL}>
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className={INPUT + " resize-none"}
                    placeholder="Describe the land..."
                    value={basic.description}
                    onChange={(e) =>
                      setBasic({ ...basic, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={LABEL}>
                    Total Area (Acres) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className={INPUT}
                    placeholder="e.g. 3.5"
                    value={basic.total_area}
                    onChange={(e) =>
                      setBasic({ ...basic, total_area: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={LABEL}>
                    Price / Month (Ksh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={INPUT}
                    placeholder="e.g. 50000"
                    value={basic.price_per_month}
                    onChange={(e) =>
                      setBasic({ ...basic, price_per_month: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={LABEL}>
                    Preferred Lease Duration{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={INPUT}
                    value={basic.preferred_duration}
                    onChange={(e) =>
                      setBasic({ ...basic, preferred_duration: e.target.value })
                    }
                  >
                    {[
                      "6 Months",
                      "1 Year",
                      "2 Years",
                      "3 Years",
                      "5 Years",
                      "Flexible",
                    ].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={LABEL}>
                    Title Deed Number <span className="text-red-500">*</span>
                    <span className="ml-1 text-slate-400 font-normal normal-case tracking-normal">
                      (admin verification only — kept private)
                    </span>
                  </label>
                  <input
                    className={
                      INPUT +
                      (basic.title_deed_number.trim() === ""
                        ? " border-red-300"
                        : "")
                    }
                    placeholder="e.g. KJI-9928-XX"
                    value={basic.title_deed_number}
                    onChange={(e) =>
                      setBasic({ ...basic, title_deed_number: e.target.value })
                    }
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Required for verification. Never shown to lessees.
                  </p>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className={LABEL}>Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {(
                    [
                      {
                        key: "has_irrigation",
                        label: "Irrigation",
                        icon: "water_drop",
                      },
                      {
                        key: "has_electricity",
                        label: "Electricity",
                        icon: "bolt",
                      },
                      {
                        key: "has_road_access",
                        label: "Road Access",
                        icon: "road",
                      },
                      { key: "has_fencing", label: "Fencing", icon: "fence" },
                    ] as { key: keyof BasicForm; label: string; icon: string }[]
                  ).map(({ key, label, icon }) => {
                    const val = basic[key] as boolean;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setBasic({ ...basic, [key]: !val })}
                        className={`flex flex-col items-center gap-1 rounded-lg md:rounded-xl border-2 p-2 md:p-3 text-xs font-semibold transition-all ${val
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                          }`}
                      >
                        <span className="material-symbols-outlined text-lg md:text-xl">
                          {icon}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-end pt-6 border-t border-slate-100">
                <button
                  onClick={handleBasicSubmit}
                  disabled={loading}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl w-auto min-w-35 md:min-w-40"
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-4 w-4 md:h-5 md:w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <span className="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Soil & Climate ─────────────────── */}
          {step === 1 && (
            <div className="rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8 space-y-5 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-bold text-slate-800">
                  Soil & Climate Data
                </h3>
                <p className="text-xs md:text-sm text-slate-500 mt-1">
                  All fields below are{" "}
                  <span className="font-semibold text-primary">optional</span>.
                  Fill in what you know — incomplete data is fine. This helps
                  lessees assess suitability.
                </p>
              </div>

              {/* Soil Type */}
              <div>
                <label className={LABEL}>Type of Soil</label>
                <select
                  className={INPUT}
                  value={soil.soil_type}
                  onChange={(e) =>
                    setSoil({ ...soil, soil_type: e.target.value })
                  }
                >
                  <option value="">— Select soil type (optional) —</option>
                  {SOIL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Numeric soil fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {(
                  [
                    {
                      key: "ph_level",
                      label: "Soil pH Level",
                      placeholder: "e.g. 6.5",
                      unit: "pH",
                    },
                    {
                      key: "nitrogen",
                      label: "Nitrogen (N)",
                      placeholder: "e.g. 200",
                      unit: "ppm",
                    },
                    {
                      key: "phosphorus",
                      label: "Phosphorus (P)",
                      placeholder: "e.g. 50",
                      unit: "ppm",
                    },
                    {
                      key: "potassium",
                      label: "Potassium (K)",
                      placeholder: "e.g. 150",
                      unit: "ppm",
                    },
                    {
                      key: "moisture",
                      label: "Soil Moisture",
                      placeholder: "e.g. 45",
                      unit: "%",
                    },
                    {
                      key: "temperature",
                      label: "Avg Temperature",
                      placeholder: "e.g. 24",
                      unit: "°C",
                    },
                    {
                      key: "rainfall",
                      label: "Annual Rainfall",
                      placeholder: "e.g. 800",
                      unit: "mm",
                    },
                  ] as {
                    key: keyof SoilForm;
                    label: string;
                    placeholder: string;
                    unit: string;
                  }[]
                ).map(({ key, label, placeholder, unit }) => (
                  <div key={key}>
                    <label className={LABEL}>{label}</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className={INPUT + " pr-14"}
                        placeholder={placeholder}
                        value={soil[key]}
                        onChange={(e) =>
                          setSoil({ ...soil, [key]: e.target.value })
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                        {unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-3 md:gap-4">
                <button
                  onClick={() => setStep(0)}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex-1 md:flex-initial min-w-30 md:min-w-35"
                >
                  <span className="material-symbols-outlined text-xl md:text-2xl">arrow_back</span>
                  <span>Back</span>
                </button>
                <button
                  onClick={handleSoilSubmit}
                  disabled={loading}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl flex-1 md:flex-initial min-w-30 md:min-w-35"
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-4 w-4 md:h-5 md:w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <span className="material-symbols-outlined text-xl md:text-2xl">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Photos ────────────────────────── */}
          {step === 2 && (
            <div className="rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8 space-y-5 md:space-y-6">
              <h3 className="text-base md:text-lg font-bold text-slate-800">
                Upload Photos
              </h3>
              <p className="text-xs md:text-sm text-slate-500">
                Add up to 10 photos of your land. High-quality images attract
                more lessees. Photos are{" "}
                <span className="font-semibold text-primary">optional</span> —
                you can submit without them.
              </p>

              <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    cloud_upload
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, WEBP up to 10 MB each
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setPhotos(e.target.files)}
                />
              </label>

              {photos && photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {Array.from(photos).map((f, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}

              {/* Status card */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-4">
                <span className="material-symbols-outlined text-amber-500 text-3xl mt-0.5">
                  info
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Listing hidden until verified
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your listing will be{" "}
                    <span className="font-bold">hidden from lessees</span> until
                    the admin verifies your Title Deed Number. You will be
                    notified once approved.
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-3 md:gap-4">
                <button
                  onClick={() => setStep(1)}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex-1 md:flex-initial min-w-30 md:min-w-35"
                >
                  <span className="material-symbols-outlined text-xl md:text-2xl">arrow_back</span>
                  <span>Back</span>
                </button>
                <button
                  onClick={handlePhotosSubmit}
                  disabled={loading}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl flex-1 md:flex-initial min-w-30 md:min-w-35"
                >
                  {loading ? (
                    <>
                      <span className="inline-block h-4 w-4 md:h-5 md:w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <span className="material-symbols-outlined text-xl md:text-2xl">check_circle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
