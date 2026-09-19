import React, { useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Link2,
  Home,
  BarChart3,
  LayoutGrid,
  Settings,
  Crown,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { label: "Overview", icon: Home, path: "/links" },
    { label: "Links", icon: Link2, path: "/links" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Bio Builder", icon: LayoutGrid, path: "/bio-builder" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  const currentPath = location.pathname;

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 bg-white select-none">
      {/* Top section: Brand & Nav */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 px-2 py-1 font-bold text-xl tracking-tight text-slate-900 group"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Link2 className="size-5 rotate-45" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            Link<span className="text-blue-600">Hub</span>
          </span>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.label === "Settings"
                ? currentPath === "/settings"
                : item.label === "Analytics"
                ? currentPath === "/analytics"
                : item.label === "Links"
                ? currentPath === "/links"
                : item.label === "Bio Builder"
                ? currentPath === "/bio-builder"
                : item.label === "Overview"
                ? currentPath === "/overview" || currentPath === "/dashboard"
                : false;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`relative flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-50/90 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {/* Active left indicator pill */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600" />
                )}
                <Icon className={`size-4.5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section: Upgrade, Profile, Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Upgrade to Pro Card */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-indigo-50/40 p-4 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Crown className="size-4" />
            </div>
            <span className="text-sm font-bold text-slate-900">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            Get advanced analytics, custom domains and more.
          </p>
          <button
            type="button"
            onClick={() => navigate("/pricing")}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Upgrade Now</span>
            <span className="text-sm">→</span>
          </button>
        </div>

        {/* User Profile */}
        <div
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="size-9 rounded-full object-cover border border-slate-200"
            />
          ) : (
            <div className="flex size-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm shrink-0 border border-indigo-200">
              {(user?.name || "B").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-900 truncate">
              {user?.name || "Bhavesh Ganwani"}
            </span>
            <span className="text-[11px] text-slate-400 truncate">
              {user?.email || "bhaveshganwani37@gmail.com"}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50/50"
        >
          <LogOut className="size-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 border-r border-slate-200/80 bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl border-r border-slate-200 animate-in slide-in-from-left duration-200">
            <div className="absolute right-3 top-3">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-20 h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Global Search */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>

            {/* Search Input with Ctrl K */}
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search links, analytics, or settings..."
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/70 pl-9 pr-14 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 select-none shadow-2xs">
                Ctrl K
              </div>
            </div>
          </div>

          {/* Right: Notifications & User Menu */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="size-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Profile Chip */}
            <div
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer select-none hover:opacity-80 transition-opacity"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="size-8 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200">
                  {(user?.name || "B").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name?.split(" ")[0] || "Bhavesh"}
                </span>
                <span className="text-[10px] text-slate-400 leading-tight">
                  @{user?.username || "creator"}
                </span>
              </div>
              <ChevronDown className="size-3.5 text-slate-400 hidden md:block" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
