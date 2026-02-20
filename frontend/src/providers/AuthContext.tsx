"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  clearTokens,
  dashboardPathFor,
  getAccessToken,
  getRefreshToken,
  isAuthenticated as checkAuth,
  setTokens,
} from "@/lib/auth";
import { accountsApi } from "@/lib/services/api";
import type { AuthState, LoginCredentials, RegisterData, User } from "@/types";

// ─── Context shape ─────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Fetch logged-in user from /auth/me/ on mount
  const refreshUser = useCallback(async () => {
    if (!checkAuth()) {
      setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const { data } = await accountsApi.me();
      setState({
        user: data as User,
        tokens: {
          access: getAccessToken()!,
          refresh: getRefreshToken()!,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      clearTokens();
      setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = useCallback(
    async ({ email, password }: LoginCredentials) => {
      const { data } = await accountsApi.login(email, password);
      setTokens({ access: data.access, refresh: data.refresh });

      const { data: user } = await accountsApi.me();
      const dashboardPath = dashboardPathFor(user.role);
      
      setState({
        user,
        tokens: { access: data.access, refresh: data.refresh },
        isAuthenticated: true,
        isLoading: false,
      });

      // Use replace for instant navigation without adding to history
      router.replace(dashboardPath);
      // Force immediate navigation
      window.location.href = dashboardPath;
    },
    [router]
  );

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(
    async (formData: RegisterData) => {
      await accountsApi.register(formData);
      // Auto-login after successful registration
      await login({ email: formData.email, password: formData.password });
    },
    [login]
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await accountsApi.logout(refresh);
      } catch {
        // Silently ignore logout errors
      }
    }
    clearTokens();
    setState({ user: null, tokens: null, isAuthenticated: false, isLoading: false });
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ ...state, login, register, logout, refreshUser }),
    [state, login, register, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
