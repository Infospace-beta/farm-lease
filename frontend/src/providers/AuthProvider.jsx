"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import authService from "../lib/services/authService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // DEVELOPMENT MODE: Set mock user to bypass authentication
  const DEVELOPMENT_MODE = false; // Set to false when backend is ready

  const mockUser = {
    id: 1,
    name: "David M.",
    email: "david@farmlease.com",
    role: "farmer",
    phone_number: "+254712345678",
  };

  const [user, setUser] = useState(DEVELOPMENT_MODE ? mockUser : null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if token is expired (with buffer time)
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      // Add 30 second buffer to prevent edge cases
      return Date.now() >= expiry - 30000;
    } catch (error) {
      return true;
    }
  };

  // Validate and restore user session (optimized)
  const validateSession = async () => {
    const currentUser = authService.getCurrentUser();
    const accessToken = localStorage.getItem("accessToken");

    if (!currentUser || !accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Quick check - if token is valid, set user immediately
    if (!isTokenExpired(accessToken)) {
      setUser(currentUser);
      setLoading(false);
      return;
    }

    // Token expired - try refresh in background
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken && !isTokenExpired(refreshToken)) {
      try {
        await authService.refreshToken();
        setUser(currentUser);
      } catch (error) {
        authService.clearSession();
        setUser(null);
      }
    } else {
      authService.clearSession();
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    validateSession();
  }, []);

  useEffect(() => {
    // Listen for storage changes (cross-tab logout)
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" && !e.newValue) {
        // Token was removed in another tab, logout here too
        setUser(null);
        router.push("/login");
      }
    };

    // Listen for custom logout event
    const handleLogoutEvent = () => {
      setUser(null);
      if (window.location.pathname !== "/login") {
        router.push("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-logout", handleLogoutEvent);
    };
  }, [router]);

  const login = useCallback(
    async (email, password, rememberMe = false) => {
      try {
        setLoading(true);
        const data = await authService.login(email, password, rememberMe);
        const currentUser = authService.getCurrentUser();

        // Set user immediately
        setUser(currentUser);

        // Determine redirect path
        let redirectPath = "/";
        if (currentUser?.is_staff) {
          redirectPath = "/admin/dashboard";
        } else {
          const role = currentUser?.role;
          const roleRoutes = {
            landowner: "/owner/dashboard",
            farmer: "/lessee/dashboard",
            dealer: "/dealer/dashboard",
          };
          redirectPath = roleRoutes[role] || "/";
        }

        // Show success toast and redirect immediately
        toast.success("Login successful!");
        router.push(redirectPath);

        return data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Login failed. Please check your credentials.";
        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        const data = await authService.register(userData);
        toast.success("Registration successful! Please login.");
        router.push("/login");
        return data;
      } catch (error) {
        console.error("Registration error details:", error.response?.data);
        // Handle validation errors from backend
        const errorData = error.response?.data;
        let message = "Registration failed";

        if (errorData) {
          if (typeof errorData === "string") {
            message = errorData;
          } else if (errorData.message) {
            message = errorData.message;
          } else {
            // Handle field-specific errors
            const errors = [];
            for (const [field, msgs] of Object.entries(errorData)) {
              if (Array.isArray(msgs)) {
                errors.push(`${field}: ${msgs.join(", ")}`);
              } else {
                errors.push(`${field}: ${msgs}`);
              }
            }
            message =
              errors.length > 0 ? errors.join("\n") : "Registration failed";
          }
        }

        toast.error(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      router.push("/login");
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      authService.clearSession();
      setUser(null);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      userRole: user?.role || null,
      isStaff: user?.is_staff || false,
    }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
