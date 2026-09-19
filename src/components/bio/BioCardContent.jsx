import React from "react";
import {
  Globe,
  Github,
  FileText,
  Instagram,
  Linkedin,
  ArrowRight,
  ExternalLink,
  Link2,
} from "lucide-react";

export function BioCardContent({
  profile = {},
  socialLinks = [],
  bioLinks = [],
  theme = "minimal",
  isPublic = false,
}) {
  // Map icons
  const getLinkIcon = (iconName) => {
    switch (iconName) {
      case "github":
        return <Github className={isPublic ? "size-4.5 shrink-0" : "size-4 shrink-0"} />;
      case "file":
      case "resume":
        return <FileText className={isPublic ? "size-4.5 shrink-0" : "size-4 shrink-0"} />;
      default:
        return <Globe className={isPublic ? "size-4.5 shrink-0" : "size-4 shrink-0"} />;
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return <Instagram className={isPublic ? "size-4.5 text-[#e1306c]" : "size-4 text-[#e1306c]"} />;
      case "github":
        return <Github className={isPublic ? "size-4.5" : "size-4"} />;
      case "linkedin":
        return <Linkedin className={isPublic ? "size-4.5 text-[#0077b5]" : "size-4 text-[#0077b5]"} />;
      case "x":
      case "twitter":
        return (
          <span className={`font-bold font-sans ${isPublic ? "text-sm" : "text-xs"}`}>𝕏</span>
        );
      default:
        return <ExternalLink className={isPublic ? "size-4.5" : "size-4"} />;
    }
  };

  // Theme Styling Configurations
  const themeStyles = {
    minimal: {
      container: "bg-[#f8fafc] text-slate-900",
      card: "bg-white border border-slate-200/90 text-slate-900 hover:border-slate-300 shadow-2xs",
      avatarRing: "ring-4 ring-white shadow-md",
      subtext: "text-slate-500",
      badge: "bg-slate-100 text-slate-700",
      socialBtn: "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs",
    },
    dark: {
      container: "bg-[#090d16] text-white",
      card: "bg-slate-900/90 border border-slate-800 text-white hover:border-slate-700 shadow-sm",
      avatarRing: "ring-4 ring-slate-800 shadow-md",
      subtext: "text-slate-400",
      badge: "bg-slate-800 text-slate-300",
      socialBtn: "bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 shadow-xs",
    },
    gradient: {
      container: "bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 text-white",
      card: "bg-white/95 backdrop-blur-md border border-white/30 text-slate-900 hover:bg-white shadow-md",
      avatarRing: "ring-4 ring-white/30 shadow-lg",
      subtext: "text-blue-100",
      badge: "bg-white/20 text-white",
      socialBtn: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 shadow-xs",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.minimal;

  return (
    <div
      className={`w-full min-h-full flex flex-col items-center justify-between transition-colors duration-300 ${
        currentTheme.container
      } ${isPublic ? "p-6 sm:p-8" : "p-3.5 pt-2 pb-3"}`}
    >
      {/* Top Header inside Preview */}
      <div className="w-full flex items-center justify-between text-xs mb-2 select-none">
        <div className="flex items-center gap-1.5 font-bold tracking-tight">
          <div className="flex size-4 items-center justify-center rounded-md bg-blue-600 text-white shadow-2xs">
            <Link2 className="size-2.5 rotate-45" />
          </div>
          <span className={`text-xs font-bold ${theme === "dark" ? "text-white" : theme === "gradient" ? "text-white" : "text-slate-900"}`}>
            LinkHub
          </span>
        </div>
        <div className="flex gap-1 opacity-70">
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
          <span className="size-1 rounded-full bg-current" />
        </div>
      </div>

      {/* Main Profile Info */}
      <div className={`w-full flex flex-col items-center text-center ${isPublic ? "space-y-3" : "space-y-2"}`}>
        {/* Avatar */}
        <div className="relative">
          <img
            src={profile?.avatar || "/avatar-bhavesh.jpg"}
            alt={profile?.displayName || "Avatar"}
            className={`rounded-full object-cover ${currentTheme.avatarRing} ${
              isPublic ? "size-20 sm:size-22" : "size-15 sm:size-16"
            }`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
            }}
          />
        </div>

        {/* Name & Handle */}
        <div>
          <h2 className={`font-extrabold tracking-tight leading-tight ${isPublic ? "text-xl" : "text-sm sm:text-base"}`}>
            {profile?.displayName || "Bhavesh Ganwani"}
          </h2>
          <p className={`font-semibold ${currentTheme.subtext} ${isPublic ? "text-xs mt-0.5" : "text-[11px] mt-0.5"}`}>
            @{profile?.username || "bhavesh"}
          </p>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <p className={`leading-relaxed ${currentTheme.subtext} ${isPublic ? "text-xs max-w-[260px]" : "text-xs max-w-[220px]"}`}>
            {profile.bio}
          </p>
        )}

        {/* Social Icons Row */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url || "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center rounded-xl transition-transform hover:scale-105 ${
                  currentTheme.socialBtn
                } ${isPublic ? "size-9" : "size-7 sm:size-7.5"}`}
                title={social.platform}
              >
                {getSocialIcon(social.platform)}
              </a>
            ))}
          </div>
        )}

        {/* Bio Links Stack */}
        <div className={`w-full ${isPublic ? "space-y-2.5 pt-3" : "space-y-2 pt-2"}`}>
          {bioLinks.map((link) => (
            <a
              key={link.id || link.title}
              href={link.url || "#"}
              target="_blank"
              rel="noreferrer"
              className={`w-full flex items-center justify-between rounded-xl font-semibold transition-all group hover:scale-[1.01] ${
                currentTheme.card
              } ${isPublic ? "px-4 py-3 text-xs sm:text-sm rounded-2xl" : "px-3 py-2 text-xs"}`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                  {getLinkIcon(link.icon)}
                </span>
                <span className="truncate">{link.title}</span>
              </div>
              <ArrowRight className="size-3 shrink-0 transition-transform group-hover:translate-x-0.5 opacity-70" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className={`select-none ${isPublic ? "pt-6 pb-2" : "pt-2.5 pb-1"}`}>
        <a
          href="/"
          className={`inline-flex items-center gap-1 font-medium tracking-tight opacity-70 hover:opacity-100 transition-opacity ${
            currentTheme.subtext
          } ${isPublic ? "text-[10px]" : "text-[9px]"}`}
        >
          <span>Powered by</span>
          <span className="font-bold">LinkHub</span>
        </a>
      </div>
    </div>
  );
}
