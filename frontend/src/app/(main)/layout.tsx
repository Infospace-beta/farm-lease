"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const loadingUI = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-[#102219]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">Authenticating…</span>
      </div>
    </div>
  ), []);

  if (isLoading) return loadingUI;

  // Don't show anything while redirecting to login
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
