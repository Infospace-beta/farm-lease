import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import LesseeSidebar from "../../components/layout/LesseeSidebar";
import LesseeHeader from "../../components/layout/LesseeHeader";
import {
  FileText,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Grid3x3,
  List,
  Plus,
  Menu,
} from "lucide-react";

const LesseeDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [portfolioView, setPortfolioView] = useState("grid"); // 'grid' or 'list'
  const displayName = user?.name || user?.username || "User";

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      title: "Payment Confirmed",
      message: "Lease payment of Ksh 15,000 received for Plot A42.",
      timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "Lease Renewal Due",
      message: "Plot B18 lease expires in 30 days. Renew now.",
      timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "Soil Test Complete",
      message: "New analysis results available for your leased plots.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      read: false,
    },
    {
      id: 4,
      type: "success",
      title: "Yield Report Ready",
      message: "Your Q4 2025 crop yield summary is now available.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), // 3 days ago
      read: true,
    },
  ]);

  return (
    <div className="bg-background-light min-h-screen flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <LesseeSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <LesseeHeader
          title="Dashboard"
          subtitle="Monitor your lease portfolio performance, manage agreements, and track crop yield predictions in real-time."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          onMarkNotificationAsRead={(id) => {
            setNotifications(
              notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n,
              ),
            );
          }}
          onViewAllNotifications={() => router.push("/lessee/notifications")}
          rightContent={
            <>
              <button className="hidden sm:flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm">
                <FileText size={18} />
                <span className="font-medium text-sm">Report</span>
              </button>
              <Link
                href="/lessee/browse"
                className="flex px-4 lg:px-5 py-2 lg:py-2.5 bg-forest-green text-white rounded-lg items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-forest-green/20"
              >
                <Search size={16} className="text-primary" />
                <span className="font-medium text-sm hidden sm:inline">
                  Find Land
                </span>
              </Link>
            </>
          }
        />

        {/* Content area - identical structure to FindLandPage */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 bg-background-light p-8 overflow-y-auto">
            <div className="grid grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column - Main Content */}
              <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8 flex flex-col min-w-0">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Leased Acres */}
                  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-soft hover:shadow-md transition group hover:border-emerald-200">
                    <h3 className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-2">
                      Total Leased Acres
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-gray-800 font-display">
                        24.5
                      </span>
                      <span className="text-sm text-gray-500">Acres</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                        <TrendingUp size={12} /> +12%
                      </span>
                      <svg
                        className="w-24 h-8 text-emerald-600 stroke-current fill-none"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 30"
                      >
                        <path
                          d="M0,25 C10,25 20,10 30,15 C40,20 50,5 60,10 C70,15 80,5 100,0"
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                      vs last season
                    </p>
                  </div>

                  {/* Monthly Expenditure */}
                  <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-soft hover:shadow-md transition group hover:border-amber-200">
                    <h3 className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-2">
                      Monthly Expenditure
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-gray-800 font-display">
                        Ksh 85k
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                        <TrendingDown size={12} /> -5%
                      </span>
                      <svg
                        className="w-24 h-8 text-amber-600 stroke-current fill-none"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 30"
                      >
                        <path
                          d="M0,15 C20,25 40,5 60,15 C80,25 90,5 100,10"
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                      vs last month
                    </p>
                  </div>

                  {/* Avg Soil Health */}
                  <div className="bg-white p-6 rounded-2xl border border-teal-100 shadow-soft hover:shadow-md transition group hover:border-teal-200">
                    <h3 className="text-teal-700 text-xs font-bold uppercase tracking-widest mb-2">
                      Avg Soil Health
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-bold text-gray-800 font-display">
                        88%
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full flex items-center gap-1 shadow-sm">
                        <Minus size={12} /> 0.0%
                      </span>
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full w-[88%] rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-medium">
                      vs last test
                    </p>
                  </div>
                </div>

                {/* Lease Portfolio */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-gray-800">
                        My Lease Portfolio
                      </h3>
                      <a
                        href="#"
                        className="text-xs font-bold text-forest-green hover:underline flex items-center gap-1"
                      >
                        View All My Leases <ArrowRight size={14} />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPortfolioView("grid")}
                        className={`p-2 rounded-lg transition ${
                          portfolioView === "grid"
                            ? "text-forest-green bg-emerald-50 border border-emerald-200"
                            : "text-gray-400 hover:text-forest-green hover:bg-gray-100"
                        }`}
                      >
                        <Grid3x3 size={20} />
                      </button>
                      <button
                        onClick={() => setPortfolioView("list")}
                        className={`p-2 rounded-lg transition ${
                          portfolioView === "list"
                            ? "text-forest-green bg-emerald-50 border border-emerald-200"
                            : "text-gray-400 hover:text-forest-green hover:bg-gray-100"
                        }`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`grid gap-6 ${
                      portfolioView === "grid"
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1"
                    }`}
                  >
                    {/* Plot Card 1 */}
                    <div
                      className={`bg-white rounded-2xl p-4 border border-emerald-100 shadow-soft hover:shadow-lg hover:border-emerald-200 transition cursor-pointer ${
                        portfolioView === "grid"
                          ? "flex flex-col"
                          : "flex flex-row gap-4"
                      }`}
                    >
                      <div
                        className={`relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden group ${
                          portfolioView === "grid"
                            ? "h-48 w-full mb-4"
                            : "h-40 w-64 shrink-0"
                        }`}
                      >
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-32 h-24 bg-primary/40 border-2 border-primary/60 backdrop-blur-sm shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                            style={{
                              clipPath:
                                "polygon(20% 0%, 100% 10%, 80% 100%, 0% 90%)",
                            }}
                          ></div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wide">
                            Active
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                          <p className="font-bold text-lg">Plot A4 - North</p>
                          <p className="text-xs opacity-90">
                            3.5 Acres • Loam Soil
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex-1 flex flex-col ${
                          portfolioView === "list" ? "justify-between" : ""
                        }`}
                      >
                        <div className="flex justify-between items-end mt-auto px-1">
                          <div className="flex items-center gap-3">
                            <img
                              src="https://ui-avatars.com/api/?name=John+Doe&background=e5e7eb&color=374151"
                              alt="Owner"
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <p className="text-xs text-gray-400">
                                Land Owner
                              </p>
                              <p className="text-sm font-semibold text-gray-700">
                                John Doe
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              Next Payment
                            </p>
                            <p className="text-sm font-bold text-forest-green">
                              Ksh 45,000
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center px-1">
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-emerald-700">
                                4m
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-medium">
                              left
                            </span>
                          </div>
                          <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm">
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Plot Card 2 */}
                    <div
                      className={`bg-white rounded-2xl p-4 border border-amber-100 shadow-soft hover:shadow-lg hover:border-amber-200 transition cursor-pointer ${
                        portfolioView === "grid"
                          ? "flex flex-col"
                          : "flex flex-row gap-4"
                      }`}
                    >
                      <div
                        className={`relative bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden group ${
                          portfolioView === "grid"
                            ? "h-48 w-full mb-4"
                            : "h-40 w-64 shrink-0"
                        }`}
                      >
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className="w-28 h-28 bg-earth-brown/40 border-2 border-earth-brown/60 backdrop-blur-sm shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                            style={{
                              clipPath:
                                "polygon(0% 20%, 90% 0%, 100% 80%, 10% 100%)",
                            }}
                          ></div>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className="bg-yellow-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wide">
                            Expiring
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                          <p className="font-bold text-lg">Plot B2 - East</p>
                          <p className="text-xs opacity-90">
                            2.0 Acres • Clay Soil
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex-1 flex flex-col ${
                          portfolioView === "list" ? "justify-between" : ""
                        }`}
                      >
                        <div className="flex justify-between items-end mt-auto px-1">
                          <div className="flex items-center gap-3">
                            <img
                              src="https://ui-avatars.com/api/?name=Jane+Smith&background=e5e7eb&color=374151"
                              alt="Owner"
                              className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                            <div>
                              <p className="text-xs text-gray-400">
                                Land Owner
                              </p>
                              <p className="text-sm font-semibold text-gray-700">
                                Jane Smith
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">Offer</p>
                            <p className="text-sm font-bold text-earth-brown">
                              Ksh 22,000
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center px-1">
                          <span className="text-xs text-orange-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                            Action Required
                          </span>
                          <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 shadow-sm transition">
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inputs Quick-Shop */}
                <div className="mt-4">
                  <div className="bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-[0_-4px_20px_-2px_rgba(16,185,129,0.08)] rounded-2xl px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-lg text-gray-800">
                        Inputs Quick-Shop
                      </h3>
                      <a
                        href="#"
                        className="text-xs font-bold text-forest-green hover:underline flex items-center gap-1"
                      >
                        View Full Shop <ArrowRight size={14} />
                      </a>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                      {/* Product 1 */}
                      <div className="flex-none w-64 p-3 border border-emerald-100 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group bg-white">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-emerald-50 shrink-0 overflow-hidden border border-emerald-100 flex items-center justify-center">
                            <span className="text-4xl">🌾</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate group-hover:text-emerald-700 transition">
                              DAP Fertilizer - 50kg
                            </h4>
                            <p className="text-[10px] text-gray-500 mb-2 font-medium">
                              Planting essentials
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-earth-brown">
                                Ksh 3,500
                              </span>
                              <button className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-sm">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product 2 */}
                      <div className="flex-none w-64 p-3 border border-amber-100 rounded-xl hover:border-amber-300 hover:shadow-md transition-all group bg-white">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-amber-50 shrink-0 overflow-hidden border border-amber-100 flex items-center justify-center">
                            <span className="text-4xl">🌽</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate group-hover:text-amber-700 transition">
                              Hybrid Maize Seeds
                            </h4>
                            <p className="text-[10px] text-gray-500 mb-2 font-medium">
                              Drought resistant
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-earth-brown">
                                Ksh 2,000
                              </span>
                              <button className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center hover:bg-amber-600 hover:text-white hover:border-amber-600 transition shadow-sm">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product 3 */}
                      <div className="flex-none w-64 p-3 border border-teal-100 rounded-xl hover:border-teal-300 hover:shadow-md transition-all group bg-white">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-teal-50 shrink-0 overflow-hidden border border-teal-100 flex items-center justify-center">
                            <span className="text-4xl">🪲</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate group-hover:text-teal-700 transition">
                              Pesticide Ultra
                            </h4>
                            <p className="text-[10px] text-gray-500 mb-2 font-medium">
                              500ml concentrate
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-earth-brown">
                                Ksh 1,200
                              </span>
                              <button className="w-7 h-7 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center hover:bg-teal-600 hover:text-white hover:border-teal-600 transition shadow-sm">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product 4 */}
                      <div className="flex-none w-64 p-3 border border-blue-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group bg-white">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg bg-blue-50 shrink-0 overflow-hidden border border-blue-100 flex items-center justify-center">
                            <span className="text-4xl">💧</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 leading-tight mb-1 truncate group-hover:text-blue-700 transition">
                              Drip Irrigation Kit
                            </h4>
                            <p className="text-[10px] text-gray-500 mb-2 font-medium">
                              Quarter acre kit
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-earth-brown">
                                Ksh 15,000
                              </span>
                              <button className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition shadow-sm">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Activity Pulse */}
              <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft h-full">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-forest-green"></span>
                    </span>
                    <h3 className="font-bold text-lg text-gray-800">
                      Activity Pulse
                    </h3>
                  </div>
                  <div className="relative border-l border-gray-200 ml-1.5 space-y-8 pb-2">
                    {/* Activity 1 */}
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-forest-green ring-4 ring-white"></span>
                      <span className="text-xs text-gray-400 block mb-1">
                        10 mins ago
                      </span>
                      <h4 className="text-sm font-bold text-gray-800">
                        Soil analysis ready
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Detailed nutrient report for Plot A4 is available.{" "}
                        <span className="text-primary-dark font-bold">
                          Nitrogen levels low.
                        </span>
                      </p>
                    </div>

                    {/* Activity 2 */}
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-earth-brown ring-4 ring-white"></span>
                      <span className="text-xs text-gray-400 block mb-1">
                        2 hours ago
                      </span>
                      <h4 className="text-sm font-bold text-gray-800">
                        Payment Released
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Escrow payment of{" "}
                        <span className="font-bold text-forest-green">
                          Ksh 45,000
                        </span>{" "}
                        released to John Doe for Plot A4.
                      </p>
                    </div>

                    {/* Activity 3 */}
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-blue-400 ring-4 ring-white"></span>
                      <span className="text-xs text-gray-400 block mb-1">
                        Yesterday
                      </span>
                      <h4 className="text-sm font-bold text-gray-800">
                        Agreement Draft Ready
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        AI-generated lease agreement for Plot B2 is ready for
                        review.
                      </p>
                      <a
                        href="#"
                        className="text-xs font-bold text-forest-green mt-2 inline-block hover:underline"
                      >
                        Review PDF
                      </a>
                    </div>

                    {/* Activity 4 */}
                    <div className="ml-6 relative">
                      <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-gray-400 ring-4 ring-white"></span>
                      <span className="text-xs text-gray-400 block mb-1">
                        2 days ago
                      </span>
                      <h4 className="text-sm font-bold text-gray-800">
                        Soil Report Updated
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        New nitrogen levels detected for Plot C1.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LesseeDashboard;
