import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, User, AtSign, Mail, Lock, Eye, EyeOff, AlertCircle, X, ArrowRight, Zap, CreditCard, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/links", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password) return setError("Please fill in all fields.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");

    setLoading(true);
    const res = await signup({
      name: form.name.trim(),
      username: form.username.toLowerCase().trim().replace(/\s+/g, ""),
      email: form.email.toLowerCase().trim(),
      password: form.password,
    });
    setLoading(false);

    if (res.success) navigate("/links", { replace: true });
    else setError(res.message || "Failed to create account.");
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-50 font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img src="/auth-bg.jpg" alt="Background" className="w-full h-full object-cover opacity-70 filter blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/80" />
      </div>

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform">
            <Link2 className="size-4.5 rotate-45" />
          </div>
          <span className="font-extrabold text-xl text-slate-900">Branded link<span className="text-blue-600">Hub</span></span>
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium">Already have an account?</span>
          <Link to="/login" className="px-3.5 py-1.5 rounded-full border border-blue-300 bg-white/90 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xs">Sign In</Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-1">
        <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-xl space-y-3">
          <div className="text-center space-y-0.5">
            <div className="inline-flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-0.5">
              <Link2 className="size-4.5 rotate-45" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Create your account</h1>
            <p className="text-[11px] text-slate-500">Bring all your links together in one place.</p>
          </div>

          {error && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <div className="flex items-center gap-1.5"><AlertCircle className="size-3.5" /><span>{error}</span></div>
              <button type="button" onClick={() => setError("")}><X className="size-3.5 text-rose-400" /></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700">Full Name</label>
              <div className="relative mt-0.5">
                <User className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Johnson" className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">Username</label>
              <div className="relative mt-0.5">
                <AtSign className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="alexjohnson" className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">Email address</label>
              <div className="relative mt-0.5">
                <Mail className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">Password</label>
              <div className="relative mt-0.5">
                <Lock className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                <input type={showPassword ? "text" : "password"} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" className="w-full pl-9 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all mt-1">
              <span>{loading ? "Creating Account..." : "Create Account"}</span>
              <ArrowRight className="size-3.5" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1 text-center text-[10px] text-slate-500 font-medium">
            <div className="flex flex-col items-center gap-0.5"><Zap className="size-3 text-blue-600" /><span>Free forever</span></div>
            <div className="flex flex-col items-center gap-0.5"><CreditCard className="size-3 text-blue-600" /><span>No credit card</span></div>
            <div className="flex flex-col items-center gap-0.5"><Sparkles className="size-3 text-blue-600" /><span>Customizable</span></div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-2 text-center text-[11px] text-slate-500">© {new Date().getFullYear()} Branded linkHub. All rights reserved.</footer>
    </div>
  );
}
