"use client";

import { UsageMetric, BillingPermission } from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, ArrowUpRight } from "lucide-react";

export function UsageProgressRow({
  metric,
  permission,
  onComparePlans,
  onUpgradePlan,
}: {
  metric: UsageMetric;
  permission: BillingPermission;
  onComparePlans: () => void;
  onUpgradePlan: () => void;
}) {
  const isUnlimited = metric.limit === null;
  const isOwnerOrAdmin = permission === "owner" || permission === "billing_admin";

  let percentage = 0;
  if (!isUnlimited && metric.limit && metric.limit > 0) {
    percentage = Math.min(Math.round((metric.current / metric.limit) * 100), 100);
  }

  // Tier classification
  const isApproaching = !isUnlimited && percentage >= 75 && percentage < 90;
  const isNear = !isUnlimited && percentage >= 90 && percentage < 100;
  const isReached = !isUnlimited && percentage >= 100;

  // Remaining capacity calculation
  const remaining = !isUnlimited && metric.limit !== null ? Math.max(metric.limit - metric.current, 0) : null;

  // Progress bar styling
  const getProgressColor = () => {
    if (isReached) return "bg-rose-500";
    if (isNear) return "bg-amber-600";
    if (isApproaching) return "bg-amber-500";
    return "bg-[var(--primary)]";
  };

  return (
    <div className="py-4 border-b border-[var(--border)] last:border-b-0 space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
        <div className="flex items-center gap-2">
          <strong className="text-sm font-semibold text-[var(--foreground)]">
            {metric.name}
          </strong>
          {isReached && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle size={12} />
              Limit reached
            </span>
          )}
          {isNear && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle size={12} />
              Near limit
            </span>
          )}
          {isApproaching && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Approaching limit
            </span>
          )}
        </div>

        <div className="text-xs text-[var(--muted-foreground)] font-mono">
          <span className="font-semibold text-[var(--foreground)]">
            {metric.current.toLocaleString()}
          </span>
          {" "}of{" "}
          <span>{isUnlimited ? "Unlimited" : metric.limit?.toLocaleString()}</span>
        </div>
      </div>

      {/* Progress Bar (not shown for unlimited) */}
      {!isUnlimited ? (
        <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${metric.name} usage`}
          />
        </div>
      ) : (
        <div className="w-full h-1.5 rounded-full bg-emerald-500/20" />
      )}

      {/* Supporting message and inline action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <p className="text-[var(--muted-foreground)]">
          {metric.supportingMessage || (isUnlimited
            ? `${metric.current.toLocaleString()} active — unlimited capacity.`
            : `${remaining?.toLocaleString()} remaining capacity.`)}
        </p>

        {isOwnerOrAdmin && (
          <div className="flex items-center gap-2 self-start sm:self-center">
            {isReached && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onUpgradePlan}
                className="h-7 px-2.5 text-xs font-medium cursor-pointer"
              >
                Upgrade plan
              </Button>
            )}
            {isNear && (
              <Button
                variant="default"
                size="sm"
                onClick={onUpgradePlan}
                className="h-7 px-2.5 text-xs font-medium cursor-pointer"
              >
                Upgrade plan
              </Button>
            )}
            {isApproaching && (
              <Button
                variant="outline"
                size="sm"
                onClick={onComparePlans}
                className="h-7 px-2.5 text-xs font-medium cursor-pointer"
              >
                Compare plans
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
