import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeaturesSection } from "@/components/FeaturesSection";

export function FeaturesPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
      </div>
      <FeaturesSection />
    </div>
  );
}
