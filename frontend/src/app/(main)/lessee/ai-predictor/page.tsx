"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

const PREDICTOR_AREAS = [
  // Broad regions
  "Rift Valley", "Central Kenya", "Eastern Kenya", "Western Kenya", "Nyanza",
  "Coastal Region", "North Eastern",
  // Counties
  "Nakuru", "Narok", "Nyeri", "Meru", "Kiambu", "Kisumu", "Uasin Gishu",
  "Trans-Nzoia", "Nandi", "Kericho", "Bomet", "Murang'a", "Kirinyaga",
  "Embu", "Tharaka-Nithi", "Kitui", "Machakos", "Makueni", "Kajiado",
  "Kakamega", "Bungoma", "Busia", "Siaya", "Homa Bay", "Migori",
  "Kisii", "Nyamira", "Kwale", "Kilifi", "Mombasa", "Laikipia",
  "Nyandarua", "Elgeyo-Marakwet", "Baringo", "Turkana", "West Pokot",
  "Isiolo", "Marsabit", "Wajir", "Mandera", "Garissa", "Taita-Taveta",
  "Tana River", "Lamu", "Samburu", "Vihiga",
  // Sub-counties / towns
  "Eldoret", "Thika", "Nanyuki", "Naivasha", "Nakuru Town", "Kitale",
  "Malindi", "Mtwapa", "Voi", "Wundanyi",
];

interface CropRecommendation {
  crop_name: string;
  suitability_score: number;
  predicted_yield: string;
  estimated_revenue: string;
  description: string;
  care_tips: string;
}

export default function AIPredictorPage() {
  const [showRegional, setShowRegional] = useState(true);
  const [showManual, setShowManual] = useState(true);

  // Regional preset dropdown
  const [regionInput, setRegionInput] = useState("");
  const [showRegionDrop, setShowRegionDrop] = useState(false);
  const regionDropRef = useRef<HTMLDivElement>(null);

  // Manual entry slider values
  const [ph, setPh] = useState(0);
  const [nitrogen, setNitrogen] = useState(0);
  const [phosphorus, setPhosphorus] = useState(0);
  const [potassium, setPotassium] = useState(0);
  const [rainfall, setRainfall] = useState(0);

  // API state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<CropRecommendation[]>([]);
  const [hasPredicted, setHasPredicted] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (regionDropRef.current && !regionDropRef.current.contains(e.target as Node)) {
        setShowRegionDrop(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAreas = PREDICTOR_AREAS.filter((a) =>
    a.toLowerCase().includes(regionInput.toLowerCase())
  ).slice(0, 8);

  const handleGetRecommendation = async () => {
    // Validate that at least some data is provided
    if (!regionInput && ph === 0 && nitrogen === 0 && phosphorus === 0 && potassium === 0 && rainfall === 0) {
      setError("Please provide at least one parameter (region or soil data) to get recommendations.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await lesseeApi.predictCrop({
        region: regionInput || undefined,
        ph: ph > 0 ? ph : undefined,
        nitrogen: nitrogen > 0 ? nitrogen : undefined,
        phosphorus: phosphorus > 0 ? phosphorus : undefined,
        potassium: potassium > 0 ? potassium : undefined,
        rainfall: rainfall > 0 ? rainfall : undefined,
      });

      if (response.data.success && response.data.predictions) {
        setPredictions(response.data.predictions);
        setHasPredicted(true);
        setError(null);
      } else {
        setError("No predictions returned. Please try again with different parameters.");
      }
    } catch (err: any) {
      console.error("AI Prediction Error:", err);
      console.error("Error details:", err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.details) {
        setError(err.response.data.details);
      } else if (err.response?.status === 503) {
        setError("AI service is not configured. Please contact support.");
      } else if (err.response?.status === 429) {
        setError("Too many requests. Please wait a moment and try again.");
      } else {
        setError("Failed to get predictions. Please check the browser console for details.");
      }
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="AI Crop Predictor"
        subtitle="Leverage advanced machine learning to predict optimal crops based on soil composition, regional climate data, and historical yields."
      >
        <div className="flex bg-gray-100 rounded-lg border border-gray-200 p-1 shadow-sm">
          <button className="px-4 py-2 bg-[#0f392b] text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm">
            Predictor
          </button>
          <Link
            href="/lessee/ai-predictor/history"
            className="px-4 py-2 text-gray-500 hover:bg-white rounded text-xs font-bold uppercase tracking-wide transition-colors"
          >
            History
          </Link>
        </div>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto pb-8">
          {/* Left Panel - Input Parameters */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="font-bold text-xl text-[#5D4037]"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Input Parameters
                </h3>
                <span className="bg-green-50 text-[#0f392b] text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                  AI Model v4.2
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                Both sections are optional — use <span className="font-semibold text-gray-500">Regional Presets</span>,{" "}
                <span className="font-semibold text-gray-500">Manual Entry</span>, or{" "}
                <span className="font-semibold text-[#047857]">both together</span> for the most accurate prediction.
              </p>

              {/* ── Regional Presets section ──────────────── */}
              <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
                <button
                  onClick={() => setShowRegional((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-emerald-50 transition-colors group"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-[#0f392b]">
                    <span className="material-icons-round text-[#13ec80] text-base">public</span>
                    Regional Presets
                  </span>
                  <span className={`material-icons-round text-gray-400 text-xl transition-transform duration-200 ${showRegional ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {showRegional && (
                  <div className="p-5 space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Select Region
                      </label>
                      <div className="relative" ref={regionDropRef}>
                        <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                          search
                        </span>
                        <input
                          type="text"
                          value={regionInput}
                          onChange={(e) => {
                            setRegionInput(e.target.value);
                            setShowRegionDrop(true);
                          }}
                          onFocus={() => setShowRegionDrop(true)}
                          placeholder="Search region (e.g. Nakuru, Trans-Nzoia)..."
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:border-[#0f392b] focus:ring-1 focus:ring-[#0f392b]/20 text-sm"
                        />
                        {showRegionDrop && filteredAreas.length > 0 && (
                          <ul className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {filteredAreas.map((area) => (
                              <li key={area}>
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setRegionInput(area);
                                    setShowRegionDrop(false);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 hover:text-[#0f392b] transition-colors flex items-center gap-2"
                                >
                                  <span className="material-icons-round text-gray-300 text-sm">location_on</span>
                                  {area}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {regionInput && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 bg-[#0f392b] text-emerald-100 px-3 py-1 rounded-full text-xs font-medium">
                            <span className="material-icons-round text-[10px] text-[#13ec80]">location_on</span>
                            {regionInput}
                            <button
                              type="button"
                              onClick={() => setRegionInput("")}
                              className="ml-1 text-emerald-300 hover:text-white transition-colors"
                            >
                              <span className="material-icons-round text-xs">close</span>
                            </button>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">Or</span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>
                    <button className="w-full py-2.5 bg-white border border-gray-200 text-[#0f392b] hover:bg-green-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm">
                      <span className="material-icons-round text-[#13ec80] text-lg">my_location</span>
                      Detect My Location
                    </button>
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex gap-3">
                        <span className="material-icons-round text-blue-500 text-base mt-0.5">info</span>
                        <p className="text-xs text-blue-600 leading-relaxed">
                          Uses aggregated satellite data &amp; government soil surveys. Accuracy ~85%.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Section divider ───────────────────────── */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white px-2 py-0.5 rounded-full border border-gray-200">
                  combine with
                </span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* ── Manual Entry section ──────────────────── */}
              <div className="border border-gray-100 rounded-xl overflow-hidden mt-3 mb-6">
                <button
                  onClick={() => setShowManual((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-emerald-50 transition-colors group"
                >
                  <span className="flex items-center gap-2 text-sm font-bold text-[#0f392b]">
                    <span className="material-icons-round text-amber-500 text-base">edit_note</span>
                    Manual Entry
                  </span>
                  <span className={`material-icons-round text-gray-400 text-xl transition-transform duration-200 ${showManual ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>
                {showManual && (
                  <div className="p-5 space-y-5">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-gray-700">Soil pH Level</label>
                        <span className="text-2xl font-bold text-[#0f392b]">{ph.toFixed(1)}</span>
                      </div>
                      <input
                        type="range" min="0" max="14" step="0.1"
                        value={ph}
                        onChange={(e) => setPh(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        <span>Acidic</span><span>Neutral</span><span>Alkaline</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-gray-700">Nitrogen (N) Content</label>
                        <span className="text-lg font-bold text-[#0f392b]">
                          {nitrogen} <span className="text-xs text-gray-400 font-normal">mg/kg</span>
                        </span>
                      </div>
                      <input
                        type="range" min="0" max="300"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-xs font-bold text-gray-700">Phosphorus (P)</label>
                          <span className="text-sm font-bold text-[#0f392b]">{phosphorus}</span>
                        </div>
                        <input
                          type="range" min="0" max="100"
                          value={phosphorus}
                          onChange={(e) => setPhosphorus(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-xs font-bold text-gray-700">Potassium (K)</label>
                          <span className="text-sm font-bold text-[#0f392b]">{potassium}</span>
                        </div>
                        <input
                          type="range" min="0" max="100"
                          value={potassium}
                          onChange={(e) => setPotassium(Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                        />
                      </div>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <div className="flex justify-between items-end mb-2 mt-3">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <span className="material-icons-round text-blue-400 text-sm">water_drop</span>
                          Avg. Rainfall
                        </label>
                        <span className="text-lg font-bold text-[#0f392b]">
                          {rainfall} <span className="text-xs text-gray-400 font-normal">mm/yr</span>
                        </span>
                      </div>
                      <input
                        type="range" min="0" max="2000"
                        value={rainfall}
                        onChange={(e) => setRainfall(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── Single CTA ────────────────────────────── */}
              <button 
                onClick={handleGetRecommendation}
                disabled={loading}
                className="w-full py-4 bg-[#0f392b] text-white rounded-full font-bold shadow-lg hover:bg-[#0a261c] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group"
              >
                {loading ? (
                  <>
                    <span className="material-icons-round animate-spin">refresh</span>
                    AI is analyzing... (may take 30-60 seconds)
                  </>
                ) : (
                  <>
                    <span className="material-icons-round text-[#13ec80] group-hover:animate-pulse">auto_awesome</span>
                    Get AI Recommendation
                  </>
                )}
              </button>

              {/* Info Message */}
              {!loading && !hasPredicted && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex gap-2">
                    <span className="material-icons-round text-blue-500 text-sm">info</span>
                    <p className="text-xs text-blue-600">
                      AI analysis may take 30-60 seconds. Please be patient while our AI processes your data.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex gap-3">
                    <span className="material-icons-round text-red-500 text-base">error</span>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            {!hasPredicted ? (
              // Initial state - show placeholder
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center min-h-[600px]">
                <span className="material-icons-round text-gray-300 text-[120px] mb-4">analytics</span>
                <h3 className="text-2xl font-bold text-gray-400 mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                  AI Predictions Will Appear Here
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  Provide regional or soil parameters on the left, then click "Get AI Recommendation" to receive
                  personalized crop suggestions powered by Google Gemini AI.
                </p>
              </div>
            ) : (
              <>
                {/* Top Recommendation Card */}
                {predictions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="col-span-1 md:col-span-2 bg-[#0f392b] text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl">
                      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>
                      <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                        <span className="material-icons-round text-[200px]">agriculture</span>
                      </div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <span className="bg-[#13ec80]/20 text-[#13ec80] border border-[#13ec80]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            Top Match
                          </span>
                          <span className="text-4xl font-bold text-[#13ec80]">{predictions[0].suitability_score}%</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
                          {predictions[0].crop_name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-6">
                          {predictions[0].description}
                        </p>
                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Predicted Yield</p>
                            <p className="text-2xl font-bold">{predictions[0].predicted_yield}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Est. Revenue</p>
                            <p className="text-2xl font-bold text-[#13ec80]">{predictions[0].estimated_revenue}</p>
                          </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Care Tips</p>
                          <p className="text-sm text-gray-200">{predictions[0].care_tips}</p>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Recommendation Cards */}
                    {predictions.slice(1, 3).map((crop, idx) => (
                      <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full group hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#5D4037]/10 flex items-center justify-center text-[#5D4037] group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
                            <span className="material-icons-round text-2xl">nature</span>
                          </div>
                          <span className="text-lg font-bold text-gray-400 group-hover:text-[#0f392b] transition-colors">{crop.suitability_score}%</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-[#5D4037] mb-1" style={{ fontFamily: "Playfair Display, serif" }}>
                            {crop.crop_name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                            {crop.description}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase">Est. Revenue</p>
                              <p className="text-lg font-bold text-gray-800">{crop.estimated_revenue}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Additional Recommendations */}
                {predictions.length > 3 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
                    <h3 className="font-bold text-lg text-[#5D4037] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                      Alternative Options
                    </h3>
                    <div className="space-y-3">
                      {predictions.slice(3).map((crop, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:border-[#0f392b]/30 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-md font-bold text-gray-800">{crop.crop_name}</h4>
                            <span className="text-sm font-bold text-[#0f392b]">{crop.suitability_score}%</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{crop.description}</p>
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-500">Yield: {crop.predicted_yield}</span>
                            <span className="text-[#047857] font-semibold">{crop.estimated_revenue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
