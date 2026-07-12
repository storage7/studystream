// API base URL - points to your Cloudflare Worker
// Change this to your actual Cloudflare Worker URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://studystream-api.storage2-7777.workers.dev';

export const API = {
  BASE: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  VERIFY: `${API_BASE_URL}/api/auth/verify`,
  BATCHES: `${API_BASE_URL}/api/batches`,
  LECTURES: `${API_BASE_URL}/api/lectures`,
  LECTURE: (id: string) => `${API_BASE_URL}/api/lectures/${id}`,
} as const;

export default API;
