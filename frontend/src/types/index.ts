// ─── User & Auth Types ──────────────────────────────────

export type UserRole = "farmer" | "landowner" | "dealer" | "admin";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string | null;
  name: string;
  role: UserRole;
  phone_number: string;
  address: string | null;
  county: string | null;
  id_number: string | null;
  is_verified: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface JwtPayload {
  user_id: number;
  role: UserRole;
  username: string;
  email: string;
  is_staff: boolean;
  exp: number;
  iat: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  password2?: string;
  phone_number: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  address?: string;
  county?: string;
  id_number?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}