"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";
import { dashboardPathFor } from "@/lib/auth";

const AdminSidebar = dynamic(() => import("@/components/admin/AdminSidebar"), {
  loading: () => (
    <div className="w-20 lg:w-72 bg-sidebar-bg h-full shrink-0 border-r border-white/5 animate-pulse" />
  ),
  ssr: false,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      // Redirect non-admin users to their own dashboard
      router.replace(dashboardPathFor(user.role));
    }
  }, [user, isLoading, router]);

  // While we're confirming role, show nothing (parent layout handles the loading spinner)
  if (isLoading || (user && user.role !== "admin")) return null;

  return (
    <div className="bg-[#f8fafc] text-gray-800 antialiased overflow-hidden h-screen flex flex-col lg:flex-row">
      <Suspense fallback={<div className="hidden lg:block w-72 bg-sidebar-bg h-full shrink-0" />}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
