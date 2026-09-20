import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  Link2,
  Plus,
  Copy,
  QrCode,
  BarChart3,
  Search,
  Sparkles,
  Download,
  ArrowRight,
  MousePointer2,
  Users,
  BarChart2,
  Youtube,
  Github,
  Globe,
  FileText,
  Instagram,
  Loader2,
  AlertCircle,
  ExternalLink,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalyticsStatCard } from "@/components/analytics/AnalyticsStatCard";
import { QrCodeCustomizerDrawer } from "@/components/links/QrCodeCustomizerDrawer";
import { API_ENDPOINTS, PUBLIC_APP_URL } from "@/lib/api";

const API_BASE = API_ENDPOINTS.links;

const getLinkIcon = (url = "") => {
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    return { icon: Youtube, color: "text-rose-600", bg: "bg-rose-50" };
  }
  if (lower.includes("github.com")) {
    return { icon: Github, color: "text-slate-900", bg: "bg-slate-100" };
  }
  if (lower.includes("instagram.com")) {
    return { icon: Instagram, color: "text-pink-600", bg: "bg-pink-50" };
  }
  if (lower.includes("drive.google.com") || lower.includes("docs.google.com") || lower.endsWith(".pdf")) {
    return { icon: FileText, color: "text-blue-600", bg: "bg-blue-50" };
  }
  return { icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50" };
};

export function LinksPage() {
  const navigate = useNavigate();

  // Data & Pagination states
  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [lastCreatedUrl, setLastCreatedUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // 6-second auto-dismiss for error and toast popups
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 6000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Real-time Dynamic Preview URL
  const activePreviewUrl = useMemo(() => {
    const slug = customAlias.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (slug) return `${PUBLIC_APP_URL}/r/${slug}`;
    if (longUrl.trim()) return `${PUBLIC_APP_URL}/r/auto-generated`;
    return lastCreatedUrl || links[0]?.shortUrl || `${PUBLIC_APP_URL}/r/your-alias`;
  }, [customAlias, longUrl, lastCreatedUrl, links]);

  // QR Customization Style State (persisted)
  const DEFAULT_QR_STYLE = { fgColor: "#000000", bgColor: "#FFFFFF", frame: "bottom-pill", frameText: "SCAN ME", frameColor: "#000000", logoType: "none", customCenterText: "LINK" };
  const [qrStyle, setQrStyle] = useState(() => {
    try {
      const saved = localStorage.getItem("linkhub_qr_style");
      return saved ? JSON.parse(saved) : DEFAULT_QR_STYLE;
    } catch {
      return DEFAULT_QR_STYLE;
    }
  });
  const updateQrStyle = (newStyle) => {
    setQrStyle(newStyle);
    try { localStorage.setItem("linkhub_qr_style", JSON.stringify(newStyle)); } catch {}
  };

  // Modals state
  const [customizerLink, setCustomizerLink] = useState(null);
  const [qrModalLink, setQrModalLink] = useState(null);
  const [deleteModalLink, setDeleteModalLink] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch real user links with search & pagination
  const fetchLinks = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search: search.trim(),
      });

      const res = await fetch(`${API_BASE}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        const fetchedLinks = data.data?.links || data.links || [];
        const fetchedPagination = data.data?.pagination || data.pagination || {
          page: 1,
          limit: 10,
          totalItems: fetchedLinks.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        };

        setLinks(fetchedLinks);
        setPagination(fetchedPagination);
      }
    } catch {
      setError("Failed to load your links. Please check server connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch when debounced search or page changes
  useEffect(() => {
    fetchLinks(pagination.page, debouncedSearch);
  }, [debouncedSearch, pagination.page, fetchLinks]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText?.(text);
    setToastMessage(`Link copied! ${text}`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setError("");

    if (!longUrl.trim().startsWith("http://") && !longUrl.trim().startsWith("https://")) {
      setError("Destination URL must start with http:// or https://");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          originalUrl: longUrl.trim(),
          customSlug: customAlias.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to create short link");
        return;
      }

      setLongUrl("");
      setCustomAlias("");
      setLastCreatedUrl(data.link.shortUrl);
      handleCopy(data.link.shortUrl);
      // Refresh page 1 to reflect the new link
      fetchLinks(1, debouncedSearch);
    } catch {
      setError("Network error while creating link. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Real Delete ShortLink
  const handleDeleteConfirm = async () => {
    if (!deleteModalLink) return;

    try {
      setDeleting(true);
      const res = await fetch(`${API_BASE}/${deleteModalLink.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDeleteModalLink(null);
        setToastMessage("Short link deleted successfully");
        setTimeout(() => setToastMessage(""), 3500);

        // If deleting the last item on a page > 1, navigate to previous page
        const nextPage = links.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
        fetchLinks(nextPage, debouncedSearch);
      } else {
        alert(data.message || "Failed to delete link");
      }
    } catch {
      alert("Network error while deleting link.");
    } finally {
      setDeleting(false);
    }
  };

  // Real QR Code Download helper
  const downloadQRCode = (shortCode, elementId = "qr-code-canvas") => {
    const canvas = document.getElementById(elementId);
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `linkhub-${shortCode || "qr"}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const totalClicksAcrossLinks = links.reduce((acc, l) => acc + (l.clicks || 0), 0);

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
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4.5 py-2.5 font-semibold text-sm shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
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

            {error && (
              <div className="mb-4 flex items-center justify-between gap-2 rounded-xl bg-rose-50 border border-rose-200/80 px-3.5 py-2 text-xs text-rose-700 font-medium animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="p-1 rounded-md text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}

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
                    disabled={creating}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl py-2 font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Shorten URL</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Preview Row */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-400 font-medium shrink-0">Preview</span>
              <span className="font-bold text-blue-600 font-mono truncate">{activePreviewUrl}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(activePreviewUrl)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Copy className="size-3.5" />
                <span>Copy</span>
              </button>
              <a
                href={activePreviewUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="size-3.5" />
                <span>Visit</span>
              </a>
            </div>
          </div>
        </Card>

        {/* Right: Share Everywhere Card with QR Code */}
        <Card className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between items-center text-center">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Share Everywhere</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              Each short link comes with a dynamic QR code for instant scanning.
            </p>
          </div>

          {/* Real Styled QR Code Canvas */}
          <div
            style={{
              backgroundColor: qrStyle.bgColor,
              borderColor: qrStyle.frame === "simple" || qrStyle.frame === "card" ? qrStyle.frameColor : undefined,
            }}
            className={`relative my-3 p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
              qrStyle.frame === "simple"
                ? "border-2 shadow-sm"
                : qrStyle.frame === "card"
                ? "border-2 shadow-md"
                : "border border-slate-200 shadow-2xs"
            }`}
          >
            {qrStyle.frame === "top-pill" && (
              <div
                className="font-black uppercase tracking-widest text-[9px] mb-1.5"
                style={{ color: qrStyle.frameColor }}
              >
                {qrStyle.frameText || "SCAN ME"}
              </div>
            )}
            <div className="relative rounded-md overflow-hidden flex items-center justify-center">
              <QRCodeCanvas
                id="top-qr-canvas"
                value={activePreviewUrl}
                size={100}
                fgColor={qrStyle.fgColor}
                bgColor={qrStyle.bgColor}
                level="H"
                includeMargin={false}
              />
              {qrStyle.logoType !== "none" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    style={{
                      backgroundColor: qrStyle.bgColor,
                      color: qrStyle.fgColor,
                      borderColor: qrStyle.fgColor,
                    }}
                    className="size-6 rounded-full border-2 shadow-xs flex items-center justify-center font-extrabold text-[7.5px]"
                  >
                    {qrStyle.logoType === "custom"
                      ? qrStyle.customCenterText.slice(0, 3).toUpperCase()
                      : { linkhub: "LH", github: "GH", linkedin: "IN", instagram: "IG", x: "𝕏" }[qrStyle.logoType] || "LH"}
                  </div>
                </div>
              )}
            </div>
            {qrStyle.frame === "bottom-pill" && (
              <div
                className="font-black uppercase tracking-widest text-[9px] mt-1.5"
                style={{ color: qrStyle.frameColor }}
              >
                {qrStyle.frameText || "SCAN ME"}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => setCustomizerLink({ url: activePreviewUrl, title: "Short Link" })}
              className="rounded-xl border-blue-200 bg-blue-50/50 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100/60 cursor-pointer shadow-2xs"
            >
              <Sparkles className="size-3.5 text-blue-600" />
              <span>Edit QR</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadQRCode("short-link", "top-qr-canvas")}
              className="rounded-xl border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* 3. Four Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AnalyticsStatCard
          title="Total Links"
          value={pagination.totalItems.toString()}
          change={`${pagination.totalItems} active shortened links`}
          icon={Link2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <AnalyticsStatCard
          title="Total Clicks"
          value={totalClicksAcrossLinks.toLocaleString()}
          change="Real-time telemetry tracked"
          icon={MousePointer2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <AnalyticsStatCard
          title="Avg. Clicks / Link"
          value={
            links.length > 0
              ? (totalClicksAcrossLinks / links.length).toFixed(1)
              : "0"
          }
          change="Across current page"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <AnalyticsStatCard
          title="Active Links"
          value={pagination.totalItems > 0 ? "100%" : "0%"}
          change="All links routed via HTTP 302"
          icon={BarChart2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      {/* 4. Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Search Input with Debounce */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            placeholder="Search links by URL or short code..."
            className="w-full rounded-xl border border-slate-200/90 bg-white pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-2xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs shrink-0">
            <span>
              Total: {pagination.totalItems} link{pagination.totalItems !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Links Table Card */}
      <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="size-7 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Loading your short links...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3.5">
              <Link2 className="size-7 rotate-45" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              {debouncedSearch ? "No matching links found" : "No short links yet"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
              {debouncedSearch
                ? `No short links matched "${debouncedSearch}". Try clearing your search.`
                : "Enter a destination URL above to generate your first fast, branded short link!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-4 sm:px-6 py-3.5">Destination</th>
                  <th className="px-4 sm:px-6 py-3.5">Short Link</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Clicks</th>
                  <th className="px-4 sm:px-6 py-3.5">Created</th>
                  <th className="px-4 sm:px-6 py-3.5 text-center">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {links.map((link) => {
                  const { icon: Icon, color: iconColor, bg: iconBg } = getLinkIcon(link.originalUrl);
                  const formattedDate = link.createdAt
                    ? new Date(link.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Recently";

                  return (
                    <tr key={link.id || link.shortCode} className="hover:bg-slate-50/70 transition-colors">
                      {/* Destination with Icon */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-8 items-center justify-center rounded-lg ${iconBg} ${iconColor} shrink-0`}
                          >
                            <Icon className="size-4" />
                          </div>
                          <div className="min-w-0 max-w-[240px] sm:max-w-xs">
                            <a
                              href={link.originalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-slate-900 truncate hover:text-blue-600 flex items-center gap-1.5"
                            >
                              <span className="truncate">{link.originalUrl}</span>
                              <ExternalLink className="size-3 shrink-0 text-slate-400" />
                            </a>
                            <div className="text-[11px] text-slate-400 font-mono truncate">
                              /{link.shortCode}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Short Link with Copy */}
                      <td className="px-4 sm:px-6 py-4 font-mono font-medium text-blue-600">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            {link.shortUrl?.replace(/^https?:\/\//, "")}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(link.shortUrl)}
                            className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Copy link"
                          >
                            <Copy className="size-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Clicks */}
                      <td className="px-4 sm:px-6 py-4 text-right font-bold text-slate-900 font-mono">
                        {(link.clicks || 0).toLocaleString()}
                      </td>

                      {/* Created */}
                      <td className="px-4 sm:px-6 py-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                        {formattedDate}
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
                          {/* Copy */}
                          <button
                            type="button"
                            onClick={() => handleCopy(link.shortUrl)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Copy short link"
                          >
                            <Copy className="size-4" />
                          </button>

                          {/* QR Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => setQrModalLink(link)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Generate QR Code"
                          >
                            <QrCode className="size-4" />
                          </button>

                          {/* Analytics */}
                          <button
                            type="button"
                            onClick={() => navigate("/analytics")}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Analytics"
                          >
                            <BarChart3 className="size-4" />
                          </button>

                          {/* Delete Link */}
                          <button
                            type="button"
                            onClick={() => setDeleteModalLink(link)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Footer */}
        {!loading && pagination.totalItems > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.totalItems)} of{" "}
              {pagination.totalItems} link{pagination.totalItems !== 1 ? "s" : ""}
            </span>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-1.5 font-semibold">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPagination((prev) => ({ ...prev, page: p }))}
                    className={`size-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                      pagination.page === p
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.totalPages, prev.page + 1),
                    }))
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 6. REAL QR CODE MODAL */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center text-center">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQrModalLink(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Modal Header */}
            <div className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
              <QrCode className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">QR Code</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[260px]">
              {qrModalLink.originalUrl}
            </p>

            {/* QR Code Canvas */}
            <div className="my-5 p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <QRCodeCanvas
                id="modal-qr-canvas"
                value={qrModalLink.shortUrl}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Short URL readout */}
            <div className="w-full bg-slate-50 rounded-xl p-2.5 mb-5 border border-slate-100 flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-blue-600 font-semibold truncate">
                {qrModalLink.shortUrl}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(qrModalLink.shortUrl)}
                className="p-1 rounded-md text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                title="Copy Link"
              >
                <Copy className="size-3.5" />
              </button>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              <Button
                variant="outline"
                onClick={() => {
                  const target = qrModalLink;
                  setQrModalLink(null);
                  setCustomizerLink({ url: target.shortUrl, title: target.originalUrl });
                }}
                className="rounded-xl border-blue-200 bg-blue-50/60 text-blue-700 text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 hover:bg-blue-100/70 cursor-pointer"
              >
                <Sparkles className="size-3.5 text-blue-600" />
                <span>Customize QR</span>
              </Button>
              <Button
                onClick={() => downloadQRCode(qrModalLink.shortCode, "modal-qr-canvas")}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold py-2.5 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="size-3.5" />
                <span>Download PNG</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. REAL DELETE CONFIRMATION MODAL */}
      {deleteModalLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              disabled={deleting}
              onClick={() => setDeleteModalLink(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Modal Icon & Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Short Link?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            {/* Details Box */}
            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3.5 mb-5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 w-16 shrink-0">Short Code:</span>
                <span className="font-mono font-bold text-slate-900">/{deleteModalLink.shortCode}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 w-16 shrink-0">Destination:</span>
                <span className="font-mono text-slate-600 truncate">{deleteModalLink.originalUrl}</span>
              </div>
              <p className="text-[11px] text-rose-700 font-medium pt-1 border-t border-rose-100 mt-2">
                Warning: Deleting this link will permanently remove all associated click history and telemetry.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                disabled={deleting}
                onClick={() => setDeleteModalLink(null)}
                className="rounded-xl border-slate-200 text-xs font-semibold py-2.5 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold py-2.5 shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Delete Link</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl shadow-emerald-500/10 animate-in slide-in-from-bottom-5">
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shrink-0">
            <Check className="size-4 stroke-[3]" />
          </div>
          <div className="text-xs min-w-0 pr-2">
            <div className="font-bold text-slate-900">Success</div>
            <div className="text-slate-500 font-mono truncate max-w-xs">{toastMessage}</div>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage("")}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0 ml-1"
            title="Dismiss"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Slide-Over Right Drawer for QR Customization */}
      <QrCodeCustomizerDrawer
        isOpen={Boolean(customizerLink)}
        onClose={() => setCustomizerLink(null)}
        linkUrl={customizerLink?.url}
        linkTitle={customizerLink?.title}
        qrStyle={qrStyle}
        onUpdateStyle={updateQrStyle}
      />
    </div>
  );
}
