import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { BioCardContent } from "@/components/bio/BioCardContent";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api";

const API_PUBLIC_BIO = API_ENDPOINTS.bio;

export function PublicBioPage() {
  const { username } = useParams();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [bioLinks, setBioLinks] = useState([]);
  const [theme, setTheme] = useState("minimal");
  const [templateId, setTemplateId] = useState("creator");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [statusBadge, setStatusBadge] = useState("Open to work");
  const [highlights, setHighlights] = useState([]);
  const [contactMethods, setContactMethods] = useState([]);
  const [customization, setCustomization] = useState({});

  useEffect(() => {
    const fetchPublicBio = async () => {
      if (!username) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);
        const res = await fetch(`${API_PUBLIC_BIO}/${encodeURIComponent(username)}`);
        const data = await res.json();

        if (!res.ok || !data.success || !data.data) {
          setNotFound(true);
          return;
        }

        const d = data.data;
        setProfile({
          displayName: d.displayName || d.username,
          username: d.username,
          bio: d.bio || "",
          avatar: d.avatar || "",
        });
        setSocialLinks(d.socialLinks || []);
        setBioLinks(d.bioLinks || []);
        setTemplateId(d.templateId || "creator");
        setJobTitle(d.jobTitle || "");
        setCompany(d.company || "");
        setPronouns(d.pronouns || "");
        setCoverImage(d.coverImage || "");
        setResumeUrl(d.resumeUrl || "");
        setStatusBadge(d.statusBadge || "Open to work");
        setHighlights(d.highlights || []);
        setContactMethods(d.contactMethods || []);
        setCustomization(d.customization || {});

        // Normalize theme to frontend key
        if (d.theme === "Dark Slate" || d.theme === "dark") {
          setTheme("dark");
        } else if (d.theme === "Gradient" || d.theme === "gradient") {
          setTheme("gradient");
        } else {
          setTheme("minimal");
        }
      } catch (err) {
        console.error("Failed to load public bio:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicBio();
  }, [username]);

  const themeBgClasses = {
    minimal: "bg-[#f8fafc] text-slate-900",
    dark: "bg-[#090d16] text-white",
    gradient: "bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 text-white",
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 text-white gap-3 p-4">
        <Loader2 className="size-8 animate-spin text-blue-500" />
        <span className="text-xs font-semibold text-slate-400">Loading bio profile...</span>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 mb-4 border border-rose-500/20">
          <AlertCircle className="size-7" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Bio Profile Not Found</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          The link-in-bio page for &quot;{username}&quot; does not exist or has been removed.
        </p>
        <Link to="/" className="mt-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20">
            <ArrowLeft className="size-3.5" />
            <span>Go to LinkHub</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between transition-colors duration-300 ${
        themeBgClasses[theme] || themeBgClasses.minimal
      }`}
    >
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col justify-between py-6 px-4">
        <BioCardContent
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
          contactMethods={contactMethods}
          customization={customization}
          isPublic={true}
        />
      </div>
    </div>
  );
}
