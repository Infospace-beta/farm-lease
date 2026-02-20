"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/providers";
import type { LoginCredentials } from "@/types";

// ─── Validation schema ─────────────────────────────────────────────────────────
const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// ─── Component ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login, isAuthenticated, logout } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!", { autoClose: 1500 });
      // Keep loading state until redirect completes
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        "Invalid email or password.";
      toast.error(msg);
      setLoading(false);
    }
  };

  // If already logged in, show logout option
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Already Logged In</h2>
          <p className="text-gray-600 mb-6">
            You are currently logged in. Logout to access the login page.
          </p>
          <button
            onClick={() => logout()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      {/* Redirect Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={40} className="animate-spin text-green-600" />
            <p className="text-sm font-medium text-gray-700">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-700">FarmLease</h1>
          <p className="mt-2 text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-green-600 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
