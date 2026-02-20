"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { landsApi } from "@/lib/services/api";

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
const LABEL = "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

export default function UploadLandPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [landId, setLandId] = useState<number | null>(null);
  const [photos, setPhotos] = useState<FileList | null>(null);

  const [basic, setBasic] = useState<BasicForm>({
    title: "", description: "", total_area: "", price_per_month: "",
    preferred_duration: "1 Year", title_deed_number: "",
    latitude: "", longitude: "",
    has_irrigation: false, has_electricity: false,
    has_road_access: false, has_fencing: false,
  });

  const [soil, setSoil] = useState<SoilForm>({
    ph_level: "", nitrogen: "", phosphorus: "", potassium: "",
    moisture: "", temperature: "", rainfall: "",
  });

  /* ── Handlers ───────────────────────────────────────── */
  const handleBasicSubmit = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await landsApi.createBasic(basic);
      setLandId(data.land_id);
      setStep(1);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? "Failed to save basic info. Check your inputs.");
    } finally { setLoading(false); }
  };

  const handleSoilSubmit = async () => {
    if (!landId) return;
    setLoading(true); setError(null);
    try {
      await landsApi.addSoil(landId, soil);
      setStep(2);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? "Failed to save soil data.");
    } finally { setLoading(false); }
  };

  const handlePhotosSubmit = async () => {
    if (!landId) return;
    setLoading(true); setError(null);
    try {
      if (photos && photos.length > 0) {
        const fd = new FormData();
        Array.from(photos).forEach((f) => fd.append("images", f));
        await landsApi.uploadPhotos(landId, fd);
      }
      router.push("/owner/lands");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg ?? "Failed to upload photos.");
    } finally { setLoading(false); }
  };

  /* ── UI ─────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <div className="mb-6">
            <h2
              className="text-3xl font-bold tracking-tight text-earth"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              List New Land
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Upload your land details, soil data and photos to start receiving lease requests.
            </p>
          </div>

          {/* Step indicator */}
          <div className="mb-6 flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    i < step
                      ? "bg-primary text-white"
                      : i === step
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {i < step ? (
                    <span className="material-symbols-outlined text-lg">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`mt-1.5 text-xs font-medium ${i <= step ? "text-primary" : "text-slate-400"}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 mb-5 ${i < step ? "bg-primary" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ── STEP 0: Basic Info ─────────────────────── */}
        {step === 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className={LABEL}>Plot Title *</label>
                <input className={INPUT} placeholder="e.g. Highland North Plot" value={basic.title}
                  onChange={(e) => setBasic({ ...basic, title: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Description *</label>
                <textarea rows={3} className={INPUT + " resize-none"} placeholder="Describe the land..." value={basic.description}
                  onChange={(e) => setBasic({ ...basic, description: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Total Area (Acres) *</label>
                <input type="number" min="0" step="0.1" className={INPUT} placeholder="e.g. 3.5" value={basic.total_area}
                  onChange={(e) => setBasic({ ...basic, total_area: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Price / Month (Ksh) *</label>
                <input type="number" min="0" className={INPUT} placeholder="e.g. 50000" value={basic.price_per_month}
                  onChange={(e) => setBasic({ ...basic, price_per_month: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Preferred Lease Duration *</label>
                <select className={INPUT} value={basic.preferred_duration}
                  onChange={(e) => setBasic({ ...basic, preferred_duration: e.target.value })}>
                  {["6 Months","1 Year","2 Years","3 Years","5 Years","Flexible"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Title Deed Number</label>
                <input className={INPUT} placeholder="For admin verification" value={basic.title_deed_number}
                  onChange={(e) => setBasic({ ...basic, title_deed_number: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Latitude *</label>
                <input type="number" step="0.000001" className={INPUT} placeholder="-1.286389" value={basic.latitude}
                  onChange={(e) => setBasic({ ...basic, latitude: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Longitude *</label>
                <input type="number" step="0.000001" className={INPUT} placeholder="36.817223" value={basic.longitude}
                  onChange={(e) => setBasic({ ...basic, longitude: e.target.value })} />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className={LABEL}>Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { key: "has_irrigation",  label: "Irrigation",   icon: "water_drop" },
                    { key: "has_electricity", label: "Electricity",  icon: "bolt" },
                    { key: "has_road_access", label: "Road Access",  icon: "road" },
                    { key: "has_fencing",     label: "Fencing",      icon: "fence" },
                  ] as { key: keyof BasicForm; label: string; icon: string }[]
                ).map(({ key, label, icon }) => {
                  const val = basic[key] as boolean;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBasic({ ...basic, [key]: !val })}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-xs font-semibold transition-all ${
                        val
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">{icon}</span>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleBasicSubmit}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 transition-all"
              >
                {loading ? "Saving..." : "Continue"}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Soil & Climate ─────────────────── */}
        {step === 1 && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Soil & Climate Data</h3>
            <p className="text-sm text-slate-500">
              Fill in available soil test data. This helps lessees assess the land's suitability.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(
                [
                  { key: "ph_level",    label: "Soil pH Level",      placeholder: "6.5",   unit: "pH" },
                  { key: "nitrogen",    label: "Nitrogen (N)",         placeholder: "200",   unit: "ppm" },
                  { key: "phosphorus",  label: "Phosphorus (P)",       placeholder: "50",    unit: "ppm" },
                  { key: "potassium",   label: "Potassium (K)",        placeholder: "150",   unit: "ppm" },
                  { key: "moisture",    label: "Soil Moisture",        placeholder: "45",    unit: "%" },
                  { key: "temperature", label: "Avg Temperature",      placeholder: "24",    unit: "°C" },
                  { key: "rainfall",    label: "Annual Rainfall",      placeholder: "800",   unit: "mm" },
                ] as { key: keyof SoilForm; label: string; placeholder: string; unit: string }[]
              ).map(({ key, label, placeholder, unit }) => (
                <div key={key}>
                  <label className={LABEL}>{label}</label>
                  <div className="relative">
                    <input
                      type="number" step="0.1" min="0"
                      className={INPUT + " pr-12"}
                      placeholder={placeholder}
                      value={soil[key]}
                      onChange={(e) => setSoil({ ...soil, [key]: e.target.value })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(0)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back
              </button>
              <button onClick={handleSoilSubmit} disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 transition-all">
                {loading ? "Saving..." : "Continue"}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Photos ────────────────────────── */}
        {step === 2 && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Upload Photos</h3>
            <p className="text-sm text-slate-500">
              Add up to 10 photos of your land. High-quality images attract more lessees.
            </p>

            <label className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-10 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 10 MB each</p>
              </div>
              <input type="file" multiple accept="image/*" className="hidden"
                onChange={(e) => setPhotos(e.target.files)} />
            </label>

            {photos && photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Array.from(photos).map((f, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                    <img src={URL.createObjectURL(f)} alt="" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Confirmation card */}
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">task_alt</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">Ready to submit</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your listing will be reviewed by the FarmLease team before going live.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back
              </button>
              <button onClick={handlePhotosSubmit} disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 transition-all shadow-lg shadow-primary/30">
                {loading ? "Submitting..." : "Submit Listing"}
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
    </div>
  );
}
