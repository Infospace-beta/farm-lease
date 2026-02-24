"use client";

import { useState, useEffect } from "react";
import { useProfile, OwnerProfile } from "@/hooks/useProfile";
import { accountsApi } from "@/lib/services/api";
import OwnerPageHeader from "@/components/owner/OwnerPageHeader";

const INPUT =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition";
const LABEL =
  "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

export default function ProfilePage() {
  const { profile, loading } = useProfile();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    county: "",
    id_number: "",
  });

  const [pwForm, setPwForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone_number: profile.phone_number,
        address: profile.address,
        county: profile.county,
        id_number: profile.id_number,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      await accountsApi.updateProfile(fd);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError(null);
    setPwSuccess(false);
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("New passwords do not match.");
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await accountsApi.changePassword({
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      });
      setPwSuccess(true);
      setPwForm({ old_password: "", new_password: "", confirm_password: "" });
      setTimeout(() => setPwSuccess(false), 4000);
    } catch {
      setPwError("Incorrect current password or server error.");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc =
    (profile as OwnerProfile | null)?.profile_picture ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${form.first_name} ${form.last_name}`.trim() || "Owner",
    )}&background=047857&color=fff&size=128`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <OwnerPageHeader
        title="Profile & Settings"
        subtitle="Manage your account information and security settings."
      />
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50">
        <div className="mx-auto max-w-3xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-primary text-4xl">
                progress_activity
              </span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Avatar section */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="h-20 w-20 rounded-full border-4 border-primary/20 object-cover"
                    />
                    {profile?.is_verified && (
                      <span
                        className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md"
                        title="Verified Account"
                      >
                        <span className="material-symbols-outlined text-sm">
                          verified
                        </span>
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {form.first_name} {form.last_name}
                    </h3>
                    <p className="text-sm text-slate-500 capitalize">
                      {profile?.role === "landowner"
                        ? "Premium Land Owner"
                        : (profile?.role ?? "Land Owner")}
                    </p>
                    {profile?.is_verified ? (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-xs">
                          verified
                        </span>
                        Verified Account
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-xs">
                          pending
                        </span>
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <div className="ml-auto">
                    <label className="cursor-pointer flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                      <span className="material-symbols-outlined text-lg">
                        photo_camera
                      </span>
                      Change Photo
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal info form */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-800">
                  Personal Information
                </h3>

                {success && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    Profile updated successfully.
                  </div>
                )}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={LABEL}>First Name</label>
                    <input
                      className={INPUT}
                      value={form.first_name}
                      onChange={(e) =>
                        setForm({ ...form, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Last Name</label>
                    <input
                      className={INPUT}
                      value={form.last_name}
                      onChange={(e) =>
                        setForm({ ...form, last_name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Email Address</label>
                    <input
                      type="email"
                      className={INPUT}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Phone Number</label>
                    <input
                      type="tel"
                      className={INPUT}
                      value={form.phone_number}
                      onChange={(e) =>
                        setForm({ ...form, phone_number: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>County</label>
                    <input
                      className={INPUT}
                      value={form.county}
                      onChange={(e) =>
                        setForm({ ...form, county: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>National ID Number</label>
                    <input
                      className={INPUT}
                      value={form.id_number}
                      onChange={(e) =>
                        setForm({ ...form, id_number: e.target.value })
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Address</label>
                    <textarea
                      rows={2}
                      className={INPUT + " resize-none"}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60 transition-all shadow-sm shadow-primary/20"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                    <span className="material-symbols-outlined text-lg">
                      save
                    </span>
                  </button>
                </div>
              </div>

              {/* Change password */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-base font-bold text-slate-800">
                  Change Password
                </h3>

                {pwSuccess && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    Password changed successfully.
                  </div>
                )}
                {pwError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {pwError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className={LABEL}>Current Password</label>
                    <input
                      type="password"
                      className={INPUT}
                      value={pwForm.old_password}
                      onChange={(e) =>
                        setPwForm({ ...pwForm, old_password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>New Password</label>
                    <input
                      type="password"
                      className={INPUT}
                      value={pwForm.new_password}
                      onChange={(e) =>
                        setPwForm({ ...pwForm, new_password: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Confirm New Password</label>
                    <input
                      type="password"
                      className={INPUT}
                      value={pwForm.confirm_password}
                      onChange={(e) =>
                        setPwForm({
                          ...pwForm,
                          confirm_password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60 transition-all"
                  >
                    {saving ? "Updating..." : "Update Password"}
                    <span className="material-symbols-outlined text-lg">
                      lock_reset
                    </span>
                  </button>
                </div>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
                <h3 className="text-base font-bold text-red-700 mb-2">
                  Danger Zone
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Deactivating your account will remove all your listings and
                  cease payments. This action cannot be undone.
                </p>
                <button className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    person_remove
                  </span>
                  Deactivate Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
