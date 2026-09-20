import React, { useState, useMemo } from "react";
import { Search, Sparkles, CheckCircle2 } from "lucide-react";
import { BLOG_CATEGORIES, BLOG_POSTS } from "@/lib/blogData";
import { BlogHero } from "@/components/BlogHero";
import { BlogCard } from "@/components/BlogCard";

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const featuredPost = useMemo(() => {
    return BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  }, []);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Top Featured Hero Section */}
        <BlogHero post={featuredPost} />

        {/* Filter and Search Bar Section */}
        <section className="my-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#008080] text-white"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides & topics..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#008080] focus:outline-none focus:ring-1 focus:ring-[#008080] transition-colors"
              />
            </div>
          </div>
        </section>

        {/* 2-Column Article Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedCategory === "All" ? "All Insights & Guides" : `${selectedCategory} Guides`}
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-slate-500 text-sm">No articles found matching your query.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-bold text-[#008080] hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Subscription Banner with Solid Colors */}
        <section className="mt-20 rounded-2xl bg-[#0b2341] px-6 py-12 sm:px-12 text-center text-white shadow-lg">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-teal-300 border border-slate-700">
              <Sparkles className="size-3.5 text-teal-400" />
              Creator Growth Dispatch
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Stay ahead with weekly link strategy & insights
            </h3>
            <p className="text-slate-300 text-sm">
              Subscribe to get actionable guides on link tracking, QR campaigns, and social conversions delivered straight to your inbox.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-900/50 px-5 py-3 text-sm font-semibold text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="size-4" /> You're subscribed! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your work email"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 rounded-lg bg-[#008080] hover:bg-[#006e6e] px-5 py-2.5 text-xs font-bold text-white shadow transition-colors active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
