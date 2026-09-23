"use client";

import { useState } from "react";
import { Info, ChevronRight } from "lucide-react";
import { KPICardData } from "@/lib/analytics-data";

function MiniSparkline({
  data,
  isPositive,
  id,
}: {
  data: number[];
  isPositive: boolean;
  id: string;
}) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 74;
  const height = 28;
  const pad = 2;

  const points = data.map((val, idx) => {
    const x = pad + (idx / (data.length - 1)) * (width - 2 * pad);
    const y = height - pad - ((val - min) / range) * (height - 2 * pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const strokeColor = isPositive ? "#16a34a" : "#e11d48";
  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width - pad},${height} L ${pad},${height} Z`;
  const gradId = `spark-grad-${id.replace(/[^a-zA-Z0-9]/g, "-")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="shrink-0 overflow-visible select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MetricCard({
  metric,
  onClick,
}: {
  metric: KPICardData;
  onClick?: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTrendBadgeStyle = () => {
    if (metric.comparisonDirection === "neutral") {
      return "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]";
    }
    return metric.comparisonIsPositive
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  };

  return (
    <div
      className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-[var(--ring)] hover:shadow-xs transition-all cursor-pointer group relative select-none focus-within:border-[var(--ring)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${metric.title}: ${metric.value}. ${metric.comparisonLabel}. Click to view details.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Top Row: Clean Title Header (No icon) + Info Tooltip */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors truncate">
          {metric.title}
        </span>

        {/* Info button & Tooltip */}
        <div
          className="relative inline-flex items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(!showTooltip);
          }}
        >
          <button
            type="button"
            className="w-4 h-4 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors focus:outline-none"
            aria-label={`Learn about ${metric.title}`}
          >
            <Info size={11} />
          </button>

          {showTooltip && (
            <div
              className="absolute right-0 top-5 w-60 p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl text-xs text-[var(--foreground)] z-40 font-normal leading-relaxed pointer-events-none animate-in fade-in zoom-in-95 duration-100"
              role="tooltip"
            >
              <div className="font-semibold text-xs mb-1 text-[var(--foreground)]">
                {metric.title}
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)]">
                {metric.tooltip}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Hero Number + Mini Sparkline */}
      <div className="flex items-end justify-between gap-2 my-1">
        <strong className="text-2xl sm:text-[26px] leading-tight font-bold tracking-tight text-[var(--foreground)] tabular-nums block">
          {metric.value}
        </strong>

        {metric.sparkline && (
          <div className="pb-0.5">
            <MiniSparkline
              data={metric.sparkline}
              isPositive={metric.comparisonIsPositive}
              id={metric.id}
            />
          </div>
        )}
      </div>

      {/* Bottom Row: Short Badge & Chevron */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/40 mt-1">
        <div
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border ${getTrendBadgeStyle()}`}
        >
          <span className="tabular-nums">{metric.comparisonLabel}</span>
        </div>

        <ChevronRight
          size={13}
          className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 transition-transform"
        />
      </div>
    </div>
  );
}

