import { useState } from "react";
import Link from "next/link";
import LesseeSidebar from "../../components/layout/LesseeSidebar";
import LesseeHeader from "../../components/layout/LesseeHeader";
import {
  Settings,
  CheckCircle2,
  Sparkles,
  FileText,
  AlertCircle,
  Download,
  History,
  Bell,
} from "lucide-react";

function LesseeNotifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Notification categories with counts
  const tabs = [
    { id: "all", label: "All Notifications", count: 12 },
    { id: "payments", label: "Payments", count: 3 },
    { id: "ai-reports", label: "AI Reports", count: 5, icon: true },
    { id: "agreements", label: "Agreements", count: 1 },
  ];

  // Sample notifications data
  const notifications = {
    today: [
      {
        id: 1,
        type: "payment",
        title: "Payment Released from Escrow",
        description:
          "Your secure payment of Ksh 45,000 for Plot A4 has been successfully released to the landowner, John Doe.",
        time: "10:30 AM",
        icon: "Ksh",
        iconBg: "bg-green-50",
        iconBorder: "border-green-100",
        iconColor: "text-primary-dark",
        accentBar: true,
        unread: false,
        actions: [
          { label: "View Receipt", primary: true },
          { label: "Dismiss", primary: false },
        ],
      },
      {
        id: 2,
        type: "ai-report",
        title: "Soil Analysis Ready",
        description:
          "Gemini AI has completed the analysis for Plot A4 - North. Nitrogen levels are slightly below optimal range for the upcoming maize cycle.",
        time: "09:15 AM",
        icon: "sparkles",
        iconBg: "bg-amber-50",
        iconBorder: "border-amber-100",
        iconColor: "text-amber-500",
        unread: true,
        actions: [{ label: "View AI Report", primary: false, outline: true }],
      },
    ],
    yesterday: [
      {
        id: 3,
        type: "agreement",
        title: "New Agreement Draft",
        description:
          "Landowner Jane Smith has proposed a new lease agreement for Plot B2 - East. Please review the terms before signing.",
        time: "4:45 PM",
        icon: "document",
        iconBg: "bg-earth-brown/10",
        iconBorder: "border-earth-brown/20",
        iconColor: "text-earth-brown",
        unread: false,
        actions: [
          {
            label: "Review PDF",
            primary: true,
            color: "earth-brown",
            icon: "pdf",
          },
        ],
      },
      {
        id: 4,
        type: "system",
        title: "Platform Maintenance Completed",
        description:
          "Scheduled maintenance for the payment gateway has been completed successfully. All services are operational.",
        time: "2:00 PM",
        icon: "system",
        iconBg: "bg-blue-50",
        iconBorder: "border-blue-100",
        iconColor: "text-blue-500",
        unread: false,
        opacity: true,
      },
    ],
    older: [
      {
        id: 5,
        type: "warning",
        title: "Lease Expiring Soon",
        description:
          "Your lease for Plot C1 - South expires in 30 days. Consider renewing early to lock in current rates.",
        time: "Oct 24",
        icon: "warning",
        iconBg: "bg-red-50",
        iconBorder: "border-red-100",
        iconColor: "text-red-500",
        unread: false,
        opacity: true,
        actions: [{ label: "View Lease Details", primary: false, link: true }],
      },
    ],
  };

  const renderIcon = (icon, iconColor) => {
    switch (icon) {
      case "Ksh":
        return <span className={`font-bold text-lg ${iconColor}`}>Ksh</span>;
      case "sparkles":
        return <Sparkles className={`w-5 h-5 ${iconColor}`} />;
      case "document":
        return <FileText className={`w-5 h-5 ${iconColor}`} />;
      case "system":
        return <Download className={`w-5 h-5 ${iconColor}`} />;
      case "warning":
        return <AlertCircle className={`w-5 h-5 ${iconColor}`} />;
      default:
        return <Bell className={`w-5 h-5 ${iconColor}`} />;
    }
  };

  const renderNotificationCard = (notification) => (
    <div
      key={notification.id}
      className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition-all group flex gap-4 items-start relative overflow-hidden ${
        notification.opacity ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Accent Bar for important notifications */}
      {notification.accentBar && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-dark"></div>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0 border ${notification.iconBorder} mt-1`}
      >
        {renderIcon(notification.icon, notification.iconColor)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary-dark transition-colors">
            {notification.title}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {notification.time}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
          {notification.description
            .split(
              /(\*\*.*?\*\*|\bKsh \d{1,3}(?:,\d{3})*\b|\bPlot [A-Z]\d+ - [A-Z][a-z]+\b)/g,
            )
            .map((part, index) => {
              if (part.match(/\bKsh \d{1,3}(?:,\d{3})*\b/)) {
                return (
                  <span key={index} className="font-bold text-gray-900">
                    {part}
                  </span>
                );
              } else if (part.match(/\bPlot [A-Z]\d+ - [A-Z][a-z]+\b/)) {
                return (
                  <span key={index} className="font-semibold text-gray-900">
                    {part}
                  </span>
                );
              }
              return part;
            })}
        </p>

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <div className="flex items-center gap-4">
            {notification.actions.map((action, index) => {
              if (action.primary) {
                const bgColor =
                  action.color === "earth-brown"
                    ? "bg-earth-brown hover:bg-opacity-90 shadow-earth-brown/20"
                    : "bg-forest-green hover:bg-opacity-90 shadow-forest-green/20";

                return (
                  <button
                    key={index}
                    className={`px-4 py-2 ${bgColor} text-white text-xs font-bold rounded-lg transition shadow-lg flex items-center gap-2`}
                  >
                    {action.icon === "pdf" && <FileText className="w-3 h-3" />}
                    {action.label}
                  </button>
                );
              } else if (action.outline) {
                return (
                  <button
                    key={index}
                    className="px-4 py-2 border border-forest-green text-forest-green text-xs font-bold rounded-lg hover:bg-forest-green hover:text-white transition"
                  >
                    {action.label}
                  </button>
                );
              } else if (action.link) {
                return (
                  <button
                    key={index}
                    className="text-xs font-bold text-forest-green hover:underline"
                  >
                    {action.label}
                  </button>
                );
              } else {
                return (
                  <button
                    key={index}
                    className="text-xs font-bold text-gray-500 hover:text-gray-700"
                  >
                    {action.label}
                  </button>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Unread Indicator */}
      {notification.unread && (
        <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      )}
    </div>
  );

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
          title="Notifications"
          subtitle="Stay updated on your lease payments, crop health reports, and new agreements."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          rightContent={
            <>
              <button
                className="p-2 text-gray-400 hover:text-forest-green hover:bg-gray-100 rounded-full transition"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button className="flex px-4 py-2 bg-white border border-gray-200 text-forest-green font-medium text-sm rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span className="hidden sm:inline">Mark all as read</span>
              </button>
            </>
          }
        />

        {/* Content area */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 bg-background-light p-4 lg:p-8 overflow-y-auto">
            <div className="border-b border-gray-200 mb-8 sticky top-0 bg-background-light/95 backdrop-blur-sm z-10">
              <div className="flex gap-6 overflow-x-auto pb-3 no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm font-medium pb-3 px-1 whitespace-nowrap border-b-2 transition-all flex items-center ${
                      activeTab === tab.id
                        ? "text-forest-green border-forest-green font-bold"
                        : "text-gray-500 hover:text-earth-brown hover:border-earth-brown/30 border-transparent"
                    }`}
                  >
                    {tab.icon && (
                      <Sparkles className="w-4 h-4 text-amber-500 mr-1" />
                    )}
                    {tab.label}
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                        activeTab === tab.id
                          ? "bg-forest-green/10 text-forest-green"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-w-[1600px] mx-auto space-y-10 pb-12">
              {/* Today Section */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Today
                  </h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="space-y-4">
                  {notifications.today.map(renderNotificationCard)}
                </div>
              </section>

              {/* Yesterday Section */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Yesterday
                  </h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="space-y-4">
                  {notifications.yesterday.map(renderNotificationCard)}
                </div>
              </section>

              {/* Older Section */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Older
                  </h3>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                <div className="space-y-4">
                  {notifications.older.map(renderNotificationCard)}
                </div>
              </section>

              {/* Archive Link */}
              <div className="text-center pt-8 pb-4">
                <button className="text-sm font-medium text-gray-400 hover:text-forest-green transition flex items-center justify-center gap-2 mx-auto">
                  <History className="w-5 h-5" />
                  View archived notifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LesseeNotifications;
