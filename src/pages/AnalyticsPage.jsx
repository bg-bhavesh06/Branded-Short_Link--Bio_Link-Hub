import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MousePointer2,
  Users,
  TrendingUp,
  RotateCcw,
  Calendar,
  Filter,
  BarChart2,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnalyticsStatCard } from "@/components/analytics/AnalyticsStatCard";
import { ClicksChart } from "@/components/analytics/ClicksChart";
import { TopLinksCard } from "@/components/analytics/TopLinksCard";
import { TopReferrersCard } from "@/components/analytics/TopReferrersCard";
import { DeviceDistribution } from "@/components/analytics/DeviceDistribution";
import { RecentActivity } from "@/components/analytics/RecentActivity";

export function AnalyticsPage() {
  const navigate = useNavigate();

  // Filter & Control States
  const [timeRange, setTimeRange] = useState("30D");
  const [selectedDateRange, setSelectedDateRange] = useState("30 Days");
  const [selectedLink, setSelectedLink] = useState("All Links");
  const [selectedDevice, setSelectedDevice] = useState("All Devices");
  const [selectedReferrer, setSelectedReferrer] = useState("All Sources");

  // UI Interactive States (Loading simulation & Empty state preview)
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [copiedToast, setCopiedToast] = useState("");

  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText?.(url);
    setCopiedToast(url);
    setTimeout(() => setCopiedToast(""), 3000);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  // Dynamic values adjusted by selected time range
  const statData = {
    "7D": {
      clicks: "4,150",
      visitors: "2,740",
      avgDaily: "592",
      returning: "64%",
    },
    "30D": {
      clicks: "12,482",
      visitors: "8,321",
      avgDaily: "1,842",
      returning: "68%",
    },
    "90D": {
      clicks: "34,210",
      visitors: "21,800",
      avgDaily: "1,940",
      returning: "71%",
    },
  };

  const currentStats = statData[timeRange] || statData["30D"];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            Understand how people interact with your short links.
          </p>
        </div>

        {/* Top-Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick UI State Toggle Pills for Testing */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={simulateLoading}
              title="Simulate Skeleton Loading State"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                isLoading
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              <span className="flex items-center gap-1">
                <RefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
                Loading
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsEmpty(!isEmpty)}
              title="Toggle Empty State"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                isEmpty
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
            >
              Empty State
            </button>
          </div>

          {/* Date Range Selector Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs hover:border-slate-300 transition-colors">
              <Calendar className="size-4 text-slate-500" />
              <select
                value={selectedDateRange}
                onChange={(e) => {
                  setSelectedDateRange(e.target.value);
                  if (e.target.value === "7 Days") setTimeRange("7D");
                  else if (e.target.value === "30 Days") setTimeRange("30D");
                  else if (e.target.value === "90 Days") setTimeRange("90D");
                }}
                className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none cursor-pointer pr-2"
              >
                <option value="7 Days">7 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS FILTERS ROW */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <SlidersHorizontal className="size-4 text-blue-600" />
            <span>Filters:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 lg:max-w-2xl">
            {/* Filter by Link */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 focus-within:bg-white focus-within:border-blue-600">
              <span className="text-slate-400 text-xs mr-2 font-medium">Link:</span>
              <select
                value={selectedLink}
                onChange={(e) => setSelectedLink(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All Links">All Links (5)</option>
                <option value="YouTube">YouTube (/r/youtube)</option>
                <option value="GitHub">GitHub (/r/github)</option>
                <option value="Portfolio">Portfolio (/r/portfolio)</option>
                <option value="Resume">Resume (/r/resume)</option>
                <option value="Instagram">Instagram (/r/instagram)</option>
              </select>
            </div>

            {/* Filter by Device */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 focus-within:bg-white focus-within:border-blue-600">
              <span className="text-slate-400 text-xs mr-2 font-medium">Device:</span>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All Devices">All Devices</option>
                <option value="Mobile">Mobile (58%)</option>
                <option value="Desktop">Desktop (34%)</option>
                <option value="Tablet">Tablet (8%)</option>
              </select>
            </div>

            {/* Filter by Referrer */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 focus-within:bg-white focus-within:border-blue-600">
              <span className="text-slate-400 text-xs mr-2 font-medium">Source:</span>
              <select
                value={selectedReferrer}
                onChange={(e) => setSelectedReferrer(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All Sources">All Sources</option>
                <option value="Direct">Direct (28%)</option>
                <option value="Google">Google (26%)</option>
                <option value="Instagram">Instagram (22%)</option>
                <option value="YouTube">YouTube (15%)</option>
                <option value="Facebook">Facebook (9%)</option>
              </select>
            </div>
          </div>

          {(selectedLink !== "All Links" ||
            selectedDevice !== "All Devices" ||
            selectedReferrer !== "All Sources") && (
            <button
              type="button"
              onClick={() => {
                setSelectedLink("All Links");
                setSelectedDevice("All Devices");
                setSelectedReferrer("All Sources");
              }}
              className="text-xs text-blue-600 hover:underline font-semibold self-end lg:self-center"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. EMPTY STATE (When toggled or no data) */}
      {isEmpty ? (
        <Card className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4">
            <BarChart2 className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No analytics yet</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            Share your short links to start collecting click data, referrers, and visitor insights.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/links")}
              className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl px-5 py-2.5 font-semibold text-sm shadow-sm flex items-center gap-2"
            >
              <span>View Links</span>
              <ArrowRight className="size-4" />
            </Button>
            <Button
              onClick={() => setIsEmpty(false)}
              variant="outline"
              className="rounded-xl"
            >
              Show Demo Data
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* 4. TOP STATISTICS (4 Cards Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AnalyticsStatCard
              title="Total Clicks"
              value={currentStats.clicks}
              change="↑ 28% from last month"
              icon={MousePointer2}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
            <AnalyticsStatCard
              title="Unique Visitors"
              value={currentStats.visitors}
              change="↑ 18% from last month"
              icon={Users}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
            <AnalyticsStatCard
              title="Average Daily Clicks"
              value={currentStats.avgDaily}
              change="↑ 12% from last month"
              icon={TrendingUp}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
            <AnalyticsStatCard
              title="Returning Visitors"
              value={currentStats.returning}
              change="↑ 8% from last month"
              icon={RotateCcw}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
          </div>

          {/* 5. CLICKS OVER TIME (Large Area/Line Chart) */}
          <ClicksChart
            timeRange={timeRange}
            onRangeChange={(r) => {
              setTimeRange(r);
              if (r === "7D") setSelectedDateRange("7 Days");
              else if (r === "30D") setSelectedDateRange("30 Days");
              else if (r === "90D") setSelectedDateRange("90 Days");
            }}
            loading={isLoading}
          />

          {/* 6. TWO-COLUMN: TOP PERFORMING LINKS & TOP REFERRERS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <TopLinksCard
                loading={isLoading}
                onCopyLink={handleCopyLink}
                copiedLink={copiedToast}
              />
            </div>
            <div className="lg:col-span-5">
              <TopReferrersCard loading={isLoading} />
            </div>
          </div>

          {/* 7. TWO-COLUMN: DEVICE DISTRIBUTION & RECENT ACTIVITY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <DeviceDistribution loading={isLoading} />
            </div>
            <div className="lg:col-span-7">
              <RecentActivity loading={isLoading} />
            </div>
          </div>
        </>
      )}

      {/* Toast Notification when link copied */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl shadow-emerald-500/10 animate-in slide-in-from-bottom-5">
          <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">
            ✓
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900">Link copied!</div>
            <div className="text-slate-500 font-mono">{copiedToast}</div>
          </div>
        </div>
      )}
    </div>
  );
}
