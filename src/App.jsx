import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LinksPage } from "@/pages/LinksPage";
import { BioBuilderPage } from "@/pages/BioBuilderPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { PricingPage } from "@/pages/PricingPage";
import { BlogPage } from "@/pages/BlogPage";
import { AboutPage } from "@/pages/AboutPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/links" element={<LinksPage />} />
          <Route path="/bio-builder" element={<BioBuilderPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Catch-all redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
