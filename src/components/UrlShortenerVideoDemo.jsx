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
  Volume2,
  VolumeX,
} from "lucide-react";

const FULL_URL = "https://example.com/products/summer-sale";
const SHORT_URL = "https://linkhub.dev/r/summer";
const TOTAL_CYCLE = 12000; // 12 seconds loop

export function UrlShortenerVideoDemo() {
  const [viewMode, setViewMode] = useState("live"); // "live" or "video"
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Live Animation States
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isShortening, setIsShortening] = useState(false);
  const [showShortUrl, setShowShortUrl] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState({ clicks: "0", week: 0, growth: 0 });

  // Mouse Cursor Coordinates (% x, px y)
  const [cursor, setCursor] = useState({
    x: 82,
    y: 320,
    visible: true,
    clicking: false,
  });

  // Video Mode States
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const videoRef = useRef(null);

  const animationTimeRef = useRef(0);
  const rafRef = useRef(null);
  const lastTimestampRef = useRef(null);

  // Main Live Animation Loop
  useEffect(() => {
    if (viewMode !== "live" || !isPlaying) {
      lastTimestampRef.current = null;
      return;
    }

    const runLoop = (timestamp) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;

      animationTimeRef.current = (animationTimeRef.current + delta) % TOTAL_CYCLE;
      const t = animationTimeRef.current;
      setProgress((t / TOTAL_CYCLE) * 100);

      // SCENE 1: Start Empty (0ms - 600ms)
      if (t < 600) {
        setInputValue("");
        setIsInputFocused(false);
        setIsShortening(false);
        setShowShortUrl(false);
        setIsCopied(false);
        setShowQr(false);
        setShowAnalytics(false);
        setAnalytics({ clicks: "0.0", week: 0, growth: 0 });
        setCursor({ x: 80, y: 310, visible: true, clicking: false });
      }

      // SCENE 2: Cursor glides to input and types URL (600ms - 3400ms)
      else if (t >= 600 && t < 1100) {
        // Gliding to input
        const p = (t - 600) / 500;
        setCursor({
          x: 80 + (25 - 80) * p,
          y: 310 + (130 - 310) * p,
          visible: true,
          clicking: false,
        });
        setInputValue("");
        setIsInputFocused(false);
      } else if (t >= 1100 && t < 1250) {
        // Click into input
        setIsInputFocused(true);
        setCursor({ x: 25, y: 130, visible: true, clicking: true });
        setInputValue("");
      } else if (t >= 1250 && t < 3300) {
        // Natural typing cadence
        setIsInputFocused(true);
        const typingDuration = 2050;
        const typingProgress = (t - 1250) / typingDuration;
        const charCount = Math.floor(typingProgress * FULL_URL.length);
        setInputValue(FULL_URL.slice(0, charCount));
        setCursor({ x: 25, y: 130, visible: true, clicking: false });
      } else if (t >= 3300 && t < 3800) {
        // Pause and move to Shorten button
        setInputValue(FULL_URL);
        const p = (t - 3300) / 500;
        setCursor({
          x: 25 + (84 - 25) * p,
          y: 130,
          visible: true,
          clicking: false,
        });
      }

      // SCENE 3: Click Shorten Button & Loading (3800ms - 5000ms)
      else if (t >= 3800 && t < 4000) {
        // Click Shorten
        setInputValue(FULL_URL);
        setCursor({ x: 84, y: 130, visible: true, clicking: true });
        setIsShortening(false);
      } else if (t >= 4000 && t < 5000) {
        // Shortening loading state
        setInputValue(FULL_URL);
        setIsShortening(true);
        setCursor({ x: 84, y: 130, visible: true, clicking: false });
        setShowShortUrl(false);
      }

      // SCENE 4: Reveal Short URL (5000ms - 5800ms)
      else if (t >= 5000 && t < 5800) {
        setIsShortening(false);
        setShowShortUrl(true);
        // Move towards Copy button
        const p = (t - 5000) / 800;
        setCursor({
          x: 84 + (88 - 84) * p,
          y: 130 + (194 - 130) * p,
          visible: true,
          clicking: false,
        });
      }

      // SCENE 5: Click Copy Button & Copied Feedback (5800ms - 7200ms)
      else if (t >= 5800 && t < 6100) {
        // Click Copy
        setCursor({ x: 88, y: 194, visible: true, clicking: true });
        setIsCopied(true);
      } else if (t >= 6100 && t < 7000) {
        // Hold Copied state
        setCursor({ x: 88, y: 194, visible: true, clicking: false });
        setIsCopied(true);
      } else if (t >= 7000 && t < 7400) {
        // Revert to Copy, reveal QR
        setIsCopied(false);
        setShowQr(true);
        // Move cursor downward
        const p = (t - 7000) / 400;
        setCursor({
          x: 88 + (82 - 88) * p,
          y: 194 + (300 - 194) * p,
          visible: true,
          clicking: false,
        });
      }

      // SCENE 6 & 7: QR Code & Analytics Reveal (7400ms - 9000ms)
      else if (t >= 7400 && t < 9000) {
        setShowQr(true);
        setShowAnalytics(true);
        setCursor({ x: 82, y: 300, visible: true, clicking: false });

        // Count up numbers
        const p = Math.min(1, (t - 7400) / 1400);
        setAnalytics({
          clicks: (1.2 * p).toFixed(1),
          week: Math.floor(340 * p),
          growth: Math.floor(28 * p),
        });
      }

      // SCENE 8: Hold Completed State (9000ms - 11400ms)
      else if (t >= 9000 && t < 11400) {
        setShowShortUrl(true);
        setShowQr(true);
        setShowAnalytics(true);
        setAnalytics({ clicks: "1.2", week: 340, growth: 28 });
        setCursor({ x: 82, y: 300, visible: true, clicking: false });
      }

      // SCENE 9: Loop Transition (11400ms - 12000ms)
      else if (t >= 11400) {
        setCursor({ x: 82, y: 300, visible: true, clicking: false });
      }

      rafRef.current = requestAnimationFrame(runLoop);
    };

    rafRef.current = requestAnimationFrame(runLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, viewMode]);

  // Restart live animation
  const handleRestart = () => {
    animationTimeRef.current = 0;
    setProgress(0);
    setInputValue("");
    setIsShortening(false);
    setShowShortUrl(false);
    setIsCopied(false);
    setShowQr(false);
    setShowAnalytics(false);
    setAnalytics({ clicks: "0.0", week: 0, growth: 0 });
    setCursor({ x: 80, y: 310, visible: true, clicking: false });
    setIsPlaying(true);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Decorative Outer Aura Glow */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-blue-500/20 blur-2xl pointer-events-none" />

      {/* Main SaaS Mockup Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-indigo-600/10 transition-all">
        {/* Top Player Header / Mode Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/95 px-4 py-3 select-none">
          {/* Mac-style traffic lights */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/90" />
              <span className="size-2.5 rounded-full bg-amber-400/90" />
              <span className="size-2.5 rounded-full bg-emerald-400/90" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Video className="size-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Product Demo</span>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setViewMode("live");
                handleRestart();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                viewMode === "live"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="size-3 text-indigo-600" />
              <span>Live Animation</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("video")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                viewMode === "video"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Video className="size-3 text-purple-600" />
              <span>AI Video</span>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1">
            {viewMode === "live" ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                  title="Restart"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.muted = !isVideoMuted;
                    setIsVideoMuted(!isVideoMuted);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                title={isVideoMuted ? "Unmute" : "Mute"}
              >
                {isVideoMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* VIEW MODE 1: NATIVE LIVE VECTOR ANIMATION (60FPS CRISP) */}
        {viewMode === "live" ? (
          <div className="relative p-6 sm:p-8 min-h-[460px] flex flex-col justify-between select-none">
            {/* Smooth Vector Mouse Pointer */}
            {cursor.visible && (
              <div
                className="pointer-events-none absolute z-50 transition-[top,left] duration-300 ease-out"
                style={{
                  left: `${cursor.x}%`,
                  top: `${cursor.y}px`,
                  transform: "translate(-2px, -2px)",
                }}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="drop-shadow-md transition-transform duration-100"
                  style={{
                    transform: cursor.clicking ? "scale(0.82)" : "scale(1)",
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

                {/* Click Ripple Pulse */}
                {cursor.clicking && (
                  <span className="absolute -top-1 -left-1 size-7 rounded-full border-2 border-indigo-500 bg-indigo-400/30 animate-ping pointer-events-none" />
                )}
              </div>
            )}

            {/* URL Shortener UI Elements */}
            <div className="space-y-4 sm:space-y-5">
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
                  className={`relative flex-1 flex items-center h-12 rounded-2xl border px-4 text-xs sm:text-sm transition-all duration-200 ${
                    isInputFocused
                      ? "border-indigo-500 bg-white ring-2 ring-indigo-500/10 text-slate-900 font-medium shadow-xs"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  <span className="truncate">
                    {inputValue || (
                      <span className="text-slate-400">
                        https://example.com/products/summer-sale
                      </span>
                    )}
                  </span>
                  {inputValue.length < FULL_URL.length && isInputFocused && (
                    <span className="ml-0.5 inline-block w-0.5 h-4 bg-indigo-600 animate-pulse" />
                  )}
                </div>

                <button
                  type="button"
                  className={`h-12 px-5 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 shrink-0 select-none shadow-sm ${
                    isShortening
                      ? "bg-indigo-700 text-white scale-98"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-98"
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
                className={`flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-3 sm:p-3.5 transition-all duration-400 ${
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
                      ? "bg-emerald-600 text-white scale-98 shadow-emerald-200"
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

              {/* QR Code and "Share via QR Code" Annotation (Matching Video) */}
              <div
                className={`flex items-center gap-4 transition-all duration-500 ${
                  showQr
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }`}
              >
                {/* Clean QR Code */}
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

                {/* Annotation with Upward Curved Arrow */}
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
              className={`mt-6 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl bg-slate-50/90 p-3.5 sm:p-4 border border-slate-100 text-center transition-all duration-500 ${
                showAnalytics
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3 pointer-events-none"
              }`}
            >
              <div className="px-1">
                <div className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  {analytics.clicks}K
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                  Total Clicks
                </div>
              </div>
              <div className="px-1">
                <div className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  {analytics.week}
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                  This Week
                </div>
              </div>
              <div className="px-1">
                <div className="font-extrabold text-base sm:text-xl text-emerald-600 flex items-center justify-center gap-0.5 tracking-tight">
                  <span>↑ {analytics.growth}%</span>
                </div>
                <div className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                  Growth
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: RAW AI VIDEO PLAYER */
          <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden min-h-[460px]">
            <video
              ref={videoRef}
              src="/url-shortener-demo.mp4"
              autoPlay
              loop
              muted={isVideoMuted}
              playsInline
              onTimeUpdate={() => {
                if (videoRef.current) {
                  const curr = videoRef.current.currentTime;
                  const dur = videoRef.current.duration || 1;
                  setVideoProgress((curr / dur) * 100);
                }
              }}
              className="w-full h-auto max-h-[480px] object-contain block select-none"
            />
          </div>
        )}

        {/* Video Playback Progress Bar */}
        <div className="relative h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-100 ease-linear"
            style={{ width: `${viewMode === "live" ? progress : videoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
