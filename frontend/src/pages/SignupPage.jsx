import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link2, CheckCircle2, AlertCircle, Sparkles, MailCheck, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, verifyEmail, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/links", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 6-second auto dismiss for error
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  // Simulated Email Verification State
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    const result = await signup({
      name: name.trim(),
      username: username.toLowerCase().trim().replace(/\s+/g, ""),
      email: email.toLowerCase().trim(),
      password,
    });
    setLoading(false);

    if (result.success) {
      navigate("/links", { replace: true });
    } else {
      setError(result.message || "Failed to create account.");
    }
  };

  const handleSimulatedVerify = async () => {
    if (!verificationToken) return;
    setVerifying(true);
    const res = await verifyEmail(verificationToken);
    setVerifying(false);

    if (res.success) {
      setVerifiedSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(res.message || "Email verification failed.");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-slate-900 group"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Link2 className="size-5 rotate-45" />
            </div>
            <span>Link<span className="text-blue-600">Hub</span></span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Create your LinkHub account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>

        <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
          {error && (
            <div className="mb-4 flex items-center justify-between gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError("")}
                className="p-1 rounded-md text-rose-400 hover:text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {verificationPending ? (
            <div className="space-y-5 text-center py-2 animate-in fade-in duration-200">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto border border-blue-200">
                <MailCheck className="size-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Verify Your Email Address
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We've created your account for <span className="font-semibold text-slate-700">{email}</span>.
                </p>
              </div>

              {verifiedSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-1">
                  <div>✓ Email verified successfully!</div>
                  <div className="text-[11px] text-emerald-600 font-normal">
                    Redirecting you to login...
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                  <div className="text-xs font-bold text-slate-900">
                    ⚡ Email Verification Simulation (Assessment):
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    As specified in the assessment requirements, real email delivery is simulated. Click below to verify your email instantly.
                  </p>
                  <Button
                    type="button"
                    onClick={handleSimulatedVerify}
                    disabled={verifying}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2 font-semibold text-xs shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {verifying ? (
                      <>
                        <span className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" />
                        <span>Simulate Email Verification & Activate Account</span>
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="pt-2 text-xs text-slate-400">
                Already verified?{" "}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Username</label>
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                  }
                  placeholder="alexmorgan"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email address</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-blue-600" />
                  <span>Free forever tier included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-blue-600" />
                  <span>No credit card required</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white rounded-xl py-2.5 font-semibold text-sm shadow-md mt-2 h-10"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  "Get Started Free →"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              By signing up, you agree to our{" "}
              <Link
                to="/terms"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-slate-600 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-slate-600 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
