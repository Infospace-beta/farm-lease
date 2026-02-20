"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";
import { dashboardPathFor } from "@/lib/auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, send them straight to their dashboard
    if (!isLoading && isAuthenticated && user) {
      router.replace(dashboardPathFor(user.role));
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show nothing while we determine auth state (avoids flash of login form)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-400 text-sm animate-pulse">Loading…</span>
      </div>
    );
  }

  // Already authenticated — render nothing while redirect fires
  if (isAuthenticated) return null;

  return <section>{children}</section>;
}
