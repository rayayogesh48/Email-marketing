"use client";

import { Crown, Sparkles, ArrowRight, ChevronRight, Plus } from "lucide-react";
import {
  DashboardVIPTierItem,
  DashboardVIPTierOverview,
} from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function VIPTierOverview({
  overview,
  onOpenTierSheet,
}: {
  overview: DashboardVIPTierOverview;
  onOpenTierSheet: (tier: DashboardVIPTierItem) => void;
}) {
  if (!overview.hasTiers || overview.tiers.length === 0) {
    return (
      <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
            VIP tier overview
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            See how customers are distributed across your VIP program.
          </p>

          <div className="mt-8 p-6 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-center flex flex-col items-center">
            <div className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-2">
              <Crown size={20} />
            </div>
            <h4 className="text-xs font-semibold text-[var(--foreground)]">
              Set up your VIP tiers
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm leading-relaxed">
              Create tiers that give your most loyal customers better earning benefits.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs h-7 rounded-md gap-1"
              asChild
            >
              <Link href="/vip-tiers/new">
                <Plus size={12} />
                <span>Create VIP tiers</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
              VIP tier overview
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              See how customers are distributed across your VIP program.
            </p>
          </div>

          <span className="text-xs text-[var(--muted-foreground)] tabular-nums">
            {overview.totalCustomers.toLocaleString()} members
          </span>
        </div>

        {/* Insight Callout */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[var(--secondary-container)] text-[var(--secondary)] text-xs font-medium my-2">
          <Sparkles size={12} />
          <span>{overview.insight}</span>
        </div>

        {/* Horizontal Proportional Bars */}
        <div className="space-y-3 mt-3">
          {overview.tiers.map((tier) => (
            <div
              key={tier.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenTierSheet(tier)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenTierSheet(tier);
                }
              }}
              className="group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-[var(--muted)]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
              aria-label={`${tier.name} tier: ${tier.customers.toLocaleString()} customers (${tier.percentage}%). Click for details.`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {tier.name}
                  </span>
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    {tier.threshold > 0 ? `(${tier.threshold.toLocaleString()}+ pts)` : "(0 pts)"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold tabular-nums text-[var(--foreground)]">
                    {tier.customers.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[var(--muted-foreground)] tabular-nums w-10 text-right">
                    {tier.percentage}%
                  </span>
                  <ChevronRight
                    size={13}
                    className="text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${tier.percentage}%`,
                    backgroundColor: tier.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">
          Total active: <strong className="text-[var(--foreground)]">{overview.totalCustomers.toLocaleString()}</strong>
        </span>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 px-2 text-xs font-medium text-[var(--primary)] gap-1 hover:bg-[var(--primary-container)]/30"
        >
          <Link href="/analytics?tab=vip">
            <span>Manage VIP tiers</span>
            <ArrowRight size={12} />
          </Link>
        </Button>
      </div>
    </div>
  );
}

