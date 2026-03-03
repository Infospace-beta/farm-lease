"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers";

const navItems = [
  { href: "/lessee/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/lessee/browse", icon: "landscape", label: "Browse Land" },
  {
    href: "/lessee/ai-predictor",
    icon: "psychology",
    label: "AI Predictor",
    badge: "NEW",
  },
  { href: "/lessee/shop", icon: "storefront", label: "Agro-Dealer Shop" },
  { href: "/lessee/wishlist", icon: "favorite", label: "Wishlist" },
  { href: "/lessee/leases", icon: "folder_shared", label: "My Leases" },
  {
    href: "/lessee/financials",
    icon: "account_balance_wallet",
    label: "Financials",
  },
  {
    href: "/lessee/notifications",
    icon: "notifications",
    label: "Notifications",
  },
];

export default function LesseeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const displayName = user
    ? (user as any).first_name || (user as any).email?.split("@")[0] || "User"
    : "User";
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/lessee/ai-predictor") {
      return pathname.startsWith("/lessee/ai-predictor");
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="bg-[#f8fafc] font-[Space_Grotesk,sans-serif] text-gray-800 antialiased overflow-hidden h-screen flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-[#0f392b] h-full flex flex-col justify-between py-6 px-4 lg:px-6 shadow-xl z-20 transition-all duration-300 border-r border-white/5 relative shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <div className="w-10 h-10 rounded-lg bg-[#13ec80] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
              <span className="material-icons-round text-[#0f392b] text-2xl">
                agriculture
              </span>
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
                Asset Management
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                    active
                      ? "bg-white/10 text-white shadow-sm backdrop-blur-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span
                    className={`material-icons-round text-xl group-hover:scale-110 transition-transform ${active ? "text-white" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium hidden lg:block text-sm">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="hidden lg:flex ml-auto bg-[#13ec80]/20 text-[#13ec80] text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto space-y-4">
          <Link
            href="/lessee/profile"
            className="bg-black/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#13ec80]/20 border-2 border-[#13ec80]/20 flex items-center justify-center shrink-0 overflow-hidden">
              <span className="material-icons-round text-[#13ec80]">
                person
              </span>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">
                Premium Lessee
              </p>
            </div>
          </Link>
          <div className="h-px bg-white/10 w-full"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-1 text-gray-400 hover:text-white transition-all w-full group/btn pl-3"
          >
            <span className="material-icons-round text-lg group-hover/btn:-translate-x-1 transition-transform">
              logout
            </span>
            <span className="font-medium hidden lg:block text-xs uppercase tracking-wide">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden">
        {children}
      </main>
    </div>
  );
}
