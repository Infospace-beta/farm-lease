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
import type { SignupData, UserRole } from "@/types";

const schema = yup.object({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  phone_number: yup
    .string()
    .matches(/^[0-9+\s-]{7,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  role: yup
    .string()
    .oneOf(["farmer", "landowner", "dealer"] as const, "Select a valid role")
    .required("Role is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  password2: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

type FormData = SignupData & { password2: string };

const ROLE_OPTIONS: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: "farmer", label: "Farmer / Lessee", icon: "agriculture", desc: "Browse & lease land" },
  { value: "landowner", label: "Land Owner", icon: "home_work", desc: "List your property" },
  { value: "dealer", label: "Agro-Dealer", icon: "storefront", desc: "Sell agri inputs" },
];

export default function SignupPage() {
  const { signup: signupUser, isAuthenticated, user } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "" as any,
      password: "",
      password2: "",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signupUser(data as SignupData);
      toast.success("Account created! Redirecting…", { autoClose: 1500 });
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const firstMsg = errData
        ? Object.values(errData).flat()[0]
        : "Signup failed. Please try again.";
      toast.error(firstMsg as string);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      window.location.href = dashboardPathFor(user.role);
    }
  }, [isAuthenticated, user]);

  const inputClass =
    "w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16a34a]/30 focus:border-[#16a34a] transition-all placeholder:text-gray-400";

  const Field = ({
    label,
    name,
    children,
  }: {
    label: string;
    name: keyof FormData;
    children: React.ReactNode;
  }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      {children}
      {errors[name] && (
        <p className="mt-1.5 text-xs text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-[#16a34a]" />
            <p className="text-sm font-medium text-gray-700">Creating account and redirecting…</p>
          </div>
        </div>
      )}

      {/* ── Left panel: Brand ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0f392b] flex-col justify-between p-12 pt-10 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#13ec80 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.06,
          }}
        />
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#13ec80]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#16a34a]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo + Main copy grouped */}
        <div className="relative z-10 flex flex-col gap-16">
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

          {/* Main copy */}
          <div className="space-y-5">
          <h2
            className="text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Join thousands
            <br />
            of farmers &amp;
            <br />
            <span className="text-[#13ec80]">landowners.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Create your free account and start accessing verified farmland or listing your property
            on Kenya&apos;s most trusted agricultural leasing platform.
          </p>
          {/* Benefits list */}
          <div className="space-y-3 pt-2">
            {[
              { icon: "agriculture", text: "Browse & lease verified farmland" },
              { icon: "home_work", text: "List land with AI-powered soil data" },
              { icon: "auto_awesome", text: "Gemini AI crop yield predictions" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#13ec80] text-base">
                    {item.icon}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
          </div>
        </div>{/* end Logo + Main copy group */}

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
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
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

          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Create account
            </h1>
            <p className="text-gray-500 text-sm">
              Join FarmLease and start your agricultural journey
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" name="first_name">
                <input placeholder="John" {...register("first_name")} className={inputClass} />
              </Field>
              <Field label="Last name" name="last_name">
                <input placeholder="Doe" {...register("last_name")} className={inputClass} />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email address" name="email">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-lg">mail</span>
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            {/* Phone */}
            <Field label="Phone number" name="phone_number">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-lg">phone</span>
                </div>
                <input
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  {...register("phone_number")}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </Field>

            {/* Role cards */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">I am a…</label>
              {/* Hidden field keeps react-hook-form validation working */}
              <input type="hidden" {...register("role")} />
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setValue("role", r.value, { shouldValidate: true })}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${selectedRole === r.value
                        ? "border-[#16a34a] bg-[#16a34a]/5 shadow-sm"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white"
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl ${selectedRole === r.value ? "text-[#16a34a]" : "text-gray-400"
                        }`}
                    >
                      {r.icon}
                    </span>
                    <span
                      className={`text-xs font-semibold leading-tight ${selectedRole === r.value ? "text-[#16a34a]" : "text-gray-600"
                        }`}
                    >
                      {r.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">{r.desc}</span>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Password */}
            <Field label="Password" name="password">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-lg">lock</span>
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  {...register("password")}
                  className={`${inputClass} pl-11 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            {/* Confirm password */}
            <Field label="Confirm password" name="password2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-lg">lock_reset</span>
                </div>
                <input
                  type={showPw2 ? "text" : "password"}
                  placeholder="Repeat password"
                  {...register("password2")}
                  className={`${inputClass} pl-11 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPw2 ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0f392b] hover:bg-[#16a34a] disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-sm transition-all shadow-lg shadow-[#0f392b]/20"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#16a34a] hover:text-[#15803d] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

