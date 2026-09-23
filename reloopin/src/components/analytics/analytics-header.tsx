"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Download,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ComparisonOption,
  DateRangeOption,
  PrototypeState,
} from "@/lib/analytics-data";
import { AnalyticsTabId, AnalyticsTabs } from "./analytics-tabs";
import { PrototypeStateSwitcher } from "./prototype-state-switcher";

export function AnalyticsHeader({
  activeTab,
  onTabChange,
  dateRange,
  onDateRangeChange,
  comparison,
  onComparisonChange,
  comparisonRangeLabel,
  freshnessLabel,
  prototypeState,
  onPrototypeStateChange,
  onOpenExport,
  onRefresh,
  isRefreshing,
}: {
  activeTab?: AnalyticsTabId;
  onTabChange?: (tab: AnalyticsTabId) => void;
  dateRange: DateRangeOption;
  onDateRangeChange: (range: DateRangeOption) => void;
  comparison: ComparisonOption;
  onComparisonChange: (comp: ComparisonOption) => void;
  comparisonRangeLabel: string;
  freshnessLabel: string;
  prototypeState: PrototypeState;
  onPrototypeStateChange: (state: PrototypeState) => void;
  onOpenExport: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [showFreshnessTooltip, setShowFreshnessTooltip] = useState(false);

  return (
    <header className="mb-6 space-y-4">
      {/* Top row: Title & Dev State Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Analytics
          </h1>
          <span className="inline-flex items-center rounded-md bg-[var(--muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)] border border-[var(--border)]">
            Northstar
          </span>
        </div>

        {/* Development Prototype State Switcher */}
        <div className="self-start sm:self-auto shrink-0">
          <PrototypeStateSwitcher
            currentState={prototypeState}
            onStateChange={onPrototypeStateChange}
          />
        </div>
      </div>

      {/* Global Toolbar: Tab section on LEFT, Filter section on RIGHT */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
        {/* Left: Tab Section */}
        {activeTab && onTabChange ? (
          <div className="overflow-x-auto pb-0.5 xl:pb-0 shrink-0">
            <AnalyticsTabs activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        ) : (
          <div />
        )}

        {/* Right: Filter & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start xl:self-auto">
          {/* Date Range Dropdown */}
          <div className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-md px-2.5 h-8 text-xs shadow-2xs hover:border-[var(--ring)] transition-colors">
            <Calendar size={13} className="text-[var(--muted-foreground)] shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value as DateRangeOption)}
              className="bg-transparent text-[var(--foreground)] font-semibold text-xs border-0 focus:outline-none cursor-pointer py-0"
              aria-label="Select date range"
            >
              <option value="7d" className="bg-[var(--card)]">Last 7 days</option>
              <option value="30d" className="bg-[var(--card)]">Last 30 days</option>
              <option value="90d" className="bg-[var(--card)]">Last 90 days</option>
              <option value="year" className="bg-[var(--card)]">This year</option>
              <option value="custom" className="bg-[var(--card)]">Custom range</option>
            </select>
          </div>

          {/* Comparison Period Dropdown */}
          <div
            className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-md px-2.5 h-8 text-xs shadow-2xs hover:border-[var(--ring)] transition-colors"
            title={comparisonRangeLabel ? `Comparing against: ${comparisonRangeLabel}` : undefined}
          >
            <SlidersHorizontal size={12} className="text-[var(--muted-foreground)] shrink-0" />
            <span className="text-[var(--muted-foreground)] text-[11px] font-medium">vs:</span>
            <select
              value={comparison}
              onChange={(e) => onComparisonChange(e.target.value as ComparisonOption)}
              className="bg-transparent text-[var(--foreground)] font-semibold text-xs border-0 focus:outline-none cursor-pointer py-0"
              aria-label={`Select comparison period (${comparisonRangeLabel})`}
            >
              <option value="previous_period" className="bg-[var(--card)]">Previous period</option>
              <option value="previous_month" className="bg-[var(--card)]">Previous month</option>
              <option value="previous_year" className="bg-[var(--card)]">Previous year</option>
              <option value="none" className="bg-[var(--card)]">No comparison</option>
            </select>
          </div>

          {/* Data Freshness Indicator with Tooltip */}
          <div
            className="relative hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] cursor-help px-2 h-8 rounded-md border border-transparent hover:border-[var(--border)] hover:bg-[var(--card)] transition-colors"
            onMouseEnter={() => setShowFreshnessTooltip(true)}
            onMouseLeave={() => setShowFreshnessTooltip(false)}
            tabIndex={0}
            role="status"
            aria-label={freshnessLabel}
          >
            <Clock size={12} className="text-[var(--muted-foreground)]" />
            <span className="text-[11px] font-medium whitespace-nowrap">{freshnessLabel}</span>

            {showFreshnessTooltip && (
              <div
                className="absolute right-0 top-9 w-64 p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl text-xs text-[var(--foreground)] z-40 font-normal leading-relaxed pointer-events-none animate-in fade-in zoom-in-95 duration-100"
                role="tooltip"
              >
                Store orders and loyalty events are automatically synchronized
                every 15 minutes. Click refresh to query the store connection now.
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh data"
            className="h-8 px-2.5 text-xs rounded-md shadow-2xs gap-1.5"
          >
            <RefreshCw
              size={12}
              className={isRefreshing ? "animate-spin text-[var(--primary)]" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Export Button */}
          <Button
            variant="default"
            size="sm"
            onClick={onOpenExport}
            aria-label="Export analytics report"
            className="h-8 px-3 text-xs rounded-md shadow-xs gap-1.5"
          >
            <Download size={13} />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
