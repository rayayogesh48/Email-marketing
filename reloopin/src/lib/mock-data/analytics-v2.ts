export type AnalyticsTabId = 'overview' | 'retention' | 'members' | 'points' | 'rewards';

export type AnalyticsDataState =
  | 'default'
  | 'loading'
  | 'empty'
  | 'no_filter_results'
  | 'partial_data'
  | 'sync_delayed'
  | 'data_unavailable'
  | 'exporting'
  | 'export_successful'
  | 'export_failed';

// Overview Data
export interface PrimaryKPI {
  id: string;
  label: string;
  value: string;
  subtext: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
  tooltip: string;
  isRisk?: boolean;
}

export const OVERVIEW_KPIS: PrimaryKPI[] = [
  {
    id: 'member_revenue',
    label: 'Member revenue',
    value: '$519,430',
    subtext: '38% of total store revenue',
    change: '+14% vs previous period',
    trend: 'up',
    isPositive: true,
    tooltip: 'Total gross merchandise value purchased by enrolled loyalty members during this period.',
  },
  {
    id: 'member_repeat_rate',
    label: 'Member repeat rate',
    value: '87%',
    subtext: 'Compared with 35% for non-members',
    change: '+3 percentage points',
    trend: 'up',
    isPositive: true,
    tooltip: 'Percentage of loyalty members who have placed 2 or more orders in their customer lifetime.',
  },
  {
    id: 'program_return',
    label: 'Program return',
    value: '$23.10',
    subtext: 'Revenue generated per $1 in rewards',
    change: '+$2.40 vs previous period',
    trend: 'up',
    isPositive: true,
    tooltip: 'Net revenue attributed to loyalty members divided by total cost of claimed discounts and rewards.',
  },
  {
    id: 'outstanding_point_value',
    label: 'Outstanding point value',
    value: '$32,400',
    subtext: '1.62M unredeemed points',
    change: '+$12,620 this period',
    trend: 'up',
    isPositive: false,
    tooltip: 'Current store redemption liability across all unredeemed member point balances (valued at $0.02/pt).',
    isRisk: true,
  },
];

export interface TrendDataPoint {
  date: string;
  label: string;
  revenueCurrent: number;
  revenuePrevious: number;
  ordersCurrent: number;
  ordersPrevious: number;
  rewardsCurrent: number;
  rewardsPrevious: number;
}

export const PROGRAM_PERFORMANCE_TREND: TrendDataPoint[] = [
  { date: 'Sep 01', label: 'Sep 1-4', revenueCurrent: 58200, revenuePrevious: 51200, ordersCurrent: 670, ordersPrevious: 604, rewardsCurrent: 210, rewardsPrevious: 195 },
  { date: 'Sep 05', label: 'Sep 5-8', revenueCurrent: 64100, revenuePrevious: 55400, ordersCurrent: 735, ordersPrevious: 650, rewardsCurrent: 245, rewardsPrevious: 215 },
  { date: 'Sep 09', label: 'Sep 9-12', revenueCurrent: 71900, revenuePrevious: 61800, ordersCurrent: 820, ordersPrevious: 720, rewardsCurrent: 280, rewardsPrevious: 240 },
  { date: 'Sep 13', label: 'Sep 13-16', revenueCurrent: 69400, revenuePrevious: 63200, ordersCurrent: 795, ordersPrevious: 735, rewardsCurrent: 260, rewardsPrevious: 250 },
  { date: 'Sep 17', label: 'Sep 17-20', revenueCurrent: 78500, revenuePrevious: 68100, ordersCurrent: 890, ordersPrevious: 790, rewardsCurrent: 310, rewardsPrevious: 265 },
  { date: 'Sep 21', label: 'Sep 21-24', revenueCurrent: 86200, revenuePrevious: 74500, ordersCurrent: 980, ordersPrevious: 860, rewardsCurrent: 350, rewardsPrevious: 295 },
  { date: 'Sep 25', label: 'Sep 25-28', revenueCurrent: 91130, revenuePrevious: 80800, ordersCurrent: 1040, ordersPrevious: 935, rewardsCurrent: 387, rewardsPrevious: 320 },
];

export interface ComparisonMetric {
  metric: string;
  memberValue: string;
  memberNum: number;
  nonMemberValue: string;
  nonMemberNum: number;
  unit: string;
  maxScale: number;
}

export const MEMBERS_VS_NON_MEMBERS: ComparisonMetric[] = [
  {
    metric: 'Orders per customer',
    memberValue: '4.8 orders',
    memberNum: 4.8,
    nonMemberValue: '1.4 orders',
    nonMemberNum: 1.4,
    unit: 'orders',
    maxScale: 6,
  },
  {
    metric: 'Revenue per customer',
    memberValue: '$418',
    memberNum: 418,
    nonMemberValue: '$112',
    nonMemberNum: 112,
    unit: '$',
    maxScale: 500,
  },
  {
    metric: 'Repeat purchase rate',
    memberValue: '87%',
    memberNum: 87,
    nonMemberValue: '35%',
    nonMemberNum: 35,
    unit: '%',
    maxScale: 100,
  },
  {
    metric: 'Average order value',
    memberValue: '$87',
    memberNum: 87,
    nonMemberValue: '$64',
    nonMemberNum: 64,
    unit: '$',
    maxScale: 120,
  },
];

// Retention Data
export const RETENTION_KPIS = [
  { label: 'Members who purchase again', value: '87%', subtext: 'Baseline 35% non-members', trend: '+3%' },
  { label: 'Median time between orders', value: '16 days', subtext: 'Down from 22 days prior', trend: '-6 days' },
  { label: 'Members active in last 30d', value: '251', subtext: 'Placed order in past 30 days', trend: '+18' },
  { label: 'Members inactive > 60d', value: '89', subtext: 'Qualifies for win-back sequence', trend: '+5' },
];

export interface SecondOrderCurvePoint {
  days: number;
  memberRate: number;
  nonMemberRate: number;
}

export const SECOND_ORDER_CURVE: SecondOrderCurvePoint[] = [
  { days: 0, memberRate: 0, nonMemberRate: 0 },
  { days: 7, memberRate: 18, nonMemberRate: 6 },
  { days: 14, memberRate: 36, nonMemberRate: 14 },
  { days: 21, memberRate: 50, nonMemberRate: 20 },
  { days: 30, memberRate: 65, nonMemberRate: 26 },
  { days: 45, memberRate: 76, nonMemberRate: 30 },
  { days: 60, memberRate: 83, nonMemberRate: 33 },
  { days: 90, memberRate: 87, nonMemberRate: 35 },
];

export const MEMBER_HEALTH_DATA = {
  total: 432,
  segments: [
    { label: 'Active', count: 251, percentage: 58, color: 'bg-emerald-500', desc: 'Ordered < 30 days ago' },
    { label: 'Cooling', count: 92, percentage: 21, color: 'bg-blue-500', desc: 'Ordered 30–60 days ago' },
    { label: 'At risk', count: 53, percentage: 12, color: 'bg-amber-500', desc: 'Ordered 60–90 days ago' },
    { label: 'Lapsed', count: 36, percentage: 9, color: 'bg-rose-500', desc: 'Ordered > 90 days ago' },
  ],
};

export const RETENTION_COHORT = [
  { cohort: 'May 2026', size: 148, m0: 100, m1: 54, m2: 44, m3: 39 },
  { cohort: 'Jun 2026', size: 162, m0: 100, m1: 58, m2: 48, m3: 42 },
  { cohort: 'Jul 2026', size: 184, m0: 100, m1: 62, m2: 51, m3: 46 },
  { cohort: 'Aug 2026', size: 212, m0: 100, m1: 67, m2: 56, m3: null },
  { cohort: 'Sep 2026', size: 236, m0: 100, m1: 71, m2: null, m3: null },
];

// Members Data
export const LOYALTY_JOURNEY = [
  { stage: 'All customers', count: 3641, conversion: 100, drop: null },
  { stage: 'Earned points', count: 1690, conversion: 46.4, drop: '53.6% unengaged' },
  { stage: 'Redeemed a reward', count: 706, conversion: 19.4, drop: '984 earned points but never redeemed' },
  { stage: 'Reached a VIP tier', count: 432, conversion: 11.9, drop: '274 active non-tiered' },
];

export const NEW_MEMBERS_WEEKLY = [
  { week: 'Week 1', current: 78, previous: 62 },
  { week: 'Week 2', current: 94, previous: 74 },
  { week: 'Week 3', current: 89, previous: 81 },
  { week: 'Week 4', current: 112, previous: 88 },
  { week: 'Week 5 (partial)', current: 59, previous: 48 },
];

export interface MatrixRow {
  tier: 'Gold' | 'Silver' | 'Bronze';
  active: { count: number; pct: number };
  cooling: { count: number; pct: number };
  atRisk: { count: number; pct: number; highlight?: boolean };
  lapsed: { count: number; pct: number; highlight?: boolean };
}

export const TIER_ACTIVITY_MATRIX: MatrixRow[] = [
  {
    tier: 'Gold',
    active: { count: 48, pct: 64 },
    cooling: { count: 15, pct: 20 },
    atRisk: { count: 8, pct: 11, highlight: true },
    lapsed: { count: 4, pct: 5, highlight: true },
  },
  {
    tier: 'Silver',
    active: { count: 78, pct: 59 },
    cooling: { count: 26, pct: 20 },
    atRisk: { count: 18, pct: 14, highlight: true },
    lapsed: { count: 11, pct: 8, highlight: true },
  },
  {
    tier: 'Bronze',
    active: { count: 125, pct: 56 },
    cooling: { count: 51, pct: 23 },
    atRisk: { count: 27, pct: 12 },
    lapsed: { count: 21, pct: 9 },
  },
];

export interface ContactableMember {
  id: string;
  name: string;
  email: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  reason: 'Going quiet' | 'Close to next tier' | 'Unused points' | 'Points expiring';
  lastOrder: string;
  spend: string;
}

export const CONTACTABLE_MEMBERS: ContactableMember[] = [
  { id: '1', name: 'Alisha Gautam', email: 'alisha.g@gmail.com', tier: 'Gold', reason: 'Going quiet', lastOrder: '64 days ago', spend: '$1,480' },
  { id: '2', name: 'Bikram Thapa', email: 'bikram.t@outlook.com', tier: 'Silver', reason: 'Going quiet', lastOrder: '72 days ago', spend: '$890' },
  { id: '3', name: 'Pooja Karki', email: 'pooja.karki@gmail.com', tier: 'Silver', reason: 'Close to next tier', lastOrder: '12 days ago', spend: '$940' },
  { id: '4', name: 'Suman Shrestha', email: 'suman.shrestha@nepal.com', tier: 'Bronze', reason: 'Unused points', lastOrder: '28 days ago', spend: '$420' },
  { id: '5', name: 'Kavita Rai', email: 'kavita.rai@icloud.com', tier: 'Gold', reason: 'Points expiring', lastOrder: '18 days ago', spend: '$2,150' },
  { id: '6', name: 'Nabin Adhikari', email: 'nabin.adhikari@gmail.com', tier: 'Bronze', reason: 'Close to next tier', lastOrder: '9 days ago', spend: '$485' },
];

// Points Data
export const POINTS_KPIS = [
  { label: 'Points earned', value: '1.85M', subtext: 'Valued at $37,000 store credit', trend: '+16%' },
  { label: 'Points redeemed', value: '1.13M', subtext: 'Claimed discount value: $22,600', trend: '+11%' },
  { label: 'Points expired', value: '92K', subtext: 'Saved store liability: $1,840', trend: '-4%' },
  { label: 'Outstanding value', value: '$32,400', subtext: '1.62M active unredeemed points', trend: '+$12,620' },
];

export const POINTS_MOVEMENT = [
  { month: 'Apr', earned: 320, redeemed: 220, gap: 100 },
  { month: 'May', earned: 350, redeemed: 240, gap: 110 },
  { month: 'Jun', earned: 375, redeemed: 255, gap: 120 },
  { month: 'Jul', earned: 390, redeemed: 260, gap: 130 },
  { month: 'Aug', earned: 410, redeemed: 275, gap: 135 },
  { month: 'Sep', earned: 445, redeemed: 290, gap: 155 },
];

export const POINTS_DISTRIBUTION = [
  { range: 'Below 250 points', customers: 840, share: 12, dollarValue: '$3,888' },
  { range: '250–499 points', customers: 534, share: 18, dollarValue: '$5,832' },
  { range: '500–1,249 points', customers: 316, share: 42, dollarValue: '$13,608' },
  { range: '1,250+ points', customers: 112, share: 28, dollarValue: '$9,072' },
];

export const OUTSTANDING_TREND = [
  { date: 'Week 1', value: 24800 },
  { date: 'Week 2', value: 26900 },
  { date: 'Week 3', value: 29400 },
  { date: 'Week 4', value: 31200 },
  { date: 'Week 5', value: 32400 },
];

export const EXPIRATION_SUMMARIES = [
  { label: 'Expiring in 30 days', value: '$1,680', count: '84,000 points' },
  { label: 'Expiring in 60 days', value: '$2,620', count: '131,000 points' },
  { label: 'Expiring in 90 days', value: '$3,760', count: '188,000 points' },
];

export const EARNING_SOURCES = [
  { source: 'Purchases', points: '1.28M', pct: 69, value: '$25,600' },
  { source: 'Reviews', points: '220K', pct: 12, value: '$4,400' },
  { source: 'Signup', points: '160K', pct: 9, value: '$3,200' },
  { source: 'Referrals', points: '110K', pct: 6, value: '$2,200' },
  { source: 'Birthday', points: '55K', pct: 3, value: '$1,100' },
  { source: 'Other rules', points: '25K', pct: 1, value: '$500' },
];

// Rewards Data
export const REWARD_KPIS = [
  { label: 'Rewards redeemed', value: '1,842', subtext: '+12% from previous 30d' },
  { label: 'Customers who redeemed', value: '706', subtext: '19.4% of total customer base' },
  { label: 'Reward cost', value: '$22,540', subtext: 'Average $12.24 per redemption' },
  { label: 'Average order with reward', value: '$128', subtext: '+47% higher than store AOV' },
];

export interface RewardPerformanceRow {
  id: string;
  name: string;
  pointsRequired: number;
  timesUsed: number;
  rewardCost: string;
  costNum: number;
  avgOrder: string;
  repeatPurchase30d: string;
  repeatNum: number;
  returnPerDollar: string;
  returnNum: number;
  status: 'Strong performer' | 'Good' | 'Needs review' | 'Low return';
  isWarning?: boolean;
  costShare: number;
  usageShare: number;
  scatterCostPerRedemption: number;
}

export const REWARD_PERFORMANCE: RewardPerformanceRow[] = [
  {
    id: 'rew_1',
    name: '$10 off coupon',
    pointsRequired: 500,
    timesUsed: 842,
    rewardCost: '$8,420',
    costNum: 8420,
    avgOrder: '$94',
    repeatPurchase30d: '78%',
    repeatNum: 78,
    returnPerDollar: '$28.40',
    returnNum: 28.4,
    status: 'Strong performer',
    costShare: 37.3,
    usageShare: 45.7,
    scatterCostPerRedemption: 10.0,
  },
  {
    id: 'rew_2',
    name: 'Free standard shipping',
    pointsRequired: 300,
    timesUsed: 512,
    rewardCost: '$3,584',
    costNum: 3584,
    avgOrder: '$86',
    repeatPurchase30d: '74%',
    repeatNum: 74,
    returnPerDollar: '$24.60',
    returnNum: 24.6,
    status: 'Strong performer',
    costShare: 15.9,
    usageShare: 27.8,
    scatterCostPerRedemption: 7.0,
  },
  {
    id: 'rew_3',
    name: '15% off next order',
    pointsRequired: 650,
    timesUsed: 268,
    rewardCost: '$4,824',
    costNum: 4824,
    avgOrder: '$132',
    repeatPurchase30d: '69%',
    repeatNum: 69,
    returnPerDollar: '$18.20',
    returnNum: 18.2,
    status: 'Good',
    costShare: 21.4,
    usageShare: 14.5,
    scatterCostPerRedemption: 18.0,
  },
  {
    id: 'rew_4',
    name: '$25 off coupon',
    pointsRequired: 1000,
    timesUsed: 184,
    rewardCost: '$4,600',
    costNum: 4600,
    avgOrder: '$178',
    repeatPurchase30d: '52%',
    repeatNum: 52,
    returnPerDollar: '$7.12',
    returnNum: 7.12,
    status: 'Low return',
    isWarning: true,
    costShare: 20.4,
    usageShare: 10.0,
    scatterCostPerRedemption: 25.0,
  },
  {
    id: 'rew_5',
    name: 'Free mystery gift',
    pointsRequired: 800,
    timesUsed: 36,
    rewardCost: '$1,112',
    costNum: 1112,
    avgOrder: '$145',
    repeatPurchase30d: '44%',
    repeatNum: 44,
    returnPerDollar: '$9.80',
    returnNum: 9.8,
    status: 'Needs review',
    isWarning: true,
    costShare: 4.9,
    usageShare: 2.0,
    scatterCostPerRedemption: 30.9,
  },
];

