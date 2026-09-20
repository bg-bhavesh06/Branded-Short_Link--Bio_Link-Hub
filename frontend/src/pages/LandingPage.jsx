import React from "react";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { TrustedCreators } from "@/components/TrustedCreators";

export function LandingPage() {
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <TrustedCreators />
    </div>
  );
}
