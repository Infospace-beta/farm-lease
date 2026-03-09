"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { landsApi } from "@/lib/services/api";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";

/* ─── Types ───────────────────────────────────────────── */
interface LandData {
  id: number;
  title: string;
  total_area: number;
  price_per_month: number;
  status: string;
  is_verified: boolean;
  soil_data?: {
    soil_type?: string;
    ph_level: number;
  };
  images: Array<{ id: number; image: string }>;
}

interface ActivityItem {
  dotColor: string;
  time: string;
  title: string;
  body: string;
  type: string;
  last?: boolean;
}

/* ─── Helper functions ────────────────────────────────── */
const getSoilType = (ph?: number): string => {
  if (!ph) return "Unknown";
  if (ph < 5.5) return "Acidic";
  if (ph > 7.5) return "Alkaline";
  return "Neutral";
};

const formatStatus = (status: string): string => {
  return status.replace(/_/g, " ");
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Leased":
      return "bg-emerald-500/90";
    case "Pending_Payment":
      return "bg-amber-500/90";
    case "Under_Review":
      return "bg-blue-500/90";
    default:
      return "bg-slate-500/90";
  }
};

/* ─── Page ────────────────────────────────────────────── */
export default function OwnerDashboardPage() {
  const [lands, setLands] = useState<LandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    total_lands: 0,
    active_leases: 0,
    vacant_lands: 0,
    pending_verifications: 0,
    total_area: 0,
    monthly_revenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lands, dashboard stats, and activities in parallel
        const [landsResponse, statsResponse, activitiesResponse] = await Promise.all([
          landsApi.myLands(),
          landsApi.ownerDashboard(),
          landsApi.ownerActivity(),
        ]);

        setLands(landsResponse.data);
        setDashboardStats(statsResponse.data);
        setActivities(activitiesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show only first 3 lands on dashboard
  const displayLands = lands.slice(0, 3);

  // Calculate real stats from dashboard data
  const stats = [
    {
      label: "Total Land Area",
      value: `${dashboardStats.total_area.toFixed(1)} Acres`,
      badge: `${dashboardStats.total_lands} plots`,
      badgeUp: null,
      sub: "total portfolio",
      chart: (
        <svg
          className="h-10 w-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 100 40"
        >
          <path
            d="M0 35 Q 25 35 35 20 T 70 25 T 100 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M0 35 Q 25 35 35 20 T 70 25 T 100 5 V 40 H 0 Z"
            fill="#047857"
            opacity="0.1"
            stroke="none"
          />
        </svg>
      ),
    },
    {
      label: "Monthly Revenue",
      value: `Ksh ${dashboardStats.monthly_revenue.toLocaleString()}`,
      badge: `${dashboardStats.active_leases} leased`,
      badgeUp: dashboardStats.active_leases > 0,
      sub: "from active leases",
      chart: (
        <svg
          className="h-10 w-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 100 40"
        >
          <path
            d="M0 30 L 20 25 L 40 32 L 60 15 L 80 20 L 100 5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      label: "Occupancy Rate",
      value:
        dashboardStats.total_lands > 0
          ? `${Math.round((dashboardStats.active_leases / dashboardStats.total_lands) * 100)}%`
          : "0%",
      badge: `${dashboardStats.vacant_lands} vacant`,
      badgeUp: null,
      sub: "portfolio status",
      chart: (
        <svg
          className="h-10 w-24 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 100 40"
        >
          <path
            d="M0 20 H 100"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <OwnerPageHeader
        title="Dashboard"
        subtitle="Monitor your land portfolio performance, manage lease agreements, and track escrow payments in real-time."
      >
        <Link
          href="/owner/lands/add"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            add_location_alt
          </span>
          List New Land
        </Link>
      </OwnerPageHeader>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-6 bg-slate-50">
        <div className="mx-auto max-w-full">
          {/* Pending verification alert */}
          {!loading && dashboardStats.pending_verifications > 0 && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5">
                pending
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {dashboardStats.pending_verifications} land listing
                  {dashboardStats.pending_verifications > 1 ? "s" : ""} awaiting
                  admin verification
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Your land will be visible to lessees once the admin verifies
                  your Title Deed Number.
                </p>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="mb-4 md:mb-6 grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeleton for stats
              <>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white p-4 md:p-5 shadow-sm border border-slate-200 animate-pulse"
                  >
                    <div className="h-4 bg-slate-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-slate-200 rounded w-32 mb-6"></div>
                    <div className="flex justify-between items-end">
                      <div className="h-6 bg-slate-200 rounded w-16"></div>
                      <div className="h-10 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              stats.map((s) => (
                <div
                  key={s.label}
                  className="relative overflow-hidden rounded-xl bg-white p-4 md:p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {s.label}
                      </p>
                      <h3 className="mt-2 text-2xl md:text-3xl font-bold text-earth">
                        {s.value}
                      </h3>
                    </div>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        {s.badgeUp === true && (
                          <span className="flex items-center text-primary font-bold bg-primary/10 px-2 py-1 rounded text-xs w-fit">
                            <span className="material-symbols-outlined text-sm mr-1">
                              trending_up
                            </span>
                            {s.badge}
                          </span>
                        )}
                        {s.badgeUp === false && (
                          <span className="flex items-center text-red-500 font-bold bg-red-50 px-2 py-1 rounded text-xs w-fit">
                            <span className="material-symbols-outlined text-sm mr-1">
                              trending_down
                            </span>
                            {s.badge}
                          </span>
                        )}
                        {s.badgeUp === null && (
                          <span className="flex items-center text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs w-fit">
                            <span className="material-symbols-outlined text-sm mr-1">
                              remove
                            </span>
                            {s.badge}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 mt-1 block">
                          {s.sub}
                        </span>
                      </div>
                      {s.chart}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Portfolio + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Land Portfolio */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <h3
                  className="text-base md:text-lg font-bold text-earth"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  My Land Portfolio
                </h3>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">
                      grid_view
                    </span>
                  </button>
                  <button className="p-1.5 rounded border border-transparent text-slate-400 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">
                      list
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {/* Land cards */}
                {loading ? (
                  <div className="col-span-full flex items-center justify-center py-10">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  </div>
                ) : displayLands.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-14 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-primary text-3xl">landscape</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-700 mb-1">No lands listed yet</h4>
                    <p className="text-sm text-slate-500 mb-5 max-w-xs">
                      Start building your portfolio by listing your first plot of land.
                    </p>
                    <a
                      href="/owner/lands/add"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-lg">add_circle</span>
                      List Your First Land
                    </a>
                  </div>
                ) : (
                  displayLands.map((land) => {
                    const soilType = getSoilType(land.soil_data?.ph_level);
                    const statusColor = getStatusColor(land.status);
                    const thumbnailImage = land.images?.[0]?.image;

                    return (
                      <div
                        key={land.id}
                        className="group relative rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md hover:border-primary/40 transition-all"
                      >
                        <div className="relative h-40 w-full overflow-hidden rounded-xl mini-map-pattern">
                          {thumbnailImage && (
                            <img
                              src={thumbnailImage}
                              alt={land.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-3 left-3 text-white">
                            <p className="font-bold text-lg">{land.title}</p>
                            <p className="text-xs opacity-90">
                              {land.total_area} Acres • Soil: {soilType}
                            </p>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span
                              className={`inline-flex items-center rounded-full ${statusColor} backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white shadow-sm`}
                            >
                              {formatStatus(land.status)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500">
                              Verification
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`material-symbols-outlined text-sm ${land.is_verified ? "text-primary" : "text-slate-400"}`}
                              >
                                {land.is_verified ? "verified" : "pending"}
                              </span>
                              <span className="text-sm font-medium text-slate-800">
                                {land.is_verified ? "Verified" : "Pending"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              Monthly Price
                            </p>
                            <p className="text-sm font-bold text-primary">
                              Ksh {land.price_per_month.toLocaleString()}
                              <span className="text-slate-400 font-normal">
                                /mo
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                          <span className="text-xs text-slate-400">
                            ID: PL-{land.id}
                          </span>
                          <Link
                            href="/owner/lands"
                            className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline"
                          >
                            Manage Land
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Add New Land tile */}
                <Link
                  href="/owner/lands/add"
                  className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 transition-all hover:border-primary hover:bg-primary/5"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      add
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Add New Land
                  </h4>
                  <p className="text-xs text-slate-500 text-center mt-2 max-w-50">
                    Upload deeds, soil reports, and map coordinates.
                  </p>
                </Link>
              </div>
            </div>

            {/* Activity Pulse */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                  </div>
                  <h3
                    className="text-lg font-bold text-earth"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Activity Pulse
                  </h3>
                </div>

                <div className="space-y-8">
                  {activities.length > 0 ? (
                    activities.map((act, i) => (
                      <div
                        key={i}
                        className={`relative pl-6 ${
                          i === activities.length - 1
                            ? ""
                            : "before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200"
                        }`}
                      >
                        <div
                          className={`absolute -left-1.25 top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${act.dotColor}`}
                        />
                        <p className="text-xs font-medium text-slate-400">
                          {act.time}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                          {act.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{act.body}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <span className="material-symbols-outlined text-4xl text-slate-300">
                        notifications_none
                      </span>
                      <p className="text-sm text-slate-500 mt-2">
                        No recent activity
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
