import React from "react";

interface Action {
  label: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
}

interface Props {
  title: string;
  description?: string;
  actions?: Action[];
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2
          className="text-3xl font-bold tracking-tight text-earth"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2.5">
          {actions.map((a) =>
            a.href ? (
              <a
                key={a.label}
                href={a.href}
                className={
                  a.variant === "primary"
                    ? "flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                    : "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                }
              >
                {a.icon && <span className="material-symbols-outlined text-[18px]">{a.icon}</span>}
                {a.label}
              </a>
            ) : (
              <button
                key={a.label}
                onClick={a.onClick}
                className={
                  a.variant === "primary"
                    ? "flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
                    : "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
                }
              >
                {a.icon && <span className="material-symbols-outlined text-[20px]">{a.icon}</span>}
                {a.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
