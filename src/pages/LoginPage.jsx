import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Link2, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Authentication backend will be implemented in the next phase as specified in the project roadmap.");
  };

  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-slate-900 group"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Link2 className="size-5 rotate-45" />
            </div>
            <span>Link<span className="text-indigo-600">Hub</span></span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Or{" "}
            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account for free
            </Link>
          </p>
        </div>

        <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-500/5">
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Password reset will be available with backend auth."); }} className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-semibold text-sm shadow-md mt-2"
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Note: Pair Token Auth (JWT + Refresh Token in httpOnly cookies) will be connected in the backend phase.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
