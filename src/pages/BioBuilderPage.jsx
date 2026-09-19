import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  Save,
  Check,
  Camera,
  Trash2,
  Plus,
  GripVertical,
  Pencil,
  Share2,
  X,
  Instagram,
  Github,
  Linkedin,
  FileText,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhonePreview } from "@/components/bio/PhonePreview";
import { ThemeSelector } from "@/components/bio/ThemeSelector";
import { AddBioLinkModal } from "@/components/bio/AddBioLinkModal";

const API_BIO_ME = "http://localhost:5000/api/v1/bio/me";

export function BioBuilderPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const rightColumnRef = useRef(null);

  // Wheel isolation on phone preview
  useEffect(() => {
    const el = rightColumnRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const phoneScreen = el.querySelector(".phone-screen-scroll");
      if (phoneScreen && phoneScreen.contains(e.target)) {
        const canScrollUp = phoneScreen.scrollTop > 0;
        const canScrollDown =
          phoneScreen.scrollTop + phoneScreen.clientHeight < phoneScreen.scrollHeight - 1;

        if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Loading & Error States
  const [initialLoading, setInitialLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Profile State
  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    bio: "",
    avatar: "",
  });

  // Social Links State
  const [socialLinks, setSocialLinks] = useState([]);

  // Bio Links State
  const [bioLinks, setBioLinks] = useState([]);

  // Theme State (minimal, dark, gradient)
  const [theme, setTheme] = useState("minimal");

  // Modal State for adding/editing bio links
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // Fetch initial profile from backend on mount
  useEffect(() => {
    const loadBioProfile = async () => {
      try {
        setInitialLoading(true);
        const res = await fetch(API_BIO_ME, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.data?.profile) {
          const p = data.data.profile;
          setProfile({
            displayName: p.displayName || "",
            username: p.username || "",
            bio: p.bio || "",
            avatar: p.avatar || "",
          });
          setSocialLinks(p.socialLinks || []);
          setBioLinks(p.bioLinks || []);

          if (p.theme === "Dark Slate" || p.theme === "dark") {
            setTheme("dark");
          } else if (p.theme === "Gradient" || p.theme === "gradient") {
            setTheme("gradient");
          } else {
            setTheme("minimal");
          }
        }
      } catch (err) {
        console.error("Failed to fetch bio profile:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    loadBioProfile();
  }, []);

  // Avatar Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarRemove = () => {
    setProfile((prev) => ({ ...prev, avatar: "" }));
  };

  // Save changes to MongoDB
  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setSaveStatus("saving");

    const backendTheme =
      theme === "dark" ? "Dark Slate" : theme === "gradient" ? "Gradient" : "Minimal Light";

    try {
      const res = await fetch(API_BIO_ME, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          displayName: profile.displayName.trim(),
          username: profile.username.trim(),
          bio: profile.bio.trim(),
          avatar: profile.avatar,
          socialLinks,
          bioLinks: bioLinks.map((l) => ({ title: l.title, url: l.url })),
          theme: backendTheme,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Failed to save bio profile");
        setSaveStatus("idle");
        return;
      }

      setSaveStatus("saved");
      setSuccessMessage("Bio profile published successfully!");
      setTimeout(() => setSaveStatus("idle"), 2500);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setErrorMessage("Network error while saving bio profile. Please try again.");
      setSaveStatus("idle");
    }
  };

  // Social link helpers
  const handleUpdateSocialUrl = (index, url) => {
    setSocialLinks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], url };
      return updated;
    });
  };

  const handleRemoveSocial = (index) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSocialLink = () => {
    const platforms = ["github", "instagram", "linkedin", "x", "youtube", "website"];
    const unused = platforms.find((p) => !socialLinks.some((s) => s.platform === p)) || "website";
    setSocialLinks((prev) => [...prev, { platform: unused, url: "https://" }]);
  };

  // Bio link helpers
  const handleSaveBioLink = (linkData) => {
    if (editingLink) {
      setBioLinks((prev) =>
        prev.map((l, index) => (l.id === linkData.id || index === editingLink.index ? linkData : l))
      );
    } else {
      setBioLinks((prev) => [...prev, { ...linkData, id: Date.now().toString() }]);
    }
    setEditingLink(null);
  };

  const handleDeleteBioLink = (idOrIndex) => {
    setBioLinks((prev) => prev.filter((l, i) => l.id !== idOrIndex && i !== idOrIndex));
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return <Instagram className="size-4 text-[#e1306c]" />;
      case "github":
        return <Github className="size-4 text-slate-900" />;
      case "linkedin":
        return <Linkedin className="size-4 text-[#0077b5]" />;
      case "x":
      case "twitter":
        return <span className="font-bold text-xs font-sans">𝕏</span>;
      default:
        return <Share2 className="size-4 text-slate-600" />;
    }
  };

  if (initialLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold">Loading your Bio Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
            Bio Builder
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create your Link-in-Bio page and share everything in one place.
          </p>
        </div>

        {/* Top-Right Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={() => window.open(`/bio/${profile.username || "me"}`, "_blank")}
            className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs h-8 px-3 cursor-pointer"
          >
            <ExternalLink className="size-3.5" />
            <span>View Live Page</span>
          </Button>

          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-1.5 font-semibold text-xs shadow-xs flex items-center gap-1.5 min-w-[115px] justify-center transition-all h-8 cursor-pointer"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="size-3.5 text-white stroke-[2.5]" />
                <span>✓ Saved</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
          <AlertCircle className="size-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-medium">
          <Check className="size-4 shrink-0 text-emerald-600 stroke-[3]" />
          <span>{successMessage}</span>
          <a
            href={`/bio/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto underline font-bold hover:text-emerald-900"
          >
            /bio/{profile.username}
          </a>
        </div>
      )}

      {/* 2. TWO-COLUMN BUILDER WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 xl:gap-4 items-start pt-1">
        {/* LEFT COLUMN: Profile & Content Customization Forms */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3">
          {/* Card 1: Profile Details */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Profile Details</h3>

            {/* Avatar Row */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="size-13 rounded-full border-2 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-extrabold text-blue-600">
                      {profile.displayName?.charAt(0) || "U"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                >
                  <Camera className="size-4" />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-7 text-xs rounded-lg px-2 py-0.5 border-slate-200 font-semibold cursor-pointer"
                  >
                    Upload Avatar
                  </Button>
                  {profile.avatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleAvatarRemove}
                      className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 cursor-pointer"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">
                  JPG, PNG or WebP. 1:1 square recommended.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="space-y-0.5">
                <label className="text-[11px] font-semibold text-slate-700">Display Name</label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[11px] font-semibold text-slate-700">Username / Slug</label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 text-xs font-mono select-none">
                    linkhub.dev/bio/
                  </span>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        username: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }))
                    }
                    placeholder="username"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-[110px] pr-2.5 py-1.5 text-xs font-mono text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-0.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-700">Bio Description</label>
                  <span className="text-[10px] text-slate-400">{profile.bio.length}/300</span>
                </div>
                <textarea
                  rows={2}
                  maxLength={300}
                  value={profile.bio}
                  onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell visitors who you are and what you do..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 p-2 text-xs text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Card 2: Social Links */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Social Profiles</h3>
                <p className="text-[11px] text-slate-500">Show social buttons on your bio page.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSocialLink}
                className="h-7 text-xs rounded-lg px-2.5 border-slate-200 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="size-3" />
                <span>Add Link</span>
              </Button>
            </div>

            <div className="space-y-1.5 pt-0.5">
              {socialLinks.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-100 bg-slate-50/70"
                >
                  <div className="flex size-7 items-center justify-center rounded-lg bg-white border border-slate-200/80 shrink-0">
                    {getPlatformIcon(item.platform)}
                  </div>

                  <select
                    value={item.platform}
                    onChange={(e) => {
                      const updated = [...socialLinks];
                      updated[index].platform = e.target.value;
                      setSocialLinks(updated);
                    }}
                    className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none capitalize cursor-pointer shrink-0"
                  >
                    <option value="github">GitHub</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X (Twitter)</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Website</option>
                  </select>

                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleUpdateSocialUrl(index, e.target.value)}
                    placeholder="https://"
                    className="flex-1 min-w-0 bg-transparent text-xs font-mono text-slate-700 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveSocial(index)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Card 3: Bio Links (Custom Links list) */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Bio Links</h3>
                <p className="text-[11px] text-slate-500">
                  Custom links displayed as clean cards on your bio.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setEditingLink(null);
                  setModalOpen(true);
                }}
                className="h-7 text-xs rounded-lg px-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="size-3" />
                <span>Add Bio Link</span>
              </Button>
            </div>

            {bioLinks.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                No bio links added yet. Click &quot;Add Bio Link&quot; above to create your first card.
              </div>
            ) : (
              <div className="space-y-1.5 pt-0.5">
                {bioLinks.map((link, index) => (
                  <div
                    key={link.id || index}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <GripVertical className="size-3.5 text-slate-300 shrink-0 cursor-grab" />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 truncate">
                          {link.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[220px]">
                          {link.url}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLink({ ...link, index });
                          setModalOpen(true);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        title="Edit"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBioLink(link.id || index)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Card 4: Themes */}
          <Card className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
            <ThemeSelector currentTheme={theme} onSelectTheme={setTheme} />
          </Card>
        </div>

        {/* RIGHT COLUMN: Live Phone Preview */}
        <div
          ref={rightColumnRef}
          className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-start lg:sticky lg:top-24"
        >
          <PhonePreview
            profile={profile}
            socialLinks={socialLinks}
            bioLinks={bioLinks}
            theme={theme}
          />
        </div>
      </div>

      {/* Modal for adding/editing bio links */}
      {modalOpen && (
        <AddBioLinkModal
          isOpen={modalOpen}
          initialData={editingLink}
          onClose={() => {
            setModalOpen(false);
            setEditingLink(null);
          }}
          onSave={handleSaveBioLink}
        />
      )}
    </div>
  );
}
