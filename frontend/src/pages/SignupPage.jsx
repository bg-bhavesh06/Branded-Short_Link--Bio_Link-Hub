import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, AlertCircle, Sparkles, X, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/links", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

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

  const handleAutoFillDemo = () => {
    setForm({
      name: "demo",
      username: "demo06",
      email: "demo@gmail.com",
      password: "demo@123",
    });
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
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">Create your LinkHub account</h2>
          <p className="mt-1 text-xs text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
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
              onClick={handleAutoFillDemo}
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <Input type="text" required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="demo" className="rounded-xl text-xs h-9.5" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Username</label>
              <Input type="text" required value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} placeholder="demo06" className="rounded-xl text-xs h-9.5" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email address</label>
              <Input type="email" required value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="demo@gmail.com" className="rounded-xl text-xs h-9.5" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Input type="password" required value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="At least 8 characters" className="rounded-xl text-xs h-9.5" />
            </div>

            <div className="space-y-1.5 pt-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3 text-blue-600" /><span>Free forever tier included</span></div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="size-3 text-blue-600" /><span>No credit card required</span></div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-slate-950 hover:bg-slate-800 text-white rounded-xl py-2 font-semibold text-xs shadow-md mt-1 h-10 cursor-pointer">
              {loading ? "Creating account..." : "Get Started Free →"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
