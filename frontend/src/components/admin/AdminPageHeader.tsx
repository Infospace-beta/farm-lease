"use client";

import NotificationBell from "@/components/shared/NotificationBell";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  subtitle,
  children,
}: AdminPageHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h2
          className="text-2xl font-bold tracking-tight text-gray-900"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5 max-w-lg">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {children}
        <NotificationBell href="/admin/notifications" />
      </div>
    </header>
  );
}
