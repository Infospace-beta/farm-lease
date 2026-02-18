import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import DealerSidebar from "../../components/layout/DealerSidebar";
import DealerHeader from "../../components/layout/DealerHeader";
import {
  PlusCircle,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Star,
  Truck,
  Package,
  ShoppingCart,
  MessageSquare,
  Store,
} from "lucide-react";

const DealerDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState("month");
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartPeriod, setChartPeriod] = useState("week");
  const [showChartMenu, setShowChartMenu] = useState(false);
  const [showChartDatePicker, setShowChartDatePicker] = useState(false);
  const [chartStartDate, setChartStartDate] = useState("");
  const [chartEndDate, setChartEndDate] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDateRangeLabel = () => {
    if (timePeriod === "custom" && startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    return timePeriod === "week"
      ? "This Week"
      : timePeriod === "month"
        ? "This Month"
        : timePeriod === "year"
          ? "This Year"
          : "Select Date Range";
  };

  const handlePeriodSelect = (period) => {
    setTimePeriod(period);
    if (period === "custom") {
      setShowDatePicker(true);
      setShowPeriodMenu(false);
    } else {
      setShowPeriodMenu(false);
      setShowDatePicker(false);
    }
  };

  const applyCustomDates = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
    }
  };

  const getChartDateLabel = () => {
    if (chartPeriod === "custom" && chartStartDate && chartEndDate) {
      return `${formatDate(chartStartDate)} - ${formatDate(chartEndDate)}`;
    }
    return chartPeriod === "week"
      ? "This Week"
      : chartPeriod === "month"
        ? "This Month"
        : chartPeriod === "year"
          ? "This Year"
          : "Select Range";
  };

  const handleChartPeriodSelect = (period) => {
    setChartPeriod(period);
    if (period === "custom") {
      setShowChartDatePicker(true);
      setShowChartMenu(false);
    } else {
      setShowChartMenu(false);
      setShowChartDatePicker(false);
    }
  };

  const applyChartCustomDates = () => {
    if (chartStartDate && chartEndDate) {
      setShowChartDatePicker(false);
    }
  };

  const inquiries = [
    {
      id: 1,
      name: "Grace N.",
      time: "30m ago",
      message:
        "Is the 50kg DAP fertilizer available for bulk order? I need about 20 bags.",
      type: "new",
    },
    {
      id: 2,
      name: "Samuel K.",
      time: "1h ago",
      message: "Do you have pesticides for fall armyworm in stock?",
      type: "new",
    },
    {
      id: 3,
      name: "FarmCorp Ltd.",
      time: "2h ago",
      message: "Requesting quotation for solar water pump installation 25...",
      type: "quote",
    },
    {
      id: 4,
      name: "John D.",
      time: "Yesterday",
      message: "Thanks for the delivery. The seeds arrived in good condition.",
      type: "archive",
    },
  ];

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Order Completed',
      message: 'Order #1234 has been successfully delivered.',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Stock Alert',
      message: 'DAP Fertilizer 50kg is running low (12 bags remaining).',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: false
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
      <DealerSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <DealerHeader
          title="Dashboard"
          subtitle="Welcome back to your Agro-Dealer Hub. Here's what's happening in your store today."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          onMarkNotificationAsRead={(id) => {
            setNotifications(notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            ));
          }}
          onViewAllNotifications={() => router.push('/dealer/notifications')}
          rightContent={
            <>
              <div className="relative">
                <button
                  onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                  className="hidden sm:flex px-4 py-2 border border-gray-300 rounded-lg items-center gap-2 hover:bg-gray-50 transition"
                >
                  <Calendar size={18} />
                  <span className="text-sm font-medium">
                    {getDateRangeLabel()}
                  </span>
                </button>
                {showPeriodMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[150px]">
                    <button
                      onClick={() => handlePeriodSelect("week")}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        timePeriod === "week"
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      This Week
                    </button>
                    <button
                      onClick={() => handlePeriodSelect("month")}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        timePeriod === "month"
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => handlePeriodSelect("year")}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        timePeriod === "year"
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      This Year
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => handlePeriodSelect("custom")}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        timePeriod === "custom"
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      Custom Range...
                    </button>
                  </div>
                )}
                {showDatePicker && (
                  <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-20 min-w-[320px]">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-bold text-gray-800">
                        Custom Date Range
                      </h4>
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-gray-400 hover:text-gray-600 text-lg"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          max={endDate || undefined}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || undefined}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            setStartDate("");
                            setEndDate("");
                            setTimePeriod("month");
                            setShowDatePicker(false);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                        >
                          Clear
                        </button>
                        <button
                          onClick={applyCustomDates}
                          disabled={!startDate || !endDate}
                          className="flex-1 px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/dealer/products/add"
                className="flex px-4 lg:px-5 py-2 lg:py-2.5 bg-forest-green text-white rounded-lg items-center gap-2 hover:bg-opacity-90 transition shadow-lg shadow-forest-green/20"
              >
                <PlusCircle size={16} className="text-primary" />
                <span className="font-medium text-sm hidden sm:inline">New Product</span>
              </Link>
            </>
          }
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-6">
              {/* Left Side - Main Content */}
              <div className="flex-1 space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-6">
                  {/* Total Sales */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          TOTAL SALES
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900">
                          Ksh 1.2M
                        </h3>
                      </div>
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-600 text-sm font-semibold">
                        ↑ +18%
                      </span>
                      <svg className="w-16 h-8" viewBox="0 0 60 30">
                        <path
                          d="M 0 25 Q 15 20 30 15 T 60 5"
                          stroke="#10b981"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Active Orders */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          ACTIVE ORDERS
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900">42</h3>
                      </div>
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-600 text-sm font-semibold">
                        ↗ +5%
                      </span>
                      <svg className="w-16 h-8" viewBox="0 0 60 30">
                        <path
                          d="M 0 20 Q 20 18 40 12 T 60 8"
                          stroke="#10b981"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Low Stock */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          LOW STOCK
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900">
                          8 <span className="text-sm text-gray-500">Items</span>
                        </h3>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600 text-sm font-semibold">
                        Needs Action
                      </span>
                      <svg className="w-16 h-8" viewBox="0 0 60 30">
                        <path
                          d="M 0 15 Q 20 12 40 18 T 60 20"
                          stroke="#f97316"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Store Rating */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          STORE RATING
                        </p>
                        <h3 className="text-3xl font-bold text-gray-900">
                          4.8{" "}
                          <span className="text-sm text-gray-500">/5.0</span>
                        </h3>
                      </div>
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Star className="w-5 h-5 text-emerald-600 fill-current" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-emerald-600 text-sm font-semibold">
                        ▲ +0.2
                      </span>
                      <svg className="w-16 h-8" viewBox="0 0 60 30">
                        <path
                          d="M 0 18 Q 15 15 30 10 T 60 5"
                          stroke="#10b981"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Fulfillment Overview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Fulfillment Overview
                    </h3>
                    <span className="text-xs text-gray-500">
                      Today's Activity
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-8">
                    {/* Delivery Stats */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Truck className="w-6 h-6 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Delivery to Address
                          </p>
                          <p className="text-xs text-gray-500">LOGISTICS</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">12</p>
                          <p className="text-xs text-orange-600 font-medium">
                            Pending
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">5</p>
                          <p className="text-xs text-emerald-600 font-medium">
                            In Transit
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-300">28</p>
                          <p className="text-xs text-gray-500 font-medium">
                            Delivered
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">8</p>
                          <p className="text-xs text-orange-600 font-medium">
                            Pending
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pickup Stats */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <Store className="w-6 h-6 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Customer Pick-up
                          </p>
                          <p className="text-xs text-gray-500">IN-STORE</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">3</p>
                          <p className="text-xs text-emerald-600 font-medium">
                            Ready
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">15</p>
                          <p className="text-xs text-gray-500 font-medium">
                            Collected
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Performance Chart */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        Sales Performance
                      </h3>
                      <p className="text-sm text-gray-500">
                        Weekly sales overview vs last period
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowChartMenu(!showChartMenu)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          {getChartDateLabel()} ▼
                        </button>
                        {showChartMenu && (
                          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[140px]">
                            <button
                              onClick={() => handleChartPeriodSelect("week")}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                chartPeriod === "week"
                                  ? "bg-emerald-50 text-emerald-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              This Week
                            </button>
                            <button
                              onClick={() => handleChartPeriodSelect("month")}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                chartPeriod === "month"
                                  ? "bg-emerald-50 text-emerald-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              This Month
                            </button>
                            <button
                              onClick={() => handleChartPeriodSelect("year")}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                chartPeriod === "year"
                                  ? "bg-emerald-50 text-emerald-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              This Year
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => handleChartPeriodSelect("custom")}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                chartPeriod === "custom"
                                  ? "bg-emerald-50 text-emerald-700 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              Custom Range...
                            </button>
                          </div>
                        )}
                        {showChartDatePicker && (
                          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-20 min-w-[320px]">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="text-sm font-bold text-gray-800">
                                Custom Date Range
                              </h4>
                              <button
                                onClick={() => setShowChartDatePicker(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg"
                              >
                                ×
                              </button>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  value={chartStartDate}
                                  onChange={(e) =>
                                    setChartStartDate(e.target.value)
                                  }
                                  max={chartEndDate || undefined}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  value={chartEndDate}
                                  onChange={(e) =>
                                    setChartEndDate(e.target.value)
                                  }
                                  min={chartStartDate || undefined}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                />
                              </div>
                              <div className="flex gap-2 pt-2">
                                <button
                                  onClick={() => {
                                    setChartStartDate("");
                                    setChartEndDate("");
                                    setChartPeriod("week");
                                    setShowChartDatePicker(false);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50"
                                >
                                  Clear
                                </button>
                                <button
                                  onClick={applyChartCustomDates}
                                  disabled={!chartStartDate || !chartEndDate}
                                  className="flex-1 px-3 py-2 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <button className="p-2 hover:bg-gray-50 rounded-lg">
                        <span>⬇️</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="relative h-64">
                      <svg className="w-full h-full" viewBox="0 0 800 200">
                        {/* Chart line */}
                        <path
                          d="M 50 150 Q 150 130 200 120 T 350 90 T 500 75 T 650 85 T 750 95"
                          stroke="#059669"
                          strokeWidth="3"
                          fill="none"
                        />
                        {/* Fill under curve */}
                        <path
                          d="M 50 150 Q 150 130 200 120 T 350 90 T 500 75 T 650 85 T 750 95 L 750 200 L 50 200 Z"
                          fill="url(#gradient)"
                          opacity="0.2"
                        />
                        {/* Peak label */}
                        <g transform="translate(500, 65)">
                          <rect
                            x="-40"
                            y="-20"
                            width="80"
                            height="24"
                            fill="#059669"
                            rx="4"
                          />
                          <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            Ksh 145,200
                          </text>
                        </g>
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#059669"
                              stopOpacity="0.3"
                            />
                            <stop
                              offset="100%"
                              stopColor="#059669"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* X-axis labels */}
                      <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Customer Inquiries */}
              <div className="w-96">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-4">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      Customer Inquiries
                    </h3>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
                      3 New
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {inquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-gray-900">
                            {inquiry.name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {inquiry.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {inquiry.message}
                        </p>
                        {inquiry.type === "new" && (
                          <div className="flex space-x-2">
                            <button className="flex-1 px-3 py-1.5 bg-emerald-800 text-white text-xs font-medium rounded-lg hover:bg-emerald-700">
                              Reply
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">
                              Mark Read
                            </button>
                          </div>
                        )}
                        {inquiry.type === "quote" && (
                          <button className="w-full px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-lg hover:bg-emerald-200">
                            Send Quote
                          </button>
                        )}
                        {inquiry.type === "archive" && (
                          <button className="text-xs text-gray-500 hover:text-gray-700">
                            Archive
                          </button>
                        )}
                      </div>
                    ))}
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

export default DealerDashboard;
