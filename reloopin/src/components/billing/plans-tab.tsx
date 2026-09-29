"use client";

import {
  BillingPlan,
  BillingPlanId,
  Subscription,
  BillingPermission,
} from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import { PlanComparisonTable } from "./plan-comparison-table";
import { Check, Sparkles, ShieldAlert, ArrowUpRight } from "lucide-react";

export function PlansTab({
  plans,
  subscription,
  permission,
  onSelectUpgrade,
  onSelectDowngrade,
}: {
  plans: BillingPlan[];
  subscription: Subscription;
  permission: BillingPermission;
  onSelectUpgrade: (planId: BillingPlanId) => void;
  onSelectDowngrade: (planId: BillingPlanId) => void;
}) {
  const isOwnerOrAdmin = permission === "owner" || permission === "billing_admin";
  const currentPlanId = subscription.planId;
  const isCancelled = subscription.status === "cancelled";

  const getPlanButtonConfig = (plan: BillingPlan) => {
    const isCurrent = !isCancelled && currentPlanId === plan.id;

    if (isCurrent) {
      return {
        label: "Current plan",
        variant: "outline" as const,
        disabled: true,
        action: () => {},
      };
    }

    if (plan.id === "starter") {
      return {
        label: isCancelled ? "Choose Starter" : "Downgrade to Starter",
        variant: "outline" as const,
        disabled: !isOwnerOrAdmin,
        action: () => onSelectDowngrade("starter"),
      };
    }

    if (plan.id === "growth") {
      if (currentPlanId === "pro") {
        return {
          label: "Downgrade to Growth",
          variant: "outline" as const,
          disabled: !isOwnerOrAdmin,
          action: () => onSelectDowngrade("growth"),
        };
      }
      return {
        label: "Upgrade to Growth",
        variant: "default" as const,
        disabled: !isOwnerOrAdmin,
        action: () => onSelectUpgrade("growth"),
      };
    }

    // Pro
    return {
      label: "Upgrade to Pro",
      variant: "default" as const,
      disabled: !isOwnerOrAdmin,
      action: () => onSelectUpgrade("pro"),
    };
  };

  return (
    <div className="space-y-8">
      {/* Plans introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Available subscription plans
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Transparent pricing based on your loyalty program capacity and automation needs.
          </p>
        </div>

        {!isOwnerOrAdmin && (
          <div className="p-2 px-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 text-[11px] text-[var(--muted-foreground)] flex items-center gap-1.5 self-start">
            <ShieldAlert size={14} className="text-amber-500 shrink-0" />
            <span>Only the account owner or billing admin can change the subscription.</span>
          </div>
        )}
      </div>

      {/* 3 Compact Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const isCurrent = !isCancelled && currentPlanId === plan.id;
          const buttonConfig = getPlanButtonConfig(plan);

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all bg-[var(--card)] ${
                isCurrent
                  ? "border-[var(--primary)] ring-1 ring-[var(--primary)]/30 shadow-sm"
                  : plan.recommended
                  ? "border-[var(--primary)]/40 shadow-xs"
                  : "border-[var(--border)] shadow-xs"
              }`}
            >
              {/* Recommended pill */}
              {plan.recommended && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-semibold tracking-wider uppercase shadow-xs">
                  Recommended
                </div>
              )}

              {/* Current plan pill */}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[var(--foreground)] text-[var(--background)] text-[10px] font-semibold tracking-wider uppercase shadow-xs">
                  Current plan
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--foreground)]">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 py-1">
                  <span className="text-3xl font-extrabold text-[var(--foreground)]">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-medium">
                    per month
                  </span>
                </div>

                <div className="text-xs font-medium text-[var(--foreground)] pb-2 border-b border-[var(--border)]">
                  {plan.customerLimit === null ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Unlimited customers
                    </span>
                  ) : (
                    <span>Up to {plan.customerLimit.toLocaleString()} customers</span>
                  )}
                </div>

                {/* Key features preview */}
                <div className="space-y-2.5 text-xs text-[var(--muted-foreground)]">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[var(--foreground)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-[var(--border)]">
                <Button
                  onClick={buttonConfig.action}
                  variant={buttonConfig.variant}
                  disabled={buttonConfig.disabled}
                  className="w-full text-xs font-medium cursor-pointer"
                >
                  {buttonConfig.label}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Structured Comparison Table */}
      <PlanComparisonTable currentPlanId={currentPlanId} />
    </div>
  );
}
