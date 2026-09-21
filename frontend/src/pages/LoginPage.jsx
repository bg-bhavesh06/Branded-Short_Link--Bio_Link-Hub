import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Link2, AlertCircle, X, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectUrl = searchParams.get("redirect")?.startsWith("/") ? searchParams.get("redirect") : "/links";

  useEffect(() => {
    if (isAuthenticated) navigate(redirectUrl, { replace: true });
  }, [isAuthenticated, navigate, redirectUrl]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  const executeLogin = async (eMail, pwd) => {
    setError("");
    if (!eMail.trim() || !pwd) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const res = await login(eMail, pwd);
    setLoading(false);
    if (res.success) navigate(redirectUrl, { replace: true });
    else setError(res.message || "Invalid credentials.");
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl text-slate-900 group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Link2 className="size-5 rotate-45" />
            </div>
            <span>Link<span className="text-blue-600">Hub</span></span>
          </Link>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
          <p className="mt-1 text-xs text-slate-500">
            Or <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">create a new account for free</Link>
          </p>
        </div>

        <Card className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 space-y-4">
          {/* Demo Account Auto-Fill */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 flex items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Sparkles className="size-3.5 text-blue-600 shrink-0" />
                <span>Demo Account (HR / Reviewer)</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">demo@gmail.com • demo@123</div>
            </div>
            <button
              type="button"
              onClick={() => { setEmail("demo@gmail.com"); setPassword("demo@123"); }}
              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shrink-0 shadow-xs cursor-pointer active:scale-95 transition-transform"
            >
              Auto-Fill
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button type="button" onClick={() => setError("")} className="p-1 rounded-md text-rose-400 hover:text-rose-700 cursor-pointer">
                <X className="size-3.5" />
              </button>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); executeLogin(email, password); }} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email address</label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@gmail.com" className="rounded-xl text-xs h-9.5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</Link>
              </div>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="rounded-xl text-xs h-9.5" />
            </div>

            <div className="space-y-2 pt-1">
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 font-semibold text-xs shadow-md h-9.5 cursor-pointer">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setEmail("demo@gmail.com"); setPassword("demo@123"); executeLogin("demo@gmail.com", "demo@123"); }}
                disabled={loading}
                className="w-full rounded-xl border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-blue-700 text-xs font-bold h-9 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="size-3.5 text-blue-600" />
                <span>⚡ One-Click Demo Login</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
