import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  Plus,
  Copy,
  Check,
  QrCode,
  BarChart3,
  MoreHorizontal,
  Search,
  Sparkles,
  Download,
  ArrowRight,
  MousePointer2,
  Users,
  BarChart2,
  Calendar,
  Youtube,
  Github,
  Globe,
  FileText,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AnalyticsStatCard } from "@/components/analytics/AnalyticsStatCard";

export function LinksPage() {
  const navigate = useNavigate();

  // Form states
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [previewUrl, setPreviewUrl] = useState("https://linkhub.dev/r/summer-sale");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard?.writeText?.(text);
    setToastMessage(`Link copied! ${text}`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleShorten = (e) => {
    e.preventDefault();
    const slug = customAlias.trim() || "link-" + Math.random().toString(36).substring(2, 7);
    const full = `https://linkhub.dev/r/${slug}`;
    setPreviewUrl(full);
    handleCopy(full);
  };

  const linksData = [
    {
      id: "1",
      name: "YouTube Channel",
      destination: "https://youtube.com/@bhavesh",
      shortUrl: "linkhub.dev/r/youtube",
      fullShortUrl: "https://linkhub.dev/r/youtube",
      clicks: "2,341",
      created: "Sep 12, 2025",
      status: "Active",
      icon: Youtube,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
    },
    {
      id: "2",
      name: "My GitHub",
      destination: "https://github.com/bg-bhavesh",
      shortUrl: "linkhub.dev/r/github",
      fullShortUrl: "https://linkhub.dev/r/github",
      clicks: "1,892",
      created: "Sep 10, 2025",
      status: "Active",
      icon: Github,
      iconColor: "text-slate-900",
      iconBg: "bg-slate-100",
    },
    {
      id: "3",
      name: "My Portfolio",
      destination: "https://bhavesh.dev",
      shortUrl: "linkhub.dev/r/portfolio",
      fullShortUrl: "https://linkhub.dev/r/portfolio",
      clicks: "954",
      created: "Sep 8, 2025",
      status: "Active",
      icon: Globe,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      id: "4",
      name: "My Resume",
      destination: "https://drive.google.com/resume",
      shortUrl: "linkhub.dev/r/resume",
      fullShortUrl: "https://linkhub.dev/r/resume",
      clicks: "1,120",
      created: "Sep 5, 2025",
      status: "Active",
      icon: FileText,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      id: "5",
      name: "Instagram",
      destination: "https://instagram.com/bg.bhavesh",
      shortUrl: "linkhub.dev/r/instagram",
      fullShortUrl: "https://linkhub.dev/r/instagram",
      clicks: "876",
      created: "Sep 2, 2025",
      status: "Active",
      icon: Instagram,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Links
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Create, manage and track all your short links.
          </p>
        </div>

        <Button
          onClick={() => {
            const input = document.getElementById("destination-url-input");
            input?.focus();
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4.5 py-2.5 font-semibold text-sm shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>Create Short Link</span>
        </Button>
      </div>

      {/* 2. Top Action Row: Create Short Link & Share Everywhere QR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Create Short Link Form Card */}
        <Card className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                  <Link2 className="size-5 rotate-45" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                    Create a Short Link
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Turn your long URL into a short, branded link.
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                Fast • Secure • Branded
              </span>
            </div>

            <form onSubmit={handleShorten} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Destination URL */}
                <div className="sm:col-span-6 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Destination URL
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 rotate-45" />
                    <input
                      id="destination-url-input"
                      type="url"
                      required
                      value={longUrl}
                      onChange={(e) => setLongUrl(e.target.value)}
                      placeholder="https://example.com/your-long-url"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                </div>

                {/* Custom Alias */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Custom Alias <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="summer-sale"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <Sparkles className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="sm:col-span-3 flex items-end">
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Shorten URL</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Preview Row */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Preview</span>
              <span className="font-bold text-blue-600 font-mono tracking-tight">
                {previewUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(previewUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors self-start sm:self-auto"
            >
              <Copy className="size-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </Card>

        {/* Right: Share Everywhere Card with QR Code */}
        <Card className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between items-center text-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Share Everywhere</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              Each short link comes with a QR code for easy sharing.
            </p>
          </div>

          {/* Realistic Vector QR Code */}
          <div className="relative my-3 p-3 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-2xs">
            <svg
              viewBox="0 0 100 100"
              className="size-24 sm:size-28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner Position Detection Patterns */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="13" width="10" height="10" rx="1.5" fill="#2563eb" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="77" y="13" width="10" height="10" rx="1.5" fill="#2563eb" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0f172a" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="77" width="10" height="10" rx="1.5" fill="#2563eb" />

              {/* Data modules */}
              <rect x="36" y="8" width="5" height="5" rx="1" fill="#0f172a" />
              <rect x="46" y="8" width="8" height="5" rx="1" fill="#2563eb" />
              <rect x="58" y="8" width="5" height="5" rx="1" fill="#0f172a" />
              <rect x="36" y="18" width="10" height="5" rx="1" fill="#0f172a" />
              <rect x="52" y="18" width="10" height="5" rx="1" fill="#0f172a" />
              <rect x="8" y="36" width="5" height="8" rx="1" fill="#0f172a" />
              <rect x="18" y="36" width="8" height="5" rx="1" fill="#2563eb" />
              <rect x="8" y="50" width="12" height="5" rx="1" fill="#0f172a" />
              <rect x="25" y="45" width="6" height="8" rx="1" fill="#0f172a" />
              <rect x="36" y="36" width="28" height="28" rx="6" fill="#2563eb" />
              <rect x="40" y="40" width="20" height="20" rx="4" fill="white" />
              <rect x="44" y="44" width="12" height="12" rx="2" fill="#2563eb" />
              <rect x="72" y="38" width="8" height="5" rx="1" fill="#0f172a" />
              <rect x="85" y="38" width="8" height="8" rx="1" fill="#2563eb" />
              <rect x="72" y="50" width="12" height="5" rx="1" fill="#0f172a" />
              <rect x="36" y="70" width="6" height="10" rx="1" fill="#0f172a" />
              <rect x="48" y="70" width="10" height="6" rx="1" fill="#2563eb" />
              <rect x="62" y="70" width="6" height="8" rx="1" fill="#0f172a" />
              <rect x="72" y="70" width="8" height="8" rx="1" fill="#0f172a" />
              <rect x="86" y="70" width="8" height="5" rx="1" fill="#2563eb" />
              <rect x="36" y="85" width="14" height="8" rx="1" fill="#0f172a" />
              <rect x="56" y="85" width="8" height="8" rx="1" fill="#0f172a" />
              <rect x="70" y="85" width="14" height="8" rx="1" fill="#2563eb" />
            </svg>
          </div>

          <Button
            variant="outline"
            onClick={() => alert("QR Code downloaded (simulation).")}
            className="w-full rounded-xl border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50"
          >
            <Download className="size-3.5" />
            <span>Download</span>
          </Button>
        </Card>
      </div>

      {/* 3. Four Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AnalyticsStatCard
          title="Total Links"
          value="24"
          change="↑ 12% from last month"
          icon={Link2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <AnalyticsStatCard
          title="Total Clicks"
          value="12,482"
          change="↑ 28% from last month"
          icon={MousePointer2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <AnalyticsStatCard
          title="Unique Visitors"
          value="8,321"
          change="↑ 18% from last month"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <AnalyticsStatCard
          title="Active Links"
          value="96%"
          change="↑ 2% from last month"
          icon={BarChart2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* 4. Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search links (title, URL, or alias)..."
            className="w-full rounded-xl border border-slate-200/90 bg-white pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs shrink-0">
            <select className="bg-transparent border-none focus:outline-none cursor-pointer">
              <option>All Links</option>
              <option>Active</option>
              <option>Archived</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs shrink-0">
            <select className="bg-transparent border-none focus:outline-none cursor-pointer">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs shrink-0">
            <select className="bg-transparent border-none focus:outline-none cursor-pointer">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Links Table Card */}
      <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="w-10 px-4 sm:px-6 py-3.5">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-4 sm:px-6 py-3.5">Destination</th>
                <th className="px-4 sm:px-6 py-3.5">Short Link</th>
                <th className="px-4 sm:px-6 py-3.5 text-right">Clicks</th>
                <th className="px-4 sm:px-6 py-3.5">Created</th>
                <th className="px-4 sm:px-6 py-3.5 text-center">Status</th>
                <th className="px-4 sm:px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linksData.map((link) => {
                const Icon = link.icon;
                return (
                  <tr key={link.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Checkbox */}
                    <td className="w-10 px-4 sm:px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </td>

                    {/* Destination with Icon */}
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg ${link.iconBg} ${link.iconColor} shrink-0`}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {link.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono truncate max-w-[220px]">
                            {link.destination}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Short Link with Copy */}
                    <td className="px-4 sm:px-6 py-4 font-mono font-medium text-blue-600">
                      <div className="inline-flex items-center gap-1.5">
                        <span>{link.shortUrl}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(link.fullShortUrl)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Copy link"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Clicks */}
                    <td className="px-4 sm:px-6 py-4 text-right font-bold text-slate-900 font-mono">
                      {link.clicks}
                    </td>

                    {/* Created */}
                    <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                      {link.created}
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={() => handleCopy(link.fullShortUrl)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Copy"
                        >
                          <Copy className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`QR Code for ${link.name}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="QR Code"
                        >
                          <QrCode className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/analytics")}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Analytics"
                        >
                          <BarChart3 className="size-4" />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Showing 1 to 5 of 24 links</span>
          <div className="flex items-center gap-1 font-semibold">
            <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              ‹
            </button>
            <button className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              2
            </button>
            <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              3
            </button>
            <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              4
            </button>
            <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              5
            </button>
            <button className="size-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              ›
            </button>
          </div>
        </div>
      </Card>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl shadow-emerald-500/10 animate-in slide-in-from-bottom-5">
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
            ✓
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900">Link copied!</div>
            <div className="text-slate-500 font-mono">{toastMessage.replace("Link copied! ", "")}</div>
          </div>
        </div>
      )}
    </div>
  );
}
