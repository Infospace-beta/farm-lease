"use client";

import Link from "next/link";
import LesseePageHeader from "@/components/lessee/LesseePageHeader";

import { useEffect, useState } from "react";
import { lesseeApi } from "@/lib/services/api";

type HistoryItem = {
  id: number;
  created_at: string;
  mode?: string;
  query?: string;
  top_crop?: string;
  match?: number | null;
};

export default function AIPredictorHistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await lesseeApi.predictionHistory();
        const data = res.data;
        const results: HistoryItem[] = Array.isArray(data) ? data : (data?.results ?? []);
        if (mounted) setItems(results);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <LesseePageHeader
        title="AI Crop Predictor"
        subtitle="Review past soil and climate analysis results to track trends over time."
      >
        <div className="flex bg-gray-100 rounded-lg border border-gray-200 p-1 shadow-sm">
          <Link
            href="/lessee/ai-predictor"
            className="px-4 py-2 text-gray-500 hover:bg-white rounded text-xs font-bold uppercase tracking-wide transition-colors"
          >
            Predictor
          </Link>
          <button className="px-4 py-2 bg-sidebar-bg text-white rounded text-xs font-bold uppercase tracking-wide shadow-sm">
            History
          </button>
        </div>
      </LesseePageHeader>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Prediction History Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] p-6 lg:p-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3
                className="font-bold text-2xl text-gray-900"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Prediction History
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Showing last 6 months of analysis
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by crop, region..."
                  className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-sidebar-bg w-60 shadow-sm"
                />
              </div>
              <div className="relative">
                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  calendar_today
                </span>
                <input
                  type="text"
                  placeholder="Filter by date"
                  className="pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-sidebar-bg w-48 shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-sidebar-bg text-white rounded-xl text-sm font-medium hover:bg-[#0a261c] transition shadow-lg">
                <span className="material-icons-round text-sm">download</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-4 pr-6">Date</th>
                  <th className="py-4 pr-6">Analysis Mode</th>
                  <th className="py-4 pr-6">Search Query</th>
                  <th className="py-4 pr-6">Top Recommendation</th>
                  <th className="py-4 pr-6 text-center">Match %</th>
                  <th className="py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                      Loading history…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                      No prediction history yet.
                    </td>
                  </tr>
                ) : items.map((item) => {
                  const dt = item.created_at ? new Date(item.created_at) : null;
                  const date = dt ? dt.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "2-digit" }) : "—";
                  const time = dt ? dt.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" }) : "—";

                  const normalizedMode = (item.mode || "").toLowerCase();
                  const modeLabel = normalizedMode === "regional" ? "Regional Data" : "Manual Entry";
                  const crop = item.top_crop || "—";
                  const matchNum = typeof item.match === "number" ? item.match : null;
                  const matchText = matchNum === null ? "—" : `${matchNum}%`;
                  const matchColor = matchNum !== null && matchNum < 80 ? "text-orange-500" : "text-sidebar-bg";

                  return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-5 pr-6">
                      <p className="text-sm font-semibold text-gray-800">
                        {date}
                      </p>
                      <p className="text-xs text-gray-400">{time}</p>
                    </td>
                    <td className="py-5 pr-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${modeLabel === "Regional Data"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                          }`}
                      >
                        <span className="material-icons-round text-[12px]">
                          {modeLabel === "Regional Data" ? "public" : "edit"}
                        </span>
                        {modeLabel}
                      </span>
                    </td>
                    <td className="py-5 pr-6">
                      <p className="text-sm text-gray-700 font-medium">
                        {item.query || "—"}
                      </p>
                    </td>
                    <td className="py-5 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sidebar-bg/10 flex items-center justify-center text-sidebar-bg shrink-0">
                          <span className="material-icons-round text-sm">
                            grain
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {crop}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 pr-6 text-center">
                      <span className={`text-sm font-bold ${matchColor}`}>
                        {matchText}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button className="inline-flex items-center gap-1 text-xs font-bold text-sidebar-bg hover:underline">
                        View Full Report
                        <span className="material-icons-round text-sm">
                          arrow_forward
                        </span>
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
