import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
  Sparkles,
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PUBLIC_APP_URL } from "@/lib/api";

export function BioShareCard({ username = "me", onEditAgain }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const publicUrl = `${PUBLIC_APP_URL}/bio/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `linkhub-bio-${username}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${username}'s LinkHub Bio`,
          text: `Check out my links and profile on LinkHub!`,
          url: publicUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Success Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs mb-1">
          <ShieldCheck className="size-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Your Link-in-Bio is Live! 🚀
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Your personalized page is ready to share on Instagram, TikTok, Twitter, LinkedIn, email signatures, and printed materials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        {/* Card 1: Public URL & Actions */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Sparkles className="size-4 text-blue-600" />
              <span>Public Bio Page Link</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 font-mono text-xs text-slate-800 break-all select-all flex items-center justify-between gap-2">
              <span className="truncate">{publicUrl}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Button
              type="button"
              onClick={handleCopy}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9.5 flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              {copied ? (
                <>
                  <Check className="size-4 stroke-[3]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span>Copy Bio Link</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(publicUrl, "_blank")}
              className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold h-9.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="size-4 text-slate-500" />
              <span>Open Public Page</span>
            </Button>

            {typeof navigator !== "undefined" && navigator.share && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleNativeShare}
                className="w-full rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold h-9 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="size-4" />
                <span>Share via App...</span>
              </Button>
            )}
          </div>
        </Card>

        {/* Card 2: QR Code */}
        <Card className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
          <div className="space-y-3 flex flex-col items-center">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <QrCode className="size-4 text-blue-600" />
              <span>Scan or Download QR</span>
            </div>

            {/* QR Code Canvas */}
            <div
              ref={qrRef}
              className="p-3.5 bg-white rounded-2xl border-2 border-slate-100 shadow-md inline-flex items-center justify-center"
            >
              <QRCodeCanvas
                value={publicUrl}
                size={148}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Point your phone camera to open your bio page.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadQR}
            className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold h-9.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="size-4 text-slate-500" />
            <span>Download High-Res QR</span>
          </Button>
        </Card>
      </div>

      {/* Return to Edit Action */}
      <div className="flex justify-center pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onEditAgain}
          className="rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Customizer & Content</span>
        </Button>
      </div>
    </div>
  );
}
