import React from "react";
import { Link } from "react-router-dom";
import { Info, ArrowLeft, Shield, Zap, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          About Us
        </span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About LinkHub
        </h1>
        <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto">
          Built for creators, developers, and internet builders who need high-speed link management and beautiful bio hubs.
        </p>
      </div>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            LinkHub unites the speed of branded URL shortening with the beauty of customizable Link-in-Bio profile hubs. We believe every creator deserves fast redirection, clear click analytics, and effortless sharing tools without complicated setup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <Zap className="size-6 text-indigo-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-sm">High Speed</div>
            <div className="text-xs text-slate-500 mt-1">302 fast redirection</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <Shield className="size-6 text-emerald-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-sm">Secure Auth</div>
            <div className="text-xs text-slate-500 mt-1">Pair token JWT cookies</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <Sparkles className="size-6 text-purple-600 mx-auto mb-2" />
            <div className="font-bold text-slate-900 text-sm">Coss UI Primitives</div>
            <div className="text-xs text-slate-500 mt-1">Accessible components</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
