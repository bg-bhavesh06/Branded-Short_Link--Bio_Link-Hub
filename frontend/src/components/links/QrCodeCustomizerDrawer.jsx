import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X, Download, RotateCcw, Sparkles, Check, Copy, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

const PRESET_COLORS = ["#000000", "#DE3121", "#F97316", "#16A34A", "#2563EB", "#4F46E5", "#8B5CF6", "#EC4899"];
const LOGOS = [{ id: "none", label: "None", icon: X }, { id: "linkhub", text: "LH" }, { id: "github", text: "GH" }, { id: "linkedin", text: "IN" }, { id: "instagram", text: "IG" }, { id: "x", text: "𝕏" }, { id: "custom", label: "Text", icon: Type }];
const FRAMES = [{ id: "none", label: "None" }, { id: "simple", label: "Simple Border" }, { id: "bottom-pill", label: "SCAN ME Bottom" }, { id: "top-pill", label: "SCAN ME Top" }, { id: "card", label: "Branded Card" }];

export function QrCodeCustomizerDrawer({
  isOpen,
  onClose,
  linkUrl,
  linkTitle = "Short Link",
  qrStyle = { fgColor: "#000000", bgColor: "#FFFFFF", frame: "bottom-pill", frameText: "SCAN ME", frameColor: "#000000", logoType: "none", customCenterText: "LINK" },
  onUpdateStyle = () => {}
}) {
  const fgColor = qrStyle.fgColor || "#000000";
  const bgColor = qrStyle.bgColor || "#FFFFFF";
  const frame = qrStyle.frame || "bottom-pill";
  const frameText = qrStyle.frameText || "SCAN ME";
  const frameColor = qrStyle.frameColor || "#000000";
  const logoType = qrStyle.logoType || "none";
  const customCenterText = qrStyle.customCenterText || "LINK";
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;
  const qrValue = linkUrl || "https://linkhub.me";

  const setStyle = (patch) => {
    onUpdateStyle({ ...qrStyle, ...patch });
  };

  const handleReset = () => {
    onUpdateStyle({ fgColor: "#000000", bgColor: "#FFFFFF", frame: "bottom-pill", frameText: "SCAN ME", frameColor: "#000000", logoType: "none", customCenterText: "LINK" });
  };

  const downloadStyledQR = () => {
    const canvas = document.getElementById("drawer-qr-canvas");
    if (!canvas) return;
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");
    const qrSize = 300, padding = frame === "none" ? 24 : 36, extraHeight = frame.includes("pill") || frame === "card" ? 64 : 0;
    exportCanvas.width = qrSize + padding * 2;
    exportCanvas.height = qrSize + padding * 2 + extraHeight;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    if (frame === "simple" || frame === "card") {
      ctx.strokeStyle = frameColor; ctx.lineWidth = 6; ctx.strokeRect(10, 10, exportCanvas.width - 20, exportCanvas.height - 20);
    }
    const qrY = frame === "top-pill" ? padding + 40 : padding;
    ctx.drawImage(canvas, padding, qrY, qrSize, qrSize);
    if (frame.includes("pill") || frame === "card") {
      ctx.fillStyle = frameColor; ctx.font = "bold 20px system-ui, sans-serif"; ctx.textAlign = "center";
      ctx.fillText(frameText || "SCAN ME", exportCanvas.width / 2, frame === "top-pill" ? padding + 20 : qrY + qrSize + 36);
    }
    const link = document.createElement("a");
    link.download = `linkhub-qr-${Date.now()}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Fixed Header */}
        <div className="z-30 bg-white px-6 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs"><Sparkles className="size-4" /></div>
            <div><h2 className="text-sm font-bold text-slate-900">Customize QR Code</h2><p className="text-[11px] text-slate-400 truncate max-w-xs">{linkTitle}: {qrValue}</p></div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"><X className="size-5" /></button>
        </div>

        {/* FIXED QR PREVIEW (STATIONARY - NEVER SCROLLS) */}
        <div className="z-20 bg-slate-50/90 border-b border-slate-200/80 py-3.5 px-6 flex flex-col items-center justify-center shadow-2xs shrink-0 select-none">
          <div style={{ backgroundColor: bgColor }} className={`p-3 rounded-2xl shadow-md flex flex-col items-center justify-center ${frame === "simple" ? "border-2" : frame === "card" ? "border-2 shadow-lg" : ""}`}>
            {frame === "top-pill" && <div className="font-black uppercase tracking-widest text-[10px] mb-1.5" style={{ color: frameColor }}>{frameText}</div>}
            <div className="relative rounded-md overflow-hidden flex items-center justify-center">
              <QRCodeCanvas id="drawer-qr-canvas" value={qrValue} size={125} fgColor={fgColor} bgColor={bgColor} level="H" includeMargin={false} />
              {logoType !== "none" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div style={{ backgroundColor: bgColor, color: fgColor, borderColor: fgColor }} className="size-7 rounded-full border-2 shadow-sm flex items-center justify-center font-extrabold text-[8.5px]">
                    {logoType === "custom" ? customCenterText.slice(0, 3).toUpperCase() : LOGOS.find((l) => l.id === logoType)?.text || "LH"}
                  </div>
                </div>
              )}
            </div>
            {frame === "bottom-pill" && <div className="font-black uppercase tracking-widest text-[10px] mt-1.5" style={{ color: frameColor }}>{frameText}</div>}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs">
            <button type="button" onClick={handleReset} className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer"><RotateCcw className="size-3" /> Reset</button>
            <span className="text-slate-300">•</span>
            <button type="button" onClick={() => { navigator.clipboard.writeText(qrValue); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1 cursor-pointer">
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />} {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* ONLY THIS OPTIONS SECTION SCROLLS */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Colors */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-sm">Choose Colors</h3>
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {PRESET_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setStyle({ fgColor: c, frameColor: c })} style={{ backgroundColor: c }} className={`size-7.5 rounded-full transition-transform cursor-pointer shrink-0 flex items-center justify-center ${fgColor === c ? "ring-3 ring-blue-500 ring-offset-2 scale-110" : "hover:scale-105"}`}>
                  {fgColor === c && <Check className="size-3 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              <div className="rounded-xl border border-slate-200 p-2.5 bg-white flex items-center justify-between">
                <div><div className="text-xs font-semibold text-slate-800">Code Color</div><div className="text-[10px] font-mono text-slate-400">{fgColor}</div></div>
                <input type="color" value={fgColor} onChange={(e) => setStyle({ fgColor: e.target.value })} className="size-7 rounded-lg border border-slate-200 cursor-pointer" />
              </div>
              <div className="rounded-xl border border-slate-200 p-2.5 bg-white flex items-center justify-between">
                <div><div className="text-xs font-semibold text-slate-800">Background</div><div className="text-[10px] font-mono text-slate-400">{bgColor}</div></div>
                <input type="color" value={bgColor} onChange={(e) => setStyle({ bgColor: e.target.value })} className="size-7 rounded-lg border border-slate-200 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Frames */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-sm">Select a Frame</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FRAMES.map((f) => (
                <button key={f.id} type="button" onClick={() => setStyle({ frame: f.id })} className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${frame === f.id ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs font-bold" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}>
                  {f.label}
                </button>
              ))}
            </div>
            {frame !== "none" && (
              <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Frame Text</label>
                  <input type="text" value={frameText} onChange={(e) => setStyle({ frameText: e.target.value })} maxLength={16} placeholder="SCAN ME" className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none" />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Frame Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={frameColor} onChange={(e) => setStyle({ frameColor: e.target.value })} className="size-7 rounded-lg border border-slate-200 cursor-pointer" />
                    <span className="text-[11px] font-mono text-slate-500">{frameColor}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logos */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-slate-900 text-sm">Add Logo / Center Text</h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {LOGOS.map((l) => (
                <button key={l.id} type="button" onClick={() => setStyle({ logoType: l.id })} className={`py-2 px-1 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${logoType === l.id ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs font-bold" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                  {l.icon ? <l.icon className="size-3.5" /> : <span className="font-black text-xs">{l.text}</span>}
                  <span className="text-[9px] font-medium">{l.label || l.text}</span>
                </button>
              ))}
            </div>
            {logoType === "custom" && (
              <input type="text" value={customCenterText} onChange={(e) => setStyle({ customCenterText: e.target.value.slice(0, 4) })} maxLength={4} placeholder="LINK" className="w-full mt-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none uppercase" />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 bg-white px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-slate-200 text-xs font-semibold px-5 py-2 cursor-pointer">Cancel</Button>
          <Button onClick={downloadStyledQR} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold px-5 py-2 shadow-md flex items-center gap-2 cursor-pointer">
            <Download className="size-4" /><span>Download Styled QR</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
