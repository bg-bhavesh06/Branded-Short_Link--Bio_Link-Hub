import React from "react";
import { Smartphone, Monitor, Tablet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const getDeviceIcon = (deviceType) => {
  if (deviceType === "Mobile") return Smartphone;
  if (deviceType === "Tablet") return Tablet;
  return Monitor;
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Recently";
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function RecentActivity({ loading = false, data = [] }) {
  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded-md mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-50 rounded-xl" />
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
            Recent Activity
          </CardTitle>
          <span className="text-xs font-semibold text-slate-500">
            Live Stream
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No recent click activity recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-3">Time</th>
                  <th className="px-4 sm:px-6 py-3">Link</th>
                  <th className="px-4 sm:px-6 py-3">Referrer</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((item) => {
                  const DeviceIcon = getDeviceIcon(item.deviceType);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Time */}
                      <td className="px-4 sm:px-6 py-3 text-slate-500 text-xs font-medium whitespace-nowrap">
                        {formatTimeAgo(item.timestamp)}
                      </td>

                      {/* Link */}
                      <td className="px-4 sm:px-6 py-3">
                        <div className="font-semibold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                          {item.originalUrl || item.shortCode}
                        </div>
                        <div className="text-[11px] text-blue-600 font-mono">
                          /r/{item.shortCode}
                        </div>
                      </td>

                      {/* Referrer */}
                      <td className="px-4 sm:px-6 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 max-w-[140px] truncate">
                          {item.referrer || "Direct"}
                        </span>
                      </td>

                      {/* Device */}
                      <td className="px-4 sm:px-6 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium justify-end">
                          <DeviceIcon className="size-3.5 text-slate-500" />
                          <span>{item.deviceType}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
