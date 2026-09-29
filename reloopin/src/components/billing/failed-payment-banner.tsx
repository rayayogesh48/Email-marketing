"use client";

import { Subscription, BillingPermission } from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function FailedPaymentBanner({
  subscription,
  permission,
  gracePeriodEndsAt,
  isRetrying,
  onRetryPayment,
  onUpdatePaymentMethod,
}: {
  subscription: Subscription;
  permission: BillingPermission;
  gracePeriodEndsAt: string;
  isRetrying: boolean;
  onRetryPayment: () => void;
  onUpdatePaymentMethod: () => void;
}) {
  const isFailed = subscription.status === "payment_failed";
  const isPastDue = subscription.status === "past_due";
  const isOwnerOrAdmin = permission === "owner" || permission === "billing_admin";

  if (!isFailed && !isPastDue) return null;

  return (
    <div className="mb-6 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="space-y-1">
            <strong className="text-sm font-bold block text-[var(--foreground)]">
              {isFailed ? "Your payment failed" : "Payment past due — Grace period active"}
            </strong>
            <p className="text-xs text-[var(--foreground)] opacity-90 max-w-xl">
              We couldn’t process the payment for your Growth plan. Update your payment method before{" "}
              <span className="font-semibold underline">{gracePeriodEndsAt}</span> to avoid losing access to paid features.
            </p>
            <p className="text-[11px] text-[var(--muted-foreground)] pt-0.5">
              Your plan remains active during the grace period. Your customer and loyalty data will not be affected.
            </p>
          </div>
        </div>

        {isOwnerOrAdmin && (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onUpdatePaymentMethod}
              className="text-xs gap-1.5 bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]"
            >
              <CreditCard size={13} />
              Update payment method
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onRetryPayment}
              disabled={isRetrying}
              className="text-xs gap-1.5 font-medium"
            >
              <RotateCcw size={13} className={isRetrying ? "animate-spin" : ""} />
              {isRetrying ? "Retrying payment..." : "Try payment again"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
