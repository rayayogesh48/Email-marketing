"use client";

import { useState } from "react";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DashboardDateRange,
  DashboardPrototypeState,
} from "@/lib/dashboard/dashboard-types";

const PROTOTYPE_STATES: { id: DashboardPrototypeState; label: string }[] = [
  { id: "default", label: "Default (Operational)" },
  { id: "loading", label: "Loading (Skeletons)" },
  { id: "first_run", label: "First run (New live store)" },
  { id: "low_data", label: "Low data (Early insights)" },
  { id: "no_activity", label: "No loyalty activity" },
  { id: "onboarding_incomplete", label: "Onboarding incomplete" },
  { id: "no_earning_rule", label: "No active earning rule" },
  { id: "no_reward", label: "No active reward" },
  { id: "store_switching", label: "Store switching (Overlay)" },
  { id: "disconnected", label: "Store disconnected (Full page)" },
  { id: "syncing", label: "Syncing (Background)" },
  { id: "stale_data", label: "Stale data (Warning)" },
  { id: "partial_error", label: "Partial error (Section)" },
  { id: "page_error", label: "Page error (Full page)" },
  { id: "restricted", label: "Restricted access (No permission)" },
  { id: "roi_unavailable", label: "ROI unavailable" },
  { id: "no_recent_activity", label: "No recent activity" },
];

export function DashboardHeader({
  currentStoreSlug,
  onSwitchStore,
  dateRange,
  onDateRangeChange,
  freshnessLabel,
  prototypeState,
  onPrototypeStateChange,
  onRefresh,
  isRefreshing,
}: {
  currentStoreSlug?: string;
  onSwitchStore?: (storeSlug: string) => void;
  dateRange: DashboardDateRange;
  onDateRangeChange: (range: DashboardDateRange) => void;
  freshnessLabel: string;
  prototypeState: DashboardPrototypeState;
  onPrototypeStateChange: (state: DashboardPrototypeState) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [showFreshnessTooltip, setShowFreshnessTooltip] = useState(false);

  return (
    <header className="mb-6 space-y-4">
      {/* Top row: Title, Subtitle, and Dev State Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Dashboard
            </h1>
            <span className="inline-flex items-center rounded-md bg-[var(--muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted-foreground)] border border-[var(--border)]">
              Overview
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5">
            See how your loyalty program is performing.
          </p>
        </div>

        {/* Prototype State Switcher (Dev-only preview) */}
        <div className="self-start sm:self-auto shrink-0 flex items-center gap-2 bg-[var(--muted)]/60 border border-[var(--border)] rounded-lg px-2.5 py-1.5 shadow-2xs">
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
            Preview state:
          </span>
          <select
            value={prototypeState}
            onChange={(e) =>
              onPrototypeStateChange(e.target.value as DashboardPrototypeState)
            }
            className="bg-transparent text-xs font-medium text-[var(--foreground)] border-0 focus:outline-none cursor-pointer"
            aria-label="Select prototype state"
          >
            {PROTOTYPE_STATES.map((s) => (
              <option key={s.id} value={s.id} className="bg-[var(--card)] text-[var(--foreground)]">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Global Toolbar: Date controls, Store context, Freshness, and Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
        {/* Left: Store Selector and Date Range Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {onSwitchStore && (
            <div className="inline-flex items-center gap-1.5 bg-[var(--card)] border border-[var(--border)] rounded-md px-2.5 h-8 text-xs shadow-2xs hover:border-[var(--ring)] transition-colors">
              <span className="text-[11px] text-[var(--muted-foreground)] font-medium">Store:</span>
              <select
                value={
                  currentStoreSlug === "urban" || currentStoreSlug === "urban-goods"
                    ? "urban-goods"
                    : "northstar-goods"
                }
                onChange={(e) => onSwitchStore(e.target.value)}
                className="bg-transparent text-[var(--foreground)] font-semibold text-xs border-0 focus:outline-none cursor-pointer py-0"
                aria-label="Select store"
              >
                <option value="northstar-goods" className="bg-[var(--card)]">
                  Northstar Goods (WooCommerce)
                </option>
                <option value="urban-goods" className="bg-[var(--card)]">
                  Urban Goods (Shopify)
                </option>
              </select>
            </div>
          )}

          <div className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] rounded-md px-2.5 h-8 text-xs shadow-2xs hover:border-[var(--ring)] transition-colors">
            <Calendar size={13} className="text-[var(--muted-foreground)] shrink-0" />
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value as DashboardDateRange)}
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
        </div>

        {/* Right: Freshness indicator & Refresh Button */}
        <div className="flex items-center gap-2">
          {/* Freshness Status with Tooltip */}
          <div
            className="relative hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] cursor-help px-2 h-8 rounded-md border border-transparent hover:border-[var(--border)] hover:bg-[var(--card)] transition-colors"
            onMouseEnter={() => setShowFreshnessTooltip(true)}
            onMouseLeave={() => setShowFreshnessTooltip(false)}
            tabIndex={0}
            role="status"
            aria-label={freshnessLabel}
          >
            <Clock size={12} className="text-[var(--muted-foreground)]" />
            <span className="text-[11px] font-medium whitespace-nowrap">
              {freshnessLabel}
            </span>

            {showFreshnessTooltip && (
              <div
                className="absolute right-0 top-9 w-64 p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl text-xs text-[var(--foreground)] z-40 font-normal leading-relaxed pointer-events-none animate-in fade-in zoom-in-95 duration-100"
                role="tooltip"
              >
                Store orders and loyalty events are automatically synchronized every 15 minutes. Click refresh to query the store connection now.
              </div>
            )}
          </div>

          {/* Refresh Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard data"
            className="h-8 px-2.5 text-xs rounded-md shadow-2xs gap-1.5"
          >
            <RefreshCw
              size={12}
              className={isRefreshing ? "animate-spin text-[var(--primary)]" : ""}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
