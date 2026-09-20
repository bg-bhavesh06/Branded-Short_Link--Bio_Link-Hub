import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Check, ExternalLink, Download, Share2, Sparkles, ArrowLeft, QrCode, ShieldCheck, Trash2, Loader2, Radio, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PUBLIC_APP_URL } from "@/lib/api";

export function BioShareCard({ username = "me", onEditAgain, onPublish, isPublishing, isPublished = true, onDeleteBio, isDeleting }) {
  const [copied, setCopied] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const qrRef = useRef(null);
  const publicUrl = `${PUBLIC_APP_URL}/bio/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `linkhub-bio-${username}-qr.png`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-1 shadow-2xs">
          <ShieldCheck className="size-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">{isPublished ? "Your Link-in-Bio is Live! 🚀" : "Ready to Publish & Share"}</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Ready to share on Instagram, WhatsApp, YouTube, LinkedIn, and X.</p>
        <div className="pt-0.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            {isPublished ? "Live & Published" : "Draft Ready"}
          </span>
        </div>
      </div>

      {/* Publish Action */}
      <Button type="button" onClick={onPublish} disabled={isPublishing} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 shadow-sm cursor-pointer">
        {isPublishing ? <><Loader2 className="size-3.5 animate-spin mr-1.5" /> Publishing...</> : <><Sparkles className="size-3.5 mr-1.5" /> {isPublished ? "Re-Publish / Update Live Page" : "Publish & Share Page"}</>}
      </Button>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
              <span className="flex items-center gap-1.5"><Radio className="size-3.5 text-emerald-600" /> Public Bio Link</span>
              <span className="text-slate-400 font-mono">/{username}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[11px] text-slate-700 truncate">{publicUrl}</div>
          </div>
          <div className="space-y-1.5 pt-1">
            <Button type="button" onClick={handleCopy} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-8.5 cursor-pointer">
              {copied ? <><Check className="size-3.5 text-emerald-400 mr-1" /> Copied!</> : <><Copy className="size-3.5 mr-1" /> Copy Bio Link</>}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.open(publicUrl, "_blank")} className="w-full rounded-xl border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 text-xs font-semibold h-8.5 cursor-pointer">
              <ExternalLink className="size-3.5 mr-1 text-blue-600" /> Open Public Page
            </Button>
            {typeof navigator !== "undefined" && navigator.share && (
              <Button type="button" variant="ghost" onClick={() => navigator.share({ title: `${username}'s Bio`, url: publicUrl })} className="w-full rounded-xl text-slate-600 text-xs font-semibold h-8 cursor-pointer">
                <Share2 className="size-3.5 mr-1" /> Share via App...
              </Button>
            )}
          </div>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col justify-between items-center text-center space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900"><QrCode className="size-3.5 text-blue-600" /> Scan or Download QR</div>
          <div ref={qrRef} className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs inline-flex">
            <QRCodeCanvas value={publicUrl} size={118} level="H" includeMargin={false} />
          </div>
          <Button type="button" variant="outline" onClick={handleDownloadQR} className="w-full rounded-xl border-slate-200 text-xs font-semibold h-8.5 cursor-pointer">
            <Download className="size-3.5 mr-1" /> Download High-Res QR
          </Button>
        </Card>
      </div>

      {/* Danger Zone & Nav */}
      <div className="border-t border-slate-200/80 pt-3 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onEditAgain} className="rounded-xl text-slate-600 text-xs font-semibold cursor-pointer">
          <ArrowLeft className="size-3.5 mr-1" /> Back to Customizer
        </Button>
        <Button type="button" variant="outline" onClick={() => setShowDelete(true)} className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer">
          <Trash2 className="size-3.5 mr-1 text-rose-500" /> Delete Bio Page
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><AlertTriangle className="size-5" /></div>
              <div><h3 className="text-sm font-bold text-slate-900">Delete Bio Profile?</h3><p className="text-[11px] text-slate-500">Unpublishes /bio/{username} and resets data.</p></div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" disabled={isDeleting} onClick={() => setShowDelete(false)} className="rounded-xl text-xs">Cancel</Button>
              <Button disabled={isDeleting} onClick={async () => { await onDeleteBio(); setShowDelete(false); }} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold">
                {isDeleting ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <Trash2 className="size-3.5 mr-1" />} Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
