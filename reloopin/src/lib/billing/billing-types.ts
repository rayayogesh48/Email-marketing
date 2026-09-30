export type BillingMode = "platform" | "direct";

export type BillingConfig = {
  currency: "USD";
  freeOrderThreshold: number;
  pricePerCountedOrder: number;
  billingPeriod: "calendar_month";
  billingMode: BillingMode;
  countedOrderStatuses: string[];
  excludedOrderStatuses: string[];
};

export type BillingUsageStatus =
  | "free"
  | "approaching_threshold"
  | "threshold_reached"
  | "billable"
  | "syncing"
  | "sync_delayed"
  | "usage_error";

export type BillingSyncStatus =
  | "up_to_date"
  | "syncing"
  | "new_orders_detected"
  | "sync_delayed"
  | "calculation_failed"
  | "store_disconnected";

export type BillingPeriodStatus =
  | "open"
  | "processing"
  | "invoiced"
  | "paid"
  | "payment_failed";

export type BillingPeriod = {
  id: string;
  name: string; // e.g. "September 2026", "August 2026", "July 2026"
  startsAt: string;
  endsAt: string;
  totalSyncedOrders: number;
  countedOrders: number;
  excludedOrders: number;
  underReviewOrders: number;
  estimatedCharge: number;
  finalCharge?: number;
  status: BillingPeriodStatus;
  lastSyncedAt?: string;
  invoiceId?: string;
};

export type OrderStoreStatus =
  | "paid"
  | "fulfilled"
  | "refunded"
  | "cancelled"
  | "draft"
  | "test";

export type OrderBillingStatus = "counted" | "excluded" | "under_review";

export type UsageOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderTotal: number;
  currency: string;
  storeStatus: OrderStoreStatus;
  billingStatus: OrderBillingStatus;
  exclusionReason?: string;
  syncedAt: string;
  orderDate: string;
  usageCharge: number; // 0 or 0.05
};

export type InvoiceStatus =
  | "paid"
  | "open"
  | "processing"
  | "failed"
  | "refunded"
  | "voided";

export type Invoice = {
  id: string;
  invoiceNumber: string;
  periodId: string;
  periodName: string;
  countedOrders: number;
  ratePerOrder: number;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate?: string;
  paidAt?: string;
  billingMethod: string;
  merchantName: string;
  billingEmail: string;
  subtotal: number;
  tax: number;
  total: number;
  isFreeMonth?: boolean;
};

export type PaymentMethodStatus = "valid" | "expiring_soon" | "expired" | "failed";

export type PaymentDetails = {
  billingMode: BillingMode;
  hasPaymentMethod: boolean;
  brand?: "visa" | "mastercard" | "amex";
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  billingName?: string;
  billingEmail?: string;
  status: PaymentMethodStatus;
  gracePeriodEndsAt?: string;
};

export type BillingActivityType =
  | "order_added"
  | "order_excluded"
  | "count_recalculated"
  | "period_finalized"
  | "invoice_created"
  | "payment_success"
  | "payment_failed";

export type BillingActivityItem = {
  id: string;
  type: BillingActivityType;
  title: string;
  description: string;
  timestamp: string;
};

export type BillingPermission = "owner" | "billing_admin" | "staff";

export type BillingTab = "overview" | "usage" | "invoices" | "payment";

export type BillingDataState = "default" | "loading" | "empty" | "error";

export type DailyUsagePoint = {
  day: number;
  dateStr: string;
  dailyCounted: number;
  runningTotal: number;
  estimatedCharge: number;
};

export type BillingPreviewState =
  | "default"
  | "zero_orders"
  | "safe_free"
  | "approaching_threshold"
  | "threshold_reached"
  | "first_billable"
  | "active_billing"
  | "high_usage"
  | "syncing"
  | "sync_delayed"
  | "calculation_failed"
  | "store_disconnected"
  | "payment_failed"
  | "payment_retrying"
  | "payment_recovered"
  | "grace_period"
  | "no_payment_method"
  | "card_expiring"
  | "staff_view"
  | "past_free_period"
  | "past_billable_period"
  | "empty_invoices";
