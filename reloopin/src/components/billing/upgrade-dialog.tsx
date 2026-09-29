"use client";

import { useState } from "react";
import {
  BillingPlan,
  Subscription,
  PaymentMethod,
} from "@/lib/billing/billing-types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export type UpgradeDialogStep =
  | "review"
  | "processing"
  | "success"
  | "failure"
  | "platform_approval"
  | "platform_cancelled";

export function UpgradeDialog({
  open,
  onClose,
  currentPlan,
  targetPlan,
  subscription,
  paymentMethods,
  onConfirmUpgrade,
  onOpenAddPaymentMethod,
  onViewOverview,
  initialStep = "review",
}: {
  open: boolean;
  onClose: () => void;
  currentPlan: BillingPlan;
  targetPlan: BillingPlan;
  subscription: Subscription;
  paymentMethods: PaymentMethod[];
  onConfirmUpgrade: (planId: BillingPlan["id"]) => void;
  onOpenAddPaymentMethod: () => void;
  onViewOverview: () => void;
  initialStep?: UpgradeDialogStep;
}) {
  const [step, setStep] = useState<UpgradeDialogStep>(initialStep);
  const isPlatformMode = subscription.billingMode === "platform";
  const primaryCard = paymentMethods.find((pm) => pm.isPrimary) || paymentMethods[0];

  const handleStartUpgrade = async () => {
    if (isPlatformMode) {
      setStep("platform_approval");
      return;
    }

    if (!primaryCard) {
      onOpenAddPaymentMethod();
      return;
    }

    setStep("processing");
    await new Promise((r) => setTimeout(r, 1200));

    // Complete upgrade
    onConfirmUpgrade(targetPlan.id);
    setStep("success");
    toast.success(`Upgraded to ${targetPlan.name} plan successfully.`);
  };

  const handleSimulatePlatformApprove = async () => {
    setStep("processing");
    await new Promise((r) => setTimeout(r, 1000));
    onConfirmUpgrade(targetPlan.id);
    setStep("success");
    toast.success(`Shopify subscription approved for ${targetPlan.name}.`);
  };

  const handleSimulatePlatformReject = () => {
    setStep("platform_cancelled");
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
        step === "success"
          ? `You're now on ${targetPlan.name}`
          : step === "failure"
          ? "We couldn't upgrade your plan"
          : step === "platform_cancelled"
          ? "Upgrade not completed"
          : `Upgrade to ${targetPlan.name}?`
      }
      description={
        step === "success"
          ? "Your new limits and features are ready to use."
          : step === "failure"
          ? "Your current plan is still active and you haven't been charged. Try again or update your payment method."
          : step === "platform_cancelled"
          ? "Your current plan is still active. No subscription changes were made."
          : "Your plan will change immediately. You'll get access to the new limits and features after the upgrade is confirmed."
      }
    >
      <div className="space-y-5 pt-3">
        {/* Step: REVIEW */}
        {step === "review" && (
          <div className="space-y-4 text-xs">
            {/* Plan comparison summary box */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Current plan</span>
                <span className="font-semibold text-[var(--foreground)]">{currentPlan.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">New plan</span>
                <span className="font-bold text-[var(--primary)]">{targetPlan.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">New monthly price</span>
                <span className="font-bold text-[var(--foreground)]">
                  ${targetPlan.monthlyPrice} per month
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Effective date</span>
                <span className="font-medium text-[var(--foreground)]">Today</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Next billing date</span>
                <span className="font-medium text-[var(--foreground)]">18 November 2026</span>
              </div>
            </div>

            {/* Payment Method / Billing mode notice */}
            {isPlatformMode ? (
              <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-2.5">
                <ExternalLink size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-[var(--foreground)] block">
                    Complete your upgrade through Shopify
                  </strong>
                  <p className="text-[var(--muted-foreground)] mt-0.5">
                    You’ll be redirected to Shopify to review and approve the subscription charge.
                  </p>
                </div>
              </div>
            ) : primaryCard ? (
              <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center font-bold text-[10px]">
                    {primaryCard.brand.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--foreground)] block">
                      {primaryCard.brand.toUpperCase()} ending in {primaryCard.last4}
                    </span>
                    <span className="text-[var(--muted-foreground)] text-[11px]">
                      Expires {primaryCard.expiryMonth}/{primaryCard.expiryYear}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Ready</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between">
                <div>
                  <strong className="text-[var(--foreground)] font-semibold block">
                    No payment method on file
                  </strong>
                  <p className="text-[var(--muted-foreground)] text-[11px] mt-0.5">
                    Please add a card before upgrading.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenAddPaymentMethod}
                  className="text-xs shrink-0"
                >
                  Add payment method
                </Button>
              </div>
            )}

            {/* Included features preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider block">
                Included with {targetPlan.name}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {targetPlan.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--foreground)]">
                    <Check size={13} className="text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[var(--border)]">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Not now
              </Button>
              {isPlatformMode ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleStartUpgrade}
                  className="gap-1.5 cursor-pointer font-medium"
                >
                  <ExternalLink size={14} />
                  Continue to Shopify
                </Button>
              ) : primaryCard ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleStartUpgrade}
                  className="gap-1.5 cursor-pointer font-medium"
                >
                  <Sparkles size={14} />
                  Upgrade to {targetPlan.name}
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onOpenAddPaymentMethod}
                  className="gap-1.5 cursor-pointer font-medium"
                >
                  <CreditCard size={14} />
                  Add payment method
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Step: PLATFORM APPROVAL REDIRECT SIMULATION */}
        {step === "platform_approval" && (
          <div className="py-6 text-center space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <ExternalLink size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--foreground)]">
                Shopify Subscription Approval
              </h4>
              <p className="text-[var(--muted-foreground)] max-w-sm mx-auto mt-1">
                In production, you would approve the ${targetPlan.monthlyPrice}/month subscription charge in your Shopify Admin.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSimulatePlatformReject}
                className="text-xs"
              >
                Simulate cancellation
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSimulatePlatformApprove}
                className="text-xs font-medium"
              >
                Simulate approval
              </Button>
            </div>
          </div>
        )}

        {/* Step: PROCESSING */}
        {step === "processing" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin mx-auto" />
            <div>
              <h4 className="text-sm font-semibold text-[var(--foreground)]">
                Upgrading your plan
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Keep this page open while we confirm your subscription.
              </p>
            </div>
          </div>
        )}

        {/* Step: SUCCESS */}
        {step === "success" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-[var(--foreground)] block">
                  Subscription confirmed
                </strong>
                <p className="text-[var(--muted-foreground)] mt-1">
                  You’ve successfully upgraded to {targetPlan.name} at ${targetPlan.monthlyPrice}/month. Your account limits have been expanded immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleClose();
                  onViewOverview();
                }}
              >
                View billing overview
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleClose}
              >
                Explore {targetPlan.name} features
              </Button>
            </div>
          </div>
        )}

        {/* Step: FAILURE */}
        {step === "failure" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-3 text-rose-700 dark:text-rose-400">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold block">Upgrade failed</strong>
                <p className="mt-1 opacity-90">
                  Your current plan remains {currentPlan.name}. No charges were made to your account.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenAddPaymentMethod}
              >
                Update payment method
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleStartUpgrade}
                className="gap-1.5"
              >
                <RotateCcw size={13} />
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Step: PLATFORM CANCELLED */}
        {step === "platform_cancelled" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 flex items-start gap-3">
              <AlertTriangle size={18} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-semibold text-[var(--foreground)] block">
                  Upgrade not completed
                </strong>
                <p className="text-[var(--muted-foreground)] mt-1">
                  Your current plan is still active. No subscription changes were made.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Back to plans
              </Button>
              <Button variant="default" size="sm" onClick={handleStartUpgrade}>
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
