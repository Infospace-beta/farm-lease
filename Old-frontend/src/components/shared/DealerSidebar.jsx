import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  PlusCircle,
  MessageSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Bell,
  Store,
  LogOut,
  X,
} from "lucide-react";

const DealerSidebar = ({
  isSidebarOpen = true,
  setIsSidebarOpen = () => {},
}) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const displayName = user?.name || user?.username || "Dealer";
  const displayRole = "Store Manager";

  const isActive = (path) => pathname === path;

  const menuItems = [
    { label: "Dashboard", path: "/dealer/dashboard", icon: LayoutDashboard },
    { label: "Inventory", path: "/dealer/inventory", icon: Package },
    { label: "Orders", path: "/dealer/orders", icon: ShoppingCart, badge: 5 },
    { label: "My Products", path: "/dealer/products", icon: ClipboardList },
    {
      label: "Add New Product",
      path: "/dealer/products/add",
      icon: PlusCircle,
    },
    { label: "Customer Queries", path: "/dealer/queries", icon: MessageSquare },
    { label: "Transactions", path: "/dealer/transactions", icon: CreditCard },
    { label: "Sales Analytics", path: "/dealer/analytics", icon: TrendingUp },
    { label: "Market Trends", path: "/dealer/trends", icon: TrendingDown },
    { label: "Notifications", path: "/dealer/notifications", icon: Bell },
  ];

  return (
    <aside
      className={`fixed lg:sticky top-0 w-64 bg-forest-green h-screen flex flex-col justify-between py-6 px-6 shadow-xl z-40 transition-transform duration-300 border-r border-white/5 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div>
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
            <Store className="text-forest-green" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none font-serif">
              Farm
              <span className="text-gray-300 font-normal font-display">
                Lease
              </span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
              Agro-Dealer Hub
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group relative ${
                isActive(item.path)
                  ? "bg-white/10 text-white shadow-sm backdrop-blur-sm"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-medium text-sm flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="mt-auto space-y-4">
        <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=13ec80&color=0f392b&bold=true`}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">
              {displayRole}
            </p>
          </div>
        </div>
        <div className="h-px bg-white/10 w-full"></div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-2 py-1 text-gray-400 hover:text-white transition-all w-full group pl-3"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium text-xs uppercase tracking-wide">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DealerSidebar;
