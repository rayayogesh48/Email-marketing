"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnalyticsFixture,
  KPICardData,
  TierDistributionItem,
} from "@/lib/analytics-data";
import { MetricCard } from "./metric-card";
import { ChartCard } from "./chart-card";
import { TierDistributionChart } from "./charts/tier-distribution-chart";
import { TierUpgradesChart } from "./charts/tier-upgrades-chart";
import { DetailSheetData } from "./analytics-detail-sheet";
import { Button } from "@/components/ui/button";
import { Info, Mail, User, Search } from "lucide-react";

export function VIPTab({
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
  const router = useRouter();
  const vip = fixture.vip;
  const [showCorrelationTooltip, setShowCorrelationTooltip] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNearTierCustomers = vip.nearTierCustomers.filter((cust) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cust.name.toLowerCase().includes(q) ||
      cust.email.toLowerCase().includes(q) ||
      cust.currentTier.toLowerCase().includes(q) ||
      cust.nextTier.toLowerCase().includes(q)
    );
  });

  const handleKPIClick = (kpi: KPICardData) => {
    onOpenSheet({
      title: kpi.title,
      description: kpi.tooltip,
      currentValue: kpi.value,
      previousValue: kpi.previousValue,
      change: kpi.comparisonLabel,
      changeDirection: kpi.comparisonDirection,
      breakdown: kpi.detailRows,
      actionLabel: "View tier settings",
      onAction: () => {},
    });
  };

  const handleTierClick = (tier: TierDistributionItem) => {
    onOpenSheet({
      title: `${tier.name} Tier Members`,
      description: `Performance and member profile for the ${tier.name} tier.`,
      currentValue: `${tier.customers.toLocaleString()} members`,
      change: `${tier.percentage}% of loyalty members`,
      changeDirection: "neutral",
      breakdown: [
        {
          label: "Entry threshold",
          value: tier.threshold > 0 ? `${tier.threshold.toLocaleString()} pts` : "0 pts (Default)",
        },
        { label: "Average points per member", value: `${tier.avgPoints.toLocaleString()} pts` },
        { label: "Average order value (AOV)", value: `$${tier.avgOrderValue}` },
        { label: "Total period spend", value: `$${tier.totalSpend.toLocaleString()}` },
        { label: "Growth vs previous period", value: tier.change },
      ],
      actionLabel: `View ${tier.name} tier customers`,
      onAction: () => {},
    });
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="stats-grid">
        <MetricCard
          metric={vip.kpis.customersInTiers}
          onClick={() => handleKPIClick(vip.kpis.customersInTiers)}
        />
        <MetricCard
          metric={vip.kpis.tierUpgrades}
          onClick={() => handleKPIClick(vip.kpis.tierUpgrades)}
        />
        <MetricCard
          metric={vip.kpis.tierDowngrades}
          onClick={() => handleKPIClick(vip.kpis.tierDowngrades)}
        />
        <MetricCard
          metric={vip.kpis.nearNextTier}
          onClick={() => handleKPIClick(vip.kpis.nearNextTier)}
        />
        <MetricCard
          metric={vip.kpis.avgVipOrder}
          onClick={() => handleKPIClick(vip.kpis.avgVipOrder)}
        />
      </div>

      {/* Tier Distribution & Movement Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Customers by Tier">
          <TierDistributionChart
            distribution={vip.distribution}
            onSelectTier={handleTierClick}
          />
        </ChartCard>

        <ChartCard
          title="Tier Movement"
          isError={isSectionError}
          onRetry={onRetrySection}
        >
          <div className="table-container max-h-76 overflow-y-auto">
            <table>
              <thead>
                <tr>
                  <th>Movement</th>
                  <th className="text-right">Customers</th>
                  <th className="text-right">Previous</th>
                  <th className="text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {vip.movements.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td>
                      <span className="font-semibold text-xs text-[var(--foreground)]">
                        {m.label}
                      </span>
                    </td>
                    <td className="text-right tabular-nums font-bold text-[var(--foreground)]">
                      {m.customers}
                    </td>
                    <td className="text-right tabular-nums text-[var(--muted-foreground)]">
                      {m.previous}
                    </td>
                    <td className="text-right tabular-nums">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border ${
                          m.type === "upgrade"
                            ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20"
                            : "bg-[#ca8a04]/10 text-[#ca8a04] border-[#ca8a04]/20"
                        }`}
                      >
                        {m.change >= 0 ? "+" : ""}
                        {m.change}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Upgrades Over Time & Customer Value by Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Tier Upgrades Over Time">
          <TierUpgradesChart data={vip.upgradesTrend} />
        </ChartCard>

        <ChartCard
          title="Customer Value by Tier"
          isError={isPartialData}
          onRetry={onRetrySection}
          action={
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => setShowCorrelationTooltip(true)}
              onMouseLeave={() => setShowCorrelationTooltip(false)}
            >
              <button
                type="button"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded transition-colors"
                aria-label="Tier correlation explanation"
              >
                <Info size={13} />
              </button>

              {showCorrelationTooltip && (
                <div
                  className="absolute right-0 top-6 w-60 p-2.5 rounded-md bg-[var(--card)] border border-[var(--border)] shadow-lg text-xs text-[var(--foreground)] z-20 font-normal leading-normal pointer-events-none"
                  role="tooltip"
                >
                  Tier performance shows correlation with engaged customers,
                  not guaranteed causation.
                </div>
              )}
            </div>
          }
        >
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th className="text-right">Customers</th>
                  <th className="text-right">Avg order</th>
                  <th className="text-right">Orders/cust</th>
                  <th className="text-right">Total spend</th>
                  <th className="text-right">Spend lift</th>
                </tr>
              </thead>
              <tbody>
                {vip.customerValue.map((v) => (
                  <tr key={v.tier} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="font-bold text-xs text-[var(--foreground)]">
                      {v.tier}
                    </td>
                    <td className="text-right tabular-nums text-xs">{v.customers}</td>
                    <td className="text-right tabular-nums font-semibold text-xs">${v.avgOrder}</td>
                    <td className="text-right tabular-nums text-xs">{v.ordersPerCustomer}</td>
                    <td className="text-right tabular-nums font-bold text-xs">
                      ${v.totalSpend.toLocaleString()}
                    </td>
                    <td className="text-right tabular-nums">
                      <span
                        className={
                          v.spendLift === "Baseline"
                            ? "text-[var(--muted-foreground)] text-xs"
                            : "badge success font-semibold text-xs"
                        }
                      >
                        {v.spendLift}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>

      {/* Customers Close to Upgrading Table with Search Toolbar */}
      <ChartCard
        title="Customers Close to Upgrading"
        action={
          <div className="relative">
            <Search size={13} className="text-[var(--muted-foreground)] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] w-36 sm:w-48 shadow-2xs transition-all"
              aria-label="Filter near tier customers"
            />
          </div>
        }
      >
        <div className="table-container overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Current tier</th>
                <th className="text-right">Current points</th>
                <th>Next tier</th>
                <th className="text-right">Progress</th>
                <th>Last active</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNearTierCustomers.map((cust) => {
                const targetPoints = cust.currentPoints + cust.pointsNeeded;
                const progressPct = Math.round((cust.currentPoints / targetPoints) * 100);
                const initials = cust.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <tr key={cust.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td>
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[var(--primary-container)] text-[var(--primary)] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[var(--primary)]/20">
                          {initials}
                        </span>
                        <div>
                          <strong className="text-[var(--foreground)] text-xs block font-semibold">
                            {cust.name}
                          </strong>
                          <span className="text-[10px] text-[var(--muted-foreground)]">
                            {cust.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge font-medium">{cust.currentTier}</span>
                    </td>
                    <td className="text-right tabular-nums font-semibold text-xs">
                      {cust.currentPoints.toLocaleString()} pts
                    </td>
                    <td>
                      <span className="badge success font-semibold">{cust.nextTier}</span>
                    </td>
                    <td className="text-right">
                      <div className="inline-block text-right">
                        <span className="text-xs font-bold text-[var(--primary)] tabular-nums block">
                          {cust.pointsNeeded} pts left
                        </span>
                        <div className="w-20 h-1.5 rounded-full bg-[var(--muted)] overflow-hidden ml-auto mt-1">
                          <div
                            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                            title={`${progressPct}% to ${cust.nextTier}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-[var(--muted-foreground)] whitespace-nowrap text-xs">
                      {cust.lastActive}
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-[11px]"
                          onClick={() => {
                            onOpenSheet({
                              title: cust.name,
                              description: `Customer profile and loyalty summary for ${cust.email}.`,
                              currentValue: `${cust.currentPoints.toLocaleString()} pts`,
                              breakdown: [
                                { label: "Current tier", value: cust.currentTier },
                                { label: "Next target tier", value: cust.nextTier },
                                { label: "Points needed to level up", value: `${cust.pointsNeeded} pts` },
                                { label: "Progress to threshold", value: `${progressPct}%` },
                                { label: "Last activity", value: cust.lastActive },
                              ],
                              actionLabel: "View customer in store",
                            });
                          }}
                        >
                          <User size={12} className="mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2.5 text-[11px]"
                          onClick={() => {
                            router.push(`/campaigns/new?segment=${cust.currentTier}&action=upgrade-reminder`);
                          }}
                        >
                          <Mail size={12} className="mr-1" />
                          Send campaign
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
