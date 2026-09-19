import React from "react";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DeviceDistribution({ loading = false, data = [] }) {
  const deviceConfigs = {
    Mobile: {
      name: "Mobile",
      icon: Smartphone,
      color: "#2563eb",
      tailwindColor: "bg-blue-600",
    },
    Desktop: {
      name: "Desktop",
      icon: Monitor,
      color: "#0f172a",
      tailwindColor: "bg-slate-900",
    },
    Tablet: {
      name: "Tablet",
      icon: Tablet,
      color: "#94a3b8",
      tailwindColor: "bg-slate-400",
    },
  };

  const devices = ["Mobile", "Desktop", "Tablet"].map((type) => {
    const item = data.find((d) => d.deviceType === type) || { clicks: 0, percentage: 0 };
    return {
      ...deviceConfigs[type],
      clicks: item.clicks || 0,
      percentage: item.percentage || 0,
    };
  });

  const dominant = [...devices].sort((a, b) => b.clicks - a.clicks)[0];

  // SVG Donut Calculations
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const slices = devices.map((d) => {
    const strokeDasharray = `${(d.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += d.percentage;
    return { ...d, strokeDasharray, strokeDashoffset };
  });

  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-5 w-44 bg-slate-200 rounded-md mb-6" />
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="size-36 rounded-full bg-slate-100" />
          <div className="space-y-3 flex-1 w-full">
            <div className="h-8 bg-slate-50 rounded-lg" />
            <div className="h-8 bg-slate-50 rounded-lg" />
            <div className="h-8 bg-slate-50 rounded-lg" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
            Device Distribution
          </CardTitle>
          <span className="text-xs font-semibold text-slate-500">
            Across All Clicks
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 justify-around">
          {/* SVG Donut Chart */}
          <div className="relative size-38 sm:size-42 shrink-0 flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="rotate-[-90deg]"
            >
              {slices.map((slice) => (
                <circle
                  key={slice.name}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 hover:opacity-90"
                />
              ))}
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
              <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                {dominant?.percentage || 0}%
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {dominant?.clicks > 0 ? `${dominant.name} Top` : "No Clicks"}
              </span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="w-full space-y-3">
            {devices.map((dev) => {
              const Icon = dev.icon;
              return (
                <div
                  key={dev.name}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`size-3 rounded-full ${dev.tailwindColor}`} />
                    <Icon className="size-4 text-slate-600" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">
                      {dev.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {dev.clicks.toLocaleString()}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 min-w-[36px] text-right">
                      {dev.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
