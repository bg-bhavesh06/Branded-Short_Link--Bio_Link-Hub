import React from "react";
import { Link } from "react-router-dom";
import { Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/60 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 group">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs group-hover:scale-105 transition-transform">
                <Link2 className="size-4.5 rotate-45" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Link<span className="text-blue-600">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The branded short-link and link-in-bio hub designed for modern creators, developers, and brands.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Product
            </h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/links" className="hover:text-blue-600 transition-colors">
                  URL Shortener
                </Link>
              </li>
              <li>
                <Link to="/bio-builder" className="hover:text-blue-600 transition-colors">
                  Link-in-Bio
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-blue-600 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/links" className="hover:text-blue-600 transition-colors">
                  QR Codes
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Resources
            </h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/blog" className="hover:text-blue-600 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-600 transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Company
            </h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 LinkHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-800 transition-colors">
              Privacy
            </Link>
            <Link to="/about" className="hover:text-slate-800 transition-colors">
              Terms
            </Link>
            <Link to="/about" className="hover:text-slate-800 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
