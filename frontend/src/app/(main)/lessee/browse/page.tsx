"use client";
import { useState, useEffect } from "react";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";
import { lesseeApi } from "@/lib/services/api";

interface LandImage {
  id: number;
  image: string;
}

interface SoilData {
  soil_type?: string;
  ph_level?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  moisture?: number;
  temperature?: number;
  rainfall?: number;
}

interface Land {
  id: number;
  title: string;
  description: string;
  total_area: number;
  price_per_month: number;
  preferred_duration: string;
  has_irrigation: boolean;
  has_electricity: boolean;
  has_road_access: boolean;
  has_fencing: boolean;
  location_name: string;
  latitude: string;
  longitude: string;
  status: string;
  soil_data?: SoilData;
  images: LandImage[];
}

export default function BrowseLandPage() {
  const [minAcres, setMinAcres] = useState(5);
  const [maxAcres, setMaxAcres] = useState(50);
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLands();
  }, []);

  const loadLands = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await lesseeApi.listings();
      // Calls /lands/browse/ endpoint
      // Ensure we always set an array
      const data = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      setLands(data);
    } catch (err: any) {
      console.error("Failed to load lands:", err);
      setError(err.response?.data?.detail || "Failed to load lands");
      setLands([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getWaterSource = (land: Land) => {
    if (land.has_irrigation) return "Irrigation";
    return "Natural";
  };

  const getSlope = () => {
    // This would ideally come from backend
    return "Flat";
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <LesseePageHeader
        title="Find Land"
        subtitle="Browse available leasing opportunities matched to your preferences"
      >
        <div className="relative w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-icons-round text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search location or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] text-gray-700 placeholder-gray-400"
          />
        </div>
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <span className="material-icons-round">close</span>
        </button>
      </LesseePageHeader>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Filters Panel */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-6 flex flex-col gap-6 flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3
                className="font-bold text-gray-800 flex items-center gap-2 text-xl"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-[#047857] text-2xl">
                  tune
                </span>
                Farm Preferences
              </h3>
              <button className="text-xs font-semibold text-[#047857] hover:text-emerald-700">
                Reset
              </button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Adjust these settings to filter the land listings automatically.
            </p>
          </div>

          {/* Preferred Regions */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block mb-2">
              Preferred Regions
            </label>
            {[
              "Rift Valley",
              "Central Kenya",
              "Coastal Region",
              "Eastern",
              "Western",
            ].map((region, i) => (
              <label
                key={region}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked={i < 2}
                  className="w-5 h-5 rounded border-gray-300 text-[#047857] focus:ring-[#047857]/20 accent-[#047857]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#047857] transition-colors">
                  {region}
                </span>
              </label>
            ))}
          </div>

          {/* AI Recommended Crops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
                AI Recommended Crops
              </label>
              <span className="flex items-center text-[10px] text-[#5D4037] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="material-icons-round text-[14px] mr-1 text-amber-600">
                  auto_awesome
                </span>
                Gemini AI
              </span>
            </div>
            <div className="bg-gradient-to-br from-emerald-100 to-green-50 rounded-xl p-4 border-2 border-emerald-200">
              <p className="text-[10px] text-[#0f392b] font-medium mb-2.5">
                Based on soil data & climate history for{" "}
                <span className="font-bold text-[#047857]">
                  Rift Valley & Central
                </span>
                :
              </p>
              <div className="flex flex-wrap gap-2">
                {["Maize", "Wheat", "Avocado"].map((crop) => (
                  <div
                    key={crop}
                    className="inline-flex items-center bg-[#0f392b] text-emerald-100 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
                  >
                    <span className="material-icons-round text-[13px] mr-1.5 text-[#13ec80]">
                      auto_awesome
                    </span>
                    {crop}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Target Acreage */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
              Target Acreage
            </label>
            {/* Min slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-500 font-medium">
                  Min (Acres)
                </span>
                <span className="text-[11px] font-bold text-[#047857]">
                  {minAcres} ac
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={minAcres}
                onChange={(e) =>
                  setMinAcres(Math.min(Number(e.target.value), maxAcres - 1))
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #047857 0%, #047857 ${((minAcres - 1) / 99) * 100}%, #e5e7eb ${((minAcres - 1) / 99) * 100}%, #e5e7eb 100%)`,
                  accentColor: "#047857",
                }}
              />
            </div>
            {/* Max slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-gray-500 font-medium">
                  Max (Acres)
                </span>
                <span className="text-[11px] font-bold text-[#047857]">
                  {maxAcres} ac
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={maxAcres}
                onChange={(e) =>
                  setMaxAcres(Math.max(Number(e.target.value), minAcres + 1))
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #047857 0%, #047857 ${((maxAcres - 1) / 99) * 100}%, #e5e7eb ${((maxAcres - 1) / 99) * 100}%, #e5e7eb 100%)`,
                  accentColor: "#047857",
                }}
              />
            </div>
          </div>

          {/* Soil Type */}
          <div className="space-y-3 mb-2">
            <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider block">
              Soil Type Preference
            </label>
            <div className="relative">
              <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-[#047857] cursor-pointer">
                <option>Any Soil Type</option>
                <option>Volcanic Loam</option>
                <option>Clay</option>
                <option>Sandy</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 material-icons-round text-xl">
                expand_more
              </span>
            </div>
          </div>

          <button className="mt-auto w-full bg-[#047857] hover:bg-emerald-800 text-white font-medium py-3 rounded-xl shadow-lg transition-colors">
            Update Results
          </button>
        </aside>

        {/* Main Listings */}
        <div className="flex-1 bg-[#f8fafc] p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#047857] mx-auto mb-4"></div>
                <p className="text-gray-500">Loading lands...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="material-icons-round text-red-500 text-5xl mb-4">
                  error_outline
                </span>
                <p className="text-red-600 mb-2">{error}</p>
                <button
                  onClick={loadLands}
                  className="text-sm text-[#047857] hover:text-emerald-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : lands.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="material-icons-round text-gray-400 text-5xl mb-4">
                  inventory_2
                </span>
                <p className="text-gray-600">No vacant and verified lands available at the moment</p>
                <p className="text-gray-400 text-sm mt-2">Check back later for new listings</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-bold text-gray-800"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {lands.length} Land Listing{lands.length !== 1 ? "s" : ""} Found
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative">
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                      <span>Recommended</span>
                      <span className="material-icons-round text-lg">
                        expand_more
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lands.map((land) => (
                  <div
                    key={land.id}
                    className="bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#047857]/20 flex flex-col"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {land.images && land.images.length > 0 ? (
                        <img
                          src={land.images[0].image}
                          alt={land.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                          <span className="material-icons-round text-[#0f392b]/20 text-[80px]">
                            landscape
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent">
                        <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800">
                          {land.total_area} Acres
                        </span>
                        <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-1.5 rounded-full text-white transition-colors">
                          <span className="material-icons-round text-lg">
                            favorite_border
                          </span>
                        </button>
                      </div>
                      <span className="absolute bottom-3 left-3 bg-[#047857] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm">
                        {land.status}
                      </span>
                    </div>

                    <div className="pt-4 px-5 pb-5 flex flex-col flex-1">
                      <h4
                        className="font-bold text-lg text-gray-900 mb-1"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {land.title}
                      </h4>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="material-icons-round text-sm mr-1">
                            location_on
                          </span>
                          {land.location_name}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 font-medium">
                            KES
                          </div>
                          <div className="text-sm font-bold text-[#047857]">
                            {Math.round(land.price_per_month).toLocaleString()}
                            <span className="text-[10px] font-normal text-gray-400">
                              /mo
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
                        <div className="text-center">
                          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">
                            Soil
                          </div>
                          <div className="text-xs font-medium text-gray-600">
                            {land.soil_data?.soil_type || "N/A"}
                          </div>
                        </div>
                        <div className="text-center border-l border-r border-gray-100">
                          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">
                            Water
                          </div>
                          <div className="text-xs font-medium text-gray-600 truncate">
                            {getWaterSource(land)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">
                            Amenities
                          </div>
                          <div className="text-xs font-medium text-gray-600">
                            {[land.has_irrigation, land.has_electricity, land.has_road_access, land.has_fencing].filter(Boolean).length}
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-50 text-[#047857]">
                            <span className="material-icons-round text-sm">
                              verified
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            Verified
                          </span>
                        </div>
                        <a
                          href={`/lessee/land-detail?id=${land.id}`}
                          className="text-xs font-bold text-[#047857] flex items-center hover:text-emerald-700 transition-colors"
                        >
                          View Details
                          <span className="material-icons-round text-sm ml-1">
                            arrow_forward
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
