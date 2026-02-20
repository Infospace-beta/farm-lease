"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Store,
  CreditCard,
  Gavel,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/providers";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Land Verifications",
    href: "/admin/land-verifications",
    icon: ShieldCheck,
    badge: "12",
    badgeColor: "bg-[#5D4037]",
  },
  {
    label: "Agro-Dealer Oversight",
    href: "/admin/dealer-oversight",
    icon: Store,
  },
  {
    label: "Payments & Escrow",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Dispute Resolution",
    href: "/admin/disputes",
    icon: Gavel,
    badge: "3",
    badgeColor: "bg-red-500/80",
  },
  {
    label: "Agreements & Contracts",
    href: "/admin/agreements",
    icon: FileText,
  },
  {
    label: "Reports",
    href: "/admin/analytics",
    icon: BarChart2,
  },
  {
    label: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "#") return false;
    return pathname.startsWith(href);
  };

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.username
    : "Admin";

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-20 lg:w-72 bg-sidebar-bg h-full flex flex-col py-6 px-3 lg:px-5 shadow-xl z-20 border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-2 mt-2">
        <div className="w-10 h-10 rounded-lg bg-[#13ec80] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.25)]">
          <ShieldAlert className="w-5 h-5 text-sidebar-bg" />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-white tracking-tight leading-none font-serif">
            Farm<span className="text-gray-300 font-normal">Lease</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5 flex-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                active
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  active ? "text-[#13ec80]" : ""
                }`}
              />
              <span
                className={`hidden lg:block text-sm truncate ${
                  active ? "font-bold text-white" : "font-medium"
                }`}
              >
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={`hidden lg:flex ml-auto ${item.badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0 border-2 border-[#13ec80]/30">
            {initials}
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider truncate">
              {user?.role === "admin" || user?.is_staff ? "Super Admin" : "Admin"}
            </p>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition-colors w-full rounded-lg hover:bg-white/5 group"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden lg:block text-xs uppercase tracking-wide font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default memo(AdminSidebar);
