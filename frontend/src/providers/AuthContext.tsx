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
import type { AuthState, LoginCredentials, SignupData, User } from "@/types";

// ─── Context shape ─────────────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
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

      // Instant redirect without loading screen
      window.location.href = dashboardPath;
    },
    [router]
  );

  // ── Signup ──────────────────────────────────────────────────────────────────
  const signup = useCallback(
    async (formData: SignupData) => {
      await accountsApi.signup(formData);
      // Auto-login after successful signup
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
    () => ({ ...state, login, signup, logout, refreshUser }),
    [state, login, signup, logout, refreshUser]
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
