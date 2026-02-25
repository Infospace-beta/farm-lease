"use client";

import { useState, useEffect } from "react";
import MiniMapThumb from "@/components/owner/MiniMapThumb";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";
import { ownerApi } from "@/lib/services/api";

type StatusKey = "pending" | "review" | "accepted" | "rejected";
type TabKey = "all" | StatusKey;

interface LeaseRequest {
  id: number;
  land: {
    id: number;
    title: string;
    location?: string;
  };
  lessee: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
  };
  proposed_start_date: string;
  proposed_end_date: string;
  proposed_rent?: number;
  message?: string;
  status: StatusKey;
  created_at: string;
}

const STATUS_STYLES: Record<
  StatusKey,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
  review: { bg: "bg-blue-100", text: "text-blue-700", label: "Under Review" },
  accepted: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    label: "Accepted",
  },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
};

export default function LeaseRequestsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [requests, setRequests] = useState<LeaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ownerApi.leaseRequests();
      setRequests(response.data);
    } catch (err: any) {
      console.error("Failed to load lease requests:", err);
      setError(err.response?.data?.detail || "Failed to load lease requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await ownerApi.approveLeaseRequest(id);
      loadRequests(); // Reload data
    } catch (err: any) {
      console.error("Failed to approve request:", err);
      alert(err.response?.data?.detail || "Failed to approve request");
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      await ownerApi.rejectLeaseRequest(id, reason);
      loadRequests(); // Reload data
    } catch (err: any) {
      console.error("Failed to reject request:", err);
      alert(err.response?.data?.detail || "Failed to reject request");
    }
  };

  // Calculate tab counts
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    review: requests.filter((r) => r.status === "review").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Requests" },
    { key: "pending", label: "Pending" },
    { key: "review", label: "Under Review" },
    { key: "accepted", label: "Accepted" },
    { key: "rejected", label: "Rejected" },
  ];

  const filtered =
    tab === "all"
      ? requests
      : requests.filter((r) => r.status === tab);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return "1 week ago";
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

    if (diffMonths < 12) return `${diffMonths} Months`;
    const years = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;
    if (remainingMonths === 0) return `${years} Year${years > 1 ? 's' : ''}`;
    return `${years} Year${years > 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Lease Requests"
        subtitle="Review and respond to incoming lease applications for your lands."
      >
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <span className="material-symbols-outlined text-base">
            download
          </span>
          Export
        </button>
      </OwnerPageHeader>
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="mx-auto max-w-5xl">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-slate-500">Loading lease requests...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadRequests}
                className="mt-3 text-sm font-semibold text-red-700 hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Tabs */}
              <div className="mb-5 flex gap-1 rounded-lg bg-white border border-slate-200 p-1 overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      tab === t.key
                        ? "bg-primary text-white shadow"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        tab === t.key
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {counts[t.key]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">
                    inbox
                  </span>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">
                    No lease requests found
                  </h3>
                  <p className="text-sm text-slate-500">
                    {tab === "all"
                      ? "You haven't received any lease requests yet."
                      : `No ${tab} requests at the moment.`}
                  </p>
                </div>
              )}

              {/* Request cards */}
              <div className="space-y-4">
                {filtered.map((req) => {
                  const s = STATUS_STYLES[req.status];
                  const isExpanded = expanded === req.id;
                  const applicantName = `${req.lessee.first_name} ${req.lessee.last_name}`;
                  const duration = calculateDuration(req.proposed_start_date, req.proposed_end_date);
                  const submitted = formatDate(req.created_at);

                  return (
                    <div
                      key={req.id}
                      className="rounded-lg bg-white border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Card header */}
                      <button
                        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
                        onClick={() => setExpanded(isExpanded ? null : req.id)}
                      >
                        {/* Avatar */}
                        {req.lessee.profile_image ? (
                          <img
                            src={req.lessee.profile_image}
                            alt={applicantName}
                            className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 shrink-0">
                            {getInitials(req.lessee.first_name, req.lessee.last_name)}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-800">
                              {applicantName}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}
                            >
                              {s.label}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            <span className="font-medium text-slate-700">
                              {req.land.title}
                            </span>
                            {req.land.location && ` · ${req.land.location}`} · {submitted}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          {req.proposed_rent && (
                            <p className="text-sm font-bold text-primary">
                              Ksh {req.proposed_rent.toLocaleString()}
                            </p>
                          )}
                          <p className="text-xs text-slate-400">{duration}</p>
                        </div>

                        <span
                          className="material-symbols-outlined text-slate-400 ml-2 transition-transform"
                          style={{
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          }}
                        >
                          expand_more
                        </span>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 p-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Mini map */}
                            <div className="rounded-xl overflow-hidden">
                              <MiniMapThumb
                                plotId={`PL-${req.land.id}`}
                                name={req.land.title}
                                location={req.land.location || "Unknown"}
                                status={
                                  req.status === "accepted"
                                    ? "leased"
                                    : req.status === "review"
                                      ? "review"
                                      : req.status === "rejected"
                                        ? "vacant"
                                        : "pending"
                                }
                                seed={req.id % 5}
                              />
                            </div>

                            {/* Details */}
                            <div className="sm:col-span-2 space-y-4">
                              {req.message && (
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                                    Message
                                  </p>
                                  <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">
                                    {req.message}
                                  </p>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Request ID
                                  </p>
                                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                                    REQ-{req.id.toString().padStart(3, "0")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Duration
                                  </p>
                                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                                    {duration}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Start Date
                                  </p>
                                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                                    {new Date(req.proposed_start_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    End Date
                                  </p>
                                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                                    {new Date(req.proposed_end_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {(req.status === "pending" ||
                                req.status === "review") && (
                                  <div className="flex gap-3 pt-2">
                                    <button
                                      onClick={() => handleApprove(req.id)}
                                      className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-sm shadow-primary/30"
                                    >
                                      <span className="material-symbols-outlined text-lg">
                                        check_circle
                                      </span>
                                      Accept Request
                                    </button>
                                    <button
                                      onClick={() => handleReject(req.id)}
                                      className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
                                    >
                                      <span className="material-symbols-outlined text-lg">
                                        cancel
                                      </span>
                                      Decline
                                    </button>
                                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                                      <span className="material-symbols-outlined text-lg">
                                        chat
                                      </span>
                                      Message
                                    </button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
