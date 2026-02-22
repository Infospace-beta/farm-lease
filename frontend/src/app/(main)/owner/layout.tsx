<<<<<<< HEAD
export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
=======
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const OwnerSidebar = dynamic(() => import("@/components/owner/OwnerSidebar"), {
  loading: () => (
    <div className="w-64 bg-sidebar-bg h-full shrink-0 border-r border-slate-800 animate-pulse" />
  ),
  ssr: false,
});

function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light">
      <Suspense fallback={<div className="w-64 bg-sidebar-bg h-full shrink-0" />}>
        <OwnerSidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto bg-background-light ml-64">{children}</main>
    </div>
  );
>>>>>>> e2269ebb6308a545d8aa182880ac2ac8363b8ec2
}

export default OwnerLayout;
