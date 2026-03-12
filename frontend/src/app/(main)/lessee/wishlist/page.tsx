"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";

// ── Matches the Listing type in browse/page.tsx ──────────────
type Listing = {
  name: string;
  acresNum: number;
  location: string;
  region: string;
  price: string;
  soil: string;
  water: string;
  slope: string;
  badge: string;
  badgeColor: string;
  match: string | null;
  matchColor: string;
  status: string | null;
  photoUrl?: string;
};

export default function WishlistPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // ── Load from localStorage on mount ───────────────────────
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("fl_wishlist") ?? "{}",
      ) as Record<string, Listing>;
      setItems(Object.values(stored));
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  // ── Remove a listing from wishlist ─────────────────────────
  function removeListing(name: string) {
    setItems((prev) => prev.filter((l) => l.name !== name));
    try {
      const stored = JSON.parse(
        localStorage.getItem("fl_wishlist") ?? "{}",
      ) as Record<string, Listing>;
      delete stored[name];
      localStorage.setItem("fl_wishlist", JSON.stringify(stored));
    } catch { /* ignore */ }
    if (selectedListing?.name === name) setSelectedListing(null);
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <LesseePageHeader
        title="My Wishlist"
        subtitle="Land listings you've saved for future consideration."
      >
        {items.length > 0 && (
          <span className="bg-emerald-50 border border-emerald-200 text-[#047857] text-xs font-bold px-3 py-1.5 rounded-full">
            {items.length} saved listing{items.length !== 1 ? "s" : ""}
          </span>
        )}
        <Link
          href="/lessee/browse"
          className="flex items-center gap-1.5 bg-[#047857] hover:bg-emerald-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow transition-colors"
        >
          <span className="material-icons-round text-base">landscape</span>
          Browse More Land
        </Link>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {!loaded ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-5">
              <span className="material-icons-round text-5xl text-red-200">favorite_border</span>
            </div>
            <h3
              className="text-2xl font-bold text-gray-700 mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Your wishlist is empty
            </h3>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Tap the heart icon on any listing in Browse Land to save it here for easy access.
            </p>
            <Link
              href="/lessee/browse"
              className="mt-6 inline-flex items-center gap-2 bg-[#047857] hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-[#047857]/20 transition-colors text-sm"
            >
              <span className="material-icons-round text-base">landscape</span>
              Start Browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1400px]">
            {items.map((listing) => (
              <div
                key={listing.name}
                className="bg-white rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#047857]/20 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {listing.photoUrl ? (
                    <img
                      src={listing.photoUrl}
                      alt={listing.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                      <span className="material-icons-round text-[#0f392b]/20 text-[80px]">landscape</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                  {/* Acres */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800">
                      {listing.acresNum} Acres
                    </span>
                  </div>
                  {/* Remove from wishlist */}
                  <button
                    onClick={() => removeListing(listing.name)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-1.5 rounded-full text-white transition-all shadow"
                    title="Remove from wishlist"
                  >
                    <span className="material-icons-round text-base">favorite</span>
                  </button>
                  {/* Badge */}
                  <span
                    className={`absolute bottom-3 left-3 ${listing.badgeColor} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm`}
                  >
                    {listing.badge}
                  </span>
                  {/* Match badge */}
                  {listing.match && (
                    <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-[10px] font-extrabold text-[#047857] px-2 py-0.5 rounded shadow">
                      {listing.match} match
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="pt-4 px-5 pb-5 flex flex-col flex-1">
                  <h4
                    className="font-bold text-lg text-gray-900 mb-1"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {listing.name}
                  </h4>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span className="material-icons-round text-sm mr-1">location_on</span>
                      {listing.location}
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-sm font-bold text-[#047857] whitespace-nowrap">
                        Ksh {listing.price}
                        <span className="text-[10px] font-normal text-gray-400">/acre/yr</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
                    <div className="text-center">
                      <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">Soil</div>
                      <div className="text-xs font-medium text-gray-600">{listing.soil}</div>
                    </div>
                    <div className="text-center border-l border-r border-gray-100">
                      <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">Water</div>
                      <div className="text-xs font-medium text-gray-600 truncate">{listing.water}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide">Slope</div>
                      <div className="text-xs font-medium text-gray-600">{listing.slope}</div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <button className="flex-1 bg-[#047857] hover:bg-emerald-800 text-white text-xs font-bold py-2 rounded-xl shadow transition-colors">
                      Request Lease
                    </button>
                    <button
                      onClick={() => setSelectedListing(listing)}
                      className="text-xs font-bold text-[#047857] flex items-center hover:text-emerald-700 transition-colors"
                    >
                      Details
                      <span className="material-icons-round text-sm ml-0.5">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Listing Detail Modal ────────────────────────────── */}
      {selectedListing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedListing(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-52 bg-gray-200 rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[#0f392b]/10 flex items-center justify-center">
                <span className="material-icons-round text-[#0f392b]/20 text-[100px]">landscape</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-bold text-gray-800 shadow">
                {selectedListing.acresNum} Acres
              </span>
              <span className={`absolute bottom-4 left-4 ${selectedListing.badgeColor} text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide shadow`}>
                {selectedListing.badge}
              </span>
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
              >
                <span className="material-icons-round text-xl">close</span>
              </button>
            </div>

            <div className="p-6">
              {/* Name + price */}
              <div className="flex items-start justify-between mb-1">
                <h2
                  className="text-2xl font-bold text-gray-900 leading-tight"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {selectedListing.name}
                </h2>
                <div className="text-right ml-4 shrink-0">
                  <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Lease Price</div>
                  <div className="text-lg font-bold text-[#047857] whitespace-nowrap">
                    Ksh {selectedListing.price}
                    <span className="text-xs font-normal text-gray-400">/acre/yr</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-5">
                <span className="material-icons-round text-base mr-1 text-[#047857]">location_on</span>
                {selectedListing.location}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 py-4 px-4 bg-[#f8fafc] rounded-xl mb-5">
                <div className="text-center">
                  <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide mb-1">Soil</div>
                  <div className="text-sm font-semibold text-gray-700">{selectedListing.soil}</div>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide mb-1">Water</div>
                  <div className="text-sm font-semibold text-gray-700">{selectedListing.water}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-[#5D4037] font-bold uppercase tracking-wide mb-1">Slope</div>
                  <div className="text-sm font-semibold text-gray-700">{selectedListing.slope}</div>
                </div>
              </div>

              {/* Match / Status */}
              {selectedListing.match && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${selectedListing.matchColor}`}>
                    {selectedListing.match}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#047857]">Compatibility Match</p>
                    <p className="text-xs text-gray-500">Based on your stated farm preferences and selected regions.</p>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-[#047857] hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow transition-colors text-sm">
                  Request Lease
                </button>
                <button
                  onClick={() => removeListing(selectedListing.name)}
                  className="flex-1 border-2 border-red-400 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-1.5"
                >
                  <span className="material-icons-round text-base">favorite</span>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
