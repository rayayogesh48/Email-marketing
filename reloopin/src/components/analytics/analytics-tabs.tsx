"use client";

import { Award, Crown, TrendingUp } from "lucide-react";

export type AnalyticsTabId = "loyalty" | "vip" | "roi";

export function AnalyticsTabs({
  activeTab,
  onTabChange,
  className = "",
}: {
  activeTab: AnalyticsTabId;
  onTabChange: (tab: AnalyticsTabId) => void;
  className?: string;
}) {
  const tabs: {
    id: AnalyticsTabId;
    label: string;
    icon: typeof Award;
    iconColor: string;
  }[] = [
    {
      id: "loyalty",
      label: "Loyalty performance",
      icon: Award,
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "vip",
      label: "VIP tiers",
      icon: Crown,
      iconColor: "text-amber-500 dark:text-amber-400",
    },
    {
      id: "roi",
      label: "Program ROI",
      icon: TrendingUp,
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Analytics navigation tabs"
      className={`inline-flex h-8 items-center justify-start rounded-lg bg-[var(--muted)] p-0.5 text-[var(--muted-foreground)] border border-[var(--border)] shadow-2xs gap-0.5 ${className}`}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;

        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`analytics-panel-${t.id}`}
            id={`analytics-tab-${t.id}`}
            onClick={() => onTabChange(t.id)}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-[var(--ring)] ${
              isActive
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                : "hover:text-[var(--foreground)] hover:bg-[var(--card)]/50"
            }`}
          >
            <Icon size={13} className={`shrink-0 ${isActive ? t.iconColor : "text-[var(--muted-foreground)]"}`} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
