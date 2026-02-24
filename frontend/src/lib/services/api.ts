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
  },
);

export default api;

/* ─── Typed API helpers ──────────────────────────────────── */
export const accountsApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post("/auth/login/", { email, password }),
  signup: (data: object) => api.post("/auth/signup/", data),
  logout: (refresh: string) => api.post("/auth/logout/", { refresh }),
  refreshToken: (refresh: string) => api.post("/auth/refresh/", { refresh }),
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
  verifyLand: (landId: number) => api.post(`/lands/admin/${landId}/verify/`),
  flagLand: (landId: number, reason: string) =>
    api.post(`/lands/admin/${landId}/flag/`, { reason }),
};

export const adminApi = {
  // Placeholder — extend when notification endpoints are added to the backend
  unreadCount: () => Promise.resolve({ data: { unread_count: 0 } }),
};

// ─── Lessee API ───────────────────────────────────────────────────────────────
export const lesseeApi = {
  // Dashboard
  dashboard: () => api.get("/lessee/dashboard/"),

  // Land Browse
  listings: (params?: {
    region?: string;
    soil?: string;
    water?: string;
    min_acres?: number;
    max_acres?: number;
    max_price?: number;
    search?: string;
    page?: number;
  }) => api.get("/lands/listings/", { params }),

  landDetail: (landId: number) => api.get(`/lands/${landId}/`),

  // Lease Requests
  createLeaseRequest: (data: {
    land: number;
    proposed_start_date: string;
    proposed_end_date: string;
    message?: string;
  }) => api.post("/contracts/lease-requests/", data),

  myLeaseRequests: () => api.get("/contracts/lease-requests/"),
  leaseRequestDetail: (id: number) =>
    api.get(`/contracts/lease-requests/${id}/`),
  cancelLeaseRequest: (id: number) =>
    api.post(`/contracts/lease-requests/${id}/cancel/`),

  // Active Leases / Agreements
  myLeases: () => api.get("/contracts/leases/"),
  leaseDetail: (id: number) => api.get(`/contracts/leases/${id}/`),
  signLease: (id: number) => api.post(`/contracts/leases/${id}/sign/`),
  terminateLease: (id: number, reason: string) =>
    api.post(`/contracts/leases/${id}/terminate/`, { reason }),

  // Financials / Payments
  myPayments: (params?: { page?: number; status?: string }) =>
    api.get("/payments/my-payments/", { params }),
  initiatePayment: (data: {
    lease: number;
    amount: number;
    method: "mpesa" | "escrow";
    phone_number?: string;
  }) => api.post("/payments/initiate/", data),
  escrowBalance: () => api.get("/payments/escrow/balance/"),
  releaseEscrow: (paymentId: number) =>
    api.post(`/payments/escrow/${paymentId}/release/`),

  // AI Crop Predictor
  predictCrop: (data: {
    mode: "regional" | "manual";
    region?: string;
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    rainfall?: number;
    temperature?: number;
  }) => api.post("/lessee/ai-predict/", data),
  predictionHistory: (params?: { page?: number }) =>
    api.get("/lessee/ai-predict/history/", { params }),

  // Shop / Agro-Dealer Marketplace
  shopProducts: (params?: {
    category?: string;
    search?: string;
    dealer?: number;
    page?: number;
  }) => api.get("/productplace/products/", { params }),
  shopProductDetail: (productId: number) =>
    api.get(`/productplace/products/${productId}/`),
  addToCart: (productId: number, quantity: number) =>
    api.post("/productplace/cart/", { product: productId, quantity }),
  myCart: () => api.get("/productplace/cart/"),
  placeOrder: (data: {
    delivery_type: "delivery" | "pickup";
    address?: string;
    payment_method: "mpesa" | "cash";
    phone_number?: string;
  }) => api.post("/productplace/orders/", data),
  myOrders: () => api.get("/productplace/orders/my/"),

  // Notifications
  notifications: (params?: { page?: number }) =>
    api.get("/lessee/notifications/", { params }),
  markNotificationRead: (id: number) =>
    api.patch(`/lessee/notifications/${id}/`, { read: true }),
  markAllNotificationsRead: () =>
    api.post("/lessee/notifications/mark-all-read/"),
};

// ─── Agro-Dealer API ──────────────────────────────────────────────────────────
export const dealerApi = {
  // Dashboard
  dashboard: () => api.get("/dealer/dashboard/"),

  // Inventory / Products
  myProducts: (params?: {
    category?: string;
    search?: string;
    status?: string;
    page?: number;
  }) => api.get("/productplace/dealer/products/", { params }),
  productDetail: (id: number) =>
    api.get(`/productplace/dealer/products/${id}/`),
  createProduct: (data: FormData) =>
    api.post("/productplace/dealer/products/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProduct: (id: number, data: FormData) =>
    api.patch(`/productplace/dealer/products/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteProduct: (id: number) =>
    api.delete(`/productplace/dealer/products/${id}/`),
  toggleProductVisibility: (id: number) =>
    api.post(`/productplace/dealer/products/${id}/toggle-visibility/`),

  // Inventory Management
  inventory: (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
  }) => api.get("/productplace/dealer/inventory/", { params }),
  updateStock: (productId: number, quantity: number) =>
    api.post(`/productplace/dealer/inventory/${productId}/add-stock/`, {
      quantity,
    }),
  inventoryAlerts: () => api.get("/productplace/dealer/inventory/alerts/"),

  // Orders
  orders: (params?: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
  }) => api.get("/productplace/dealer/orders/", { params }),
  orderDetail: (id: string) => api.get(`/productplace/dealer/orders/${id}/`),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/productplace/dealer/orders/${id}/`, { status }),
  addOrderNote: (id: string, note: string) =>
    api.post(`/productplace/dealer/orders/${id}/notes/`, { note }),

  // Customer Queries
  queries: (params?: { status?: string; search?: string; page?: number }) =>
    api.get("/productplace/dealer/queries/", { params }),
  queryDetail: (id: number) => api.get(`/productplace/dealer/queries/${id}/`),
  replyToQuery: (id: number, message: string) =>
    api.post(`/productplace/dealer/queries/${id}/reply/`, { message }),
  updateQueryStatus: (id: number, status: string) =>
    api.patch(`/productplace/dealer/queries/${id}/`, { status }),

  // Transactions / Financials
  transactions: (params?: { period?: string; type?: string; page?: number }) =>
    api.get("/payments/dealer/transactions/", { params }),
  transactionDetail: (id: string) =>
    api.get(`/payments/dealer/transactions/${id}/`),
  earningsSummary: () => api.get("/payments/dealer/earnings/"),
  withdrawEarnings: (amount: number, phone: string) =>
    api.post("/payments/dealer/withdraw/", { amount, phone }),

  // Analytics
  salesAnalytics: (period?: string) =>
    api.get("/productplace/dealer/analytics/", { params: { period } }),
  topProducts: (limit?: number) =>
    api.get("/productplace/dealer/analytics/top-products/", {
      params: { limit },
    }),
  customerStats: () => api.get("/productplace/dealer/analytics/customers/"),

  // Market Trends
  marketTrends: (region?: string) =>
    api.get("/productplace/dealer/trends/", { params: { region } }),
  regionalDemand: (region: string) =>
    api.get("/productplace/dealer/trends/demand/", { params: { region } }),

  // Notifications
  notifications: (params?: { page?: number }) =>
    api.get("/dealer/notifications/", { params }),
  markNotificationRead: (id: number) =>
    api.patch(`/dealer/notifications/${id}/`, { read: true }),
  markAllNotificationsRead: () =>
    api.post("/dealer/notifications/mark-all-read/"),

  // Store Profile
  storeProfile: () => api.get("/dealer/profile/"),
  updateStoreProfile: (data: FormData) =>
    api.patch("/dealer/profile/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
