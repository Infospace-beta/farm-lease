"use client";

import Link from "next/link";
import { useState } from "react";

/* ─── Types ──────────────────────────────────────────── */
type StatusKey = "Leased" | "Pending" | "Under Review" | "Vacant";

interface AssetCard {
  id: string;
  name: string;
  location: string;
  status: StatusKey;
  size: string;
  soilType: string;
  col3Label: string;
  col3Value: React.ReactNode;
  col4Label: string;
  col4Value: string;
  revenueLabel: string;
  revenueValue: string;
  revenueColor: string;
  actionLabel: string;
  actionStyle: "manage" | "review" | "docs" | "boost";
  hoverBorder: string;
}

/* ─── Status badge config ─────────────────────────────── */
const STATUS_CONFIG: Record<
  StatusKey,
  { bg: string; icon: string }
> = {
  Leased: { bg: "bg-emerald-500", icon: "check_circle" },
  Pending: { bg: "bg-amber-500", icon: "schedule" },
  "Under Review": { bg: "bg-blue-500", icon: "history_edu" },
  Vacant: { bg: "bg-slate-500", icon: "crop_free" },
};

/* ─── Action button styles ───────────────────────────── */
const ACTION_STYLES: Record<string, string> = {
  manage:
    "rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors",
  review:
    "rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition-colors shadow-sm shadow-accent/20",
  docs: "rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors",
  boost:
    "rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors",
};

/* ─── Static land data ────────────────────────────────── */
const assets: AssetCard[] = [
  {
    id: "PL-A401",
    name: "Highland North",
    location: "Nairobi County, Zone 4",
    status: "Leased",
    size: "3.5 Acres",
    soilType: "Loam (Rich)",
    col3Label: "Tenant",
    col3Value: (
      <div className="flex items-center gap-1.5 mt-0.5">
        <img
          src="https://ui-avatars.com/api/?name=John+Doe&background=e2e8f0&color=475569&size=32"
          alt="John Doe"
          className="h-5 w-5 rounded-full object-cover"
        />
        <span className="text-sm font-semibold text-slate-800 truncate max-w-20">
          John Doe
        </span>
      </div>
    ),
    col4Label: "Expires",
    col4Value: "Dec 2024",
    revenueLabel: "Monthly Revenue",
    revenueValue: "Ksh 50,000",
    revenueColor: "text-primary",
    actionLabel: "Manage",
    actionStyle: "manage",
    hoverBorder: "hover:border-primary/40",
  },
  {
    id: "PL-B205",
    name: "Eastern Ridge",
    location: "Machakos County, Zone 2",
    status: "Pending",
    size: "2.0 Acres",
    soilType: "Red Clay",
    col3Label: "Top Bidder",
    col3Value: (
      <div className="flex items-center gap-1.5 mt-0.5">
        <img
          src="https://ui-avatars.com/api/?name=Jane+Smith&background=e2e8f0&color=475569&size=32"
          alt="Jane Smith"
          className="h-5 w-5 rounded-full object-cover"
        />
        <span className="text-sm font-semibold text-slate-800 truncate max-w-20">
          Jane Smith
        </span>
      </div>
    ),
    col4Label: "Bids",
    col4Value: "3 Active",
    revenueLabel: "Current Top Offer",
    revenueValue: "Ksh 45,000",
    revenueColor: "text-accent",
    actionLabel: "Review",
    actionStyle: "review",
    hoverBorder: "hover:border-accent/40",
  },
  {
    id: "PL-C109",
    name: "Valley Farms",
    location: "Nakuru County, Zone 1",
    status: "Under Review",
    size: "5.0 Acres",
    soilType: "Volcanic Silt",
    col3Label: "Applicant",
    col3Value: (
      <div className="flex items-center gap-1.5 mt-0.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
          MK
        </div>
        <span className="text-sm font-semibold text-slate-800 truncate max-w-20">
          Michael K.
        </span>
      </div>
    ),
    col4Label: "Stage",
    col4Value: "Doc Check",
    revenueLabel: "Proposed Revenue",
    revenueValue: "Ksh 60,000",
    revenueColor: "text-blue-600",
    actionLabel: "Docs",
    actionStyle: "docs",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    id: "PL-D450",
    name: "River Side Plot",
    location: "Kisumu County, Zone 7",
    status: "Vacant",
    size: "1.2 Acres",
    soilType: "Alluvial",
    col3Label: "Last Crop",
    col3Value: (
      <span className="text-sm font-semibold text-slate-800">Rice</span>
    ),
    col4Label: "Listed",
    col4Value: "2 days ago",
    revenueLabel: "Listing Price",
    revenueValue: "Ksh 25,000",
    revenueColor: "text-slate-700",
    actionLabel: "Boost",
    actionStyle: "boost",
    hoverBorder: "hover:border-slate-400/40",
  },
  {
    id: "PL-E220",
    name: "Sunset Orchards",
    location: "Kiambu County, Zone 5",
    status: "Leased",
    size: "8.0 Acres",
    soilType: "Red Loam",
    col3Label: "Tenant",
    col3Value: (
      <div className="flex items-center gap-1.5 mt-0.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
          GL
        </div>
        <span className="text-sm font-semibold text-slate-800 truncate max-w-20">
          GreenLeaf
        </span>
      </div>
    ),
    col4Label: "Expires",
    col4Value: "Jun 2025",
    revenueLabel: "Monthly Revenue",
    revenueValue: "Ksh 120,000",
    revenueColor: "text-primary",
    actionLabel: "Manage",
    actionStyle: "manage",
    hoverBorder: "hover:border-primary/40",
  },
];

/* ─── Page ────────────────────────────────────────────── */
export default function MyLandsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [soilFilter, setSoilFilter] = useState("");

  const filtered = assets.filter((a) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchSoil =
      !soilFilter || a.soilType.toLowerCase().includes(soilFilter.toLowerCase());
    return matchSearch && matchStatus && matchSoil;
  });
  return (
    <div className="p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className="text-3xl font-bold tracking-tight text-earth"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              My Lands
            </h2>
            <p className="mt-2 text-slate-500">
              Manage your land plots, track soil health, and monitor leasing status.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-lg">download</span>
              Export
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-lg">checklist_rtl</span>
              Bulk Actions
            </button>
            <Link
              href="/owner/lands/add"
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add New Plot
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm border border-slate-200 lg:flex-row lg:items-center lg:justify-between">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {filtered.map((a) => {
            const { bg, icon } = STATUS_CONFIG[a.status];
            return (
              <div
                key={a.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg ${a.hoverBorder}`}
              >
                {/* Map thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 mini-map-pattern">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Plot ID chip */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      ID: {a.id}
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
                      {a.status}
                    </span>
                  </div>

                  {/* Plot name / location */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3
                      className="text-lg font-bold"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {a.name}
                    </h3>
                    <p className="text-xs font-medium opacity-90">{a.location}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4 grid grid-cols-2 gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Size</p>
                      <p className="text-sm font-semibold text-slate-800">{a.size}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Soil Type</p>
                      <p className="text-sm font-semibold text-slate-800">{a.soilType}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {a.col3Label}
                      </p>
                      {a.col3Value}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {a.col4Label}
                      </p>
                      <p className="text-sm font-semibold text-slate-800">{a.col4Value}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">{a.revenueLabel}</p>
                      <p className={`text-lg font-bold ${a.revenueColor}`}>{a.revenueValue}</p>
                    </div>
                    <button className={ACTION_STYLES[a.actionStyle]}>
                      {a.actionLabel}
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
  );
}
