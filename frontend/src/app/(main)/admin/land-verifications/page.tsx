"use client";

import { useState, useEffect, useCallback } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { landsApi } from "@/lib/services/api";
import {
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  FileText,
  Filter,
  Loader2,
} from "lucide-react";

interface LandListing {
  id: number;
  title: string;
  description: string;
  total_area: number;
  price_per_month: number;
  title_deed_number: string;
  location_name: string;
  latitude: number;
  longitude: number;
  status: string;
  is_verified: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  owner: number;
  owner_username: string;
  owner_email: string;
  created_at: string;
  images: { id: number; image: string }[];
  has_irrigation: boolean;
  has_electricity: boolean;
  has_road_access: boolean;
  has_fencing: boolean;
}

interface Stats {
  total_lands: number;
  pending_verification: number;
  verified: number;
  flagged: number;
}

const filterOptions = [
  { value: "pending", label: "Pending Verification", icon: AlertTriangle, color: "text-amber-600" },
  { value: "verified", label: "Verified", icon: CheckCircle, color: "text-emerald-600" },
  { value: "flagged", label: "Flagged", icon: XCircle, color: "text-red-600" },
  { value: "all", label: "All Lands", icon: Filter, color: "text-slate-600" },
];

export default function LandVerificationsPage() {
  const [lands, setLands] = useState<LandListing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "flagged">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedLand, setSelectedLand] = useState<LandListing | null>(null);
  const [flagReason, setFlagReason] = useState("");
  const [showFlagModal, setShowFlagModal] = useState(false);

  const fetchLands = useCallback(async () => {
    setLoading(true);
    try {
      const [landsRes, statsRes] = await Promise.all([
        landsApi.adminAllLands(filter),
        landsApi.adminStats(),
      ]);
      setLands(landsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch lands:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchLands();
  }, [fetchLands]);

  const handleVerify = async (landId: number) => {
    setActionLoading(landId);
    try {
      await landsApi.verifyLand(landId);
      await fetchLands();
    } catch (error) {
      console.error("Failed to verify land:", error);
      alert("Failed to verify land. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFlag = async () => {
    if (!selectedLand || !flagReason.trim()) return;
    setActionLoading(selectedLand.id);
    try {
      await landsApi.flagLand(selectedLand.id, flagReason);
      setShowFlagModal(false);
      setFlagReason("");
      setSelectedLand(null);
      await fetchLands();
    } catch (error) {
      console.error("Failed to flag land:", error);
      alert("Failed to flag land. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const openFlagModal = (land: LandListing) => {
    setSelectedLand(land);
    setFlagReason(land.flag_reason || "");
    setShowFlagModal(true);
  };

  const filteredLands = lands.filter(
    (land) =>
      land.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.owner_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.title_deed_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      land.location_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <AdminPageHeader
        title="Land Verifications"
        subtitle="Review and verify land listings before they appear to farmers/lessees"
      >
        <button
          onClick={fetchLands}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </AdminPageHeader>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{stats.total_lands}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Lands</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">{stats.pending_verification}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{stats.verified}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Verified</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{stats.flagged}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Flagged</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = filter === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value as typeof filter)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-[#0f392b] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : opt.color}`} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {/* Search */}
            <div className="relative flex-1 md:max-w-xs ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, owner, deed..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f392b]/20"
              />
            </div>
          </div>
        </div>

        {/* Lands List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f392b]" />
          </div>
        ) : filteredLands.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No lands found</h3>
            <p className="text-gray-500 text-sm">
              {filter === "pending"
                ? "There are no lands pending verification at the moment."
                : "No lands match your current filter criteria."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLands.map((land) => (
              <div
                key={land.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition hover:shadow-md ${
                  land.is_flagged
                    ? "border-red-200"
                    : land.is_verified
                    ? "border-emerald-200"
                    : "border-amber-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  <div className="lg:w-48 h-40 lg:h-auto bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0">
                    {land.images?.[0]?.image ? (
                      <img
                        src={land.images[0].image}
                        alt={land.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <MapPin className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-slate-800">{land.title}</h3>
                          {land.is_verified && (
                            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                          )}
                          {land.is_flagged && (
                            <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                              <XCircle className="w-3 h-3" /> Flagged
                            </span>
                          )}
                          {!land.is_verified && !land.is_flagged && (
                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {land.location_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {land.owner_username}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(land.created_at)}
                          </span>
                        </div>

                        {/* Title Deed - ADMIN ONLY */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-1">
                            Title Deed Number (Admin Only)
                          </p>
                          <p className="text-sm font-mono font-bold text-amber-900">
                            {land.title_deed_number}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                            {land.total_area} acres
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                            Ksh {land.price_per_month.toLocaleString()}/month
                          </span>
                          {land.has_irrigation && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                              Irrigation
                            </span>
                          )}
                          {land.has_electricity && (
                            <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
                              Electricity
                            </span>
                          )}
                          {land.has_road_access && (
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                              Road Access
                            </span>
                          )}
                          {land.has_fencing && (
                            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                              Fencing
                            </span>
                          )}
                        </div>

                        {land.is_flagged && land.flag_reason && (
                          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-xs font-bold text-red-800 uppercase tracking-wide mb-1">
                              Flag Reason
                            </p>
                            <p className="text-sm text-red-700">{land.flag_reason}</p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row lg:flex-col gap-2 mt-2 lg:mt-0 flex-shrink-0">
                        {!land.is_verified && (
                          <button
                            onClick={() => handleVerify(land.id)}
                            disabled={actionLoading === land.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            {actionLoading === land.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Verify
                          </button>
                        )}
                        {!land.is_flagged && (
                          <button
                            onClick={() => openFlagModal(land)}
                            disabled={actionLoading === land.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            Flag
                          </button>
                        )}
                        {land.is_flagged && (
                          <button
                            onClick={() => handleVerify(land.id)}
                            disabled={actionLoading === land.id}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            {actionLoading === land.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Unflag & Verify
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flag Modal */}
      {showFlagModal && selectedLand && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-slate-800">Flag Land Listing</h3>
              <p className="text-sm text-slate-500 mt-1">
                Provide a reason for flagging &ldquo;{selectedLand.title}&rdquo;
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for Flagging
              </label>
              <textarea
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                placeholder="e.g., Invalid title deed number, suspicious listing details..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
              />
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowFlagModal(false);
                  setSelectedLand(null);
                  setFlagReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFlag}
                disabled={!flagReason.trim() || actionLoading === selectedLand.id}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {actionLoading === selectedLand.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Flag Land
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
