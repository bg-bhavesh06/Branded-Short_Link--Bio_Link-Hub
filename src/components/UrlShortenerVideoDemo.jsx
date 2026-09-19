import React, { useState, useRef, useEffect } from "react";
import {
  Link2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Video,
  MonitorPlay,
  Layers,
} from "lucide-react";

export function UrlShortenerVideoDemo() {
  const [activeTab, setActiveTab] = useState("video"); // "video" or "interactive"
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Toggle video playback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Toggle audio mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Restart video
  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  // Track video progress
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setVideoProgress((current / duration) * 100);
  };

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Decorative Outer Aura Glow */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-indigo-500/25 via-purple-500/20 to-blue-500/20 blur-2xl pointer-events-none" />

      {/* Main SaaS Video Player Mockup Container */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-indigo-600/10 transition-all">
        {/* Top Video Header / Window Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/95 px-4 py-3 backdrop-blur-xs select-none">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/90" />
              <span className="size-2.5 rounded-full bg-amber-400/90" />
              <span className="size-2.5 rounded-full bg-emerald-400/90" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Video className="size-3.5 text-indigo-600" />
              <span>LinkHub Product Demo</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Indicator */}
            <div className="flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span>AI Video</span>
            </div>

            {/* Controls */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
            </button>

            <button
              type="button"
              onClick={restartVideo}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              title="Restart Video"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Real AI Generated Video */}
          <video
            ref={videoRef}
            src="/url-shortener-demo.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-auto max-h-[480px] object-contain block select-none"
          />

          {/* Overlay Click-to-Play/Pause Hitbox */}
          <div
            onClick={togglePlay}
            className="absolute inset-0 cursor-pointer bg-transparent"
            title={isPlaying ? "Click to pause" : "Click to play"}
          />

          {/* Centered Pause Icon Badge when Paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="pointer-events-none absolute flex size-14 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-xl backdrop-blur-md transition-all scale-100"
            >
              <Play className="size-6 ml-0.5 fill-white" />
            </div>
          )}
        </div>

        {/* Video Playback Progress Bar */}
        <div className="relative h-1.5 w-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-100 ease-linear"
            style={{ width: `${videoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
