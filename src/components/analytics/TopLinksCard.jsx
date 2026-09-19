import React from "react";
import { Youtube, Github, Globe, FileText, Instagram, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function TopLinksCard({ loading = false, onCopyLink, copiedLink }) {
  const topLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      shortUrl: "linkhub.dev/r/youtube",
      destination: "https://youtube.com/@bhavesh",
      clicks: 2341,
      percentage: 28,
    },
    {
      name: "GitHub",
      icon: Github,
      iconColor: "text-slate-900",
      iconBg: "bg-slate-100",
      shortUrl: "linkhub.dev/r/github",
      destination: "https://github.com/bg-bhavesh",
      clicks: 1892,
      percentage: 22,
    },
    {
      name: "Resume",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      shortUrl: "linkhub.dev/r/resume",
      destination: "https://drive.google.com/resume",
      clicks: 1120,
      percentage: 14,
    },
    {
      name: "Portfolio",
      icon: Globe,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
      shortUrl: "linkhub.dev/r/portfolio",
      destination: "https://bhavesh.dev",
      clicks: 954,
      percentage: 12,
    },
    {
      name: "Instagram",
      icon: Instagram,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
      shortUrl: "linkhub.dev/r/instagram",
      destination: "https://instagram.com/bg.bhavesh",
      clicks: 876,
      percentage: 10,
    },
  ];

  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-5 w-48 bg-slate-200 rounded-md mb-6" />
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
            Top Performing Links
          </CardTitle>
          <span className="text-xs font-semibold text-slate-500">
            5 Active Links
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 sm:px-6 py-3">Link</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Destination</th>
                <th className="px-4 sm:px-6 py-3 text-right">Clicks</th>
                <th className="px-4 sm:px-6 py-3 text-right">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topLinks.map((item) => {
                const Icon = item.icon;
                const isCopied = copiedLink === item.shortUrl;

                return (
                  <tr
                    key={item.name}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Link Name & Short URL */}
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor} shrink-0`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium font-mono">
                            <span>{item.shortUrl}</span>
                            <button
                              type="button"
                              onClick={() => onCopyLink?.(item.shortUrl)}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="Copy link"
                            >
                              {isCopied ? (
                                <Check className="size-3 text-emerald-600" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Destination URL */}
                    <td className="px-4 sm:px-6 py-3.5 text-xs text-slate-500 font-mono truncate max-w-[200px] hidden md:table-cell">
                      {item.destination}
                    </td>

                    {/* Clicks */}
                    <td className="px-4 sm:px-6 py-3.5 text-right font-bold text-slate-900 font-mono">
                      {item.clicks.toLocaleString()}
                    </td>

                    {/* Percentage Progress Bar */}
                    <td className="px-4 sm:px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <div className="w-16 sm:w-20 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage * 3.5}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 min-w-[32px]">
                          {item.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
