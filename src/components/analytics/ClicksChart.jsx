import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export function ClicksChart({ timeRange = "7D", onRangeChange, loading = false }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Mock data sets for 7D, 30D, 90D
  const datasets = {
    "7D": [
      { label: "Mon", fullDate: "Sep 15", value: 420 },
      { label: "Tue", fullDate: "Sep 16", value: 580 },
      { label: "Wed", fullDate: "Sep 17", value: 510 },
      { label: "Thu", fullDate: "Sep 18", value: 760 },
      { label: "Fri", fullDate: "Sep 19", value: 920 },
      { label: "Sat", fullDate: "Sep 20", value: 840 },
      { label: "Sun", fullDate: "Sep 21", value: 1020 },
    ],
    "30D": [
      { label: "W1", fullDate: "Sep 1 - 7", value: 2450 },
      { label: "W2", fullDate: "Sep 8 - 14", value: 2980 },
      { label: "W3", fullDate: "Sep 15 - 21", value: 3410 },
      { label: "W4", fullDate: "Sep 22 - 28", value: 3642 },
    ],
    "90D": [
      { label: "Jul", fullDate: "July 2025", value: 9800 },
      { label: "Aug", fullDate: "August 2025", value: 11250 },
      { label: "Sep", fullDate: "September 2025", value: 12482 },
    ],
  };

  const currentData = datasets[timeRange] || datasets["7D"];
  const maxVal = Math.max(...currentData.map((d) => d.value)) * 1.15;
  const minVal = 0;

  // SVG Chart Dimensions
  const width = 720;
  const height = 240;
  const paddingX = 40;
  const paddingY = 25;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Coordinates calculation
  const points = currentData.map((d, index) => {
    const x = paddingX + (index / (currentData.length - 1)) * chartWidth;
    const y = height - paddingY - ((d.value - minVal) / (maxVal - minVal)) * chartHeight;
    return { ...d, x, y };
  });

  // Construct SVG paths
  const linePath = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    // Smooth cubic curve
    const prev = points[i - 1];
    const cp1x = prev.x + (point.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (point.x - prev.x) / 2;
    const cp2y = point.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
  }, "");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-slate-200 rounded-md" />
            <div className="h-3 w-56 bg-slate-100 rounded-md" />
          </div>
          <div className="h-8 w-28 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-56 bg-slate-50 rounded-xl border border-slate-100" />
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
        <div>
          <CardTitle className="text-lg font-bold text-slate-900">Clicks Over Time</CardTitle>
          <CardDescription className="text-xs sm:text-sm text-slate-500 mt-1">
            Track how your links are performing over time.
          </CardDescription>
        </div>

        {/* Range Selector Pill Buttons */}
        <div className="inline-flex items-center rounded-xl bg-slate-100/90 p-1 border border-slate-200/60 self-start sm:self-auto">
          {["7D", "30D", "90D"].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onRangeChange?.(range)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="relative w-full overflow-hidden">
          {/* Responsive SVG Area Chart */}
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                <stop offset="85%" stopColor="#2563eb" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = height - paddingY - pct * chartHeight;
              const val = Math.round(minVal + pct * (maxVal - minVal));
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray={i === 0 ? "none" : "3 3"}
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono font-medium"
                  >
                    {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                  </text>
                </g>
              );
            })}

            {/* Gradient Fill under the line */}
            <path d={areaPath} fill="url(#blueGradient)" />

            {/* Blue line */}
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((pt, i) => {
              const isHovered = hoveredPoint?.label === pt.label;
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Invisible touch/hover target */}
                  <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />

                  {/* Outer circle on hover */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7"
                      fill="#2563eb"
                      fillOpacity="0.2"
                      className="animate-ping"
                    />
                  )}

                  {/* Dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 5 : 3.5}
                    fill="#ffffff"
                    stroke="#2563eb"
                    strokeWidth={isHovered ? 2.5 : 2}
                    className="transition-all duration-150"
                  />

                  {/* X Axis Label */}
                  <text
                    x={pt.x}
                    y={height - 6}
                    textAnchor="middle"
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? "fill-blue-600 font-bold" : "fill-slate-500"
                    }`}
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-full mb-2 z-10 rounded-xl bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg transition-all"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100}%`,
              }}
            >
              <div className="font-semibold text-[11px] text-slate-300">{hoveredPoint.fullDate}</div>
              <div className="font-bold text-sm text-white flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-blue-400" />
                <span>{hoveredPoint.value.toLocaleString()} clicks</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
