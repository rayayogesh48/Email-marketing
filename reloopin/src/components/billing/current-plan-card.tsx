"use client";

import {
  BillingPlan,
  Subscription,
  BillingPermission,
} from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RotateCcw,
} from "lucide-react";

export function CurrentPlanCard({
  plan,
  subscription,
  permission,
  onChangePlan,
  onReactivate,
  onCancelScheduledDowngrade,
  onManageSubscription,
}: {
  plan: BillingPlan;
  subscription: Subscription;
  permission: BillingPermission;
  onChangePlan: () => void;
  onReactivate: () => void;
  onCancelScheduledDowngrade: () => void;
  onManageSubscription: () => void;
}) {
  const isOwnerOrAdmin = permission === "owner" || permission === "billing_admin";
  const isStarter = plan.id === "starter";
  const isTrial = subscription.status === "trialing";
  const isCancelScheduled = subscription.status === "cancel_scheduled";
  const isCancelled = subscription.status === "cancelled";
  const isDowngradeScheduled = !!subscription.scheduledPlanId;

  // Status badge config
  const getStatusBadge = () => {
    switch (subscription.status) {
      case "free":
        return { label: "Free", bg: "bg-[var(--muted)] text-[var(--muted-foreground)]" };
      case "trialing":
        return { label: "Trial", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400" };
      case "active":
        return { label: "Active", bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" };
      case "past_due":
        return { label: "Payment due", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
      case "payment_failed":
        return { label: "Payment failed", bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400" };
      case "cancel_scheduled":
        return { label: "Cancellation scheduled", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400" };
      case "cancelled":
        return { label: "Cancelled", bg: "bg-[var(--muted)] text-[var(--muted-foreground)]" };
      default:
        return { label: "Active", bg: "bg-emerald-500/10 text-emerald-600" };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="space-y-4">
      {/* Trial callout */}
      {isTrial && (
        <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[var(--foreground)] block">
                Your trial ends in 7 days
              </strong>
              <p className="text-[var(--muted-foreground)] mt-0.5">
                Upgrade before {subscription.trialEndsAt || "18 October"} to keep access to {plan.name} features.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isOwnerOrAdmin ? (
              <Button size="sm" onClick={onChangePlan} className="text-xs">
                Choose a plan
              </Button>
            ) : (
              <span className="text-[11px] text-[var(--muted-foreground)] italic">
                Only the account owner or billing admin can change the subscription.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Scheduled cancellation callout */}
      {isCancelScheduled && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[var(--foreground)] block">
                Your subscription ends on {subscription.currentPeriodEnd || "18 October"}
              </strong>
              <p className="text-[var(--muted-foreground)] mt-0.5">
                You can continue using {plan.name} features until the end of your current billing period.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isOwnerOrAdmin ? (
              <Button size="sm" variant="default" onClick={onReactivate} className="text-xs">
                Keep subscription
              </Button>
            ) : (
              <span className="text-[11px] text-[var(--muted-foreground)] italic">
                Only the account owner or billing admin can change the subscription.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Scheduled downgrade callout */}
      {isDowngradeScheduled && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[var(--foreground)] block">
                Your plan will change to Starter
              </strong>
              <p className="text-[var(--muted-foreground)] mt-0.5">
                Your {plan.name} plan remains active until {subscription.currentPeriodEnd || "18 October"}. After that, Starter limits will apply.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isOwnerOrAdmin ? (
              <Button size="sm" variant="outline" onClick={onCancelScheduledDowngrade} className="text-xs">
                Keep {plan.name}
              </Button>
            ) : (
              <span className="text-[11px] text-[var(--muted-foreground)] italic">
                Only the account owner or billing admin can change the subscription.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cancelled state callout */}
      {isCancelled && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-[var(--foreground)] block">
                Your paid subscription has ended
              </strong>
              <p className="text-[var(--muted-foreground)] mt-0.5">
                Your account is now on Starter. Your existing customer data is still available.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isOwnerOrAdmin ? (
              <Button size="sm" onClick={onChangePlan} className="text-xs">
                Choose a plan
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* Main Current-Plan Card */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                {plan.name} plan
              </h2>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                {badge.label}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              {isStarter ? (
                <span className="text-2xl font-bold text-[var(--foreground)]">
                  Free plan
                </span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-[var(--foreground)]">
                    ${plan.monthlyPrice}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] font-medium">
                    per month
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-[var(--muted-foreground)] max-w-md">
              {plan.description}
            </p>

            {!isStarter && subscription.currentPeriodEnd && !isCancelled && (
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] pt-1">
                <Calendar size={13} className="shrink-0 text-[var(--muted-foreground)]" />
                <span>
                  {isCancelScheduled
                    ? `Access ends on ${subscription.currentPeriodEnd}`
                    : `Your next payment is due on ${subscription.currentPeriodEnd}.`}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 self-start shrink-0">
            {isOwnerOrAdmin ? (
              <>
                <Button
                  onClick={onChangePlan}
                  variant="default"
                  size="sm"
                  className="text-xs font-medium gap-1.5 cursor-pointer"
                >
                  <Sparkles size={13} />
                  {isStarter ? "Upgrade plan" : isCancelled ? "Choose a plan" : "Change plan"}
                </Button>
                {!isStarter && (
                  <Button
                    onClick={onManageSubscription}
                    variant="outline"
                    size="sm"
                    className="text-xs font-medium cursor-pointer"
                  >
                    Manage subscription
                  </Button>
                )}
              </>
            ) : (
              <div className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/50 text-[11px] text-[var(--muted-foreground)] max-w-xs">
                Only the account owner or billing admin can change the subscription.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
