import React, { useState } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export function AppearanceSettings() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("linkhub_app_theme") || "light";
    } catch {
      return "light";
    }
  });

  const handleSelectTheme = (mode) => {
    setTheme(mode);
    try {
      localStorage.setItem("linkhub_app_theme", mode);
    } catch {
      // ignore
    }
  };

  const themes = [
    {
      id: "light",
      name: "Light",
      description: "Clean, bright, high-contrast interface.",
      icon: Sun,
      preview: (
        <div className="w-full h-24 rounded-xl border border-slate-200 bg-slate-50 p-2.5 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-blue-600" />
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>
            <div className="size-2 rounded-full bg-slate-200" />
          </div>
          <div className="space-y-1.5 py-1">
            <div className="w-full h-2 rounded bg-white border border-slate-200/80" />
            <div className="w-3/4 h-2 rounded bg-white border border-slate-200/80" />
          </div>
          <div className="w-12 h-2 rounded-full bg-blue-600" />
        </div>
      ),
    },
    {
      id: "dark",
      name: "Dark",
      description: "Sleek slate dark mode, easier on the eyes.",
      icon: Moon,
      preview: (
        <div className="w-full h-24 rounded-xl border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-blue-500" />
              <div className="w-10 h-1.5 rounded-full bg-slate-700" />
            </div>
            <div className="size-2 rounded-full bg-slate-800" />
          </div>
          <div className="space-y-1.5 py-1">
            <div className="w-full h-2 rounded bg-slate-900 border border-slate-800" />
            <div className="w-3/4 h-2 rounded bg-slate-900 border border-slate-800" />
          </div>
          <div className="w-12 h-2 rounded-full bg-blue-500" />
        </div>
      ),
    },
    {
      id: "system",
      name: "System",
      description: "Automatically matches your OS preference.",
      icon: Laptop,
      preview: (
        <div className="w-full h-24 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-100 via-slate-500 to-slate-900 p-2.5 flex flex-col justify-between overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/20">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-blue-400" />
              <div className="w-10 h-1.5 rounded-full bg-white/40" />
            </div>
            <div className="size-2 rounded-full bg-white/30" />
          </div>
          <div className="space-y-1.5 py-1">
            <div className="w-full h-2 rounded bg-white/80" />
            <div className="w-3/4 h-2 rounded bg-white/60" />
          </div>
          <div className="w-12 h-2 rounded-full bg-blue-500" />
        </div>
      ),
    },
  ];

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Appearance
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Customize how LinkHub looks for you.
        </p>
      </div>

      {/* Theme Cards Grid */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700">Theme</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((t) => {
            const isSelected = theme === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTheme(t.id)}
                className={`group flex flex-col justify-between p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50"
                }`}
              >
                {/* Visual Preview */}
                {t.preview}

                {/* Details */}
                <div className="mt-3.5 flex items-start justify-between gap-2 w-full">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`size-4 ${isSelected ? "text-blue-600" : "text-slate-500"}`} />
                      <span
                        className={`text-sm font-bold ${
                          isSelected ? "text-blue-600" : "text-slate-900"
                        }`}
                      >
                        {t.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {t.description}
                    </p>
                  </div>

                  {/* Radio Checkmark */}
                  <div
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-all mt-0.5 ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white group-hover:border-slate-400"
                    }`}
                  >
                    {isSelected && <Check className="size-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
