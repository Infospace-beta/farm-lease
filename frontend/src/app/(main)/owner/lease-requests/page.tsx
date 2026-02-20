"use client";

import { useState } from "react";
import PageHeader from "@/components/owner/PageHeader";
import MiniMapThumb from "@/components/owner/MiniMapThumb";

type StatusKey = "pending" | "review" | "accepted" | "rejected";
type TabKey = "all" | StatusKey;

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: "all",      label: "All Requests",  count: 8 },
  { key: "pending",  label: "Pending",        count: 3 },
  { key: "review",   label: "Under Review",   count: 2 },
  { key: "accepted", label: "Accepted",       count: 2 },
  { key: "rejected", label: "Rejected",       count: 1 },
];

const requests = [
  {
    id: "REQ-001", plotId: "PL-A401", plotName: "Highland North",
    location: "Nairobi County, Zone 4", status: "pending" as const,
    applicant: "John Doe",   avatar: "https://ui-avatars.com/api/?name=John+Doe&background=e2e8f0&color=475569&size=40",
    offer: "Ksh 50,000", duration: "1 Year", submitted: "2 days ago",
    message: "I have 5 years of maize farming experience and would like to lease this plot for commercial production.",
  },
  {
    id: "REQ-002", plotId: "PL-B205", plotName: "Eastern Ridge",
    location: "Machakos County, Zone 2", status: "pending" as const,
    applicant: "Jane Smith", avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=e2e8f0&color=475569&size=40",
    offer: "Ksh 45,000", duration: "2 Years", submitted: "3 days ago",
    message: "Interested in organic vegetable farming. I have all required certifications.",
  },
  {
    id: "REQ-003", plotId: "PL-C109", plotName: "Valley Farms",
    location: "Nakuru County, Zone 1", status: "review" as const,
    applicant: "Michael K.", avatar: null, initials: "MK",
    offer: "Ksh 60,000", duration: "3 Years", submitted: "5 days ago",
    message: "I represent GreenLeaf Farms Ltd. We specialise in horticulture exports.",
  },
  {
    id: "REQ-004", plotId: "PL-D450", plotName: "River Side Plot",
    location: "Kisumu County, Zone 7", status: "review" as const,
    applicant: "Peter W.", avatar: "https://ui-avatars.com/api/?name=Peter+W&background=e2e8f0&color=475569&size=40",
    offer: "Ksh 28,000", duration: "1 Year", submitted: "1 week ago",
    message: "Looking to grow rice, which suits the alluvial soil of this plot perfectly.",
  },
  {
    id: "REQ-005", plotId: "PL-E220", plotName: "Sunset Orchards",
    location: "Kiambu County, Zone 5", status: "accepted" as const,
    applicant: "GreenLeaf Co.", avatar: null, initials: "GL",
    offer: "Ksh 120,000", duration: "2 Years", submitted: "2 weeks ago",
    message: "GreenLeaf Co. is an established orchard management firm with 10+ years experience.",
  },
  {
    id: "REQ-006", plotId: "PL-A401", plotName: "Highland North",
    location: "Nairobi County, Zone 4", status: "rejected" as const,
    applicant: "Sam O.", avatar: "https://ui-avatars.com/api/?name=Sam+O&background=e2e8f0&color=475569&size=40",
    offer: "Ksh 30,000", duration: "6 Months", submitted: "3 weeks ago",
    message: "Interested in short-term lease for wheat planting season.",
  },
];

const STATUS_STYLES: Record<StatusKey, { bg: string; text: string; label: string }> = {
  pending:  { bg: "bg-amber-100",   text: "text-amber-700",   label: "Pending" },
  review:   { bg: "bg-blue-100",    text: "text-blue-700",    label: "Under Review" },
  accepted: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Accepted" },
  rejected: { bg: "bg-red-100",     text: "text-red-700",     label: "Rejected" },
};

export default function LeaseRequestsPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, StatusKey>>({});

  const getStatus = (id: string, def: StatusKey): StatusKey => localStatuses[id] ?? def;

  const filtered = (tab === "all" ? requests : requests.filter((r) => getStatus(r.id, r.status) === tab));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader
            title="Lease Requests"
            description="Review and respond to incoming lease applications for your lands."
            actions={[
              { label: "Export", icon: "download" },
            ]}
          />

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
                  tab === t.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Request cards */}
        <div className="space-y-4">
          {filtered.map((req) => {
            const s = STATUS_STYLES[getStatus(req.id, req.status)];
            const isExpanded = expanded === req.id;
            const effectiveStatus = getStatus(req.id, req.status);

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
                  {req.avatar ? (
                    <img src={req.avatar} alt={req.applicant}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold border border-primary/20 shrink-0">
                      {(req as { initials?: string }).initials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">{req.applicant}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      <span className="font-medium text-slate-700">{req.plotName}</span>
                      {" · "}{req.location} · {req.submitted}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{req.offer}</p>
                    <p className="text-xs text-slate-400">{req.duration}</p>
                  </div>

                  <span className="material-symbols-outlined text-slate-400 ml-2 transition-transform"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
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
                          plotId={req.plotId}
                          name={req.plotName}
                          location={req.location}
                          status={req.status === "accepted" ? "leased" : req.status === "review" ? "review" : req.status === "rejected" ? "vacant" : "pending"}
                          seed={req.id.charCodeAt(4) % 5}
                        />
                      </div>

                      {/* Details */}
                      <div className="sm:col-span-2 space-y-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Message</p>
                          <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{req.message}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Request ID</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">{req.id}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</p>
                            <p className="text-sm font-bold text-slate-800 mt-0.5">{req.duration}</p>
                          </div>
                        </div>

                        {(effectiveStatus === "pending" || effectiveStatus === "review") && (
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setLocalStatuses(prev => ({ ...prev, [req.id]: "accepted" }))}
                              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-all shadow-sm shadow-primary/30">
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                              Accept Request
                            </button>
                            <button
                              onClick={() => setLocalStatuses(prev => ({ ...prev, [req.id]: "rejected" }))}
                              className="flex items-center gap-2 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
                              <span className="material-symbols-outlined text-lg">cancel</span>
                              Decline
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                              <span className="material-symbols-outlined text-lg">chat</span>
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
      </div>
    </div>
    </div>
  );
}
