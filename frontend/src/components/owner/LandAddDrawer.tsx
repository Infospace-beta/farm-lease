"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { landsApi } from "@/lib/services/api";

const LocationPicker = dynamic(
  () => import("@/components/shared/LocationPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-56 bg-slate-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-xs text-slate-500 mt-2">Loading map…</p>
        </div>
      </div>
    ),
  }
);

/* ─── Types ────────────────────────────────────────────── */
interface BasicForm {
  title: string;
  description: string;
  total_area: string;
  price_per_month: string;
  preferred_duration: string;
  title_deed_number: string;
  location_name: string;
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

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (newLandId: number) => void;
}

/* ─── Constants ────────────────────────────────────────── */
const STEPS = ["Basic Info", "Soil & Climate", "Photos"];
const SOIL_TYPES = ["Sandy", "Clay", "Loamy", "Silt", "Peat", "Chalk", "Sandy Loam", "Clay Loam", "Other"];
const DURATIONS = ["6 Months", "1 Year", "2 Years", "3 Years", "5 Years", "Flexible"];

const AMENITIES = [
  { key: "has_irrigation", label: "Irrigation System", icon: "water_drop" },
  { key: "has_electricity", label: "Electricity Supply", icon: "bolt" },
  { key: "has_road_access", label: "Road Access", icon: "route" },
  { key: "has_fencing", label: "Fencing", icon: "fence" },
] as const;

const SOIL_FIELDS: { key: keyof SoilForm; label: string; placeholder: string; hint: string }[] = [
  { key: "ph_level", label: "pH Level", placeholder: "6.5", hint: "0–14 scale" },
  { key: "nitrogen", label: "Nitrogen (mg/kg)", placeholder: "25.0", hint: "N content" },
  { key: "phosphorus", label: "Phosphorus (mg/kg)", placeholder: "15.0", hint: "P content" },
  { key: "potassium", label: "Potassium (mg/kg)", placeholder: "200", hint: "K content" },
  { key: "moisture", label: "Moisture (%)", placeholder: "45", hint: "0–100%" },
  { key: "temperature", label: "Avg Temperature (°C)", placeholder: "22", hint: "Annual avg" },
  { key: "rainfall", label: "Annual Rainfall (mm)", placeholder: "800", hint: "mm/year" },
];

const INPUT = "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition";
const LABEL = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

const BLANK_BASIC: BasicForm = {
  title: "", description: "", total_area: "", price_per_month: "",
  preferred_duration: "", title_deed_number: "", location_name: "",
  latitude: "", longitude: "",
  has_irrigation: false, has_electricity: false, has_road_access: false, has_fencing: false,
};

const BLANK_SOIL: SoilForm = {
  soil_type: "", ph_level: "", nitrogen: "", phosphorus: "",
  potassium: "", moisture: "", temperature: "", rainfall: "",
};

/* ─── Component ────────────────────────────────────────── */
export default function LandAddDrawer({ open, onClose, onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [basic, setBasic] = useState<BasicForm>(BLANK_BASIC);
  const [soil, setSoil] = useState<SoilForm>(BLANK_SOIL);

  /* Reset form when drawer closes */
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(0);
        setBasic(BLANK_BASIC);
        setSoil(BLANK_SOIL);
        setPhotos([]);
        setFieldErrors({});
        setError(null);
        setLoading(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* ── Helpers ─────────────────────────────────────────── */
  const numOrNull = (v: string): number | null =>
    v.trim() === "" ? null : parseFloat(v);
  const strOrNull = (v: string): string | null =>
    v.trim() === "" ? null : v.trim();

  /* ── Step 0 → 1 ──────────────────────────────────────── */
  const handleBasicNext = () => {
    const errs: Record<string, string> = {};
    if (!basic.title.trim()) errs.title = "Plot title is required.";
    if (!basic.description.trim()) errs.description = "Description is required.";
    if (!basic.total_area) errs.total_area = "Total area is required.";
    const rawPrice = basic.price_per_month.replace(/,/g, "");
    if (!rawPrice) errs.price_per_month = "Monthly price is required.";
    if (!basic.title_deed_number.trim()) errs.title_deed_number = "Title Deed Number is required.";
    if (!basic.preferred_duration) errs.preferred_duration = "Preferred duration is required.";
    if (!basic.latitude || !basic.longitude) errs.location = "Please pick a location on the map.";
    if (!basic.location_name.trim()) errs.location_name = "Location name is required.";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setError(null);
    setStep(1);
  };

  /* ── Step 2: Final Submit ─────────────────────────────── */
  const handleSubmit = async () => {
    if (photos.length < 3) {
      setError("Please upload at least 3 photos before submitting.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rawPrice = basic.price_per_month.replace(/,/g, "");
      const { data: basicData } = await landsApi.createBasic({ ...basic, price_per_month: rawPrice });
      const newLandId: number = basicData.land_id;

      const hasAnySoil = Object.values(soil).some((v) => v !== "");
      if (hasAnySoil) {
        await landsApi.addSoil(newLandId, {
          soil_type: strOrNull(soil.soil_type),
          ph_level: numOrNull(soil.ph_level),
          nitrogen: numOrNull(soil.nitrogen),
          phosphorus: numOrNull(soil.phosphorus),
          potassium: numOrNull(soil.potassium),
          moisture: numOrNull(soil.moisture),
          temperature: numOrNull(soil.temperature),
          rainfall: numOrNull(soil.rainfall),
        });
      }

      const fd = new FormData();
      photos.forEach((f) => fd.append("images", f));
      await landsApi.uploadPhotos(newLandId, fd);

      onSuccess(newLandId);
    } catch (e: unknown) {
      const errData = (e as { response?: { data?: Record<string, unknown> } })?.response?.data;
      if (errData && typeof errData === "object") {
        let generalMsg = "";
        const fieldMap: Record<string, string> = {};
        for (const [k, v] of Object.entries(errData)) {
          const msg = Array.isArray(v) ? v.join(", ") : String(v);
          if (k === "detail" || k === "non_field_errors") generalMsg += msg + " ";
          else fieldMap[k] = msg;
        }
        if (Object.keys(fieldMap).length) {
          setFieldErrors(fieldMap);
          setStep(0);
        }
        setError(generalMsg.trim() || "Submission failed. Please check your inputs and try again.");
      } else {
        setError("Submission failed. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ──────────────────────────────────────────── */
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-2xl bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              List New Land
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Complete 3 steps to submit your listing for verification</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close drawer"
          >
            <span className="material-icons-round text-slate-400">close</span>
          </button>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center px-6 py-3 border-b border-slate-100 shrink-0 bg-slate-50">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${i === step
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : i < step
                      ? "bg-primary/20 text-primary"
                      : "bg-white text-slate-500 border-2 border-slate-300"
                    }`}
                >
                  {i < step ? <span className="material-icons-round text-sm">check</span> : i + 1}
                </div>
                <span className={`mt-1 text-[10px] font-semibold hidden sm:block ${i === step ? "text-primary" : "text-slate-400"}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-1 h-0.5 flex-1 mb-4 ${i < step ? "bg-primary" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* Error banner */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <span className="material-icons-round text-red-500 text-base shrink-0 mt-0.5">error</span>
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="shrink-0 text-red-400 hover:text-red-600">
                  <span className="material-icons-round text-sm">close</span>
                </button>
              </div>
            )}

            {/* ════ STEP 0: Basic Info ════ */}
            {step === 0 && (
              <div className="space-y-4">
                {/* Property Details card */}
                <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="material-icons-round text-primary text-lg">info</span>
                    Property Details
                  </h3>

                  {/* Title */}
                  <div>
                    <label className={LABEL}>Plot Title / Name <span className="text-red-500">*</span></label>
                    <input
                      className={INPUT + (fieldErrors.title ? " border-red-400" : "")}
                      placeholder="e.g. North Valley Acreage"
                      value={basic.title}
                      onChange={(e) => setBasic({ ...basic, title: e.target.value })}
                    />
                    {fieldErrors.title && <p className="mt-1 text-xs text-red-500">{fieldErrors.title}</p>}
                  </div>

                  {/* Area + Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Total Area (Acres) <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="number" min="0" step="0.1"
                          className={INPUT + " pr-14" + (fieldErrors.total_area ? " border-red-400" : "")}
                          placeholder="0.0" value={basic.total_area}
                          onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()}
                          onChange={(e) => setBasic({ ...basic, total_area: e.target.value })}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-semibold">Acres</span>
                      </div>
                      {fieldErrors.total_area && <p className="mt-1 text-xs text-red-500">{fieldErrors.total_area}</p>}
                    </div>
                    <div>
                      <label className={LABEL}>Monthly Price <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">Ksh</span>
                        <input
                          type="text" inputMode="decimal"
                          className={INPUT + " pl-12" + (fieldErrors.price_per_month ? " border-red-400" : "")}
                          placeholder="0" value={basic.price_per_month}
                          onChange={(e) => setBasic({ ...basic, price_per_month: e.target.value.replace(/[^0-9.]/g, "") })}
                          onBlur={() => {
                            const n = parseFloat(basic.price_per_month.replace(/,/g, ""));
                            if (!isNaN(n)) setBasic({ ...basic, price_per_month: n.toLocaleString() });
                          }}
                          onFocus={() => setBasic({ ...basic, price_per_month: basic.price_per_month.replace(/,/g, "") })}
                        />
                      </div>
                      {fieldErrors.price_per_month && <p className="mt-1 text-xs text-red-500">{fieldErrors.price_per_month}</p>}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={LABEL}>Description <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      className={INPUT + " resize-none" + (fieldErrors.description ? " border-red-400" : "")}
                      placeholder="Describe the terrain, access to water, previous crops grown, etc."
                      value={basic.description}
                      onChange={(e) => setBasic({ ...basic, description: e.target.value })}
                    />
                    {fieldErrors.description && <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>}
                  </div>

                  {/* Duration + Deed */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Preferred Duration <span className="text-red-500">*</span></label>
                      <select
                        className={INPUT + (fieldErrors.preferred_duration ? " border-red-400" : "")}
                        value={basic.preferred_duration}
                        onChange={(e) => setBasic({ ...basic, preferred_duration: e.target.value })}
                      >
                        <option value="">Select duration</option>
                        {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                      </select>
                      {fieldErrors.preferred_duration && <p className="mt-1 text-xs text-red-500">{fieldErrors.preferred_duration}</p>}
                    </div>
                    <div>
                      <label className={LABEL}>Title Deed Number <span className="text-red-500">*</span></label>
                      <input
                        className={INPUT + (fieldErrors.title_deed_number ? " border-red-400" : "")}
                        placeholder="e.g. LR/1234/5678"
                        value={basic.title_deed_number}
                        onChange={(e) => setBasic({ ...basic, title_deed_number: e.target.value })}
                      />
                      {fieldErrors.title_deed_number && <p className="mt-1 text-xs text-red-500">{fieldErrors.title_deed_number}</p>}
                    </div>
                  </div>
                </div>

                {/* Amenities card */}
                <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="material-icons-round text-primary text-lg">checklist</span>
                    Amenities & Features
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES.map(({ key, label, icon }) => {
                      const checked = basic[key] as boolean;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setBasic({ ...basic, [key]: !checked })}
                          className={`flex items-center gap-2.5 rounded-lg border p-3 text-left transition-all ${checked
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                        >
                          <span className={`material-icons-round text-lg ${checked ? "text-primary" : "text-slate-400"}`}>{icon}</span>
                          <span className="text-xs font-semibold flex-1">{label}</span>
                          {checked && <span className="material-icons-round text-primary text-sm">check_circle</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location card */}
                <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className="material-icons-round text-primary text-lg">location_on</span>
                    Location
                  </h3>
                  <div>
                    <label className={LABEL}>Location Name <span className="text-red-500">*</span></label>
                    <input
                      className={INPUT + (fieldErrors.location_name ? " border-red-400" : "")}
                      placeholder="e.g. Nakuru, Rift Valley"
                      value={basic.location_name}
                      onChange={(e) => setBasic({ ...basic, location_name: e.target.value })}
                    />
                    {fieldErrors.location_name && <p className="mt-1 text-xs text-red-500">{fieldErrors.location_name}</p>}
                  </div>
                  <LocationPicker
                    latitude={basic.latitude}
                    longitude={basic.longitude}
                    onLocationChange={(lat, lng) => setBasic({ ...basic, latitude: lat, longitude: lng })}
                  />
                  {fieldErrors.location && <p className="mt-1 text-xs text-red-500">{fieldErrors.location}</p>}
                </div>
              </div>
            )}

            {/* ════ STEP 1: Soil & Climate ════ */}
            {step === 1 && (
              <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="material-icons-round text-primary text-lg">eco</span>
                  <h3 className="text-sm font-bold text-slate-700">Soil & Climate Data</h3>
                  <span className="text-xs text-slate-400 ml-1">(Optional — fill what you know)</span>
                </div>

                <div>
                  <label className={LABEL}>Soil Type</label>
                  <select
                    className={INPUT}
                    value={soil.soil_type}
                    onChange={(e) => setSoil({ ...soil, soil_type: e.target.value })}
                  >
                    <option value="">Select soil type</option>
                    {SOIL_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {SOIL_FIELDS.map(({ key, label, placeholder, hint }) => (
                    <div key={key}>
                      <label className={LABEL}>
                        {label} <span className="text-slate-400 normal-case font-normal">— {hint}</span>
                      </label>
                      <input
                        type="number" min="0" step="0.01"
                        className={INPUT}
                        placeholder={placeholder}
                        value={soil[key]}
                        onChange={(e) => setSoil({ ...soil, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 flex items-start gap-2">
                  <span className="material-icons-round text-blue-500 text-sm mt-0.5">info</span>
                  <p className="text-xs text-blue-700">
                    Soil data helps the AI predictor suggest suitable crops for lessees. You can skip fields you don&apos;t know.
                  </p>
                </div>
              </div>
            )}

            {/* ════ STEP 2: Photos ════ */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <span className="material-icons-round text-primary text-lg">photo_library</span>
                      Upload Land Photos
                    </h3>
                    <span className="text-xs text-slate-400">Min 3 · Max 8</span>
                  </div>

                  {/* Photo grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {photos.map((f, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100 group">
                        <img
                          src={URL.createObjectURL(f)}
                          alt={`Land photo ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-icons-round text-xs">close</span>
                        </button>
                      </div>
                    ))}
                    {photos.length < 8 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50 hover:bg-primary/5 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                        <span className="material-icons-round text-2xl text-slate-300 group-hover:text-primary">add_photo_alternate</span>
                        <span className="text-[10px] text-slate-400 mt-1">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            setPhotos((prev) => [...prev, ...files].slice(0, 8));
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <p className={`text-xs font-medium ${photos.length >= 3 ? "text-emerald-600" : "text-amber-600"}`}>
                    {photos.length} / 8 photos added
                    {photos.length < 3 ? ` — add ${3 - photos.length} more to continue` : " ✓ Ready to submit!"}
                  </p>
                </div>

                {/* Summary */}
                <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 space-y-2">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    <span className="material-icons-round text-sm">summarize</span>
                    Listing Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-700">
                    <div><span className="font-semibold text-slate-500">Title:</span> {basic.title || "—"}</div>
                    <div><span className="font-semibold text-slate-500">Area:</span> {basic.total_area || "—"} Acres</div>
                    <div><span className="font-semibold text-slate-500">Price:</span> Ksh {basic.price_per_month || "—"}/mo</div>
                    <div><span className="font-semibold text-slate-500">Duration:</span> {basic.preferred_duration || "—"}</div>
                    <div><span className="font-semibold text-slate-500">Location:</span> {basic.location_name || "—"}</div>
                    <div><span className="font-semibold text-slate-500">Soil:</span> {soil.soil_type || "Not specified"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <button
            onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            <span className="material-icons-round text-base">{step === 0 ? "close" : "arrow_back"}</span>
            {step === 0 ? "Cancel" : "Back"}
          </button>

          <div className="flex items-center gap-2">
            {step === 2 && (
              <span className="text-xs text-slate-400">
                Step {step + 1} of {STEPS.length}
              </span>
            )}
            {step < 2 ? (
              <button
                onClick={step === 0 ? handleBasicNext : () => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Next Step
                <span className="material-icons-round text-base">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || photos.length < 3}
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-base">check_circle</span>
                    Submit Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
