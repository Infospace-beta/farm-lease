"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const DealerSidebar = ({ isSidebarOpen = true, setIsSidebarOpen }) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
      route: "/dealer/dashboard",
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: "warehouse",
      route: "/dealer/inventory",
    },
    {
      id: "orders",
      label: "Orders",
      icon: "shopping_cart",
      route: "/dealer/orders",
    },
    {
      id: "products",
      label: "My Products",
      icon: "inventory_2",
      route: "/dealer/products",
    },
    {
      id: "add-product",
      label: "Add New Product",
      icon: "add_box",
      route: "/dealer/products/add",
    },
    {
      id: "queries",
      label: "Customer Queries",
      icon: "forum",
      route: "/dealer/queries",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "receipt_long",
      route: "/dealer/transactions",
    },
    {
      id: "analytics",
      label: "Sales Analytics",
      icon: "bar_chart",
      route: "/dealer/analytics",
    },
    {
      id: "trends",
      label: "Market Trends",
      icon: "trending_up",
      route: "/dealer/trends",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "notifications",
      route: "/dealer/notifications",
    },
  ];

  const isActive = (route) =>
    pathname === route || pathname?.startsWith(route + "/");

  const handleLogout = () => {
    console.log("Logout pressed");
  };

  return (
    <aside
      className={`w-72 bg-[#0f392b] h-screen border-r border-white/5 fixed lg:relative z-30 transition-transform duration-300 flex flex-col ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <span className="material-icons-round">close</span>
        </button>

        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-400 flex items-center justify-center shadow-lg">
            <span className="material-icons-round text-[#0f392b] text-2xl">
              storefront
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Farm<span className="text-gray-300 font-normal">Lease</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
              Dealer Hub
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.route}
              onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.route)
                  ? "bg-white/10 text-emerald-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-icons-round text-xl">{item.icon}</span>
              <span
                className={`flex-1 text-sm ${
                  isActive(item.route) ? "font-bold" : "font-medium"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-6 pb-6 space-y-4 border-t border-white/10">
        <button
          onClick={() => router.push("/dealer/profile")}
          className="bg-black/20 rounded-xl p-3 flex items-center gap-3 w-full hover:bg-black/30 transition-colors mt-4"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center">
            <span className="material-icons-round text-white text-xl">
              person
            </span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-white">Dealer</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Agro-Dealer
            </p>
          </div>
        </button>

        <div className="h-px bg-white/10 w-full" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-gray-300 hover:text-white transition-colors"
        >
          <span className="material-icons-round text-lg">logout</span>
          <span className="text-xs font-medium uppercase tracking-wide">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DealerSidebar;
