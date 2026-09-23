"use client";

import { TierDistributionItem } from "@/lib/analytics-data";
import { ChevronRight } from "lucide-react";

export function TierDistributionChart({
  distribution,
  onSelectTier,
}: {
  distribution: TierDistributionItem[];
  onSelectTier?: (tier: TierDistributionItem) => void;
}) {
  const totalCustomers = distribution.reduce((sum, d) => sum + d.customers, 0);

  return (
    <div className="w-full space-y-4" role="region" aria-label="Customers by tier distribution">
      {/* Segmented proportional overview bar */}
      <div className="space-y-2">
        <div className="h-3.5 rounded-full overflow-hidden flex bg-[var(--muted)] border border-[var(--border)] p-0.5 gap-0.5 shadow-2xs">
          {distribution.map((tier) => (
            <div
              key={tier.id}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300 relative cursor-pointer hover:opacity-85"
              style={{
                width: `${tier.percentage}%`,
                backgroundColor: tier.color,
              }}
              title={`${tier.name}: ${tier.customers.toLocaleString()} customers (${tier.percentage}%)`}
              onClick={() => onSelectTier?.(tier)}
            />
          ))}
        </div>

        {/* Mini Legend Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-[var(--muted-foreground)]">
          {distribution.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[var(--foreground)] transition-colors"
              onClick={() => onSelectTier?.(tier)}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: tier.color }}
              />
              <span className="font-semibold text-[var(--foreground)]">{tier.name}:</span>
              <span className="tabular-nums">{tier.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual proportional tier cards */}
      <div className="space-y-2 pt-1">
        {distribution.map((tier) => (
          <button
            key={tier.id}
            type="button"
            className="w-full text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--ring)] hover:shadow-xs transition-all group focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
            onClick={() => onSelectTier?.(tier)}
            aria-label={`${tier.name}: ${tier.customers} customers (${tier.percentage}%). Click to view details.`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: tier.color }}
                />
                <span className="font-semibold text-xs sm:text-sm text-[var(--foreground)]">
                  {tier.name}
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)] tabular-nums">
                  ({tier.threshold > 0 ? `${tier.threshold.toLocaleString()} pts` : "0 pts"})
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-bold text-[var(--foreground)] tabular-nums text-xs sm:text-sm">
                  {tier.customers.toLocaleString()}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 tabular-nums">
                  {tier.change}
                </span>
                <ChevronRight
                  size={14}
                  className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 transition-transform shrink-0"
                />
              </div>
            </div>

            {/* Proportional progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(tier.customers / totalCustomers) * 100}%`,
                  backgroundColor: tier.color,
                }}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="text-[11px] text-[var(--muted-foreground)] flex justify-between items-center pt-2 border-t border-[var(--border)]">
        <span>Total active members</span>
        <strong className="text-xs font-bold text-[var(--foreground)] tabular-nums">
          {totalCustomers.toLocaleString()}
        </strong>
      </div>
    </div>
  );
}
