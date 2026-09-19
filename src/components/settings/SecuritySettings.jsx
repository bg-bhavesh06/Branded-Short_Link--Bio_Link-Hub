import React from "react";
import { CheckCircle2, Shield, Lock, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PasswordForm } from "./PasswordForm";

export function SecuritySettings() {
  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your password and account security.
        </p>
      </div>

      {/* Section 1: Password Change */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Lock className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Password
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Ensure your account is using a strong and unique password.
        </p>
        <PasswordForm />
      </div>

      {/* Section 2: Email Verification */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Mail className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            Email Verification
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50 max-w-xl">
          <div className="space-y-0.5 min-w-0">
            <div className="text-xs font-semibold text-slate-500">Email Address</div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              bhaveshganwani37@gmail.com
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 self-start sm:self-auto">
            <CheckCircle2 className="size-3.5 text-emerald-600 fill-emerald-100" />
            <span>✓ Verified</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 max-w-xl">
          Your email address has been verified. Verification ensures account recovery access and critical security alerts.
        </p>
      </div>
    </Card>
  );
}
