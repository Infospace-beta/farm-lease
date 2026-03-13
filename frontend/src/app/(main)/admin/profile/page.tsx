"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { accountsApi } from "@/lib/services/api";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: string;
  phone_number: string;
  address: string | null;
  county: string | null;
  id_number: string | null;
  is_verified: boolean;
  is_staff: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

const sideNav = [
  { label: "Personal Information", icon: User },
  { label: "Security & Password", icon: Lock },
  { label: "Notifications", icon: Bell },
  { label: "Activity Logs", icon: History },
];

function roleLabel(role: string): string {
  const map: Record<string, string> = {
    admin: "Super Admin",
    farmer: "Farmer",
    landowner: "Landowner",
    dealer: "Agro-Dealer",
  };
  return map[role] ?? role;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLastLogin(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return isToday ? `Today, ${timeStr}` : `${formatDate(iso)}, ${timeStr}`;
}

function getInitials(name: string, username: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2)
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  return username.slice(0, 2).toUpperCase();
}

function buildAdminId(id: number, createdAt: string): string {
  const year = new Date(createdAt).getFullYear();
  return `ADM-${year}-${String(id).padStart(3, "0")}`;
}

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    county: "",
  });

  const [pwData, setPwData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await accountsApi.profile();
        setProfile(data);
        setFormData({
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          email: data.email ?? "",
          phone_number: data.phone_number ?? "",
          address: data.address ?? "",
          county: data.county ?? "",
        });
      } catch {
        setErrorMsg("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      const fd = new FormData();
      fd.append("first_name", formData.first_name);
      fd.append("last_name", formData.last_name);
      fd.append("email", formData.email);
      fd.append("phone_number", formData.phone_number);
      if (formData.address) fd.append("address", formData.address);
      if (formData.county) fd.append("county", formData.county);
      const { data } = await accountsApi.updateProfile(fd);
      setProfile(data);
      setSuccessMsg("Profile updated successfully.");
    } catch {
      setErrorMsg("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!profile) return;
    setFormData({
      first_name: profile.first_name ?? "",
      last_name: profile.last_name ?? "",
      email: profile.email ?? "",
      phone_number: profile.phone_number ?? "",
      address: profile.address ?? "",
      county: profile.county ?? "",
    });
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleChangePassword = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    if (!pwData.currentPassword || !pwData.newPassword) {
      setErrorMsg("Please fill in all password fields.");
      return;
    }
    if (pwData.newPassword !== pwData.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }
    setChangingPw(true);
    try {
      await accountsApi.changePassword({
        old_password: pwData.currentPassword,
        new_password: pwData.newPassword,
      });
      setPwData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccessMsg("Password changed successfully.");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { old_password?: string; detail?: string } } };
      setErrorMsg(
        e?.response?.data?.old_password ??
        e?.response?.data?.detail ??
        "Failed to change password."
      );
    } finally {
      setChangingPw(false);
    }
  };

  const initials = profile ? getInitials(profile.name, profile.username) : "—";

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AdminPageHeader
          title="Admin Profile Settings"
          subtitle="Manage your personal information, security preferences, and system access levels."
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-sidebar-bg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <AdminPageHeader
        title="Admin Profile Settings"
        subtitle="Manage your personal information, security preferences, and system access levels."
      />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
        {/* Status messages */}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}
        <div className="grid grid-cols-12 gap-6 w-full">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            {/* Avatar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-24 bg-linear-to-r from-sidebar-bg to-primary" />
              <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
                <div className="relative group w-24 h-24 mx-auto">
                  <div className="w-24 h-24 rounded-full bg-sidebar-bg text-[#13ec80] flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    {initials}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-earth text-white p-1.5 rounded-full shadow-md hover:bg-earth-light transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800 font-serif mt-3">
                  {profile?.name || profile?.username || "—"}
                </h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-3">
                  {profile ? roleLabel(profile.role) : "—"}
                </p>
                <div className="flex gap-2 mb-5">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-100 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Active
                  </span>
                  {profile?.is_verified && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium border border-blue-100 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-4 w-full text-left space-y-3">
                  {[
                    {
                      label: "Joined",
                      value: profile ? formatDate(profile.created_at) : "—",
                      icon: LogIn,
                    },
                    {
                      label: "Last Login",
                      value: profile ? formatLastLogin(profile.last_login) : "—",
                      icon: History,
                    },
                    {
                      label: "Region",
                      value: profile?.county || "—",
                      icon: Globe,
                    },
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
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                        value={profile ? buildAdminId(profile.id, profile.created_at) : "—"}
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
                        value={formData.phone_number}
                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm"
                      />
                    </div>
                  </div>

                  {/* County / Region */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      County / Region
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.county}
                        onChange={(e) => handleInputChange('county', e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Address / Notes */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Address / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Your address or brief description..."
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 focus:border-sidebar-bg shadow-sm resize-none placeholder-gray-400"
                  />
                </div>
              </div>
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
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 md:col-span-2 md:max-w-sm">
                    <label className="text-sm font-semibold text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={pwData.currentPassword}
                      onChange={(e) => setPwData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                      value={pwData.newPassword}
                      onChange={(e) => setPwData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={pwData.confirmPassword}
                      onChange={(e) => setPwData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-bg/20 shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPw}
                    className="px-6 py-2.5 bg-earth text-white font-bold rounded-lg hover:bg-earth-light shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {changingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-1">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-5 py-2.5 border border-earth text-earth font-bold rounded-lg hover:bg-earth hover:text-white transition-all duration-300 text-sm shadow-sm"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-7 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-sidebar-bg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
