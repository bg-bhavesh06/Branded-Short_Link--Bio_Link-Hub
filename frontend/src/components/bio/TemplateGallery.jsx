import React from "react";
import {
  Check,
  Sparkles,
  LayoutGrid,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  Mail,
  FileText,
  Briefcase,
  Code2,
  BookOpen,
  Camera,
  Menu,
  Moon,
  Home,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const TEMPLATES_DATA = [
  {
    id: "creator",
    name: "Creator",
    badge: "Most Popular",
    badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    description: "Clean, modern and centered layout. Perfect for creators, students and influencers.",
    tags: ["Centered profile", "Social icons", "Stacked links"],
  },
  {
    id: "professional",
    name: "Professional",
    badge: "Business Ready",
    badgeColor: "bg-sky-100 text-sky-700 border-sky-200",
    description: "Structured and elegant layout for professionals, businesses and job seekers.",
    tags: ["Header + profile", "Tabs/sections", "Professional cards"],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    badge: "Creative",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description: "A visually rich layout to showcase your work, projects and creative content.",
    tags: ["Hero section", "Grid layout", "Visual design"],
  },
  {
    id: "minimal",
    name: "Minimal",
    badge: "Clean",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    description: "A minimal and modern layout with a clean look. Perfect for personal branding.",
    tags: ["Minimal design", "Side/center menu", "Elegant look"],
  },
];

const AVATARS = {
  creator: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  pro: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&auto=format&fit=crop&q=80",
};

// 1. Creator Phone Mockup
function CreatorMockup() {
  const links = [
    { title: "My Projects", icon: "🚀", highlight: true },
    { title: "Resume", icon: "📄" },
    { title: "Tech Blog", icon: "📝" },
    { title: "Buy Me a Coffee", icon: "☕" },
    { title: "Let's Connect", icon: "💬" },
  ];

  return (
    <div className="size-full bg-white flex flex-col justify-between p-3.5 pt-6 relative text-slate-800">
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-purple-200/80 via-indigo-100/40 to-transparent pointer-events-none" />
      <div className="relative z-10 space-y-2 text-center">
        <img src={AVATARS.creator} alt="Bhavesh" className="size-13 rounded-full object-cover ring-3 ring-white shadow-md mx-auto" />
        <div className="space-y-0.5">
          <div className="flex items-center justify-center gap-1 font-extrabold text-xs text-slate-900">
            <span>Bhavesh Ganwani</span>
            <CheckCircle2 className="size-3 text-blue-600 fill-blue-600 text-white" />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">@bhavesh06</div>
          <div className="text-[9px] text-slate-500 font-medium pt-0.5 leading-tight">
            Code • Build • Learn • Grow <br />
            <span className="text-[8px] opacity-80">Turning ideas into real products 🚀</span>
          </div>
        </div>

        {/* Socials */}
        <div className="flex items-center justify-center gap-1.5 pt-0.5">
          {[
            { icon: Github, bg: "bg-slate-900" },
            { icon: Linkedin, bg: "bg-[#0077b5]" },
            { icon: Instagram, bg: "bg-[#e1306c]" },
            { icon: Youtube, bg: "bg-[#ff0000]" },
          ].map(({ icon: Icon, bg }, i) => (
            <div key={i} className={`size-5 rounded-lg ${bg} text-white flex items-center justify-center shadow-2xs`}>
              <Icon className="size-2.5" />
            </div>
          ))}
          <div className="size-5 rounded-lg bg-black text-white flex items-center justify-center shadow-2xs text-[8px] font-bold font-sans">𝕏</div>
        </div>

        {/* Links */}
        <div className="space-y-1.5 pt-0.5 text-left">
          {links.map((link, i) => (
            <div
              key={i}
              className={`w-full py-1.5 px-2.5 rounded-xl font-semibold text-[9px] flex items-center justify-between ${
                link.highlight
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold shadow-xs"
                  : "bg-white border border-slate-200/90 text-slate-800 shadow-2xs"
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span>{link.icon}</span>
                <span className="truncate">{link.title}</span>
              </div>
              <ArrowRight className="size-2.5 opacity-50 shrink-0" />
            </div>
          ))}
        </div>
      </div>
      <div className="text-[7.5px] text-center text-slate-400 font-semibold pt-1">⚡ Built with LinkHub</div>
    </div>
  );
}

// 2. Professional Phone Mockup
function ProfessionalMockup() {
  return (
    <div className="size-full bg-[#0c1017] text-white flex flex-col justify-between p-3.5 pt-5.5 relative">
      <div className="absolute top-0 right-0 size-28 bg-emerald-500/10 blur-xl pointer-events-none" />
      <div className="relative z-10 space-y-2 text-left">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-800">
          <div className="space-y-0.5">
            <div className="font-extrabold text-xs text-white leading-tight">Bhavesh Ganwani</div>
            <div className="text-[9px] font-semibold text-slate-400">Software Engineer</div>
            <div className="text-[7.5px] text-slate-400 leading-tight pt-0.5 max-w-[130px]">
              Building scalable web applications with modern technologies.
            </div>
          </div>
          <div className="relative shrink-0 text-center">
            <img src={AVATARS.pro} alt="Bhavesh" className="size-11 rounded-full object-cover ring-2 ring-emerald-500 shadow-md" />
            <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-full bg-emerald-500 text-[6px] font-extrabold text-slate-950 uppercase">
              Open to work
            </div>
          </div>
        </div>

        {/* Contact actions */}
        <div className="grid grid-cols-4 gap-1 pt-0.5 text-center">
          {[
            { icon: Github, label: "GitHub", text: "text-slate-300" },
            { icon: Linkedin, label: "LinkedIn", text: "text-[#0077b5]" },
            { custom: "𝕏", label: "X", text: "text-white" },
            { icon: Mail, label: "Email", text: "text-blue-400", bg: "bg-blue-950/60 border-blue-800/60" },
          ].map((item, i) => (
            <div key={i} className={`py-1 rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center gap-0.5 ${item.bg || ""}`}>
              {item.icon ? <item.icon className={`size-2.5 ${item.text}`} /> : <span className="text-[7.5px] font-bold font-sans">𝕏</span>}
              <span className="text-[6.5px] text-slate-400 font-semibold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-1 text-[8px] font-bold text-slate-400">
          <span className="text-white border-b-2 border-blue-500 pb-0.5">About</span>
          <span>Projects</span>
          <span>Contact</span>
        </div>

        {/* Highlights */}
        <div className="space-y-1">
          <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
            <div className="size-5 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Code2 className="size-3" />
            </div>
            <div className="min-w-0">
              <div className="text-[8.5px] font-bold text-white truncate">MERN Stack Developer</div>
              <div className="text-[7px] text-slate-400 truncate">Passionate about real-world apps.</div>
            </div>
          </div>
          <div className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
            <div className="size-5 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="size-3" />
            </div>
            <div className="min-w-0">
              <div className="text-[8.5px] font-bold text-white truncate">Currently Learning</div>
              <div className="text-[7px] text-slate-400 truncate">System Design & Cloud.</div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-1 pt-0.5">
          <div className="text-[7.5px] font-bold text-slate-400 uppercase flex items-center justify-between">
            <span>Featured Links</span>
            <ArrowRight className="size-2" />
          </div>
          {["📄 View My Resume", "💼 Explore My Projects"].map((t, i) => (
            <div key={i} className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[8px] font-semibold text-white flex items-center justify-between">
              <span className="truncate">{t}</span>
              <ArrowRight className="size-2 text-slate-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
      <div className="text-[7.5px] text-center text-slate-500 font-semibold pt-1">⚡ LinkHub Business Pro</div>
    </div>
  );
}

// 3. Portfolio Phone Mockup
function PortfolioMockup() {
  const cards = [
    { title: "My Work", sub: "project showcase", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
    { title: "Blog", sub: "thoughts & tutorials", icon: FileText, color: "bg-emerald-50 text-emerald-600" },
    { title: "Photography", sub: "my visual journal", icon: Camera, color: "bg-purple-50 text-purple-600" },
    { title: "Get in Touch", sub: "let's collaborate", icon: Mail, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="size-full bg-[#fdfbf7] flex flex-col justify-between text-slate-900 relative">
      <div>
        <div className="relative h-26 w-full overflow-hidden bg-slate-900">
          <img src={AVATARS.cover} alt="Cover" className="size-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 flex flex-col justify-end text-left">
            <div className="font-extrabold text-[10px] text-white leading-tight">Ideas. Design.<br />Develop. Repeat.</div>
          </div>
        </div>

        <div className="relative px-3 -mt-5 text-center space-y-1.5">
          <img src={AVATARS.creator} alt="Bhavesh" className="size-11 rounded-full object-cover ring-3 ring-[#fdfbf7] shadow-md mx-auto" />
          <div className="space-y-0.5">
            <div className="font-extrabold text-xs text-slate-900">Bhavesh Ganwani</div>
            <div className="text-[8.5px] font-semibold text-slate-500">Full Stack Developer & Creator</div>
          </div>
          <div className="p-1.5 rounded-xl bg-white border border-amber-200/60 shadow-2xs text-[7.5px] italic text-slate-600">
            &ldquo;Turning caffeine into code and ideas into reality.&rdquo;
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-0.5 text-slate-600">
            <Github className="size-2.5" /><Linkedin className="size-2.5 text-[#0077b5]" /><Instagram className="size-2.5 text-[#e1306c]" /><Youtube className="size-2.5 text-[#ff0000]" /><Globe className="size-2.5" />
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1 text-left">
            {cards.map((c, i) => (
              <div key={i} className="p-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-0.5">
                <div className={`size-4 rounded-md ${c.color} flex items-center justify-center`}>
                  <c.icon className="size-2.5" />
                </div>
                <div className="font-bold text-[8px] text-slate-900">{c.title}</div>
                <div className="text-[6.5px] text-slate-400">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="text-[7.5px] text-center text-slate-500 font-semibold p-2">Build Something Amazing ❤️</div>
    </div>
  );
}

// 4. Minimal Phone Mockup
function MinimalMockup() {
  const links = [
    { title: "Home", icon: Home },
    { title: "Projects", icon: Briefcase },
    { title: "Blog", icon: FileText },
    { title: "Resume", icon: Code2 },
    { title: "About Me", icon: User },
    { title: "Contact", icon: Mail },
  ];

  return (
    <div className="size-full bg-[#fafafa] flex flex-col justify-between p-3.5 pt-5.5 relative text-slate-800">
      <div className="flex items-center justify-between pb-1">
        <Menu className="size-3 text-slate-700" />
        <Moon className="size-2.5 text-slate-500" />
      </div>

      <div className="space-y-2 text-center">
        <img src={AVATARS.pro} alt="Bhavesh" className="size-11 rounded-full object-cover border border-slate-200 shadow-2xs mx-auto" />
        <div className="space-y-0.5">
          <div className="font-bold text-xs text-slate-900">Bhavesh Ganwani</div>
          <div className="text-[8px] text-slate-400 font-medium">Developer. Learner. Creator.</div>
        </div>

        <div className="space-y-1 pt-1 text-left">
          {links.map((link, i) => (
            <div key={i} className="py-1 px-1.5 border-b border-slate-200/70 last:border-0 flex items-center justify-between text-[8px] font-medium text-slate-700">
              <div className="flex items-center gap-1.5">
                <link.icon className="size-2.5 text-slate-400" />
                <span>{link.title}</span>
              </div>
              <ArrowRight className="size-2 text-slate-400" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 text-slate-600">
          <Github className="size-2.5" /><Linkedin className="size-2.5" /><Instagram className="size-2.5" /><Youtube className="size-2.5" /><span className="text-[7.5px] font-bold font-sans">𝕏</span><Globe className="size-2.5" />
        </div>
      </div>

      <div className="text-[7.5px] text-center text-slate-400 italic pt-1">&ldquo;Keep building&rdquo;</div>
    </div>
  );
}

export function TemplateGallery({
  selectedTemplate = "creator",
  onSelectTemplate,
  onProceed,
}) {
  return (
    <div className="space-y-3.5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs">
              <LayoutGrid className="size-4" />
            </div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900">
              Select Template
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Pick a layout style. Your live preview updates instantly.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10.5px] font-bold self-start sm:self-auto">
          <Sparkles className="size-3" />
          <span>4 Modern Layouts</span>
        </div>
      </div>

      {/* 2-Column Responsive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
        {TEMPLATES_DATA.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id;

          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`group relative rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden bg-white shadow-xs hover:shadow-lg ${
                isSelected
                  ? "border-blue-600 ring-3 ring-blue-600/15 shadow-md scale-[1.01]"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 z-20 size-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-200">
                  <Check className="size-3.5 stroke-[3]" />
                </div>
              )}

              {/* Phone Mockup Frame (Compact) */}
              <div className="p-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-center min-h-[290px]">
                <div className="relative w-full max-w-[200px] rounded-[26px] border-[5px] border-slate-900 bg-slate-900 shadow-xl overflow-hidden ring-1 ring-slate-800/80">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 h-2 w-12 bg-slate-900 rounded-full flex items-center justify-center gap-1">
                    <span className="size-1 rounded-full bg-slate-700" />
                    <span className="size-1 rounded-full bg-blue-900 ring-1 ring-blue-400/30" />
                  </div>

                  <div className="h-[260px] overflow-hidden select-none relative flex flex-col justify-between scale-[0.88] origin-top">
                    {tmpl.id === "creator" && <CreatorMockup />}
                    {tmpl.id === "professional" && <ProfessionalMockup />}
                    {tmpl.id === "portfolio" && <PortfolioMockup />}
                    {tmpl.id === "minimal" && <MinimalMockup />}
                  </div>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2 bg-white">
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm">{tmpl.name}</h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-tight line-clamp-2">{tmpl.description}</p>
                </div>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(tmpl.id);
                    if (onProceed) onProceed(tmpl.id);
                  }}
                  className={`w-full rounded-xl text-xs font-bold h-8 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <span>{isSelected ? "Selected" : "Use Template"}</span>
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
