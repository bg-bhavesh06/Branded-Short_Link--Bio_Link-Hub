import React from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function FeatureCard({ icon: Icon, iconBg, iconColor, title, description }) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5 hover:border-blue-200 group">
      <CardHeader className="p-0 space-y-4">
        <div
          className={`flex size-12 items-center justify-center rounded-xl ${iconBg} ${iconColor} transition-transform duration-200 group-hover:scale-105 shadow-xs`}
        >
          <Icon className="size-6" />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  );
}
