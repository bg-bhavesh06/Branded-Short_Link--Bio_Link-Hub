import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UrlShortenerPreview } from "@/components/UrlShortenerPreview";
import { BioPreview } from "@/components/BioPreview";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 lg:pt-18 lg:pb-28">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 -z-10 size-96 rounded-full bg-purple-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 -z-10 size-96 rounded-full bg-indigo-200/30 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            {/* Small Badge */}
            <Badge
              variant="default"
              className="mb-5 bg-indigo-50/90 text-indigo-700 border-indigo-200/70 px-3.5 py-1 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full shadow-xs"
            >
              ALL-IN-ONE FOR CREATORS
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
              Short Links. <br />
              Powerful Profiles. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                All in One Place.
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              Shorten your long URLs, track real performance, and create a
              beautiful link-in-bio page to share everything that matters — with
              LinkHub.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/signup")}
                size="xl"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-600/25 px-6 font-semibold text-base flex items-center gap-2 group transition-all"
              >
                <span>Get Started Free</span>
                <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                onClick={() => navigate("/links")}
                variant="outline"
                size="xl"
                className="border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl px-6 font-semibold text-base shadow-xs"
              >
                View Demo
              </Button>
            </div>

            {/* Value Proposition Checklist */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs sm:text-sm font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 fill-emerald-50 shrink-0" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 fill-emerald-50 shrink-0" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-600 fill-emerald-50 shrink-0" />
                <span>Made for creators</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Product Previews */}
          <div className="lg:col-span-7 relative">
            {/* Whimsical Handwritten Annotations on Desktop */}
            <div className="hidden sm:block absolute -top-8 left-12 z-20 font-handwriting text-indigo-600 select-none">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold">Turn this...</span>
                <svg
                  width="36"
                  height="24"
                  viewBox="0 0 40 28"
                  fill="none"
                  className="stroke-indigo-500"
                >
                  <path
                    d="M6 6 C 18 10, 28 18, 30 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M22 24 L 30 24 L 30 16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            <div className="hidden sm:block absolute -top-8 right-16 z-20 font-handwriting text-indigo-600 select-none">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold">...into this!</span>
                <svg
                  width="36"
                  height="24"
                  viewBox="0 0 40 28"
                  fill="none"
                  className="stroke-indigo-500"
                >
                  <path
                    d="M34 6 C 24 10, 14 18, 12 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M12 16 L 12 24 L 20 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Dual Previews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-start justify-items-center">
              <div className="w-full flex justify-center">
                <UrlShortenerPreview />
              </div>
              <div className="w-full flex justify-center">
                <BioPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
