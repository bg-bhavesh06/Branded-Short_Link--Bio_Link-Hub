import React from "react";
import { ThemeSelector } from "./ThemeSelector";
import { Sparkles, Palette, Layers, Square, CircleDot, RectangleHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TEMPLATES_DATA } from "./TemplateGallery";

export function CustomizerPanel({
  templateId = "creator",
  onSelectTemplate,
  theme = "minimal",
  onSelectTheme,
  customization = {},
  onChangeCustomization,
}) {
  const buttonStyle = customization.buttonStyle || "rounded";

  const handleButtonStyleChange = (style) => {
    onChangeCustomization({
      ...customization,
      buttonStyle: style,
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Template Switcher Quick Select */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-blue-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">Active Template</h4>
          </div>
          <span className="text-[11px] text-slate-400 capitalize">
            {templateId} Layout
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TEMPLATES_DATA.map((t) => {
            const active = templateId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTemplate(t.id)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  active
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 font-bold ring-2 ring-blue-600/20 shadow-2xs"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <span className="text-xs font-semibold">{t.name.split(" ")[0]}</span>
                <span className="text-[10px] text-slate-400 font-normal truncate max-w-[80px]">
                  {t.badge}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Theme Selection (Assessment required: Minimal Light, Dark Slate, Gradient) */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <ThemeSelector currentTheme={theme} onSelectTheme={onSelectTheme} />
      </Card>

      {/* 3. Button / Link Style */}
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Square className="size-4 text-blue-600" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">Link & Button Style</h4>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Rounded Pill */}
          <button
            type="button"
            onClick={() => handleButtonStyleChange("rounded")}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              buttonStyle === "rounded"
                ? "border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20 font-bold shadow-2xs"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
            }`}
          >
            <div className="w-full h-5 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
              <span className="h-1 w-6 bg-slate-400 rounded-full" />
            </div>
            <span className="text-xs font-semibold">Pill</span>
          </button>

          {/* Soft Card */}
          <button
            type="button"
            onClick={() => handleButtonStyleChange("soft-card")}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              buttonStyle === "soft-card"
                ? "border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20 font-bold shadow-2xs"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
            }`}
          >
            <div className="w-full h-5 rounded-md bg-slate-100 border border-slate-300 shadow-xs flex items-center justify-center">
              <span className="h-1 w-6 bg-slate-400 rounded-full" />
            </div>
            <span className="text-xs font-semibold">Card</span>
          </button>

          {/* Outline */}
          <button
            type="button"
            onClick={() => handleButtonStyleChange("outline")}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
              buttonStyle === "outline"
                ? "border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-600/20 font-bold shadow-2xs"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
            }`}
          >
            <div className="w-full h-5 rounded-md border-2 border-dashed border-slate-300 flex items-center justify-center">
              <span className="h-1 w-6 bg-slate-400 rounded-full" />
            </div>
            <span className="text-xs font-semibold">Outline</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
