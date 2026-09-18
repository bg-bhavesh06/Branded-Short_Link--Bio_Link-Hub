import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Module Preview
        </span>
      </div>

      <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <CardHeader className="p-0 mb-6">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4">
            <BarChart3 className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Click Analytics & Metrics Aggregation
          </CardTitle>
          <CardDescription className="text-slate-500 text-base">
            Detailed telemetry metrics capturing click timestamps, referrers, device breakdown (Desktop, Mobile, Tablet), and growth rates.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100 pt-6">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <p className="text-sm font-medium text-slate-600">
              Analytics dashboard metrics ready for asynchronous event logging pipeline.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/">
                <Button variant="outline" className="rounded-xl">Return to Landing Page</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
