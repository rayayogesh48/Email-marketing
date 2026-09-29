"use client";

import {
  PaymentMethod,
  Subscription,
  BillingPermission,
} from "@/lib/billing/billing-types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import {
  CreditCard,
  Plus,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export function PaymentMethodsTab({
  paymentMethods,
  subscription,
  permission,
  onOpenAddCard,
  onOpenUpdateCard,
  onRemoveCard,
  blockedRemovalOpen,
  onCloseBlockedRemoval,
}: {
  paymentMethods: PaymentMethod[];
  subscription: Subscription;
  permission: BillingPermission;
  onOpenAddCard: () => void;
  onOpenUpdateCard: (pm: PaymentMethod) => void;
  onRemoveCard: (id: string) => void;
  blockedRemovalOpen: boolean;
  onCloseBlockedRemoval: () => void;
}) {
  const isOwnerOrAdmin = permission === "owner" || permission === "billing_admin";
  const isPlatformMode = subscription.billingMode === "platform";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Payment methods
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Manage your cards and recurring payment billing preferences.
          </p>
        </div>

        {!isPlatformMode && isOwnerOrAdmin && paymentMethods.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenAddCard}
            className="text-xs gap-1.5 self-start cursor-pointer"
          >
            <Plus size={14} />
            Add payment method
          </Button>
        )}
      </div>

      {/* Platform Mode (Shopify Billing) */}
      {isPlatformMode ? (
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ExternalLink size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Managed through Shopify
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Your subscription payment method and billing details are managed by Shopify.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info("Simulating navigation to Shopify Admin Billing Settings.");
              }}
              className="text-xs gap-1.5 font-medium cursor-pointer"
            >
              <ExternalLink size={13} />
              Open Shopify billing
            </Button>
          </div>
        </div>
      ) : paymentMethods.length === 0 ? (
        /* Empty State */
        <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center mx-auto">
            <CreditCard size={22} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No payment method added
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm mx-auto">
              Add a payment method before upgrading to a paid plan.
            </p>
          </div>
          {isOwnerOrAdmin ? (
            <div className="pt-2">
              <Button size="sm" onClick={onOpenAddCard} className="text-xs gap-1.5 cursor-pointer">
                <Plus size={14} />
                Add payment method
              </Button>
            </div>
          ) : (
            <p className="text-[11px] text-[var(--muted-foreground)] italic">
              Only the account owner or billing admin can add payment methods.
            </p>
          )}
        </div>
      ) : (
        /* Direct Payment Method Cards */
        <div className="space-y-4">
          {paymentMethods.map((pm) => {
            const isExpiringSoon = pm.status === "expiring_soon";
            const isExpired = pm.status === "expired";

            return (
              <div key={pm.id} className="space-y-3">
                {/* Expiring soon callout */}
                {isExpiringSoon && (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                      <AlertTriangle size={15} className="shrink-0" />
                      <span>
                        Your card expires soon. Update your payment method before August 2028 to avoid interrupted service.
                      </span>
                    </div>
                    {isOwnerOrAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenUpdateCard(pm)}
                        className="text-xs shrink-0"
                      >
                        Update card
                      </Button>
                    )}
                  </div>
                )}

                {/* Expired callout */}
                {isExpired && (
                  <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center justify-between gap-3 text-xs text-rose-700 dark:text-rose-400">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={15} className="shrink-0" />
                      <span>
                        Your payment method has expired. Add a valid payment method to continue using paid features.
                      </span>
                    </div>
                    {isOwnerOrAdmin && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onOpenUpdateCard(pm)}
                        className="text-xs shrink-0"
                      >
                        Update payment method
                      </Button>
                    )}
                  </div>
                )}

                {/* Card Item */}
                <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center font-bold text-xs uppercase text-[var(--foreground)] border border-[var(--border)]">
                      {pm.brand}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold text-[var(--foreground)]">
                          {pm.brand.toUpperCase()} ending in {pm.last4}
                        </strong>
                        {pm.isPrimary && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-semibold">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        Expires {String(pm.expiryMonth).padStart(2, "0")}/{pm.expiryYear} · {pm.billingName}
                      </p>
                    </div>
                  </div>

                  {isOwnerOrAdmin ? (
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenUpdateCard(pm)}
                        className="text-xs gap-1.5 cursor-pointer"
                      >
                        <Edit2 size={12} />
                        Update
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveCard(pm.id)}
                        className="text-xs text-[var(--destructive)] hover:text-[var(--destructive)] gap-1.5 cursor-pointer"
                      >
                        <Trash2 size={12} />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[var(--muted-foreground)] italic">
                      Staff view only
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blocked Removal Modal */}
      <Modal
        open={blockedRemovalOpen}
        onClose={onCloseBlockedRemoval}
        title="This payment method can't be removed"
        description="Your Growth subscription needs an active payment method. Add another payment method before removing this one."
      >
        <div className="space-y-4 pt-3 text-xs">
          <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-start gap-2.5">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <p>
              Paid plans require at least one valid payment method on file to maintain uninterrupted service.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <Button variant="ghost" size="sm" onClick={onCloseBlockedRemoval}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onCloseBlockedRemoval();
                onOpenAddCard();
              }}
              className="gap-1.5"
            >
              <Plus size={13} />
              Add another payment method
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
