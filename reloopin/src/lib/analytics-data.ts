export type PrototypeState =
  | "default"
  | "loading"
  | "first_day"
  | "low_data"
  | "no_activity"
  | "no_filter_results"
  | "partial_data"
  | "stale_data"
  | "disconnected"
  | "section_error"
  | "page_error"
  | "restricted"
  | "roi_unavailable"
  | "exporting"
  | "export_failed";

export type DateRangeOption = "7d" | "30d" | "90d" | "year" | "custom";
export type ComparisonOption =
  | "previous_period"
  | "previous_month"
  | "previous_year"
  | "none";

export interface KPICardData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  comparisonLabel: string;
  comparisonDirection: "up" | "down" | "neutral";
  comparisonIsPositive: boolean;
  tooltip: string;
  unit?: string;
  previousValue: string;
  sparkline?: number[];
  iconName?: string;
  detailRows?: { label: string; value: string }[];
}

export interface ActiveMemberDataPoint {
  date: string;
  label: string;
  current: number;
  previous: number;
  newMembers: number;
  returningMembers: number;
  orders: number;
}

export interface PointsActivityDataPoint {
  date: string;
  label: string;
  earned: number;
  redeemed: number;
  netChange: number;
}

export interface RepeatRateTimePoint {
  period: string;
  memberRate: number;
  nonMemberRate: number;
  lift: number;
}

export interface RewardRedemptionItem {
  id: string;
  name: string;
  redemptions: number;
  pointsUsed: number;
  percentage: number;
  campaign: string;
  discountValue: number;
  revenue: number;
}

export interface TierDistributionItem {
  id: string;
  name: string;
  color: string;
  customers: number;
  percentage: number;
  change: string;
  threshold: number;
  avgPoints: number;
  avgOrderValue: number;
  totalSpend: number;
}

export interface TierMovementItem {
  from: string;
  to: string;
  label: string;
  customers: number;
  previous: number;
  change: number;
  type: "upgrade" | "downgrade";
}

export interface TierUpgradeTimePoint {
  period: string;
  upgrades: number;
  previous: number;
}

export interface TierCustomerValueItem {
  tier: string;
  customers: number;
  avgOrder: number;
  ordersPerCustomer: number;
  totalSpend: number;
  spendLift: string;
}

export interface NearTierCustomer {
  id: string;
  name: string;
  email: string;
  currentTier: string;
  currentPoints: number;
  nextTier: string;
  pointsNeeded: number;
  lastActive: string;
}

export interface ROILineItem {
  label: string;
  amount: number;
  description: string;
}

export interface ROITimePoint {
  period: string;
  incrementalRevenue: number;
  cost: number;
  netValue: number;
}

export interface AnalyticsFixture {
  storeName: string;
  lastUpdated: string;
  freshnessLabel: string;
  currentDateRangeLabel: string;
  comparisonRangeLabel: string;
  loyalty: {
    summary: {
      headline: string;
      subline: string;
    };
    kpis: {
      activeMembers: KPICardData;
      pointsEarned: KPICardData;
      pointsRedeemed: KPICardData;
      redemptionRate: KPICardData;
      repeatLift: KPICardData;
    };
    comparisonStats: {
      memberRepeatRate: number;
      nonMemberRepeatRate: number;
      lift: number;
    };
    repeatRateTrend: RepeatRateTimePoint[];
    activeMembersDaily: ActiveMemberDataPoint[];
    activeMembersWeekly: ActiveMemberDataPoint[];
    pointsDaily: PointsActivityDataPoint[];
    rewards: RewardRedemptionItem[];
  };
  vip: {
    summary: {
      headline: string;
      subline: string;
    };
    kpis: {
      customersInTiers: KPICardData;
      tierUpgrades: KPICardData;
      tierDowngrades: KPICardData;
      nearNextTier: KPICardData;
      avgVipOrder: KPICardData;
    };
    distribution: TierDistributionItem[];
    movements: TierMovementItem[];
    upgradesTrend: TierUpgradeTimePoint[];
    customerValue: TierCustomerValueItem[];
    nearTierCustomers: NearTierCustomer[];
  };
  roi: {
    summary: {
      headline: string;
      subline: string;
      badge: string;
    };
    overview: {
      incrementalRevenue: number;
      programCost: number;
      netValue: number;
      returnMultiple: number;
    };
    revenueLines: ROILineItem[];
    costLines: ROILineItem[];
    trend: ROITimePoint[];
  };
}

// 30 days daily mock generator ensuring totals match
const dailyPoints: PointsActivityDataPoint[] = [
  { date: "2026-08-24", label: "Aug 24", earned: 5800, redeemed: 2700, netChange: 3100 },
  { date: "2026-08-25", label: "Aug 25", earned: 5400, redeemed: 2900, netChange: 2500 },
  { date: "2026-08-26", label: "Aug 26", earned: 6200, redeemed: 3100, netChange: 3100 },
  { date: "2026-08-27", label: "Aug 27", earned: 6100, redeemed: 3200, netChange: 2900 },
  { date: "2026-08-28", label: "Aug 28", earned: 7400, redeemed: 4100, netChange: 3300 },
  { date: "2026-08-29", label: "Aug 29", earned: 8200, redeemed: 4500, netChange: 3700 },
  { date: "2026-08-30", label: "Aug 30", earned: 7900, redeemed: 4300, netChange: 3600 },
  { date: "2026-08-31", label: "Aug 31", earned: 5600, redeemed: 2800, netChange: 2800 },
  { date: "2026-09-01", label: "Sep 1",  earned: 5900, redeemed: 2900, netChange: 3000 },
  { date: "2026-09-02", label: "Sep 2",  earned: 5800, redeemed: 2700, netChange: 3100 },
  { date: "2026-09-03", label: "Sep 3",  earned: 6300, redeemed: 3100, netChange: 3200 },
  { date: "2026-09-04", label: "Sep 4",  earned: 7100, redeemed: 3600, netChange: 3500 },
  { date: "2026-09-05", label: "Sep 5",  earned: 8500, redeemed: 4200, netChange: 4300 },
  { date: "2026-09-06", label: "Sep 6",  earned: 7800, redeemed: 3900, netChange: 3900 },
  { date: "2026-09-07", label: "Sep 7",  earned: 5200, redeemed: 2400, netChange: 2800 },
  { date: "2026-09-08", label: "Sep 8",  earned: 5500, redeemed: 2600, netChange: 2900 },
  { date: "2026-09-09", label: "Sep 9",  earned: 5900, redeemed: 2800, netChange: 3100 },
  { date: "2026-09-10", label: "Sep 10", earned: 6400, redeemed: 3300, netChange: 3100 },
  { date: "2026-09-11", label: "Sep 11", earned: 7600, redeemed: 3800, netChange: 3800 },
  { date: "2026-09-12", label: "Sep 12", earned: 8700, redeemed: 4600, netChange: 4100 },
  { date: "2026-09-13", label: "Sep 13", earned: 7900, redeemed: 4100, netChange: 3800 },
  { date: "2026-09-14", label: "Sep 14", earned: 5300, redeemed: 2500, netChange: 2800 },
  { date: "2026-09-15", label: "Sep 15", earned: 5600, redeemed: 2700, netChange: 2900 },
  { date: "2026-09-16", label: "Sep 16", earned: 5800, redeemed: 2900, netChange: 2900 },
  { date: "2026-09-17", label: "Sep 17", earned: 6500, redeemed: 3200, netChange: 3300 },
  { date: "2026-09-18", label: "Sep 18", earned: 7800, redeemed: 3900, netChange: 3900 },
  { date: "2026-09-19", label: "Sep 19", earned: 8900, redeemed: 4400, netChange: 4500 },
  { date: "2026-09-20", label: "Sep 20", earned: 8100, redeemed: 4100, netChange: 4000 },
  { date: "2026-09-21", label: "Sep 21", earned: 5700, redeemed: 2700, netChange: 3000 },
  { date: "2026-09-22", label: "Sep 22", earned: 5500, redeemed: 2500, netChange: 3000 },
];

const dailyActiveMembers: ActiveMemberDataPoint[] = [
  { date: "2026-08-24", label: "Aug 24", current: 58, previous: 49, newMembers: 14, returningMembers: 44, orders: 52 },
  { date: "2026-08-25", label: "Aug 25", current: 54, previous: 48, newMembers: 11, returningMembers: 43, orders: 49 },
  { date: "2026-08-26", label: "Aug 26", current: 62, previous: 53, newMembers: 16, returningMembers: 46, orders: 57 },
  { date: "2026-08-27", label: "Aug 27", current: 61, previous: 55, newMembers: 15, returningMembers: 46, orders: 56 },
  { date: "2026-08-28", label: "Aug 28", current: 75, previous: 64, newMembers: 22, returningMembers: 53, orders: 71 },
  { date: "2026-08-29", label: "Aug 29", current: 84, previous: 72, newMembers: 25, returningMembers: 59, orders: 80 },
  { date: "2026-08-30", label: "Aug 30", current: 79, previous: 68, newMembers: 21, returningMembers: 58, orders: 74 },
  { date: "2026-08-31", label: "Aug 31", current: 55, previous: 50, newMembers: 12, returningMembers: 43, orders: 51 },
  { date: "2026-09-01", label: "Sep 1",  current: 58, previous: 51, newMembers: 13, returningMembers: 45, orders: 54 },
  { date: "2026-09-02", label: "Sep 2",  current: 57, previous: 52, newMembers: 14, returningMembers: 43, orders: 53 },
  { date: "2026-09-03", label: "Sep 3",  current: 64, previous: 54, newMembers: 17, returningMembers: 47, orders: 59 },
  { date: "2026-09-04", label: "Sep 4",  current: 72, previous: 62, newMembers: 20, returningMembers: 52, orders: 68 },
  { date: "2026-09-05", label: "Sep 5",  current: 86, previous: 74, newMembers: 27, returningMembers: 59, orders: 81 },
  { date: "2026-09-06", label: "Sep 6",  current: 78, previous: 67, newMembers: 22, returningMembers: 56, orders: 73 },
  { date: "2026-09-07", label: "Sep 7",  current: 51, previous: 47, newMembers: 10, returningMembers: 41, orders: 48 },
  { date: "2026-09-08", label: "Sep 8",  current: 56, previous: 49, newMembers: 12, returningMembers: 44, orders: 52 },
  { date: "2026-09-09", label: "Sep 9",  current: 60, previous: 53, newMembers: 15, returningMembers: 45, orders: 55 },
  { date: "2026-09-10", label: "Sep 10", current: 65, previous: 56, newMembers: 16, returningMembers: 49, orders: 61 },
  { date: "2026-09-11", label: "Sep 11", current: 77, previous: 66, newMembers: 22, returningMembers: 55, orders: 72 },
  { date: "2026-09-12", label: "Sep 12", current: 88, previous: 76, newMembers: 28, returningMembers: 60, orders: 83 },
  { date: "2026-09-13", label: "Sep 13", current: 80, previous: 69, newMembers: 23, returningMembers: 57, orders: 75 },
  { date: "2026-09-14", label: "Sep 14", current: 53, previous: 48, newMembers: 11, returningMembers: 42, orders: 49 },
  { date: "2026-09-15", label: "Sep 15", current: 57, previous: 50, newMembers: 13, returningMembers: 44, orders: 53 },
  { date: "2026-09-16", label: "Sep 16", current: 59, previous: 52, newMembers: 14, returningMembers: 45, orders: 55 },
  { date: "2026-09-17", label: "Sep 17", current: 66, previous: 57, newMembers: 18, returningMembers: 48, orders: 62 },
  { date: "2026-09-18", label: "Sep 18", current: 79, previous: 68, newMembers: 24, returningMembers: 55, orders: 74 },
  { date: "2026-09-19", label: "Sep 19", current: 91, previous: 78, newMembers: 29, returningMembers: 62, orders: 86 },
  { date: "2026-09-20", label: "Sep 20", current: 82, previous: 70, newMembers: 23, returningMembers: 59, orders: 77 },
  { date: "2026-09-21", label: "Sep 21", current: 58, previous: 51, newMembers: 14, returningMembers: 44, orders: 54 },
  { date: "2026-09-22", label: "Sep 22", current: 56, previous: 49, newMembers: 13, returningMembers: 43, orders: 52 },
];

const weeklyActiveMembers: ActiveMemberDataPoint[] = [
  { date: "2026-08-24", label: "Week 1 (Aug 24 - 30)", current: 473, previous: 419, newMembers: 119, returningMembers: 354, orders: 442 },
  { date: "2026-08-31", label: "Week 2 (Aug 31 - Sep 6)", current: 470, previous: 421, newMembers: 118, returningMembers: 352, orders: 441 },
  { date: "2026-09-07", label: "Week 3 (Sep 7 - 13)", current: 477, previous: 427, newMembers: 121, returningMembers: 356, orders: 449 },
  { date: "2026-09-14", label: "Week 4 (Sep 14 - 22)", current: 422, previous: 372, newMembers: 106, returningMembers: 316, orders: 395 },
];

export function getCentralizedAnalyticsFixture(store: string = "northstar"): AnalyticsFixture {
  const storeDisplay = store === "willow" ? "Willow & Co." : "Northstar Goods";

  return {
    storeName: storeDisplay,
    lastUpdated: "5 minutes ago",
    freshnessLabel: "Updated 5 minutes ago",
    currentDateRangeLabel: "Aug 24 - Sep 22, 2026",
    comparisonRangeLabel: "Compared with Aug 1 - Aug 30, 2026",
    loyalty: {
      summary: {
        headline: "Loyalty engagement grew this month",
        subline:
          "More customers earned points and returned to make another purchase compared with the previous 30 days.",
      },
      kpis: {
        activeMembers: {
          id: "active-members",
          title: "Active loyalty members",
          value: "1,842",
          numericValue: 1842,
          comparisonLabel: "+12.4%",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "1,638",
          sparkline: [52, 54, 58, 62, 60, 64, 70, 68, 72, 75, 78, 82, 80, 85, 88],
          iconName: "users",
          tooltip:
            "Customers who earned points, redeemed a reward, or completed an eligible order during this period.",
          detailRows: [
            { label: "Total active members", value: "1,842" },
            { label: "New signups", value: "464" },
            { label: "Returning members", value: "1,378" },
            { label: "Previous period members", value: "1,638" },
            { label: "Net growth", value: "+204 (+12.4%)" },
          ],
        },
        pointsEarned: {
          id: "points-earned",
          title: "Points earned",
          value: "186,400",
          numericValue: 186400,
          comparisonLabel: "+18.0%",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "158,000",
          sparkline: [4800, 5200, 5800, 6200, 6400, 7100, 6900, 7400, 7800, 8200, 8500],
          iconName: "coins",
          tooltip: "Points added to customer balances during the selected period.",
          detailRows: [
            { label: "Points earned from purchases", value: "152,400" },
            { label: "Bonus & campaign points", value: "24,000" },
            { label: "Birthday & review points", value: "10,000" },
            { label: "Previous period earned", value: "158,000" },
            { label: "Net increase", value: "+28,400 pts (+18.0%)" },
          ],
        },
        pointsRedeemed: {
          id: "points-redeemed",
          title: "Points redeemed",
          value: "92,600",
          numericValue: 92600,
          comparisonLabel: "+9.2%",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "84,800",
          sparkline: [2400, 2700, 2900, 3100, 3200, 3600, 3800, 4100, 4300, 4500],
          iconName: "gift",
          tooltip:
            "Points customers used to claim rewards during the selected period.",
          detailRows: [
            { label: "Total points redeemed", value: "92,600" },
            { label: "Discount reward redemptions", value: "72,600" },
            { label: "Free shipping redemptions", value: "9,000" },
            { label: "Product & perk redemptions", value: "11,000" },
            { label: "Previous period redeemed", value: "84,800" },
          ],
        },
        redemptionRate: {
          id: "redemption-rate",
          title: "Redemption rate",
          value: "49.7%",
          numericValue: 49.7,
          comparisonLabel: "-3.2%",
          comparisonDirection: "down",
          comparisonIsPositive: false,
          previousValue: "53.7%",
          sparkline: [53.7, 52.8, 51.9, 51.2, 50.8, 50.1, 49.7],
          iconName: "percent",
          tooltip:
            "Points redeemed divided by points earned during the selected period. Customers may redeem points earned earlier, so this value can occasionally exceed 100%.",
          detailRows: [
            { label: "Formula", value: "Points redeemed / Points earned × 100" },
            { label: "Points redeemed", value: "92,600" },
            { label: "Points earned", value: "186,400" },
            { label: "Previous redemption rate", value: "53.7%" },
            { label: "Change", value: "-3.2 percentage points" },
          ],
        },
        repeatLift: {
          id: "repeat-lift",
          title: "Repeat purchase lift",
          value: "+11.8 pts",
          numericValue: 11.8,
          comparisonLabel: "+11.8 pts",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "+10.2 pts",
          sparkline: [10.2, 10.4, 10.7, 11.0, 11.3, 11.8],
          iconName: "trending-up",
          tooltip:
            "The difference between the repeat purchase rate of loyalty members and non-members.",
          detailRows: [
            { label: "Loyalty member repeat rate", value: "38.4%" },
            { label: "Non-member repeat rate", value: "26.6%" },
            { label: "Net repeat purchase lift", value: "+11.8 percentage points" },
            { label: "Previous period lift", value: "+10.2 percentage points" },
          ],
        },
      },
      comparisonStats: {
        memberRepeatRate: 38.4,
        nonMemberRepeatRate: 26.6,
        lift: 11.8,
      },
      repeatRateTrend: [
        { period: "Week 1 (Aug 24 - 30)", memberRate: 35.2, nonMemberRate: 25.8, lift: 9.4 },
        { period: "Week 2 (Aug 31 - Sep 6)", memberRate: 37.1, nonMemberRate: 26.2, lift: 10.9 },
        { period: "Week 3 (Sep 7 - 13)", memberRate: 39.8, nonMemberRate: 27.0, lift: 12.8 },
        { period: "Week 4 (Sep 14 - 22)", memberRate: 41.5, nonMemberRate: 27.4, lift: 14.1 },
      ],
      activeMembersDaily: dailyActiveMembers,
      activeMembersWeekly: weeklyActiveMembers,
      pointsDaily: dailyPoints,
      rewards: [
        {
          id: "reward-1",
          name: "15% off next order",
          redemptions: 84,
          pointsUsed: 42000,
          percentage: 38.5,
          campaign: "Fall Member Appreciation",
          discountValue: 1260,
          revenue: 8400,
        },
        {
          id: "reward-2",
          name: "$10 loyalty reward",
          redemptions: 62,
          pointsUsed: 24800,
          percentage: 28.4,
          campaign: "Points to Cash Fall",
          discountValue: 620,
          revenue: 4960,
        },
        {
          id: "reward-3",
          name: "Free shipping",
          redemptions: 36,
          pointsUsed: 9000,
          percentage: 16.5,
          campaign: "Standard Shipping Perk",
          discountValue: 324,
          revenue: 2880,
        },
        {
          id: "reward-4",
          name: "Birthday reward",
          redemptions: 22,
          pointsUsed: 11000,
          percentage: 10.1,
          campaign: "Birthday Treats",
          discountValue: 440,
          revenue: 1980,
        },
        {
          id: "reward-5",
          name: "20% VIP discount",
          redemptions: 14,
          pointsUsed: 5800,
          percentage: 6.4,
          campaign: "VIP Tier Exclusive",
          discountValue: 560,
          revenue: 2420,
        },
      ],
    },
    vip: {
      summary: {
        headline: "96 customers moved to a higher tier",
        subline:
          "Gold members placed the highest-value orders during the selected period.",
      },
      kpis: {
        customersInTiers: {
          id: "customers-in-tiers",
          title: "Customers in tiers",
          value: "1,712",
          numericValue: 1712,
          comparisonLabel: "+96",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "1,616",
          sparkline: [1616, 1630, 1650, 1675, 1690, 1712],
          iconName: "shield",
          tooltip:
            "Active loyalty members who have reached Bronze, Silver, or Gold status.",
          detailRows: [
            { label: "Bronze tier members", value: "1,020 (55.4%)" },
            { label: "Silver tier members", value: "480 (26.1%)" },
            { label: "Gold tier members", value: "212 (11.5%)" },
            { label: "No tier assigned", value: "130 (7.1%)" },
            { label: "Total active members", value: "1,842 (100%)" },
          ],
        },
        tierUpgrades: {
          id: "tier-upgrades",
          title: "Tier upgrades",
          value: "96",
          numericValue: 96,
          comparisonLabel: "+12",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "84",
          sparkline: [18, 24, 28, 26],
          iconName: "crown",
          tooltip:
            "Customers who crossed a tier threshold during the selected period.",
          detailRows: [
            { label: "No tier to Bronze", value: "58 upgrades" },
            { label: "Bronze to Silver", value: "26 upgrades" },
            { label: "Silver to Gold", value: "12 upgrades" },
            { label: "Total upgrades", value: "96 upgrades" },
          ],
        },
        tierDowngrades: {
          id: "tier-downgrades",
          title: "Tier downgrades",
          value: "14",
          numericValue: 14,
          comparisonLabel: "+3",
          comparisonDirection: "down",
          comparisonIsPositive: false,
          previousValue: "11",
          sparkline: [3, 4, 3, 4],
          iconName: "arrow-down",
          tooltip:
            "Customers whose tier decreased due to rolling qualification periods.",
          detailRows: [
            { label: "Gold to Silver", value: "4 downgrades" },
            { label: "Silver to Bronze", value: "10 downgrades" },
            { label: "Total downgrades", value: "14 downgrades" },
          ],
        },
        nearNextTier: {
          id: "near-next-tier",
          title: "Near next tier",
          value: "184",
          numericValue: 184,
          comparisonLabel: "<20% away",
          comparisonDirection: "neutral",
          comparisonIsPositive: true,
          previousValue: "168",
          sparkline: [150, 162, 170, 178, 184],
          iconName: "sparkles",
          tooltip:
            "Members whose points balance is within 20% of the next tier entry threshold.",
          detailRows: [
            { label: "Approaching Bronze", value: "92 customers" },
            { label: "Approaching Silver", value: "64 customers" },
            { label: "Approaching Gold", value: "28 customers" },
          ],
        },
        avgVipOrder: {
          id: "avg-vip-order",
          title: "Average VIP order",
          value: "$146",
          numericValue: 146,
          comparisonLabel: "+8.1%",
          comparisonDirection: "up",
          comparisonIsPositive: true,
          previousValue: "$135",
          sparkline: [134, 138, 140, 142, 146],
          iconName: "dollar-sign",
          tooltip: "Weighted average order value across Bronze, Silver, and Gold members.",
          detailRows: [
            { label: "Gold member AOV", value: "$248" },
            { label: "Silver member AOV", value: "$136" },
            { label: "Bronze member AOV", value: "$82" },
            { label: "No tier customer AOV", value: "$54" },
          ],
        },
      },
      distribution: [
        {
          id: "gold",
          name: "Gold",
          color: "#eab308", // Gold/amber
          customers: 212,
          percentage: 11.5,
          change: "+18",
          threshold: 2500,
          avgPoints: 3420,
          avgOrderValue: 248,
          totalSpend: 126232,
        },
        {
          id: "silver",
          name: "Silver",
          color: "#94a3b8", // Silver slate
          customers: 480,
          percentage: 26.1,
          change: "+36",
          threshold: 1000,
          avgPoints: 1480,
          avgOrderValue: 136,
          totalSpend: 117504,
        },
        {
          id: "bronze",
          name: "Bronze",
          color: "#d97706", // Bronze warm
          customers: 1020,
          percentage: 55.4,
          change: "+42",
          threshold: 250,
          avgPoints: 490,
          avgOrderValue: 82,
          totalSpend: 108732,
        },
        {
          id: "none",
          name: "No tier",
          color: "#71717a", // Neutral zinc
          customers: 130,
          percentage: 7.1,
          change: "-12",
          threshold: 0,
          avgPoints: 65,
          avgOrderValue: 54,
          totalSpend: 7722,
        },
      ],
      movements: [
        {
          from: "No tier",
          to: "Bronze",
          label: "No tier to Bronze",
          customers: 58,
          previous: 52,
          change: 6,
          type: "upgrade",
        },
        {
          from: "Bronze",
          to: "Silver",
          label: "Bronze to Silver",
          customers: 26,
          previous: 22,
          change: 4,
          type: "upgrade",
        },
        {
          from: "Silver",
          to: "Gold",
          label: "Silver to Gold",
          customers: 12,
          previous: 10,
          change: 2,
          type: "upgrade",
        },
        {
          from: "Gold",
          to: "Silver",
          label: "Gold to Silver",
          customers: 4,
          previous: 3,
          change: 1,
          type: "downgrade",
        },
        {
          from: "Silver",
          to: "Bronze",
          label: "Silver to Bronze",
          customers: 10,
          previous: 8,
          change: 2,
          type: "downgrade",
        },
      ],
      upgradesTrend: [
        { period: "Week 1 (Aug 24 - 30)", upgrades: 18, previous: 15 },
        { period: "Week 2 (Aug 31 - Sep 6)", upgrades: 24, previous: 20 },
        { period: "Week 3 (Sep 7 - 13)", upgrades: 28, previous: 25 },
        { period: "Week 4 (Sep 14 - 22)", upgrades: 26, previous: 24 },
      ],
      customerValue: [
        {
          tier: "Gold",
          customers: 212,
          avgOrder: 248,
          ordersPerCustomer: 2.4,
          totalSpend: 126232,
          spendLift: "+42%",
        },
        {
          tier: "Silver",
          customers: 480,
          avgOrder: 136,
          ordersPerCustomer: 1.8,
          totalSpend: 117504,
          spendLift: "+24%",
        },
        {
          tier: "Bronze",
          customers: 1020,
          avgOrder: 82,
          ordersPerCustomer: 1.3,
          totalSpend: 108732,
          spendLift: "+12%",
        },
        {
          tier: "No tier",
          customers: 130,
          avgOrder: 54,
          ordersPerCustomer: 1.1,
          totalSpend: 7722,
          spendLift: "Baseline",
        },
      ],
      nearTierCustomers: [
        {
          id: "cust-1",
          name: "Maya Lin",
          email: "maya.lin@example.com",
          currentTier: "Silver",
          currentPoints: 2380,
          nextTier: "Gold",
          pointsNeeded: 120,
          lastActive: "Sep 21, 2026",
        },
        {
          id: "cust-2",
          name: "David Kim",
          email: "david.kim@example.com",
          currentTier: "Silver",
          currentPoints: 2410,
          nextTier: "Gold",
          pointsNeeded: 90,
          lastActive: "Sep 20, 2026",
        },
        {
          id: "cust-3",
          name: "Sarah Connor",
          email: "s.connor@example.com",
          currentTier: "Bronze",
          currentPoints: 920,
          nextTier: "Silver",
          pointsNeeded: 80,
          lastActive: "Sep 19, 2026",
        },
        {
          id: "cust-4",
          name: "Elena Rostova",
          email: "elena.r@example.com",
          currentTier: "Bronze",
          currentPoints: 940,
          nextTier: "Silver",
          pointsNeeded: 60,
          lastActive: "Sep 18, 2026",
        },
        {
          id: "cust-5",
          name: "Marcus Brody",
          email: "marcus.b@example.com",
          currentTier: "No tier",
          currentPoints: 230,
          nextTier: "Bronze",
          pointsNeeded: 20,
          lastActive: "Sep 22, 2026",
        },
        {
          id: "cust-6",
          name: "Hannah Lee",
          email: "hannah.l@example.com",
          currentTier: "No tier",
          currentPoints: 240,
          nextTier: "Bronze",
          pointsNeeded: 10,
          lastActive: "Sep 21, 2026",
        },
      ],
    },
    roi: {
      summary: {
        headline: "Your loyalty program returned $3.30 for every $1 spent",
        subline:
          "Estimated loyalty-driven revenue exceeded program costs by $27,600 during this period.",
        badge: "Estimated",
      },
      overview: {
        incrementalRevenue: 39600,
        programCost: 12000,
        netValue: 27600,
        returnMultiple: 3.3,
      },
      revenueLines: [
        {
          label: "Revenue from additional repeat purchases",
          amount: 24800,
          description:
            "Estimated revenue from members returning more frequently than comparable non-loyalty customers.",
        },
        {
          label: "Revenue associated with reward redemptions",
          amount: 10600,
          description:
            "Order value generated when customers applied earned rewards to their carts.",
        },
        {
          label: "Estimated VIP spend lift",
          amount: 4200,
          description:
            "Incremental basket size increase attributed to tier qualification incentives.",
        },
      ],
      costLines: [
        {
          label: "Cost of points issued",
          amount: 7200,
          description:
            "186,400 points issued evaluated at your configured liability value.",
        },
        {
          label: "Redeemed reward discounts",
          amount: 4800,
          description:
            "Direct discount value absorbed by your store from customer reward redemptions.",
        },
      ],
      trend: [
        {
          period: "Week 1 (Aug 24 - 30)",
          incrementalRevenue: 8800,
          cost: 2700,
          netValue: 6100,
        },
        {
          period: "Week 2 (Aug 31 - Sep 6)",
          incrementalRevenue: 9700,
          cost: 2900,
          netValue: 6800,
        },
        {
          period: "Week 3 (Sep 7 - 13)",
          incrementalRevenue: 10400,
          cost: 3200,
          netValue: 7200,
        },
        {
          period: "Week 4 (Sep 14 - 22)",
          incrementalRevenue: 10700,
          cost: 3200,
          netValue: 7500,
        },
      ],
    },
  };
}

export function generateCSVExport(
  fixture: AnalyticsFixture,
  scope: "all" | "loyalty" | "vip" | "roi"
): string {
  const lines: string[] = [];

  lines.push(`Reloopin Analytics Export - ${fixture.storeName}`);
  lines.push(`Period,${fixture.currentDateRangeLabel}`);
  lines.push(`Comparison,${fixture.comparisonRangeLabel}`);
  lines.push(`Generated,${new Date().toISOString()}`);
  lines.push("");

  if (scope === "all" || scope === "loyalty") {
    lines.push("--- LOYALTY PERFORMANCE ---");
    lines.push("Metric,Current Value,Comparison");
    lines.push(`Active Loyalty Members,${fixture.loyalty.kpis.activeMembers.value},"${fixture.loyalty.kpis.activeMembers.comparisonLabel}"`);
    lines.push(`Points Earned,${fixture.loyalty.kpis.pointsEarned.value},"${fixture.loyalty.kpis.pointsEarned.comparisonLabel}"`);
    lines.push(`Points Redeemed,${fixture.loyalty.kpis.pointsRedeemed.value},"${fixture.loyalty.kpis.pointsRedeemed.comparisonLabel}"`);
    lines.push(`Redemption Rate,${fixture.loyalty.kpis.redemptionRate.value},"${fixture.loyalty.kpis.redemptionRate.comparisonLabel}"`);
    lines.push(`Repeat Purchase Lift,${fixture.loyalty.kpis.repeatLift.value},"${fixture.loyalty.kpis.repeatLift.comparisonLabel}"`);
    lines.push("");

    lines.push("Date,Points Earned,Points Redeemed,Net Change");
    fixture.loyalty.pointsDaily.forEach((p) => {
      lines.push(`${p.date},${p.earned},${p.redeemed},${p.netChange}`);
    });
    lines.push("");

    lines.push("Reward,Redemptions,Points Used,Share");
    fixture.loyalty.rewards.forEach((r) => {
      lines.push(`"${r.name}",${r.redemptions},${r.pointsUsed},${r.percentage}%`);
    });
    lines.push("");
  }

  if (scope === "all" || scope === "vip") {
    lines.push("--- VIP TIERS ---");
    lines.push("Tier,Customers,Share,Change,Entry Threshold,Average Points,Average Order Value,Total Spend");
    fixture.vip.distribution.forEach((d) => {
      lines.push(`"${d.name}",${d.customers},${d.percentage}%,${d.change},${d.threshold},${d.avgPoints},$${d.avgOrderValue},$${d.totalSpend}`);
    });
    lines.push("");

    lines.push("Movement,Customers,Previous Period,Net Change");
    fixture.vip.movements.forEach((m) => {
      lines.push(`"${m.label}",${m.customers},${m.previous},${m.change}`);
    });
    lines.push("");

    lines.push("Customer,Current Tier,Points,Next Tier,Points Needed,Last Active");
    fixture.vip.nearTierCustomers.forEach((c) => {
      lines.push(`"${c.name}",${c.currentTier},${c.currentPoints},${c.nextTier},${c.pointsNeeded},"${c.lastActive}"`);
    });
    lines.push("");
  }

  if (scope === "all" || scope === "roi") {
    lines.push("--- PROGRAM ROI ---");
    lines.push("Summary,Estimated incremental revenue exceeded program costs by $27600");
    lines.push(`Incremental Revenue,$${fixture.roi.overview.incrementalRevenue}`);
    lines.push(`Program Cost,$${fixture.roi.overview.programCost}`);
    lines.push(`Net Estimated Value,$${fixture.roi.overview.netValue}`);
    lines.push(`Return Multiple,${fixture.roi.overview.returnMultiple}x`);
    lines.push("");

    lines.push("Revenue Category,Amount,Description");
    fixture.roi.revenueLines.forEach((l) => {
      lines.push(`"${l.label}",$${l.amount},"${l.description}"`);
    });
    lines.push("");

    lines.push("Cost Category,Amount,Description");
    fixture.roi.costLines.forEach((l) => {
      lines.push(`"${l.label}",$${l.amount},"${l.description}"`);
    });
    lines.push("");
  }

  return lines.join("\n");
}

