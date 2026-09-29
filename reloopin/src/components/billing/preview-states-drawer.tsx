"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BillingPlanId,
  BillingPermission,
  BillingTab,
  BillingPreviewState,
  BillingDataState,
} from "@/lib/billing/billing-types";
import { billingStore, BillingState } from "@/lib/billing/billing-store";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CreditCard,
  Shield,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export function PreviewStatesDrawer({
  store,
  onOpenUpgrade,
  onOpenDowngrade,
  onOpenCancel,
  onOpenReactivate,
  onOpenAddPayment,
}: {
  store: BillingState;
  onOpenUpgrade: (planId: BillingPlanId) => void;
  onOpenDowngrade: (planId: BillingPlanId) => void;
  onOpenCancel: () => void;
  onOpenReactivate: () => void;
  onOpenAddPayment: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectState = (stateId: BillingPreviewState) => {
    billingStore.setPreviewState(stateId);
    toast.info(`Preview state set: ${stateId.replace(/_/g, " ")}`);

    const currentTab = store.activeTab;
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", currentTab);
    params.set("state", stateId);
    router.replace(`/settings/billing?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (tab: BillingTab) => {
    billingStore.setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/settings/billing?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {/* Floating Trigger Button: Bottom-left */}
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          size="sm"
          className="shadow-md bg-[var(--card)] hover:bg-[var(--muted)] text-xs gap-1.5 border-[var(--border)] font-medium cursor-pointer"
        >
          <Sliders size={13} className="text-[var(--primary)]" />
          Preview states
        </Button>
      </div>

      {/* Right-Side Drawer Sheet */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        side={true}
        title="Billing Preview States"
        description="Switch between plans, subscription statuses, billing modes, and simulated states."
      >
        <div className="space-y-6 pt-4 text-xs">
          {/* Quick Utility Actions */}
          <div className="space-y-2">
            <h4 className="font-semibold text-[var(--foreground)] uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Quick Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  billingStore.resetDemo();
                  toast.success("Demo reset to default Growth plan.");
                }}
                className="text-xs justify-start gap-1.5 h-8"
              >
                <RotateCcw size={12} />
                Reset demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  billingStore.recoverPayment();
                  toast.success("Payment recovered. Growth plan active.");
                }}
                className="text-xs justify-start gap-1.5 h-8 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 size={12} />
                Recover payment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  billingStore.setPreviewState("payment_failed");
                  toast.error("Simulated payment failure.");
                }}
                className="text-xs justify-start gap-1.5 h-8 text-rose-600 dark:text-rose-400"
              >
                <AlertTriangle size={12} />
                Simulate failure
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  billingStore.setPreviewState("limit_reached");
                  toast.warning("Customer limit reached (100%).");
                }}
                className="text-xs justify-start gap-1.5 h-8 text-amber-600"
              >
                <AlertTriangle size={12} />
                Reach limit
              </Button>
            </div>
          </div>

          {/* Current Plan */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Current Plan
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {(["starter", "growth", "pro"] as BillingPlanId[]).map((pid) => (
                <button
                  key={pid}
                  onClick={() => {
                    handleSelectState(
                      pid === "starter"
                        ? "starter_current"
                        : pid === "growth"
                        ? "growth_current"
                        : "pro_current",
                    );
                  }}
                  className={`p-2 rounded-lg border text-xs capitalize text-center transition-colors cursor-pointer ${
                    store.subscription.planId === pid
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {pid}
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Status */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Subscription Status
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "default", label: "Active" },
                { id: "trial", label: "Trial" },
                { id: "approaching_limit", label: "Approaching limit" },
                { id: "near_limit", label: "Near limit" },
                { id: "limit_reached", label: "Limit reached" },
                { id: "payment_failed", label: "Payment failed" },
                { id: "grace_period", label: "Grace period" },
                { id: "paid_features_paused", label: "Features paused" },
                { id: "downgrade_scheduled", label: "Downgrade scheduled" },
                { id: "cancellation_scheduled", label: "Cancel scheduled" },
                { id: "cancelled", label: "Cancelled" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleSelectState(id as BillingPreviewState)}
                  className={`p-2 rounded-lg border text-xs text-left transition-colors cursor-pointer ${
                    store.previewState === id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 font-semibold text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Billing Mode */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Billing Mode
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  billingStore.setBillingMode("direct");
                  toast.success("Switched to Direct billing mode.");
                }}
                className={`p-2 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                  store.subscription.billingMode === "direct"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--foreground)]"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                }`}
              >
                Direct billing
              </button>
              <button
                onClick={() => {
                  billingStore.setBillingMode("platform");
                  toast.success("Switched to Shopify platform billing.");
                }}
                className={`p-2 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                  store.subscription.billingMode === "platform"
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--foreground)]"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                }`}
              >
                Shopify billing
              </button>
            </div>
          </div>

          {/* User Permission */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              User Permission
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {(["owner", "billing_admin", "staff"] as BillingPermission[]).map((perm) => (
                <button
                  key={perm}
                  onClick={() => {
                    billingStore.setPermission(perm);
                    toast.info(`Permission set to: ${perm.replace("_", " ")}`);
                  }}
                  className={`p-2 rounded-lg border text-xs capitalize text-center transition-colors cursor-pointer ${
                    store.permission === perm
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {perm.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Page Tabs */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Active Tab
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "overview", label: "Overview" },
                { id: "plans", label: "Plans" },
                { id: "payment-methods", label: "Payment methods" },
                { id: "invoices", label: "Invoices" },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id as BillingTab)}
                  className={`p-2 rounded-lg border text-xs text-center transition-colors cursor-pointer ${
                    store.activeTab === id
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Dialog & Flow Shortcuts */}
          <div className="space-y-2">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Trigger Flow Modals
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onOpenUpgrade("pro");
                }}
                className="text-xs justify-start h-8"
              >
                Upgrade to Pro
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onOpenDowngrade("starter");
                }}
                className="text-xs justify-start h-8"
              >
                Downgrade review
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onOpenCancel();
                }}
                className="text-xs justify-start h-8 text-[var(--destructive)]"
              >
                Cancel subscription
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onOpenReactivate();
                }}
                className="text-xs justify-start h-8 text-emerald-600"
              >
                Reactivate dialog
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onOpenAddPayment();
                }}
                className="text-xs justify-start h-8"
              >
                Add payment method
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (store.invoices[0]) {
                    setOpen(false);
                    billingStore.openInvoiceDrawer(store.invoices[0]);
                  }
                }}
                className="text-xs justify-start h-8"
              >
                Invoice details
              </Button>
            </div>
          </div>

          {/* Data State */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <h4 className="font-semibold uppercase text-[10px] tracking-wider text-[var(--muted-foreground)]">
              Data State
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              {(["default", "loading", "error"] as BillingDataState[]).map((ds) => (
                <button
                  key={ds}
                  onClick={() => billingStore.setDataState(ds)}
                  className={`p-2 rounded-lg border text-xs capitalize text-center transition-colors cursor-pointer ${
                    store.dataState === ds
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 font-bold text-[var(--foreground)]"
                      : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {ds}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
