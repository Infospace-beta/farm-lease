"use client";

import NotificationBell from "@/components/shared/NotificationBell";

interface OwnerPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function OwnerPageHeader({
  title,
  subtitle,
  children,
}: OwnerPageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
      <div className="min-w-0">
        <h2
          className="text-xl md:text-2xl font-bold tracking-tight text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {children}
        <NotificationBell href="/owner/notifications" />
      </div>
    </header>
  );
}
