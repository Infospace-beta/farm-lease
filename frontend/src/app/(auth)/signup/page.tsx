"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/providers";
import type { RegisterData, UserRole } from "@/types";

// ─── Validation schema ─────────────────────────────────────────────────────────
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

type FormData = RegisterData & { password2: string };

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "farmer", label: "Farmer / Lessee" },
  { value: "landowner", label: "Land Owner" },
  { value: "dealer", label: "Agro-Dealer" },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const { register: registerUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await registerUser(data as RegisterData);
      toast.success("Account created! Redirecting…");
    } catch (err: unknown) {
      const errData = (err as { response?: { data?: Record<string, string[]> } })?.response?.data;
      const firstMsg = errData
        ? Object.values(errData).flat()[0]
        : "Registration failed. Please try again.";
      toast.error(firstMsg as string);
    } finally {
      setLoading(false);
    }
  };

  // Reusable field wrapper
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
      )}
    </div>
  );

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">FarmLease</h1>
          <p className="mt-2 text-gray-500 text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" name="first_name">
              <input
                placeholder="John"
                {...register("first_name")}
                className={inputClass}
              />
            </Field>
            <Field label="Last name" name="last_name">
              <input
                placeholder="Doe"
                {...register("last_name")}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email address" name="email">
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={inputClass}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone number" name="phone_number">
            <input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              {...register("phone_number")}
              className={inputClass}
            />
          </Field>

          {/* Role */}
          <Field label="I am a…" name="role">
            <select {...register("role")} className={inputClass}>
              <option value="">Select your role</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          {/* Password */}
          <Field label="Password" name="password">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          {/* Confirm password */}
          <Field label="Confirm password" name="password2">
            <div className="relative">
              <input
                type={showPw2 ? "text" : "password"}
                placeholder="••••••••"
                {...register("password2")}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw2((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
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
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
