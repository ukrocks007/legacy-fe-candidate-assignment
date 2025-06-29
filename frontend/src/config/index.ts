// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/health',
  VERIFY_SIGNATURE: '/verify-signature',
  AUTH_NONCE: '/auth/nonce',
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',
} as const;

// API Settings
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  HEALTH_CHECK_CACHE_DURATION: 30000, // 30 seconds
} as const;

// Dynamic.xyz Configuration
export const DYNAMIC_ENVIRONMENT_ID =
  import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID ||
  '38ddc9ea-c5bb-42ed-a258-0672bf48b54b';

// Helper function to check if URL is Render.com
export const isRenderUrl = (url: string = API_BASE_URL): boolean => {
  return url.includes('render.com') || url.includes('onrender.com');
};
