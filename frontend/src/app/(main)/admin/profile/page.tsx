"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  History,
  Camera,
  Save,
  Fingerprint,
  Mail,
  Phone,
  BadgeCheck,
  Shield,
  LogIn,
  Globe,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

const sideNav = [
  { label: "Personal Information", icon: User },
  { label: "Security & Password", icon: Lock },
  { label: "Notifications", icon: Bell },
  { label: "Activity Logs", icon: History },
];

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "David M.",
    email: "david.m@farmlease.co.ke",
    phone: "+254 712 345 678",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Admin Profile Settings"
        subtitle="Manage your personal information, security preferences, and system access levels."
      />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        <div className="grid grid-cols-12 gap-6 max-w-5xl">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-24 bg-linear-to-r from-sidebar-bg to-primary" />
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                <div className="relative group w-24 h-24 mx-auto">
                  <div className="w-24 h-24 rounded-full bg-sidebar-bg text-[#13ec80] flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    DM
                  </div>
                  <button className="absolute bottom-0 right-0 bg-earth text-white p-1.5 rounded-full shadow-md hover:bg-earth-light transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800 font-serif mt-3">
                  David M.
                </h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-3">
                  Super Admin
                </p>
                <div className="flex gap-2 mb-5">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-100 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Active
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-4 w-full text-left space-y-3">
                  {[
                    { label: "Joined", value: "Aug 24, 2021", icon: LogIn },
                    {
                      label: "Last Login",
                      value: "Today, 09:41 AM",
                      icon: History,
                    },
                    { label: "Region", value: "Nairobi, KE", icon: Globe },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </span>
                      <span className="font-semibold text-gray-700 text-xs">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Nav */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                {sideNav.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveSection(i)}
                      className={`flex items-center gap-3 px-5 py-4 text-sm font-medium border-l-4 transition-all ${activeSection === i
                          ? "text-sidebar-bg bg-green-50/60 border-sidebar-bg"
                          : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-8 space-y-5">
            {/* Personal Info Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-earth font-serif">
                  Edit Profile
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update your personal details and contact information.
                </p>
              </div>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Admin ID */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Admin ID
                    </label>
                    <div className="relative">
                      <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        defaultValue="ADM-2021-001"
                        disabled
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm cursor-not-allowed shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Bio / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Brief description of role..."
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm resize-none placeholder-gray-400"
                  />
                </div>
              </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-earth font-serif">
                  Security Settings
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update password and secure your account.
                </p>
              </div>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2 md:max-w-sm">
                    <label className="text-sm font-semibold text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 shadow-sm"
                    />
                  </div>
                </div>
                <div className="border-t border-gray-50 pt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 shadow-sm"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-1">
              <button className="px-5 py-2.5 border border-earth text-earth font-bold rounded-lg hover:bg-earth hover:text-white transition-all duration-300 text-sm shadow-sm">
                Discard Changes
              </button>
              <button className="px-7 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-sidebar-bg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
