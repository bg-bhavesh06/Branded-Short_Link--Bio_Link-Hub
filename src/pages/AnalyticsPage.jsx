import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MousePointer2,
  Users,
  TrendingUp,
  RotateCcw,
  Calendar,
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
import { API_ENDPOINTS } from "@/lib/api";

const API_BASE = API_ENDPOINTS.analytics;

export function AnalyticsPage() {
  const navigate = useNavigate();

  // Range and filter state
  const [timeRange, setTimeRange] = useState("30D");
  const [selectedDateRange, setSelectedDateRange] = useState("30 Days");
  const [selectedLink, setSelectedLink] = useState("All Links");
  const [selectedDevice, setSelectedDevice] = useState("All Devices");
  const [selectedReferrer, setSelectedReferrer] = useState("All Sources");

  // Real data states
  const [isLoading, setIsLoading] = useState(true);
  const [userLinks, setUserLinks] = useState([]);
  const [overviewData, setOverviewData] = useState({
    totalClicks: 0,
    uniqueVisitors: 0,
    averageDailyClicks: 0,
    returningVisitors: 0,
  });
  const [overTimeData, setOverTimeData] = useState([]);
  const [topLinksData, setTopLinksData] = useState([]);
  const [topReferrersData, setTopReferrersData] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const [copiedToast, setCopiedToast] = useState("");

  const rangeQuery = timeRange.toLowerCase(); // '7d', '30d', '90d'

  // Fetch all analytics datasets
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);

      const [overviewRes, overTimeRes, topLinksRes, referrersRes, devicesRes, recentRes, linksRes] =
        await Promise.all([
          fetch(`${API_BASE}/overview?range=${rangeQuery}`, { credentials: "include" }),
          fetch(`${API_BASE}/clicks-over-time?range=${rangeQuery}`, { credentials: "include" }),
          fetch(`${API_BASE}/top-links?range=${rangeQuery}`, { credentials: "include" }),
          fetch(`${API_BASE}/top-referrers?range=${rangeQuery}`, { credentials: "include" }),
          fetch(`${API_BASE}/devices?range=${rangeQuery}`, { credentials: "include" }),
          fetch(`${API_BASE}/recent`, { credentials: "include" }),
          fetch(API_ENDPOINTS.links, { credentials: "include" }),
        ]);

      if (overviewRes.ok) {
        const d = await overviewRes.json();
        if (d.success) setOverviewData(d.data);
      }
      if (overTimeRes.ok) {
        const d = await overTimeRes.json();
        if (d.success) setOverTimeData(d.data);
      }
      if (topLinksRes.ok) {
        const d = await topLinksRes.json();
        if (d.success) setTopLinksData(d.data);
      }
      if (referrersRes.ok) {
        const d = await referrersRes.json();
        if (d.success) setTopReferrersData(d.data);
      }
      if (devicesRes.ok) {
        const d = await devicesRes.json();
        if (d.success) setDevicesData(d.data);
      }
      if (recentRes.ok) {
        const d = await recentRes.json();
        if (d.success) setRecentData(d.data);
      }
      if (linksRes.ok) {
        const d = await linksRes.json();
        if (d.success) setUserLinks(d.links || []);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [rangeQuery]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText?.(url);
    setCopiedToast(url);
    setTimeout(() => setCopiedToast(""), 3000);
  };

  const isEmpty = !isLoading && overviewData.totalClicks === 0;

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
          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

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
                <option value="All Links">All Links ({userLinks.length})</option>
                {userLinks.map((l) => (
                  <option key={l.id} value={l.shortCode}>
                    /{l.shortCode}
                  </option>
                ))}
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
                <option value="Mobile">Mobile</option>
                <option value="Desktop">Desktop</option>
                <option value="Tablet">Tablet</option>
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
                <option value="Direct">Direct / None</option>
                <option value="Google">Google</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
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
              className="text-xs text-blue-600 hover:underline font-semibold self-end lg:self-center cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 3. EMPTY STATE (When user has no clicks) */}
      {isEmpty ? (
        <Card className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4">
            <BarChart2 className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No click data yet</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">
            Share your short links to start collecting real-time click telemetry, referrers, and visitor insights.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/links")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-semibold text-sm shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>View & Create Links</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* 4. TOP STATISTICS (4 Cards Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AnalyticsStatCard
              title="Total Clicks"
              value={overviewData.totalClicks.toLocaleString()}
              change={`Across selected ${timeRange.toLowerCase()} period`}
              icon={MousePointer2}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
            <AnalyticsStatCard
              title="Unique Visitors"
              value={overviewData.uniqueVisitors.toLocaleString()}
              change="Based on privacy-safe hashed IPs"
              icon={Users}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
            <AnalyticsStatCard
              title="Average Daily Clicks"
              value={overviewData.averageDailyClicks.toString()}
              change={`Average over ${timeRange.toLowerCase()}`}
              icon={TrendingUp}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
            <AnalyticsStatCard
              title="Returning Visitors"
              value={overviewData.returningVisitors.toLocaleString()}
              change="Visitors with >1 click in period"
              icon={RotateCcw}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
              loading={isLoading}
            />
          </div>

          {/* 5. CLICKS OVER TIME (Large Area/Line Chart) */}
          <ClicksChart
            timeRange={timeRange}
            data={overTimeData}
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
                data={topLinksData}
                onCopyLink={handleCopyLink}
                copiedLink={copiedToast}
              />
            </div>
            <div className="lg:col-span-5">
              <TopReferrersCard loading={isLoading} data={topReferrersData} />
            </div>
          </div>

          {/* 7. TWO-COLUMN: DEVICE DISTRIBUTION & RECENT ACTIVITY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <DeviceDistribution loading={isLoading} data={devicesData} />
            </div>
            <div className="lg:col-span-7">
              <RecentActivity loading={isLoading} data={recentData} />
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
            <div className="text-slate-500 font-mono truncate max-w-xs">{copiedToast}</div>
          </div>
        </div>
      )}
    </div>
  );
}
