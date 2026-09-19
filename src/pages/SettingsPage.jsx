import React, { useState } from "react";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6 pb-12">
      {/* 1. PAGE HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-1">
          Manage your profile, security, appearance, and account preferences.
        </p>
      </div>

      {/* 2. SETTINGS MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Navigation */}
        <div className="lg:col-span-4 xl:col-span-3 w-full">
          <SettingsSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </div>

        {/* Right Column: Active Settings Content */}
        <div className="lg:col-span-8 xl:col-span-9 w-full">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "account" && <AccountSettings />}
        </div>
      </div>
    </div>
  );
}
