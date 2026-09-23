export type DashboardPrototypeState =
  | "default"
  | "loading"
  | "first_run"
  | "low_data"
  | "no_activity"
  | "onboarding_incomplete"
  | "no_earning_rule"
  | "no_reward"
  | "store_switching"
  | "disconnected"
  | "syncing"
  | "stale_data"
  | "partial_error"
  | "page_error"
  | "restricted"
  | "roi_unavailable"
  | "no_recent_activity";

export type DashboardDateRange = "7d" | "30d" | "90d" | "year" | "custom";

export interface DashboardStore {
  id: string;
  slug: string;
  name: string;
  platform: "WooCommerce" | "Shopify";
  status: "Connected" | "Disconnected";
  connected: boolean;
  avatarLetter: string;
}

export interface DashboardProgramSummary {
  status: "positive" | "neutral" | "negative" | "low_data" | "loading" | "unavailable";
  title: string;
  description: string;
  actions: {
    label: string;
    href?: string;
    actionKey?: "view_analytics" | "view_methodology" | "review_performance";
  }[];
}

export interface DashboardAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  isDismissible: boolean;
}

export interface DashboardKPICard {
  id: "active_members" | "points_outstanding" | "redemption_rate" | "repeat_lift";
  label: string;
  value: string;
  comparison?: string;
  comparisonDirection?: "up" | "down" | "neutral";
  comparisonIsPositive?: boolean;
  supportingCopy?: string;
  tooltip: string;
  sparkline: number[];
  sheetData: {
    title: string;
    description: string;
    currentValue: string;
    previousValue?: string;
    change?: string;
    changeDirection?: "up" | "down" | "neutral";
    metrics: { label: string; value: string }[];
    actionLabel: string;
    actionHref: string;
  };
}

export interface DashboardPointsDataPoint {
  date: string;
  label: string;
  earned: number;
  redeemed: number;
  netChange: number;
}

export interface DashboardPointsActivity {
  daily: DashboardPointsDataPoint[];
  weekly: DashboardPointsDataPoint[];
  totals: {
    earned: number;
    redeemed: number;
    netChange: number;
  };
}

export interface DashboardProgramValue {
  isAvailable: boolean;
  summary: string;
  returnMultiple: number;
  incrementalRevenue: number;
  programCost: number;
  netValue: number;
  revenueCategories: { label: string; amount: number; description: string }[];
  costCategories: { label: string; amount: number; description: string }[];
}

export interface DashboardVIPTierItem {
  id: string;
  name: string;
  color: string;
  customers: number;
  percentage: number;
  threshold: number;
  avgPoints: number;
  avgOrderValue: number;
}

export interface DashboardVIPTierOverview {
  hasTiers: boolean;
  tiers: DashboardVIPTierItem[];
  totalCustomers: number;
  insight: string; // e.g. "96 customers upgraded this month"
}

export interface DashboardRewardItem {
  id: string;
  name: string;
  type: string;
  redemptions: number;
  pointsUsed: number;
  status: "Active" | "Draft" | "Paused";
  percentage: number;
  campaign: string;
  associatedOrderValue: number;
}

export interface DashboardRecentActivityItem {
  id: string;
  type:
    | "points_earned"
    | "reward_redeemed"
    | "tier_upgraded"
    | "referral_completed"
    | "manual_adjustment"
    | "customer_joined"
    | "points_expired"
    | "points_refunded";
  customerName: string;
  customerEmail: string;
  description: string;
  relatedEntity?: string;
  timestamp: string;
  details: {
    orderId?: string;
    points?: number;
    tierName?: string;
    rewardName?: string;
    channel?: string;
    reason?: string;
  };
}

export interface DashboardSetupStep {
  id: string;
  title: string;
  explanation: string;
  completed: boolean;
  actionLabel: string;
  actionHref?: string;
}

export interface DashboardSetupChecklist {
  requiredSteps: DashboardSetupStep[];
  optionalSteps: DashboardSetupStep[];
}

export interface DashboardFixture {
  store: DashboardStore;
  dateRange: DashboardDateRange;
  freshnessLabel: string;
  summary: DashboardProgramSummary;
  alerts: DashboardAlert[];
  kpis: {
    activeMembers: DashboardKPICard;
    pointsOutstanding: DashboardKPICard;
    redemptionRate: DashboardKPICard;
    repeatLift: DashboardKPICard;
  };
  pointsActivity: DashboardPointsActivity;
  programValue: DashboardProgramValue;
  vipTiers: DashboardVIPTierOverview;
  popularRewards: {
    hasRewards: boolean;
    rewards: DashboardRewardItem[];
  };
  recentActivity: DashboardRecentActivityItem[];
  setupChecklist: DashboardSetupChecklist;
}

