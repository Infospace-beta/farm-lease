"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import { useAuth } from "@/providers";

const navLinks = [
  { href: "/admin/dashboard",           label: "Dashboard",             icon: "dashboard",    badge: "" },
  { href: "/admin/users",               label: "User Management",        icon: "group",        badge: "" },
  { href: "/admin/land-verifications",  label: "Land Verifications",     icon: "verified",     badge: "12" },
  { href: "/admin/dealer-oversight",    label: "Agro-Dealer Oversight",  icon: "store",        badge: "" },
  { href: "/admin/payments",            label: "Payments & Escrow",      icon: "payments",     badge: "" },
  { href: "/admin/agreements",          label: "Agreements & Contracts", icon: "description",  badge: "" },
  { href: "/admin/analytics",           label: "Reports",               icon: "bar_chart",    badge: "" },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = useMemo(() => {
    return user
      ? `${user.first_name} ${user.last_name}`.trim() || user.username || user.email
      : "Admin User";
  }, [user]);

  const roleLabel = useMemo(() => {
    return user?.role === "admin" || user?.is_staff ? "Super Admin" : "Administrator";
  }, [user?.role, user?.is_staff]);

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-20 lg:w-72 bg-[#0f392b] h-full flex flex-col py-6 px-4 lg:px-6 shadow-xl z-20 transition-all duration-300 border-r border-white/5 shrink-0 overflow-y-auto">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-lg bg-[#047857] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(4,120,87,0.2)]">
            <span className="material-icons-round text-white text-2xl">admin_panel_settings</span>
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
              Admin Console
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
                    ? "bg-[#047857] text-white shadow-sm"
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
                  <span
                    className={`hidden lg:flex ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      active ? "bg-white/20 text-white" : "bg-[#047857] text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User section */}
      <div className="mt-auto space-y-3 pt-6">
        <Link
          href="/admin/profile"
          className="bg-[#0a261c]/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#0a261c]/50 transition-colors border border-white/5 block"
        >
          <div className="w-10 h-10 rounded-full bg-[#047857]/40 border-2 border-white/20 flex items-center justify-center shrink-0">
            <span className="material-icons-round text-white text-xl">person</span>
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{roleLabel}</p>
          </div>
        </Link>
        <div className="h-px bg-white/10 w-full my-2"></div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-2 py-1 text-gray-300 hover:text-white transition-all w-full group/btn pl-3"
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

export default memo(AdminSidebar);
