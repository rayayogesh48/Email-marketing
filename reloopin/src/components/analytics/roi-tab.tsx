"use client";

import { useState } from "react";
import { AnalyticsFixture } from "@/lib/analytics-data";
import { ChartCard } from "./chart-card";
import { ROITrendChart } from "./charts/roi-trend-chart";
import { MethodologySheet } from "./methodology-sheet";
import { ROIUnavailableCard } from "./analytics-states";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function ROITab({
  fixture,
  isRoiUnavailable = false,
  onReviewSettings,
  isPartialData = false,
  isSectionError = false,
  onRetrySection,
}: {
  fixture: AnalyticsFixture;
  isRoiUnavailable?: boolean;
  onReviewSettings?: () => void;
  isPartialData?: boolean;
  isSectionError?: boolean;
  onRetrySection?: () => void;
}) {
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const roi = fixture.roi;

  if (isRoiUnavailable) {
    return (
      <div className="space-y-6">
        <ROIUnavailableCard onReviewSettings={onReviewSettings} />
      </div>
    );
  }

  const revenueMax = roi.overview.incrementalRevenue;

  return (
    <div className="space-y-6">
      {/* ROI Overview Top Cards (Clean, No icons, No unwanted sub-text) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Return Multiple Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--primary)]" />
          <span className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Return multiple</span>
          <strong className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--primary)] tabular-nums block">
            {roi.overview.returnMultiple}x
          </strong>
        </div>

        {/* Incremental Revenue Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#c026d3]" />
          <span className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Incremental revenue</span>
          <strong className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] tabular-nums block">
            ${roi.overview.incrementalRevenue.toLocaleString()}
          </strong>
        </div>

        {/* Program Cost Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#d97706]" />
          <span className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Program cost</span>
          <strong className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] tabular-nums block">
            ${roi.overview.programCost.toLocaleString()}
          </strong>
        </div>

        {/* Net Value Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#16a34a]" />
          <span className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Estimated net value</span>
          <strong className="text-2xl sm:text-3xl font-bold tracking-tight text-[#16a34a] tabular-nums block">
            +${roi.overview.netValue.toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Program Value Statement Ledger */}
      <section
        className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 sm:p-6 shadow-xs space-y-5"
        aria-label="Program value statement ledger"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <h3 className="text-base font-semibold text-[var(--foreground)] flex items-center gap-2">
            <span>Program Value Statement</span>
            <span className="badge font-medium text-[10px] bg-[var(--muted)]">
              Estimated
            </span>
          </h3>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setMethodologyOpen(true)}
            className="self-start sm:self-auto text-xs h-8"
          >
            <HelpCircle size={13} className="mr-1.5" />
            <span>Calculation methodology</span>
          </Button>
        </div>

        {/* 1. Value Generated Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#c026d3]">
              Estimated value generated
            </h4>
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">Amount</span>
          </div>

          <div className="space-y-3">
            {roi.revenueLines.map((line, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold text-[var(--foreground)] pr-2">
                    {line.label}
                  </span>
                  <span className="flex-1 border-b border-dotted border-[var(--border)] mx-2 my-auto hidden sm:block" />
                  <span className="font-bold text-[var(--foreground)] tabular-nums pl-2">
                    ${line.amount.toLocaleString()}
                  </span>
                </div>
                {/* Proportional bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--muted)] overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-[#c026d3] transition-all duration-500"
                    style={{
                      width: `${(line.amount / revenueMax) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)] text-xs font-bold text-[var(--foreground)]">
            <span>Estimated incremental revenue</span>
            <span className="text-sm tabular-nums text-[#c026d3] font-extrabold">
              ${roi.overview.incrementalRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border-t border-[var(--border)]" />

        {/* 2. Program Costs Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d97706]">
              Program costs
            </h4>
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">Amount</span>
          </div>

          <div className="space-y-3">
            {roi.costLines.map((line, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="font-semibold text-[var(--foreground)] pr-2">
                    {line.label}
                  </span>
                  <span className="flex-1 border-b border-dotted border-[var(--border)] mx-2 my-auto hidden sm:block" />
                  <span className="font-bold text-[var(--foreground)] tabular-nums pl-2">
                    ${line.amount.toLocaleString()}
                  </span>
                </div>
                {/* Proportional bar */}
                <div className="w-full h-1.5 rounded-full bg-[var(--muted)] overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-[#d97706] transition-all duration-500"
                    style={{
                      width: `${(line.amount / revenueMax) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)] text-xs font-bold text-[var(--foreground)]">
            <span>Total program cost</span>
            <span className="text-sm tabular-nums text-[#d97706] font-extrabold">
              ${roi.overview.programCost.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 3. Reconciled Estimated Result Statement */}
        <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Estimated result
            </h4>
            <span className="badge font-bold text-[11px] bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] tabular-nums px-2 py-0.5">
              {roi.overview.returnMultiple}x
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Incremental revenue:</span>
              <span className="tabular-nums font-semibold text-[var(--foreground)]">
                ${roi.overview.incrementalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Program cost:</span>
              <span className="tabular-nums font-semibold text-[#d97706]">
                -${roi.overview.programCost.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between">
            <span className="font-bold text-sm text-[var(--foreground)]">
              Estimated net value
            </span>
            <strong className="text-xl sm:text-2xl font-black text-[#16a34a] tabular-nums">
              +${roi.overview.netValue.toLocaleString()}
            </strong>
          </div>
        </div>
      </section>

      {/* Value Generated Over Time Chart */}
      <ChartCard
        title="Value Generated Over Time"
        isError={isSectionError || isPartialData}
        onRetry={onRetrySection}
      >
        <ROITrendChart data={roi.trend} />
      </ChartCard>

      {/* Methodology slide-over sheet */}
      <MethodologySheet
        open={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  );
}
