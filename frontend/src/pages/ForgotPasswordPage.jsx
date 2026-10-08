import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link2, Mail, Lock, Eye, EyeOff, KeyRound, CheckCircle2, ShieldCheck, AlertCircle, X, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function ForgotPasswordPage() {
  const { forgotPassword, verifyOtp, resetPassword } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Please enter your email.");
    setLoading(true);
    const res = await forgotPassword(email.trim());
    setLoading(false);
    if (res.success) {
      setStep(2);
    } else setError(res.message || "Failed to process request.");
  };

  const handleOtpChange = (index, value) => {
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) document.getElementById(`otp-input-${index + 1}`)?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const entered = otp.join("");
    if (entered.length < 6) return setError("Please enter all 6 digits of the OTP code.");
    
    setLoading(true);
    const res = await verifyOtp(email.trim(), entered);
    setLoading(false);

    if (res.success) {
      setStep(3);
    } else {
      setError(res.message || "Invalid or expired OTP code.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    const res = await resetPassword(otp.join(""), password);
    setLoading(false);
    if (res.success) setStep(4);
    else setError(res.message || "Invalid or expired OTP code.");
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
        <Link to="/login" className="px-3.5 py-1.5 rounded-full border border-blue-300 bg-white/90 text-blue-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xs flex items-center gap-1"><ArrowLeft className="size-3.5" />Sign In</Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-[400px] bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-7 shadow-xl space-y-4">
          {error && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              <div className="flex items-center gap-2"><AlertCircle className="size-3.5" /><span>{error}</span></div>
              <button type="button" onClick={() => setError("")}><X className="size-3.5 text-rose-400" /></button>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-1"><KeyRound className="size-5" /></div>
                <h1 className="text-xl font-bold text-slate-900">Forgot Password?</h1>
                <p className="text-xs text-slate-500">Enter your email to receive an OTP verification code.</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Email address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>{loading ? "Sending OTP..." : "Send OTP Code"}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md mb-1"><ShieldCheck className="size-5" /></div>
                <h1 className="text-xl font-bold text-slate-900">Verify OTP Code</h1>
                <p className="text-xs text-slate-500">We sent a 6-digit code to <span className="font-bold text-slate-700">{email}</span>. Please check your Gmail inbox.</p>
              </div>
              <div className="flex justify-between gap-1.5 pt-1">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-input-${i}`} type="text" maxLength={1} value={d} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-10 h-11 text-center font-bold text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none" />
                ))}
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>Verify OTP Code</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-3">
              <div className="text-center space-y-1">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md mb-1"><Lock className="size-5" /></div>
                <h1 className="text-xl font-bold text-slate-900">Set New Password</h1>
                <p className="text-xs text-slate-500">Choose your new password below.</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">New Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                  <input type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none text-slate-900" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all">
                <span>{loading ? "Updating..." : "Update Password"}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-4 py-2">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto border border-emerald-200"><CheckCircle2 className="size-8" /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Password Reset Successful!</h2>
                <p className="text-xs text-slate-500 mt-1">Your password has been updated securely.</p>
              </div>
              <Link to="/login" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all">
                <span>Sign In Now</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 py-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} Branded linkHub. All rights reserved.</footer>
    </div>
  );
}
