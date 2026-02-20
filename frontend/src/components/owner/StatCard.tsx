import React from "react";

interface Props {
  label: string;
  value: string;
  badge: string;
  badgeUp: boolean | null; // true = up, false = down, null = flat
  sub: string;
  chart?: React.ReactNode;
}

export default function StatCard({ label, value, badge, badgeUp, sub, chart }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <h3 className="mt-2 text-3xl font-bold text-earth">{value}</h3>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div>
            {badgeUp === true && (
              <span className="flex items-center text-primary font-bold bg-primary/10 px-2 py-1 rounded text-xs w-fit">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                {badge}
              </span>
            )}
            {badgeUp === false && (
              <span className="flex items-center text-red-500 font-bold bg-red-50 px-2 py-1 rounded text-xs w-fit">
                <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
                {badge}
              </span>
            )}
            {badgeUp === null && (
              <span className="flex items-center text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs w-fit">
                <span className="material-symbols-outlined text-sm mr-1">remove</span>
                {badge}
              </span>
            )}
            <span className="text-xs text-slate-400 mt-1 block">{sub}</span>
          </div>
          {chart}
        </div>
      </div>
    </div>
  );
}
