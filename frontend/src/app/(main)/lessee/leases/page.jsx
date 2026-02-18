"use client";

import { useState } from "react";
import { useAuth } from "../../../../providers/AuthProvider";
import LesseeSidebar from "../../../../components/shared/LesseeSidebar";
import LesseeHeader from "../../../../components/shared/LesseeHeader";
import { Filter, Plus, ArrowRight, MessageCircle } from "lucide-react";

const LesseeMyLeases = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "warning",
      title: "Payment Due",
      message: "Plot D1 payment is due in 3 days.",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "New Counter Offer",
      message: "Jane Smith has responded to your offer for Plot B2.",
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "Payment Confirmed",
      message: "Your payment for Plot A4 has been processed.",
      timestamp: new Date(Date.now() - 5 * 60 * 60000),
      read: true,
    },
    {
      id: 4,
      type: "info",
      title: "Lease Agreement",
      message: "New lease agreement ready for review.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000),
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  // Sample leases data
  const leases = [
    {
      id: 1,
      status: "active",
      plotName: "Plot A4 - North Sector",
      acres: 3.5,
      soilType: "Loam Soil",
      crop: "Maize Crop",
      badges: ["Irrigated", "Fenced"],
      lessor: {
        name: "John Doe",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBRVyxqsOBdCwyGJzPHbq1FhOlzVMHyoh1E0OPOu-llapkq0U3jYW1Rwg2C1Ugmbc7LW8iCf3H63pb_v9DP0GHt7k5WVWz-KfzcOqt2Cj5IVJDE4f62-oluZlqbFJok2b5rctP84eeFDrehPcMd_Zbu44IB2yGCJghAUU_ufV_QAdGLcx9W_Mh5R48riUTKiv558YHftJaE5LbQfTu1CPVeQWPHjB_5oRhIQAX2VV5nHKhInf3zQ51eITb0P3DkQfxyt0yLIbaYfC3r",
      },
      progress: 65,
      endDate: "Dec 2024",
      monthsLeft: 4,
      rent: 45000,
      paymentStatus: "paid",
      gradient: "from-green-100 to-emerald-50",
      borderColor: "border-green-100",
    },
    {
      id: 2,
      status: "pending",
      plotName: "Plot B2 - East Highlands",
      acres: 2.0,
      soilType: "Clay Soil",
      crop: "Wheat Potential",
      badges: ["Near Road"],
      lessor: {
        name: "Jane Smith",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDOHhWmxwYhxgNaHTPSreYBjkWVcAqf3byBu_UtW6A4PBvA3qVdPk-AjtGl28zsWQSvZxflkjvxZUoPb_tYqyvxz0sRXkYm-ntmW9sEYNz56BEXN3FyHT78WfUhM90X3SpiYraeJm-ZiknSB8ReIH9vlUT2E1yskS9Hpeq61BI6HoD992od2rN6ipciwK2JZPSsJTzDcKd8-6KGBVw67v8eGrYN_8FxXm1ST1guaj0IQdQfE5hDtxa-HhY26HoM_eKf0NxRtqP6reHl",
      },
      progress: 80,
      stage: "Reviewing Terms",
      rent: 22000,
      paymentStatus: "counter",
      gradient: "from-orange-50 to-amber-50",
      borderColor: "border-orange-100",
    },
    {
      id: 3,
      status: "expired",
      plotName: "Plot C7 - Valley Bottom",
      acres: 5.0,
      soilType: "Sandy Soil",
      crop: "Beans",
      badges: ["Archived"],
      lessor: {
        name: "Michael K.",
        avatar: null,
      },
      progress: 100,
      endDate: "Mar 2023",
      rent: 38000,
      paymentStatus: "completed",
      gradient: "bg-gray-100",
      borderColor: "border-gray-200",
    },
    {
      id: 4,
      status: "active",
      plotName: "Plot D1 - River Bank",
      acres: 1.2,
      soilType: "Alluvial Soil",
      crop: "Vegetables",
      badges: ["Water Access"],
      lessor: {
        name: "Sarah O.",
        avatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCBP-azLMzvokNkzokvWwtDAMPaAzyqBM1e4HpllgEiLWPsF9SPXz4jh_U35KfhmqaGC8c3RElRiVy4ruiAFJRb3kn0Q0YwmY9Oc8VS7dR-6ciuLVHdCYBzxFZlCAsxDTJmg9mAME5jUZLwj6cfCIhhejjUsyY7Ik76-uKbtoTG7eqLmi_Khdr7lOo2kAi7i7AmsyEdM8GQR-xhG1ZYsDnXcL3vE2JMgBk8oxw9QpcMiCDeKPGmXtb4pm9CJJAfEQ1Wf1VfDu_hI-tt",
      },
      progress: 25,
      endDate: "Jun 2025",
      monthsLeft: 10,
      rent: 15000,
      paymentStatus: "due",
      dueInDays: 3,
      gradient: "from-green-100 to-emerald-50",
      borderColor: "border-green-100",
    },
  ];

  const getBadgeColor = (badge) => {
    switch (badge.toLowerCase()) {
      case "irrigated":
      case "water access":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "fenced":
        return "bg-orange-50 text-orange-700 border-orange-100";
      case "near road":
      case "archived":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light">
      <LesseeSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <LesseeHeader
          title="My Lease Portfolio"
          subtitle="Manage your active land agreements, track payments, and monitor lease terms."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          markAsRead={markAsRead}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8">
            <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Total Leased Area
                  </div>
                  <div className="text-2xl font-bold text-gray-800 font-display">
                    24.5{" "}
                    <span className="text-sm font-normal text-gray-400">
                      Acres
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Active Agreements
                  </div>
                  <div className="text-2xl font-bold text-gray-800 font-display">
                    3{" "}
                    <span className="text-sm font-normal text-gray-400">
                      Leases
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Pending Actions
                  </div>
                  <div className="text-2xl font-bold text-earth-brown font-display">
                    1{" "}
                    <span className="text-sm font-normal text-gray-400">
                      Draft
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft">
                  <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">
                    Upcoming Payments
                  </div>
                  <div className="text-2xl font-bold text-forest-green font-display">
                    Ksh 45k
                  </div>
                </div>
              </div>

              {/* Leases List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                  <h3 className="font-bold text-lg text-earth-brown font-serif">
                    All Leases
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search by plot or owner..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green w-full sm:w-64"
                    />
                    <button className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                {/* Leases */}
                <div className="divide-y divide-gray-100">
                  {leases.map((lease) => (
                    <div
                      key={lease.id}
                      className={`p-4 lg:p-6 hover:bg-gray-50 transition-colors ${
                        lease.status === "expired"
                          ? "opacity-75 hover:opacity-100"
                          : ""
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start lg:items-center">
                        {/* Plot Visual */}
                        <div
                          className={`w-full lg:w-48 h-32 lg:h-24 bg-gradient-to-br ${lease.gradient} rounded-xl relative overflow-hidden flex-shrink-0 border ${lease.borderColor} ${
                            lease.status === "expired" ? "grayscale" : ""
                          }`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            {lease.status === "active" && lease.id === 1 && (
                              <div
                                className="w-16 h-12 bg-primary/20 border border-primary/40 backdrop-blur-sm shadow-sm"
                                style={{
                                  clipPath:
                                    "polygon(20% 0%, 100% 10%, 80% 100%, 0% 90%)",
                                }}
                              />
                            )}
                            {lease.status === "pending" && (
                              <div
                                className="w-14 h-14 bg-earth-brown/20 border border-earth-brown/40 backdrop-blur-sm shadow-sm"
                                style={{
                                  clipPath:
                                    "polygon(0% 20%, 90% 0%, 100% 80%, 10% 100%)",
                                }}
                              />
                            )}
                            {lease.status === "expired" && (
                              <div className="w-16 h-10 bg-gray-300 backdrop-blur-sm shadow-sm rotate-12 rounded" />
                            )}
                            {lease.status === "active" && lease.id === 4 && (
                              <div
                                className="w-12 h-16 bg-primary/20 border border-primary/40 backdrop-blur-sm shadow-sm -rotate-6"
                                style={{
                                  transform: "rotate(-6deg) skewY(6deg)",
                                }}
                              />
                            )}
                          </div>
                          <span
                            className={`absolute top-2 right-2 bg-white/80 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded border shadow-sm ${
                              lease.status === "active"
                                ? "text-forest-green border-green-100"
                                : lease.status === "pending"
                                  ? "text-earth-brown border-orange-100"
                                  : "text-gray-600 border-gray-300"
                            }`}
                          >
                            {lease.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Lease Details Grid */}
                        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 w-full items-center">
                          {/* Plot Info */}
                          <div className="md:col-span-4">
                            <h4 className="font-bold text-lg text-gray-800">
                              {lease.plotName}
                            </h4>
                            <p className="text-sm text-gray-500 mb-1">
                              {lease.acres} Acres • {lease.soilType} •{" "}
                              {lease.crop}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              {lease.badges.map((badge, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-2 py-0.5 rounded border font-medium ${getBadgeColor(badge)}`}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Lessor Info */}
                          <div className="md:col-span-3">
                            <div className="flex items-center gap-3">
                              {lease.lessor.avatar ? (
                                <img
                                  src={lease.lessor.avatar}
                                  alt="Owner"
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border border-gray-300">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">
                                  Lessor
                                </p>
                                <p
                                  className={`text-sm font-semibold ${
                                    lease.status === "expired"
                                      ? "text-gray-500"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {lease.lessor.name}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Progress/Stage Info */}
                          <div className="md:col-span-3">
                            {lease.status === "pending" ? (
                              <>
                                <p className="text-xs text-gray-400 mb-1">
                                  Negotiation Stage
                                </p>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                  <div
                                    className="bg-earth-brown h-full rounded-full animate-pulse"
                                    style={{ width: `${lease.progress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">
                                    {lease.stage}
                                  </span>
                                  <span className="font-bold text-earth-brown">
                                    Action Req.
                                  </span>
                                </div>
                              </>
                            ) : lease.status === "expired" ? (
                              <>
                                <p className="text-xs text-gray-400 mb-1">
                                  Lease Completed
                                </p>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                  <div className="bg-gray-400 h-full w-full rounded-full" />
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-400">
                                    Ended {lease.endDate}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-xs text-gray-400 mb-1">
                                  Lease Progress (Ends {lease.endDate})
                                </p>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                  <div
                                    className="bg-forest-green h-full rounded-full"
                                    style={{ width: `${lease.progress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-500">
                                    {lease.progress}% Complete
                                  </span>
                                  <span className="font-bold text-forest-green">
                                    {lease.monthsLeft} months left
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Payment Info */}
                          <div className="md:col-span-2 text-left md:text-right">
                            <p className="text-xs text-gray-400">
                              {lease.status === "pending"
                                ? "Proposed Rent"
                                : lease.status === "expired"
                                  ? "Final Rate"
                                  : "Monthly Rent"}
                            </p>
                            <p
                              className={`text-lg font-bold font-display ${
                                lease.status === "expired"
                                  ? "text-gray-500 line-through decoration-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              Ksh {lease.rent.toLocaleString()}
                            </p>
                            {lease.paymentStatus === "paid" && (
                              <span className="text-[10px] text-green-600 bg-green-50 inline-block px-1.5 rounded mt-1">
                                Paid
                              </span>
                            )}
                            {lease.paymentStatus === "counter" && (
                              <span className="text-[10px] text-orange-600 bg-orange-50 inline-block px-1.5 rounded mt-1">
                                Counter Offer
                              </span>
                            )}
                            {lease.paymentStatus === "due" && (
                              <span className="text-[10px] text-red-500 bg-red-50 inline-block px-1.5 rounded mt-1 font-bold">
                                Due in {lease.dueInDays} days
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex lg:flex-col gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                          {lease.status === "active" && (
                            <>
                              <button className="flex-1 lg:flex-none px-4 py-2 bg-forest-green text-white text-xs font-bold rounded-lg hover:bg-forest-dark transition shadow-md shadow-forest-green/10 whitespace-nowrap">
                                Make Payment
                              </button>
                              <button className="flex-1 lg:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                                View Agreement
                              </button>
                            </>
                          )}
                          {lease.status === "pending" && (
                            <>
                              <button className="flex-1 lg:flex-none px-4 py-2 bg-earth-brown text-white text-xs font-bold rounded-lg hover:bg-opacity-90 transition shadow-md shadow-earth-brown/10 whitespace-nowrap">
                                Review Offer
                              </button>
                              <button className="flex-1 lg:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                                Chat with Owner
                              </button>
                            </>
                          )}
                          {lease.status === "expired" && (
                            <>
                              <button className="flex-1 lg:flex-none px-4 py-2 bg-white border border-gray-200 text-forest-green text-xs font-bold rounded-lg hover:bg-forest-green hover:text-white transition whitespace-nowrap">
                                Renew Lease
                              </button>
                              <button className="flex-1 lg:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-400 text-xs font-bold rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                                View History
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Section */}
              <div className="flex justify-between items-center pt-4">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">4</span>{" "}
                  of <span className="font-semibold text-gray-700">4</span>{" "}
                  leases
                </p>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-forest-green text-white rounded-lg hover:bg-opacity-90 transition shadow-lg shadow-forest-green/20">
                  <Plus size={16} className="text-primary" />
                  <span className="font-medium text-sm">New Lease</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LesseeMyLeases;
