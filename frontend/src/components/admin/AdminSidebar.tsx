"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import { useAuth } from "@/providers";

const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard", badge: 0 },
  { href: "/admin/users", label: "User Management", icon: "group", badge: 0 },
  { href: "/admin/land-verifications", label: "Land Verifications", icon: "verified", badge: 12 },
  { href: "/admin/dealer-oversight", label: "Agro-Dealer Oversight", icon: "store", badge: 0 },
  { href: "/admin/payments", label: "Payments & Escrow", icon: "payments", badge: 0 },
  { href: "/admin/agreements", label: "Agreements & Contracts", icon: "description", badge: 0 },
  { href: "/admin/analytics", label: "Reports", icon: "bar_chart", badge: 0 },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = useMemo(() => {
    return user
      ? `${user.first_name} ${user.last_name}`.trim() || user.username || user.email
      : "Admin User";
  }, [user]);

  const avatarSrc = useMemo(() => {
    return user?.profile_picture ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff`;
  }, [user?.profile_picture, displayName]);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r border-slate-800 bg-sidebar-bg overflow-y-auto z-30 shadow-lg text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
        </div>
        <div className="flex flex-col">
          <h1
            className="text-xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            FarmLease
          </h1>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300/70">
            Admin Console
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-4 py-2">
        {navLinks.map(({ href, label, icon, badge }) => {
          const isActive =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));

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
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
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
          href="/admin/profile"
          className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer group mb-2"
        >
          <Image
            src={avatarSrc}
            alt={displayName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border-2 border-emerald-500 shadow-sm object-cover"
            priority={false}
            loading="lazy"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold text-white truncate">{displayName}</span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              {user?.role === "admin" || user?.is_staff ? "Super Admin" : "Administrator"}
            </span>
          </div>
          <span className="material-symbols-outlined text-sm text-emerald-500" title="Admin">
            verified
          </span>
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
  );
}

export default memo(AdminSidebar);
