"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/providers";

const navLinks = [
  { href: "/owner/dashboard",      label: "Dashboard",      icon: "dashboard",              badge: "" },
  { href: "/owner/lands",          label: "My Lands",        icon: "map",                    badge: "" },
  { href: "/owner/lands/add",      label: "Upload Land",     icon: "upload_file",            badge: "" },
  { href: "/owner/lease-requests", label: "Lease Requests",  icon: "pending_actions",        badge: "3" },
  { href: "/owner/financials",     label: "Financials",      icon: "account_balance_wallet", badge: "" },
  { href: "/owner/escrow",         label: "Escrow Status",   icon: "verified_user",          badge: "" },
  { href: "/owner/agreements",     label: "Agreements",      icon: "handshake",              badge: "" },
];

function OwnerSidebar() {
  const pathname = usePathname();
  const { profile, loading } = useProfile();
  const { logout } = useAuth();

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
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-20 lg:w-72 bg-[#0f392b] h-full flex flex-col py-6 px-4 lg:px-6 shadow-xl z-20 transition-all duration-300 border-r border-white/5 shrink-0 overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-lg bg-[#13ec80] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
            <span className="material-icons-round text-[#0f392b] text-2xl">agriculture</span>
          </div>
          <div className="hidden lg:block">
            <h1
              className="text-xl font-bold text-white tracking-tight leading-none"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Farm
              <span
                className="text-gray-300 font-normal"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Lease
              </span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
              Land Management
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="space-y-1">
          {navLinks.map(({ href, label, icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                  active
                    ? "bg-white/10 text-white shadow-sm backdrop-blur-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className={`material-icons-round text-xl group-hover:scale-110 transition-transform ${
                    active ? "text-white" : ""
                  }`}
                >
                  {icon}
                </span>
                <span className="font-medium hidden lg:block text-sm">{label}</span>
                {badge && (
                  <span className="hidden lg:flex ml-auto bg-[#13ec80]/20 text-[#13ec80] text-[10px] px-2 py-0.5 rounded-full font-bold">
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
          className="bg-black/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#13ec80]/20 border-2 border-[#13ec80]/20 flex items-center justify-center shrink-0 overflow-hidden">
            <span className="material-icons-round text-[#13ec80]">person</span>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{roleLabel}</p>
          </div>
        </Link>
        <div className="h-px bg-white/10 w-full"></div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-2 py-1 text-gray-400 hover:text-white transition-all w-full group/btn pl-3"
        >
          <span className="material-icons-round text-lg group-hover/btn:-translate-x-1 transition-transform">
            logout
          </span>
          <span className="font-medium hidden lg:block text-xs uppercase tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default memo(OwnerSidebar);
