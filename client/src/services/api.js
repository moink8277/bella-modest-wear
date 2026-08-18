import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bmw_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor ─────────────────────────────────────
// Centralized error normalization + silent access-token refresh.
//
// When any request fails with 401 (expired ~15-min access token), this
// transparently calls POST /auth/refresh (which reads the httpOnly
// bmw_refresh_token cookie), stores the new access token, and retries
// the original request once. If a refresh is already in flight when a
// second request 401s, that second request queues and waits for the
// same refresh to finish instead of firing a duplicate refresh call.
let isRefreshing = false;
let refreshQueue = [];

function resolveQueue(error, token) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  refreshQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshCall = originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshCall) {
      if (isRefreshing) {
        // A refresh is already in flight — wait for it instead of
        // triggering a second, redundant refresh call.
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Deliberately plain axios (not the `api` instance) so this call
        // does NOT pass back through this same response interceptor.
        // withCredentials sends the httpOnly refresh-token cookie.
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = data?.data?.accessToken;
        if (!newAccessToken) {
          throw new Error('Refresh response did not include an access token');
        }

        localStorage.setItem('bmw_access_token', newAccessToken);
        isRefreshing = false;
        resolveQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        resolveQueue(refreshError, null);
        // Refresh token itself is invalid/expired/missing — nothing left
        // to try. Clear the stale access token; AuthContext's own
        // getCurrentUser()/me() failure path handles logging the user out
        // and redirecting, so this interceptor doesn't own navigation.
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