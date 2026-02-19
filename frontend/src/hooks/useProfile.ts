"use client";

import { useAuth } from "@/providers";

export interface OwnerProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  county: string;
  id_number: string;
  profile_picture: string | null;
  role: string;
  is_verified: boolean;
}

/**
 * Returns the currently-authenticated user profile from AuthContext.
 * No network call is made — data comes from the already-cached context,
 * which is populated once at login / app mount.
 */
export function useProfile() {
  const { user, isLoading } = useAuth();
  return {
    profile: user as OwnerProfile | null,
    loading: isLoading,
    error: null,
  };
}
