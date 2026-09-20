import React from "react";
import { Link } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Everything a creator needs to get started.",
      features: [
        "Unlimited URL shortening",
        "1 custom Link-in-Bio page",
        "Basic click analytics (7-day history)",
        "Standard QR codes",
        "Community support",
      ],
      cta: "Get Started Free",
      variant: "outline",
      popular: false,
    },
    {
      name: "Creator Pro",
      price: "$9",
      period: "per month",
      description: "Advanced analytics, custom vanity slugs & branded themes.",
      features: [
        "Custom branded domains & slugs",
        "Unlimited Link-in-Bio pages",
        "Full telemetry & device analytics",
        "Customized QR codes with colors",
        "Priority support",
      ],
      cta: "Start Free Trial",
      variant: "default",
      popular: true,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Transparent Pricing
        </span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Simple, Creator-Friendly Pricing
        </h1>
        <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto">
          Start for free, upgrade whenever you need custom branding and advanced click telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`rounded-3xl border p-8 relative flex flex-col justify-between ${
              plan.popular
                ? "border-blue-600 shadow-xl shadow-blue-500/10 ring-2 ring-blue-600/20"
                : "border-slate-200 shadow-sm"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-8 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
            )}
            <div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-bold text-slate-900">{plan.name}</CardTitle>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-sm font-medium text-slate-500">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2 text-sm text-slate-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <div className="mt-6 border-t border-slate-100 pt-6 space-y-3">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter className="p-0 mt-8">
              <Link to="/signup" className="w-full">
                <Button
                  variant={plan.variant}
                  className={`w-full rounded-xl py-2.5 font-semibold text-sm ${
                    plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md" : ""
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
