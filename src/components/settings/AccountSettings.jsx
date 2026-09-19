import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  Calendar,
  Sparkles,
  AlertTriangle,
  Crown,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteAccountModal } from "./DeleteAccountModal";

export function AccountSettings() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Card className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your LinkHub account.
        </p>
      </div>

      {/* Section 1: Account Information */}
      <div className="space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Account Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          {/* Account Created */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <Calendar className="size-3.5 text-slate-400" />
              <span>Account created</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900">
              September 2026
            </div>
          </div>

          {/* Current Plan */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Crown className="size-3.5 text-amber-500" />
                <span>Current Plan</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-900">
                Free Plan
              </div>
            </div>
            <Button
              type="button"
              onClick={() => navigate("/pricing")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold px-3 py-1.5 shadow-2xs h-8 flex items-center gap-1"
            >
              <span>Upgrade</span>
              <ArrowRight className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: Danger Zone */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <AlertTriangle className="size-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-rose-600">
            Danger Zone
          </h3>
        </div>

        <div className="p-5 rounded-2xl border border-rose-200/80 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-2xl">
          <div className="space-y-1">
            <div className="text-sm font-bold text-slate-900">
              Delete Account
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Permanently delete your LinkHub account and all associated data.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold px-4 py-2 shadow-xs shrink-0 flex items-center gap-1.5 h-9"
          >
            <Trash2 className="size-3.5" />
            <span>Delete Account</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteAccountModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Card>
  );
}
