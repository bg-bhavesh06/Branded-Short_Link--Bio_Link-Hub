import React, { useState, useEffect, useRef } from "react";
import {
  Link2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Loader2,
  Video,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FULL_URL = "https://example.com/products/summer-sale";
const SHORT_URL = "https://linkhub.dev/r/summer";
const TOTAL_DURATION = 11000; // 11 seconds loop

export function UrlShortenerVideoDemo() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100%

  // Animation States
  const [inputValue, setInputValue] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [showShortUrl, setShowShortUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsCount, setAnalyticsCount] = useState({ clicks: 0, week: 0, growth: 0 });

  // Mouse Cursor State
  const [cursorPos, setCursorPos] = useState({ x: 80, y: 310, visible: true, clicking: false });

  const animationTimeRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);

  // Main animation clock loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const animate = (timestamp) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaTime = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      animationTimeRef.current = (animationTimeRef.current + deltaTime) % TOTAL_DURATION;
      const t = animationTimeRef.current;
      setProgress((t / TOTAL_DURATION) * 100);

      // SCENE 1: Start / Reset (0ms - 800ms)
      if (t < 700) {
        setInputValue("");
        setIsShortening(false);
        setShowShortUrl(false);
        setIsCopied(false);
        setShowQr(false);
        setShowAnalytics(false);
        setAnalyticsCount({ clicks: 0, week: 0, growth: 0 });
        setCursorPos({ x: 75, y: 280, visible: true, clicking: false });
      }

      // SCENE 2: Move cursor to input & Type URL (700ms - 3800ms)
      else if (t >= 700 && t < 1200) {
        // Glide cursor into the input field
        const p = (t - 700) / 500;
        setCursorPos({
          x: 75 + (22 - 75) * p,
          y: 280 + (126 - 280) * p,
          visible: true,
          clicking: t > 1050,
        });
        setInputValue("");
      } else if (t >= 1200 && t < 3600) {
        // Typing character by character
        const typingDuration = 2400;
        const progressInTyping = (t - 1200) / typingDuration;
        const charsToShow = Math.floor(progressInTyping * FULL_URL.length);
        setInputValue(FULL_URL.slice(0, charsToShow));
        setCursorPos({ x: 25, y: 126, visible: true, clicking: false });
      } else if (t >= 3600 && t < 4000) {
        // Brief pause with full text
        setInputValue(FULL_URL);
        // Move towards Shorten button
        const p = (t - 3600) / 400;
        setCursorPos({
          x: 25 + (83 - 25) * p,
          y: 126,
          visible: true,
          clicking: false,
        });
      }

      // SCENE 3: Click Shorten Button & Loading (4000ms - 5200ms)
      else if (t >= 4000 && t < 4300) {
        // Click action
        setInputValue(FULL_URL);
        setCursorPos({ x: 83, y: 126, visible: true, clicking: true });
        setIsShortening(false);
      } else if (t >= 4300 && t < 5200) {
        // Shortening loading state
        setInputValue(FULL_URL);
        setIsShortening(true);
        setCursorPos({ x: 83, y: 126, visible: true, clicking: false });
        setShowShortUrl(false);
      }

      // SCENE 4: Reveal Short URL (5200ms - 6000ms)
      else if (t >= 5200 && t < 6000) {
        setIsShortening(false);
        setShowShortUrl(true);
        // Glide cursor towards Copy button
        const p = (t - 5200) / 800;
        setCursorPos({
          x: 83 + (87 - 83) * p,
          y: 126 + (192 - 126) * p,
          visible: true,
          clicking: false,
        });
      }

      // SCENE 5: Click Copy Button & Copied Feedback (6000ms - 7400ms)
      else if (t >= 6000 && t < 6300) {
        // Click copy
        setCursorPos({ x: 87, y: 192, visible: true, clicking: true });
        setIsCopied(true);
      } else if (t >= 6300 && t < 7200) {
        // Hold copied state
        setCursorPos({ x: 87, y: 192, visible: true, clicking: false });
        setIsCopied(true);
        setShowQr(true);
      } else if (t >= 7200 && t < 7600) {
        // Revert to Copy, reveal QR code
        setIsCopied(false);
        setShowQr(true);
        // Drift cursor downward
        const p = (t - 7200) / 400;
        setCursorPos({
          x: 87 + (80 - 87) * p,
          y: 192 + (290 - 192) * p,
          visible: true,
          clicking: false,
        });
      }

      // SCENE 6 & 7: Reveal Analytics & Count up (7600ms - 9200ms)
      else if (t >= 7600 && t < 9200) {
        setShowQr(true);
        setShowAnalytics(true);
        setCursorPos({ x: 80, y: 290, visible: true, clicking: false });

        // Smooth number count up
        const p = Math.min(1, (t - 7600) / 1200);
        setAnalyticsCount({
          clicks: (1.2 * p).toFixed(1),
          week: Math.floor(340 * p),
          growth: Math.floor(28 * p),
        });
      }

      // SCENE 8: Hold Completed State (9200ms - 10500ms)
      else if (t >= 9200 && t < 10500) {
        setShowShortUrl(true);
        setShowQr(true);
        setShowAnalytics(true);
        setAnalyticsCount({ clicks: "1.2", week: 340, growth: 28 });
        setCursorPos({ x: 80, y: 290, visible: true, clicking: false });
      }

      // SCENE 9: Smooth fade out before looping (10500ms - 11000ms)
      else if (t >= 10500) {
        setCursorPos({ x: 80, y: 290, visible: true, clicking: false });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  const handleReset = () => {
    animationTimeRef.current = 0;
    setProgress(0);
    setInputValue("");
    setIsShortening(false);
    setShowShortUrl(false);
    setIsCopied(false);
    setShowQr(false);
    setShowAnalytics(false);
    setAnalyticsCount({ clicks: 0, week: 0, growth: 0 });
    setCursorPos({ x: 75, y: 280, visible: true, clicking: false });
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Decorative Outer Aura Glow */}
      <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-xl pointer-events-none" />

      {/* Main SaaS Video Player Mockup Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-indigo-600/10 transition-all">
        {/* Top Video Header / Window Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-2.5 backdrop-blur-xs select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Video className="size-3.5 text-indigo-600" />
              <span>LinkHub Product Demo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-indigo-100/70 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span>Live Preview</span>
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title={isPlaying ? "Pause Demo" : "Play Demo"}
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title="Restart Demo"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Video Canvas / Card Surface */}
        <div className="relative p-6 sm:p-8 min-h-[440px] flex flex-col justify-between select-none">
          {/* Virtual Animated Mouse Cursor */}
          {cursorPos.visible && (
            <div
              className="pointer-events-none absolute z-50 transition-[top,left] duration-300 ease-out"
              style={{
                left: `${cursorPos.x}%`,
                top: `${cursorPos.y}px`,
                transform: "translate(-2px, -2px)",
              }}
            >
              {/* Cursor Icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="drop-shadow-md transition-transform duration-100"
                style={{
                  transform: cursorPos.clicking ? "scale(0.85)" : "scale(1)",
                }}
              >
                <path
                  d="M4 3L11 20L14 13L21 10L4 3Z"
                  fill="#0f172a"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Click Ripple Effect */}
              {cursorPos.clicking && (
                <span className="absolute -top-1 -left-1 size-6 rounded-full border-2 border-indigo-500 bg-indigo-400/30 animate-ping pointer-events-none" />
              )}
            </div>
          )}

          {/* URL Shortener UI Elements */}
          <div className="space-y-5">
            {/* Card Header */}
            <div className="flex items-center gap-3.5">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-300">
                <Link2 className="size-5.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-tight">
                  URL Shortener
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Turn long URLs into short, branded links.
                </p>
              </div>
            </div>

            {/* URL Input & Shorten Button Row */}
            <div className="flex items-center gap-2.5">
              <div
                className={`relative flex-1 flex items-center h-12 rounded-2xl border bg-slate-50 px-4 text-xs sm:text-sm transition-all duration-200 ${
                  inputValue
                    ? "border-indigo-500 bg-white ring-2 ring-indigo-500/10 text-slate-900 font-medium"
                    : "border-slate-200 text-slate-400"
                }`}
              >
                <span className="truncate">
                  {inputValue || "https://example.com/products/summer-sale"}
                </span>
                {inputValue.length < FULL_URL.length && inputValue.length > 0 && (
                  <span className="ml-0.5 inline-block w-0.5 h-4 bg-indigo-600 animate-pulse" />
                )}
              </div>

              <button
                type="button"
                className={`h-12 px-5 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 shrink-0 select-none shadow-sm ${
                  isShortening
                    ? "bg-indigo-700 text-white scale-98"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isShortening ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Shortening...</span>
                  </>
                ) : (
                  <span>Shorten</span>
                )}
              </button>
            </div>

            {/* Generated Short URL Box */}
            <div
              className={`flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-3.5 transition-all duration-400 ${
                showShortUrl
                  ? "opacity-100 translate-y-0 shadow-xs"
                  : "opacity-20 translate-y-1 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-mono text-xs sm:text-sm font-semibold text-slate-800 tracking-tight truncate">
                  {SHORT_URL}
                </span>
              </div>

              <button
                type="button"
                className={`h-9 px-4 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shrink-0 shadow-xs ${
                  isCopied
                    ? "bg-emerald-600 text-white scale-98"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="size-3.5" />
                    <span>✓ Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Code and Annotation */}
            <div
              className={`flex items-center gap-4 transition-all duration-500 ${
                showQr ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
              }`}
            >
              {/* QR Code SVG */}
              <div className="size-16 sm:size-18 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="size-full text-slate-900" fill="currentColor">
                  <rect x="0" y="0" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="5" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="10" y="10" width="10" height="10" rx="1" fill="#0f172a" />

                  <rect x="70" y="0" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="75" y="5" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="80" y="10" width="10" height="10" rx="1" fill="#0f172a" />

                  <rect x="0" y="70" width="30" height="30" rx="4" fill="#0f172a" />
                  <rect x="5" y="75" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="10" y="80" width="10" height="10" rx="1" fill="#0f172a" />

                  <rect x="36" y="8" width="8" height="8" rx="1" fill="#6366f1" />
                  <rect x="48" y="14" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="36" y="24" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="14" y="38" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="26" y="48" width="8" height="8" rx="1" fill="#6366f1" />
                  <rect x="38" y="38" width="14" height="14" rx="2" fill="#4f46e5" />
                  <rect x="56" y="42" width="8" height="8" rx="1" fill="#0f172a" />
                  <rect x="70" y="40" width="10" height="10" rx="1" fill="#0f172a" />
                  <rect x="84" y="52" width="8" height="8" rx="1" fill="#6366f1" />
                  <rect x="70" y="68" width="12" height="8" rx="1" fill="#0f172a" />
                  <rect x="46" y="74" width="10" height="10" rx="1" fill="#0f172a" />
                  <rect x="80" y="82" width="12" height="10" rx="1" fill="#4f46e5" />
                </svg>
              </div>

              {/* Annotation */}
              <div className="flex items-center gap-1.5 font-handwriting text-indigo-600 select-none">
                <svg
                  width="36"
                  height="26"
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
                <span className="text-lg sm:text-xl font-bold -mt-2">
                  Share via QR Code
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Analytics Stats */}
          <div
            className={`mt-6 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50/90 p-3 sm:p-4 border border-slate-100 text-center transition-all duration-500 ${
              showAnalytics
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-3 pointer-events-none"
            }`}
          >
            <div className="px-1">
              <div className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                {analyticsCount.clicks}K
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                Total Clicks
              </div>
            </div>
            <div className="px-1">
              <div className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                {analyticsCount.week}
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                This Week
              </div>
            </div>
            <div className="px-1">
              <div className="font-extrabold text-base sm:text-xl text-emerald-600 flex items-center justify-center gap-0.5 tracking-tight">
                <span>↑ {analyticsCount.growth}%</span>
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                Growth
              </div>
            </div>
          </div>
        </div>

        {/* Video Playback Progress Bar */}
        <div className="relative h-1 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
