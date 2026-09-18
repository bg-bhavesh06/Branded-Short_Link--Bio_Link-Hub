import React from "react";
import { Link2, BarChart2, QrCode, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FeatureCard } from "@/components/FeatureCard";

export function FeaturesSection() {
  const features = [
    {
      icon: Link2,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      title: "URL Shortener",
      description: "Create short, branded links with custom slugs.",
    },
    {
      icon: BarChart2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      title: "Click Analytics",
      description: "Track clicks, referrers, devices and more.",
    },
    {
      icon: QrCode,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      title: "QR Code Generation",
      description: "Generate QR codes for your links instantly.",
    },
    {
      icon: User,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      title: "Link-in-Bio Pages",
      description: "Build a customizable bio page with multiple links and themes.",
    },
  ];

  return (
    <section className="relative py-16 md:py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Pill Badge */}
        <Badge
          variant="default"
          className="mb-4 bg-indigo-50 text-indigo-700 border-indigo-200/60 px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-full"
        >
          WHAT YOU CAN DO
        </Badge>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need as a Creator
        </h2>

        {/* Section Description */}
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Powerful tools to help you grow, share, and track — all in one place.
        </p>

        {/* 4 Feature Cards Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {features.map((feat) => (
            <FeatureCard
              key={feat.title}
              icon={feat.icon}
              iconBg={feat.iconBg}
              iconColor={feat.iconColor}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
