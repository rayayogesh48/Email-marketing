"use client";

import { UsageMetric, BillingPermission } from "@/lib/billing/billing-types";
import { UsageProgressRow } from "./usage-progress-row";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export function UsageSection({
  metrics,
  permission,
  isUnavailable = false,
  onRetry,
  onComparePlans,
  onUpgradePlan,
}: {
  metrics: UsageMetric[];
  permission: BillingPermission;
  isUnavailable?: boolean;
  onRetry?: () => void;
  onComparePlans: () => void;
  onUpgradePlan: () => void;
}) {
  return (
    <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            Plan usage & limits
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Monitor real-time consumption against your subscription capacity.
          </p>
        </div>
      </div>

      {isUnavailable ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center mx-auto">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              Usage data is temporarily unavailable
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Your subscription is still active. Try refreshing the page.
            </p>
          </div>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="text-xs gap-1.5">
              <RotateCcw size={13} />
              Try again
            </Button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {metrics.map((metric) => (
            <UsageProgressRow
              key={metric.id}
              metric={metric}
              permission={permission}
              onComparePlans={onComparePlans}
              onUpgradePlan={onUpgradePlan}
            />
          ))}
        </div>
      )}
    </div>
  );
}
