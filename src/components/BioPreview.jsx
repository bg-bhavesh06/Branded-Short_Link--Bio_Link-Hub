import React, { useState } from "react";
import {
  LayoutGrid,
  Github,
  Linkedin,
  Instagram,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function BioPreview() {
  const [clickedLink, setClickedLink] = useState(null);

  const links = [
    {
      id: "projects",
      title: "My Projects",
      icon: Github,
      iconColor: "text-slate-900",
      bgColor: "hover:bg-slate-50",
    },
    {
      id: "linkedin",
      title: "Connect on LinkedIn",
      icon: Linkedin,
      iconColor: "text-[#0077b5]",
      bgColor: "hover:bg-blue-50/50",
    },
    {
      id: "instagram",
      title: "Follow on Instagram",
      icon: Instagram,
      iconColor: "text-[#e1306c]",
      bgColor: "hover:bg-pink-50/50",
    },
    {
      id: "blog",
      title: "Read My Blog",
      icon: BookOpen,
      iconColor: "text-indigo-600",
      bgColor: "hover:bg-indigo-50/50",
    },
  ];

  const handleLinkClick = (id) => {
    setClickedLink(id);
    setTimeout(() => setClickedLink(null), 1200);
  };

  return (
    <Card className="w-full max-w-sm sm:max-w-md rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-indigo-500/5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
      <CardContent className="p-0 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-300">
            <LayoutGrid className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
              Link-in-Bio
            </h4>
            <p className="text-xs text-slate-500">
              Create your personal hub page.
            </p>
          </div>
        </div>

        {/* Profile Card Mockup Container */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-b from-teal-50/60 via-slate-50/50 to-indigo-50/40 p-4 sm:p-5">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 size-28 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 size-28 rounded-full bg-indigo-200/30 blur-2xl pointer-events-none" />

          {/* Profile Details */}
          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-2.5">
              <img
                src="/avatar-bhavesh.jpg"
                alt="Bhavesh Avatar"
                className="size-16 sm:size-18 rounded-full object-cover shadow-md ring-3 ring-white"
                onError={(e) => {
                  // Fallback if image fails
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
                }}
              />
              <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <h5 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
              Bhavesh
            </h5>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Developer | Creator | Learner
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-[240px]">
              Building cool things on the internet 🚀
            </p>
          </div>

          {/* Bio Link Buttons */}
          <div className="mt-4 space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isSelected = clickedLink === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleLinkClick(link.id)}
                  className={`group relative flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/90 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 shadow-xs backdrop-blur-xs transition-all duration-150 ${link.bgColor} ${
                    isSelected ? "ring-2 ring-indigo-500 scale-[0.98]" : "hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`size-4 ${link.iconColor} shrink-0 transition-transform group-hover:scale-110`} />
                    <span className="text-slate-800 font-semibold">{link.title}</span>
                  </div>
                  <ExternalLink className="size-3.5 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-slate-600 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
