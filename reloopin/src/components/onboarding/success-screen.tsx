"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Gift,
  Mail,
  Users,
  Crown,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { getReadableBrandForeground } from "@/lib/onboarding/onboarding-validation";
import { OnboardingState } from "@/lib/onboarding/onboarding-types";

export function SuccessScreen({
  state,
  onGoToDashboard,
}: {
  state: OnboardingState;
  onGoToDashboard: () => void;
}) {
  const [showCustomerPreviewModal, setShowCustomerPreviewModal] =
    useState(false);

  const completedChecklist = [
    {
      title: "Store connected",
      desc: `${state.storeConnection.storeName || "Northstar Goods"} via WooCommerce`,
    },
    {
      title: "Earning rule created",
      desc: `${state.earningRule.pointsEarned || 1} point per $${state.earningRule.perOrderSpend || 1} spent`,
    },
    {
      title: "VIP tiers configured",
      desc: `${state.vipTiers.length} tier progression live`,
    },
    {
      title: "Widget customized",
      desc: `Storefront widget styled with ${state.branding.brandColor || "#4F46E5"}`,
    },
  ];

  const optionalNextSteps = [
    {
      title: "Create your first reward",
      desc: "Give shoppers incentives to burn points for discounts or perks.",
      icon: Gift,
      action: "Create reward",
    },
    {
      title: "Set up a welcome email",
      desc: "Greet new loyalty members automatically when they register.",
      icon: Mail,
      action: "Set up email",
    },
    {
      title: "Import external customers",
      desc: "Bring past shoppers or offline customer records into Reloopin.",
      icon: Users,
      action: "Import customers",
    },
  ];

  return (
    <div className="onboarding-success-panel text-center">
      {/* Hero Badge & Title */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[var(--secondary-container)] text-[var(--secondary)] flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Sparkles size={32} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Your loyalty program is ready
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 max-w-md mx-auto leading-relaxed">
          Your store is connected, earning rules are active, and customers can
          start collecting points.
        </p>
      </div>

      {/* Completed items grid */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs mb-8 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
          Completed launch milestones
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {completedChecklist.map((item) => (
            <div
              key={item.title}
              className="p-3 rounded-lg bg-[var(--muted)]/40 border border-[var(--border)] flex items-start gap-2.5"
            >
              <CheckCircle2
                size={16}
                className="text-[var(--secondary)] shrink-0 mt-0.5"
              />
              <div>
                <h5 className="text-xs font-bold text-[var(--foreground)]">
                  {item.title}
                </h5>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary & Secondary Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
        <Button
          variant="default"
          size="sm"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto h-10 px-6 font-bold text-xs gap-2 shadow-xs bg-[var(--primary)] text-[var(--primary-foreground)]"
        >
          <span>Go to dashboard</span>
          <ArrowRight size={14} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustomerPreviewModal(true)}
          className="w-full sm:w-auto h-10 px-4 text-xs gap-1.5"
        >
          <ExternalLink size={13} />
          <span>Preview customer widget</span>
        </Button>
      </div>

      {/* Optional Next Steps */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xs text-left">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            Recommended growth steps
          </h4>
          <span className="text-[10px] text-[var(--muted-foreground)]">
            Optional
          </span>
        </div>

        <div className="space-y-2.5">
          {optionalNextSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="p-3 rounded-lg bg-[var(--muted)]/30 border border-[var(--border)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center shrink-0">
                    <Icon size={15} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--foreground)]">
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGoToDashboard}
                  className="text-xs h-7 px-2.5 font-medium shrink-0"
                >
                  {step.action}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Experience Preview Modal */}
      <Modal
        open={showCustomerPreviewModal}
        onClose={() => setShowCustomerPreviewModal(false)}
        title="Storefront Customer Widget"
        description={`Interactive simulation of the loyalty experience on ${state.storeConnection.storeName || "Northstar Goods"}.`}
      >
        <div className="space-y-4 mt-2">
          <div className="w-full max-w-[340px] mx-auto rounded-2xl border border-[var(--border)] shadow-lg overflow-hidden bg-[var(--background)]">
            <div
              className="p-5 text-white"
              style={{
                backgroundColor: state.branding.brandColor || "#4F46E5",
                color: getReadableBrandForeground(
                  state.branding.brandColor || "#4F46E5",
                ),
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-tight">
                  {state.branding.storeName || "Northstar Goods"} Rewards
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                  Live
                </span>
              </div>
              <p className="text-[11px] opacity-90">Welcome back,</p>
              <h4 className="text-base font-bold">Maya Chen</h4>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-bold">
                <Sparkles size={12} />
                <span>2,450 points available</span>
              </div>
            </div>

            <div className="p-4 space-y-3 bg-[var(--card)] text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown size={14} className="text-[var(--warning)]" />
                  <span className="font-semibold text-[var(--foreground)]">
                    Gold Member
                  </span>
                </div>
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  Tier 2
                </span>
              </div>

              <div className="p-3 rounded-lg border border-[var(--border)] text-left space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                  <ShoppingBag size={13} className="text-[var(--primary)]" />
                  <span>Next order earns points</span>
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Earn {state.earningRule.pointsEarned || 1} point per $
                  {state.earningRule.perOrderSpend || 1} spent.
                </p>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={() => setShowCustomerPreviewModal(false)}
                className="w-full text-xs h-8 font-semibold"
                style={{
                  backgroundColor: state.branding.brandColor || "#4F46E5",
                  color: getReadableBrandForeground(
                    state.branding.brandColor || "#4F46E5",
                  ),
                }}
              >
                Close preview
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
