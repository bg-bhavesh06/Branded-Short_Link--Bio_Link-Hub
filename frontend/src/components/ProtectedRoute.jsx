import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Link2 } from "lucide-react";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 animate-pulse">
            <Link2 className="size-6 rotate-45" />
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-600 animate-ping" />
            <span className="text-xs font-semibold text-slate-500">Checking session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Prevent open redirect attacks by encoding the local path
    const redirectParam = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectParam}`} replace />;
  }

  return <Outlet />;
}
