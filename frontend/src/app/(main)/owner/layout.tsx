"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import FarmBot from "@/components/shared/FarmBot";

const OwnerSidebar = dynamic(() => import("@/components/owner/OwnerSidebar"), {
  loading: () => (
    <div className="w-20 lg:w-72 bg-[#0f392b] h-full shrink-0 border-r border-white/5 animate-pulse" />
  ),
  ssr: false,
});

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fafc] text-gray-800 antialiased overflow-hidden h-screen flex flex-col lg:flex-row">
      <Suspense
        fallback={<div className="hidden lg:block w-72 bg-[#0f392b] h-full shrink-0" />}
      >
        <OwnerSidebar />
      </Suspense>
      <main className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden pt-14 lg:pt-0">
        {children}
      </main>
      <FarmBot />
    </div>
  );
}
