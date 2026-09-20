import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AnalyticsStatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
  loading = false,
}) {
  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between animate-pulse">
          <div className="space-y-2.5">
            <div className="h-7 w-24 bg-slate-200 rounded-lg" />
            <div className="h-4 w-16 bg-slate-100 rounded-md" />
            <div className="h-3 w-28 bg-slate-100 rounded-md" />
          </div>
          <div className="size-11 rounded-xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </div>
          <div className="text-xs sm:text-sm font-medium text-slate-500">
            {title}
          </div>
          <div className="flex items-center gap-1 pt-1 text-xs font-semibold text-emerald-600">
            {isPositive ? (
              <ArrowUpRight className="size-3.5 shrink-0" />
            ) : (
              <ArrowDownRight className="size-3.5 shrink-0" />
            )}
            <span>{change}</span>
          </div>
        </div>
        <div
          className={`flex size-11 items-center justify-center rounded-xl ${iconBg} ${iconColor} shrink-0 shadow-2xs`}
        >
          <Icon className="size-5.5" />
        </div>
      </div>
    </Card>
  );
}
