"use client";

import { useState } from "react";
import {
  ActiveMemberDataPoint,
  AnalyticsFixture,
  KPICardData,
  RewardRedemptionItem,
} from "@/lib/analytics-data";
import { MetricCard } from "./metric-card";
import { ChartCard } from "./chart-card";
import { ActiveMembersChart } from "./charts/active-members-chart";
import { PointsActivityChart } from "./charts/points-activity-chart";
import { PopularRewardsChart } from "./charts/popular-rewards-chart";
import { RepeatPurchaseChart } from "./charts/repeat-purchase-chart";
import { DetailSheetData } from "./analytics-detail-sheet";
import { Info } from "lucide-react";

export function LoyaltyTab({
  fixture,
  onOpenSheet,
  isPartialData = false,
  isSectionError = false,
  onRetrySection,
}: {
  fixture: AnalyticsFixture;
  onOpenSheet: (data: DetailSheetData) => void;
  isPartialData?: boolean;
  isSectionError?: boolean;
  onRetrySection?: () => void;
}) {
  const loyalty = fixture.loyalty;
  const [showMethodologyTooltip, setShowMethodologyTooltip] = useState(false);

  // Drilldown handlers
  const handleKPIClick = (kpi: KPICardData) => {
    onOpenSheet({
      title: kpi.title,
      description: kpi.tooltip,
      currentValue: kpi.value,
      previousValue: kpi.previousValue,
      change: kpi.comparisonLabel,
      changeDirection: kpi.comparisonDirection,
      breakdown: kpi.detailRows,
      actionLabel: "View related customers",
      onAction: () => {},
    });
  };

  const handlePointClick = (point: ActiveMemberDataPoint) => {
    onOpenSheet({
      title: `Daily Activity · ${point.label}`,
      description: `Active member and order breakdown for ${point.date}.`,
      currentValue: `${point.current} active members`,
      previousValue: `${point.previous} members (prev. period)`,
      change: `${point.current >= point.previous ? "+" : ""}${
        point.current - point.previous
      } vs previous`,
      changeDirection: point.current >= point.previous ? "up" : "down",
      breakdown: [
        { label: "New member signups", value: `+${point.newMembers}` },
        { label: "Returning members", value: `${point.returningMembers}` },
        { label: "Eligible orders placed", value: `${point.orders}` },
        {
          label: "Engagement rate",
          value: `${Math.round((point.orders / point.current) * 100)}%`,
        },
      ],
      actionLabel: "View daily customer orders",
      onAction: () => {},
    });
  };

  const handleRewardClick = (reward: RewardRedemptionItem) => {
    onOpenSheet({
      title: reward.name,
      description: `Performance metrics for reward during this period.`,
      currentValue: `${reward.redemptions} redemptions`,
      breakdown: [
        { label: "Associated campaign", value: reward.campaign },
        { label: "Total points redeemed", value: `${reward.pointsUsed.toLocaleString()} pts` },
        { label: "Discount value given", value: `$${reward.discountValue.toLocaleString()}` },
        { label: "Revenue from orders", value: `$${reward.revenue.toLocaleString()}` },
        { label: "Share of total redemptions", value: `${reward.percentage}%` },
      ],
      actionLabel: "View campaign details",
      onAction: () => {},
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <MetricCard
          metric={loyalty.kpis.activeMembers}
          onClick={() => handleKPIClick(loyalty.kpis.activeMembers)}
        />
        <MetricCard
          metric={loyalty.kpis.pointsEarned}
          onClick={() => handleKPIClick(loyalty.kpis.pointsEarned)}
        />
        <MetricCard
          metric={loyalty.kpis.pointsRedeemed}
          onClick={() => handleKPIClick(loyalty.kpis.pointsRedeemed)}
        />
        <MetricCard
          metric={loyalty.kpis.redemptionRate}
          onClick={() => handleKPIClick(loyalty.kpis.redemptionRate)}
        />
        <MetricCard
          metric={loyalty.kpis.repeatLift}
          onClick={() => handleKPIClick(loyalty.kpis.repeatLift)}
        />
      </div>

      {/* Top Charts Row: Active Members Trend & Points Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Active Members Trend">
          <ActiveMembersChart
            dailyData={loyalty.activeMembersDaily}
            weeklyData={loyalty.activeMembersWeekly}
            onSelectPoint={handlePointClick}
          />
        </ChartCard>

        <ChartCard
          title="Points Activity"
          isError={isSectionError}
          onRetry={onRetrySection}
        >
          <PointsActivityChart data={loyalty.pointsDaily} />
        </ChartCard>
      </div>

      {/* Bottom Row: Most Redeemed Rewards & Member Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Most Redeemed Rewards">
          <PopularRewardsChart
            rewards={loyalty.rewards}
            onSelectReward={handleRewardClick}
          />
        </ChartCard>

        <ChartCard
          title="Repeat Purchase Rate"
          isError={isPartialData}
          onRetry={onRetrySection}
          action={
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => setShowMethodologyTooltip(true)}
              onMouseLeave={() => setShowMethodologyTooltip(false)}
            >
              <button
                type="button"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded hover:bg-[var(--muted)] transition-colors"
                aria-label="Repeat purchase lift methodology"
              >
                <Info size={13} />
              </button>

              {showMethodologyTooltip && (
                <div
                  className="absolute right-0 top-7 w-64 p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl text-xs text-[var(--foreground)] z-40 font-normal leading-relaxed pointer-events-none animate-in fade-in zoom-in-95 duration-100"
                  role="tooltip"
                >
                  <div className="font-semibold mb-1">Repeat purchase methodology</div>
                  Calculated by comparing the percentage of loyalty members who
                  placed 2+ orders within 90 days against non-loyalty customers.
                </div>
              )}
            </div>
          }
        >
          <RepeatPurchaseChart
            trendData={loyalty.repeatRateTrend}
            memberRepeatRate={loyalty.comparisonStats.memberRepeatRate}
            nonMemberRepeatRate={loyalty.comparisonStats.nonMemberRepeatRate}
            lift={loyalty.comparisonStats.lift}
          />
        </ChartCard>
      </div>
    </div>
  );
}

