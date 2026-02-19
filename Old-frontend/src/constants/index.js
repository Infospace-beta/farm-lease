// User Roles (matching backend values)
export const USER_ROLES = {
  OWNER: 'landowner',
  LESSEE: 'farmer',
  DEALER: 'dealer',
  ADMIN: 'admin',
};

// User Role Display Names
export const USER_ROLE_LABELS = {
  landowner: 'Farm Owner',
  farmer: 'Farmer/Lessee',
  dealer: 'Agro-Dealer',
  admin: 'Administrator',
};

// Land Status
export const LAND_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  LEASED: 'LEASED',
  AVAILABLE: 'AVAILABLE',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

// Escrow Status
export const ESCROW_STATUS = {
  HELD: 'HELD',
  RELEASED: 'RELEASED',
  DISPUTED: 'DISPUTED',
};

// Soil Types
export const SOIL_TYPES = [
  { value: 'CLAY', label: 'Clay' },
  { value: 'LOAM', label: 'Loam' },
  { value: 'SANDY', label: 'Sandy' },
  { value: 'SILT', label: 'Silt' },
  { value: 'PEAT', label: 'Peat' },
  { value: 'CHALK', label: 'Chalk' },
];

// Product Categories
export const PRODUCT_CATEGORIES = [
  { value: 'SEEDS', label: 'Seeds' },
  { value: 'FERTILIZERS', label: 'Fertilizers' },
  { value: 'PESTICIDES', label: 'Pesticides' },
  { value: 'TOOLS', label: 'Tools & Equipment' },
  { value: 'MACHINERY', label: 'Machinery' },
  { value: 'IRRIGATION', label: 'Irrigation Systems' },
  { value: 'OTHER', label: 'Other' },
];

// Kenya Counties
export const COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet',
  'Embu', 'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado',
  'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga',
  'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia',
  'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit',
  'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
  'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu',
  'Vihiga', 'Wajir', 'West Pokot',
];

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  REGISTER: '/auth/register/',
  LOGOUT: '/auth/logout/',
  REFRESH_TOKEN: '/auth/refresh/',
  
  // Lands
  LANDS: '/lands/',
  LAND_DETAIL: (id) => `/lands/${id}/`,
  MY_LANDS: '/lands/my-lands/',
  PENDING_LANDS: '/lands/pending/',
  VERIFY_LAND: (id) => `/lands/${id}/verify/`,
  
  // Leases
  LEASES: '/leases/',
  MY_LEASES: '/leases/my-leases/',
  CREATE_LEASE: '/leases/create/',
  
  // Products
  PRODUCTS: '/products/',
  MY_PRODUCTS: '/products/my-products/',
  PRODUCT_DETAIL: (id) => `/products/${id}/`,
  
  // Payments
  INITIATE_PAYMENT: '/payments/initiate/',
  PAYMENT_STATUS: (id) => `/payments/${id}/status/`,
  
  // Recommendations
  CROP_RECOMMENDATIONS: '/recommendations/crops/',
  
  // Users
  USERS: '/users/',
  USER_PROFILE: '/users/profile/',
  
  // Reviews
  REVIEWS: '/reviews/',
  LAND_REVIEWS: (landId) => `/reviews/land/${landId}/`,
  
  // Reports
  REPORTS: '/reports/',
  REPORT_DETAIL: (id) => `/reports/${id}/`,
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN: 'Password must be at least 8 characters',
  PASSWORD_MATCH: 'Passwords must match',
  PHONE_INVALID: 'Please enter a valid phone number',
  NUMBER_POSITIVE: 'Value must be a positive number',
  FILE_SIZE: 'File size must be less than 5MB',
  FILE_TYPE: 'Invalid file type',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'MMM DD, YYYY HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Status Colors
export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  LEASED: 'bg-blue-100 text-blue-800',
  AVAILABLE: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default {
  USER_ROLES,
  LAND_STATUS,
  PAYMENT_STATUS,
  ESCROW_STATUS,
  SOIL_TYPES,
  PRODUCT_CATEGORIES,
  COUNTIES,
  API_ENDPOINTS,
  VALIDATION_MESSAGES,
  DATE_FORMATS,
  PAGINATION,
  STATUS_COLORS,
};
