export type BillingPlanId = "starter" | "growth" | "pro";

export type BillingPlan = {
  id: BillingPlanId;
  name: string;
  monthlyPrice: number;
  annualPrice?: number;
  description: string;
  customerLimit: number | null;
  storeLimit: number | null;
  teamMemberLimit: number | null;
  monthlyEmailLimit?: number | null;
  monthlyApiLimit?: number | null;
  features: string[];
  apiAccess: boolean;
  recommended?: boolean;
};

export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "payment_failed"
  | "cancel_scheduled"
  | "cancelled";

export type Subscription = {
  planId: BillingPlanId;
  status: SubscriptionStatus;
  billingInterval: "monthly" | "annual";
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  trialEndsAt?: string;
  cancelAtPeriodEnd: boolean;
  scheduledPlanId?: BillingPlanId;
  billingMode: "platform" | "direct";
};

export type BillingPermission = "owner" | "billing_admin" | "staff";

export type BillingTab = "overview" | "plans" | "payment-methods" | "invoices";

export type UsageMetric = {
  id: string;
  name: string;
  current: number;
  limit: number | null; // null = unlimited
  unit?: string;
  supportingMessage?: string;
};

export type PaymentMethodStatus = "valid" | "expiring_soon" | "expired";

export type PaymentMethod = {
  id: string;
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  billingName: string;
  country: string;
  postalCode: string;
  isPrimary: boolean;
  status: PaymentMethodStatus;
};

export type InvoiceStatus = "paid" | "open" | "failed" | "refunded" | "voided";

export type InvoiceItem = {
  description: string;
  amount: number;
};

export type Invoice = {
  id: string;
  number: string;
  billingPeriod: string;
  planId: BillingPlanId;
  planName: string;
  amount: number;
  subtotal: number;
  discount: number;
  tax: number;
  status: InvoiceStatus;
  date: string;
  paidAt?: string;
  merchantName: string;
  billingEmail: string;
  paymentMethodSummary: string;
  items: InvoiceItem[];
};

export type BillingDataState = "default" | "loading" | "empty" | "partial" | "error";

export type BillingPreviewState =
  | "default"
  | "starter_current"
  | "growth_current"
  | "pro_current"
  | "trial"
  | "recommended_plan"
  | "plan_unavailable"
  | "plan_data_loading"
  | "plan_data_failed"
  | "staff_view_only"
  | "approaching_limit"
  | "near_limit"
  | "limit_reached"
  | "payment_failed"
  | "grace_period"
  | "paid_features_paused"
  | "downgrade_scheduled"
  | "cancellation_scheduled"
  | "cancelled"
  | "upgrade_review"
  | "upgrade_processing"
  | "upgrade_success"
  | "upgrade_failed"
  | "platform_approval_cancelled"
  | "downgrade_review"
  | "downgrade_scheduled_dialog"
  | "downgrade_failed"
  | "add_payment_method"
  | "update_payment_method"
  | "payment_method_save_failed"
  | "removal_confirmation"
  | "removal_blocked"
  | "payment_retrying"
  | "payment_recovered"
  | "cancel_subscription"
  | "cancellation_success"
  | "cancellation_failed"
  | "reactivate_subscription"
  | "invoice_details"
  | "invoice_download_failed";

export type ComparisonFeature = {
  name: string;
  tooltip?: string;
  starter: string | boolean;
  growth: string | boolean;
  pro: string | boolean;
};
