"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIPredictorPage() {
  const [mode, setMode] = useState<"regional" | "manual">("regional");

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2
            className="text-3xl font-bold text-[#5D4037] mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            AI Crop Predictor
          </h2>
          <p className="text-gray-500 text-sm max-w-xl">
            Leverage advanced machine learning to predict optimal crops based on
            soil composition, regional climate data, and historical yields.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button className="px-4 py-2 bg-[#0f392b] text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm">
              Predictor
            </button>
            <Link
              href="/lessee/ai-predictor/history"
              className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded text-xs font-bold uppercase tracking-wide"
            >
              History
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto pb-8">
        {/* Left Panel - Input Parameters */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
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

            {/* Mode Toggle */}
            <div className="bg-gray-50 p-1 rounded-xl flex mb-8 border border-gray-200">
              <button
                onClick={() => setMode("regional")}
                className={`flex-1 py-2.5 text-sm font-medium text-center transition-all rounded-lg ${
                  mode === "regional"
                    ? "font-bold text-[#0f392b] bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Regional Presets
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`flex-1 py-2.5 text-sm font-medium text-center transition-all rounded-lg ${
                  mode === "manual"
                    ? "font-bold text-[#0f392b] bg-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Manual Entry
              </button>
            </div>

            {mode === "regional" ? (
              <div className="space-y-8 flex-1">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Select Region
                  </label>
                  <div className="relative">
                    <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      search
                    </span>
                    <input
                      type="text"
                      placeholder="Search region (e.g. Nakuru, Trans-Nzoia)..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:border-[#0f392b] focus:ring-1 focus:ring-[#0f392b]/20 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center w-full">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Or
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>

                <button className="w-full py-3 bg-white border border-gray-200 text-[#0f392b] hover:bg-green-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm">
                  <span className="material-icons-round text-[#13ec80] text-lg">
                    my_location
                  </span>
                  Detect My Location
                </button>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex gap-3">
                    <span className="material-icons-round text-blue-500">
                      info
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-blue-800 mb-1">
                        Using Regional Data
                      </h4>
                      <p className="text-xs text-blue-600 leading-relaxed">
                        This mode uses aggregated satellite data and government
                        soil surveys for the selected region. Accuracy is ~85%
                        compared to on-site testing.
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#0f392b] text-white rounded-full font-bold shadow-lg hover:bg-[#0a261c] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group mt-8">
                  <span className="material-icons-round text-[#13ec80]">
                    auto_awesome
                  </span>
                  GET AI RECOMMENDATION
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-sm font-bold text-gray-700">
                      Soil pH Level
                    </label>
                    <span className="text-2xl font-bold text-[#0f392b]">
                      6.5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="14"
                    step="0.1"
                    defaultValue="6.5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    <span>Acidic</span>
                    <span>Neutral</span>
                    <span>Alkaline</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-sm font-bold text-gray-700">
                      Nitrogen (N) Content
                    </label>
                    <span className="text-lg font-bold text-[#0f392b]">
                      140{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        mg/kg
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    defaultValue="140"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs font-bold text-gray-700">
                        Phosphorus (P)
                      </label>
                      <span className="text-sm font-bold text-[#0f392b]">
                        45
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="45"
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs font-bold text-gray-700">
                        Potassium (K)
                      </label>
                      <span className="text-sm font-bold text-[#0f392b]">
                        38
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="38"
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-2 mt-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="material-icons-round text-blue-400 text-sm">
                        water_drop
                      </span>
                      Avg. Rainfall
                    </label>
                    <span className="text-lg font-bold text-[#0f392b]">
                      850{" "}
                      <span className="text-xs text-gray-400 font-normal">
                        mm/yr
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    defaultValue="850"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0f392b]"
                  />
                </div>

                <div className="pt-6 mt-4">
                  <button className="w-full py-4 bg-[#0f392b] text-white rounded-xl font-bold shadow-lg hover:bg-[#1c4a3a] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group">
                    <span className="material-icons-round text-[#13ec80] group-hover:animate-pulse">
                      auto_awesome
                    </span>
                    GET AI RECOMMENDATION
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Top Recommendation Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1 md:col-span-2 bg-[#0f392b] text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>
              <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                <span className="material-icons-round text-[200px]">
                  {mode === "regional" ? "coffee" : "grain"}
                </span>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-[#13ec80]/20 text-[#13ec80] border border-[#13ec80]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {mode === "regional" ? "Regional Match" : "Top Match"}
                  </span>
                  <span className="text-4xl font-bold text-[#13ec80]">
                    {mode === "regional" ? "94%" : "98%"}
                  </span>
                </div>
                <h3
                  className="text-3xl font-bold mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {mode === "regional"
                    ? "Arabica Coffee (SL28)"
                    : "Hybrid Maize H614"}
                </h3>
                <p className="text-gray-300 text-sm mb-6">
                  {mode === "regional"
                    ? "Excellent suitability for high-altitude volcanic soil in this zone."
                    : "High yield potential given current nitrogen levels."}
                </p>
                <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Predicted Yield
                    </p>
                    <p className="text-2xl font-bold">
                      {mode === "regional" ? "1.8" : "35"}{" "}
                      <span className="text-sm font-normal text-gray-400">
                        {mode === "regional" ? "tons/acre" : "bags/acre"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      Est. Revenue
                    </p>
                    <p className="text-2xl font-bold text-[#13ec80]">
                      {mode === "regional" ? "Ksh 450,000" : "Ksh 105,000"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Cards */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-[#5D4037]/10 flex items-center justify-center text-[#5D4037] group-hover:bg-[#5D4037] group-hover:text-white transition-colors">
                  <span className="material-icons-round text-2xl">
                    {mode === "regional" ? "emoji_food_beverage" : "grass"}
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-400 group-hover:text-[#0f392b] transition-colors">
                  {mode === "regional" ? "88%" : "85%"}
                </span>
              </div>
              <div>
                <h4
                  className="text-xl font-bold text-[#5D4037] mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {mode === "regional" ? "Purple Tea" : "Wheat (Duma)"}
                </h4>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {mode === "regional"
                    ? "High demand export crop. Requires acidic soil present in Nakuru/Kericho border areas."
                    : "Good alternative for lower rainfall scenarios. Requires less nitrogen."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Est. Revenue
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {mode === "regional" ? "Ksh 320,000" : "Ksh 82,000"}
                    </p>
                  </div>
                  <button className="text-[#0f392b] hover:bg-[#0f392b]/10 p-2 rounded-full transition-colors">
                    <span className="material-icons-round text-lg">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] flex flex-col justify-between h-full group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-[#13ec80]/10 flex items-center justify-center text-[#047857] group-hover:bg-[#13ec80] group-hover:text-[#0a261c] transition-colors">
                  <span className="material-icons-round text-2xl">
                    nutrition
                  </span>
                </div>
                <span className="text-lg font-bold text-gray-400 group-hover:text-[#0f392b] transition-colors">
                  {mode === "regional" ? "82%" : "72%"}
                </span>
              </div>
              <div>
                <h4
                  className="text-xl font-bold text-[#5D4037] mb-1"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {mode === "regional" ? "Hass Avocado" : "Beans (Rosecoco)"}
                </h4>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {mode === "regional"
                    ? "Requires well-drained soil. Good long-term investment for this region."
                    : "Excellent rotation crop to restore soil nitrogen levels naturally."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Est. Revenue
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {mode === "regional" ? "Ksh 280,000" : "Ksh 65,000"}
                    </p>
                  </div>
                  <button className="text-[#0f392b] hover:bg-[#0f392b]/10 p-2 rounded-full transition-colors">
                    <span className="material-icons-round text-lg">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Farms / Suitable Assets */}
          {mode === "regional" ? (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-bold text-lg text-[#5D4037] flex items-center gap-2"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  <span className="material-icons-round text-[#13ec80] text-xl">
                    verified
                  </span>
                  Verified Farms in Nakuru
                </h3>
                <a
                  href="#"
                  className="text-xs font-bold text-[#0f392b] hover:underline flex items-center gap-1"
                >
                  View All 12 Plots{" "}
                  <span className="material-icons-round text-sm">
                    arrow_forward
                  </span>
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: "#NK-402",
                    size: "5.0 Acres",
                    soil: "Clay Loam Soil",
                    price: "Ksh 15,000",
                  },
                  {
                    id: "#NK-118",
                    size: "2.5 Acres",
                    soil: "Volcanic Soil",
                    price: "Ksh 8,500",
                  },
                ].map((plot) => (
                  <div
                    key={plot.id}
                    className="border border-gray-100 rounded-xl p-3 flex gap-3 hover:border-[#0f392b]/30 transition-all cursor-pointer group"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                      <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                        <span className="material-icons-round text-[#0f392b]/30 text-3xl">
                          landscape
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between py-0.5 w-full">
                      <div>
                        <div className="flex justify-between items-start">
                          <h5 className="text-sm font-bold text-gray-800 group-hover:text-[#0f392b]">
                            Plot {plot.id}
                          </h5>
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                            Available
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {plot.size} • {plot.soil}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#5D4037]">
                        {plot.price}{" "}
                        <span className="text-[10px] font-normal text-gray-400">
                          /month
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0f392b] flex items-center justify-center shadow-md">
                    <span className="material-icons-round text-[#13ec80] text-sm">
                      real_estate_agent
                    </span>
                  </div>
                  <h3
                    className="font-bold text-lg text-[#5D4037]"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Suitable Farm Assets
                  </h3>
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Showing 3 best matches
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: "50 Acres - Rift Valley",
                    location: "Nakuru, Kenya",
                    ph: "pH 6.2",
                    rain: "900mm rain",
                    price: "Ksh 15k",
                    match: "94%",
                  },
                  {
                    name: "12 Acres - Narok Prime",
                    location: "Narok, Kenya",
                    ph: "pH 6.8",
                    rain: "820mm rain",
                    price: "Ksh 12k",
                    match: "89%",
                  },
                  {
                    name: "30 Acres - Eldoret East",
                    location: "Eldoret, Kenya",
                    ph: "pH 6.0",
                    rain: "950mm rain",
                    price: "Ksh 18k",
                    match: "85%",
                  },
                ].map((asset) => (
                  <div
                    key={asset.name}
                    className="border border-gray-100 rounded-xl overflow-hidden hover:border-[#0f392b]/30 hover:shadow-lg transition-all group cursor-pointer"
                  >
                    <div className="h-32 bg-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                        <span className="material-icons-round text-[#0f392b]/30 text-4xl">
                          landscape
                        </span>
                      </div>
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/50">
                        <div className="flex items-center gap-1">
                          <span className="material-icons-round text-[#047857] text-[10px]">
                            verified
                          </span>
                          <span className="text-[10px] font-bold text-[#0f392b]">
                            {asset.match} Suitability
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h5
                        className="text-sm font-bold text-[#5D4037] mb-1 truncate"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {asset.name}
                      </h5>
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <span className="material-icons-round text-[12px]">
                          location_on
                        </span>{" "}
                        {asset.location}
                      </p>
                      <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-500 font-medium">
                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {asset.ph}
                        </span>
                        <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {asset.rain}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                            Lease Price
                          </p>
                          <p className="text-sm font-bold text-[#0f392b]">
                            {asset.price}
                            <span className="text-[10px] font-normal text-gray-400">
                              /acre
                            </span>
                          </p>
                        </div>
                        <button className="bg-[#0f392b] text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-[#1c4a3a] transition-colors shadow-sm uppercase tracking-wide">
                          View Asset
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Trends */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <h3
                className="font-bold text-lg text-[#5D4037]"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Market Trends {mode === "regional" ? "in Nakuru" : ""}
              </h3>
              <a
                href="#"
                className="text-xs font-bold text-[#0f392b] hover:underline flex items-center gap-1"
              >
                Full Report{" "}
                <span className="material-icons-round text-sm">
                  arrow_forward
                </span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                  <span className="material-icons-round text-lg">
                    trending_up
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-800">
                    {mode === "regional"
                      ? "Coffee Grade AA Demand"
                      : "Maize prices rising"}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {mode === "regional"
                      ? "Global export demand surge"
                      : "Nakuru market +5%"}
                  </p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  {mode === "regional" ? "+8%" : "+5%"}
                </span>
              </div>
              <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-700 shrink-0">
                  <span className="material-icons-round text-lg">
                    trending_down
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-gray-800">
                    {mode === "regional"
                      ? "Maize surplus expected"
                      : "Fertilizer costs dip"}
                  </h5>
                  <p className="text-xs text-gray-500">
                    {mode === "regional"
                      ? "Predicted price drop post-harvest"
                      : "Subsidy effect"}
                  </p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  {mode === "regional" ? "-4%" : "-12%"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
