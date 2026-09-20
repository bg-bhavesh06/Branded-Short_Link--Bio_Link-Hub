import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "@/lib/api";

const AuthContext = createContext(null);

const API_BASE_URL = API_ENDPOINTS.auth;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Session verification & silent refresh on startup
  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      // First attempt: fetch currently authenticated user via access token cookie
      const meRes = await fetch(`${API_BASE_URL}/me`, {
        method: "GET",
        credentials: "include",
      });

      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data.user);
        return;
      }

      // If access token is expired (401), attempt silent refresh using refresh token cookie
      if (meRes.status === 401) {
        const refreshRes = await fetch(`${API_BASE_URL}/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setUser(refreshData.user);
          return;
        }
      }

      // If both fail, user is unauthenticated
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // 2. Login
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Invalid credentials. Please try again.",
        };
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      return {
        success: false,
        message: "Unable to connect to LinkHub server. Please try again.",
      };
    }
  };

  // 3. Signup
  const signup = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Failed to create account.",
        };
      }

      return {
        success: true,
        user: data.user,
        simulatedVerificationToken: data.simulatedVerificationToken,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Unable to connect to server. Please try again.",
      };
    }
  };

  // 4. Email Verification (Simulated Flow)
  const verifyEmail = async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Verification failed.",
        };
      }

      // If current user is loaded, update local state
      setUser((prev) => (prev ? { ...prev, isEmailVerified: true } : null));

      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: "Network error during email verification.",
      };
    }
  };

  // 5. Forgot Password
  const forgotPassword = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      return {
        success: true,
        message: data.message,
        simulatedResetToken: data.simulatedResetToken,
      };
    } catch (error) {
      return {
        success: false,
        message: "Unable to process password reset request.",
      };
    }
  };

  // 6. Reset Password
  const resetPassword = async (token, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Password reset failed.",
        };
      }

      // Resetting password invalidates all sessions
      setUser(null);

      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        message: "Network error during password reset.",
      };
    }
  };

  // 7. Logout
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network failure on logout
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
