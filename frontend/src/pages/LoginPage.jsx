import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Link2, Mail, Lock, Eye, EyeOff, AlertCircle, X, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectUrl = searchParams.get("redirect")?.startsWith("/") ? searchParams.get("redirect") : "/links";

  useEffect(() => {
    if (isAuthenticated) navigate(redirectUrl, { replace: true });
  }, [isAuthenticated, navigate, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Please enter both email and password.");
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (res.success) navigate(redirectUrl, { replace: true });
    else setError(res.message || "Invalid credentials.");
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-50 font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/auth-bg.jpg" alt="Background" className="w-full h-full object-cover opacity-70 filter blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
      </div>

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <Link2 className="size-4.5 rotate-45" />
          </div>
          <span className="font-extrabold text-xl text-slate-900">Branded link<span className="text-blue-600">Hub</span></span>
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium">Don't have an account?</span>
          <Link to="/signup" className="px-3.5 py-1.5 rounded-full border border-blue-300 bg-white/90 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xs">Sign Up</Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-7 shadow-xl space-y-4">
          <div className="text-center space-y-1">
            <div className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-1">
              <Link2 className="size-5 rotate-45" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Sign in to your account</h1>
            <p className="text-xs text-slate-500">Welcome back! Your links are waiting for you.</p>
          </div>

          {error && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <div className="flex items-center gap-2"><AlertCircle className="size-3.5" /><span>{error}</span></div>
              <button type="button" onClick={() => setError("")}><X className="size-3.5 text-rose-400" /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Email address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </form>
        </div>
      </main>

      <footer className="relative z-10 py-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} Branded linkHub. All rights reserved.</footer>
    </div>
  );
}
