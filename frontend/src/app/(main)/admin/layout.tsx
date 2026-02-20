"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AdminSidebar = dynamic(() => import("@/components/admin/AdminSidebar"), {
  loading: () => (
    <div className="w-64 bg-sidebar-bg h-full shrink-0 border-r border-slate-800 animate-pulse" />
  ),
  ssr: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light">
      <Suspense fallback={<div className="w-64 bg-sidebar-bg h-full shrink-0" />}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto bg-background-light ml-64">{children}</main>
    </div>
  );
}
