import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ──────────────────────────────────────
// Attaches the access token once auth (Phase 3-4) exists.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bmw_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ─────────────────────────────────────
// Centralized error normalization + placeholder for refresh-token
// retry logic, implemented fully in Phase 3-4.
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshing) {
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // TODO(Phase 3-4): call POST /api/auth/refresh, retry originalRequest.
        isRefreshing = false;
      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('bmw_access_token');
        return Promise.reject(refreshError);
      }
    }

    const normalized = {
      message:
        error.response?.data?.message ||
        (error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : !error.response
          ? 'Network error. Please check your connection.'
          : 'Something went wrong. Please try again.'),
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(normalized);
  }
);

export default api;
