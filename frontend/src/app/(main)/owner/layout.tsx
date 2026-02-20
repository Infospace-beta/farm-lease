"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/providers";

const navLinks = [
  { href: "/owner/dashboard",      label: "Dashboard",      icon: "dashboard",             badge: 0 },
  { href: "/owner/lands",          label: "My Lands",       icon: "map",                   badge: 0 },
  { href: "/owner/lands/add",      label: "Upload Land",    icon: "upload_file",           badge: 0 },
  { href: "/owner/lease-requests", label: "Lease Requests", icon: "pending_actions",       badge: 3 },
  { href: "/owner/financials",     label: "Financials",     icon: "account_balance_wallet", badge: 0 },
  { href: "/owner/escrow",         label: "Escrow Status",  icon: "verified_user",         badge: 0 },
  { href: "/owner/agreements",     label: "Agreements",     icon: "handshake",             badge: 0 },
];

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, loading } = useProfile();
  const { logout } = useAuth();

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : loading ? "..." : "James M.";

  const avatarSrc =
    profile?.profile_picture ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=047857&color=fff`;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light">
      {/* ── Sidebar ────────────────────────────────── */}
      <aside className="flex w-64 flex-col border-r border-slate-800 bg-sidebar-bg overflow-y-auto z-20 shadow-sm text-white shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-black/20">
            <span className="material-symbols-outlined text-2xl">agriculture</span>
          </div>
          <div className="flex flex-col">
            <h1
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              FarmLease
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300/70">
              Land Management
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navLinks.map(({ href, label, icon, badge }) => {
            const isActive =
              pathname === href ||
              (href !== "/owner/dashboard" && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {icon}
                </span>
                {label}
                {badge > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="mt-auto border-t border-white/10 p-4">
          <Link
            href="/owner/profile"
            className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer group mb-2"
          >
            <Image
              src={avatarSrc}
              alt={displayName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border-2 border-primary shadow-sm object-cover"
            />
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-white truncate">{displayName}</span>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors capitalize">
                {profile?.role === "landowner" ? "Premium Owner" : (profile?.role ?? "Land Owner")}
              </span>
            </div>
            {profile?.is_verified && (
              <span className="material-symbols-outlined text-sm text-primary" title="Verified">
                verified
              </span>
            )}
          </Link>

          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Page content ───────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-background-light">{children}</main>
    </div>
  );
}
