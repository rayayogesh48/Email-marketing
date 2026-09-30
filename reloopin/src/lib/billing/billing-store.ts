import { useSyncExternalStore } from "react";
import {
  BillingConfig,
  BillingPeriod,
  BillingPermission,
  BillingPreviewState,
  BillingSyncStatus,
  BillingTab,
  BillingDataState,
  Invoice,
  PaymentDetails,
  UsageOrder,
  BillingActivityItem,
  BillingMode,
} from "./billing-types";
import {
  defaultBillingConfig,
  defaultPaymentDetails,
  initialPeriods,
  initialInvoices,
  initialActivityTimeline,
  generateSeedOrders,
  calculateEstimatedCharge,
  FREE_ORDER_THRESHOLD,
  PRICE_PER_ORDER,
} from "./billing-data";

export interface BillingStoreState {
  config: BillingConfig;
  activeTab: BillingTab;
  selectedPeriodId: string;
  countedOrdersCount: number;
  excludedOrdersCount: number;
  underReviewOrdersCount: number;
  orders: UsageOrder[];
  periods: BillingPeriod[];
  invoices: Invoice[];
  paymentDetails: PaymentDetails;
  timeline: BillingActivityItem[];
  syncStatus: BillingSyncStatus;
  permission: BillingPermission;
  dataState: BillingDataState;
  previewState: BillingPreviewState;
  isRetryingPayment: boolean;
  isSyncing: boolean;
  paymentFailureActive: boolean;
  // Overlays
  selectedOrderForDetail: UsageOrder | null;
  selectedInvoiceForDetail: Invoice | null;
  countedOrderRulesOpen: boolean;
  paymentMethodDialogOpen: boolean;
  previewDrawerOpen: boolean;
  // Filters & Pagination for Order Usage
  searchQuery: string;
  billingStatusFilter: "all" | "counted" | "excluded" | "under_review";
  storeStatusFilter: string;
  currentPage: number;
  pageSize: number;
}

const STORAGE_KEY = "reloopin:billing:usage_v2";

function createInitialState(): BillingStoreState {
  const initialCounted = 76;
  const initialOrders = generateSeedOrders(initialCounted);
  const estimatedCharge = calculateEstimatedCharge(initialCounted);

  const updatedPeriods = initialPeriods.map((p) => {
    if (p.id === "period-2026-09") {
      return {
        ...p,
        countedOrders: initialCounted,
        estimatedCharge,
      };
    }
    return p;
  });

  return {
    config: defaultBillingConfig,
    activeTab: "overview",
    selectedPeriodId: "period-2026-09",
    countedOrdersCount: initialCounted,
    excludedOrdersCount: 6,
    underReviewOrdersCount: 3,
    orders: initialOrders,
    periods: updatedPeriods,
    invoices: initialInvoices,
    paymentDetails: defaultPaymentDetails,
    timeline: initialActivityTimeline,
    syncStatus: "up_to_date",
    permission: "owner",
    dataState: "default",
    previewState: "default",
    isRetryingPayment: false,
    isSyncing: false,
    paymentFailureActive: false,
    selectedOrderForDetail: null,
    selectedInvoiceForDetail: null,
    countedOrderRulesOpen: false,
    paymentMethodDialogOpen: false,
    previewDrawerOpen: false,
    searchQuery: "",
    billingStatusFilter: "all",
    storeStatusFilter: "all",
    currentPage: 1,
    pageSize: 25,
  };
}

let currentState: BillingStoreState = createInitialState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          countedOrdersCount: currentState.countedOrdersCount,
          activeTab: currentState.activeTab,
          selectedPeriodId: currentState.selectedPeriodId,
          permission: currentState.permission,
          billingMode: currentState.paymentDetails.billingMode,
          paymentFailureActive: currentState.paymentFailureActive,
        })
      );
    }
  } catch (e) {
    // Ignore storage quota
  }
}

export const billingStore = {
  getSnapshot: () => currentState,

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setActiveTab: (tab: BillingTab) => {
    currentState = { ...currentState, activeTab: tab };
    notify();
  },

  setSelectedPeriod: (periodId: string) => {
    currentState = { ...currentState, selectedPeriodId: periodId };
    notify();
  },

  setCountedOrders: (count: number) => {
    const safeCount = Math.max(0, count);
    const newCharge = calculateEstimatedCharge(safeCount);
    const newOrders = generateSeedOrders(safeCount);
    const isNowBillable = safeCount > FREE_ORDER_THRESHOLD;

    const newActivity: BillingActivityItem = {
      id: `act-${Date.now()}`,
      type: "count_recalculated",
      title: isNowBillable
        ? `Usage updated to ${safeCount} counted orders`
        : `Usage set to ${safeCount} orders (Within free tier)`,
      description: isNowBillable
        ? `All ${safeCount} counted orders billed at $${PRICE_PER_ORDER.toFixed(2)} each. Estimated: $${newCharge.toFixed(2)}.`
        : `Estimated charge is $0.00. First 50 orders are free.`,
      timestamp: "Just now",
    };

    const updatedPeriods = currentState.periods.map((p) => {
      if (p.id === "period-2026-09") {
        return {
          ...p,
          countedOrders: safeCount,
          totalSyncedOrders: safeCount + currentState.excludedOrdersCount + currentState.underReviewOrdersCount,
          estimatedCharge: newCharge,
        };
      }
      return p;
    });

    currentState = {
      ...currentState,
      countedOrdersCount: safeCount,
      orders: newOrders,
      periods: updatedPeriods,
      timeline: [newActivity, ...currentState.timeline.slice(0, 15)],
    };
    notify();
  },

  addCountedOrders: (amount: number) => {
    const prevCount = currentState.countedOrdersCount;
    const newCount = prevCount + amount;
    const newCharge = calculateEstimatedCharge(newCount);
    const newOrders = generateSeedOrders(newCount);

    const wasFree = prevCount <= FREE_ORDER_THRESHOLD;
    const nowBillable = newCount > FREE_ORDER_THRESHOLD;

    const newActivity: BillingActivityItem = {
      id: `act-${Date.now()}`,
      type: "order_added",
      title: `${amount} new counted order${amount > 1 ? "s" : ""} synchronized`,
      description:
        wasFree && nowBillable
          ? `Threshold of 50 orders exceeded! Usage-based billing activated for all ${newCount} orders. Estimated charge: $${newCharge.toFixed(2)}.`
          : `Running monthly total: ${newCount} orders. Estimated charge: $${newCharge.toFixed(2)}.`,
      timestamp: "Just now",
    };

    const updatedPeriods = currentState.periods.map((p) => {
      if (p.id === "period-2026-09") {
        return {
          ...p,
          countedOrders: newCount,
          totalSyncedOrders: newCount + currentState.excludedOrdersCount + currentState.underReviewOrdersCount,
          estimatedCharge: newCharge,
        };
      }
      return p;
    });

    currentState = {
      ...currentState,
      countedOrdersCount: newCount,
      orders: newOrders,
      periods: updatedPeriods,
      timeline: [newActivity, ...currentState.timeline.slice(0, 15)],
    };
    notify();
  },

  excludeOneOrder: () => {
    if (currentState.countedOrdersCount <= 0) return;
    const prevCount = currentState.countedOrdersCount;
    const newCount = prevCount - 1;
    const newCharge = calculateEstimatedCharge(newCount);
    const newOrders = generateSeedOrders(newCount);

    const droppedBelowThreshold = prevCount === 51 && newCount === 50;

    const newActivity: BillingActivityItem = {
      id: `act-${Date.now()}`,
      type: "order_excluded",
      title: "Order excluded due to refund",
      description: droppedBelowThreshold
        ? "Count fell back to 50 free orders. Estimated charge returned to $0.00."
        : `Counted orders decreased to ${newCount}. Estimated charge: $${newCharge.toFixed(2)}.`,
      timestamp: "Just now",
    };

    const updatedPeriods = currentState.periods.map((p) => {
      if (p.id === "period-2026-09") {
        return {
          ...p,
          countedOrders: newCount,
          totalSyncedOrders: newCount + currentState.excludedOrdersCount + currentState.underReviewOrdersCount,
          estimatedCharge: newCharge,
        };
      }
      return p;
    });

    currentState = {
      ...currentState,
      countedOrdersCount: newCount,
      orders: newOrders,
      periods: updatedPeriods,
      timeline: [newActivity, ...currentState.timeline.slice(0, 15)],
    };
    notify();
  },

  setSyncStatus: (status: BillingSyncStatus) => {
    currentState = { ...currentState, syncStatus: status };
    notify();
  },

  setPaymentStatus: (status: PaymentDetails["status"], isFailed: boolean = false) => {
    currentState = {
      ...currentState,
      paymentFailureActive: isFailed,
      paymentDetails: {
        ...currentState.paymentDetails,
        status,
      },
    };
    notify();
  },

  setBillingMode: (mode: BillingMode) => {
    currentState = {
      ...currentState,
      config: { ...currentState.config, billingMode: mode },
      paymentDetails: { ...currentState.paymentDetails, billingMode: mode },
    };
    notify();
  },

  setPermission: (permission: BillingPermission) => {
    currentState = { ...currentState, permission };
    notify();
  },

  setDataState: (dataState: BillingDataState) => {
    currentState = { ...currentState, dataState };
    notify();
  },

  setPreviewState: (preset: BillingPreviewState) => {
    switch (preset) {
      case "zero_orders":
        billingStore.setCountedOrders(0);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "safe_free":
        billingStore.setCountedOrders(24);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "approaching_threshold":
        billingStore.setCountedOrders(44);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "threshold_reached":
        billingStore.setCountedOrders(50);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "first_billable":
        billingStore.setCountedOrders(51);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "active_billing":
        billingStore.setCountedOrders(76);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "high_usage":
        billingStore.setCountedOrders(1420);
        currentState = { ...currentState, syncStatus: "up_to_date", paymentFailureActive: false, dataState: "default" };
        break;
      case "syncing":
        currentState = { ...currentState, syncStatus: "syncing" };
        break;
      case "sync_delayed":
        currentState = { ...currentState, syncStatus: "sync_delayed" };
        break;
      case "calculation_failed":
        currentState = { ...currentState, syncStatus: "calculation_failed" };
        break;
      case "store_disconnected":
        currentState = { ...currentState, syncStatus: "store_disconnected" };
        break;
      case "payment_failed":
        currentState = {
          ...currentState,
          paymentFailureActive: true,
          paymentDetails: { ...currentState.paymentDetails, status: "failed" },
        };
        break;
      case "payment_retrying":
        currentState = { ...currentState, isRetryingPayment: true, paymentFailureActive: true };
        break;
      case "payment_recovered":
        currentState = {
          ...currentState,
          paymentFailureActive: false,
          isRetryingPayment: false,
          paymentDetails: { ...currentState.paymentDetails, status: "valid" },
        };
        break;
      case "grace_period":
        currentState = {
          ...currentState,
          paymentFailureActive: true,
          paymentDetails: {
            ...currentState.paymentDetails,
            status: "failed",
            gracePeriodEndsAt: "7 October 2026",
          },
        };
        break;
      case "no_payment_method":
        currentState = {
          ...currentState,
          paymentDetails: {
            ...currentState.paymentDetails,
            hasPaymentMethod: false,
            billingMode: "direct",
          },
        };
        break;
      case "card_expiring":
        currentState = {
          ...currentState,
          paymentDetails: {
            ...currentState.paymentDetails,
            status: "expiring_soon",
            expiryMonth: 10,
            expiryYear: 2026,
          },
        };
        break;
      case "staff_view":
        currentState = { ...currentState, permission: "staff" };
        break;
      case "past_free_period":
        currentState = { ...currentState, selectedPeriodId: "period-2026-08", activeTab: "overview" };
        break;
      case "past_billable_period":
        currentState = { ...currentState, selectedPeriodId: "period-2026-07", activeTab: "overview" };
        break;
      case "empty_invoices":
        currentState = { ...currentState, invoices: [], activeTab: "invoices" };
        break;
      case "default":
      default:
        currentState = createInitialState();
        break;
    }
    currentState = { ...currentState, previewState: preset };
    notify();
  },

  retryPayment: async (): Promise<boolean> => {
    currentState = { ...currentState, isRetryingPayment: true };
    notify();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    currentState = {
      ...currentState,
      isRetryingPayment: false,
      paymentFailureActive: false,
      paymentDetails: { ...currentState.paymentDetails, status: "valid" },
      timeline: [
        {
          id: `act-${Date.now()}`,
          type: "payment_success",
          title: "Payment processed successfully",
          description: "September usage fee payment confirmed. Account is in good standing.",
          timestamp: "Just now",
        },
        ...currentState.timeline,
      ],
    };
    notify();
    return true;
  },

  retrySync: async (): Promise<void> => {
    currentState = { ...currentState, isSyncing: true, syncStatus: "syncing" };
    notify();

    await new Promise((resolve) => setTimeout(resolve, 1200));

    currentState = {
      ...currentState,
      isSyncing: false,
      syncStatus: "up_to_date",
      timeline: [
        {
          id: `act-${Date.now()}`,
          type: "order_added",
          title: "Store sync completed",
          description: "All recent Shopify orders synchronized successfully.",
          timestamp: "Just now",
        },
        ...currentState.timeline,
      ],
    };
    notify();
  },

  // Overlay toggles
  openCountedOrderRules: () => {
    currentState = { ...currentState, countedOrderRulesOpen: true };
    notify();
  },
  closeCountedOrderRules: () => {
    currentState = { ...currentState, countedOrderRulesOpen: false };
    notify();
  },

  openOrderDetail: (order: UsageOrder) => {
    currentState = { ...currentState, selectedOrderForDetail: order };
    notify();
  },
  closeOrderDetail: () => {
    currentState = { ...currentState, selectedOrderForDetail: null };
    notify();
  },

  openInvoiceDetail: (invoice: Invoice) => {
    currentState = { ...currentState, selectedInvoiceForDetail: invoice };
    notify();
  },
  closeInvoiceDetail: () => {
    currentState = { ...currentState, selectedInvoiceForDetail: null };
    notify();
  },

  openPaymentMethodDialog: () => {
    currentState = { ...currentState, paymentMethodDialogOpen: true };
    notify();
  },
  closePaymentMethodDialog: () => {
    currentState = { ...currentState, paymentMethodDialogOpen: false };
    notify();
  },

  updatePaymentMethod: (data: {
    brand: "visa" | "mastercard" | "amex";
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    billingName: string;
    billingEmail: string;
  }) => {
    currentState = {
      ...currentState,
      paymentDetails: {
        ...currentState.paymentDetails,
        hasPaymentMethod: true,
        brand: data.brand,
        last4: data.last4,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        billingName: data.billingName,
        billingEmail: data.billingEmail,
        status: "valid",
      },
      paymentFailureActive: false,
      paymentMethodDialogOpen: false,
      timeline: [
        {
          id: `act-${Date.now()}`,
          type: "payment_success",
          title: "Payment method updated",
          description: `${data.brand.toUpperCase()} card ending in ${data.last4} saved.`,
          timestamp: "Just now",
        },
        ...currentState.timeline,
      ],
    };
    notify();
  },

  setSearchQuery: (query: string) => {
    currentState = { ...currentState, searchQuery: query, currentPage: 1 };
    notify();
  },

  setBillingStatusFilter: (filter: "all" | "counted" | "excluded" | "under_review") => {
    currentState = { ...currentState, billingStatusFilter: filter, currentPage: 1 };
    notify();
  },

  setStoreStatusFilter: (filter: string) => {
    currentState = { ...currentState, storeStatusFilter: filter, currentPage: 1 };
    notify();
  },

  setCurrentPage: (page: number) => {
    currentState = { ...currentState, currentPage: page };
    notify();
  },

  setPageSize: (size: number) => {
    currentState = { ...currentState, pageSize: size, currentPage: 1 };
    notify();
  },

  togglePreviewDrawer: () => {
    currentState = { ...currentState, previewDrawerOpen: !currentState.previewDrawerOpen };
    notify();
  },
  setPreviewDrawerOpen: (open: boolean) => {
    currentState = { ...currentState, previewDrawerOpen: open };
    notify();
  },

  resetPrototype: () => {
    currentState = createInitialState();
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // Ignore
    }
    notify();
  },
};

export function useBillingStore(): BillingStoreState {
  return useSyncExternalStore(billingStore.subscribe, billingStore.getSnapshot, billingStore.getSnapshot);
}
