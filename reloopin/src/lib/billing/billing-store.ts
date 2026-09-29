import { useSyncExternalStore } from "react";
import {
  BillingPlan,
  BillingPlanId,
  Subscription,
  SubscriptionStatus,
  BillingPermission,
  BillingTab,
  UsageMetric,
  PaymentMethod,
  Invoice,
  BillingDataState,
  BillingPreviewState,
} from "./billing-types";
import {
  initialBillingPlans,
  initialSubscription,
  initialUsageMetrics,
  initialPaymentMethods,
  initialInvoices,
} from "./billing-data";

export interface BillingState {
  plans: BillingPlan[];
  subscription: Subscription;
  usageMetrics: UsageMetric[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  activeTab: BillingTab;
  permission: BillingPermission;
  dataState: BillingDataState;
  previewState: BillingPreviewState;
  gracePeriodEndsAt: string;
  isRetryingPayment: boolean;
  isUpgrading: boolean;
  selectedInvoiceForDetail: Invoice | null;
  // Modal / drawer control
  upgradeModalOpen: boolean;
  upgradeTargetPlanId: BillingPlanId | null;
  downgradeModalOpen: boolean;
  downgradeTargetPlanId: BillingPlanId | null;
  cancelModalOpen: boolean;
  reactivateModalOpen: boolean;
  paymentMethodModalOpen: boolean;
  paymentMethodModalMode: "add" | "update";
  blockedRemovalModalOpen: boolean;
  invoiceDrawerOpen: boolean;
}

const STORAGE_KEY = "reloopin:billing:v1";

const initialStoreState: BillingState = {
  plans: initialBillingPlans,
  subscription: initialSubscription,
  usageMetrics: initialUsageMetrics,
  paymentMethods: initialPaymentMethods,
  invoices: initialInvoices,
  activeTab: "overview",
  permission: "owner",
  dataState: "default",
  previewState: "default",
  gracePeriodEndsAt: "5 October 2026",
  isRetryingPayment: false,
  isUpgrading: false,
  selectedInvoiceForDetail: null,
  upgradeModalOpen: false,
  upgradeTargetPlanId: null,
  downgradeModalOpen: false,
  downgradeTargetPlanId: null,
  cancelModalOpen: false,
  reactivateModalOpen: false,
  paymentMethodModalOpen: false,
  paymentMethodModalMode: "add",
  blockedRemovalModalOpen: false,
  invoiceDrawerOpen: false,
};

let currentState: BillingState = initialStoreState;
const listeners = new Set<() => void>();

function safeLoadState(): BillingState {
  if (typeof window === "undefined") return initialStoreState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStoreState;
    const parsed = JSON.parse(raw);
    return {
      ...initialStoreState,
      ...parsed,
      plans: initialBillingPlans, // always use typed plan configs
      subscription: { ...initialSubscription, ...(parsed.subscription || {}) },
      usageMetrics: parsed.usageMetrics || initialUsageMetrics,
      paymentMethods: parsed.paymentMethods || initialPaymentMethods,
      invoices: parsed.invoices || initialInvoices,
    };
  } catch {
    return initialStoreState;
  }
}

function emit() {
  if (typeof window !== "undefined") {
    try {
      const {
        plans,
        subscription,
        usageMetrics,
        paymentMethods,
        invoices,
        activeTab,
        permission,
        dataState,
      } = currentState;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          plans,
          subscription,
          usageMetrics,
          paymentMethods,
          invoices,
          activeTab,
          permission,
          dataState,
        }),
      );
    } catch {
      // Storage unavailable or quota exceeded
    }
  }
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  currentState = safeLoadState();
}

export const billingStore = {
  getSnapshot(): BillingState {
    return currentState;
  },

  getServerSnapshot(): BillingState {
    return initialStoreState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setActiveTab(tab: BillingTab) {
    currentState = { ...currentState, activeTab: tab };
    emit();
  },

  setPermission(permission: BillingPermission) {
    currentState = { ...currentState, permission };
    emit();
  },

  setBillingMode(mode: "direct" | "platform") {
    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        billingMode: mode,
      },
    };
    emit();
  },

  setDataState(dataState: BillingDataState) {
    currentState = { ...currentState, dataState };
    emit();
  },

  setPreviewState(state: BillingPreviewState) {
    let subUpdates: Partial<Subscription> = {};
    let metricsUpdates = [...currentState.usageMetrics];
    let dataState: BillingDataState = currentState.dataState;

    switch (state) {
      case "starter_current":
        subUpdates = { planId: "starter", status: "free", scheduledPlanId: undefined };
        metricsUpdates = metricsUpdates.map((m) =>
          m.id === "customers"
            ? { ...m, current: 340, limit: 500, supportingMessage: "160 customer spaces remaining." }
            : m.id === "stores"
            ? { ...m, limit: 1 }
            : m.id === "team"
            ? { ...m, limit: 2 }
            : m,
        );
        break;
      case "growth_current":
        subUpdates = { planId: "growth", status: "active", scheduledPlanId: undefined };
        metricsUpdates = metricsUpdates.map((m) =>
          m.id === "customers"
            ? { ...m, current: 1620, limit: 2000, supportingMessage: "You can add 380 more customers on your current plan." }
            : m.id === "stores"
            ? { ...m, limit: 3 }
            : m.id === "team"
            ? { ...m, limit: 5 }
            : m,
        );
        break;
      case "pro_current":
        subUpdates = { planId: "pro", status: "active", scheduledPlanId: undefined };
        metricsUpdates = metricsUpdates.map((m) =>
          m.id === "customers"
            ? { ...m, current: 12420, limit: null, supportingMessage: "Unlimited customer enrollment active." }
            : m.id === "stores"
            ? { ...m, limit: null }
            : m.id === "team"
            ? { ...m, limit: 15 }
            : m,
        );
        break;
      case "trial":
        subUpdates = { planId: "growth", status: "trialing", trialEndsAt: "18 October 2026" };
        break;
      case "approaching_limit":
        metricsUpdates = metricsUpdates.map((m) =>
          m.id === "customers"
            ? { ...m, current: 1620, limit: 2000, supportingMessage: "You're approaching your customer limit. You have space for 380 more customers." }
            : m,
        );
        break;
      case "near_limit":
        metricsUpdates = metricsUpdates.map((m) =>
          m.id === "customers"
            ? { ...m, current: 1960, limit: 2000, supportingMessage: "You're close to your plan limit. Only 40 customer spaces remain." }
            : m,
        );
        break;
      case "limit_reached":
        metricsUpdates = metricsUpdates.map((m) =>
          m.id === "customers"
            ? { ...m, current: 2000, limit: 2000, supportingMessage: "Customer limit reached. New customers cannot join your loyalty program." }
            : m,
        );
        break;
      case "payment_failed":
        subUpdates = { status: "payment_failed" };
        break;
      case "grace_period":
        subUpdates = { status: "past_due" };
        break;
      case "paid_features_paused":
        subUpdates = { status: "payment_failed" };
        break;
      case "downgrade_scheduled":
        subUpdates = { scheduledPlanId: "starter" };
        break;
      case "cancellation_scheduled":
        subUpdates = { status: "cancel_scheduled", cancelAtPeriodEnd: true };
        break;
      case "cancelled":
        subUpdates = { planId: "starter", status: "cancelled", cancelAtPeriodEnd: false, scheduledPlanId: undefined };
        break;
      case "staff_view_only":
        currentState = { ...currentState, permission: "staff" };
        break;
      case "plan_data_loading":
        dataState = "loading";
        break;
      case "plan_data_failed":
        dataState = "error";
        break;
      case "default":
        dataState = "default";
        break;
    }

    currentState = {
      ...currentState,
      previewState: state,
      dataState,
      subscription: { ...currentState.subscription, ...subUpdates },
      usageMetrics: metricsUpdates,
    };
    emit();
  },

  // Plan actions
  openUpgradeModal(targetPlanId: BillingPlanId) {
    currentState = {
      ...currentState,
      upgradeModalOpen: true,
      upgradeTargetPlanId: targetPlanId,
    };
    emit();
  },

  closeUpgradeModal() {
    currentState = {
      ...currentState,
      upgradeModalOpen: false,
      upgradeTargetPlanId: null,
      isUpgrading: false,
    };
    emit();
  },

  performUpgrade(targetPlanId: BillingPlanId) {
    const targetPlan = initialBillingPlans.find((p) => p.id === targetPlanId);
    if (!targetPlan) return;

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      billingPeriod: `Today – 18 Nov 2026`,
      planId: targetPlanId,
      planName: `${targetPlan.name} plan`,
      amount: targetPlan.monthlyPrice,
      subtotal: targetPlan.monthlyPrice,
      discount: 0,
      tax: 0,
      status: "paid",
      date: "Today",
      paidAt: "Today",
      merchantName: "Northstar Goods",
      billingEmail: "alex@northstargoods.com",
      paymentMethodSummary:
        currentState.subscription.billingMode === "platform"
          ? "Shopify Billing"
          : currentState.paymentMethods[0]
          ? `${currentState.paymentMethods[0].brand.toUpperCase()} ending in ${currentState.paymentMethods[0].last4}`
          : "Direct Billing",
      items: [
        {
          description: `${targetPlan.name} Plan — Monthly subscription`,
          amount: targetPlan.monthlyPrice,
        },
      ],
    };

    const updatedMetrics = currentState.usageMetrics.map((m) => {
      if (m.id === "customers") {
        return {
          ...m,
          limit: targetPlan.customerLimit,
          supportingMessage:
            targetPlan.customerLimit === null
              ? "Unlimited customer enrollment active."
              : `Space for ${targetPlan.customerLimit - m.current} more customers.`,
        };
      }
      if (m.id === "stores") return { ...m, limit: targetPlan.storeLimit };
      if (m.id === "team") return { ...m, limit: targetPlan.teamMemberLimit };
      if (m.id === "emails") return { ...m, limit: targetPlan.monthlyEmailLimit || null };
      return m;
    });

    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        planId: targetPlanId,
        status: "active",
        scheduledPlanId: undefined,
        cancelAtPeriodEnd: false,
        currentPeriodStart: "Today",
        currentPeriodEnd: "18 Nov 2026",
      },
      usageMetrics: updatedMetrics,
      invoices: [newInvoice, ...currentState.invoices],
      upgradeModalOpen: false,
      upgradeTargetPlanId: null,
      isUpgrading: false,
    };
    emit();
  },

  openDowngradeModal(targetPlanId: BillingPlanId) {
    currentState = {
      ...currentState,
      downgradeModalOpen: true,
      downgradeTargetPlanId: targetPlanId,
    };
    emit();
  },

  closeDowngradeModal() {
    currentState = {
      ...currentState,
      downgradeModalOpen: false,
      downgradeTargetPlanId: null,
    };
    emit();
  },

  scheduleDowngrade(targetPlanId: BillingPlanId) {
    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        scheduledPlanId: targetPlanId,
      },
      downgradeModalOpen: false,
      downgradeTargetPlanId: null,
    };
    emit();
  },

  cancelScheduledDowngrade() {
    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        scheduledPlanId: undefined,
      },
    };
    emit();
  },

  // Cancellation
  openCancelModal() {
    currentState = { ...currentState, cancelModalOpen: true };
    emit();
  },

  closeCancelModal() {
    currentState = { ...currentState, cancelModalOpen: false };
    emit();
  },

  confirmCancellation(reason?: string) {
    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        status: "cancel_scheduled",
        cancelAtPeriodEnd: true,
      },
      cancelModalOpen: false,
    };
    emit();
  },

  openReactivateModal() {
    currentState = { ...currentState, reactivateModalOpen: true };
    emit();
  },

  closeReactivateModal() {
    currentState = { ...currentState, reactivateModalOpen: false };
    emit();
  },

  confirmReactivation() {
    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        status: "active",
        cancelAtPeriodEnd: false,
        scheduledPlanId: undefined,
      },
      reactivateModalOpen: false,
    };
    emit();
  },

  // Payment methods
  openPaymentMethodModal(mode: "add" | "update" = "add") {
    currentState = {
      ...currentState,
      paymentMethodModalOpen: true,
      paymentMethodModalMode: mode,
    };
    emit();
  },

  closePaymentMethodModal() {
    currentState = {
      ...currentState,
      paymentMethodModalOpen: false,
    };
    emit();
  },

  savePaymentMethod(card: Omit<PaymentMethod, "id">) {
    const newMethod: PaymentMethod = {
      ...card,
      id: `pm_${Date.now()}`,
      isPrimary: true,
    };

    const existing = currentState.paymentMethods.map((pm) => ({
      ...pm,
      isPrimary: false,
    }));

    currentState = {
      ...currentState,
      paymentMethods: [newMethod, ...existing],
      paymentMethodModalOpen: false,
      // If payment was failed or past due, recover it!
      subscription:
        currentState.subscription.status === "payment_failed" ||
        currentState.subscription.status === "past_due"
          ? { ...currentState.subscription, status: "active" }
          : currentState.subscription,
    };
    emit();
  },

  removePaymentMethod(id: string) {
    // If user is on a paid plan and this is the only card, block removal!
    const isPaid = currentState.subscription.planId !== "starter";
    if (isPaid && currentState.paymentMethods.length <= 1) {
      currentState = { ...currentState, blockedRemovalModalOpen: true };
      emit();
      return;
    }

    currentState = {
      ...currentState,
      paymentMethods: currentState.paymentMethods.filter((pm) => pm.id !== id),
    };
    emit();
  },

  closeBlockedRemovalModal() {
    currentState = { ...currentState, blockedRemovalModalOpen: false };
    emit();
  },

  // Payment failure & recovery
  retryPayment(): Promise<boolean> {
    currentState = { ...currentState, isRetryingPayment: true };
    emit();

    return new Promise((resolve) => {
      setTimeout(() => {
        // Recover payment
        currentState = {
          ...currentState,
          isRetryingPayment: false,
          subscription: {
            ...currentState.subscription,
            status: "active",
          },
        };
        emit();
        resolve(true);
      }, 1200);
    });
  },

  recoverPayment() {
    currentState = {
      ...currentState,
      subscription: {
        ...currentState.subscription,
        status: "active",
      },
    };
    emit();
  },

  // Invoices
  openInvoiceDrawer(invoice: Invoice) {
    currentState = {
      ...currentState,
      selectedInvoiceForDetail: invoice,
      invoiceDrawerOpen: true,
    };
    emit();
  },

  closeInvoiceDrawer() {
    currentState = {
      ...currentState,
      selectedInvoiceForDetail: null,
      invoiceDrawerOpen: false,
    };
    emit();
  },

  resetDemo() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
    currentState = {
      ...initialStoreState,
      plans: initialBillingPlans,
      subscription: { ...initialSubscription },
      usageMetrics: [...initialUsageMetrics],
      paymentMethods: [...initialPaymentMethods],
      invoices: [...initialInvoices],
    };
    emit();
  },
};

export function useBillingStore(): BillingState {
  return useSyncExternalStore(
    billingStore.subscribe,
    billingStore.getSnapshot,
    billingStore.getServerSnapshot,
  );
}
