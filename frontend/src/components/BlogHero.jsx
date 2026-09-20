import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Link2, ExternalLink } from "lucide-react";

export function BlogHero({ post }) {
  if (!post) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#0b2341] text-white shadow-xl border border-slate-800 my-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
        {/* Left: Article Details */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3.5 py-1 text-xs font-semibold text-teal-300 border border-slate-700">
            <Sparkles className="size-3.5 text-teal-400" />
            {post.category} • URL 101
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {post.title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            {post.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#008080] hover:bg-[#006e6e] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors active:scale-95"
            >
              Learn More
              <ArrowRight className="size-4" />
            </Link>
            <span className="text-xs text-slate-400 font-medium">
              {post.readTime} • Published {post.date}
            </span>
          </div>
        </div>

        {/* Right: Visual Interactive Graphic Mockup */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500" />
                <span className="size-3 rounded-full bg-amber-500" />
                <span className="size-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] font-mono text-slate-400">linkhub.bio</span>
            </div>

            {/* Branded Link Visual Pill */}
            <div className="rounded-xl bg-slate-800 border border-teal-500/40 p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#008080] text-white shadow-md">
                  <Link2 className="size-5" />
                </div>
                <div className="truncate">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-teal-400">Branded Vanity URL</div>
                  <div className="text-sm font-mono font-bold text-white truncate">mybranded.link/seo-guide</div>
                </div>
              </div>
            </div>

            {/* Arrow & Target Long URL Card */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 relative">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <ExternalLink className="size-3" /> Long URL (Target)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Masked</span>
              </div>
              <p className="font-mono text-xs text-slate-300 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                mybranded.link/blog/2026/03/14/in-depth-guide-to-seo/
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
