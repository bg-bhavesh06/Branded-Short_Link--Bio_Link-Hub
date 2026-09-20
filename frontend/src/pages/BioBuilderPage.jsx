import React, { useState, useEffect, useRef } from "react";
import {
  ExternalLink, Save, Check, Camera, Trash2, Plus, GripVertical, Pencil,
  Share2, Instagram, Github, Linkedin, FileText, Globe, Loader2, AlertCircle,
  Sparkles, Layers, User, Sliders, QrCode, ArrowRight, ArrowLeft, Mail, Phone,
  MapPin, Image as ImageIcon, Tag, Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhonePreview } from "@/components/bio/PhonePreview";
import { TemplateGallery } from "@/components/bio/TemplateGallery";
import { CustomizerPanel } from "@/components/bio/CustomizerPanel";
import { BioShareCard } from "@/components/bio/BioShareCard";
import { AddBioLinkModal } from "@/components/bio/AddBioLinkModal";
import { API_ENDPOINTS } from "@/lib/api";

const API_BIO_ME = `${API_ENDPOINTS.bio}/me`;
const STEPS = [
  { id: "templates", label: "1. Template", icon: Layers },
  { id: "info", label: "2. Information", icon: User },
  { id: "customize", label: "3. Customize", icon: Sliders },
  { id: "share", label: "4. Share & QR", icon: QrCode },
];

// Helper: Compress image to canvas dataUrl
const compressImg = (file, maxW, maxH, cb) => {
  if (!file) return;
  const r = new FileReader();
  r.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      let { width: w, height: h } = img;
      if (w > maxW) { h = Math.round((h * maxW) / w); w = maxW; }
      if (h > maxH) { h = Math.round((h * maxH) / h); h = maxH; }
      c.width = w; c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      cb(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
};

// Reusable Input Field
const Field = ({ label, icon: Icon, value, onChange, placeholder, type = "text", badge, prefix }) => (
  <div className="space-y-1">
    <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
      {Icon && <Icon className="size-3.5 text-blue-600" />}
      <span>{label}</span>
    </label>
    <div className="relative flex items-center">
      {badge && <span className="absolute left-3 size-2 rounded-full bg-emerald-500 animate-pulse" />}
      {prefix && <span className="absolute left-3 text-slate-400 text-xs font-mono select-none">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none ${badge ? "pl-7" : ""} ${prefix ? "pl-14 font-mono" : ""}`}
      />
    </div>
  </div>
);

// Reusable Media Uploader Box
const MediaUploader = ({ label, image, onUpload, onRemove, inputRef, isCircle, hint }) => (
  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2">
    <label className="text-xs font-bold text-slate-700 block">{label}</label>
    <div className="flex items-center gap-3">
      <div className={`relative group shrink-0 size-13 border-2 border-slate-200 bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xs ${isCircle ? "rounded-full" : "rounded-xl"}`}>
        {image ? <img src={image} alt={label} className="size-full object-cover" /> : isCircle ? <span className="text-base font-extrabold text-blue-600">U</span> : <ImageIcon className="size-5 text-slate-400" />}
        <button type="button" onClick={() => inputRef.current?.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"><Camera className="size-4" /></button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} className="h-7 text-xs rounded-lg px-2.5 font-semibold cursor-pointer">Upload</Button>
          {image && <Button type="button" variant="ghost" onClick={onRemove} className="h-7 text-xs text-rose-600 hover:bg-rose-50 px-2 cursor-pointer">Remove</Button>}
        </div>
        <p className="text-[10px] text-slate-400">{hint}</p>
      </div>
    </div>
  </div>
);

export function BioBuilderPage() {
  const fileRef = useRef(null);
  const coverRef = useRef(null);
  const previewColRef = useRef(null);

  const [currentStep, setCurrentStep] = useState("templates");
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState({ displayName: "", username: "", bio: "", avatar: "" });
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [statusBadge, setStatusBadge] = useState("Open to work");
  const [highlights, setHighlights] = useState([
    { title: "MERN Stack Developer", subtitle: "Passionate about building real-world web applications." },
    { title: "Currently Learning", subtitle: "System Design, DevOps and Cloud Technologies." },
  ]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [bioLinks, setBioLinks] = useState([]);
  const [templateId, setTemplateId] = useState("creator");
  const [theme, setTheme] = useState("minimal");
  const [customization, setCustomization] = useState({ buttonStyle: "rounded", layoutVariant: "standard", backgroundStyle: "solid", headerColor: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        const res = await fetch(API_BIO_ME, { credentials: "include" });
        const { success, data } = await res.json();
        if (success && data?.profile) {
          const p = data.profile;
          setProfile({ displayName: p.displayName || "", username: p.username || "", bio: p.bio || "", avatar: p.avatar || "" });
          setJobTitle(p.jobTitle || "");
          setCompany(p.company || "");
          setPronouns(p.pronouns || "");
          setCoverImage(p.coverImage || "");
          setResumeUrl(p.resumeUrl || "");
          setStatusBadge(p.statusBadge || "Open to work");
          if (p.highlights?.length) setHighlights(p.highlights);
          const methods = p.contactMethods || [];
          setContactEmail(methods.find((c) => c.type === "email")?.value || "");
          setContactPhone(methods.find((c) => c.type === "phone")?.value || "");
          setContactLocation(methods.find((c) => c.type === "location")?.value || "");
          setSocialLinks(p.socialLinks || []);
          setBioLinks(p.bioLinks || []);
          setTemplateId(p.templateId || "creator");
          setCustomization(p.customization || { buttonStyle: "rounded" });
          setTheme(p.theme === "Dark Slate" || p.theme === "dark" ? "dark" : p.theme === "Gradient" || p.theme === "gradient" ? "gradient" : "minimal");
          if (p.bioLinks?.length || p.displayName) setCurrentStep("customize");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleSave = async (silent = false) => {
    setErrorMessage("");
    if (!silent) setSuccessMessage("");
    setSaveStatus("saving");
    if (!profile.username || profile.username.trim().length < 3) {
      setErrorMessage("Username must be at least 3 characters.");
      setSaveStatus("idle");
      return false;
    }
    const backendTheme = theme === "dark" ? "Dark Slate" : theme === "gradient" ? "Gradient" : "Minimal Light";
    const contactMethods = [
      ...(contactEmail.trim() ? [{ type: "email", label: "Email", value: contactEmail.trim() }] : []),
      ...(contactPhone.trim() ? [{ type: "phone", label: "Phone", value: contactPhone.trim() }] : []),
      ...(contactLocation.trim() ? [{ type: "location", label: "Location", value: contactLocation.trim() }] : []),
    ];
    try {
      const res = await fetch(API_BIO_ME, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName: profile.displayName.trim(),
          username: profile.username.trim().toLowerCase(),
          bio: profile.bio.trim(),
          avatar: profile.avatar,
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          pronouns: pronouns.trim(),
          coverImage,
          resumeUrl: resumeUrl.trim(),
          statusBadge: statusBadge.trim(),
          highlights,
          contactMethods,
          socialLinks,
          bioLinks: bioLinks.map((l) => ({ title: l.title, url: l.url })),
          theme: backendTheme,
          templateId,
          customization,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to save profile");
        setSaveStatus("idle");
        return false;
      }
      setSaveStatus("saved");
      if (!silent) {
        setSuccessMessage("Bio profile published successfully! 🚀");
        setTimeout(() => setSaveStatus("idle"), 2500);
      }
      return true;
    } catch {
      setErrorMessage("Network error saving profile.");
      setSaveStatus("idle");
      return false;
    }
  };

  if (initialLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold">Loading Bio Studio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Studio Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Link-in-Bio Studio</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">{templateId}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Design, customize, and publish your branded Bio page with live preview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open(`/bio/${profile.username || "me"}`, "_blank")} className="rounded-xl border-slate-200 text-xs font-semibold flex items-center gap-1.5 h-8.5 px-3 cursor-pointer">
            <ExternalLink className="size-3.5" /><span>View Public Bio</span>
          </Button>
          <Button onClick={() => handleSave(false)} disabled={saveStatus === "saving"} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3.5 py-1.5 font-semibold text-xs flex items-center gap-1.5 min-w-[110px] justify-center h-8.5 cursor-pointer">
            {saveStatus === "saving" ? <><Loader2 className="size-3.5 animate-spin" /><span>Saving...</span></> : saveStatus === "saved" ? <><Check className="size-3.5 stroke-[2.5]" /><span>✓ Saved</span></> : <><Save className="size-3.5" /><span>Save Changes</span></>}
          </Button>
        </div>
      </div>

      {errorMessage && <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium"><AlertCircle className="size-4 shrink-0" /><span>{errorMessage}</span></div>}
      {successMessage && <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium"><Check className="size-4 shrink-0 stroke-[3]" /><span>{successMessage}</span><a href={`/bio/${profile.username}`} target="_blank" rel="noreferrer" className="ml-auto underline font-bold">/bio/{profile.username}</a></div>}

      {/* 2-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-1">
        {/* Left Column: Stepper & Active Tab Editor */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/90 rounded-2xl p-1.5 overflow-x-auto gap-1">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} type="button" onClick={() => setCurrentStep(s.id)} className={`flex-1 min-w-[95px] sm:min-w-[105px] py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${currentStep === s.id ? "bg-white text-blue-600 shadow-xs border border-slate-200/80" : "text-slate-500 hover:text-slate-900"}`}>
                  <Icon className="size-3.5 shrink-0" /><span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* STEP 1: TEMPLATES */}
          {currentStep === "templates" && (
            <div className="space-y-4">
              <TemplateGallery selectedTemplate={templateId} onSelectTemplate={setTemplateId} onProceed={(id) => { setTemplateId(id); setCurrentStep("info"); }} />
              <div className="flex justify-end pt-2">
                <Button type="button" onClick={() => setCurrentStep("info")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 text-xs font-semibold flex items-center gap-1.5">
                  <span>Continue to Information</span><ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: INFORMATION */}
          {currentStep === "info" && (
            <div className="space-y-4">
              {/* Profile Media & Identity */}
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Profile Identity & Media</h3>
                  <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 uppercase">{templateId} Layout</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-0.5">
                  <MediaUploader label="Avatar Photo" image={profile.avatar} inputRef={fileRef} isCircle hint="1:1 Square (JPG, PNG)" onUpload={(e) => compressImg(e.target.files?.[0], 400, 400, (av) => setProfile((p) => ({ ...p, avatar: av })))} onRemove={() => setProfile((p) => ({ ...p, avatar: "" }))} />
                  <MediaUploader label="Cover / Hero Banner" image={coverImage} inputRef={coverRef} hint="Hero banner for Portfolio" onUpload={(e) => compressImg(e.target.files?.[0], 800, 400, (cv) => setCoverImage(cv))} onRemove={() => setCoverImage("")} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <Field label="Display Name" value={profile.displayName} onChange={(v) => setProfile((p) => ({ ...p, displayName: v }))} placeholder="Your Name / Brand" />
                  <Field label="Username / Slug" prefix="/bio/" value={profile.username} onChange={(v) => setProfile((p) => ({ ...p, username: v.toLowerCase().replace(/\s+/g, "-") }))} placeholder="username" />
                  <Field label="Job Title / Role" value={jobTitle} onChange={setJobTitle} placeholder="e.g. Full Stack Developer" />
                  <Field label="Company / Brand" value={company} onChange={setCompany} placeholder="e.g. LinkHub Inc." />
                  <div className="sm:col-span-2 space-y-1">
                    <div className="flex items-center justify-between"><label className="text-xs font-semibold text-slate-700">Bio Description / Tagline</label><span className="text-[10px] text-slate-400">{profile.bio.length}/300</span></div>
                    <textarea rows={2} maxLength={300} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} placeholder="Turning ideas into real products 🚀..." className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none resize-none" />
                  </div>
                </div>
              </Card>

              {/* Resume & Career Status */}
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
                <div><h3 className="font-bold text-slate-900 text-sm">Resume & Career Status</h3><p className="text-[11px] text-slate-500">Configure your Resume URL and status badge tag shown across templates.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                  <Field label="Resume / CV Link URL" icon={FileText} value={resumeUrl} onChange={setResumeUrl} placeholder="https://drive.google.com/resume.pdf" type="url" />
                  <Field label="Status Tag / Badge" icon={Tag} badge value={statusBadge} onChange={setStatusBadge} placeholder="Open to work / Available" />
                </div>
              </Card>

              {/* Highlights */}
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-slate-900 text-sm">Skills & Career Highlights</h3><p className="text-[11px] text-slate-500">Showcase skill cards or focus areas.</p></div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setHighlights((h) => [...h, { title: "New Skill", subtitle: "Description" }])} className="h-7 text-xs rounded-lg px-2.5 font-semibold cursor-pointer"><Plus className="size-3 mr-1" />Add Highlight</Button>
                </div>
                <div className="space-y-2.5 pt-0.5">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70">
                      <div className="size-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5"><Code2 className="size-3.5" /></div>
                      <div className="flex-1 space-y-1.5">
                        <input type="text" value={h.title} onChange={(e) => setHighlights((prev) => { const u = [...prev]; u[i] = { ...u[i], title: e.target.value }; return u; })} placeholder="Title" className="w-full bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600" />
                        <input type="text" value={h.subtitle} onChange={(e) => setHighlights((prev) => { const u = [...prev]; u[i] = { ...u[i], subtitle: e.target.value }; return u; })} placeholder="Subtitle" className="w-full bg-white rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 focus:outline-none focus:border-blue-600" />
                      </div>
                      <button type="button" onClick={() => setHighlights((prev) => prev.filter((_, idx) => idx !== i))} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer mt-1"><Trash2 className="size-3.5" /></button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Contact Methods */}
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
                <div><h3 className="font-bold text-slate-900 text-sm">Direct Contact Methods</h3><p className="text-[11px] text-slate-500">Allow visitors to reach you directly.</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                  <Field label="Direct Email" icon={Mail} value={contactEmail} onChange={setContactEmail} placeholder="you@company.com" type="email" />
                  <Field label="Phone / WhatsApp" icon={Phone} value={contactPhone} onChange={setContactPhone} placeholder="+1 (555) 000-0000" type="tel" />
                  <Field label="Location" icon={MapPin} value={contactLocation} onChange={setContactLocation} placeholder="e.g. San Francisco, CA" />
                  <Field label="Pronouns" icon={User} value={pronouns} onChange={setPronouns} placeholder="e.g. he/him or she/her" />
                </div>
              </Card>

              {/* Social Profiles */}
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-slate-900 text-sm">Social Profiles</h3><p className="text-[11px] text-slate-500">Connect your profiles and channels.</p></div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setSocialLinks((s) => [...s, { platform: "github", url: "https://" }])} className="h-7 text-xs rounded-lg px-2.5 font-semibold cursor-pointer"><Plus className="size-3 mr-1" />Add Social</Button>
                </div>
                <div className="space-y-2 pt-0.5">
                  {socialLinks.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-100 bg-slate-50/70">
                      <select value={item.platform} onChange={(e) => setSocialLinks((prev) => { const u = [...prev]; u[i] = { ...u[i], platform: e.target.value }; return u; })} className="bg-transparent text-xs font-semibold text-slate-800 capitalize cursor-pointer shrink-0">
                        <option value="github">GitHub</option><option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option><option value="x">X (Twitter)</option><option value="youtube">YouTube</option><option value="website">Website</option>
                      </select>
                      <input type="url" value={item.url} onChange={(e) => setSocialLinks((prev) => { const u = [...prev]; u[i] = { ...u[i], url: e.target.value }; return u; })} placeholder="https://" className="flex-1 min-w-0 bg-transparent text-xs font-mono text-slate-700 focus:outline-none" />
                      <button type="button" onClick={() => setSocialLinks((prev) => prev.filter((_, idx) => idx !== i))} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="size-3.5" /></button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Bio Links & Projects */}
              <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div><h3 className="font-bold text-slate-900 text-sm">Bio Links & Projects</h3><p className="text-[11px] text-slate-500">Add destinations, project showcases, or shops.</p></div>
                  <Button type="button" size="sm" onClick={() => { setEditingLink(null); setModalOpen(true); }} className="h-7 text-xs rounded-lg px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"><Plus className="size-3 mr-1" />Add Link</Button>
                </div>
                {!bioLinks.length ? (
                  <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">No custom links added yet. Click &quot;Add Link&quot; above to create your first card.</div>
                ) : (
                  <div className="space-y-1.5 pt-0.5">
                    {bioLinks.map((link, i) => (
                      <div key={link.id || i} className="flex items-center justify-between p-2 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <GripVertical className="size-3.5 text-slate-300 shrink-0 cursor-grab" />
                          <div className="min-w-0"><div className="font-semibold text-xs text-slate-900 truncate">{link.title}</div><div className="text-[10px] text-slate-400 font-mono truncate max-w-[220px]">{link.url}</div></div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button type="button" onClick={() => { setEditingLink({ ...link, index: i }); setModalOpen(true); }} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><Pencil className="size-3.5" /></button>
                          <button type="button" onClick={() => setBioLinks((b) => b.filter((_, idx) => idx !== i))} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="size-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("templates")} className="rounded-xl text-xs font-semibold flex items-center gap-1.5"><ArrowLeft className="size-3.5" /><span>Templates</span></Button>
                <Button type="button" onClick={() => setCurrentStep("customize")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 text-xs font-semibold flex items-center gap-1.5 shadow-xs"><span>Customize Design</span><ArrowRight className="size-3.5" /></Button>
              </div>
            </div>
          )}

          {/* STEP 3: CUSTOMIZE */}
          {currentStep === "customize" && (
            <div className="space-y-4">
              <CustomizerPanel templateId={templateId} onSelectTemplate={setTemplateId} theme={theme} onSelectTheme={setTheme} customization={customization} onChangeCustomization={setCustomization} />
              <div className="flex items-center justify-between pt-2">
                <Button type="button" variant="outline" onClick={() => setCurrentStep("info")} className="rounded-xl text-xs font-semibold flex items-center gap-1.5"><ArrowLeft className="size-3.5" /><span>Information</span></Button>
                <Button type="button" onClick={async () => { if (await handleSave(false)) setCurrentStep("share"); }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 text-xs font-semibold flex items-center gap-1.5 shadow-xs"><Sparkles className="size-3.5" /><span>Publish & Share</span><ArrowRight className="size-3.5" /></Button>
              </div>
            </div>
          )}

          {/* STEP 4: SHARE */}
          {currentStep === "share" && (
            <div className="space-y-4">
              <BioShareCard username={profile.username || "me"} onEditAgain={() => setCurrentStep("customize")} />
            </div>
          )}
        </div>

        {/* Right Column: Sticky Live Preview */}
        <div ref={previewColRef} className="lg:col-span-5 flex flex-col items-center justify-start lg:sticky lg:top-20">
          <PhonePreview
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
            contactMethods={[
              ...(contactEmail.trim() ? [{ type: "email", label: "Email", value: contactEmail.trim() }] : []),
              ...(contactPhone.trim() ? [{ type: "phone", label: "Phone", value: contactPhone.trim() }] : []),
              ...(contactLocation.trim() ? [{ type: "location", label: "Location", value: contactLocation.trim() }] : []),
            ]}
            customization={customization}
          />
        </div>
      </div>

      {modalOpen && (
        <AddBioLinkModal
          isOpen={modalOpen}
          editingLink={editingLink}
          onClose={() => { setModalOpen(false); setEditingLink(null); }}
          onSave={(data) => {
            if (editingLink) {
              setBioLinks((prev) => prev.map((l, i) => (i === editingLink.index ? data : l)));
            } else {
              setBioLinks((prev) => [...prev, { ...data, id: Date.now().toString() }]);
            }
            setEditingLink(null);
          }}
        />
      )}
    </div>
  );
}

