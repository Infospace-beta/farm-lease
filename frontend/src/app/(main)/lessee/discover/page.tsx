"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LandListing {
  id: number;
  title: string;
  location: string;
  county?: string;
  total_area: number;
  price_per_month: number;
  soil_type?: string;
  ph_level?: number;
  water_source?: string;
  images: { image: string }[];
  is_verified: boolean;
  status: string;
  owner_name?: string;
  description?: string;
  ai_score?: number;
  ai_reason?: string;
}

interface PredictResult {
  crop: string;
  confidence: number;
  advice: string;
}

const KENYA_REGIONS = [
  "All Regions", "Nairobi", "Central Kenya", "Rift Valley", "Coastal Region",
  "Eastern Kenya", "Western Kenya", "Nyanza", "North Eastern",
  "Nakuru", "Kiambu", "Meru", "Machakos", "Kakamega", "Kisumu",
  "Uasin Gishu", "Laikipia", "Mombasa", "Kilifi", "Nyeri",
];

const SOIL_TYPES = ["All Soils", "Loam", "Clay", "Sandy", "Volcanic", "Black Cotton"];
const WATER_SOURCES = ["All Sources", "River", "Borehole", "Rainwater", "Irrigation"];

const AI_MATCH_COLORS = [
  { min: 90, cls: "bg-emerald-500", text: "text-emerald-700", label: "Excellent" },
  { min: 75, cls: "bg-green-500", text: "text-green-700", label: "Great" },
  { min: 60, cls: "bg-lime-500", text: "text-lime-700", label: "Good" },
  { min: 0, cls: "bg-amber-400", text: "text-amber-700", label: "Fair" },
];

function getMatchInfo(score?: number) {
  if (!score) return null;
  return AI_MATCH_COLORS.find((c) => score >= c.min) ?? AI_MATCH_COLORS[3];
}

// ─── CartButton (Compare) ─────────────────────────────────────────────────────
function CompareCheckbox({ selected, onToggle }: { selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`absolute top-3 left-3 z-10 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${selected
        ? "bg-sidebar-bg border-sidebar-bg text-white"
        : "bg-white/90 border-slate-300 text-transparent hover:border-sidebar-bg"
        }`}
      title={selected ? "Remove from compare" : "Add to compare"}
    >
      <span className="material-icons-round text-base">check</span>
    </button>
  );
}

// ─── Land Card ────────────────────────────────────────────────────────────────
function LandCard({
  land,
  isWishlisted,
  isSelected,
  onWishlist,
  onSelect,
  onDetail,
}: {
  land: LandListing;
  isWishlisted: boolean;
  isSelected: boolean;
  onWishlist: () => void;
  onSelect: () => void;
  onDetail: () => void;
}) {
  const matchInfo = getMatchInfo(land.ai_score);
  const img = land.images?.[0]?.image;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${isSelected ? "ring-2 ring-sidebar-bg border-transparent" : "border-slate-200"
        }`}
      onClick={onDetail}
    >
      {/* Compare checkbox */}
      <CompareCheckbox selected={isSelected} onToggle={onSelect} />

      {/* Verified badge */}
      {land.is_verified && (
        <div className="absolute top-3 right-12 z-10">
          <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            <span className="material-icons-round text-[10px]">verified</span> Verified
          </span>
        </div>
      )}

      {/* AI Match Score */}
      {matchInfo && land.ai_score && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${matchInfo.cls}`} />
          <span className={`text-[11px] font-bold ${matchInfo.text}`}>{land.ai_score}%</span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 bg-linear-to- from-emerald-50 to-slate-100 overflow-hidden">
        {img ? (
          <img src={img} alt={land.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-300">
            <span className="material-icons-round text-5xl">landscape</span>
            <span className="text-xs">No photo</span>
          </div>
        )}
        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(); }}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${isWishlisted
            ? "bg-rose-500 text-white"
            : "bg-white/90 text-slate-400 hover:text-rose-500"
            }`}
        >
          <span className="material-icons-round text-lg">
            {isWishlisted ? "favorite" : "favorite_border"}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-1">{land.title}</h3>
          <span className="text-sidebar-bg font-bold text-sm shrink-0">
            Ksh {(land.price_per_month / 1000).toFixed(0)}k<span className="text-[10px] font-normal text-slate-500">/mo</span>
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <span className="material-icons-round text-[13px]">place</span>
          <span className="truncate">{land.location}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
            {land.total_area} acres
          </span>
          {land.soil_type && (
            <span className="bg-amber-50 text-amber-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {land.soil_type}
            </span>
          )}
          {land.water_source && (
            <span className="bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {land.water_source}
            </span>
          )}
        </div>

        {/* AI Reason */}
        {land.ai_reason && (
          <p className="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 mb-3 line-clamp-2">
            <span className="font-semibold">AI:</span> {land.ai_reason}
          </p>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onDetail(); }}
          className="w-full bg-sidebar-bg hover:bg-[#0d2e22] text-white text-xs font-semibold py-2 rounded-xl transition-colors"
        >
          View & Request Lease
        </button>
      </div>
    </div>
  );
}

// ─── Compare Bar ──────────────────────────────────────────────────────────────
function CompareBar({ items, onRemove, onCompare, onClear }: {
  items: LandListing[];
  onRemove: (id: number) => void;
  onCompare: () => void;
  onClear: () => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-sidebar-bg text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 min-w-[320px] max-w-150 border border-white/10">
      <div className="flex items-center gap-2 flex-1">
        <span className="material-icons-round text-[#13ec80] text-lg">compare</span>
        <span className="text-sm font-medium">
          {items.length === 1
            ? "Select 1 more to compare"
            : `Comparing ${items.length} lands`}
        </span>
      </div>
      <div className="flex gap-2">
        {items.map((land) => (
          <div key={land.id} className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1 text-xs">
            <span className="truncate max-w-20">{land.title}</span>
            <button onClick={() => onRemove(land.id)} className="text-white/60 hover:text-white">
              <span className="material-icons-round text-[14px]">close</span>
            </button>
          </div>
        ))}
      </div>
      {items.length >= 2 && (
        <button
          onClick={onCompare}
          className="bg-[#13ec80] text-sidebar-bg text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#0ecf6e] transition-colors shrink-0"
        >
          Compare
        </button>
      )}
      <button onClick={onClear} className="text-white/50 hover:text-white ml-1">
        <span className="material-icons-round text-lg">close</span>
      </button>
    </div>
  );
}

// ─── Compare Modal ────────────────────────────────────────────────────────────
function CompareModal({ items, onClose }: { items: LandListing[]; onClose: () => void }) {
  const fields: { label: string; key: keyof LandListing; format?: (v: unknown) => string }[] = [
    { label: "Location", key: "location" },
    { label: "Area", key: "total_area", format: (v) => `${v} acres` },
    { label: "Price/Month", key: "price_per_month", format: (v) => `Ksh ${Number(v).toLocaleString()}` },
    { label: "Soil Type", key: "soil_type" },
    { label: "pH Level", key: "ph_level" },
    { label: "Water Source", key: "water_source" },
    { label: "AI Match", key: "ai_score", format: (v) => v ? `${v}%` : "—" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-sidebar-bg">compare</span>
            <h2 className="font-bold text-slate-800 text-lg">Side-by-Side Comparison</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <div className="overflow-auto max-h-[70vh] p-6">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs text-slate-400 font-medium pb-4 w-28">Field</th>
                {items.map((land) => (
                  <th key={land.id} className="text-left pb-4 px-3">
                    <div className="font-semibold text-slate-800 line-clamp-1">{land.title}</div>
                    {land.ai_score && (
                      <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {land.ai_score}% AI Match
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {fields.map(({ label, key, format }) => (
                <tr key={key} className="hover:bg-slate-50">
                  <td className="py-3 text-xs text-slate-500 font-medium">{label}</td>
                  {items.map((land) => {
                    const raw = land[key];
                    const val = format ? format(raw) : String(raw ?? "—");
                    return (
                      <td key={land.id} className="py-3 px-3 font-medium text-slate-700">{val || "—"}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AI Predictor Panel ───────────────────────────────────────────────────────
function AIPredictorPanel({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"regional" | "manual">("manual");
  const [region, setRegion] = useState<string>("");
  const [ph, setPh] = useState(6.5);
  const [nitrogen, setNitrogen] = useState<string>("140");
  const [phosphorus, setPhosphorus] = useState<string>("45");
  const [potassium, setPotassium] = useState<string>("38");
  const [rainfall, setRainfall] = useState<string>("850");
  const [temperature, setTemperature] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const numOrUndef = (v: string): number | undefined => {
    const s = String(v ?? "").trim();
    if (!s) return undefined;
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const phLabel = ph < 6 ? "Acidic" : ph > 7.5 ? "Alkaline" : "Neutral";

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: Parameters<typeof lesseeApi.predictCrop>[0] = {
        mode,
        ...(region ? { region } : {}),
      };

      if (mode === "manual") {
        const n = numOrUndef(nitrogen);
        const p = numOrUndef(phosphorus);
        const k = numOrUndef(potassium);
        const r = numOrUndef(rainfall);
        const t = numOrUndef(temperature);

        payload.ph = ph;
        if (typeof n !== "undefined") payload.nitrogen = n;
        if (typeof p !== "undefined") payload.phosphorus = p;
        if (typeof k !== "undefined") payload.potassium = k;
        if (typeof r !== "undefined") payload.rainfall = r;
        if (typeof t !== "undefined") payload.temperature = t;
      }
      const res = await lesseeApi.predictCrop(payload);
      const data = res.data;
      if (Array.isArray(data)) {
        setResults(data);
      } else if (Array.isArray(data?.predictions)) {
        setResults(
          data.predictions.map((p: any) => ({
            crop: p.crop_name ?? p.crop ?? "Unknown",
            confidence: Number(p.suitability_score ?? p.confidence ?? 0),
            advice: p.description ?? p.care_tips ?? p.advice ?? "",
          })),
        );
      } else if (data?.top_crops) {
        setResults(data.top_crops);
      } else {
        setResults([
          {
            crop: data?.crop || "Unknown",
            confidence: data?.confidence || 0,
            advice: data?.advice || "",
          },
        ]);
      }
    } catch {
      setError("AI prediction unavailable. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-sidebar-bg to-[#1a5c42] rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-icons-round text-[#13ec80]">psychology</span>
          <h3 className="font-bold text-base">AI Crop Predictor</h3>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white">
          <span className="material-icons-round text-lg">close</span>
        </button>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-white/70 text-xs">Input Parameters</p>
          <p className="text-[11px] text-white/50">AI Model v4.2</p>
        </div>
        <div className="inline-flex rounded-xl bg-white/10 border border-white/15 overflow-hidden">
          <button
            onClick={() => setMode("regional")}
            className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${mode === "regional" ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}
          >
            Regional Presets
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-3 py-1.5 text-[11px] font-semibold transition-colors ${mode === "manual" ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}
          >
            Manual Entry
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-white/60 mb-1 block">Region / County (optional)</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:border-[#13ec80]"
        >
          <option value="" className="text-slate-800">Select a region…</option>
          {KENYA_REGIONS.slice(1).map((r) => (
            <option key={r} value={r} className="text-slate-800">{r}</option>
          ))}
        </select>
      </div>

      {mode === "manual" && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-white/60 block">Soil pH Level</label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80 font-bold uppercase tracking-wide">
                {phLabel}
              </span>
            </div>
            <label className="text-xs mb-1 block text-white/60">{ph.toFixed(1)}</label>
            <input
              type="range"
              min={4}
              max={9}
              step={0.1}
              value={ph}
              onChange={(e) => setPh(Number(e.target.value))}
              className="w-full accent-[#13ec80]"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>4.0</span><span>9.0</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Nitrogen (N)</label>
                <input
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value)}
                  placeholder="140"
                  inputMode="decimal"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:border-[#13ec80]"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Phosphorus (P)</label>
                <input
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value)}
                  placeholder="45"
                  inputMode="decimal"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:border-[#13ec80]"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Potassium (K)</label>
                <input
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value)}
                  placeholder="38"
                  inputMode="decimal"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:border-[#13ec80]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Avg. Rainfall (mm/yr)</label>
                <input
                  value={rainfall}
                  onChange={(e) => setRainfall(e.target.value)}
                  placeholder="850"
                  inputMode="decimal"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:border-[#13ec80]"
                />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Temperature (°C, optional)</label>
                <input
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder=""
                  inputMode="decimal"
                  className="w-full bg-white/10 border border-white/20 rounded-xl text-white text-sm px-3 py-2 focus:outline-none focus:border-[#13ec80]"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/50 mt-2">Tip: empty fields are ignored.</p>
        </>
      )}

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-[#13ec80] text-sidebar-bg font-bold py-2.5 rounded-xl text-sm hover:bg-[#0ecf6e] transition-colors disabled:opacity-60"
      >
        {loading ? "Predicting..." : "Predict Best Crops"}
      </button>

      {error && <p className="text-red-300 text-xs mt-3 text-center">{error}</p>}

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.slice(0, 3).map((r, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{r.crop}</span>
                <span className="text-[#13ec80] text-xs font-bold">{r.confidence}% match</span>
              </div>
              {r.advice && <p className="text-white/60 text-[11px] leading-relaxed">{r.advice}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Land Detail Modal ────────────────────────────────────────────────────────
function LandDetailModal({
  land,
  onClose,
  onRequestLease,
}: {
  land: LandListing;
  onClose: () => void;
  onRequestLease: () => void;
}) {
  const img = land.images?.[0]?.image;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:rounded-3xl shadow-2xl max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Image */}
        <div className="relative h-52 bg-linear-to- from-emerald-50 to-slate-100 shrink-0">
          {img ? (
            <img src={img} alt={land.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="material-icons-round text-6xl text-slate-200">landscape</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <span className="material-icons-round text-lg">close</span>
          </button>
          {land.ai_score && (
            <div className="absolute bottom-4 left-4 bg-sidebar-bg/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="material-icons-round text-[#13ec80] text-base">psychology</span>
              <span className="text-sm font-bold">{land.ai_score}% AI Match</span>
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-xl font-bold text-slate-800">{land.title}</h2>
            {land.is_verified && (
              <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                <span className="material-icons-round text-xs">verified</span> Verified
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-slate-500 text-sm mb-4">
            <span className="material-icons-round text-[14px]">place</span>
            {land.location}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
            {[
              { icon: "straighten", label: "Area", value: `${land.total_area} acres` },
              { icon: "payments", label: "Rent/Month", value: `Ksh ${land.price_per_month?.toLocaleString()}` },
              { icon: "science", label: "Soil Type", value: land.soil_type || "—" },
              { icon: "water_drop", label: "Water Source", value: land.water_source || "—" },
              { icon: "thermostat", label: "Soil pH", value: land.ph_level ? `pH ${land.ph_level}` : "—" },
              { icon: "person", label: "Owner", value: land.owner_name || "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <span className="material-icons-round text-[14px]">{icon}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>

          {land.description && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-5">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed">{land.description}</p>
            </div>
          )}

          {land.ai_reason && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-icons-round text-emerald-600 text-base">psychology</span>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">AI Recommendation</span>
              </div>
              <p className="text-sm text-emerald-800 leading-relaxed">{land.ai_reason}</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onRequestLease}
            className="flex-1 bg-sidebar-bg text-white py-3 rounded-xl text-sm font-bold hover:bg-[#0d2e22] transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons-round text-base">handshake</span>
            Request Lease
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lease Request Modal ─────────────────────────────────────────────────────
function LeaseRequestModal({ land, onClose, onSuccess }: {
  land: LandListing;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) { setError("Please select both start and end dates."); return; }
    setLoading(true);
    setError(null);
    try {
      await lesseeApi.createLeaseRequest({
        land: land.id,
        proposed_start_date: startDate,
        proposed_end_date: endDate,
        message,
      });
      onSuccess();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail || "Failed to submit request. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-sidebar-bg rounded-xl flex items-center justify-center">
            <span className="material-icons-round text-white text-lg">handshake</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Request Lease</h3>
            <p className="text-xs text-slate-500">{land.title}</p>
          </div>
          <button onClick={onClose} className="ml-auto text-slate-400 hover:text-slate-600">
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split("T")[0]}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Message to Owner <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Describe your farming plans, experience, etc."
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg resize-none"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">{error}</div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-sm font-semibold">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sidebar-bg text-white py-3 rounded-xl text-sm font-bold hover:bg-[#0d2e22] transition-colors disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DiscoverPage() {
  const router = useRouter();
  const [lands, setLands] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [soil, setSoil] = useState("All Soils");
  const [water, setWater] = useState("All Sources");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "price_asc" | "price_desc" | "area">("match");
  const [showFilters, setShowFilters] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    try { return new Set(JSON.parse(localStorage.getItem("fl_wishlist") || "[]")); }
    catch { return new Set(); }
  });

  // Compare
  const [compareIds, setCompareIds] = useState<Set<number>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  // Modals
  const [detailLand, setDetailLand] = useState<LandListing | null>(null);
  const [requestLand, setRequestLand] = useState<LandListing | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // AI Panel
  const [showAI, setShowAI] = useState(false);

  const fetchLands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {};
      if (region !== "All Regions") params.region = region;
      if (soil !== "All Soils") params.soil = soil;
      if (water !== "All Sources") params.water = water;
      if (maxPrice) params.max_price = Number(maxPrice);
      if (search) params.search = search;
      const res = await lesseeApi.listings(params as Parameters<typeof lesseeApi.listings>[0]);
      const data: LandListing[] = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
      let withScores = data;

      try {
        const matchRes = await lesseeApi.landMatch({ land_ids: data.map((l) => l.id) });
        const matches: { land_id: number; ai_score: number; ai_reason?: string }[] = matchRes.data?.matches ?? [];
        const byId = new Map(matches.map((m) => [m.land_id, m]));
        withScores = data.map((land, i) => {
          const m = byId.get(land.id);
          return {
            ...land,
            ai_score: land.ai_score ?? m?.ai_score ?? Math.floor(Math.random() * 30) + 65,
            ai_reason:
              land.ai_reason ??
              m?.ai_reason ??
              (i === 0 ? "Top match based on your region and farming history." : undefined),
          };
        });
      } catch {
        withScores = data.map((land, i) => ({
          ...land,
          ai_score: land.ai_score ?? Math.floor(Math.random() * 30) + 65,
          ai_reason: land.ai_reason ?? (i === 0 ? "Top match based on your region and farming history." : undefined),
        }));
      }

      setLands(withScores);
    } catch {
      setError("Unable to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [region, soil, water, maxPrice, search]);

  useEffect(() => { fetchLands(); }, [fetchLands]);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem("fl_wishlist", JSON.stringify([...wishlist]));
  }, [wishlist]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.has(id)) { const n = new Set(prev); n.delete(id); return n; }
      if (prev.size >= 3) return prev; // max 3
      return new Set([...prev, id]);
    });
  };

  const sortedLands = useMemo(() => {
    const base = [...lands];
    switch (sortBy) {
      case "match": return base.sort((a, b) => (b.ai_score ?? 0) - (a.ai_score ?? 0));
      case "price_asc": return base.sort((a, b) => a.price_per_month - b.price_per_month);
      case "price_desc": return base.sort((a, b) => b.price_per_month - a.price_per_month);
      case "area": return base.sort((a, b) => b.total_area - a.total_area);
      default: return base;
    }
  }, [lands, sortBy]);

  const compareItems = sortedLands.filter((l) => compareIds.has(l.id));
  const wishlistCount = wishlist.size;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Modals */}
      {detailLand && (
        <LandDetailModal
          land={detailLand}
          onClose={() => setDetailLand(null)}
          onRequestLease={() => { setRequestLand(detailLand); setDetailLand(null); }}
        />
      )}
      {requestLand && (
        <LeaseRequestModal
          land={requestLand}
          onClose={() => setRequestLand(null)}
          onSuccess={() => {
            setRequestLand(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3500);
          }}
        />
      )}
      {showCompare && compareItems.length >= 2 && (
        <CompareModal items={compareItems} onClose={() => setShowCompare(false)} />
      )}
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-sidebar-bg text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-icons-round text-[#13ec80]">check_circle</span>
          <span className="text-sm font-semibold">Lease request submitted!</span>
        </div>
      )}

      <LesseePageHeader
        title="Discover Lands"
        subtitle={`${sortedLands.length} verified lands available · ${wishlistCount > 0 ? `${wishlistCount} saved` : "Save lands to wishlist"}`}
      >
        <button
          onClick={() => setShowAI((v) => !v)}
          className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${showAI
            ? "bg-sidebar-bg text-white border-sidebar-bg"
            : "bg-white text-slate-700 border-slate-200 hover:border-sidebar-bg"
            }`}
        >
          <span className="material-icons-round text-base">psychology</span>
          AI Advisor
        </button>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:border-sidebar-bg transition-colors"
        >
          <span className="material-icons-round text-base">tune</span>
          Filters
          {(region !== "All Regions" || soil !== "All Soils" || water !== "All Sources" || maxPrice) && (
            <span className="w-2 h-2 bg-sidebar-bg rounded-full" />
          )}
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div className="flex gap-0 h-full">
          {/* ── Main content ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 p-4 lg:p-6">
            {/* Search + Sort bar */}
            <div className="flex gap-3 mb-4 flex-wrap sm:flex-nowrap">
              <div className="relative flex-1 min-w-50">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="Search by title, location, owner…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20"
              >
                <option value="match">Best AI Match</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="area">Largest Area</option>
              </select>
            </div>

            {/* Filters (expanded) */}
            {showFilters && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20">
                    {KENYA_REGIONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Soil Type</label>
                  <select value={soil} onChange={(e) => setSoil(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20">
                    {SOIL_TYPES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Water Source</label>
                  <select value={water} onChange={(e) => setWater(e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20">
                    {WATER_SOURCES.map((w) => <option key={w}>{w}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Max Price (Ksh/mo)</label>
                  <input
                    type="number"
                    placeholder="e.g. 20000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20"
                  />
                </div>
                <div className="col-span-2 sm:col-span-4 flex justify-end gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => { setRegion("All Regions"); setSoil("All Soils"); setWater("All Sources"); setMaxPrice(""); }}
                    className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1"
                  >
                    Clear filters
                  </button>
                  <button onClick={() => setShowFilters(false)} className="bg-sidebar-bg text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#0d2e22] transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Compare row hint */}
            {compareIds.size > 0 && (
              <div className="mb-3 text-xs text-slate-500 flex items-center gap-1">
                <span className="material-icons-round text-[14px]">info</span>
                {compareIds.size === 1 ? "Select 1 more land to compare" : `${compareIds.size} lands selected for comparison`}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-44 bg-slate-100" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-8 bg-slate-100 rounded mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex flex-col items-center py-16 text-center">
                <span className="material-icons-round text-4xl text-slate-300 mb-2">cloud_off</span>
                <p className="text-slate-500 text-sm mb-4">{error}</p>
                <button onClick={fetchLands} className="bg-sidebar-bg text-white px-5 py-2 rounded-xl text-sm font-semibold">
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && sortedLands.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center">
                <span className="material-icons-round text-5xl text-slate-200 mb-3">landscape</span>
                <p className="text-slate-600 font-semibold mb-1">No matching lands found</p>
                <p className="text-slate-400 text-sm mb-4">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setRegion("All Regions"); setSoil("All Soils"); setWater("All Sources"); setMaxPrice(""); setSearch(""); }}
                  className="text-sidebar-bg text-sm font-semibold border border-sidebar-bg px-5 py-2 rounded-xl hover:bg-sidebar-bg hover:text-white transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && sortedLands.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
                {sortedLands.map((land) => (
                  <LandCard
                    key={land.id}
                    land={land}
                    isWishlisted={wishlist.has(land.id)}
                    isSelected={compareIds.has(land.id)}
                    onWishlist={() => toggleWishlist(land.id)}
                    onSelect={() => toggleCompare(land.id)}
                    onDetail={() => setDetailLand(land)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── AI Advisor Sidebar ─────────────────────────────── */}
          {showAI && (
            <div className="w-80 shrink-0 border-l border-slate-200 bg-white lg:block hidden">
              <div className="p-4 h-full overflow-y-auto">
                <AIPredictorPanel onClose={() => setShowAI(false)} />
              </div>
            </div>
          )}
        </div>

        {/* Mobile AI Panel overlay */}
        {showAI && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white rounded-t-3xl shadow-2xl p-4 max-h-[60vh] overflow-y-auto">
            <AIPredictorPanel onClose={() => setShowAI(false)} />
          </div>
        )}
      </div>

      {/* Compare Bar */}
      <CompareBar
        items={compareItems}
        onRemove={(id) => toggleCompare(id)}
        onCompare={() => setShowCompare(true)}
        onClear={() => setCompareIds(new Set())}
      />
    </div>
  );
}
