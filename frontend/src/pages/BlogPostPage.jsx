import React, { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Check,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Zap,
  Repeat
} from "lucide-react";
import { BLOG_POSTS } from "@/lib/blogData";
import { BlogCard } from "@/components/BlogCard";

export function BlogPostPage() {
  const { slug } = useParams();
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [testSimulating, setTestSimulating] = useState(false);
  const [testStep, setTestStep] = useState(0);

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = `${(totalScroll / windowHeight) * 100}`;
        setScrollProgress(Number(scroll));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setTestSimulating(true);
    setTestStep(1);
    setTimeout(() => setTestStep(2), 700);
    setTimeout(() => setTestStep(3), 1400);
    setTimeout(() => {
      setTestSimulating(false);
      setTestStep(0);
    }, 3200);
  };

  return (
    <div className="relative min-h-screen bg-white pb-20">
      {/* Solid Top Reading Progress Bar (TinyURL Style) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-100">
        <div
          className="h-full bg-[#008080] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Share */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#008080] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to All Guides
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-600" />
            ) : (
              <Share2 className="size-3.5" />
            )}
            {copied ? "Link Copied!" : "Share Article"}
          </button>
        </div>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {post.category}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-500 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="size-9 rounded-full object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <p className="font-bold text-slate-800 text-sm">
                  {post.author.name}
                </p>
                <p className="text-slate-500 text-[11px]">{post.author.role}</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-slate-400" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <img
            src={post.image}
            alt={post.title}
            className="h-[340px] sm:h-[420px] w-full object-cover"
          />
        </div>

        {/* Main Takeaways Box (Solid Background) */}
        {post.takeaways && post.takeaways.length > 0 && (
          <div className="mb-10 rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Main Takeaways From This Article:
            </h2>
            <ul className="space-y-3">
              {post.takeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-900" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <article className="space-y-10 text-slate-700 leading-relaxed text-base sm:text-lg">
          
          {/* Section 1 */}
          {post.content && post.content[0] && (
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {post.content[0].heading}
              </h2>
              {post.content[0].paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          )}

          {/* Section 2: How Does URL Masking Work with Live Visual URL Comparison */}
          {post.urlExample && (
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                How Does URL Masking Work?
              </h2>
              <p className="text-slate-700 leading-relaxed">
                The technical process behind URL masking is relatively straightforward. When masking a URL, you essentially create a new web page (the masked URL) that sits in front of the destination URL. This new page acts as a middleman, redirecting users to the original content once they click on the masked URL.
              </p>

              {/* Before and After Visual Box */}
              <div className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="bg-[#0b2341] px-6 py-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-500" />
                    <span className="size-3 rounded-full bg-amber-500" />
                    <span className="size-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 font-mono text-xs text-slate-300">URL Routing Architecture</span>
                  </div>
                  <button
                    onClick={handleRunSimulation}
                    disabled={testSimulating}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#008080] hover:bg-[#006e6e] px-3 py-1 text-xs font-semibold text-white shadow-sm transition-colors active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="size-3.5" />
                    {testSimulating ? "Simulating Request..." : "Simulate Flow"}
                  </button>
                </div>

                <div className="p-6 space-y-5">
                  {/* Long URL */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1.5 flex items-center gap-1.5">
                      <XCircle className="size-4" /> Destination Long URL (Complex)
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 font-mono text-xs text-slate-600 break-all">
                      {post.urlExample.longUrl}
                    </div>
                  </div>

                  {/* Flow Middleman */}
                  <div className="flex items-center justify-center gap-3 py-1">
                    <div className="h-px bg-slate-200 flex-1" />
                    <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-800 border border-slate-200">
                      <Repeat className="size-3.5 text-[#008080]" />
                      LinkHub Edge Router (301 / 302 Redirect)
                    </div>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  {/* Clean Vanity URL */}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#008080] mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="size-4" /> Masked Branded URL (User-Facing)
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-teal-200 p-3 font-mono text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>{post.urlExample.shortUrl}</span>
                      <span className="text-[11px] font-sans font-medium text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                        Clean & Memorable
                      </span>
                    </div>
                  </div>

                  {/* Simulation Feedback Alert */}
                  {testSimulating && (
                    <div className="rounded-lg bg-slate-900 p-4 text-xs font-mono text-teal-400 space-y-1">
                      {testStep >= 1 && <div>&gt; Visitor clicks: {post.urlExample.shortUrl}</div>}
                      {testStep >= 2 && <div>&gt; LinkHub edge logs: Geo (US), Device (Mobile Safari), Referrer (Twitter)</div>}
                      {testStep >= 3 && <div>&gt; 301 Permanent Redirect to destination completed in 24ms ✓</div>}
                    </div>
                  )}

                  <p className="text-xs text-slate-500 italic">
                    {post.urlExample.description}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Techniques Grid */}
          {post.techniques && post.techniques.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Different URL Masking Techniques
              </h2>
              <p className="text-slate-700 leading-relaxed">
                There are several standard ways to achieve URL masking, each with its own advantages and limitations:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {post.techniques.map((tech, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-base">{tech.title}</h4>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                        {tech.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {tech.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pros and Cons Breakdown */}
          {post.prosCons && (
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Pros & Cons of URL Masking
              </h2>
              <p className="text-slate-700 leading-relaxed">
                Understanding the benefits and trade-offs ensures you maximize conversions while safeguarding search rankings.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Pros */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <CheckCircle2 className="size-5 text-[#008080]" />
                    Key Advantages (Pros)
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {post.prosCons.pros.map((pro, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-[#008080] font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                    <XCircle className="size-5 text-rose-600" />
                    Considerations (Cons)
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {post.prosCons.cons.map((con, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Remaining Content Sections */}
          {post.content && post.content.slice(1).map((sec, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {sec.heading}
              </h2>
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-700 leading-relaxed">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {/* Solid Dark CTA Box */}
          <div className="mt-12 rounded-2xl bg-[#0b2341] p-8 text-white shadow-md">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="size-4" /> LinkHub Link Management
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Start building branded short links with complete masking control
            </h3>
            <p className="text-slate-300 text-sm mb-6 max-w-xl">
              Create vanity URLs, dynamic QR codes, and custom bio-links that boost user trust and measure performance across all channels.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#008080] hover:bg-[#006e6e] px-5 py-2.5 text-sm font-semibold text-white shadow transition-colors active:scale-95"
              >
                Get Started for Free
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/bio-builder"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Explore Bio Builder
              </Link>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 border-t border-slate-200 pt-12">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">
                Related Insights & Guides
              </h3>
              <Link
                to="/blog"
                className="text-xs font-bold text-[#008080] hover:underline"
              >
                View All Articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <BlogCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
