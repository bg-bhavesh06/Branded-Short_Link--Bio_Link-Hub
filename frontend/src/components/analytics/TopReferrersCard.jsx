import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TopReferrersCard({ loading = false, data = [] }) {
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
        {data.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            No referrer data collected yet.
          </div>
        ) : (
          data.map((ref) => (
            <div key={ref.referrer} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-semibold text-slate-800 truncate max-w-[180px]">
                  <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <span className="truncate">{ref.referrer}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-slate-500 text-xs">
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
                  style={{ width: `${Math.min(ref.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
