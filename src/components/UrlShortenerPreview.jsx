import React, { useState } from "react";
import { Link2, Copy, Check, QrCode, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UrlShortenerPreview() {
  const [longUrl, setLongUrl] = useState("https://example.com/products/summer-sale");
  const [shortUrl, setShortUrl] = useState("https://linkhub.dev/r/summer");
  const [copied, setCopied] = useState(false);
  const [isShortening, setIsShortening] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShorten = (e) => {
    e.preventDefault();
    setIsShortening(true);
    setTimeout(() => {
      setIsShortening(false);
      // Generate a realistic vanity slug demo
      const clean = longUrl.replace(/^https?:\/\//, "").split("/")[1] || "summer";
      setShortUrl(`https://linkhub.dev/r/${clean.slice(0, 10).toLowerCase()}`);
    }, 400);
  };

  return (
    <Card className="w-full max-w-sm sm:max-w-md rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-indigo-500/5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
      <CardContent className="p-0 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-300">
            <Link2 className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
              URL Shortener
            </h4>
            <p className="text-xs text-slate-500">
              Turn long URLs into short, branded links.
            </p>
          </div>
        </div>

        {/* Input Form with Shorten Button */}
        <form onSubmit={handleShorten} className="flex gap-2">
          <Input
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="flex-1 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-xl"
            placeholder="Paste your long link here..."
          />
          <Button
            type="submit"
            loading={isShortening}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl px-4 shrink-0 shadow-sm"
          >
            Shorten
          </Button>
        </form>

        {/* Generated Short URL Box */}
        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 sm:p-3">
          <span className="font-mono text-xs sm:text-sm font-medium text-slate-700 truncate select-all">
            {shortUrl}
          </span>
          <Button
            onClick={handleCopy}
            variant="default"
            size="sm"
            className={`shrink-0 rounded-lg text-xs font-medium transition-all ${
              copied
                ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>

        {/* QR Code and Annotation Section */}
        <div className="relative flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {/* Real SVG-rendered stylized QR Code */}
            <div className="size-16 sm:size-18 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xs flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="size-full text-slate-900"
                fill="currentColor"
              >
                {/* QR Code Patterns */}
                <rect x="0" y="0" width="30" height="30" rx="4" fill="#0f172a" />
                <rect x="5" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="10" y="10" width="10" height="10" rx="1" fill="#0f172a" />

                <rect x="70" y="0" width="30" height="30" rx="4" fill="#0f172a" />
                <rect x="75" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="80" y="10" width="10" height="10" rx="1" fill="#0f172a" />

                <rect x="0" y="70" width="30" height="30" rx="4" fill="#0f172a" />
                <rect x="5" y="75" width="20" height="20" rx="2" fill="#ffffff" />
                <rect x="10" y="80" width="10" height="10" rx="1" fill="#0f172a" />

                {/* Data modules */}
                <rect x="36" y="8" width="8" height="8" rx="1" fill="#6366f1" />
                <rect x="48" y="14" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="36" y="24" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="14" y="38" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="26" y="48" width="8" height="8" rx="1" fill="#6366f1" />
                <rect x="38" y="38" width="14" height="14" rx="2" fill="#4f46e5" />
                <rect x="56" y="42" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="42" y="58" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="70" y="40" width="10" height="10" rx="1" fill="#0f172a" />
                <rect x="84" y="52" width="8" height="8" rx="1" fill="#6366f1" />
                <rect x="70" y="68" width="12" height="8" rx="1" fill="#0f172a" />
                <rect x="46" y="74" width="10" height="10" rx="1" fill="#0f172a" />
                <rect x="62" y="84" width="8" height="8" rx="1" fill="#0f172a" />
                <rect x="80" y="82" width="12" height="10" rx="1" fill="#4f46e5" />
              </svg>
            </div>

            {/* Playful Handwritten Arrow & Note */}
            <div className="flex items-center gap-1.5 font-handwriting text-indigo-600 select-none">
              <svg
                width="34"
                height="24"
                viewBox="0 0 40 25"
                fill="none"
                className="stroke-indigo-500"
              >
                <path
                  d="M38 18 C 28 22, 16 16, 6 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M6 14 L 6 6 L 14 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <span className="text-base sm:text-lg font-bold -mt-2">
                Share via QR Code
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Analytics Stats */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50/80 p-3 pt-3.5 border border-slate-100 text-center">
          <div className="px-1">
            <div className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              1.2K
            </div>
            <div className="text-[11px] font-medium text-slate-500">Total Clicks</div>
          </div>
          <div className="px-1">
            <div className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              340
            </div>
            <div className="text-[11px] font-medium text-slate-500">This Week</div>
          </div>
          <div className="px-1">
            <div className="font-extrabold text-base sm:text-lg text-emerald-600 flex items-center justify-center gap-0.5 tracking-tight">
              <span>↑ 28%</span>
            </div>
            <div className="text-[11px] font-medium text-slate-500">Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
