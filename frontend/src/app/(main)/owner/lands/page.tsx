"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { landsApi, ownerApi } from "@/lib/services/api";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";

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
    soil_type?: string;
    ph_level: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    moisture: number;
    temperature: number;
    rainfall: number;
  };
  images: Array<{ id: number; image: string }>;
  current_lessee?: number | null;
}

interface AgreementSummary {
  id: number;
  status: string;
  start_date?: string;
  end_date?: string;
  monthly_rent?: number;
  lessee_name?: string;
  land?: number;
  land_id?: number;
}

/* ─── Status badge config ─────────────────────────────── */
const STATUS_CONFIG: Record<string, { bg: string; icon: string }> = {
  Leased: { bg: "bg-emerald-500", icon: "check_circle" },
  Pending_Payment: { bg: "bg-amber-500", icon: "schedule" },
  Under_Review: { bg: "bg-blue-500", icon: "history_edu" },
  Vacant: { bg: "bg-slate-500", icon: "crop_free" },
};

/* ─── Helper to determine soil type from pH ─────────── */
const getSoilType = (ph?: number): string => {
  if (!ph) return "Unknown";
  if (ph < 5.5) return "Acidic";
  if (ph > 7.5) return "Alkaline";
  return "Neutral";
};

/* ─── Format status for display ────────────────────────── */
const formatStatus = (status: string): string => {
  return status.replace(/_/g, " ");
};

/* ─── Page ────────────────────────────────────────────── */
export default function MyLandsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const showSuccess = searchParams.get("success") === "true";
  const newLandId = searchParams.get("newId") ? Number(searchParams.get("newId")) : null;
  const [cardBannerDismissed, setCardBannerDismissed] = useState(false);
  
  // Auto-clear the success params from URL after a few seconds (keep it clean)
  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => {
        router.replace("/owner/lands", { scroll: false });
      }, 8000);
      return () => clearTimeout(t);
    }
  }, [showSuccess, router]);
  
  useEffect(() => {
    setCardBannerDismissed(false);
  }, [newLandId]);
  
  const [lands, setLands] = useState<LandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [soilFilter, setSoilFilter] = useState("");

  // ── Manage modal ───────────────────────────────────────
  const [manageLand, setManageLand] = useState<LandData | null>(null);
  const [manageAgreements, setManageAgreements] = useState<AgreementSummary[]>([]);
  const [manageAgreementsLoading, setManageAgreementsLoading] = useState(false);

  useEffect(() => {
    if (!manageLand) { setManageAgreements([]); return; }
    if (manageLand.status === 'Vacant' || manageLand.status === 'Under_Review') return;
    setManageAgreementsLoading(true);
    ownerApi.myAgreements()
      .then((res) => {
        const all: AgreementSummary[] = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setManageAgreements(all.filter((a) => a.land === manageLand.id || a.land_id === manageLand.id));
      })
      .catch(() => setManageAgreements([]))
      .finally(() => setManageAgreementsLoading(false));
  }, [manageLand]);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);
        const { data } = await landsApi.myLands();
        console.log("=== LANDS API RESPONSE ===");
        console.log("Total lands received:", data?.length);
        console.log("Lands data:", data);
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
    const matchSoil =
      !soilFilter || land.soil_data?.soil_type === soilFilter;
    return matchSearch && matchStatus && matchSoil;
  });

  // Debug: Log filtered results
  console.log("=== FILTERING DEBUG ===");
  console.log("Total lands:", lands.length);
  console.log("Filtered lands:", filtered.length);
  console.log("Search:", search);
  console.log("Status filter:", statusFilter);
  console.log("Soil filter:", soilFilter);
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="My Lands"
        subtitle="Manage your land plots, track soil health, and monitor leasing status."
      >
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-[18px]">
            download
          </span>
          Export
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-[18px]">
            checklist_rtl
          </span>
          Bulk Actions
        </button>
        <Link
          href="/owner/lands/add"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New Plot
        </Link>
      </OwnerPageHeader>
      <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 bg-slate-50">
        <div className="mx-auto max-w-full">
          {/* Success message – only shown when no specific card target */}
          {showSuccess && !newLandId && (
            <div className="mb-4 md:mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 animate-fade-in">
              <span className="material-symbols-outlined text-green-600 text-xl shrink-0">
                check_circle
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-800">
                  Land listing created successfully!
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  Your land has been submitted and is awaiting admin verification. You\'ll be notified once it\'s approved.
                </p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 md:mb-8 flex flex-col gap-4 rounded-lg bg-white p-4 md:p-5 border border-slate-200 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Plot ID, Title, or Location..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            {/* Dropdowns + filter */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Status: All</option>
                  <option value="Leased">Leased</option>
                  <option value="Under_Review">Under Review</option>
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
                  className="appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Soil Type: All</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Clay">Clay</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Silt">Silt</option>
                  <option value="Peat">Peat</option>
                  <option value="Chalk">Chalk</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Other">Other</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  expand_more
                </span>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setSoilFilter("");
                }}
                title="Reset Filters"
                className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-500 hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>

          {/* Land grid */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {loading && (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <p className="mt-4 text-sm text-slate-500">
                    Loading your lands...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-red-400">
                    error
                  </span>
                  <p className="mt-4 text-sm text-red-600">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      landsApi.myLands()
                        .then((res) => { setLands(res.data); setError(null); })
                        .catch(() => setError("Failed to load your lands. Please try again."))
                        .finally(() => setLoading(false));
                    }}
                    className="mt-4 px-5 py-2 bg-[#047857] text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="col-span-full flex items-center justify-center py-20">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-300">
                    landscape
                  </span>
                  <p className="mt-4 text-sm text-slate-500">
                    {lands.length === 0
                      ? "No lands yet. Start by adding your first plot!"
                      : "No lands match your filters."}
                  </p>
                </div>
              </div>
            )}

            {!loading &&
              !error &&
              filtered.map((land) => {
                const statusConfig =
                  STATUS_CONFIG[land.status] || STATUS_CONFIG["Vacant"];
                const { bg, icon } = statusConfig;
                const soilType = getSoilType(land.soil_data?.ph_level);
                const thumbnailImage = land.images?.[0]?.image || null;

                return (
                  <div
                    key={land.id}
                    className={`group relative flex flex-col overflow-hidden rounded-lg border ${
                      showSuccess && !cardBannerDismissed && land.id === newLandId
                        ? "border-green-400 ring-2 ring-green-300"
                        : "border-slate-200"
                    } bg-white hover:shadow-md hover:border-primary/40 transition-all`}
                  >
                    {/* Success card notification */}
                    {showSuccess && !cardBannerDismissed && land.id === newLandId && (
                      <div className="flex items-start gap-2.5 bg-green-50 border-b border-green-200 px-4 py-3 animate-fade-in">
                        <span className="material-symbols-outlined text-green-600 text-base shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-green-800">Land listing created successfully!</p>
                          <p className="text-[11px] text-green-600 mt-0.5 leading-snug">
                            Awaiting admin verification. You&apos;ll be notified once approved.
                          </p>
                        </div>
                        <button
                          onClick={() => setCardBannerDismissed(true)}
                          className="shrink-0 text-green-500 hover:text-green-700 transition-colors"
                          aria-label="Dismiss"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    )}
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
                          {formatStatus(land.status)}
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
                          {Number(land.latitude).toFixed(4)}°,{" "}
                          {Number(land.longitude).toFixed(4)}°{" "}
                        </p>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-4 grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Size
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {land.total_area} Acres
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Soil Type
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {soilType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Verified
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className={`material-symbols-outlined text-sm ${land.is_verified ? "text-primary" : "text-slate-400"}`}
                            >
                              {land.is_verified ? "verified" : "pending"}
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {land.is_verified ? "Yes" : "Pending"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                            Duration
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {land.preferred_duration}
                          </p>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {land.has_irrigation && (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            <span className="material-symbols-outlined text-xs">
                              water_drop
                            </span>
                            Irrigation
                          </span>
                        )}
                        {land.has_electricity && (
                          <span className="inline-flex items-center gap-1 rounded bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                            <span className="material-symbols-outlined text-xs">
                              bolt
                            </span>
                            Power
                          </span>
                        )}
                        {land.has_road_access && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                            <span className="material-symbols-outlined text-xs">
                              route
                            </span>
                            Road
                          </span>
                        )}
                        {land.has_fencing && (
                          <span className="inline-flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            <span className="material-symbols-outlined text-xs">
                              fence
                            </span>
                            Fenced
                          </span>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500">
                            Monthly Price
                          </p>
                          <p className="text-lg font-bold text-primary">
                            Ksh {land.price_per_month.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setManageLand(land)}
                          className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
                        >
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
              <h3 className="text-lg font-bold text-slate-900">
                List New Property
              </h3>
              <p className="mt-2 max-w-xs text-sm text-slate-500">
                Upload ownership documents, map coordinates, and soil reports to
                start earning.
              </p>
              <span className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors">
                Start Listing
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Manage Modal ─────────────────────────────────────────────── */}
      {manageLand && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setManageLand(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{manageLand.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Land ID: PL-{manageLand.id} &middot; {manageLand.total_area} ac
                </p>
              </div>
              <button
                onClick={() => setManageLand(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors ml-4 shrink-0"
              >
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>

            {/* Status badge */}
            <div className="px-6 py-4 border-b border-slate-100">
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  manageLand.status === "Leased"
                    ? "bg-emerald-50 text-emerald-700"
                    : manageLand.status === "Pending_Payment"
                    ? "bg-amber-50 text-amber-700"
                    : manageLand.status === "Under_Review"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {manageLand.status === "Leased"
                    ? "check_circle"
                    : manageLand.status === "Pending_Payment"
                    ? "schedule"
                    : manageLand.status === "Under_Review"
                    ? "history_edu"
                    : "crop_free"}
                </span>
                {formatStatus(manageLand.status)}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">

              {/* ── Vacant ── */}
              {manageLand.status === "Vacant" && (
                <>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      This land is currently vacant and listed for lease.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => { setManageLand(null); router.push("/owner/lease-requests"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-primary">inbox</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">View Lease Requests</p>
                        <p className="text-xs text-slate-500">See all incoming requests for your land</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 ml-auto">chevron_right</span>
                    </button>
                    <button
                      onClick={() => { setManageLand(null); router.push("/owner/lands/add"); }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-blue-500">edit</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Add Another Listing</p>
                        <p className="text-xs text-slate-500">List additional land properties</p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 ml-auto">chevron_right</span>
                    </button>
                  </div>
                </>
              )}

              {/* ── Under Review ── */}
              {manageLand.status === "Under_Review" && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-500 text-xl shrink-0 mt-0.5">info</span>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Under Admin Review</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Your land listing is being verified by our admin team. Once approved,
                        it will appear in search results and lessees can send requests.
                      </p>
                      <p className="text-xs text-blue-500 mt-2">This typically takes 1–3 business days.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Pending Payment / Leased ── */}
              {(manageLand.status === "Pending_Payment" || manageLand.status === "Leased") && (
                <>
                  {manageAgreementsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  ) : manageAgreements.length === 0 ? (
                    <div className="rounded-lg bg-amber-50 p-4">
                      <p className="text-sm text-amber-700">
                        No agreement details found. Check the Agreements section below.
                      </p>
                    </div>
                  ) : (
                    manageAgreements.map((ag) => (
                      <div key={ag.id} className="rounded-xl border border-slate-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-800">Agreement #{ag.id}</span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              ag.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : ag.status === "draft"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {ag.status ?? "In Progress"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Lessee</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5">
                              {ag.lessee_name ?? "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Monthly Rent</p>
                            <p className="text-sm font-semibold text-primary mt-0.5">
                              Ksh {Number(ag.monthly_rent ?? 0).toLocaleString()}
                            </p>
                          </div>
                          {ag.start_date && (
                            <div>
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Start</p>
                              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                {new Date(ag.start_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {ag.end_date && (
                            <div>
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">End</p>
                              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                {new Date(ag.end_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => { setManageLand(null); router.push(`/owner/agreements/${ag.id}`); }}
                          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
                        >
                          View Full Agreement
                        </button>
                      </div>
                    ))
                  )}
                  <button
                    onClick={() => { setManageLand(null); router.push("/owner/agreements"); }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-slate-500">description</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">All Agreements</p>
                      <p className="text-xs text-slate-500">View and manage all your lease agreements</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 ml-auto">chevron_right</span>
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
