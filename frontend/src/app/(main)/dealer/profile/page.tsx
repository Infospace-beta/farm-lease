"use client";
import { useState, useRef } from "react";
import DealerPageHeader from "@/components/dealer/DealerPageHeader";

const tabs = ["Store Details", "Personal Info", "Bank & Payments", "Security"];

const INITIAL_FORM = {
  storeName: "GreenHarvest Agro Inputs",
  regNumber: "BN-99283-KE",
  email: "info@greenharvestagro.co.ke",
  phone: "+254 712 345 678",
  county: "Uasin Gishu",
  town: "Eldoret, Market Street",
  description:
    "GreenHarvest Agro Inputs is a licensed agro-dealer offering quality certified seeds, fertilizers, pesticides and equipment to farmers in the North Rift region.",
};

export default function DealerProfilePage() {
  const [activeTab, setActiveTab] = useState("Store Details");
  const [form, setForm] = useState(INITIAL_FORM);
  const [savedForm, setSavedForm] = useState(INITIAL_FORM);
  const [toast, setToast] = useState<string | null>(null);
  const [payment, setPayment] = useState("mpesa");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const setField = (field: keyof typeof INITIAL_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSavedForm(form);
    showToast("Changes saved successfully");
  };
  const handleCancel = () => {
    setForm(savedForm);
    showToast("Changes cancelled");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8">
      {toast && (
        <div className="fixed top-6 right-6 bg-[#0f392b] text-white text-sm px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2">
          <span className="material-icons-round text-sm">check_circle</span>
          {toast}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
      />
      {/* Header */}
      <DealerPageHeader
        title="Profile Settings"
        subtitle="Manage your store identity, documents and payment details."
      >
        <button
          onClick={handleCancel}
          className="flex px-4 py-2.5 text-sm border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 bg-white"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex px-5 py-2.5 text-sm bg-[#047857] text-white rounded-lg items-center gap-2 hover:opacity-90 shadow-lg shadow-[#047857]/20"
        >
          <span className="material-icons-round text-sm">save</span>
          Save Changes
        </button>
      </DealerPageHeader>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-semibold whitespace-nowrap transition border-b-2 -mb-px ${activeTab === tab ? "border-[#047857] text-[#047857]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Store Details" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Store Identity Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0f392b] to-[#047857] flex items-center justify-center text-white text-3xl font-bold">
                  GH
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm"
                >
                  <span className="material-icons-round text-sm">
                    photo_camera
                  </span>
                </button>
              </div>
              <h3
                className="text-xl font-bold text-gray-900 mb-1"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                GreenHarvest Agro
              </h3>
              <p className="text-xs text-gray-400 mb-4">Dealer ID: #AG-88219</p>
              <div className="flex items-center justify-center gap-2 py-2 bg-green-50 rounded-xl mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-green-700">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Member Since{" "}
                <span className="font-semibold text-gray-600">Aug 2021</span>
              </p>
            </div>

            {/* Verification Documents */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-sm">
                Verification Documents
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Business Permit", size: "2.4 MB", verified: true },
                  {
                    name: "Agro-Dealer License",
                    size: "1.8 MB",
                    verified: true,
                  },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-icons-round text-red-400 text-base">
                        picture_as_pdf
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-gray-400">{doc.size}</p>
                    </div>
                    {doc.verified && (
                      <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-icons-round text-green-600 text-sm">
                          check
                        </span>
                      </span>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400 font-semibold hover:border-[#047857] hover:text-[#047857] hover:bg-emerald-50/30 transition flex items-center justify-center gap-2"
                >
                  <span className="material-icons-round text-base">upload</span>
                  Upload New Document
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Store Information */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-5">
                Store Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Store Name
                  </label>
                  <input
                    value={form.storeName}
                    onChange={(e) => setField("storeName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Registration Number
                  </label>
                  <input
                    value={form.regNumber}
                    onChange={(e) => setField("regNumber", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    County
                  </label>
                  <select
                    value={form.county}
                    onChange={(e) => setField("county", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] appearance-none"
                  >
                    <option>Uasin Gishu</option>
                    <option>Nairobi</option>
                    <option>Nakuru</option>
                    <option>Meru</option>
                    <option>Nyeri</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Town / Market Center
                  </label>
                  <input
                    value={form.town}
                    onChange={(e) => setField("town", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Store Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setField("description", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition"
                  />
                </div>
              </div>
            </div>

            {/* Settlement Details */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 mb-5">
                Settlement Details
              </h3>
              <div className="space-y-3">
                {/* M-Pesa */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${payment === "mpesa" ? "border-[#047857] bg-emerald-50/30" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "mpesa"}
                    onChange={() => setPayment("mpesa")}
                    className="mt-0.5 accent-[#047857]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">M</span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        M-PESA Paybill
                      </span>
                      <span className="text-[9px] font-bold bg-[#047857] text-white px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    </div>
                    <div className="flex gap-6 text-xs text-gray-500">
                      <span>
                        Paybill:{" "}
                        <strong className="text-gray-700">542391</strong>
                      </span>
                      <span>
                        Account:{" "}
                        <strong className="text-gray-700">GreenHarvest</strong>
                      </span>
                    </div>
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-[#047857] hover:bg-emerald-50 rounded-lg transition">
                    <span className="material-icons-round text-base">edit</span>
                  </button>
                </label>

                {/* Bank */}
                <label
                  className={`flex items-start gap-4 p-4 border-2 rounded-2xl cursor-pointer transition ${payment === "bank" ? "border-[#047857] bg-emerald-50/30" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "bank"}
                    onChange={() => setPayment("bank")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="material-icons-round text-white text-sm">
                          account_balance
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        Bank Transfer
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      KCB Bank — Account ending in **5421
                    </p>
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    <span className="material-icons-round text-base">edit</span>
                  </button>
                </label>

                <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-semibold hover:border-[#047857] hover:text-[#047857] hover:bg-emerald-50/30 transition flex items-center justify-center gap-2">
                  <span className="material-icons-round text-base">add</span>
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Store Details" && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <span className="material-icons-round text-4xl text-gray-200 mb-3">
            construction
          </span>
          <p className="text-gray-400 text-sm font-medium">
            {activeTab} section coming soon
          </p>
        </div>
      )}
    </div>
  );
}
