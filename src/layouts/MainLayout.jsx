import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfe] text-slate-900 selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
