"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers";

const navItems = [
  { href: "/dealer/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/dealer/inventory", icon: "inventory_2", label: "Inventory" },
  {
    href: "/dealer/orders",
    icon: "shopping_cart",
    label: "Orders",
    badge: "5",
  },
  { href: "/dealer/products", icon: "grid_view", label: "My Products" },
  {
    href: "/dealer/products/add",
    icon: "add_circle",
    label: "Add New Products",
  },
  { href: "/dealer/transactions", icon: "receipt_long", label: "Transactions" },
];

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const displayName = user
    ? (user as any).first_name || (user as any).email?.split("@")[0] || "User"
    : "User";
  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dealer/products/add") return pathname === href;
    if (href === "/dealer/products")
      return (
        pathname === href ||
        (pathname.startsWith("/dealer/products") &&
          !pathname.startsWith("/dealer/products/add"))
      );
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="bg-[#f8fafc] text-gray-800 antialiased overflow-hidden h-screen flex flex-col lg:flex-row">
      {/* ── Mobile top-bar ─────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-sidebar-bg flex items-center gap-3 px-4 shadow-lg shrink-0">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Open menu"
        >
          <span className="material-icons-round text-2xl">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#047857] flex items-center justify-center">
            <span className="material-icons-round text-white text-base">storefront</span>
          </div>
          <span
            className="text-white font-bold text-base"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Farm<span className="text-gray-300 font-normal" style={{ fontFamily: "Inter, sans-serif" }}>Lease</span>
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-1">Dealer</span>
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
          bg-sidebar-bg flex flex-col py-6 px-6
          shadow-xl border-r border-white/5 shrink-0 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2 mt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#047857] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(4,120,87,0.2)]">
                <span className="material-icons-round text-white text-2xl">storefront</span>
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-white tracking-tight leading-none"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Farm<span className="text-gray-300 font-normal" style={{ fontFamily: "Inter, sans-serif" }}>Lease</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">Dealer Hub</p>
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

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${active
                      ? "bg-[#047857] text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <span
                    className={`material-icons-round text-xl group-hover:scale-110 transition-transform ${active ? "text-white" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-[#047857] text-white"}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="mt-auto space-y-3 pt-6">
          <Link
            href="/dealer/profile"
            onClick={() => setMobileSidebarOpen(false)}
            className="bg-[#0a261c]/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#0a261c]/50 transition-colors border border-white/5"
          >
            <div className="w-10 h-10 rounded-full bg-[#047857]/40 border-2 border-white/20 flex items-center justify-center shrink-0">
              <span className="material-icons-round text-white text-xl">person</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">Store Manager</p>
            </div>
          </Link>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-1 text-gray-300 hover:text-white transition-all w-full group/btn pl-3"
          >
            <span className="material-icons-round text-lg group-hover/btn:-translate-x-1 transition-transform">logout</span>
            <span className="font-medium text-xs uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
