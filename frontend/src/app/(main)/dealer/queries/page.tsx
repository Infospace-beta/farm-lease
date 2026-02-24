"use client";
import { useState } from "react";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";

const tabs = ["All", "New", "In Progress", "Resolved"];

const queries = [
  {
    id: "Q-001",
    customer: "Grace N.",
    initials: "GN",
    subject: "Bulk Order Inquiry – DAP Fertilizer 50kg",
    msg: "Hello, I need to order 20 bags of DAP fertilizer as soon as possible for the planting season. Can you confirm availability?",
    time: "10 minutes ago",
    status: "New",
    statusClass: "bg-orange-100 text-orange-700",
    unread: true,
    category: "Order",
  },
  {
    id: "Q-002",
    customer: "Samuel K.",
    initials: "SK",
    subject: "Pesticides for Fall Armyworm",
    msg: "Do you have pesticides specifically for controlling fall armyworm in maize? What do you recommend?",
    time: "1 hour ago",
    status: "New",
    statusClass: "bg-orange-100 text-orange-700",
    unread: true,
    category: "Product Info",
  },
  {
    id: "Q-003",
    customer: "FarmCorp Ltd.",
    initials: "FC",
    subject: "Quotation for Solar Water Pump",
    msg: "We are looking for a quotation for the solar water pump kit for installation on a 5-acre farm. Please send pricing and specs.",
    time: "3 hours ago",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-700",
    unread: false,
    category: "Quotation",
  },
  {
    id: "Q-004",
    customer: "John D.",
    initials: "JD",
    subject: "Delivery Confirmation – Order #ORD-2486",
    msg: "Quick confirmation — my order arrived in perfect condition. Thank you for the prompt service!",
    time: "Yesterday",
    status: "Resolved",
    statusClass: "bg-green-100 text-green-700",
    unread: false,
    category: "Feedback",
  },
  {
    id: "Q-005",
    customer: "Mary W.",
    initials: "MW",
    subject: "Irrigation Kit Installation Query",
    msg: "Does the drip irrigation kit come with installation instructions? What is the setup duration for 1 acre?",
    time: "Yesterday",
    status: "New",
    statusClass: "bg-orange-100 text-orange-700",
    unread: true,
    category: "Product Info",
  },
  {
    id: "Q-006",
    customer: "David O.",
    initials: "DO",
    subject: "Payment Issue - Order #ORD-2480",
    msg: "I made payment for my order but I have not received a confirmation message. Please check.",
    time: "2 days ago",
    status: "In Progress",
    statusClass: "bg-blue-100 text-blue-700",
    unread: false,
    category: "Payment",
  },
];

type Query = (typeof queries)[0] & { replies?: string[] };

const selectedQuery = queries[0];

export default function QueriesPage() {
  const [allQueries, setAllQueries] = useState<Query[]>(queries);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedId, setSelectedId] = useState("Q-001");
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setAllQueries((prev) =>
      prev.map((q) =>
        q.id === selectedId
          ? {
            ...q,
            status: "In Progress",
            statusClass: "bg-blue-100 text-blue-700",
            unread: false,
            replies: [...(q.replies || []), replyText],
          }
          : q,
      ),
    );
    setReplyText("");
    showToast("Reply sent");
  };

  const filtered = allQueries.filter(
    (q) =>
      (activeTab === "All" || q.status === activeTab) &&
      (q.customer.toLowerCase().includes(search.toLowerCase()) ||
        q.subject.toLowerCase().includes(search.toLowerCase())),
  );
  const active = allQueries.find((q) => q.id === selectedId) || selectedQuery;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      <DealerPageHeader
        title="Customer Queries"
        subtitle="Respond to buyer messages and manage customer support."
      >
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-base">
            search
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queries..."
            className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857]"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
          <span className="material-icons-round text-base">filter_list</span>
          Filter
        </button>
      </DealerPageHeader>

      <div className="flex gap-6 flex-1 min-h-0 p-4 lg:p-8 bg-[#f8fafc]">
        {/* Left — query list */}
        <div className="w-80 xl:w-96 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-xs font-bold transition border-b-2 -mb-px ${activeTab === tab ? "border-[#047857] text-[#047857]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedId(q.id)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition ${selectedId === q.id ? "bg-emerald-50/50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#0f392b] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {q.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span
                        className={`text-xs font-bold ${q.unread ? "text-gray-800" : "text-gray-500"}`}
                      >
                        {q.customer}
                      </span>
                      <span className="text-[9px] text-gray-400">{q.time}</span>
                    </div>
                    <p
                      className={`text-[11px] truncate mb-1 ${q.unread ? "font-semibold text-gray-700" : "text-gray-500"}`}
                    >
                      {q.subject}
                    </p>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${q.statusClass}`}
                      >
                        {q.status}
                      </span>
                      {q.unread && (
                        <span className="w-2 h-2 bg-[#047857] rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — query detail */}
        <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0f392b] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {active.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {active.customer}
                  </p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {active.id} · {active.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full ${active.statusClass}`}
                >
                  {active.status}
                </span>
                <button className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400">
                  <span className="material-icons-round text-base">
                    more_vert
                  </span>
                </button>
              </div>
            </div>
            <h3 className="font-bold text-gray-700 text-sm mt-3">
              {active.subject}
            </h3>
          </div>

          {/* Message */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 bg-[#0f392b] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {active.initials}
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {active.msg}
                </p>
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {active.time}
                </p>
              </div>
            </div>
          </div>

          {/* Reply Box */}
          <div className="p-5 border-t border-gray-100">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-[#047857] rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                DM
              </div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  placeholder="Type your reply..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <span className="material-icons-round text-base">
                        attach_file
                      </span>
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      <span className="material-icons-round text-base">
                        emoji_emotions
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={sendReply}
                    className="flex items-center gap-2 px-4 py-2 bg-[#047857] text-white rounded-xl text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
                    disabled={!replyText.trim()}
                  >
                    <span className="material-icons-round text-sm">send</span>
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
