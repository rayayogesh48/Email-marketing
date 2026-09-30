import {
  BillingConfig,
  BillingPeriod,
  Invoice,
  PaymentDetails,
  UsageOrder,
  DailyUsagePoint,
  BillingActivityItem,
  BillingUsageStatus,
} from "./billing-types";

// Centralized calculation constants and functions
export const FREE_ORDER_THRESHOLD = 50;
export const PRICE_PER_ORDER = 0.05;

/**
 * Calculates estimated or final usage fee for counted orders.
 * 0 to 50 orders: Free ($0.00)
 * 51+ orders: All counted orders billed at $0.05 each (e.g. 51 * 0.05 = $2.55)
 */
export function calculateEstimatedCharge(countedOrders: number): number {
  if (countedOrders <= FREE_ORDER_THRESHOLD) return 0;
  return Number((countedOrders * PRICE_PER_ORDER).toFixed(2));
}

export function getUsageStatus(countedOrders: number): BillingUsageStatus {
  if (countedOrders <= 0) return "free";
  if (countedOrders <= 39) return "free";
  if (countedOrders <= 49) return "approaching_threshold";
  if (countedOrders === 50) return "threshold_reached";
  return "billable";
}

export const defaultBillingConfig: BillingConfig = {
  currency: "USD",
  freeOrderThreshold: FREE_ORDER_THRESHOLD,
  pricePerCountedOrder: PRICE_PER_ORDER,
  billingPeriod: "calendar_month",
  billingMode: "direct",
  countedOrderStatuses: ["paid", "fulfilled"],
  excludedOrderStatuses: ["draft", "test", "cancelled", "refunded"],
};

export const defaultPaymentDetails: PaymentDetails = {
  billingMode: "direct",
  hasPaymentMethod: true,
  brand: "visa",
  last4: "4242",
  expiryMonth: 8,
  expiryYear: 2028,
  billingName: "Olivia Morgan",
  billingEmail: "olivia@northstargoods.com",
  status: "valid",
  gracePeriodEndsAt: "7 October 2026",
};

export const initialPeriods: BillingPeriod[] = [
  {
    id: "period-2026-09",
    name: "September 2026",
    startsAt: "Sep 1, 2026",
    endsAt: "Sep 30, 2026",
    totalSyncedOrders: 85,
    countedOrders: 76,
    excludedOrders: 6,
    underReviewOrders: 3,
    estimatedCharge: 3.8, // 76 * 0.05
    status: "open",
    lastSyncedAt: "2 minutes ago",
  },
  {
    id: "period-2026-08",
    name: "August 2026",
    startsAt: "Aug 1, 2026",
    endsAt: "Aug 31, 2026",
    totalSyncedOrders: 47,
    countedOrders: 42,
    excludedOrders: 5,
    underReviewOrders: 0,
    estimatedCharge: 0,
    finalCharge: 0,
    status: "paid",
    lastSyncedAt: "Aug 31, 2026",
    invoiceId: "INV-2026-008-FREE",
  },
  {
    id: "period-2026-07",
    name: "July 2026",
    startsAt: "Jul 1, 2026",
    endsAt: "Jul 31, 2026",
    totalSyncedOrders: 412,
    countedOrders: 384,
    excludedOrders: 28,
    underReviewOrders: 0,
    estimatedCharge: 19.2,
    finalCharge: 19.2,
    status: "paid",
    lastSyncedAt: "Jul 31, 2026",
    invoiceId: "INV-2026-007",
  },
  {
    id: "period-2026-06",
    name: "June 2026",
    startsAt: "Jun 1, 2026",
    endsAt: "Jun 30, 2026",
    totalSyncedOrders: 546,
    countedOrders: 510,
    excludedOrders: 36,
    underReviewOrders: 0,
    estimatedCharge: 25.5,
    finalCharge: 25.5,
    status: "paid",
    lastSyncedAt: "Jun 30, 2026",
    invoiceId: "INV-2026-006",
  },
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-2026-008-free",
    invoiceNumber: "INV-2026-008",
    periodId: "period-2026-08",
    periodName: "August 2026",
    countedOrders: 42,
    ratePerOrder: 0.05,
    amount: 0.0,
    status: "paid",
    date: "1 September 2026",
    dueDate: "8 September 2026",
    paidAt: "1 September 2026",
    billingMethod: "Free tier (Under 50 orders)",
    merchantName: "Northstar Goods",
    billingEmail: "billing@northstargoods.com",
    subtotal: 0.0,
    tax: 0.0,
    total: 0.0,
    isFreeMonth: true,
  },
  {
    id: "inv-2026-007",
    invoiceNumber: "INV-2026-007",
    periodId: "period-2026-07",
    periodName: "July 2026",
    countedOrders: 384,
    ratePerOrder: 0.05,
    amount: 19.2,
    status: "paid",
    date: "1 August 2026",
    dueDate: "8 August 2026",
    paidAt: "1 August 2026",
    billingMethod: "Visa ending in 4242",
    merchantName: "Northstar Goods",
    billingEmail: "billing@northstargoods.com",
    subtotal: 19.2,
    tax: 0.0,
    total: 19.2,
  },
  {
    id: "inv-2026-006",
    invoiceNumber: "INV-2026-006",
    periodId: "period-2026-06",
    periodName: "June 2026",
    countedOrders: 510,
    ratePerOrder: 0.05,
    amount: 25.5,
    status: "paid",
    date: "1 July 2026",
    dueDate: "8 July 2026",
    paidAt: "1 July 2026",
    billingMethod: "Visa ending in 4242",
    merchantName: "Northstar Goods",
    billingEmail: "billing@northstargoods.com",
    subtotal: 25.5,
    tax: 0.0,
    total: 25.5,
  },
];

// Helper to generate the initial seed of realistic store orders
export function generateSeedOrders(countedCount: number = 76): UsageOrder[] {
  const customerNames = [
    { name: "Maya Chen", email: "maya.chen@example.com" },
    { name: "Liam Vance", email: "liam.vance@example.com" },
    { name: "Elena Rostova", email: "elena.rostova@example.com" },
    { name: "Marcus Thorne", email: "marcus.thorne@example.com" },
    { name: "Aria Montgomery", email: "aria.m@example.com" },
    { name: "Lucas Scott", email: "lucas.scott@example.com" },
    { name: "Sophie Bennett", email: "sophie.b@example.com" },
    { name: "Kai Tanaka", email: "kai.tanaka@example.com" },
    { name: "Isabella Cruz", email: "isabella.c@example.com" },
    { name: "Noah Campbell", email: "noah.c@example.com" },
    { name: "Zoe Washington", email: "zoe.w@example.com" },
    { name: "Oliver Hughes", email: "oliver.h@example.com" },
    { name: "Emma Watson", email: "emma.w@example.com" },
    { name: "Daniel Craig", email: "daniel.c@example.com" },
    { name: "Hannah Abbott", email: "hannah.a@example.com" },
    { name: "James Potter", email: "james.p@example.com" },
    { name: "Lily Evans", email: "lily.e@example.com" },
    { name: "Ethan Hunt", email: "ethan.h@example.com" },
    { name: "Chloe Price", email: "chloe.p@example.com" },
    { name: "Leo Valdez", email: "leo.v@example.com" },
  ];

  const orders: UsageOrder[] = [];
  const baseOrderNum = 1000;
  const isBillableMonth = countedCount > FREE_ORDER_THRESHOLD;
  const chargePerCountedOrder = isBillableMonth ? PRICE_PER_ORDER : 0.0;

  // 1. Generate counted orders
  for (let i = 1; i <= countedCount; i++) {
    const cust = customerNames[(i - 1) % customerNames.length];
    const orderNum = `#${baseOrderNum + i}`;
    const day = Math.min(29, Math.max(1, Math.floor((i / countedCount) * 28) + 1));
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const totals = [48.5, 124.0, 89.95, 34.0, 160.0, 72.5, 210.0, 55.0, 98.2];
    const total = totals[i % totals.length];
    const status = i % 2 === 0 ? "fulfilled" : "paid";

    orders.push({
      id: `ord-${i}`,
      orderNumber: orderNum,
      customerName: cust.name,
      customerEmail: cust.email,
      orderTotal: total,
      currency: "USD",
      storeStatus: status,
      billingStatus: "counted",
      syncedAt: `Sep ${dayStr}, 2026 14:${(i % 50 + 10).toString().padStart(2, "0")}`,
      orderDate: `Sep ${dayStr}, 2026`,
      usageCharge: chargePerCountedOrder,
    });
  }

  // 2. Add realistic Excluded orders
  orders.push(
    {
      id: "ord-ex-1",
      orderNumber: `#${baseOrderNum + countedCount + 1}`,
      customerName: "Nathan Drake",
      customerEmail: "nathan.d@example.com",
      orderTotal: 145.0,
      currency: "USD",
      storeStatus: "refunded",
      billingStatus: "excluded",
      exclusionReason: "Order was refunded in full in Shopify.",
      syncedAt: "Sep 28, 2026 11:20",
      orderDate: "Sep 27, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-ex-2",
      orderNumber: `#${baseOrderNum + countedCount + 2}`,
      customerName: "Lara Croft",
      customerEmail: "lara.c@example.com",
      orderTotal: 65.0,
      currency: "USD",
      storeStatus: "cancelled",
      billingStatus: "excluded",
      exclusionReason: "Order was cancelled prior to shipping.",
      syncedAt: "Sep 25, 2026 09:14",
      orderDate: "Sep 25, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-ex-3",
      orderNumber: `#${baseOrderNum + countedCount + 3}`,
      customerName: "Test Order #1",
      customerEmail: "test@northstargoods.com",
      orderTotal: 1.0,
      currency: "USD",
      storeStatus: "test",
      billingStatus: "excluded",
      exclusionReason: "Marked as test mode transaction in Shopify.",
      syncedAt: "Sep 15, 2026 16:42",
      orderDate: "Sep 15, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-ex-4",
      orderNumber: `#${baseOrderNum + countedCount + 4}`,
      customerName: "Arthur Morgan",
      customerEmail: "arthur.m@example.com",
      orderTotal: 210.0,
      currency: "USD",
      storeStatus: "refunded",
      billingStatus: "excluded",
      exclusionReason: "Customer returned order items.",
      syncedAt: "Sep 12, 2026 10:05",
      orderDate: "Sep 10, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-ex-5",
      orderNumber: `#${baseOrderNum + countedCount + 5}`,
      customerName: "Draft Checkout #9",
      customerEmail: "draft@example.com",
      orderTotal: 99.0,
      currency: "USD",
      storeStatus: "draft",
      billingStatus: "excluded",
      exclusionReason: "Draft order abandoned prior to payment.",
      syncedAt: "Sep 08, 2026 18:30",
      orderDate: "Sep 08, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-ex-6",
      orderNumber: `#${baseOrderNum + countedCount + 6}`,
      customerName: "John Marston",
      customerEmail: "john.m@example.com",
      orderTotal: 18.5,
      currency: "USD",
      storeStatus: "cancelled",
      billingStatus: "excluded",
      exclusionReason: "Duplicate transaction cancelled by customer.",
      syncedAt: "Sep 03, 2026 14:12",
      orderDate: "Sep 03, 2026",
      usageCharge: 0,
    }
  );

  // 3. Add Under Review orders
  orders.push(
    {
      id: "ord-rev-1",
      orderNumber: `#${baseOrderNum + countedCount + 7}`,
      customerName: "Victor Vance",
      customerEmail: "victor.v@example.com",
      orderTotal: 84.0,
      currency: "USD",
      storeStatus: "paid",
      billingStatus: "under_review",
      exclusionReason: "Payment capture is pending verification from Shopify.",
      syncedAt: "Just now",
      orderDate: "Sep 29, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-rev-2",
      orderNumber: `#${baseOrderNum + countedCount + 8}`,
      customerName: "Samantha Reed",
      customerEmail: "samantha.r@example.com",
      orderTotal: 112.5,
      currency: "USD",
      storeStatus: "fulfilled",
      billingStatus: "under_review",
      exclusionReason: "Dispute inquiry is being evaluated.",
      syncedAt: "10 minutes ago",
      orderDate: "Sep 29, 2026",
      usageCharge: 0,
    },
    {
      id: "ord-rev-3",
      orderNumber: `#${baseOrderNum + countedCount + 9}`,
      customerName: "Gwen Stacy",
      customerEmail: "gwen.s@example.com",
      orderTotal: 49.0,
      currency: "USD",
      storeStatus: "paid",
      billingStatus: "under_review",
      exclusionReason: "Fulfillment webhook pending confirmation.",
      syncedAt: "1 hour ago",
      orderDate: "Sep 29, 2026",
      usageCharge: 0,
    }
  );

  // Reverse so newest orders appear at top
  return orders.reverse();
}

/**
 * Builds deterministic 30-day cumulative chart data for September
 * according to the currently active counted orders count.
 */
export function generateDailyUsagePoints(totalCounted: number): DailyUsagePoint[] {
  const points: DailyUsagePoint[] = [];
  const currentDay = 29; // Today in prototype
  let cumulative = 0;

  for (let day = 1; day <= 30; day++) {
    const dayStr = `Sep ${day}`;
    let daily = 0;

    if (day <= currentDay) {
      if (totalCounted === 0) {
        daily = 0;
      } else {
        // Distribute totalCounted across 29 days
        const avg = totalCounted / currentDay;
        // Deterministic pseudo-variation
        const variation = (Math.sin(day * 1.5) * 0.4 + 1);
        const targetShare = Math.round(avg * variation);
        
        if (day === currentDay) {
          daily = Math.max(0, totalCounted - cumulative);
        } else {
          daily = Math.max(0, Math.min(targetShare, totalCounted - cumulative));
        }
      }
      cumulative += daily;
    }

    const estimatedCharge = calculateEstimatedCharge(cumulative);

    points.push({
      day,
      dateStr: dayStr,
      dailyCounted: day <= currentDay ? daily : 0,
      runningTotal: day <= currentDay ? cumulative : cumulative,
      estimatedCharge,
    });
  }

  return points;
}

export const initialActivityTimeline: BillingActivityItem[] = [
  {
    id: "act-1",
    type: "order_added",
    title: "Counted order #1076 synchronized",
    description: "Added from Shopify store webhook. Estimated charge: $3.80.",
    timestamp: "2 minutes ago",
  },
  {
    id: "act-2",
    type: "order_added",
    title: "Counted order #1075 synchronized",
    description: "Added from Shopify store webhook. Estimated charge: $3.75.",
    timestamp: "18 minutes ago",
  },
  {
    id: "act-3",
    type: "order_excluded",
    title: "Refunded order #1071 excluded",
    description: "Order marked as refunded in Shopify. Charge reduced by $0.05.",
    timestamp: "2 hours ago",
  },
  {
    id: "act-4",
    type: "count_recalculated",
    title: "Usage-based billing activated at order #1051",
    description: "Monthly threshold exceeded (50 orders). All 51 counted orders billed at $0.05 each.",
    timestamp: "Sep 21, 2026",
  },
  {
    id: "act-5",
    type: "payment_success",
    title: "August 2026 billing finalized",
    description: "42 counted orders processed. Total bill: $0.00 (within free threshold).",
    timestamp: "Sep 1, 2026",
  },
  {
    id: "act-6",
    type: "invoice_created",
    title: "July 2026 invoice INV-2026-007 paid",
    description: "384 counted orders × $0.05 = $19.20 charged to Visa ending in 4242.",
    timestamp: "Aug 1, 2026",
  },
];
