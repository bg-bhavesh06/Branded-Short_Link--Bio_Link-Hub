import React from "react";
import { Youtube, Github, Globe, FileText, Instagram, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PUBLIC_APP_URL } from "@/lib/api";

const getLinkIcon = (url = "") => {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return { icon: Youtube, iconColor: "text-rose-600", iconBg: "bg-rose-50", name: "YouTube" };
  }
  if (lower.includes("github.com")) {
    return { icon: Github, iconColor: "text-slate-900", iconBg: "bg-slate-100", name: "GitHub" };
  }
  if (lower.includes("instagram.com")) {
    return { icon: Instagram, iconColor: "text-pink-600", iconBg: "bg-pink-50", name: "Instagram" };
  }
  if (lower.includes("drive.google.com") || lower.includes("docs.google.com") || lower.endsWith(".pdf")) {
    return { icon: FileText, iconColor: "text-blue-600", iconBg: "bg-blue-50", name: "Document" };
  }
  return { icon: Globe, iconColor: "text-emerald-600", iconBg: "bg-emerald-50", name: "Website" };
};

export function TopLinksCard({ loading = false, onCopyLink, copiedLink, data = [] }) {
  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
        <div className="h-5 w-40 bg-slate-200 rounded-md mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl" />
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
            Ranked by Clicks
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No link click data recorded yet for this period.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.map((link, index) => {
              const { icon: Icon, iconColor, iconBg, name: defaultName } = getLinkIcon(link.originalUrl);
              const shortUrl = `${PUBLIC_APP_URL}/r/${link.shortCode}`;
              const isCopied = copiedLink === shortUrl;

              return (
                <div
                  key={link.id || index}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs shrink-0">
                      {index + 1}
                    </div>

                    <div
                      className={`flex size-8 sm:size-9 items-center justify-center rounded-xl ${iconBg} ${iconColor} shrink-0`}
                    >
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                        {defaultName} (/{link.shortCode})
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px] sm:max-w-xs">
                        {link.originalUrl}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 font-mono">
                        {link.clicks.toLocaleString()}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-400">
                        {link.percentage}% of total
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onCopyLink?.(shortUrl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Copy Short Link"
                    >
                      {isCopied ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
