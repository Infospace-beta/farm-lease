import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
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
  const DEVELOPMENT_MODE = true; // Set to false when backend is ready
  
  const mockUser = {
    id: 1,
    name: 'David M.',
    email: 'david@farmlease.com',
    role: 'farmer',
    phone_number: '+254712345678',
  };

  const [user, setUser] = useState(DEVELOPMENT_MODE ? mockUser : null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      return true;
    }
  };

  // Validate and restore user session
  const validateSession = async () => {
    const currentUser = authService.getCurrentUser();
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!currentUser || !accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Check if access token is expired
    if (isTokenExpired(accessToken)) {
      // Try to refresh with refresh token
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          await authService.refreshToken();
          setUser(currentUser);
        } catch (error) {
          // Refresh failed, clear session
          authService.clearSession();
          setUser(null);
        }
      } else {
        // Both tokens expired, clear session
        authService.clearSession();
        setUser(null);
      }
    } else {
      setUser(currentUser);
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
        navigate("/login");
      }
    };

    // Listen for custom logout event
    const handleLogoutEvent = () => {
      setUser(null);
      if (window.location.pathname !== "/login") {
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-logout", handleLogoutEvent);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (email, password, rememberMe = false) => {
      try {
        setLoading(true);
        const data = await authService.login(email, password, rememberMe);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Redirect based on role and is_staff
        if (currentUser?.is_staff) {
          navigate("/admin/dashboard");
        } else {
          const role = currentUser?.role;
          switch (role) {
            case "landowner":
              navigate("/owner/dashboard");
              break;
            case "farmer":
              navigate("/lessee/dashboard");
              break;
            case "dealer":
              navigate("/dealer/dashboard");
              break;
            default:
              navigate("/");
          }
        }

        toast.success("Login successful!");
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
    [navigate],
  );

  const register = useCallback(
    async (userData) => {
      try {
        setLoading(true);
        const data = await authService.register(userData);
        toast.success("Registration successful! Please login.");
        navigate("/login");
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
    [navigate],
  );

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      navigate("/login");
      toast.info("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, clear local state
      authService.clearSession();
      setUser(null);
      navigate("/login");
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
