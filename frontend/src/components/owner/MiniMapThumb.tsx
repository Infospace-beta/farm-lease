import React from "react";
import StatusBadge from "./StatusBadge";

type StatusVariant = "leased" | "pending" | "review" | "vacant";

const SVG_PATHS = [
  "M10,10 L90,20 L80,80 L20,90 Z",
  "M15,15 L85,10 L95,70 L25,85 Z",
  "M30,10 L80,10 L90,90 L10,80 Z",
  "M20,15 L85,20 L80,85 L15,75 Z",
  "M10,20 L80,15 L90,80 L20,85 Z",
];

const SVG_FILLS: Record<StatusVariant, string> = {
  leased:  "fill-emerald-500/30",
  pending: "fill-amber-500/30",
  review:  "fill-blue-500/30",
  vacant:  "fill-slate-400/20",
};

interface Props {
  plotId: string;
  name: string;
  location: string;
  status: StatusVariant;
  statusLabel?: string;
  seed?: number; // 0-4 for SVG path variation
}

export default function MiniMapThumb({
  plotId,
  name,
  location,
  status,
  statusLabel,
  seed = 0,
}: Props) {
  const path = SVG_PATHS[seed % SVG_PATHS.length];
  const fill = SVG_FILLS[status];

  return (
    <div className="relative h-48 w-full overflow-hidden bg-slate-100 mini-map-pattern">
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

      {/* Plot ID chip */}
      <div className="absolute top-3 left-3">
        <span className="rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
          ID: {plotId}
        </span>
      </div>

      {/* Status badge */}
      <div className="absolute top-3 right-3">
        <StatusBadge variant={status} label={statusLabel} solid />
      </div>

      {/* SVG shape */}
      <svg
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 stroke-white ${fill} drop-shadow-lg`}
        viewBox="0 0 100 100"
      >
        <path d={path} strokeWidth="2" />
      </svg>

      {/* Plot name / location */}
      <div className="absolute bottom-3 left-3 right-3 text-white">
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {name}
        </h3>
        <p className="text-xs font-medium opacity-90">{location}</p>
      </div>
    </div>
  );
}
