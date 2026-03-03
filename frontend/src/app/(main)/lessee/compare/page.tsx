"use client";

import { useState } from "react";
import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";

type CropPill = { label: string; color: string };

type FarmAsset = {
  id: string;
  name: string;
  location: string;
  waterIcon: string;
  soilMatchPct: number;
  soilMatchNote: string;
  soilMatchBarColor: string;
  soilMatchTextColor: string;
  leasePrice: string;
  acreage: string;
  scaleLabel: string;
  scaleColor: string;
  waterLabel: string;
  waterNote: string;
  crops: CropPill[];
  verifiedDate: string;
  isBestMatch?: boolean;
};

const INITIAL_ASSETS: FarmAsset[] = [
  {
    id: "A42",
    name: "Rift Valley – Plot A42",
    location: "Nakuru County, Kenya",
    waterIcon: "water_drop",
    soilMatchPct: 94,
    soilMatchNote: "Excellent pH balance for Maize & Wheat",
    soilMatchBarColor: "bg-[#047857]",
    soilMatchTextColor: "text-[#047857]",
    leasePrice: "Ksh 15,000",
    acreage: "50 Acres",
    scaleLabel: "Large Scale",
    scaleColor: "bg-green-100 text-green-700",
    waterLabel: "High Reliability",
    waterNote: "Borehole on site + Seasonal River",
    crops: [
      { label: "Maize", color: "bg-yellow-100 text-yellow-800 border border-yellow-200" },
      { label: "Wheat", color: "bg-amber-100 text-amber-800 border border-amber-200" },
      { label: "Peas",  color: "bg-green-100 text-green-800 border border-green-200"  },
    ],
    verifiedDate: "Oct 12, 2023",
    isBestMatch: true,
  },
  {
    id: "B18",
    name: "Narok Prime – Plot B18",
    location: "Narok County, Kenya",
    waterIcon: "wb_sunny",
    soilMatchPct: 89,
    soilMatchNote: "Slightly alkaline, good for Barley",
    soilMatchBarColor: "bg-[#8d6e63]",
    soilMatchTextColor: "text-[#8d6e63]",
    leasePrice: "Ksh 12,000",
    acreage: "12 Acres",
    scaleLabel: "Small Scale",
    scaleColor: "bg-blue-100 text-blue-700",
    waterLabel: "Moderate",
    waterNote: "Rain-fed dependence, no borehole",
    crops: [
      { label: "Barley", color: "bg-amber-100 text-amber-800 border border-amber-200" },
      { label: "Beans",  color: "bg-red-100 text-red-800 border border-red-200"       },
    ],
    verifiedDate: "Nov 05, 2023",
  },
];

export default function CompareFarmAssetsPage() {
  const [assets, setAssets] = useState<FarmAsset[]>(INITIAL_ASSETS);

  function removeAsset(id: string) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <LesseePageHeader
        title="Compare Farm Assets"
        subtitle="Side-by-side analysis of AI-recommended land plots based on your crop preferences."
      >
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <span className="material-icons-round text-lg">share</span>
            Share Comparison
          </button>
          <button className="px-5 py-2.5 bg-[#047857] text-white rounded-lg text-sm font-bold shadow-lg shadow-[#047857]/30 hover:bg-[#0f392b] flex items-center gap-2 transition-colors">
            <span className="material-icons-round text-lg">file_download</span>
            Export PDF
          </button>
        </div>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/lessee/ai-predictor"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-gray-400 hover:text-[#047857] transition-colors"
          >
            <span className="material-icons-round text-sm">arrow_back</span>
            Back to Results
          </Link>
        </div>

        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="material-icons-round text-6xl text-gray-200 mb-4">landscape</span>
            <p className="text-gray-400 font-medium">No assets left to compare.</p>
            <Link
              href="/lessee/ai-predictor"
              className="mt-4 text-sm font-bold text-[#047857] hover:underline"
            >
              ← Back to AI Predictor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-[1200px] mx-auto pb-12">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className={`bg-white rounded-2xl overflow-hidden flex flex-col relative ${
                  asset.isBestMatch
                    ? "border border-[#13ec80]/40 shadow-xl ring-4 ring-[#13ec80]/10"
                    : "border border-gray-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]"
                }`}
              >
                {/* Best match accent bar */}
                {asset.isBestMatch && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#13ec80] to-[#047857] z-20" />
                )}

                {/* Image area */}
                <div className="relative h-64 bg-gray-200 overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                    <span className="material-icons-round text-[#0f392b]/20 text-[120px]">landscape</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Best match badge */}
                  {asset.isBestMatch && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-[#047857] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <span className="material-icons-round text-sm">verified</span>
                        Best Match
                      </span>
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeAsset(asset.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-sm z-20"
                    aria-label="Remove from comparison"
                  >
                    <span className="material-icons-round text-lg">close</span>
                  </button>

                  {/* Overlay title */}
                  <div className="absolute bottom-0 inset-x-0 p-6 pt-20">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3
                          className="text-white text-2xl font-bold mb-1"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          {asset.name}
                        </h3>
                        <p className="text-gray-300 text-sm flex items-center gap-1">
                          <span className="material-icons-round text-sm">location_on</span>
                          {asset.location}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                        <span className="material-icons-round text-[#13ec80] text-2xl">
                          {asset.waterIcon}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="flex-1 flex flex-col">
                  <div className="divide-y divide-gray-100">

                    {/* Soil Match */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Soil Match</div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`${asset.soilMatchBarColor} h-2.5 rounded-full`}
                              style={{ width: `${asset.soilMatchPct}%` }}
                            />
                          </div>
                          <span className={`${asset.soilMatchTextColor} font-bold text-lg shrink-0`}>
                            {asset.soilMatchPct}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{asset.soilMatchNote}</p>
                      </div>
                    </div>

                    {/* Lease Price */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Lease Price</div>
                      <div className="col-span-2">
                        <span className="text-2xl font-bold text-[#5D4037]">{asset.leasePrice}</span>
                        <span className="text-sm text-gray-500"> / acre / year</span>
                      </div>
                    </div>

                    {/* Acreage */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Acreage</div>
                      <div className="col-span-2 flex items-center gap-2">
                        <span className="material-icons-round text-gray-400 text-lg">square_foot</span>
                        <span className="font-bold text-gray-700">{asset.acreage}</span>
                        <span className={`${asset.scaleColor} text-[10px] px-2 py-0.5 rounded font-bold uppercase ml-auto`}>
                          {asset.scaleLabel}
                        </span>
                      </div>
                    </div>

                    {/* Water Availability */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Water Availability</div>
                      <div className="col-span-2">
                        <p className="font-bold text-gray-700 mb-0.5">{asset.waterLabel}</p>
                        <p className="text-xs text-gray-500">{asset.waterNote}</p>
                      </div>
                    </div>

                    {/* Crop Suitability */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">Crop Suitability</div>
                      <div className="col-span-2 flex flex-wrap gap-2">
                        {asset.crops.map((c) => (
                          <span
                            key={c.label}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}
                          >
                            {c.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-6 mt-auto border-t border-gray-100 bg-gray-50/50">
                    <button
                      className={`w-full py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider group transition-all ${
                        asset.isBestMatch
                          ? "bg-[#047857] text-white shadow-[#047857]/20 hover:bg-[#0f392b]"
                          : "bg-white border-2 border-[#047857] text-[#047857] hover:bg-[#047857] hover:text-white"
                      }`}
                    >
                      Request Lease
                      <span className="material-icons-round group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-3">
                      Verified by FarmLease Agents on {asset.verifiedDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add placeholder column when only 1 asset remains */}
            {assets.length === 1 && (
              <Link
                href="/lessee/browse"
                className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl min-h-[400px] text-gray-400 hover:border-[#047857] hover:text-[#047857] transition-all group"
              >
                <div className="text-center">
                  <span className="material-icons-round text-4xl mb-2 group-hover:scale-110 transition-transform block">
                    add_circle_outline
                  </span>
                  <p className="text-sm font-bold">Add Another Farm to Compare</p>
                  <p className="text-xs mt-1">Browse available listings</p>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
