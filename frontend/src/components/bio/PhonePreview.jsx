import React, { useState } from "react";
import { Smartphone, Monitor, Wifi, Battery, Signal } from "lucide-react";
import { BioCardContent } from "./BioCardContent";

export function PhonePreview({
  profile = {},
  socialLinks = [],
  bioLinks = [],
  theme = "minimal",
  templateId = "creator",
  jobTitle = "",
  company = "",
  pronouns = "",
  coverImage = "",
  resumeUrl = "",
  statusBadge = "",
  highlights = [],
  projectLinks = [],
  contactMethods = [],
  customization = {},
}) {
  const [deviceMode, setDeviceMode] = useState("mobile");

  return (
    <div className="space-y-3.5 w-full max-w-[360px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
            Live Preview
          </h3>
          <p className="text-[11px] text-slate-500">
            Real-time interactive device preview.
          </p>
        </div>

        {/* Device Switcher Pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setDeviceMode("mobile")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
              deviceMode === "mobile"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Mobile View"
          >
            <Smartphone className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode("desktop")}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all cursor-pointer ${
              deviceMode === "desktop"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title="Desktop Card View"
          >
            <Monitor className="size-3.5" />
            <span className="hidden sm:inline text-[11px]">Card</span>
          </button>
        </div>
      </div>

      {/* Realistic Frame */}
      <div className="flex justify-center items-center">
        {deviceMode === "mobile" ? (
          /* Realistic Smartphone Frame (10% height reduction) */
          <div className="relative w-full max-w-[305px] sm:max-w-[320px] rounded-[44px] border-[8px] border-slate-950 bg-slate-950 shadow-2xl ring-1 ring-slate-800/80">
            {/* Side Hardware Buttons Mockup */}
            <div className="absolute -left-[11px] top-16 w-[3px] h-6 bg-slate-700 rounded-l-md" />
            <div className="absolute -left-[11px] top-26 w-[3px] h-9 bg-slate-700 rounded-l-md" />
            <div className="absolute -left-[11px] top-38 w-[3px] h-9 bg-slate-700 rounded-l-md" />
            <div className="absolute -right-[11px] top-24 w-[3px] h-12 bg-slate-700 rounded-r-md" />

            {/* Inner Phone Screen Container */}
            <div className="relative rounded-[36px] overflow-hidden bg-slate-900 flex flex-col justify-between select-none">
              {/* Top Status Bar with Dynamic Island */}
              <div className="relative z-30 pt-2 pb-0.5 px-4.5 flex items-center justify-between text-slate-400 text-[10px] font-semibold bg-transparent pointer-events-none">
                <span className="font-bold text-slate-800 dark:text-white tracking-tight">9:41</span>

                {/* Dynamic Island Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4.5 w-22 bg-black rounded-full flex items-center justify-between px-2 shadow-sm">
                  <div className="size-1.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <div className="size-1 rounded-full bg-blue-950 ring-1 ring-blue-500/20" />
                  </div>
                  <div className="size-1.5 rounded-full bg-slate-950" />
                </div>

                <div className="flex items-center gap-1 text-slate-800 dark:text-white opacity-80">
                  <Signal className="size-3" />
                  <Wifi className="size-3" />
                  <Battery className="size-3.5" />
                </div>
              </div>

              {/* Scrollable Phone Screen (Reduced by exactly 10%) */}
              <div className="phone-screen-scroll h-[486px] sm:h-[522px] lg:h-[540px] overflow-y-auto overscroll-contain phone-scrollbar">
                <BioCardContent
                  profile={profile}
                  socialLinks={socialLinks}
                  bioLinks={bioLinks}
                  theme={theme}
                  templateId={templateId}
                  jobTitle={jobTitle}
                  company={company}
                  pronouns={pronouns}
                  coverImage={coverImage}
                  resumeUrl={resumeUrl}
                  statusBadge={statusBadge}
                  highlights={highlights}
                  projectLinks={projectLinks}
                  contactMethods={contactMethods}
                  customization={customization}
                />
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="py-1.5 bg-transparent flex items-center justify-center pointer-events-none z-30">
                <div className="h-1 w-24 bg-slate-400/40 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Card Frame */
          <div className="w-full max-w-[330px] sm:max-w-[340px] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="h-7.5 border-b border-slate-200/80 bg-slate-100/90 px-3 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-400" />
              <span className="size-2 rounded-full bg-amber-400" />
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-slate-400 font-mono ml-2 truncate">
                linkhub.dev/bio/{profile?.username || "me"}
              </span>
            </div>
            <div className="phone-screen-scroll h-[486px] sm:h-[522px] lg:h-[540px] overflow-y-auto overscroll-contain phone-scrollbar">
              <BioCardContent
                profile={profile}
                socialLinks={socialLinks}
                bioLinks={bioLinks}
                theme={theme}
                templateId={templateId}
                jobTitle={jobTitle}
                company={company}
                pronouns={pronouns}
                coverImage={coverImage}
                resumeUrl={resumeUrl}
                statusBadge={statusBadge}
                highlights={highlights}
                projectLinks={projectLinks}
                contactMethods={contactMethods}
                customization={customization}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
