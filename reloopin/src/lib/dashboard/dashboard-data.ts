import { getCentralizedAnalyticsFixture } from "@/lib/analytics-data";
import {
  DashboardAlert,
  DashboardDateRange,
  DashboardFixture,
  DashboardPointsDataPoint,
  DashboardPrototypeState,
  DashboardRecentActivityItem,
  DashboardSetupChecklist,
  DashboardStore,
} from "./dashboard-types";

export const DASHBOARD_STORES: DashboardStore[] = [
  {
    id: "northstar",
    slug: "northstar-goods",
    name: "Northstar Goods",
    platform: "WooCommerce",
    status: "Connected",
    connected: true,
    avatarLetter: "N",
  },
  {
    id: "urban",
    slug: "urban-goods",
    name: "Urban Goods",
    platform: "Shopify",
    status: "Connected",
    connected: true,
    avatarLetter: "U",
  },
];

const INITIAL_CHECKLIST: DashboardSetupChecklist = {
  requiredSteps: [
    {
      id: "req-1",
      title: "Store connected",
      explanation: "WooCommerce store connection verified and synced.",
      completed: true,
      actionLabel: "View store",
    },
    {
      id: "req-2",
      title: "Earning rule active",
      explanation: "Customers earn 5 points per $1 spent on all catalog items.",
      completed: true,
      actionLabel: "Edit rule",
    },
    {
      id: "req-3",
      title: "VIP tiers created",
      explanation: "Bronze, Silver, and Gold tiers defined with point thresholds.",
      completed: true,
      actionLabel: "Manage tiers",
    },
    {
      id: "req-4",
      title: "Widget branded",
      explanation: "Store colors, fonts, and greeting customized on storefront.",
      completed: true,
      actionLabel: "Preview widget",
    },
  ],
  optionalSteps: [
    {
      id: "opt-1",
      title: "Create your first reward",
      explanation: "Give customers a reason to redeem points and place repeat orders.",
      completed: false,
      actionLabel: "Create reward",
      actionHref: "#create-reward",
    },
    {
      id: "opt-2",
      title: "Import existing customers",
      explanation: "Bring customer purchase history from WooCommerce into Reloopin.",
      completed: false,
      actionLabel: "Import customers",
      actionHref: "#import-customers",
    },
    {
      id: "opt-3",
      title: "Set up a welcome email",
      explanation: "Automatically send points balance and bonus reward on signup.",
      completed: false,
      actionLabel: "Configure email",
      actionHref: "/automations/new",
    },
    {
      id: "opt-4",
      title: "Preview customer widget",
      explanation: "Check the floating widget look and feel in live storefront mode.",
      completed: false,
      actionLabel: "Open preview",
      actionHref: "#preview-widget",
    },
  ],
};

const BASE_RECENT_ACTIVITY: DashboardRecentActivityItem[] = [
  {
    id: "act-1",
    type: "points_earned",
    customerName: "Maya Chen",
    customerEmail: "maya.chen@example.com",
    description: "Maya Chen earned 500 points",
    relatedEntity: "Order #NG-1048",
    timestamp: "4 minutes ago",
    details: {
      orderId: "#NG-1048",
      points: 500,
      channel: "WooCommerce checkout",
      reason: "5 points per $1 spent on $100 order",
    },
  },
  {
    id: "act-2",
    type: "tier_upgraded",
    customerName: "Jordan Lee",
    customerEmail: "jordan.lee@example.com",
    description: "Jordan Lee reached the Gold tier",
    relatedEntity: "Gold tier",
    timestamp: "18 minutes ago",
    details: {
      tierName: "Gold",
      points: 1250,
      reason: "Crossed 1,000 points entry threshold",
    },
  },
  {
    id: "act-3",
    type: "reward_redeemed",
    customerName: "Priya Shah",
    customerEmail: "priya.shah@example.com",
    description: "Priya Shah redeemed Free Shipping",
    relatedEntity: "Order #NG-1046",
    timestamp: "32 minutes ago",
    details: {
      orderId: "#NG-1046",
      rewardName: "Free Shipping",
      points: 300,
      reason: "Redeemed reward code at checkout",
    },
  },
  {
    id: "act-4",
    type: "customer_joined",
    customerName: "Leo Martin",
    customerEmail: "leo.martin@example.com",
    description: "Leo Martin joined the loyalty program",
    relatedEntity: "Account signup",
    timestamp: "1 hour ago",
    details: {
      points: 50,
      reason: "Welcome bonus upon account creation",
    },
  },
  {
    id: "act-5",
    type: "points_earned",
    customerName: "Marcus Vance",
    customerEmail: "marcus.v@example.com",
    description: "Marcus Vance earned 350 points",
    relatedEntity: "Order #NG-1045",
    timestamp: "2 hours ago",
    details: {
      orderId: "#NG-1045",
      points: 350,
      channel: "WooCommerce checkout",
    },
  },
  {
    id: "act-6",
    type: "referral_completed",
    customerName: "Chloe Bennett",
    customerEmail: "chloe.b@example.com",
    description: "Chloe Bennett completed a referral",
    relatedEntity: "Reward: $10 off",
    timestamp: "3 hours ago",
    details: {
      rewardName: "$10 off coupon",
      points: 200,
      reason: "Friend completed first qualifying purchase",
    },
  },
  {
    id: "act-7",
    type: "reward_redeemed",
    customerName: "Samantha Reed",
    customerEmail: "samantha.r@example.com",
    description: "Samantha Reed redeemed $10 loyalty reward",
    relatedEntity: "Order #NG-1042",
    timestamp: "5 hours ago",
    details: {
      orderId: "#NG-1042",
      rewardName: "$10 loyalty reward",
      points: 500,
    },
  },
  {
    id: "act-8",
    type: "tier_upgraded",
    customerName: "David Kim",
    customerEmail: "david.kim@example.com",
    description: "David Kim reached the Silver tier",
    relatedEntity: "Silver tier",
    timestamp: "6 hours ago",
    details: {
      tierName: "Silver",
      points: 620,
      reason: "Crossed 500 points entry threshold",
    },
  },
];

export function getDashboardFixture(
  storeIdOrSlug: string = "northstar",
  dateRange: DashboardDateRange = "30d",
  stateOverride: DashboardPrototypeState = "default",
): DashboardFixture {
  const store =
    DASHBOARD_STORES.find(
      (s) => s.id === storeIdOrSlug || s.slug === storeIdOrSlug,
    ) || DASHBOARD_STORES[0];

  const analytics = getCentralizedAnalyticsFixture(store.id);

  // Daily points activity mapped from analytics single source of truth
  const daily: DashboardPointsDataPoint[] = analytics.loyalty.pointsDaily.map(
    (p) => ({
      date: p.date,
      label: p.label,
      earned: p.earned,
      redeemed: p.redeemed,
      netChange: p.netChange,
    }),
  );

  // Grouped 4-week summary for weekly toggle
  const weekly: DashboardPointsDataPoint[] = [
    {
      date: "2026-W35",
      label: "Week 1 (Aug 24-30)",
      earned: 46700,
      redeemed: 24800,
      netChange: 21900,
    },
    {
      date: "2026-W36",
      label: "Week 2 (Aug 31-Sep 6)",
      earned: 46700,
      redeemed: 22800,
      netChange: 23900,
    },
    {
      date: "2026-W37",
      label: "Week 3 (Sep 7-13)",
      earned: 46500,
      redeemed: 22500,
      netChange: 24000,
    },
    {
      date: "2026-W38",
      label: "Week 4 (Sep 14-22)",
      earned: 46500,
      redeemed: 22500,
      netChange: 24000,
    },
  ];

  const totalEarned = daily.reduce((acc, d) => acc + d.earned, 0); // 186,400
  const totalRedeemed = daily.reduce((acc, d) => acc + d.redeemed, 0); // 92,600

  // 4 Primary KPI cards precisely reconciled
  const activeMembersValue =
    store.id === "urban"
      ? 964
      : analytics.loyalty.kpis.activeMembers.numericValue; // 1,842

  const pointsOutstandingValue = store.id === "urban" ? 194500 : 384920;

  const redemptionRateValue =
    store.id === "urban" ? "52.4%" : "49.7%";

  const repeatLiftValue =
    store.id === "urban" ? "+9.2 pts" : "+11.8 pts";

  const alerts: DashboardAlert[] = [];

  // Conditional alerts based on prototype state or store
  if (stateOverride === "stale_data") {
    alerts.push({
      id: "alert-sync-delayed",
      type: "warning",
      title: "Store data has not synced for 6 hours",
      description:
        "Recent orders and customer activity may not appear on the dashboard.",
      actionLabel: "Review integration",
      actionHref: "/settings#integrations",
      isDismissible: false,
    });
  }

  if (stateOverride === "no_reward") {
    alerts.push({
      id: "alert-no-reward",
      type: "warning",
      title: "Customers cannot redeem their points yet",
      description:
        "Create an active reward so customers have a reason to use their points.",
      actionLabel: "Create reward",
      actionHref: "#create-reward",
      isDismissible: false,
    });
  }

  if (stateOverride === "no_earning_rule") {
    alerts.push({
      id: "alert-no-earning",
      type: "warning",
      title: "Customers cannot earn points yet",
      description:
        "Create or activate an earning rule to start rewarding customer purchases.",
      actionLabel: "Create earning rule",
      actionHref: "#create-earning-rule",
      isDismissible: false,
    });
  }

  // Standard operational alerts in default state
  if (stateOverride === "default") {
    alerts.push(
      {
        id: "alert-store-sync",
        type: "warning",
        title: "Store data has not synced for 6 hours",
        description:
          "Recent orders and customer activity may not appear on the dashboard.",
        actionLabel: "Review integration",
        actionHref: "/settings#integrations",
        isDismissible: false,
      },
      {
        id: "alert-verify-sender",
        type: "info",
        title: "Verify your sending email",
        description:
          "Campaigns and automations cannot send emails until the sender is verified.",
        actionLabel: "Verify sender",
        actionHref: "/settings#email-sender",
        isDismissible: true,
      },
    );
  }

  // Popular rewards - top 3
  const popularRewardsList = [
    {
      id: "rew-1",
      name: "15% off next order",
      type: "Percentage discount",
      redemptions: store.id === "urban" ? 640 : 1240,
      pointsUsed: store.id === "urban" ? 32000 : 62000,
      status: "Active" as const,
      percentage: store.id === "urban" ? 45.2 : 46.2,
      campaign: "Autumn Member Exclusive",
      associatedOrderValue: store.id === "urban" ? 9600 : 18600,
    },
    {
      id: "rew-2",
      name: "$10 loyalty reward",
      type: "Fixed amount discount",
      redemptions: store.id === "urban" ? 420 : 840,
      pointsUsed: store.id === "urban" ? 21000 : 42000,
      status: "Active" as const,
      percentage: store.id === "urban" ? 29.8 : 31.3,
      campaign: "Points Redemption Tier 1",
      associatedOrderValue: store.id === "urban" ? 6200 : 12400,
    },
    {
      id: "rew-3",
      name: "Free shipping",
      type: "Shipping perk",
      redemptions: store.id === "urban" ? 310 : 620,
      pointsUsed: store.id === "urban" ? 9300 : 18600,
      status: "Active" as const,
      percentage: store.id === "urban" ? 22.0 : 23.1,
      campaign: "VIP Loyalty Welcome",
      associatedOrderValue: store.id === "urban" ? 4100 : 8200,
    },
  ];

  // VIP tiers - perfectly reconciled
  const vipTiersList =
    store.id === "urban"
      ? [
          {
            id: "tier-gold",
            name: "Gold",
            color: "#eab308",
            customers: 114,
            percentage: 11.8,
            threshold: 1000,
            avgPoints: 1420,
            avgOrderValue: 154,
          },
          {
            id: "tier-silver",
            name: "Silver",
            color: "#94a3b8",
            customers: 248,
            percentage: 25.7,
            threshold: 500,
            avgPoints: 680,
            avgOrderValue: 118,
          },
          {
            id: "tier-bronze",
            name: "Bronze",
            color: "#d97706",
            customers: 532,
            percentage: 55.2,
            threshold: 100,
            avgPoints: 240,
            avgOrderValue: 88,
          },
          {
            id: "tier-none",
            name: "No tier",
            color: "#71717a",
            customers: 70,
            percentage: 7.3,
            threshold: 0,
            avgPoints: 45,
            avgOrderValue: 62,
          },
        ]
      : [
          {
            id: "tier-gold",
            name: "Gold",
            color: "#eab308",
            customers: 212,
            percentage: 11.5,
            threshold: 1000,
            avgPoints: 1480,
            avgOrderValue: 168,
          },
          {
            id: "tier-silver",
            name: "Silver",
            color: "#94a3b8",
            customers: 480,
            percentage: 26.1,
            threshold: 500,
            avgPoints: 720,
            avgOrderValue: 124,
          },
          {
            id: "tier-bronze",
            name: "Bronze",
            color: "#d97706",
            customers: 1020,
            percentage: 55.4,
            threshold: 100,
            avgPoints: 260,
            avgOrderValue: 92,
          },
          {
            id: "tier-none",
            name: "No tier",
            color: "#71717a",
            customers: 130,
            percentage: 7.0,
            threshold: 0,
            avgPoints: 48,
            avgOrderValue: 64,
          },
        ];

  const totalTierCustomers = vipTiersList.reduce((acc, t) => acc + t.customers, 0); // 1,842 for Northstar

  return {
    store,
    dateRange,
    freshnessLabel:
      stateOverride === "stale_data"
        ? "Last synced 6 hours ago"
        : "Last synced 2 minutes ago",
    summary: {
      status:
        stateOverride === "low_data"
          ? "low_data"
          : stateOverride === "no_activity"
          ? "neutral"
          : "positive",
      title:
        stateOverride === "low_data"
          ? "Early loyalty insights"
          : stateOverride === "no_activity"
          ? "Your loyalty activity remained steady"
          : "Your loyalty program is growing",
      description:
        stateOverride === "low_data"
          ? "Your program is collecting data. These results may change as more customers earn and redeem points."
          : stateOverride === "no_activity"
          ? "Member activity was similar to the previous period, while reward redemptions increased slightly."
          : `Active members increased by 12.4%, and the program generated an estimated ${
              store.id === "urban" ? "2.8x" : "3.3x"
            } return during the last 30 days.`,
      actions: [
        {
          label: "View analytics",
          href: "/analytics",
          actionKey: "view_analytics",
        },
        {
          label: "View methodology",
          actionKey: "view_methodology",
        },
      ],
    },
    alerts,
    kpis: {
      activeMembers: {
        id: "active_members",
        label: "Active members",
        value: activeMembersValue.toLocaleString(),
        comparison: "+12.4% from the previous period",
        comparisonDirection: "up",
        comparisonIsPositive: true,
        tooltip:
          "Customers who earned points, redeemed a reward, or completed an eligible order during this period.",
        sparkline: [1420, 1490, 1530, 1590, 1640, 1710, 1780, 1842],
        sheetData: {
          title: "Active members",
          description:
            "Customers who earned points, redeemed a reward, or completed an eligible order during this period.",
          currentValue: activeMembersValue.toLocaleString(),
          previousValue: "1,638",
          change: "+204 (+12.4%)",
          changeDirection: "up",
          metrics: [
            { label: "Active members", value: activeMembersValue.toLocaleString() },
            { label: "New members", value: "248" },
            { label: "Returning members", value: "1,594" },
            { label: "Previous period", value: "1,638" },
            { label: "Net growth", value: "+204" },
          ],
          actionLabel: "View customers",
          actionHref: "/customers",
        },
      },
      pointsOutstanding: {
        id: "points_outstanding",
        label: "Points outstanding",
        value: pointsOutstandingValue.toLocaleString(),
        supportingCopy: "Across all customer balances",
        tooltip:
          "Points currently available across customer accounts and not yet redeemed or expired.",
        sparkline: [340000, 348000, 355000, 362000, 371000, 378000, 384920],
        sheetData: {
          title: "Points outstanding",
          description:
            "Points currently available across customer accounts and not yet redeemed or expired.",
          currentValue: pointsOutstandingValue.toLocaleString(),
          previousValue: "342,000",
          change: "+42,920 (+12.5%)",
          changeDirection: "up",
          metrics: [
            { label: "Available points", value: pointsOutstandingValue.toLocaleString() },
            { label: "Points earned this period", value: "186,400" },
            { label: "Points redeemed this period", value: "92,600" },
            { label: "Points expired", value: "14,200" },
            { label: "Estimated liability ($0.01/pt)", value: "$3,849.20" },
          ],
          actionLabel: "View points activity",
          actionHref: "#points-activity",
        },
      },
      redemptionRate: {
        id: "redemption_rate",
        label: "Redemption rate",
        value: redemptionRateValue,
        comparison: "-3.2 percentage points",
        comparisonDirection: "down",
        comparisonIsPositive: false,
        tooltip:
          "Points redeemed divided by points earned during the selected period. Customers may redeem points earned earlier, so this value can occasionally exceed 100%.",
        sparkline: [54, 52, 53, 51, 50, 50.4, 49.7],
        sheetData: {
          title: "Redemption rate",
          description:
            "Points redeemed divided by points earned during the selected period (92,600 / 186,400 x 100).",
          currentValue: redemptionRateValue,
          previousValue: "52.9%",
          change: "-3.2 percentage points",
          changeDirection: "down",
          metrics: [
            { label: "Current redemption rate", value: redemptionRateValue },
            { label: "Points redeemed", value: "92,600" },
            { label: "Points earned", value: "186,400" },
            { label: "Previous period rate", value: "52.9%" },
            { label: "Healthy benchmark range", value: "35% - 60%" },
          ],
          actionLabel: "View redemption rules",
          actionHref: "#rewards",
        },
      },
      repeatLift: {
        id: "repeat_lift",
        label: "Repeat purchase lift",
        value: repeatLiftValue,
        comparison: "+1.6 points from the previous period",
        comparisonDirection: "up",
        comparisonIsPositive: true,
        tooltip:
          "The difference between the repeat purchase rate of loyalty members and non-members.",
        sparkline: [9.2, 9.8, 10.2, 10.8, 11.2, 11.5, 11.8],
        sheetData: {
          title: "Repeat purchase lift",
          description:
            "The difference between member repeat purchase rate (38.4%) and non-member repeat purchase rate (26.6%).",
          currentValue: repeatLiftValue,
          previousValue: "+10.2 pts",
          change: "+1.6 points",
          changeDirection: "up",
          metrics: [
            { label: "Member repeat rate", value: "38.4%" },
            { label: "Non-member repeat rate", value: "26.6%" },
            { label: "Net purchase lift", value: "+11.8 pts" },
            { label: "Previous lift", value: "+10.2 pts" },
            { label: "Eligible orders analyzed", value: "3,412" },
          ],
          actionLabel: "View detailed comparison",
          actionHref: "/analytics?tab=loyalty",
        },
      },
    },
    pointsActivity: {
      daily,
      weekly,
      totals: {
        earned: totalEarned,
        redeemed: totalRedeemed,
        netChange: totalEarned - totalRedeemed,
      },
    },
    programValue: {
      isAvailable: stateOverride !== "roi_unavailable",
      summary:
        store.id === "urban"
          ? "Your loyalty program returned an estimated $2.80 for every $1 spent."
          : "Your loyalty program returned an estimated $3.30 for every $1 spent.",
      returnMultiple: store.id === "urban" ? 2.8 : 3.3,
      incrementalRevenue: store.id === "urban" ? 18400 : 39600,
      programCost: store.id === "urban" ? 6500 : 12000,
      netValue: store.id === "urban" ? 11900 : 27600,
      revenueCategories: [
        {
          label: "Additional repeat purchases",
          amount: store.id === "urban" ? 11200 : 24800,
          description:
            "Revenue from loyalty members purchasing more frequently than matched non-members.",
        },
        {
          label: "Reward redemptions",
          amount: store.id === "urban" ? 5200 : 10600,
          description:
            "Order value generated on transactions where a reward coupon was redeemed.",
        },
        {
          label: "VIP spend lift",
          amount: store.id === "urban" ? 2000 : 4200,
          description:
            "Higher average order value achieved by customers in Silver and Gold tiers.",
        },
      ],
      costCategories: [
        {
          label: "Points issued liability",
          amount: store.id === "urban" ? 3800 : 7200,
          description:
            "Booked value of points issued during the period based on $0.01 per point redemption cost.",
        },
        {
          label: "Redeemed discounts",
          amount: store.id === "urban" ? 2700 : 4800,
          description:
            "Actual discount dollars deducted at WooCommerce checkout using reward codes.",
        },
      ],
    },
    vipTiers: {
      hasTiers: stateOverride !== "first_run",
      tiers: vipTiersList,
      totalCustomers: totalTierCustomers,
      insight:
        store.id === "urban"
          ? "48 customers upgraded this month"
          : "96 customers upgraded this month",
    },
    popularRewards: {
      hasRewards: stateOverride !== "first_run" && stateOverride !== "no_reward",
      rewards: popularRewardsList,
    },
    recentActivity:
      stateOverride === "no_recent_activity" ? [] : BASE_RECENT_ACTIVITY,
    setupChecklist: INITIAL_CHECKLIST,
  };
}
