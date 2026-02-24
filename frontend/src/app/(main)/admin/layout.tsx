"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AdminSidebar = dynamic(() => import("@/components/admin/AdminSidebar"), {
  loading: () => (
    <div className="w-20 lg:w-72 bg-[#0f392b] h-full shrink-0 border-r border-white/5 animate-pulse" />
  ),
  ssr: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8fafc] text-gray-800 antialiased overflow-hidden h-screen flex">
      <Suspense fallback={<div className="w-20 lg:w-72 bg-[#0f392b] h-full shrink-0" />}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">{children}</main>
    </div>
  );
}
