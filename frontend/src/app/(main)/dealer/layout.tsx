"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { href: "/dealer/queries", icon: "support_agent", label: "Customer Queries" },
  { href: "/dealer/transactions", icon: "receipt_long", label: "Transactions" },
  { href: "/dealer/analytics", icon: "insights", label: "Sales Analytics" },
  { href: "/dealer/trends", icon: "trending_up", label: "Market Trends" },
  {
    href: "/dealer/notifications",
    icon: "notifications",
    label: "Notifications",
    badge: "2",
  },
];

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    <div className="bg-[#f8fafc] text-gray-800 antialiased overflow-hidden h-screen flex">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-[#0f392b] h-full flex flex-col py-6 px-4 lg:px-6 shadow-xl z-20 transition-all duration-300 border-r border-white/5 shrink-0 overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2 mt-2">
            <div className="w-10 h-10 rounded-lg bg-[#047857] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(4,120,87,0.2)]">
              <span className="material-icons-round text-white text-2xl">
                storefront
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
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Lease
                </span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
                Dealer Hub
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
                      ? "bg-[#047857] text-white shadow-sm"
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
                    <span
                      className={`hidden lg:flex ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white/20 text-white" : "bg-[#047857] text-white"}`}
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
            className="bg-[#0a261c]/30 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#0a261c]/50 transition-colors border border-white/5 block"
          >
            <div className="w-10 h-10 rounded-full bg-[#047857]/40 border-2 border-white/20 flex items-center justify-center shrink-0">
              <span className="material-icons-round text-white text-xl">
                person
              </span>
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-white">David M.</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">
                Store Manager
              </p>
            </div>
          </Link>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <button className="flex items-center gap-3 px-2 py-1 text-gray-300 hover:text-white transition-all w-full group/btn pl-3">
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
