/**
 * Global API and Application URL configuration for LinkHub frontend
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const PUBLIC_APP_URL =
  import.meta.env.VITE_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

export const API_ENDPOINTS = {
  auth: `${API_BASE_URL}/auth`,
  links: `${API_BASE_URL}/links`,
  analytics: `${API_BASE_URL}/analytics`,
  bio: `${API_BASE_URL}/bio`,
  health: `${API_BASE_URL}/health`,
};
