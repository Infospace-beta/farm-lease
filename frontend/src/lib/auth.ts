import { jwtDecode } from "jwt-decode";
import type { AuthTokens, JwtPayload, UserRole } from "@/types";

// ─── Storage Keys ──────────────────────────────────────────────────────────────
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

// ─── Token Storage ─────────────────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Token Decoding ────────────────────────────────────────────────────────────
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  // exp is in seconds; Date.now() is in ms
  return payload.exp * 1000 < Date.now();
}

// ─── Convenience Helpers ───────────────────────────────────────────────────────
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

export function getTokenRole(): UserRole | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeToken(token);
  return payload?.role ?? null;
}

// ─── Role-based redirect helper ────────────────────────────────────────────────
export function dashboardPathFor(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "landowner":
      return "/owner";
    case "dealer":
      return "/dealer";
    case "farmer":
    default:
      return "/lessee";
  }
}
