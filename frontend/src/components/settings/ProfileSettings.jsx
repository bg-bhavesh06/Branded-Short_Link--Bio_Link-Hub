import React, { useState } from "react";
import { Check, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarSettings } from "./AvatarSettings";

export function ProfileSettings() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem("linkhub_user_profile");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      fullName: "Bhavesh Ganwani",
      email: "bhaveshganwani37@gmail.com",
      username: "bhavesh",
      avatar: "",
    };
  });

  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus("saving");
    setTimeout(() => {
      localStorage.setItem("linkhub_user_profile", JSON.stringify(profile));
      // Also sync with bio profile name/username if needed
      try {
        const bioSaved = localStorage.getItem("linkhub_bio_profile");
        if (bioSaved) {
          const bioObj = JSON.parse(bioSaved);
          bioObj.displayName = profile.fullName;
          bioObj.username = profile.username;
          if (profile.avatar) bioObj.avatar = profile.avatar;
          localStorage.setItem("linkhub_bio_profile", JSON.stringify(bioObj));
        }
      } catch {
        // ignore
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    }, 600);
  };

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Profile
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal information.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Avatar Section */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <label className="text-xs font-semibold text-slate-700">
            Profile Avatar
          </label>
          <AvatarSettings
            avatar={profile.avatar}
            onAvatarChange={(url) => setProfile((p) => ({ ...p, avatar: url }))}
            onAvatarRemove={() => setProfile((p) => ({ ...p, avatar: "" }))}
          />
        </div>

        {/* Profile Details Form Fields */}
        <div className="space-y-4 max-w-xl">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="settings-fullname"
              className="text-xs font-semibold text-slate-700"
            >
              Full Name
            </label>
            <input
              id="settings-fullname"
              type="text"
              required
              value={profile.fullName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="Bhavesh Ganwani"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
            />
          </div>

          {/* Email Address with Verified Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="settings-email"
                className="text-xs font-semibold text-slate-700"
              >
                Email
              </label>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <CheckCircle2 className="size-3 text-emerald-600 fill-emerald-100" />
                <span>Verified</span>
              </span>
            </div>
            <input
              id="settings-email"
              type="email"
              required
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="bhaveshganwani37@gmail.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
            />
            <p className="text-[11px] text-slate-400">
              Primary email used for notifications and account recovery.
            </p>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label
              htmlFor="settings-username"
              className="text-xs font-semibold text-slate-700"
            >
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs text-slate-400 font-semibold select-none">
                @
              </span>
              <input
                id="settings-username"
                type="text"
                required
                value={profile.username}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    username: e.target.value.toLowerCase().replace(/\s+/g, ""),
                  }))
                }
                placeholder="bhavesh"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-32 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
              />
              <span className="absolute right-3.5 text-xs text-slate-400 font-mono select-none hidden sm:block">
                linkhub.dev/{profile.username || "username"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Your public handle used for your bio link profile.
            </p>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <Button
            type="submit"
            disabled={saveStatus === "saving"}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 min-w-[130px] justify-center transition-all h-9.5"
          >
            {saveStatus === "saving" ? (
              <>
                <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="size-4 text-white stroke-[2.5]" />
                <span>✓ Changes saved</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Save Changes</span>
              </>
            )}
          </Button>

          {saveStatus === "saved" && (
            <span className="text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
              Saved successfully!
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}
