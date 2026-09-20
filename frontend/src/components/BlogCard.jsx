import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

export function BlogCard({ post }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300">
      {/* Article Image */}
      <Link to={`/blog/${post.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="mb-3 flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500 uppercase tracking-wider font-semibold">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <Clock className="size-3.5" />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-[#008080] transition-colors">
          <Link to={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
          {post.summary}
        </p>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="size-7 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-medium text-slate-600">{post.author.name}</span>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#008080] hover:bg-[#006e6e] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors active:scale-95"
          >
            Learn More
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
