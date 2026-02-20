import React from "react";

type Variant = "leased" | "pending" | "review" | "vacant" | "active" | "released" | "cancelled" | "signed" | "draft";

const CONFIG: Record<Variant, { bg: string; text: string; icon: string; label: string }> = {
  leased:    { bg: "bg-emerald-100", text: "text-emerald-700", icon: "check_circle", label: "Leased" },
  pending:   { bg: "bg-amber-100",   text: "text-amber-700",   icon: "schedule",     label: "Pending" },
  review:    { bg: "bg-blue-100",    text: "text-blue-700",    icon: "history_edu",  label: "Under Review" },
  vacant:    { bg: "bg-slate-100",   text: "text-slate-600",   icon: "crop_free",    label: "Vacant" },
  active:    { bg: "bg-emerald-100", text: "text-emerald-700", icon: "check_circle", label: "Active" },
  released:  { bg: "bg-primary/10",  text: "text-primary",     icon: "payments",     label: "Released" },
  cancelled: { bg: "bg-red-100",     text: "text-red-700",     icon: "cancel",       label: "Cancelled" },
  signed:    { bg: "bg-emerald-100", text: "text-emerald-700", icon: "task_alt",     label: "Signed" },
  draft:     { bg: "bg-slate-100",   text: "text-slate-600",   icon: "edit_note",    label: "Draft" },
};

interface Props {
  variant: Variant;
  label?: string;
  solid?: boolean; // use solid bg (for map thumbnails)
}

export default function StatusBadge({ variant, label, solid = false }: Props) {
  const c = CONFIG[variant];
  const displayLabel = label ?? c.label;

  if (solid) {
    const solidBg: Record<Variant, string> = {
      leased:    "bg-emerald-500",
      pending:   "bg-amber-500",
      review:    "bg-blue-500",
      vacant:    "bg-slate-500",
      active:    "bg-emerald-500",
      released:  "bg-primary",
      cancelled: "bg-red-500",
      signed:    "bg-emerald-500",
      draft:     "bg-slate-500",
    };
    return (
      <span className={`inline-flex items-center rounded-full ${solidBg[variant]} px-2.5 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-white/20`}>
        <span className="material-symbols-outlined text-xs mr-1">{c.icon}</span>
        {displayLabel}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full ${c.bg} ${c.text} px-2.5 py-1 text-xs font-bold`}>
      <span className="material-symbols-outlined text-xs mr-1">{c.icon}</span>
      {displayLabel}
    </span>
  );
}
