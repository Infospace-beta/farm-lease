import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
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
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        const { data } = await axios.post(`${API_BASE}/auth/refresh/`, {
          refresh,
        });
        localStorage.setItem("access_token", data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch {
        // Refresh failed — redirect to login
        if (typeof window !== "undefined") window.location.href = "/login";
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
  createBasic: (data: object) => api.post("/lands/create-basic/", data),
  addSoil: (landId: number, data: object) =>
    api.post(`/lands/${landId}/add-soil/`, data),
  uploadPhotos: (landId: number, formData: FormData) =>
    api.post(`/lands/${landId}/upload-photos/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  ownerDashboard: () => api.get("/lands/ownerdashboard/"),
};
