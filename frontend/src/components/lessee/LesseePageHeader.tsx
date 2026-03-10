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
    <header className="h-auto min-h-[5rem] bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 py-3 gap-3 flex-shrink-0 flex-wrap">
      <div className="min-w-0">
        <h2
          className="text-xl md:text-3xl font-bold text-gray-900 leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        {children}
        <NotificationBell href="/lessee/notifications" />
      </div>
    </header>
  );
}
