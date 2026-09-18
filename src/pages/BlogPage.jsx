import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function BlogPage() {
  const posts = [
    {
      title: "How Creator Links Drive 3x More Engagement on Social Media",
      category: "Growth Guide",
      date: "Feb 2026",
      readTime: "4 min read",
      summary: "Learn why consolidating your content with branded vanity slugs and link hubs converts viewers into followers.",
    },
    {
      title: "The Ultimate Guide to QR Code Marketing in 2026",
      category: "Analytics",
      date: "Jan 2026",
      readTime: "6 min read",
      summary: "From physical merch to live streaming, discover the modern creator strategies for scannable dynamic QR codes.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Creator Resources
        </span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          LinkHub Blog & Insights
        </h1>
        <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto">
          Insights, tips, and strategies on link optimization, social distribution, and audience growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Card key={post.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-0 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-indigo-600 uppercase tracking-wider">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">{post.title}</CardTitle>
              <CardDescription className="text-slate-600 text-sm leading-relaxed">{post.summary}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
