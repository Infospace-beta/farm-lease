"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { landsApi } from "@/lib/services/api";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(
  () => import("@/components/shared/LocationPicker"),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">
              location_on
            </span>
            Location
          </h4>
        </div>
        <p className="text-xs text-slate-500">
          Pinpoint your land's location. This helps us suggest suitable crops.
        </p>
        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm h-64 bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-xs text-slate-500 mt-2">Loading map...</p>
          </div>
        </div>
      </div>
    )
  }
);

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
    latitude: "-1.2921",
    longitude: "36.8219",
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left: Property Details */}
              <div className="lg:col-span-2 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8 space-y-5 md:space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    info
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-slate-800">
                    Property Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="sm:col-span-2">
                    <label className={LABEL}>
                      Plot Title / Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={INPUT}
                      placeholder="e.g. North Valley Acreage"
                      value={basic.title}
                      onChange={(e) =>
                        setBasic({ ...basic, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>
                      Total Area (Acres) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        className={INPUT + " pr-16"}
                        placeholder="0.0"
                        value={basic.total_area}
                        onChange={(e) =>
                          setBasic({ ...basic, total_area: e.target.value })
                        }
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-semibold">
                        Acres
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Description</label>
                    <textarea
                      rows={4}
                      className={INPUT + " resize-none"}
                      placeholder="Describe the terrain, access to water, previous crops grown, etc."
                      value={basic.description}
                      onChange={(e) =>
                        setBasic({ ...basic, description: e.target.value })
                      }
                    />
                    <div className="mt-1 flex justify-end">
                      <span className="text-xs text-slate-400">
                        {basic.description.length}/500 characters
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>
                      Desired Lease Price (Monthly){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">
                        Ksh
                      </span>
                      <input
                        type="number"
                        min="0"
                        className={INPUT + " pl-12"}
                        placeholder="0.00"
                        value={basic.price_per_month}
                        onChange={(e) =>
                          setBasic({ ...basic, price_per_month: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>
                      Preferred Duration
                    </label>
                    <select
                      className={INPUT}
                      value={basic.preferred_duration}
                      onChange={(e) =>
                        setBasic({ ...basic, preferred_duration: e.target.value })
                      }
                    >
                      <option value="">Select duration</option>
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
                </div>

                {/* Amenities & Features */}
                <div>
                  <label className={LABEL}>Amenities & Features</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                    {(
                      [
                        {
                          key: "has_irrigation",
                          label: "Irrigation System",
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
                          icon: "add_road",
                        },
                        { 
                          key: "has_fencing", 
                          label: "Fencing", 
                          icon: "fence" 
                        },
                      ] as { key: keyof BasicForm; label: string; icon: string }[]
                    ).map(({ key, label, icon }) => {
                      const val = basic[key] as boolean;
                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-xs font-semibold cursor-pointer transition-all ${
                            val
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={val}
                            onChange={(e) =>
                              setBasic({ ...basic, [key]: e.target.checked })
                            }
                            className="sr-only"
                          />
                          <span className="material-symbols-outlined text-base">
                            {val ? "check_box" : "check_box_outline_blank"}
                          </span>
                          <span className="hidden sm:inline">{label}</span>
                          <span className="sm:hidden">{label.split(" ")[0]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Title Deed - placed here but styled prominently */}
                <div className="rounded-lg border-2 border-amber-200 bg-amber-50/50 p-4">
                  <label className={LABEL + " text-amber-700"}>
                    Title Deed Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={
                      INPUT +
                      " border-amber-300 focus:border-amber-500 focus:ring-amber-500" +
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
                  <p className="mt-1.5 text-xs text-amber-700 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-sm mt-0.5">
                      lock
                    </span>
                    <span>
                      Required for admin verification only. Never shown to lessees.
                    </span>
                  </p>
                </div>
              </div>

              {/* Right: Location */}
              <div className="lg:col-span-1 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8">
                <LocationPicker
                  latitude={basic.latitude}
                  longitude={basic.longitude}
                  onLocationChange={(lat, lng) =>
                    setBasic({ ...basic, latitude: lat, longitude: lng })
                  }
                />
              </div>

              {/* Navigation - full width at bottom */}
              <div className="lg:col-span-3 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm px-5 md:px-8 py-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleBasicSubmit}
                    disabled={loading}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl min-w-35 md:min-w-40"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block h-4 w-4 md:h-5 md:w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Next Step</span>
                        <span className="material-symbols-outlined text-xl md:text-2xl">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 1: Soil & Climate ─────────────────── */}
          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left: Soil Properties */}
              <div className="lg:col-span-2 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8 space-y-5 md:space-y-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    compost
                  </span>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-800">
                      Soil Properties
                    </h3>
                    <p className="text-xs text-slate-500">Optional</p>
                  </div>
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

                {/* pH Level Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Soil pH Level
                    </label>
                    <span className="text-sm font-bold text-primary">
                      {soil.ph_level || "6.5"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.1"
                    value={soil.ph_level || "6.5"}
                    onChange={(e) =>
                      setSoil({ ...soil, ph_level: e.target.value })
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Acidic (0)</span>
                    <span>Neutral (7)</span>
                    <span>Alkaline (14)</span>
                  </div>
                </div>

                {/* NPK Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(
                    [
                      {
                        key: "nitrogen",
                        label: "Nitrogen (N)",
                        placeholder: "0",
                        unit: "mg/kg",
                      },
                      {
                        key: "phosphorus",
                        label: "Phosphorus (P)",
                        placeholder: "0",
                        unit: "mg/kg",
                      },
                      {
                        key: "potassium",
                        label: "Potassium (K)",
                        placeholder: "0",
                        unit: "mg/kg",
                      },
                    ] as {
                      key: keyof SoilForm;
                      label: string;
                      placeholder: string;
                      unit: string;
                    }[]
                  ).map(({ key, label, placeholder, unit }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {label}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          className={INPUT + " pr-16"}
                          placeholder={placeholder}
                          value={soil[key]}
                          onChange={(e) =>
                            setSoil({ ...soil, [key]: e.target.value })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
                          {unit}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 italic">
                        Optional
                      </p>
                    </div>
                  ))}
                </div>

                {/* Moisture Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-700">
                      Soil Moisture Content
                    </label>
                    <span className="text-sm font-bold text-primary">
                      {soil.moisture || "40"}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={soil.moisture || "40"}
                    onChange={(e) =>
                      setSoil({ ...soil, moisture: e.target.value })
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Dry (0%)</span>
                    <span>Saturated (100%)</span>
                  </div>
                </div>

                {/* Climate Data */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary text-xl">
                      cloud
                    </span>
                    <h4 className="text-sm font-bold text-slate-800">
                      Climate Data
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Avg. Annual Temperature
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">
                          device_thermostat
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          className={INPUT + " pl-10 pr-12"}
                          placeholder="24"
                          value={soil.temperature}
                          onChange={(e) =>
                            setSoil({ ...soil, temperature: e.target.value })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
                          °C
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Avg. Annual Rainfall
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">
                          rainy
                        </span>
                        <input
                          type="number"
                          step="1"
                          min="0"
                          className={INPUT + " pl-10 pr-12"}
                          placeholder="800"
                          value={soil.rainfall}
                          onChange={(e) =>
                            setSoil({ ...soil, rainfall: e.target.value })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">
                          mm
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: AI Crop Prediction Info */}
              <div className="lg:col-span-1 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    analytics
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">
                    AI Crop Prediction
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  This data is crucial for <span className="font-semibold text-primary">Gemini</span> to
                  analyze and predict the most viable crops for your land.
                  Accurate soil and climate data can increase lease value by up
                  to <span className="font-bold text-green-600">25%</span>.
                </p>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-lg mt-0.5">
                      lightbulb
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-amber-800">
                        No soil data? No problem.
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        The AI can provide general recommendations based solely
                        on regional climate data, though less precise than with
                        full soil analysis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-green-500 text-sm">
                      check_circle
                    </span>
                    <span className="text-slate-600">Soil pH Impact</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">
                    Determines nutrient availability.
                  </p>

                  <div className="flex items-center gap-2 text-xs mt-3">
                    <span className="material-symbols-outlined text-green-500 text-sm">
                      check_circle
                    </span>
                    <span className="text-slate-600">NPK Balance</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-6">
                    Key for fertilizer recommendations.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-400 italic">
                  Powered by Gemini AI
                </div>
              </div>

              {/* Navigation - full width at bottom */}
              <div className="lg:col-span-3 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm px-5 md:px-8 py-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setStep(0)}
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      arrow_back
                    </span>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleSoilSubmit}
                    disabled={loading}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl min-w-35 md:min-w-40"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block h-4 w-4 md:h-5 md:w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Next: Photos</span>
                        <span className="material-symbols-outlined text-xl md:text-2xl">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Photos ────────────────────────── */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left: Photo Gallery */}
              <div className="lg:col-span-2 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-8 space-y-5 md:space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">
                      add_photo_alternate
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-slate-800">
                      Photo Gallery
                    </h3>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Required
                  </span>
                </div>

                {/* Upload Area */}
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-primary hover:bg-slate-50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => setPhotos(e.target.files)}
                  />
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-full bg-slate-100 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      <span className="material-symbols-outlined text-4xl">
                        cloud_upload
                      </span>
                    </div>
                    <div>
                      <p className="text-base font-medium text-slate-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        SVG, PNG, JPG or GIF (max. 800×400px)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span>Minimum 3 photos required for verification.</span>
                </div>

                {/* Uploaded Photos Preview */}
                {photos && photos.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Uploaded Photos ({photos.length})
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {Array.from(photos).map((f, i) => (
                        <div
                          key={i}
                          className="group relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                          style={{ aspectRatio: '4/3' }}
                        >
                          <img
                            src={URL.createObjectURL(f)}
                            alt={`Upload ${i + 1}`}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded text-white transition-colors"
                              title="View"
                            >
                              <span className="material-symbols-outlined text-lg">
                                visibility
                              </span>
                            </button>
                            <button
                              type="button"
                              className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded text-white transition-colors"
                              title="Remove"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </div>
                          {i === 0 && (
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                              Cover
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Photo Guidelines */}
              <div className="lg:col-span-1 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm p-5 md:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    photo_camera
                  </span>
                  <h4 className="text-sm font-bold text-slate-800">
                    Photo Guidelines
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Wide Angles:
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Capture the full extent of the plot including boundaries.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Soil Quality:
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Include close-ups of the soil to show texture and color.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-green-500 text-lg mt-0.5">
                      check_circle
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Water Sources:
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Show any nearby rivers, wells, or irrigation
                        infrastructure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-500 text-lg mt-0.5">
                      cancel
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        Avoid blurry or dark photos
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        taken at night.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">
                    WHY PHOTOS MATTER
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Listings with at least 5 high-quality photos get{" "}
                    <span className="font-bold text-primary">3x more inquiries</span>{" "}
                    from serious tenants.
                  </p>
                </div>
              </div>

              {/* Verification Notice - full width */}
              <div className="lg:col-span-3 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-4">
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

              {/* Navigation - full width at bottom */}
              <div className="lg:col-span-3 rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm px-5 md:px-8 py-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => setStep(1)}
                    type="button"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      arrow_back
                    </span>
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handlePhotosSubmit}
                    disabled={loading}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 md:gap-3 rounded-lg bg-green-600 px-6 md:px-8 py-3 md:py-3.5 text-sm md:text-base font-bold text-white hover:bg-green-700 disabled:opacity-60 transition-all shadow-lg hover:shadow-xl min-w-35 md:min-w-40"
                  >
                    {loading ? (
                      <>
                        <span className="inline-block h-4 w-4 md:h-5 md:w-5 animate-spin rounded-full border-2 border-white border-r-transparent" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Listing</span>
                        <span className="material-symbols-outlined text-xl md:text-2xl">
                          check_circle
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
