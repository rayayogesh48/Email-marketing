"use client";

import { useState } from "react";
import {
  BillingPlan,
  Subscription,
  UsageMetric,
} from "@/lib/billing/billing-types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function DowngradeDialog({
  open,
  onClose,
  currentPlan,
  targetPlan,
  subscription,
  metrics,
  onScheduleDowngrade,
}: {
  open: boolean;
  onClose: () => void;
  currentPlan: BillingPlan;
  targetPlan: BillingPlan;
  subscription: Subscription;
  metrics: UsageMetric[];
  onScheduleDowngrade: (planId: BillingPlan["id"]) => void;
}) {
  const [step, setStep] = useState<"review" | "scheduled" | "failed">("review");
  const customerMetric = metrics.find((m) => m.id === "customers");
  const isUsageOverLimit =
    targetPlan.customerLimit !== null &&
    customerMetric &&
    customerMetric.current > targetPlan.customerLimit;

  const handleConfirm = () => {
    onScheduleDowngrade(targetPlan.id);
    setStep("scheduled");
    toast.success(`Downgrade to ${targetPlan.name} scheduled for ${subscription.currentPeriodEnd || "18 October 2026"}.`);
  };

  const handleClose = () => {
    setStep("review");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        step === "scheduled"
          ? "Downgrade scheduled"
          : step === "failed"
          ? "We couldn't schedule your downgrade"
          : `Downgrade to ${targetPlan.name}?`
      }
      description={
        step === "scheduled"
          ? `Your plan will change to ${targetPlan.name} on ${subscription.currentPeriodEnd || "18 October 2026"}. You can cancel this change before then.`
          : step === "failed"
          ? `Your ${currentPlan.name} plan is still active. Try again in a moment.`
          : `Your plan will change at the end of your current billing period on ${subscription.currentPeriodEnd || "18 October 2026"}.`
      }
    >
      <div className="space-y-4 pt-3 text-xs">
        {step === "review" && (
          <>
            {/* Usage limit warning if over limit */}
            {isUsageOverLimit && (
              <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-semibold text-[var(--foreground)] block">
                    Your current usage is above the {targetPlan.name} limit
                  </strong>
                  <p className="text-[var(--muted-foreground)]">
                    You currently have <span className="font-semibold text-[var(--foreground)]">{customerMetric.current.toLocaleString()}</span> active customers. {targetPlan.name} supports up to <span className="font-semibold text-[var(--foreground)]">{targetPlan.customerLimit?.toLocaleString()}</span> in this prototype.
                  </p>
                  <p className="text-[var(--muted-foreground)] pt-0.5">
                    Your existing customer data will remain available, but new customers may not be able to join until your usage is within the new limit.
                  </p>
                </div>
              </div>
            )}

            {/* Plan impact comparison */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Current plan</span>
                <span className="font-semibold text-[var(--foreground)]">{currentPlan.name} (${currentPlan.monthlyPrice}/mo)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">New plan</span>
                <span className="font-bold text-[var(--foreground)]">{targetPlan.name} (${targetPlan.monthlyPrice}/mo)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Effective date</span>
                <span className="font-medium text-[var(--foreground)]">{subscription.currentPeriodEnd || "18 October 2026"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Features lost</span>
                <span className="text-[var(--muted-foreground)] italic">Automations, Priority SLA</span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
              <span>We never delete your customer data or historical reward points.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Keep current plan
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleConfirm}
                className="font-medium cursor-pointer"
              >
                Schedule downgrade
              </Button>
            </div>
          </>
        )}

        {step === "scheduled" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-[var(--foreground)] block">
                  Downgrade scheduled
                </strong>
                <p className="text-[var(--muted-foreground)] mt-1">
                  Your {currentPlan.name} plan will remain active until {subscription.currentPeriodEnd || "18 October 2026"}. You will not be charged again.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="default" size="sm" onClick={handleClose}>
                Return to billing
              </Button>
            </div>
          </div>
        )}

        {step === "failed" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-3 text-rose-700 dark:text-rose-400">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold block">Scheduling failed</strong>
                <p className="mt-1 opacity-90">
                  Your {currentPlan.name} plan is still active. Try again in a moment.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Back to billing
              </Button>
              <Button variant="default" size="sm" onClick={handleConfirm}>
                <RotateCcw size={13} className="mr-1.5" />
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
