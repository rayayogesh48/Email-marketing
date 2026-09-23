"use client";

import { useState } from "react";
import { ArrowRight, BarChart2, Table as TableIcon } from "lucide-react";
import {
  DashboardPointsActivity,
  DashboardPointsDataPoint,
} from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";

export function PointsActivityCard({
  activity,
  onOpenDateSheet,
  onViewAllActivity,
}: {
  activity: DashboardPointsActivity;
  onOpenDateSheet: (point: DashboardPointsDataPoint) => void;
  onViewAllActivity: () => void;
}) {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [renderMode, setRenderMode] = useState<"chart" | "table">("chart");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = viewMode === "daily" ? activity.daily : activity.weekly;

  // Chart calculations
  const maxVal = Math.max(...data.map((d) => Math.max(d.earned, d.redeemed)), 1000);
  const chartHeight = 160;
  const paddingBottom = 24;
  const usableHeight = chartHeight - paddingBottom;

  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
              Points activity
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Compare points earned and redeemed during this period.
            </p>
          </div>

          {/* Controls: Daily/Weekly and Chart/Table */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {/* Daily/Weekly Toggle */}
            <div className="inline-flex items-center bg-[var(--muted)] p-0.5 rounded-lg border border-[var(--border)] text-xs">
              <button
                type="button"
                onClick={() => setViewMode("daily")}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  viewMode === "daily"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-2xs font-semibold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Daily
              </button>
              <button
                type="button"
                onClick={() => setViewMode("weekly")}
                className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                  viewMode === "weekly"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-2xs font-semibold"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Weekly
              </button>
            </div>

            {/* Chart/Table Toggle */}
            <div className="inline-flex items-center bg-[var(--muted)] p-0.5 rounded-lg border border-[var(--border)] text-xs">
              <button
                type="button"
                onClick={() => setRenderMode("chart")}
                aria-label="View as chart"
                className={`p-1 rounded-md transition-all ${
                  renderMode === "chart"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-2xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <BarChart2 size={13} />
              </button>
              <button
                type="button"
                onClick={() => setRenderMode("table")}
                aria-label="View as table"
                className={`p-1 rounded-md transition-all ${
                  renderMode === "table"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-2xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                <TableIcon size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[var(--secondary)]" />
            <span>Points earned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#c026d3]" />
            <span>Points redeemed</span>
          </div>
        </div>

        {/* Content: Chart vs Table */}
        {renderMode === "chart" ? (
          <div className="relative pt-2 pb-1">
            <div className="h-[180px] w-full flex items-end gap-1.5 sm:gap-2">
              {data.map((item, idx) => {
                const earnedH = Math.max(3, (item.earned / maxVal) * usableHeight);
                const redeemedH = Math.max(3, (item.redeemed / maxVal) * usableHeight);
                const isHovered = hoveredIndex === idx;

                return (
                  <div
                    key={item.date}
                    className="relative flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => onOpenDateSheet(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.label}: ${item.earned.toLocaleString()} earned, ${item.redeemed.toLocaleString()} redeemed`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onOpenDateSheet(item);
                      }
                    }}
                  >
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div
                        className="absolute bottom-[calc(100%+8px)] z-40 p-2.5 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-xl text-xs pointer-events-none whitespace-nowrap animate-in fade-in zoom-in-95 duration-100"
                        role="tooltip"
                      >
                        <div className="font-semibold text-[var(--foreground)] border-b border-[var(--border)] pb-1 mb-1.5">
                          {item.label}
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex items-center justify-between gap-3 text-[var(--secondary)] font-medium">
                            <span>Earned:</span>
                            <span className="tabular-nums font-bold">
                              +{item.earned.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-[#c026d3] font-medium">
                            <span>Redeemed:</span>
                            <span className="tabular-nums font-bold">
                              -{item.redeemed.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
                            <span>Net change:</span>
                            <span className="tabular-nums font-semibold text-[var(--foreground)]">
                              +{item.netChange.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grouped Columns */}
                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1">
                      {/* Earned Column (Green) */}
                      <div
                        style={{ height: `${earnedH}px` }}
                        className={`w-full max-w-[12px] sm:max-w-[16px] rounded-t-xs bg-[var(--secondary)] transition-all ${
                          isHovered ? "opacity-100 brightness-110" : "opacity-85"
                        }`}
                      />
                      {/* Redeemed Column (Fuchsia) */}
                      <div
                        style={{ height: `${redeemedH}px` }}
                        className={`w-full max-w-[12px] sm:max-w-[16px] rounded-t-xs bg-[#c026d3] transition-all ${
                          isHovered ? "opacity-100 brightness-110" : "opacity-85"
                        }`}
                      />
                    </div>

                    {/* X-axis Label */}
                    <div className="h-6 flex items-center justify-center mt-1 text-[10px] text-[var(--muted-foreground)] truncate max-w-full font-medium">
                      {viewMode === "weekly"
                        ? item.label.split(" ")[0]
                        : idx % 4 === 0
                        ? item.label
                        : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto max-h-[190px] border border-[var(--border)] rounded-lg">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--muted)]/60 text-[var(--muted-foreground)] font-semibold border-b border-[var(--border)] sticky top-0">
                <tr>
                  <th className="py-2 px-3">Period</th>
                  <th className="py-2 px-3 text-right">Points earned</th>
                  <th className="py-2 px-3 text-right">Points redeemed</th>
                  <th className="py-2 px-3 text-right">Net change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {data.map((row) => (
                  <tr
                    key={row.date}
                    onClick={() => onOpenDateSheet(row)}
                    className="hover:bg-[var(--muted)]/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2 px-3 font-medium text-[var(--foreground)]">
                      {row.label}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[var(--secondary)] font-semibold">
                      +{row.earned.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums text-[#c026d3] font-semibold">
                      -{row.redeemed.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right tabular-nums font-medium text-[var(--foreground)]">
                      +{row.netChange.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">
          Total net points:{" "}
          <strong className="text-[var(--foreground)] tabular-nums">
            +{activity.totals.netChange.toLocaleString()}
          </strong>
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAllActivity}
          className="h-7 px-2 text-xs font-medium text-[var(--primary)] gap-1 hover:bg-[var(--primary-container)]/30"
        >
          <span>View points activity</span>
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
}

