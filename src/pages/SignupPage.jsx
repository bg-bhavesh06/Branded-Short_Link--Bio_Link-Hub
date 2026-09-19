import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signup with email verification simulation will be implemented in the backend phase as specified in Project Brief 04.");
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bhavesh"
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
                placeholder="you@example.com"
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
                placeholder="••••••••"
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
              className="w-full bg-slate-950 hover:bg-slate-800 text-white rounded-xl py-2.5 font-semibold text-sm shadow-md mt-2"
            >
              Get Started Free →
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Note: Email verification simulation will be triggered during the backend authentication phase.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
