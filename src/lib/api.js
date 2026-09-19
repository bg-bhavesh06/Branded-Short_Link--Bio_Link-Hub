/**
 * Global API and Application URL configuration for LinkHub frontend
 */
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined") {
    // If running in local Vite dev server on port 5173, point to local Express backend port 5000
    if (window.location.port === "5173") {
      return "http://localhost:5000/api/v1";
    }
    // When deployed on Vercel or same-origin domain, use same origin /api/v1
    return `${window.location.origin}/api/v1`;
  }
  return "http://localhost:5000/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

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
