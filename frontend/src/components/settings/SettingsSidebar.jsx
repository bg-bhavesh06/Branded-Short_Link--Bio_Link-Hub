import React from "react";
import { User, Shield, Palette, Settings } from "lucide-react";

export function SettingsSidebar({ activeTab, onSelectTab }) {
  const navItems = [
    {
      id: "profile",
      label: "Profile",
      description: "Personal info & avatar",
      icon: User,
    },
    {
      id: "security",
      label: "Security",
      description: "Password & authentication",
      icon: Shield,
    },
    {
      id: "appearance",
      label: "Appearance",
      description: "Theme & styling",
      icon: Palette,
    },
    {
      id: "account",
      label: "Account",
      description: "Plan & danger zone",
      icon: Settings,
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-2xs border border-blue-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Desktop Vertical Settings Navigation */}
      <nav className="hidden lg:flex flex-col space-y-1.5 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`group flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-left transition-all ${
                isActive
                  ? "bg-blue-50/90 text-blue-600 font-semibold border border-blue-200/60 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white hover:border-slate-200/80 border border-transparent"
              }`}
            >
              <div
                className={`flex size-9 items-center justify-center rounded-xl transition-colors shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900"
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-sm font-bold ${
                    isActive ? "text-blue-600" : "text-slate-900"
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
