"use client";

import NotificationBell from "@/components/shared/NotificationBell";

interface LesseePageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function LesseePageHeader({
  title,
  subtitle,
  children,
}: LesseePageHeaderProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
      <div>
        <h2
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {children}
        <NotificationBell href="/lessee/notifications" />
      </div>
    </header>
  );
}
