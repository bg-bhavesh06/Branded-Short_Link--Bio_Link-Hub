import React, { useState } from "react";
import { Smartphone, Monitor } from "lucide-react";
import { BioCardContent } from "./BioCardContent";

export function PhonePreview({
  profile = {},
  socialLinks = [],
  bioLinks = [],
  theme = "minimal",
}) {
  const [deviceMode, setDeviceMode] = useState("mobile");

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
            Live Preview
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            This is how your bio page will look.
          </p>
        </div>

        {/* Device Switcher Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === "mobile"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Mobile View"
          >
            <Smartphone className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-lg transition-all ${
              deviceMode === "desktop"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Desktop Card View"
          >
            <Monitor className="size-4" />
          </button>
        </div>
      </div>

      {/* Realistic Frame */}
      <div className="flex justify-center items-center">
        {deviceMode === "mobile" ? (
          /* Smartphone Frame */
          <div className="relative w-full max-w-[270px] sm:max-w-[280px] rounded-[34px] border-[7px] border-slate-900 bg-slate-900 shadow-xl overflow-hidden ring-1 ring-slate-800/40">
            {/* Dynamic Island Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20 h-3.5 w-18 bg-slate-900 rounded-full flex items-center justify-center gap-1">
              <span className="size-1 rounded-full bg-slate-800" />
              <span className="size-1 rounded-full bg-blue-950/80 ring-1 ring-blue-500/20" />
            </div>

            {/* Inner Phone Screen */}
            <div className="phone-screen-scroll h-[355px] sm:h-[370px] overflow-y-auto overscroll-contain pt-3.5 phone-scrollbar rounded-[27px]">
              <BioCardContent
                profile={profile}
                socialLinks={socialLinks}
                bioLinks={bioLinks}
                theme={theme}
              />
            </div>
          </div>
        ) : (
          /* Desktop Card Frame */
          <div className="w-full max-w-[305px] sm:max-w-[315px] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="h-7 border-b border-slate-200/80 bg-slate-100/80 px-2.5 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-rose-400" />
              <span className="size-1.5 rounded-full bg-amber-400" />
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-slate-400 font-mono ml-1 truncate">
                linkhub.dev/{profile?.username || "bhavesh"}
              </span>
            </div>
            <div className="phone-screen-scroll h-[350px] sm:h-[365px] overflow-y-auto overscroll-contain phone-scrollbar">
              <BioCardContent
                profile={profile}
                socialLinks={socialLinks}
                bioLinks={bioLinks}
                theme={theme}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
