"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../providers/AuthProvider";
import LesseeSidebar from "../../../../components/shared/LesseeSidebar";
import LesseeHeader from "../../../../components/shared/LesseeHeader";
import {
  Search,
  MapPin,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

const AIPredictor = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputMode, setInputMode] = useState("regional");

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "New Farm Matches Found",
      message: "3 verified plots in Nakuru match your soil requirements.",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "AI Model Updated",
      message: "Crop prediction accuracy improved to 94% with latest data.",
      timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Weather Alert",
      message:
        "Heavy rainfall expected in Rift Valley next week. Plan accordingly.",
      timestamp: new Date(Date.now() - 6 * 60 * 60000), // 6 hours ago
      read: true,
    },
    {
      id: 4,
      type: "success",
      title: "Price Drop Alert",
      message: "Lease rates in Trans-Nzoia reduced by 15% this season.",
      timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
      read: true,
    },
  ]);

  // Restore inputMode from navigation query if returning from compare page
  useEffect(() => {
    if (router.query?.inputMode) {
      setInputMode(router.query.inputMode);
    }
  }, [router.query]);
  const [searchRegion, setSearchRegion] = useState("");

  // Manual Entry States
  const [soilPH, setSoilPH] = useState(6.5);
  const [nitrogen, setNitrogen] = useState(140);
  const [phosphorus, setPhosphorus] = useState(45);
  const [potassium, setPotassium] = useState(38);
  const [rainfall, setRainfall] = useState(850);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  // Regional Presets Crops
  const regionalCrops = [
    {
      id: 1,
      name: "Arabica Coffee (SL28)",
      icon: "☕",
      match: 94,
      description:
        "Excellent suitability for high-altitude volcanic soil in this zone.",
      yield: "1.8 tons/acre",
      revenue: "450,000",
      isFeatured: true,
      badge: "Regional Match",
    },
    {
      id: 2,
      name: "Purple Tea",
      icon: "🍵",
      match: 88,
      description:
        "High demand export crop. Requires acidic soil present in Nakuru/Kericho border areas.",
      revenue: "320,000",
      isFeatured: false,
    },
    {
      id: 3,
      name: "Hass Avocado",
      icon: "🥑",
      match: 82,
      description:
        "Requires well-drained soil. Good long-term investment for this region.",
      revenue: "280,000",
      isFeatured: false,
    },
  ];

  // Manual Entry Crops
  const manualCrops = [
    {
      id: 1,
      name: "Hybrid Maize H614",
      icon: "🌽",
      match: 98,
      description: "High yield potential given current nitrogen levels.",
      yield: "35 bags/acre",
      revenue: "105,000",
      isFeatured: true,
      badge: "Top Match",
    },
    {
      id: 2,
      name: "Wheat (Duma)",
      icon: "🌾",
      match: 85,
      description:
        "Good alternative for lower rainfall scenarios. Requires less nitrogen.",
      revenue: "82,000",
      isFeatured: false,
    },
    {
      id: 3,
      name: "Beans (Rosecoco)",
      icon: "🫘",
      match: 72,
      description:
        "Excellent rotation crop to restore soil nitrogen levels naturally.",
      revenue: "65,000",
      isFeatured: false,
    },
  ];

  const topCrops = inputMode === "regional" ? regionalCrops : manualCrops;

  const verifiedPlots = [
    { id: "NK-402", acres: 5.0, soilType: "Clay Loam Soil", price: 15000 },
    { id: "NK-118", acres: 2.5, soilType: "Volcanic Soil", price: 8500 },
  ];

  const manualMarketTrends = [
    {
      title: "Maize prices rising",
      description: "Nakuru market",
      change: "+5%",
      trend: "up",
    },
    {
      title: "Fertilizer costs dip",
      description: "Subsidy effect",
      change: "-12%",
      trend: "down",
    },
  ];

  const regionalMarketTrends = [
    {
      title: "Coffee Grade AA Demand",
      description: "Global export demand surge",
      change: "+8%",
      trend: "up",
    },
    {
      title: "Maize surplus expected",
      description: "Predicted price drop post-harvest",
      change: "-4%",
      trend: "down",
    },
  ];

  const marketTrends =
    inputMode === "regional" ? regionalMarketTrends : manualMarketTrends;

  const farmAssets = [
    {
      id: 1,
      name: "50 Acres - Rift Valley",
      location: "Nakuru, Kenya",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
      suitability: 94,
      ph: "6.2",
      rainfall: "900mm",
      price: "15k",
    },
    {
      id: 2,
      name: "12 Acres - Narok Prime",
      location: "Narok, Kenya",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500",
      suitability: 89,
      ph: "6.8",
      rainfall: "820mm",
      price: "12k",
    },
    {
      id: 3,
      name: "30 Acres - Eldoret East",
      location: "Eldoret, Kenya",
      image: null,
      suitability: 85,
      ph: "6.0",
      rainfall: "950mm",
      price: "18k",
    },
  ];

  // Navigation handlers for farm assets
  const handlePrevAsset = () => {
    setCurrentAssetIndex((prev) =>
      prev > 0 ? prev - 1 : farmAssets.length - 1,
    );
  };

  const handleNextAsset = () => {
    setCurrentAssetIndex((prev) =>
      prev < farmAssets.length - 1 ? prev + 1 : 0,
    );
  };

  return (
    <div className="bg-background-light min-h-screen flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <LesseeSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <LesseeHeader
          title="AI Crop Predictor"
          subtitle="Leverage ML to predict optimal crops based on soil & climate data."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          onMarkNotificationAsRead={(id) => {
            setNotifications(
              notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n,
              ),
            );
          }}
          onViewAllNotifications={() => router.push("/lessee/notifications")}
          rightContent={
            <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1 shadow-sm">
              <button className="px-3 lg:px-4 py-2 bg-forest-green text-white rounded-md text-xs font-bold uppercase tracking-wide shadow-sm transition-all">
                Predictor
              </button>
              <button
                onClick={() => router.push("/lessee/recommendations/history")}
                className="px-3 lg:px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-md text-xs font-bold uppercase tracking-wide transition-all"
              >
                History
              </button>
            </div>
          }
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-8">
            {/* Left Column - Input Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-gray-900">
                    Input Parameters
                  </h3>
                  <span className="bg-green-50 text-forest-green text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                    AI Model v4.2
                  </span>
                </div>

                {/* Toggle Tabs */}
                <div className="bg-gray-50 p-1 rounded-xl flex mb-8 border border-gray-200">
                  <button
                    onClick={() => setInputMode("regional")}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg text-center transition-all ${
                      inputMode === "regional"
                        ? "bg-white text-forest-green shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Regional Presets
                  </button>
                  <button
                    onClick={() => setInputMode("manual")}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg text-center transition-all ${
                      inputMode === "manual"
                        ? "bg-white text-forest-green shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Manual Entry
                  </button>
                </div>

                {/* Regional Presets Content */}
                {inputMode === "regional" && (
                  <div className="space-y-8">
                    {/* Search Region */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Select Region
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={searchRegion}
                          onChange={(e) => setSearchRegion(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-forest-green focus:ring-2 focus:ring-forest-green focus:ring-opacity-20 text-sm outline-none"
                          placeholder="Search region (e.g. Nakuru, Trans-Nzoia)..."
                        />
                      </div>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center justify-center w-full">
                      <div className="h-px bg-gray-200 flex-1"></div>
                      <span className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider">
                        Or
                      </span>
                      <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* Detect Location */}
                    <button className="w-full py-3 bg-white border border-gray-200 text-forest-green hover:bg-green-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm">
                      <MapPin className="text-[#13ec80] w-5 h-5" />
                      Detect My Location
                    </button>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex gap-3">
                        <Info className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-blue-800 mb-1">
                            Using Regional Data
                          </h4>
                          <p className="text-xs text-blue-600 leading-relaxed">
                            This mode uses aggregated satellite data and
                            government soil surveys for the selected region.
                            Accuracy is ~85% compared to on-site testing.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full py-4 bg-forest-green text-white rounded-full font-bold shadow-lg hover:bg-forest-dark transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group mt-8">
                      <span className="text-xl">✨</span>
                      GET AI RECOMMENDATION
                    </button>
                  </div>
                )}

                {/* Manual Entry Content */}
                {inputMode === "manual" && (
                  <div className="space-y-8">
                    {/* Soil pH Level */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-gray-700">
                          Soil pH Level
                        </label>
                        <span className="text-2xl font-bold text-forest-green">
                          {soilPH.toFixed(1)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="14"
                        step="0.1"
                        value={soilPH}
                        onChange={(e) => setSoilPH(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-green"
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        <span>Acidic</span>
                        <span>Neutral</span>
                        <span>Alkaline</span>
                      </div>
                    </div>

                    {/* Nitrogen Content */}
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-gray-700">
                          Nitrogen (N) Content
                        </label>
                        <span className="text-lg font-bold text-forest-green">
                          {nitrogen}{" "}
                          <span className="text-xs text-gray-400 font-normal">
                            mg/kg
                          </span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="300"
                        value={nitrogen}
                        onChange={(e) => setNitrogen(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-green"
                      />
                    </div>

                    {/* Phosphorus and Potassium */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-xs font-bold text-gray-700">
                            Phosphorus (P)
                          </label>
                          <span className="text-sm font-bold text-forest-green">
                            {phosphorus}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={phosphorus}
                          onChange={(e) =>
                            setPhosphorus(parseInt(e.target.value))
                          }
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-green"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <label className="text-xs font-bold text-gray-700">
                            Potassium (K)
                          </label>
                          <span className="text-sm font-bold text-forest-green">
                            {potassium}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={potassium}
                          onChange={(e) =>
                            setPotassium(parseInt(e.target.value))
                          }
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-green"
                        />
                      </div>
                    </div>

                    {/* Rainfall */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-end mb-2 mt-4">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <Droplets className="text-blue-400 w-4 h-4" />
                          Avg. Rainfall
                        </label>
                        <span className="text-lg font-bold text-forest-green">
                          {rainfall}{" "}
                          <span className="text-xs text-gray-400 font-normal">
                            mm/yr
                          </span>
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={rainfall}
                        onChange={(e) => setRainfall(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest-green"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 mt-4">
                      <button className="w-full py-4 bg-forest-green text-white rounded-xl font-bold shadow-lg shadow-forest-green/30 hover:bg-forest-light transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group">
                        <span className="text-xl">✨</span>
                        GET AI RECOMMENDATION
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Suitable Farm Assets */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900">
                    Suitable Farm Assets
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500">
                      {currentAssetIndex + 1} of {farmAssets.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={handlePrevAsset}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-forest-green hover:border-forest-green hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextAsset}
                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-forest-green hover:border-forest-green hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {[farmAssets[currentAssetIndex]].map((asset) => (
                    <div
                      key={asset.id}
                      className="border border-gray-100 rounded-xl overflow-hidden hover:border-forest-green/30 hover:shadow-lg transition-all group cursor-pointer bg-white"
                    >
                      <div className="h-32 bg-gray-200 relative overflow-hidden">
                        {asset.image ? (
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-forest-green/10 flex items-center justify-center">
                            <span className="text-forest-green/30 text-4xl">
                              🌾
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/50">
                          <div className="flex items-center gap-1">
                            <CheckCircle className="text-[#047857] w-3 h-3" />
                            <span className="text-[10px] font-bold text-forest-green">
                              {asset.suitability}% Suitability
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="text-sm font-bold text-earth-brown font-serif mb-1 truncate">
                          {asset.name}
                        </h5>
                        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {asset.location}
                        </p>
                        <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-500 font-medium">
                          <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            pH {asset.ph}
                          </span>
                          <span className="bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            {asset.rainfall} rain
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                              Lease Price
                            </p>
                            <p className="text-sm font-bold text-forest-green">
                              Ksh {asset.price}
                              <span className="text-[10px] font-normal text-gray-400">
                                /acre
                              </span>
                            </p>
                          </div>
                          <button className="bg-forest-green text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-forest-light transition-colors shadow-sm uppercase tracking-wide">
                            View Asset
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compare Assets Button */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() =>
                      router.push("/lessee/compare", { state: { inputMode } })
                    }
                    className="w-full py-3 bg-white border-2 border-forest-green text-forest-green rounded-xl font-bold hover:bg-forest-green hover:text-white transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Compare {farmAssets.length} Assets
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-7 space-y-6">
              {/* Top Crop Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Crop Card */}
                <div className="col-span-1 md:col-span-2 bg-forest-green text-white rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent"></div>
                  <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 text-9xl">
                    {topCrops[0].icon}
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <span className="bg-[#13ec80]/20 text-[#13ec80] border border-[#13ec80]/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                        {topCrops[0].badge}
                      </span>
                      <span className="text-4xl font-bold text-[#13ec80]">
                        {topCrops[0].match}%
                      </span>
                    </div>

                    <h3 className="text-3xl font-serif font-bold mb-1">
                      {topCrops[0].name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6">
                      {topCrops[0].description}
                    </p>

                    <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Predicted Yield
                        </p>
                        <p className="text-2xl font-bold">
                          {topCrops[0].yield.split(" ")[0]}{" "}
                          <span className="text-sm font-normal text-gray-400">
                            {topCrops[0].yield.split(" ").slice(1).join(" ")}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                          Est. Revenue
                        </p>
                        <p className="text-2xl font-bold text-[#13ec80]">
                          Ksh {topCrops[0].revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Crop Cards */}
                {topCrops.slice(1).map((crop, idx) => (
                  <div
                    key={crop.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-full bg-earth-brown/10 flex items-center justify-center text-2xl group-hover:bg-earth-brown group-hover:scale-110 transition-all">
                        {crop.icon}
                      </div>
                      <span className="text-lg font-bold text-gray-400 group-hover:text-forest-green transition-colors">
                        {crop.match}%
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-earth-brown font-serif mb-1">
                        {crop.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {crop.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase">
                            Est. Revenue
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            Ksh {crop.revenue}
                          </p>
                        </div>
                        <button className="text-forest-green hover:bg-forest-green/10 p-2 rounded-full transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verified Farms */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <CheckCircle className="text-emerald-500 w-5 h-5" />
                    Verified Farms in Nakuru
                  </h3>
                  <a
                    href="#"
                    className="text-xs font-bold text-forest-green hover:underline flex items-center gap-1"
                  >
                    View All 12 Plots <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verifiedPlots.map((plot) => (
                    <div
                      key={plot.id}
                      className="border border-gray-100 rounded-xl p-3 flex gap-3 hover:border-forest-green/30 transition-all cursor-pointer group"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                        <div className="absolute inset-0 bg-forest-green/10 flex items-center justify-center">
                          <span className="text-forest-green/30 text-3xl">
                            🌾
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between py-0.5 w-full">
                        <div>
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-bold text-gray-800 group-hover:text-forest-green">
                              Plot #{plot.id}
                            </h5>
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                              Available
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {plot.acres} Acres • {plot.soilType}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-earth-brown">
                          Ksh {plot.price.toLocaleString()}{" "}
                          <span className="text-[10px] font-normal text-gray-400">
                            /month
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Trends */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900">
                    {inputMode === "manual"
                      ? "Market Trends"
                      : "Market Trends in Nakuru"}
                  </h3>
                  <a
                    href="#"
                    className="text-xs font-bold text-forest-green hover:underline flex items-center gap-1"
                  >
                    Full Report <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div
                  className={
                    inputMode === "manual"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                      : "space-y-4"
                  }
                >
                  {marketTrends.map((trend, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer ${inputMode === "manual" ? "border border-transparent hover:border-gray-100" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          trend.trend === "up"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {trend.trend === "up" ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h5 className="text-sm font-bold text-gray-800">
                          {trend.title}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {trend.description}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          trend.trend === "up"
                            ? "text-green-600 bg-green-50"
                            : "text-red-600 bg-red-50"
                        }`}
                      >
                        {trend.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIPredictor;
