export const APP_NAME = 'Digital Heroes PrintForge';

export const APP_DESCRIPTION =
  'Custom print, personalised products and precision production in one place.';

export const APP_CURRENCY = 'INR';
export const APP_LOCALE = 'en-IN';
export const APP_TIMEZONE = 'Asia/Kolkata';

export const USER_ROLES = {
  VISITOR: 'visitor',
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const ORDER_STATUS = {
  QUOTE: 'quote',
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ARTWORK: 'artwork',
  PROOF_PENDING: 'proof_pending',
  PROOF_APPROVED: 'proof_approved',
  PRODUCTION: 'production',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PROOF_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  CHANGES_REQUESTED: 'changes_requested',
  REJECTED: 'rejected',
  SUPERSEDED: 'superseded',
};

export const PRODUCTION_STAGES = [
  'quote',
  'order',
  'artwork',
  'proof',
  'production',
  'completed',
];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
};

export const SUPPORTED_ARTWORK_FORMATS = [
  'pdf',
  'svg',
  'ai',
  'png',
  'jpg',
  'jpeg',
  'webp',
];

export const SUPPORTED_IMAGE_FORMATS = [
  'png',
  'jpg',
  'jpeg',
  'webp',
];

export const MAX_ARTWORK_FILE_SIZE = 25 * 1024 * 1024;
export const MAX_REFERENCE_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_VARIABLE_DATA_FILE_SIZE = 25 * 1024 * 1024;

export const PRINT_DEFAULTS = {
  DPI: 300,
  BLEED_MM: 3,
  SAFE_MARGIN_MM: 5,
  MIN_QUANTITY: 1,
  DEFAULT_QUANTITY: 1,
};

export const DESIGNER_DEFAULTS = {
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  MIN_ZOOM: 0.25,
  MAX_ZOOM: 3,
  DEFAULT_ZOOM: 1,
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 8,
  MESSAGE_MAX_LENGTH: 2000,
};

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  GALLERY: '/gallery',
  ABOUT: '/about',
  CONTACT: '/contact',

  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  CUSTOMER_DASHBOARD: '/account/dashboard',
  CUSTOMER_ORDERS: '/account/orders',
  CUSTOMER_DESIGNS: '/account/designs',
  CUSTOMER_PROOFS: '/account/proofs',
  CUSTOMER_PROFILE: '/account/profile',

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_PROOFS: '/admin/proofs',
  ADMIN_PRODUCTION: '/admin/production',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_SETTINGS: '/admin/settings',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

export const formatCurrency = (amount, currency = APP_CURRENCY) => {
  const value = Number(amount);

  if (!Number.isFinite(value)) return '—';

  return new Intl.NumberFormat(APP_LOCALE, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (date, options = {}) => {
  if (!date) return '—';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '—';

  return new Intl.DateTimeFormat(APP_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(parsedDate);
};