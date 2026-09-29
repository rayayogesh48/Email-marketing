"use client";

import { BillingPlan, Subscription, BillingPermission } from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export function DangerZone({
  plan,
  subscription,
  permission,
  onOpenCancelModal,
  onOpenReactivateModal,
}: {
  plan: BillingPlan;
  subscription: Subscription;
  permission: BillingPermission;
  onOpenCancelModal: () => void;
  onOpenReactivateModal: () => void;
}) {
  const isPaid = plan.id !== "starter";
  const isOwner = permission === "owner";
  const isCancelScheduled = subscription.status === "cancel_scheduled";

  if (!isPaid) return null;

  return (
    <div className="pt-8 border-t border-[var(--border)]">
      <div className="p-6 rounded-2xl border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              {isCancelScheduled ? "Reactivate subscription" : "Cancel subscription"}
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] max-w-lg">
              {isCancelScheduled
                ? "Your subscription is scheduled to end. You can keep your Growth plan and prevent your account from downgrading to Starter."
                : "Downgrade your account to the free Starter tier. Your subscription features and customer limits will remain active until the end of your billing cycle."}
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            {isOwner ? (
              isCancelScheduled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenReactivateModal}
                  className="text-xs gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Keep {plan.name}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenCancelModal}
                  className="text-xs text-[var(--destructive)] border-[var(--destructive)]/30 hover:bg-[var(--destructive)]/10 cursor-pointer"
                >
                  Cancel subscription
                </Button>
              )
            ) : (
              <span className="text-[11px] text-[var(--muted-foreground)] italic">
                Only the account owner can cancel subscriptions.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
