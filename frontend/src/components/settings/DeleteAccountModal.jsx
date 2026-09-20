import React, { useState } from "react";
import { AlertTriangle, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteAccountModal({ isOpen, onClose }) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeletedSuccess(true);
      setTimeout(() => {
        setDeletedSuccess(false);
        setConfirmText("");
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle className="size-5.5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="size-4.5" />
          </button>
        </div>

        <div>
          <h3
            id="delete-account-title"
            className="text-lg font-bold text-slate-900"
          >
            Delete your account?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            This action cannot be undone. All your links, bio profile, custom domains, and analytics data will be permanently deleted.
          </p>
        </div>

        {deletedSuccess ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 text-center animate-in fade-in">
            ✓ Account deletion simulated (Demo mode). No real data was lost.
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Type <span className="font-mono text-rose-600 font-bold">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:border-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-600/20"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border-slate-200 text-xs font-semibold px-4 h-9"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || isDeleting || deletedSuccess}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold px-4 h-9 shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-3.5" />
                <span>Delete Account</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
