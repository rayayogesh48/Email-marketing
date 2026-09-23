"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Store,
  Award,
  Crown,
  Palette,
  Edit2,
  Zap,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { OnboardingState, OnboardingStep } from "@/lib/onboarding/onboarding-types";

export function ReviewSetup({
  state,
  onNavigateToStep,
  onActivateSuccess,
  onSaveAndExit,
  overrideState,
}: {
  state: OnboardingState;
  onNavigateToStep: (step: OnboardingStep) => void;
  onActivateSuccess: () => void;
  onSaveAndExit: () => void;
  overrideState?: string;
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isActivating, setIsActivating] = useState(
    overrideState === "activating"
  );
  const [activationFailed, setActivationFailed] = useState(
    overrideState === "activation_failed"
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activationSteps = [
    "Activating earning rule",
    "Publishing VIP tiers",
    "Applying widget branding",
    "Finalizing store connection",
  ];

  const handleStartActivation = () => {
    setShowConfirmModal(false);
    setIsActivating(true);
    setActivationFailed(false);
    setActiveStepIndex(0);

    // Progress through the 4 publishing steps
    const timer1 = setTimeout(() => setActiveStepIndex(1), 600);
    const timer2 = setTimeout(() => setActiveStepIndex(2), 1200);
    const timer3 = setTimeout(() => setActiveStepIndex(3), 1800);
    const timer4 = setTimeout(() => {
      setIsActivating(false);
      onActivateSuccess();
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  // Validation checks
  const isStoreReady =
    state.storeConnection.connectionState === "sync_complete" ||
    state.storeConnection.connectionState === "connected";
  const isRuleReady = Boolean(
    state.earningRule.pointsEarned && state.earningRule.perOrderSpend
  );
  const areTiersReady = state.vipTiers.length >= 1;
  const isBrandingReady = Boolean(state.branding.brandColor);

  const hasBlockingErrors =
    !isStoreReady ||
    !isRuleReady ||
    !areTiersReady ||
    !isBrandingReady ||
    overrideState === "missing_store_connection" ||
    overrideState === "invalid_earning_rule" ||
    overrideState === "invalid_tiers";

  return (
    <div className="max-w-[780px] mx-auto py-8 sm:py-10 px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Review your loyalty program
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
          Check the setup before making it available to customers.
        </p>
      </div>

      <div className="space-y-6">
        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Store Connection Card */}
          <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center">
                  <Store size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep("connect-store")}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={11} />
                  <span>Edit connection</span>
                </button>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Connected Store
              </h4>
              <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">
                {state.storeConnection.storeName || "Northstar Goods"}
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                WooCommerce · 2,486 customers synced
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-[var(--secondary)] font-semibold">
              <CheckCircle2 size={13} />
              <span>Store connected</span>
            </div>
          </div>

          {/* 2. Earning Rule Card */}
          <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--secondary-container)] text-[var(--secondary)] flex items-center justify-center">
                  <Award size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep("points-rule")}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={11} />
                  <span>Edit earning rule</span>
                </button>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Purchase Earning Rule
              </h4>
              <p className="text-sm font-bold text-[var(--foreground)] mt-0.5">
                {state.earningRule.pointsEarned || 1} point per ${state.earningRule.perOrderSpend || 1} spent
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                {state.earningRule.minimumOrder
                  ? `Min order $${state.earningRule.minimumOrder}`
                  : "No minimum order"}{" "}
                ·{" "}
                {state.earningRule.maximumPoints
                  ? `Max ${state.earningRule.maximumPoints} pts`
                  : "No maximum points limit"}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-[var(--secondary)] font-semibold">
              <CheckCircle2 size={13} />
              <span>Rule configured</span>
            </div>
          </div>

          {/* 3. VIP Tiers Card */}
          <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--warning-container)] text-[var(--warning)] flex items-center justify-center">
                  <Crown size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep("vip-tiers")}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={11} />
                  <span>Edit tiers</span>
                </button>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                VIP Milestones ({state.vipTiers.length} tiers)
              </h4>
              <div className="mt-1 space-y-1">
                {state.vipTiers.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-1.5 text-[var(--foreground)] font-medium">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </span>
                    <span className="text-[var(--muted-foreground)] tabular-nums">
                      {t.minimumPoints.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-[var(--secondary)] font-semibold">
              <CheckCircle2 size={13} />
              <span>VIP tiers valid</span>
            </div>
          </div>

          {/* 4. Branding Card */}
          <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center">
                  <Palette size={16} />
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateToStep("branding")}
                  className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={11} />
                  <span>Edit branding</span>
                </button>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                Store Widget Branding
              </h4>
              <div className="mt-2 flex items-center gap-3">
                <span
                  className="w-8 h-8 rounded-lg shadow-2xs flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ backgroundColor: state.branding.brandColor || "#4F46E5" }}
                >
                  ★
                </span>
                <div>
                  <p className="text-xs font-bold font-mono text-[var(--foreground)]">
                    {state.branding.brandColor || "#4F46E5"}
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {state.branding.storeName || "Northstar Goods"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-xs text-[var(--secondary)] font-semibold">
              <CheckCircle2 size={13} />
              <span>Branding matched</span>
            </div>
          </div>
        </div>

        {/* Validation Checklist */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            Pre-activation verification
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--muted)]/40">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" />
              <span>Store connected & webhooks live</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--muted)]/40">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" />
              <span>Customer & order sync complete</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--muted)]/40">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" />
              <span>Earning rules valid</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--muted)]/40">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" />
              <span>VIP tier milestones ordered</span>
            </div>
          </div>
        </div>

        {/* Informational Callout: What happens after activation? */}
        <div className="p-4 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] space-y-2">
          <h4 className="text-xs font-bold text-[var(--foreground)]">
            What happens after activation?
          </h4>
          <ul className="text-xs text-[var(--muted-foreground)] space-y-1 list-disc list-inside">
            <li>Customers begin earning points from eligible orders placed on your store.</li>
            <li>Existing customers remain at 0 points until new eligible activity.</li>
            <li>Shoppers can open and interact with the storefront loyalty widget.</li>
            <li>You can configure redeemable rewards, point multipliers, and campaigns anytime from the dashboard.</li>
          </ul>
        </div>

        {/* Activation Failed Warning if applicable */}
        {activationFailed && (
          <div className="p-4 rounded-xl bg-[var(--destructive-container)]/20 border border-[var(--destructive)]/40 flex items-start gap-3">
            <XCircle size={18} className="text-[var(--destructive)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-[var(--destructive)]">
                Your loyalty program could not be activated
              </h4>
              <p className="text-xs text-[var(--muted-foreground)]">
                Your setup is saved. Fix the issue or try activating again. Widget settings could not be published.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveAndExit}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Save and exit
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setShowConfirmModal(true)}
            disabled={hasBlockingErrors || isActivating}
            className="w-full sm:w-auto text-xs h-10 px-6 font-bold gap-2 shadow-xs bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            <Zap size={14} />
            <span>Activate loyalty program</span>
          </Button>
        </div>
      </div>

      {/* ACTIVATION CONFIRMATION MODAL */}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Activate your loyalty program?"
        description="Customers will begin earning points from eligible orders after activation."
      >
        <div className="space-y-4 mt-3">
          <div className="p-3 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] divide-y divide-[var(--border)] text-xs">
            <div className="py-1.5 flex justify-between">
              <span className="text-[var(--muted-foreground)]">Store</span>
              <span className="font-semibold text-[var(--foreground)]">
                {state.storeConnection.storeName || "Northstar Goods"}
              </span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-[var(--muted-foreground)]">Earning rate</span>
              <span className="font-semibold text-[var(--foreground)]">
                {state.earningRule.pointsEarned || 1} point per ${state.earningRule.perOrderSpend || 1}
              </span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-[var(--muted-foreground)]">VIP tiers</span>
              <span className="font-semibold text-[var(--foreground)]">
                {state.vipTiers.length} milestones
              </span>
            </div>
            <div className="py-1.5 flex justify-between">
              <span className="text-[var(--muted-foreground)]">Existing customers</span>
              <span className="font-semibold text-[var(--foreground)]">
                2,486 synchronized
              </span>
            </div>
          </div>

          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Once activated, the storefront loyalty widget will go live on Northstar Goods.
          </p>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--border)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmModal(false)}
              className="text-xs"
            >
              Continue editing
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleStartActivation}
              className="text-xs font-bold gap-1.5 bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              <Zap size={13} />
              <span>Activate program</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* ACTIVATING ANIMATION MODAL */}
      <Modal
        open={isActivating}
        onClose={() => {}}
        title="Activating your loyalty program"
        description="We're publishing your earning rule, VIP tiers, and widget settings."
      >
        <div className="space-y-5 mt-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center mx-auto shadow-xs">
            <Loader2 size={28} className="animate-spin" />
          </div>

          <div className="space-y-2 max-w-xs mx-auto text-left">
            {activationSteps.map((stepLabel, idx) => {
              const isDone = activeStepIndex > idx;
              const isCurrent = activeStepIndex === idx;

              return (
                <div
                  key={stepLabel}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors ${
                    isCurrent
                      ? "bg-[var(--primary-container)]/30 font-bold text-[var(--foreground)]"
                      : isDone
                        ? "text-[var(--secondary)] font-medium"
                        : "text-[var(--muted-foreground)] opacity-50"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} className="shrink-0 text-[var(--secondary)]" />
                  ) : isCurrent ? (
                    <Loader2 size={14} className="animate-spin shrink-0 text-[var(--primary)]" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />
                  )}
                  <span>{stepLabel}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-[var(--muted-foreground)]">
            Please wait while we synchronize your settings with WooCommerce...
          </p>
        </div>
      </Modal>
    </div>
  );
}
