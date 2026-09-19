import React, { useState } from "react";
import { Lock, Eye, EyeOff, Check, AlertCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [status, setStatus] = useState("idle"); // idle | changing | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate simple password strength
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, text: "", color: "bg-slate-200" };
    if (pwd.length < 6) return { score: 1, text: "Weak", color: "bg-rose-500" };
    if (pwd.length < 10 || !/[0-9]/.test(pwd))
      return { score: 2, text: "Medium", color: "bg-amber-500" };
    return { score: 3, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!currentPassword.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setStatus("error");
      setErrorMessage("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setErrorMessage("New passwords do not match.");
      return;
    }

    // Simulate password change
    setStatus("changing");
    setTimeout(() => {
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {/* Error alert */}
      {status === "error" && errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in duration-150">
          <AlertCircle className="size-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Current Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="current-password"
          className="text-xs font-semibold text-slate-700"
        >
          Current Password
        </label>
        <div className="relative flex items-center">
          <input
            id="current-password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter current password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="new-password"
          className="text-xs font-semibold text-slate-700"
        >
          New Password
        </label>
        <div className="relative flex items-center">
          <input
            id="new-password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Enter new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="pt-1 space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Password strength:</span>
              <span
                className={`font-bold ${
                  strength.score === 1
                    ? "text-rose-600"
                    : strength.score === 2
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {strength.text}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 h-1.5">
              <div
                className={`rounded-full transition-all ${
                  strength.score >= 1 ? strength.color : "bg-slate-100"
                }`}
              />
              <div
                className={`rounded-full transition-all ${
                  strength.score >= 2 ? strength.color : "bg-slate-100"
                }`}
              />
              <div
                className={`rounded-full transition-all ${
                  strength.score >= 3 ? strength.color : "bg-slate-100"
                }`}
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirm-password"
          className="text-xs font-semibold text-slate-700"
        >
          Confirm New Password
        </label>
        <div className="relative flex items-center">
          <input
            id="confirm-password"
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Confirm new password"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 pr-10 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-3 flex items-center gap-3">
        <Button
          type="submit"
          disabled={status === "changing"}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2 min-w-[150px] justify-center transition-all h-9.5"
        >
          {status === "changing" ? (
            <>
              <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Changing Password...</span>
            </>
          ) : status === "success" ? (
            <>
              <Check className="size-4 text-white stroke-[2.5]" />
              <span>✓ Password changed</span>
            </>
          ) : (
            <>
              <KeyRound className="size-4" />
              <span>Change Password</span>
            </>
          )}
        </Button>

        {status === "success" && (
          <span className="text-xs font-semibold text-emerald-600 animate-in fade-in duration-200">
            Password updated successfully!
          </span>
        )}
      </div>
    </form>
  );
}
