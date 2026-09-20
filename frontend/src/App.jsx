import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LinksPage } from "@/pages/LinksPage";
import { BioBuilderPage } from "@/pages/BioBuilderPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { PricingPage } from "@/pages/PricingPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { AboutPage } from "@/pages/AboutPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { PublicBioPage } from "@/pages/PublicBioPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Protected Authenticated Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/links" element={<LinksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/bio-builder" element={<BioBuilderPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/overview" element={<Navigate to="/links" replace />} />
              <Route path="/dashboard" element={<Navigate to="/links" replace />} />
            </Route>
          </Route>

          {/* Standalone Public Bio Route (No Navbar, No Sidebar, Mobile-First) */}
          <Route path="/bio/:username" element={<PublicBioPage />} />

          {/* Public & Marketing Routes (MainLayout with Navbar & Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* Catch-all redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
