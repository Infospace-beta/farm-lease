"use client";
import { useState } from "react";

export default function ProfilePage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
        <div>
          <h2
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Profile & Settings
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your personal information, security and payment preferences
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#0f392b] hover:bg-[#1c4a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow transition-colors">
          <span className="material-icons-round text-lg">save</span>
          Save Changes
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-7 py-5 border-b border-gray-100">
              <h3
                className="font-bold text-gray-800 text-lg flex items-center gap-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-[#047857]">
                  person
                </span>
                Personal Information
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Your public profile details used across FarmLease.
              </p>
            </div>
            <div className="p-7">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0f392b] to-[#1c4a3a] flex items-center justify-center text-[#13ec80] text-3xl font-extrabold shadow-md">
                    DM
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <span className="material-icons-round text-gray-500 text-[14px]">
                      photo_camera
                    </span>
                  </button>
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800 mb-0.5">
                    David Muthaura
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    Premium Lessee · Member since Jan 2023
                  </div>
                  <button className="text-xs font-semibold text-[#047857] border border-[#047857]/30 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    defaultValue="David"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Muthaura"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-xl">
                      email
                    </span>
                    <input
                      type="email"
                      defaultValue="david.m@farmlease.co.ke"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-xl">
                      phone
                    </span>
                    <input
                      type="tel"
                      defaultValue="+254 712 345 890"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-7 py-5 border-b border-gray-100">
              <h3
                className="font-bold text-gray-800 text-lg flex items-center gap-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-[#047857]">
                  lock
                </span>
                Security & Password
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Keep your account secure with a strong password and 2-factor
                authentication.
              </p>
            </div>
            <div className="p-7 space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-xl">
                    lock_outline
                  </span>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-xl">
                      lock
                    </span>
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-icons-round text-gray-400 text-xl">
                      lock
                    </span>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-[#047857] focus:ring-2 focus:ring-[#047857]/10 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* 2FA Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#047857]/10 rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-[#047857] text-lg">
                      shield
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      Two-Factor Authentication
                    </div>
                    <div className="text-xs text-gray-400">
                      Add an extra layer of security via SMS
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                  className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${twoFAEnabled ? "bg-[#047857]" : "bg-gray-200"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${twoFAEnabled ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <button className="flex items-center gap-2 text-sm font-bold text-[#047857] border border-[#047857]/30 px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors">
                <span className="material-icons-round text-lg">lock_reset</span>
                Update Password
              </button>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-7 py-5 border-b border-gray-100">
              <h3
                className="font-bold text-gray-800 text-lg flex items-center gap-2"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                <span className="material-icons-round text-[#047857]">
                  credit_card
                </span>
                Payment Methods
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage your linked payment sources for lease and escrow
                settlements.
              </p>
            </div>
            <div className="p-7 space-y-4">
              {/* M-Pesa Integration Card */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#047857] rounded-xl flex items-center justify-center shadow-sm">
                    <span className="material-icons-round text-white text-2xl">
                      phone_android
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">
                      M-Pesa Integration
                    </div>
                    <div className="text-xs text-gray-500">
                      +254 712 *** 890
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] bg-[#13ec80] text-[#0f392b] px-2 py-0.5 rounded-full font-extrabold">
                        Primary
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-[#047857] px-2 py-0.5 rounded-full font-semibold">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-xs text-gray-500 hover:text-red-500 font-medium flex items-center gap-1 transition-colors">
                  <span className="material-icons-round text-base">
                    delete_outline
                  </span>
                  Remove
                </button>
              </div>

              {/* Add Bank Account Card */}
              <button className="w-full flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 hover:border-[#047857] rounded-xl group transition-all">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-emerald-50 rounded-xl flex items-center justify-center transition-colors">
                  <span className="material-icons-round text-gray-400 group-hover:text-[#047857] text-2xl transition-colors">
                    account_balance
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-600 group-hover:text-gray-800 transition-colors">
                    Add Bank Account
                  </div>
                  <div className="text-xs text-gray-400">
                    Link a bank account for direct payments
                  </div>
                </div>
                <span className="ml-auto material-icons-round text-gray-300 group-hover:text-[#047857] transition-colors">
                  add_circle_outline
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
