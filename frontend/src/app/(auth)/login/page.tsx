"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/providers";
import { dashboardPathFor } from "@/lib/auth";
import type { LoginCredentials } from "@/types";

const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!", { autoClose: 1500 });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Invalid email or password.";
      toast.error(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      window.location.href = dashboardPathFor(user.role);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: Brand ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0f392b] flex-col justify-between p-12 relative overflow-hidden">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#13ec80 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.06,
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#13ec80]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-[#16a34a]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#13ec80] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
              <span className="material-icons-round text-[#0f392b] text-2xl">agriculture</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none" style={{ fontFamily: "Playfair Display, serif" }}>
                Farm<span className="text-gray-300 font-normal" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Lease</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">Land Management</p>
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13ec80]/10 border border-[#13ec80]/20 text-[#13ec80] text-xs font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#13ec80] animate-pulse" />
            AI-Driven Agriculture
          </div>
          <h2
            className="text-4xl xl:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Precision Farming,
            <br />
            <span className="text-[#13ec80]">Data-Backed</span>
            <br />
            Leasing.
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Access verified land with predictive yield analytics. Connecting landowners and modern
            farmers through a secure, data-driven ecosystem.
          </p>
          {/* Stats */}
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-2xl font-bold text-white">98%</p>
              <p className="text-xs text-gray-500">Predictive Accuracy</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">50k+</p>
              <p className="text-xs text-gray-500">Acres Analyzed</p>
            </div>
          </div>
        </div>

        {/* Bottom verification badge */}
        <div className="relative z-10 flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-green-400 text-xl">verified_user</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Verified by Ardhisasa</p>
            <p className="text-gray-500 text-xs">Kenya&apos;s National Land Registry</p>
          </div>
        </div>
      </div>

      {/* ── Right panel: Form ────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-[#0f392b] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#13ec80] text-xl">grid_view</span>
            </div>
            <span
              className="text-xl font-bold text-[#0f392b]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              FarmLease
            </span>
          </div>

          <div className="mb-10">
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">Sign in to your FarmLease account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-lg">mail</span>
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all placeholder:text-gray-400"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-lg">lock</span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-11 pr-11 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0f392b] hover:bg-[#16a34a] disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-[#0f392b]/20 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#16a34a] hover:text-[#15803d] font-semibold transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
