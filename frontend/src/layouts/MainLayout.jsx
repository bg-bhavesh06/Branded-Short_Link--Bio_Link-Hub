import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function MainLayout() {
  const location = useLocation();
  const hideFooterPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  );
}
