"use client";

import { useState } from "react";
import { BillingPlan, Subscription, UsageMetric } from "@/lib/billing/billing-types";
import { cancellationReasons } from "@/lib/billing/billing-data";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, ShieldCheck, HeartCrack } from "lucide-react";
import { toast } from "sonner";

export function CancelSubscriptionDialog({
  open,
  onClose,
  plan,
  subscription,
  metrics,
  onConfirmCancel,
}: {
  open: boolean;
  onClose: () => void;
  plan: BillingPlan;
  subscription: Subscription;
  metrics: UsageMetric[];
  onConfirmCancel: (reason?: string) => void;
}) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [step, setStep] = useState<"confirm" | "success">("confirm");
  const customerMetric = metrics.find((m) => m.id === "customers");

  const handleCancel = () => {
    onConfirmCancel(selectedReason);
    setStep("success");
    toast.success("Subscription cancellation scheduled.");
  };

  const handleClose = () => {
    setStep("confirm");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        step === "success"
          ? "Subscription cancellation scheduled"
          : `Cancel your ${plan.name} subscription?`
      }
      description={
        step === "success"
          ? `Your ${plan.name} plan remains active until ${subscription.currentPeriodEnd || "18 October 2026"}.`
          : `Your plan will remain active until ${subscription.currentPeriodEnd || "18 October 2026"}. After that, your account will move to Starter.`
      }
    >
      <div className="space-y-4 pt-3 text-xs">
        {step === "confirm" ? (
          <>
            {/* Impact details */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Cancellation effective date</span>
                <span className="font-semibold text-[var(--foreground)]">
                  {subscription.currentPeriodEnd || "18 October 2026"}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">New plan</span>
                <span className="font-semibold text-[var(--foreground)]">Starter (Free)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Customer capacity</span>
                <span className="font-medium text-[var(--foreground)]">
                  Drops to 500 (currently {customerMetric?.current.toLocaleString() || "1,620"})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Features lost</span>
                <span className="text-[var(--muted-foreground)]">
                  Multi-store sync, Automated campaigns, Priority SLA
                </span>
              </div>
            </div>

            {/* Reassurance */}
            <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[var(--foreground)]">
                Your existing customer records and point history will remain safe and accessible.
              </p>
            </div>

            {/* Optional survey */}
            <div className="space-y-2 pt-2">
              <label className="font-semibold text-[var(--foreground)] block">
                What made you cancel? (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {cancellationReasons.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                      selectedReason === r.id
                        ? "border-[var(--primary)] bg-[var(--primary)]/5 font-semibold text-[var(--foreground)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--border)]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Keep {plan.name}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                className="font-medium cursor-pointer"
              >
                Cancel subscription
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-[var(--foreground)] block">
                  Cancellation scheduled
                </strong>
                <p className="text-[var(--muted-foreground)] mt-1">
                  You can change your mind and reactivate your subscription at any time before {subscription.currentPeriodEnd || "18 October 2026"}.
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
      </div>
    </Modal>
  );
}
