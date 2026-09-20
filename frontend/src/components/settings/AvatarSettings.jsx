import React, { useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AvatarSettings({ avatar, onAvatarChange, onAvatarRemove }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width: w, height: h } = img;
        if (w > 400 || h > 400) {
          if (w > h) { h = Math.round((h * 400) / w); w = 400; }
          else { w = Math.round((w * 400) / h); h = 400; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        onAvatarChange(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target?.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
      {/* Circular Avatar */}
      <div className="relative shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt="User Avatar"
            className="size-20 sm:size-22 rounded-full object-cover border-2 border-slate-100 shadow-md ring-2 ring-blue-500/20"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
            }}
          />
        ) : (
          <div className="flex size-20 sm:size-22 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-2xl border-2 border-indigo-200 shadow-sm">
            B
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs h-8.5 px-3.5 flex items-center gap-1.5"
          >
            <Camera className="size-3.5" />
            <span>Change Avatar</span>
          </Button>

          {avatar && (
            <button
              type="button"
              onClick={onAvatarRemove}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
            >
              <Trash2 className="size-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400">
          Recommended size: 400x400px. JPG, PNG or WebP. Max 5MB.
        </p>
      </div>
    </div>
  );
}
