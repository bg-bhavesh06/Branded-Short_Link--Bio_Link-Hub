import React, { useState } from "react";
import { Globe, Github, FileText, Instagram, Linkedin, Youtube, ArrowRight, ChevronRight, Link2, Mail, Phone, Briefcase, CheckCircle2, Code2, BookOpen, Menu, Moon, MessageCircle, Send } from "lucide-react";

const ICONS = { github: Github, file: FileText, resume: FileText, briefcase: Briefcase, work: Briefcase, mail: Mail, whatsapp: MessageCircle, telegram: Send };
const SOCIAL_META = { github: Github, linkedin: Linkedin, instagram: Instagram, youtube: Youtube, website: Globe, whatsapp: MessageCircle, telegram: Send };
const SOCIAL_COLORS = { linkedin: "text-[#0077b5]", instagram: "text-[#e1306c]", youtube: "text-[#ff0000]", whatsapp: "text-[#25D366]", telegram: "text-[#229ED9]" };

const THEMES = {
  minimal: { container: "bg-[#f8fafc] text-slate-900", card: "bg-white border border-slate-200 text-slate-900 shadow-2xs", outline: "border-2 border-slate-300 bg-transparent text-slate-900", soft: "bg-white border border-slate-200/80 text-slate-900 shadow-xs", ring: "ring-4 ring-white shadow-md", sub: "text-slate-500", badge: "bg-slate-100 text-slate-700 border border-slate-200", social: "bg-white border border-slate-200 text-slate-800 shadow-2xs", proDark: "bg-slate-900 text-white" },
  dark: { container: "bg-[#090d16] text-white", card: "bg-slate-900/90 border border-slate-800 text-white shadow-sm", outline: "border-2 border-slate-700 bg-transparent text-white", soft: "bg-slate-900 border border-slate-800 text-white shadow-sm", ring: "ring-4 ring-slate-800 shadow-md", sub: "text-slate-400", badge: "bg-slate-800 text-slate-300 border border-slate-700", social: "bg-slate-900 border border-slate-800 text-slate-200 shadow-xs", proDark: "bg-slate-950 text-white" },
  gradient: { container: "bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 text-white", card: "bg-white/95 backdrop-blur-md border border-white/30 text-slate-900 shadow-md", outline: "border-2 border-white/60 bg-white/10 backdrop-blur-md text-white", soft: "bg-white/90 backdrop-blur-md border border-white/40 text-slate-900 shadow-md", ring: "ring-4 ring-white/30 shadow-lg", sub: "text-blue-100", badge: "bg-white/20 text-white border border-white/30", social: "bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xs", proDark: "bg-black/30 backdrop-blur-lg text-white" },
};

export function BioCardContent({
  profile = {}, socialLinks = [], bioLinks = [], theme = "minimal", templateId = "creator",
  jobTitle = "", company = "", pronouns = "", coverImage = "", resumeUrl = "",
  statusBadge = "", highlights = [], projectLinks = [], contactMethods = [],
  customization = {}, isPublic = false
}) {
  const [activeTab, setActiveTab] = useState("about");
  const th = THEMES[theme] || THEMES.minimal;
  const btnStyle = customization?.buttonStyle || "rounded";

  const name = profile?.displayName || "Bhavesh Ganwani";
  const user = profile?.username || "bhavesh06";
  const bio = profile?.bio || "";
  const role = jobTitle || profile?.jobTitle || "";
  const comp = company || profile?.company || "";
  const avatar = profile?.avatar || "";
  const cover = coverImage || profile?.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80";
  const resume = resumeUrl || profile?.resumeUrl || "";
  const status = statusBadge || profile?.statusBadge || "Open to work";

  const listHighlights = highlights?.length ? highlights : profile?.highlights?.length ? profile.highlights : [
    { title: role || "MERN Stack Developer", subtitle: "Passionate about building real-world web applications." },
    { title: "Currently Learning", subtitle: "System Design, Distributed Architectures & Cloud." }
  ];

  const email = contactMethods?.find((c) => c.type === "email" && c.value)?.value;
  const phone = contactMethods?.find((c) => c.type === "phone" && c.value)?.value;

  const getIcon = (n, cls = "size-4 shrink-0") => {
    const Comp = ICONS[n?.toLowerCase()] || Globe;
    return <Comp className={cls} />;
  };

  const isLinkDisabled = (u) => !u || u.trim() === "" || u.trim() === "#";
  const formatUrl = (u) => isLinkDisabled(u) ? "#" : /^(https?:\/\/|mailto:|tel:)/i.test(u) ? u : `https://${u}`;

  const allActiveLinks = [
    ...(resume ? [{ id: "resume", title: "Resume / CV", icon: "resume", url: resume }] : [{ id: "resume", title: "Resume / CV", icon: "resume", url: "", isPlaceholder: true }]),
    ...projectLinks.filter((p) => p.title || p.url).map((p, i) => ({ id: `p-${i}`, title: p.title || "Project", icon: "briefcase", url: p.url })),
    ...bioLinks.filter((b) => b.title || b.url).map((b, i) => ({ id: `b-${i}`, title: b.title || "Link", icon: b.icon || "globe", url: b.url })),
  ];
  const displayLinks = allActiveLinks.length ? allActiveLinks : [
    { title: "My Projects", icon: "briefcase", url: "" },
    { title: "Resume / CV", icon: "resume", url: "" },
    { title: "Tech Blog", icon: "file", url: "" },
    { title: "Let's Connect", icon: "globe", url: "" },
  ];

  const btnClass = (disabled = false) => {
    const shape = btnStyle === "rounded" ? "rounded-full" : btnStyle === "outline" ? "rounded-xl" : "rounded-2xl";
    const base = btnStyle === "outline" ? th.outline : btnStyle === "soft-card" ? th.soft : th.card;
    const stateCls = disabled
      ? "opacity-40 blur-[0.45px] pointer-events-none cursor-not-allowed select-none"
      : "transition-all hover:scale-[1.01] cursor-pointer";
    return `w-full flex items-center justify-between font-semibold ${shape} ${base} ${stateCls} ${isPublic ? "px-4.5 py-3.5 text-sm" : "px-3 py-2 text-xs"}`;
  };

  const renderAvatar = (sz = isPublic ? "size-24" : "size-15", textSz = isPublic ? "text-3xl" : "text-xl", ring = th.ring) => avatar ? (
    <img src={avatar} alt={name} className={`rounded-full object-cover ${ring} ${sz}`} />
  ) : (
    <div className={`flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-extrabold ${ring} ${sz} ${textSz}`}>
      {(name || "U").charAt(0).toUpperCase()}
    </div>
  );

  const renderSocials = (sz = "size-7") => {
    const list = socialLinks.length ? socialLinks : [{ platform: "github", url: "" }, { platform: "linkedin", url: "" }, { platform: "instagram", url: "" }, { platform: "youtube", url: "" }, { platform: "x", url: "" }];
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
        {list.map((s, i) => {
          const isX = s.platform?.toLowerCase() === "x" || s.platform?.toLowerCase() === "twitter";
          const Comp = SOCIAL_META[s.platform?.toLowerCase()] || Globe;
          const sDisabled = isLinkDisabled(s.url);
          return (
            <a
              key={i}
              href={sDisabled ? undefined : formatUrl(s.url)}
              target={sDisabled ? undefined : "_blank"}
              rel="noreferrer"
              onClick={sDisabled ? (e) => e.preventDefault() : undefined}
              className={`flex items-center justify-center rounded-xl transition-all ${th.social} ${sz} ${
                sDisabled ? "opacity-35 blur-[0.4px] pointer-events-none cursor-not-allowed" : "hover:scale-105 cursor-pointer"
              }`}
              title={sDisabled ? `${s.platform} (No URL added)` : s.platform}
            >
              {isX ? <span className="font-bold text-xs">𝕏</span> : <Comp className={`size-4 ${sDisabled ? "text-slate-400" : (SOCIAL_COLORS[s.platform?.toLowerCase()] || "")}`} />}
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`w-full min-h-full flex flex-col items-center justify-between transition-colors duration-300 ${th.container} ${isPublic ? "p-6 sm:p-8" : "p-3.5 pt-2 pb-3"}`}>
      <div className="w-full flex items-center justify-between text-xs mb-2 select-none">
        <div className="flex items-center gap-1.5 font-bold">
          <div className="flex size-4 items-center justify-center rounded-md bg-blue-600 text-white"><Link2 className="size-2.5 rotate-45" /></div>
          <span>LinkHub</span>
        </div>
        <div className="flex gap-1 opacity-70"><span className="size-1 rounded-full bg-current" /><span className="size-1 rounded-full bg-current" /><span className="size-1 rounded-full bg-current" /></div>
      </div>

      <div className="w-full flex-1">
        {templateId === "creator" && (
          <div className={`w-full flex flex-col items-center text-center ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            {renderAvatar()}
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 font-extrabold"><h2 className={isPublic ? "text-2xl" : "text-base"}>{name}</h2><CheckCircle2 className="size-4 text-blue-600 fill-blue-600 text-white shrink-0" /></div>
              <p className={`text-xs ${th.sub}`}>@{user} {pronouns && `(${pronouns})`}</p>
            </div>
            <p className={`text-[11px] leading-relaxed max-w-[240px] ${th.sub}`}>{bio || "Code • Build • Learn • Grow\nTurning ideas into real products 🚀"}</p>
            {renderSocials()}
            {(email || phone) && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
                {email && <a href={`mailto:${email}`} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${th.badge}`}><Mail className="size-3 text-blue-600" />{email}</a>}
                {phone && <a href={`tel:${phone}`} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold ${th.badge}`}><Phone className="size-3 text-emerald-600" />{phone}</a>}
              </div>
            )}
            <div className={`w-full ${isPublic ? "space-y-3 pt-2" : "space-y-2 pt-1"}`}>
              {displayLinks.map((link, idx) => {
                const disabled = isLinkDisabled(link.url);
                const targetUrl = formatUrl(link.url);
                const isHighlight = idx === 0 && !disabled && btnStyle !== "outline";
                return (
                  <a
                    key={link.id || idx}
                    href={disabled ? undefined : targetUrl}
                    target={disabled ? undefined : (targetUrl !== "#" ? "_blank" : undefined)}
                    rel="noreferrer"
                    onClick={disabled ? (e) => e.preventDefault() : undefined}
                    className={
                      isHighlight
                        ? `w-full flex items-center justify-between font-bold rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md ${isPublic ? "px-4.5 py-3.5 text-sm" : "px-3 py-2 text-xs"}`
                        : btnClass(disabled)
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="opacity-90">{getIcon(link.icon)}</span>
                      <span className="truncate">{link.title}</span>
                    </div>
                    {disabled ? (
                      <span className="text-[8px] font-semibold opacity-60 uppercase tracking-wider">Unlinked</span>
                    ) : (
                      <ArrowRight className="size-3.5 opacity-70" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {templateId === "professional" && (
          <div className={`w-full flex flex-col text-left ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            <div className={`p-3.5 rounded-2xl ${th.proDark} border border-slate-800 shadow-md space-y-2.5`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <h2 className="font-extrabold text-sm sm:text-base text-white truncate">{name}</h2>
                  <div className="text-[11px] font-semibold text-slate-300">{role || "Software Engineer"}{comp ? ` • ${comp}` : ""}</div>
                  <p className="text-[9.5px] text-slate-400 leading-tight pt-0.5 max-w-[190px]">{bio || "Building scalable web applications with modern technologies."}</p>
                </div>
                <div className="relative shrink-0">
                  {renderAvatar("size-12", "text-base", "ring-2 ring-emerald-500 shadow-md")}
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[7px] font-black text-slate-950 uppercase">{status}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
                {[
                  { label: "GitHub", icon: Github, color: "text-slate-300", url: socialLinks.find((s) => s.platform === "github")?.url || "" },
                  { label: "LinkedIn", icon: Linkedin, color: "text-[#0077b5]", url: socialLinks.find((s) => s.platform === "linkedin")?.url || "" },
                  { label: "X", custom: "𝕏", color: "text-white", url: socialLinks.find((s) => s.platform === "x")?.url || "" },
                  { label: "Email", icon: Mail, color: "text-blue-400", bg: "bg-blue-950/60 border-blue-800/60", url: email ? `mailto:${email}` : "" },
                ].map((item, i) => {
                  const sDisabled = isLinkDisabled(item.url);
                  return (
                    <a
                      key={i}
                      href={sDisabled ? undefined : formatUrl(item.url)}
                      target={sDisabled || item.url.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noreferrer"
                      onClick={sDisabled ? (e) => e.preventDefault() : undefined}
                      className={`py-1.5 px-1 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-0.5 transition-all ${item.bg || ""} ${
                        sDisabled ? "opacity-35 blur-[0.4px] pointer-events-none cursor-not-allowed" : "cursor-pointer hover:scale-105"
                      }`}
                      title={sDisabled ? `${item.label} (No link)` : item.label}
                    >
                      {item.icon ? <item.icon className={`size-3.5 ${sDisabled ? "text-slate-500" : item.color}`} /> : <span className={`text-[9px] font-bold ${sDisabled ? "text-slate-500" : "text-white"}`}>𝕏</span>}
                      <span className="text-[7.5px] text-slate-400 font-semibold">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-slate-200/40 dark:border-slate-800 pb-1 text-xs font-bold px-1">
              {["about", "projects", "contact"].map((t) => (
                <button key={t} type="button" onClick={() => setActiveTab(t)} className={`pb-1 capitalize cursor-pointer transition-all ${activeTab === t ? "text-blue-600 border-b-2 border-blue-600 font-extrabold" : "text-slate-400"}`}>{t}</button>
              ))}
            </div>

            {activeTab === "about" && (
              <div className="space-y-2 pt-0.5">
                <div className="space-y-1.5">
                  {listHighlights.map((h, i) => (
                    <div key={i} className={`p-2.5 rounded-xl ${th.card} flex items-center gap-2.5`}>
                      <div className={`size-7 rounded-lg ${i === 0 ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"} flex items-center justify-center shrink-0`}>
                        {i === 0 ? <Code2 className="size-4" /> : <BookOpen className="size-4" />}
                      </div>
                      <div className="min-w-0"><div className="text-xs font-bold truncate">{h.title}</div><div className={`text-[9.5px] ${th.sub} truncate`}>{h.subtitle}</div></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className={`text-[10px] font-bold uppercase tracking-wider px-1 flex items-center justify-between ${th.sub}`}><span>Featured Links</span><ArrowRight className="size-2.5" /></div>
                  {displayLinks.map((link, idx) => {
                    const disabled = isLinkDisabled(link.url);
                    const targetUrl = formatUrl(link.url);
                    return (
                      <a
                        key={link.id || idx}
                        href={disabled ? undefined : targetUrl}
                        target={disabled ? undefined : (targetUrl !== "#" ? "_blank" : undefined)}
                        rel="noreferrer"
                        onClick={disabled ? (e) => e.preventDefault() : undefined}
                        className={btnClass(disabled)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="opacity-80">{getIcon(link.icon)}</span>
                          <span className="truncate">{link.title}</span>
                        </div>
                        {disabled ? (
                          <span className="text-[8px] font-semibold opacity-50 uppercase">Unlinked</span>
                        ) : (
                          <ChevronRight className="size-3.5 opacity-60" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="space-y-1.5 pt-0.5">
                {(projectLinks.filter((p) => p.title || p.url).length ? projectLinks.filter((p) => p.title || p.url) : displayLinks).map((l, i) => {
                  const disabled = isLinkDisabled(l.url);
                  const targetUrl = formatUrl(l.url);
                  return (
                    <a
                      key={i}
                      href={disabled ? undefined : targetUrl}
                      target={disabled ? undefined : (targetUrl !== "#" ? "_blank" : undefined)}
                      rel="noreferrer"
                      onClick={disabled ? (e) => e.preventDefault() : undefined}
                      className={btnClass(disabled)}
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0">
                        <span className="opacity-80">{getIcon(l.icon || "briefcase")}</span>
                        <span className="truncate font-bold text-xs">{l.title}</span>
                      </div>
                      {disabled ? (
                        <span className="text-[8px] font-semibold opacity-50 uppercase shrink-0">Unlinked</span>
                      ) : (
                        <ChevronRight className="size-3.5 opacity-60 shrink-0" />
                      )}
                    </a>
                  );
                })}
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-2 pt-0.5">
                {email && <a href={`mailto:${email}`} className={btnClass(false)}><div className="flex items-center gap-2"><Mail className="size-4 text-blue-500" /><span>{email}</span></div><ArrowRight className="size-3.5 opacity-60" /></a>}
                {phone && <a href={`tel:${phone}`} className={btnClass(false)}><div className="flex items-center gap-2"><Phone className="size-4 text-emerald-500" /><span>{phone}</span></div><ArrowRight className="size-3.5 opacity-60" /></a>}
                {renderSocials()}
              </div>
            )}
          </div>
        )}

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
              {renderAvatar("size-13 mx-auto", "text-lg", "ring-3 ring-white shadow-md")}
              <div className="space-y-0.5"><h2 className="font-extrabold text-sm sm:text-base leading-tight">{name}</h2><div className={`text-[10px] font-semibold ${th.sub}`}>{role || "Full Stack Developer & Creator"}</div></div>
              <div className={`p-2 rounded-xl ${th.badge} text-[9.5px] italic leading-relaxed`}>&ldquo;{bio || "Turning caffeine into code and ideas into reality."}&rdquo;</div>
              {renderSocials("size-6.5")}
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-left">
                {displayLinks.map((c, i) => {
                  const disabled = isLinkDisabled(c.url);
                  const targetUrl = formatUrl(c.url);
                  return (
                    <a
                      key={c.id || i}
                      href={disabled ? undefined : targetUrl}
                      target={disabled ? undefined : (targetUrl !== "#" ? "_blank" : undefined)}
                      rel="noreferrer"
                      onClick={disabled ? (e) => e.preventDefault() : undefined}
                      className={`p-2 rounded-xl border space-y-1 flex flex-col justify-between ${th.card} ${
                        disabled
                          ? "opacity-40 blur-[0.45px] pointer-events-none cursor-not-allowed select-none"
                          : "hover:scale-[1.02] shadow-2xs cursor-pointer"
                      }`}
                    >
                      <div className="size-5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">{getIcon(c.icon)}</div>
                      <div className="min-w-0">
                        <div className="font-bold text-[10px] leading-tight truncate">{c.title}</div>
                        <div className={`text-[7.5px] ${th.sub} truncate`}>{disabled ? "No link added" : (c.subtitle || "project link")}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {templateId === "minimal" && (
          <div className={`w-full flex flex-col text-center ${isPublic ? "space-y-4" : "space-y-2.5"}`}>
            <div className="flex items-center justify-between opacity-70 text-xs px-1 select-none"><Menu className="size-3.5" /><Moon className="size-3" /></div>
            {renderAvatar("size-13 mx-auto", "text-lg", "border border-slate-200")}
            <div className="space-y-0.5"><h2 className="font-bold text-sm sm:text-base">{name}</h2><p className={`text-[10px] font-medium ${th.sub}`}>{role || bio || "Developer. Learner. Creator."}</p></div>
            <div className={`w-full divide-y ${theme === "dark" ? "divide-slate-800" : "divide-slate-200/80"} pt-1 text-left`}>
              {displayLinks.map((link, idx) => {
                const disabled = isLinkDisabled(link.url);
                const targetUrl = formatUrl(link.url);
                return (
                  <a
                    key={link.id || idx}
                    href={disabled ? undefined : targetUrl}
                    target={disabled ? undefined : (targetUrl !== "#" ? "_blank" : undefined)}
                    rel="noreferrer"
                    onClick={disabled ? (e) => e.preventDefault() : undefined}
                    className={`w-full py-2 px-1.5 flex items-center justify-between text-xs font-medium ${
                      disabled
                        ? "opacity-40 blur-[0.45px] pointer-events-none cursor-not-allowed select-none"
                        : "hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="opacity-60">{getIcon(link.icon)}</span>
                      <span className="truncate font-semibold">{link.title}</span>
                    </div>
                    {disabled ? (
                      <span className="text-[8px] opacity-40 uppercase">Unlinked</span>
                    ) : (
                      <ArrowRight className="size-3 opacity-40" />
                    )}
                  </a>
                );
              })}
            </div>
            {renderSocials("size-6")}
            <div className={`text-[8.5px] italic pt-1 ${th.sub}`}>&ldquo;Keep building&rdquo;</div>
          </div>
        )}
      </div>

      <div className={`select-none ${isPublic ? "pt-6 pb-2" : "pt-3 pb-1"}`}>
        <a href="/" className={`inline-flex items-center gap-1 font-medium opacity-70 hover:opacity-100 ${th.sub} text-[9px]`}>
          {templateId === "professional" ? "⚡ LinkHub Business Pro" : templateId === "portfolio" ? "Build Something Amazing ❤️" : "⚡ Powered by LinkHub"}
        </a>
      </div>
    </div>
  );
}

