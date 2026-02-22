"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { landsApi } from "@/lib/services/api";

/* ─── Types ──────────────────────────────────────────── */
type StatusKey = "Leased" | "Pending" | "Under Review" | "Vacant";

interface LandData {
  id: number;
  title: string;
  description: string;
  total_area: number;
  price_per_month: number;
  preferred_duration: string;
  status: string;
  is_verified: boolean;
  created_at: string;
  latitude: number;
  longitude: number;
  has_irrigation: boolean;
  has_electricity: boolean;
  has_road_access: boolean;
  has_fencing: boolean;
  soil_data?: {
    ph_level: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    moisture: number;
    temperature: number;
    rainfall: number;
  };
  images: Array<{id: number; image: string}>;
}

/* ─── Status badge config ─────────────────────────────── */
const STATUS_CONFIG: Record<
  string,
  { bg: string; icon: string }
> = {
  Leased: { bg: "bg-emerald-500", icon: "check_circle" },
  Pending: { bg: "bg-amber-500", icon: "schedule" },
  "Under Review": { bg: "bg-blue-500", icon: "history_edu" },
  Vacant: { bg: "bg-slate-500", icon: "crop_free" },
};

/* ─── Helper to determine soil type from pH ─────────── */
const getSoilType = (ph?: number): string => {
  if (!ph) return "Unknown";
  if (ph < 5.5) return "Acidic";
  if (ph > 7.5) return "Alkaline";
  return "Neutral";
};

/* ─── Page ────────────────────────────────────────────── */
export default function MyLandsPage() {
  const [lands, setLands] = useState<LandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [soilFilter, setSoilFilter] = useState("");

  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);
        const { data } = await landsApi.myLands();
        setLands(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lands:", err);
        setError("Failed to load your lands. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  const filtered = lands.filter((land) => {
    const matchSearch =
      !search ||
      land.title.toLowerCase().includes(search.toLowerCase()) ||
      land.id.toString().includes(search);
    const matchStatus = !statusFilter || land.status === statusFilter;
    const matchSoil = !soilFilter || getSoilType(land.soil_data?.ph_level).toLowerCase().includes(soilFilter.toLowerCase());
    return matchSearch && matchStatus && matchSoil;
  });
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                className="text-3xl font-bold tracking-tight text-earth"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                My Lands
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Manage your land plots, track soil health, and monitor leasing status.
              </p>
            </div>
            <div className="flex gap-2.5">
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">checklist_rtl</span>
                Bulk Actions
              </button>
              <Link
                href="/owner/lands/add"
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add New Plot
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 rounded-lg bg-white p-5 border border-slate-200 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Plot ID, Tenant, or Location..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* Dropdowns + filter */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option value="">Status: All</option>
                <option value="Leased">Leased</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Vacant">Vacant</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                expand_more
              </span>
            </div>
            <div className="relative">
              <select
                value={soilFilter}
                onChange={(e) => setSoilFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                <option value="">Soil Type: All</option>
                <option value="Loam">Loam</option>
                <option value="Clay">Clay</option>
                <option value="Silt">Silt</option>
                <option value="Alluvial">Alluvial</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                expand_more
              </span>
            </div>
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); setSoilFilter(""); }}
              title="Reset Filters"
              className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-500 hover:border-primary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Land grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {loading && (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-sm text-slate-500">Loading your lands...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-red-500">error</span>
                <p className="mt-4 text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <span className="material-symbols-outlined text-5xl text-slate-300">landscape</span>
                <p className="mt-4 text-sm text-slate-500">
                  {lands.length === 0 ? "No lands yet. Start by adding your first plot!" : "No lands match your filters."}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && filtered.map((land) => {
            const statusConfig = STATUS_CONFIG[land.status] || STATUS_CONFIG["Vacant"];
            const { bg, icon } = statusConfig;
            const soilType = getSoilType(land.soil_data?.ph_level);
            const thumbnailImage = land.images?.[0]?.image || null;

            return (
              <div
                key={land.id}
                className={`group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:shadow-md hover:border-primary/40 transition-all`}
              >
                {/* Map thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 mini-map-pattern">
                  {thumbnailImage && (
                    <img 
                      src={thumbnailImage} 
                      alt={land.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Plot ID chip */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      ID: PL-{land.id}
                    </span>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center rounded-full ${bg} px-2.5 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-white/20`}
                    >
                      <span className="material-symbols-outlined text-xs mr-1">
                        {icon}
                      </span>
                      {land.status}
                    </span>
                  </div>

                  {/* Plot name / location */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3
                      className="text-lg font-bold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {land.title}
                    </h3>
                    <p className="text-xs font-medium opacity-90">
{Number(land.latitude).toFixed(4)}°, {Number(land.longitude).toFixed(4)}°                    </p>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4 grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Size</p>
                      <p className="text-sm font-semibold text-slate-800">{land.total_area} Acres</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Soil Type</p>
                      <p className="text-sm font-semibold text-slate-800">{soilType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Verified</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`material-symbols-outlined text-sm ${land.is_verified ? 'text-primary' : 'text-slate-400'}`}>
                          {land.is_verified ? 'verified' : 'pending'}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">
                          {land.is_verified ? 'Yes' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Duration</p>
                      <p className="text-sm font-semibold text-slate-800">{land.preferred_duration}</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {land.has_irrigation && (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        <span className="material-symbols-outlined text-xs">water_drop</span>
                        Irrigation
                      </span>
                    )}
                    {land.has_electricity && (
                      <span className="inline-flex items-center gap-1 rounded bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                        <span className="material-symbols-outlined text-xs">bolt</span>
                        Power
                      </span>
                    )}
                    {land.has_road_access && (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        <span className="material-symbols-outlined text-xs">route</span>
                        Road
                      </span>
                    )}
                    {land.has_fencing && (
                      <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        <span className="material-symbols-outlined text-xs">fence</span>
                        Fenced
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Monthly Price</p>
                      <p className="text-lg font-bold text-primary">
                        Ksh {land.price_per_month.toLocaleString()}
                      </p>
                    </div>
                    <button className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* List New Property tile */}
          <Link
            href="/owner/lands/add"
            className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-all hover:border-primary hover:bg-primary/5"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-primary">
                add_location_alt
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">List New Property</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              Upload ownership documents, map coordinates, and soil reports to start earning.
            </p>
            <span className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors">
              Start Listing
            </span>
          </Link>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to{" "}
            <span className="font-medium text-slate-900">{filtered.length}</span> of{" "}
            <span className="font-medium text-slate-900">{filtered.length}</span> results
          </p>
          <div className="flex gap-2">
            <button
              disabled
              className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
