import React from "react";

export function ThemeSelector({ currentTheme, onSelectTheme }) {
  const themes = [
    {
      id: "minimal",
      name: "Minimal Light",
      preview: (
        <div className="w-full h-11 sm:h-12 rounded-xl border border-slate-200 bg-white p-1.5 flex flex-col items-center justify-between">
          <div className="w-8 h-1.5 rounded-full bg-blue-600" />
          <div className="w-full space-y-1">
            <div className="w-full h-1 rounded-full bg-slate-100" />
            <div className="w-full h-1 rounded-full bg-slate-100" />
          </div>
        </div>
      ),
    },
    {
      id: "dark",
      name: "Dark Slate",
      preview: (
        <div className="w-full h-11 sm:h-12 rounded-xl border border-slate-800 bg-slate-900 p-1.5 flex flex-col items-center justify-between">
          <div className="w-8 h-1.5 rounded-full bg-slate-700" />
          <div className="w-full space-y-1">
            <div className="w-full h-1 rounded-full bg-slate-800" />
            <div className="w-full h-1 rounded-full bg-slate-800" />
          </div>
        </div>
      ),
    },
    {
      id: "gradient",
      name: "Gradient",
      preview: (
        <div className="w-full h-11 sm:h-12 rounded-xl border border-indigo-400 bg-gradient-to-tr from-blue-600 to-purple-600 p-1.5 flex flex-col items-center justify-between">
          <div className="w-8 h-1.5 rounded-full bg-white/80" />
          <div className="w-full space-y-1">
            <div className="w-full h-1 rounded-full bg-white/30" />
            <div className="w-full h-1 rounded-full bg-white/30" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2.5">
      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Choose a Theme</h4>
      <div className="grid grid-cols-3 gap-3">
        {themes.map((t) => {
          const isSelected = currentTheme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                isSelected
                  ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/40 shadow-xs"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              {t.preview}
              <span
                className={`text-xs font-semibold leading-tight mt-0.5 ${
                  isSelected ? "text-blue-600 font-bold" : "text-slate-700"
                }`}
              >
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
