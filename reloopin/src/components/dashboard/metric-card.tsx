"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp, Minus, HelpCircle, ChevronRight } from "lucide-react";
import { DashboardKPICard } from "@/lib/dashboard/dashboard-types";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 64;
  const height = 24;
  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible shrink-0"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function MetricCard({
  card,
  onOpenSheet,
  isLoading = false,
}: {
  card: DashboardKPICard;
  onOpenSheet: (card: DashboardKPICard) => void;
  isLoading?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] animate-pulse space-y-3">
        <div className="h-3.5 w-24 bg-[var(--muted)] rounded" />
        <div className="h-7 w-28 bg-[var(--muted)] rounded" />
        <div className="h-3 w-32 bg-[var(--muted)] rounded" />
      </div>
    );
  }

  const isUp = card.comparisonDirection === "up";
  const isDown = card.comparisonDirection === "down";
  const strokeColor = card.comparisonIsPositive
    ? "var(--secondary)"
    : isDown
    ? "var(--destructive)"
    : "var(--muted-foreground)";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenSheet(card)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenSheet(card);
        }
      }}
      className="group relative flex flex-col justify-between p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs hover:border-[var(--ring)] hover:shadow-xs transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
      aria-label={`${card.label}: ${card.value}. Click for detailed breakdown.`}
    >
      {/* Top Header: Metric Label and Info Tooltip */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[var(--muted-foreground)] truncate">
          {card.label}
        </span>

        <div className="flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-0.5"
              aria-label={`About ${card.label}`}
            >
              <HelpCircle size={13} />
            </button>

            {showTooltip && (
              <div
                className="absolute right-0 top-5 w-56 p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-lg text-[11px] text-[var(--foreground)] z-30 font-normal leading-relaxed pointer-events-none"
                role="tooltip"
              >
                {card.tooltip}
              </div>
            )}
          </div>

          <ChevronRight
            size={14}
            className="text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>

      {/* Main Metric Value and Mini Trend Sparkline */}
      <div className="flex items-baseline justify-between gap-2 mt-2">
        <span className="text-2xl sm:text-[26px] font-bold text-[var(--foreground)] tracking-tight tabular-nums">
          {card.value}
        </span>
        <Sparkline data={card.sparkline} color={strokeColor} />
      </div>

      {/* Footer: Comparison Badge or Supporting Copy */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs">
        {card.comparison ? (
          <div
            className={`inline-flex items-center gap-1 font-semibold text-[11px] px-1.5 py-0.5 rounded-full ${
              card.comparisonIsPositive
                ? "bg-[var(--secondary-container)] text-[var(--secondary)]"
                : isDown
                ? "bg-[var(--destructive-container)] text-[var(--destructive)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            {isUp && <TrendingUp size={11} />}
            {isDown && <TrendingDown size={11} />}
            {!isUp && !isDown && <Minus size={11} />}
            <span>{card.comparison}</span>
          </div>
        ) : card.supportingCopy ? (
          <span className="text-[11px] text-[var(--muted-foreground)]">
            {card.supportingCopy}
          </span>
        ) : null}
      </div>
    </div>
  );
}

