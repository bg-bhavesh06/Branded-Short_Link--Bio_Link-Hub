import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Link2,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Sparkles,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 group"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Link2 className="size-5 rotate-45" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Link<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Desktop Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* Coss UI Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 transition-colors">
              Products
              <ChevronDown className="size-4 opacity-70 transition-transform group-data-[popup-open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 p-2 shadow-xl border-slate-200/90 bg-white">
              <DropdownMenuItem
                onClick={() => handleNavigation("/links")}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-blue-50/80"
              >
                <div className="p-2 rounded-md bg-blue-50 text-blue-600 mt-0.5">
                  <Link2 className="size-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">URL Shortener</div>
                  <div className="text-xs text-slate-500">Shorten, customize & track branded links</div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleNavigation("/bio-builder")}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-100"
              >
                <div className="p-2 rounded-md bg-slate-100 text-slate-800 mt-0.5">
                  <LayoutGrid className="size-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Link-in-Bio</div>
                  <div className="text-xs text-slate-500">Create a stylish personal hub page</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            to="/features"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/blog"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/about"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-50 transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors"
          >
            Sign in
          </Link>
          <Button
            onClick={() => handleNavigation("/signup")}
            variant="default"
            className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl shadow-xs px-4.5 font-semibold text-sm"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <MenuIcon className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/95 px-4 pt-3 pb-6 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {/* Products Accordion in Mobile */}
            <div>
              <button
                type="button"
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="flex w-full items-center justify-between px-3 py-2.5 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50"
              >
                <span>Products</span>
                <ChevronDown
                  className={`size-4 text-slate-500 transition-transform ${
                    mobileProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileProductsOpen && (
                <div className="ml-4 pl-2 border-l-2 border-blue-100 space-y-1 mt-1">
                  <button
                    type="button"
                    onClick={() => handleNavigation("/links")}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600"
                  >
                    <Link2 className="size-4 text-blue-600" />
                    URL Shortener
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigation("/bio-builder")}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-blue-600"
                  >
                    <LayoutGrid className="size-4 text-slate-700" />
                    Link-in-Bio
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleNavigation("/features")}
              className="flex w-full px-3 py-2.5 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50 text-left"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/pricing")}
              className="flex w-full px-3 py-2.5 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50 text-left"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/blog")}
              className="flex w-full px-3 py-2.5 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50 text-left"
            >
              Blog
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/about")}
              className="flex w-full px-3 py-2.5 text-base font-medium text-slate-800 rounded-lg hover:bg-slate-50 text-left"
            >
              About
            </button>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleNavigation("/login")}
                className="w-full py-2.5 text-center text-sm font-medium text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Sign in
              </button>
              <Button
                onClick={() => handleNavigation("/signup")}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white justify-center py-2.5 rounded-xl font-semibold text-sm shadow-md"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
