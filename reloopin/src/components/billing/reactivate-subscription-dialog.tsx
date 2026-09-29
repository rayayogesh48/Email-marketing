"use client";

import { BillingPlan, Subscription } from "@/lib/billing/billing-types";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function ReactivateSubscriptionDialog({
  open,
  onClose,
  plan,
  subscription,
  onConfirmReactivate,
}: {
  open: boolean;
  onClose: () => void;
  plan: BillingPlan;
  subscription: Subscription;
  onConfirmReactivate: () => void;
}) {
  const handleConfirm = () => {
    onConfirmReactivate();
    toast.success(`Your ${plan.name} subscription has been reactivated.`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Keep your ${plan.name} subscription?`}
      description="Your scheduled cancellation will be removed and your subscription will continue normally."
    >
      <div className="space-y-4 pt-3 text-xs">
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[var(--foreground)]">
            You will retain access to all {plan.name} features, expanded limits, and automated rules without interruption.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Not now
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleConfirm}
            className="gap-1.5 font-medium cursor-pointer"
          >
            <Sparkles size={14} />
            Keep {plan.name}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
