"use client";

import { useAuth } from "@/providers";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-400 text-sm animate-pulse">Loading…</span>
      </div>
    );
  }

  return <section>{children}</section>;
}
