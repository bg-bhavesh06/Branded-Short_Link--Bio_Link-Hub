import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Compass, Globe } from "lucide-react";

export function TopReferrersCard({ loading = false }) {
  const referrers = [
    { name: "Direct", clicks: 3372, percentage: 28, color: "bg-blue-600" },
    { name: "Google", clicks: 3240, percentage: 26, color: "bg-emerald-500" },
    { name: "Instagram", clicks: 2810, percentage: 22, color: "bg-pink-500" },
    { name: "YouTube", clicks: 1920, percentage: 15, color: "bg-rose-500" },
    { name: "Facebook", clicks: 1140, percentage: 9, color: "bg-sky-600" },
  ];

  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-5 w-36 bg-slate-200 rounded-md mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
            Top Referrers
          </CardTitle>
          <span className="text-xs font-semibold text-slate-500">
            By Traffic Source
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {referrers.map((ref) => (
          <div key={ref.name} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className="size-2 rounded-full bg-blue-600" />
                <span>{ref.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-500">
                  {ref.clicks.toLocaleString()} clicks
                </span>
                <span className="font-bold text-slate-900 min-w-[32px] text-right">
                  {ref.percentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${ref.percentage * 3.5}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
