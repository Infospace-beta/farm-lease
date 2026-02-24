import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 s — reduced for snappier feel
});

/* ── Attach JWT access token from localStorage on every request ── */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Auto-refresh on 401 ── */
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");
        
        const { data } = await axios.post(`${API_BASE}/auth/refresh/`, {
          refresh,
        });
        localStorage.setItem("access_token", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        isRefreshing = false;
        onRefreshed(data.access);
        return api(original);
      } catch {
        isRefreshing = false;
        // Refresh failed — redirect to login
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

/* ─── Typed API helpers ──────────────────────────────────── */
export const accountsApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }),
  signup: (data: object) => api.post("/auth/signup/", data),
  logout: (refresh: string) => api.post("/auth/logout/", { refresh }),
  refreshToken: (refresh: string) =>
    api.post("/auth/refresh/", { refresh }),
  // Profile
  me: () => api.get("/auth/me/"),
  profile: () => api.get("/auth/profile/"),
  updateProfile: (data: FormData) =>
    api.patch("/auth/profile/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post("/auth/change-password/", data),
};

export const landsApi = {
  // Owner — multi-step upload
  createBasic: (data: object) => api.post("/lands/create-basic/", data),
  addSoil: (landId: number, data: object) =>
    api.post(`/lands/${landId}/add-soil/`, data),
  uploadPhotos: (landId: number, formData: FormData) =>
    api.post(`/lands/${landId}/upload-photos/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Owner — lists & dashboard
  myLands: () => api.get("/lands/my-lands/"),
  ownerDashboard: () => api.get("/lands/ownerdashboard/"),

  // Public — verified listings for lessees
  publicListings: () => api.get("/lands/listings/"),

  // Admin — land management
  adminAllLands: () => api.get("/lands/admin/all/"),
  adminStats: () => api.get("/lands/admin/stats/"),
  verifyLand: (landId: number) =>
    api.post(`/lands/admin/${landId}/verify/`),
  flagLand: (landId: number, reason: string) =>
    api.post(`/lands/admin/${landId}/flag/`, { reason }),
};

export const adminApi = {
  // Placeholder — extend when notification endpoints are added to the backend
  unreadCount: () =>
    Promise.resolve({ data: { unread_count: 0 } }),
};
