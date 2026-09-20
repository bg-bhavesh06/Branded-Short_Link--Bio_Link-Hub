import React, { useState } from "react";
import {
  Globe, Github, FileText, Instagram, Linkedin, Youtube,
  ArrowRight, ChevronRight, Link2, Mail, Phone, Briefcase,
  CheckCircle2, Code2, BookOpen, Camera, Menu, Moon, Home, User
} from "lucide-react";

const COVER_IMG = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80";
const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80";

const ICONS = { github: Github, file: FileText, resume: FileText, briefcase: Briefcase, work: Briefcase, camera: Camera, home: Home, mail: Mail, user: User };
const SOCIALS = {
  github: { icon: Github, color: "" },
  linkedin: { icon: Linkedin, color: "text-[#0077b5]" },
  instagram: { icon: Instagram, color: "text-[#e1306c]" },
  youtube: { icon: Youtube, color: "text-[#ff0000]" },
  website: { icon: Globe, color: "" },
};

const THEMES = {
  minimal: {
    container: "bg-[#f8fafc] text-slate-900",
    card: "bg-white border border-slate-200/90 text-slate-900 hover:border-slate-300 shadow-2xs",
    outlineCard: "border-2 border-slate-300 bg-transparent text-slate-900 hover:bg-slate-100/50",
    softCard: "bg-white border border-slate-200/80 text-slate-900 hover:border-slate-300 shadow-xs",
    avatarRing: "ring-4 ring-white shadow-md",
    subtext: "text-slate-500",
    badge: "bg-slate-100 text-slate-700 border border-slate-200/80",
    socialBtn: "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs",
    proDarkBg: "bg-slate-900 text-white",
    highlightCard: "bg-white border border-slate-200/90 shadow-2xs",
  },
  dark: {
    container: "bg-[#090d16] text-white",
    card: "bg-slate-900/90 border border-slate-800 text-white hover:border-slate-700 shadow-sm",
    outlineCard: "border-2 border-slate-700 bg-transparent text-white hover:bg-slate-800/50",
    softCard: "bg-slate-900 border border-slate-800 text-white hover:border-slate-700 shadow-sm",
    avatarRing: "ring-4 ring-slate-800 shadow-md",
    subtext: "text-slate-400",
    badge: "bg-slate-800 text-slate-300 border border-slate-700",
    socialBtn: "bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 shadow-xs",
    proDarkBg: "bg-slate-950 text-white",
    highlightCard: "bg-slate-900/90 border border-slate-800 shadow-xs",
  },
  gradient: {
    container: "bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 text-white",
    card: "bg-white/95 backdrop-blur-md border border-white/30 text-slate-900 hover:bg-white shadow-md",
    outlineCard: "border-2 border-white/60 bg-white/10 backdrop-blur-md text-white hover:bg-white/20",
    softCard: "bg-white/90 backdrop-blur-md border border-white/40 text-slate-900 hover:bg-white shadow-md",
    avatarRing: "ring-4 ring-white/30 shadow-lg",
    subtext: "text-blue-100",
    badge: "bg-white/20 text-white border border-white/30 backdrop-blur-xs",
    socialBtn: "bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 shadow-xs",
    proDarkBg: "bg-black/30 backdrop-blur-lg text-white",
    highlightCard: "bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-sm",
  },
};

export function BioCardContent({
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
  contactMethods = [],
  customization = {},
  isPublic = false,
}) {
  const [activeTab, setActiveTab] = useState("about");
  const th = THEMES[theme] || THEMES.minimal;
  const btnStyle = customization?.buttonStyle || "rounded";

  const name = profile?.displayName || "Bhavesh Ganwani";
  const user = profile?.username || "bhavesh06";
  const bio = profile?.bio || "";
  const role = jobTitle || profile?.jobTitle || "";
  const comp = company || profile?.company || "";
  const avatar = profile?.avatar || DEFAULT_AVATAR;
  const cover = coverImage || profile?.coverImage || COVER_IMG;
  const resume = resumeUrl || profile?.resumeUrl || "";
  const status = statusBadge || profile?.statusBadge || "Open to work";

  const defaultHighlights = [
    { title: role || "MERN Stack Developer", subtitle: "Passionate about building real-world web applications." },
    { title: "Currently Learning", subtitle: "System Design, Distributed Architectures & Cloud." },
  ];
  const listHighlights = highlights?.length ? highlights : profile?.highlights?.length ? profile.highlights : defaultHighlights;

  const email = contactMethods?.find((c) => c.type === "email" && c.value)?.value;
  const phone = contactMethods?.find((c) => c.type === "phone" && c.value)?.value;

  const getIcon = (n, cls = "size-4 shrink-0") => {
    const Comp = ICONS[n?.toLowerCase()] || Globe;
    return <Comp className={cls} />;
  };

  const getSocial = (p) => {
    if (p?.toLowerCase() === "x" || p?.toLowerCase() === "twitter") return <span className="font-bold text-xs">𝕏</span>;
    const item = SOCIALS[p?.toLowerCase()] || { icon: Globe, color: "" };
    const Comp = item.icon;
    return <Comp className={`size-4 ${item.color}`} />;
  };

  const btnClass = () => {
    const shape = btnStyle === "rounded" ? "rounded-full" : btnStyle === "outline" ? "rounded-xl" : "rounded-2xl";
    const base = btnStyle === "outline" ? th.outlineCard : btnStyle === "soft-card" ? th.softCard : th.card;
    return `w-full flex items-center justify-between font-semibold transition-all hover:scale-[1.01] ${shape} ${base} ${isPublic ? "px-4.5 py-3.5 text-sm" : "px-3 py-2 text-xs"}`;
  };

  const renderSocials = (sz = "size-7") => {
    const list = socialLinks.length ? socialLinks : [{ platform: "github" }, { platform: "linkedin" }, { platform: "instagram" }, { platform: "youtube" }, { platform: "x" }];
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
        {list.map((s, i) => (
          <a key={i} href={s.url || "#"} target="_blank" rel="noreferrer" className={`flex items-center justify-center rounded-xl transition-transform hover:scale-105 ${th.socialBtn} ${sz}`}>
            {getSocial(s.platform)}
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full min-h-full flex flex-col items-center justify-between transition-colors duration-300 ${th.container} ${isPublic ? "p-6 sm:p-8" : "p-3.5 pt-2 pb-3"}`}>
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between text-xs mb-2 select-none">
        <div className="flex items-center gap-1.5 font-bold">
          <div className="flex size-4 items-center justify-center rounded-md bg-blue-600 text-white"><Link2 className="size-2.5 rotate-45" /></div>
          <span>LinkHub</span>
        </div>
        <div className="flex gap-1 opacity-70"><span className="size-1 rounded-full bg-current" /><span className="size-1 rounded-full bg-current" /><span className="size-1 rounded-full bg-current" /></div>
      </div>

      <div className="w-full flex-1">
        {/* 1. CREATOR TEMPLATE */}
        {templateId === "creator" && (
          <div className={`w-full flex flex-col items-center text-center ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            <img src={avatar} alt={name} className={`rounded-full object-cover ${th.avatarRing} ${isPublic ? "size-24" : "size-15"}`} onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 font-extrabold"><h2 className={isPublic ? "text-2xl" : "text-base"}>{name}</h2><CheckCircle2 className="size-4 text-blue-600 fill-blue-600 text-white shrink-0" /></div>
              <p className={`text-xs ${th.subtext}`}>@{user} {pronouns && `(${pronouns})`}</p>
            </div>
            <p className={`text-[11px] leading-relaxed max-w-[240px] ${th.subtext}`}>{bio || "Code • Build • Learn • Grow\nTurning ideas into real products 🚀"}</p>
            {renderSocials()}
            {(email || phone) && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
                {email && <a href={`mailto:${email}`} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${th.badge}`}><Mail className="size-3 text-blue-600" />{email}</a>}
                {phone && <a href={`tel:${phone}`} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${th.badge}`}><Phone className="size-3 text-emerald-600" />{phone}</a>}
              </div>
            )}
            <div className={`w-full ${isPublic ? "space-y-3 pt-2" : "space-y-2 pt-1"}`}>
              {(bioLinks.length ? bioLinks : [{ title: "My Projects", icon: "briefcase", url: "#" }, { title: "Resume", icon: "resume", url: resume || "#" }, { title: "Tech Blog", icon: "file", url: "#" }, { title: "Buy Me a Coffee", icon: "globe", url: "#" }, { title: "Let's Connect", icon: "globe", url: "#" }]).map((link, idx) => (
                <a key={link.id || idx} href={link.title?.toLowerCase().includes("resume") && resume ? resume : link.url || "#"} target="_blank" rel="noreferrer" className={idx === 0 && btnStyle !== "outline" ? `w-full flex items-center justify-between font-bold rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md ${isPublic ? "px-4.5 py-3.5 text-sm" : "px-3 py-2 text-xs"}` : btnClass()}>
                  <div className="flex items-center gap-2.5 truncate"><span className="opacity-90">{getIcon(link.icon)}</span><span className="truncate">{link.title}</span></div>
                  <ArrowRight className="size-3.5 opacity-70" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 2. PROFESSIONAL TEMPLATE */}
        {templateId === "professional" && (
          <div className={`w-full flex flex-col text-left ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            <div className={`p-3.5 rounded-2xl ${th.proDarkBg} border border-slate-800 shadow-md space-y-2.5`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <h2 className="font-extrabold text-sm sm:text-base text-white truncate">{name}</h2>
                  <div className="text-[11px] font-semibold text-slate-300">{role || "Software Engineer"}{comp ? ` • ${comp}` : ""}</div>
                  <p className="text-[9.5px] text-slate-400 leading-tight pt-0.5 max-w-[190px]">{bio || "Building scalable web applications with modern technologies."}</p>
                </div>
                <div className="relative shrink-0">
                  <img src={avatar} alt={name} className="size-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-md" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[7px] font-black text-slate-950 uppercase">{status}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                {[
                  { label: "GitHub", icon: Github, color: "text-slate-300", url: socialLinks.find((s) => s.platform === "github")?.url || "https://github.com" },
                  { label: "LinkedIn", icon: Linkedin, color: "text-[#0077b5]", url: socialLinks.find((s) => s.platform === "linkedin")?.url || "https://linkedin.com" },
                  { label: "X", custom: "𝕏", color: "text-white", url: socialLinks.find((s) => s.platform === "x")?.url || "https://x.com" },
                  { label: "Email", icon: Mail, color: "text-blue-400", bg: "bg-blue-950/60 border-blue-800/60", url: email ? `mailto:${email}` : `mailto:${user}@linkhub.me` },
                ].map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noreferrer" className={`py-1.5 px-1 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-0.5 ${item.bg || ""}`}>
                    {item.icon ? <item.icon className={`size-3.5 ${item.color}`} /> : <span className="text-[9px] font-bold text-white">𝕏</span>}
                    <span className="text-[7.5px] text-slate-400 font-semibold">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-200/40 dark:border-slate-800 pb-1 text-xs font-bold px-1">
              {["about", "projects", "contact"].map((t) => (
                <button key={t} type="button" onClick={() => setActiveTab(t)} className={`pb-1 capitalize cursor-pointer transition-all ${activeTab === t ? "text-blue-600 border-b-2 border-blue-600 font-extrabold" : "text-slate-400"}`}>
                  {t}
                </button>
              ))}
            </div>

            {activeTab === "about" && (
              <div className="space-y-2 pt-0.5">
                <div className="space-y-1.5">
                  {listHighlights.map((h, i) => (
                    <div key={i} className={`p-2.5 rounded-xl ${th.highlightCard} flex items-center gap-2.5`}>
                      <div className={`size-7 rounded-lg ${i === 0 ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"} flex items-center justify-center shrink-0`}>
                        {i === 0 ? <Code2 className="size-4" /> : <BookOpen className="size-4" />}
                      </div>
                      <div className="min-w-0"><div className="text-xs font-bold truncate">{h.title}</div><div className={`text-[9.5px] ${th.subtext} truncate`}>{h.subtitle}</div></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wider px-1 flex items-center justify-between ${th.subtext}`}><span>Featured Links</span><ArrowRight className="size-2.5" /></div>
                  {(bioLinks.length ? bioLinks : [{ title: "View My Resume", icon: "resume", url: resume || "#" }, { title: "Explore My Projects", icon: "briefcase", url: "#" }]).map((link, idx) => (
                    <a key={link.id || idx} href={link.title?.toLowerCase().includes("resume") && resume ? resume : link.url || "#"} target="_blank" rel="noreferrer" className={btnClass()}>
                      <div className="flex items-center gap-2 truncate"><span className="opacity-80">{getIcon(link.icon)}</span><span className="truncate">{link.title}</span></div>
                      <ChevronRight className="size-3.5 opacity-60" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-1.5 pt-0.5">
                {(bioLinks.length ? bioLinks : [{ title: "Featured Project 1", icon: "briefcase", url: "#" }, { title: "Featured Project 2", icon: "briefcase", url: "#" }]).map((l, i) => (
                  <a key={i} href={l.url || "#"} target="_blank" rel="noreferrer" className={btnClass()}>
                    <div className="flex items-center gap-2 truncate"><span className="opacity-80">{getIcon(l.icon)}</span><span className="truncate">{l.title}</span></div>
                    <ChevronRight className="size-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-2 pt-0.5">
                {email && <a href={`mailto:${email}`} className={btnClass()}><div className="flex items-center gap-2"><Mail className="size-4 text-blue-500" /><span>{email}</span></div><ArrowRight className="size-3.5 opacity-60" /></a>}
                {phone && <a href={`tel:${phone}`} className={btnClass()}><div className="flex items-center gap-2"><Phone className="size-4 text-emerald-500" /><span>{phone}</span></div><ArrowRight className="size-3.5 opacity-60" /></a>}
                {renderSocials()}
              </div>
            )}
          </div>
        )}

        {/* 3. PORTFOLIO TEMPLATE */}
        {templateId === "portfolio" && (
          <div className={`w-full flex flex-col ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            <div className="relative h-20 sm:h-24 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs border border-white/20">
              <img src={cover} alt="Cover" className="size-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 flex flex-col justify-between text-left">
                <div className="flex justify-end"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 text-white text-[8px] font-bold"><span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />{status}</span></div>
                <div className="font-extrabold text-xs text-white leading-tight">Ideas. Design.<br />Develop. Repeat.</div>
              </div>
            </div>
            <div className="relative px-3 -mt-6 text-center space-y-1.5">
              <img src={avatar} alt={name} className="size-13 rounded-full object-cover ring-3 ring-white shadow-md mx-auto" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
              <div className="space-y-0.5"><h2 className="font-extrabold text-sm sm:text-base leading-tight">{name}</h2><div className={`text-[10px] font-semibold ${th.subtext}`}>{role || "Full Stack Developer & Creator"}</div></div>
              <div className={`p-2 rounded-xl ${th.badge} text-[9.5px] italic leading-relaxed`}>&ldquo;{bio || "Turning caffeine into code and ideas into reality."}&rdquo;</div>
              {renderSocials("size-6.5")}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-left">
                {(bioLinks.length ? bioLinks : [
                  { title: "My Work", sub: "project showcase", icon: "briefcase", url: "#" },
                  { title: "Blog", sub: "thoughts & tutorials", icon: "file", url: "#" },
                  { title: "Photography", sub: "my visual journal", icon: "camera", url: "#" },
                  { title: "Get in Touch", sub: "let's collaborate", icon: "mail", url: email ? `mailto:${email}` : "#" },
                ]).map((c, i) => (
                  <a key={c.id || i} href={c.title?.toLowerCase().includes("resume") && resume ? resume : c.url || "#"} target="_blank" rel="noreferrer" className={`p-2 rounded-xl border hover:scale-[1.02] shadow-2xs space-y-1 flex flex-col justify-between ${th.card}`}>
                    <div className="size-5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">{getIcon(c.icon)}</div>
                    <div className="min-w-0"><div className="font-bold text-[10px] leading-tight truncate">{c.title}</div><div className={`text-[7.5px] ${th.subtext} truncate`}>{c.sub || "project showcase"}</div></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. MINIMAL TEMPLATE */}
        {templateId === "minimal" && (
          <div className={`w-full flex flex-col text-center ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            <div className="flex items-center justify-between opacity-70 text-xs px-1 select-none"><Menu className="size-3.5" /><Moon className="size-3" /></div>
            <img src={avatar} alt={name} className="size-13 rounded-full object-cover border border-slate-200 mx-auto" onError={(e) => { e.target.src = DEFAULT_AVATAR; }} />
            <div className="space-y-0.5"><h2 className="font-bold text-sm sm:text-base">{name}</h2><p className={`text-[10px] font-medium ${th.subtext}`}>{role || bio || "Developer. Learner. Creator."}</p></div>
            <div className={`w-full divide-y ${theme === "dark" ? "divide-slate-800" : "divide-slate-200/80"} pt-1 text-left`}>
              {(bioLinks.length ? bioLinks : [
                { title: "Home", icon: "home", url: "#" }, { title: "Projects", icon: "briefcase", url: "#" },
                { title: "Blog", icon: "file", url: "#" }, { title: "Resume", icon: "resume", url: resume || "#" },
                { title: "About Me", icon: "user", url: "#" }, { title: "Contact", icon: "mail", url: email ? `mailto:${email}` : "#" },
              ]).map((link, idx) => (
                <a key={link.id || idx} href={link.title?.toLowerCase().includes("resume") && resume ? resume : link.url || "#"} target="_blank" rel="noreferrer" className="w-full py-2 px-1.5 flex items-center justify-between text-xs font-medium hover:opacity-100">
                  <div className="flex items-center gap-2 truncate"><span className="opacity-60">{getIcon(link.icon)}</span><span className="truncate font-semibold">{link.title}</span></div>
                  <ArrowRight className="size-3 opacity-40" />
                </a>
              ))}
            </div>
            {renderSocials("size-6")}
            <div className={`text-[8.5px] italic pt-1 ${th.subtext}`}>&ldquo;Keep building&rdquo;</div>
          </div>
        )}
      </div>

      <div className={`select-none ${isPublic ? "pt-6 pb-2" : "pt-3 pb-1"}`}>
        <a href="/" className={`inline-flex items-center gap-1 font-medium opacity-70 hover:opacity-100 ${th.subtext} text-[9px]`}>
          {templateId === "professional" ? "⚡ LinkHub Business Pro" : templateId === "portfolio" ? "Build Something Amazing ❤️" : "⚡ Powered by LinkHub"}
        </a>
      </div>
    </div>
  );
}
