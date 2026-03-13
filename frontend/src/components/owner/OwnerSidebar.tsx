"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/providers";

const navLinks = [
  { href: "/owner/dashboard", label: "Dashboard", icon: "dashboard", badge: "" },
  { href: "/owner/lands", label: "My Lands", icon: "map", badge: "" },
  { href: "/owner/requests-agreements", label: "Requests & Agreements", icon: "handshake", badge: "" },
  { href: "/owner/financials", label: "Financials", icon: "account_balance_wallet", badge: "" },
];

function OwnerSidebar() {
  const pathname = usePathname();
  const { profile, loading } = useProfile();
  const { logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const displayName = useMemo(() => {
    return profile
      ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
      : loading ? "..." : "James M.";
  }, [profile, loading]);

  const roleLabel = useMemo(() => {
    return profile?.role === "landowner" ? "Premium Owner" : (profile?.role ?? "Land Owner");
  }, [profile?.role]);

  const isActive = (href: string) => {
    if (href === "/owner/dashboard") return pathname === href;
    if (href === "/owner/lands")
      return pathname === href || pathname.startsWith("/owner/lands/");
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* ── Mobile top-bar ─────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-[#0f392b] flex items-center gap-3 px-4 shadow-lg">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <span className="material-icons-round text-2xl">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#13ec80] flex items-center justify-center">
            <span className="material-icons-round text-[#0f392b] text-base">agriculture</span>
          </div>
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Farm<span className="text-gray-300 font-normal" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Lease</span>
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Owner</span>
        </div>
      </header>

      {/* ── Backdrop ───────────────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 z-50 h-full w-72 lg:w-72
          bg-[#0f392b] flex flex-col py-6 px-6
          shadow-xl border-r border-white/5 shrink-0 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-10 px-2 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#13ec80] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
                <span className="material-icons-round text-[#0f392b] text-2xl">agriculture</span>
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-white tracking-tight leading-none"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Farm<span className="text-gray-300 font-normal" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Lease</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">Land Management</p>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>

          {/* Nav links */}
          <nav className="space-y-1">
            {navLinks.map(({ href, label, icon, badge }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${active
                    ? "bg-white/10 text-white shadow-sm backdrop-blur-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <span
                    className={`material-icons-round text-xl group-hover:scale-110 transition-transform ${active ? "text-white" : ""
                      }`}
                  >
                    {icon}
                  </span>
                  <span className="font-medium text-sm">{label}</span>
                  {badge && (
                    <span className="ml-auto bg-[#13ec80]/20 text-[#13ec80] text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="mt-auto space-y-4">
          <Link
            href="/owner/profile"
            onClick={() => setMobileSidebarOpen(false)}
            className="bg-black/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#13ec80]/20 border-2 border-[#13ec80]/20 flex items-center justify-center shrink-0 overflow-hidden">
              <span className="material-icons-round text-[#13ec80]">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{roleLabel}</p>
            </div>
          </Link>
          <div className="h-px bg-white/10 w-full"></div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-2 py-1 text-gray-400 hover:text-white transition-all w-full group/btn pl-3"
          >
            <span className="material-icons-round text-lg group-hover/btn:-translate-x-1 transition-transform">logout</span>
            <span className="font-medium text-xs uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default memo(OwnerSidebar);

