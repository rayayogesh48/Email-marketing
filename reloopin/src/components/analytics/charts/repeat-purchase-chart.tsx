"use client";

import { useMemo, useState } from "react";
import { RepeatRateTimePoint } from "@/lib/analytics-data";
import { BarChart3, Table as TableIcon } from "lucide-react";

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const PADDING = { top: 28, right: 16, bottom: 32, left: 42 };

export function RepeatPurchaseChart({
  trendData,
  memberRepeatRate,
  nonMemberRepeatRate,
  lift,
}: {
  trendData: RepeatRateTimePoint[];
  memberRepeatRate: number;
  nonMemberRepeatRate: number;
  lift: number;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { maxRate, bars } = useMemo(() => {
    // Max rate for Y axis (e.g. 50%)
    const max = 50;

    const chartW = CHART_WIDTH - PADDING.left - PADDING.right;
    const chartH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
    const slotW = chartW / trendData.length;
    const barW = Math.min(24, (slotW - 28) / 2);

    const computed = trendData.map((d, i) => {
      const slotX = PADDING.left + i * slotW;
      const xMember = slotX + (slotW / 2) - barW - 2;
      const xNonMember = slotX + (slotW / 2) + 2;

      const hMember = (d.memberRate / max) * chartH;
      const hNonMember = (d.nonMemberRate / max) * chartH;

      const yMember = PADDING.top + chartH - hMember;
      const yNonMember = PADDING.top + chartH - hNonMember;

      return {
        data: d,
        slotX,
        slotW,
        xMember,
        yMember,
        hMember,
        xNonMember,
        yNonMember,
        hNonMember,
        barW,
      };
    });

    return { maxRate: max, bars: computed };
  }, [trendData]);

  const yTicks = [0, 25, 50];
  const hoveredBar = hoverIndex !== null ? bars[hoverIndex] : null;

  return (
    <div className="w-full">
      {/* Legend and Chart/Table Toggle */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] shrink-0" />
            <span className="font-semibold text-[var(--foreground)]">Loyalty members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
            <span className="font-medium text-[var(--muted-foreground)]">Non-members</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 tabular-nums">
            +{lift} pts
          </span>

          <div className="inline-flex rounded-lg p-0.5 bg-[var(--muted)] border border-[var(--border)] text-xs shadow-2xs">
            <button
              type="button"
              className={`px-2 py-1 rounded-md inline-flex items-center gap-1.5 transition-all ${
                view === "chart"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
              onClick={() => setView("chart")}
              aria-label="View repeat rate as chart"
            >
              <BarChart3 size={13} />
              <span>Chart</span>
            </button>
            <button
              type="button"
              className={`px-2 py-1 rounded-md inline-flex items-center gap-1.5 transition-all ${
                view === "table"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
              onClick={() => setView("table")}
              aria-label="View repeat rate as table"
            >
              <TableIcon size={13} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {view === "chart" ? (
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="w-full h-auto overflow-visible select-none"
            role="img"
            aria-label="Repeat purchase rate comparison chart by week"
          >
            {/* Gridlines */}
            {yTicks.map((tick) => {
              const y = PADDING.top + (CHART_HEIGHT - PADDING.top - PADDING.bottom) * (1 - tick / maxRate);
              return (
                <g key={tick}>
                  <line
                    x1={PADDING.left}
                    y1={y}
                    x2={CHART_WIDTH - PADDING.right}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray="3 3"
                    strokeOpacity={0.6}
                  />
                  <text
                    x={PADDING.left - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    className="text-[10px] fill-[var(--muted-foreground)] font-mono"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Bars and Columns */}
            {bars.map((bar, i) => {
              const isHovered = hoverIndex === i;
              const liftLabel = `+${bar.data.lift} pts`;

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  {/* Hover background column */}
                  <rect
                    x={bar.slotX}
                    y={PADDING.top}
                    width={bar.slotW}
                    height={CHART_HEIGHT - PADDING.top - PADDING.bottom}
                    fill="var(--foreground)"
                    fillOpacity={isHovered ? 0.04 : 0}
                    rx={6}
                    className="transition-colors"
                  />

                  {/* Lift pill above bars */}
                  <g>
                    <rect
                      x={bar.slotX + bar.slotW / 2 - 24}
                      y={PADDING.top - 18}
                      width={48}
                      height={16}
                      rx={8}
                      fill={isHovered ? "var(--primary)" : "var(--muted)"}
                      stroke="var(--border)"
                      className="transition-colors"
                    />
                    <text
                      x={bar.slotX + bar.slotW / 2}
                      y={PADDING.top - 7}
                      textAnchor="middle"
                      className={`text-[9px] font-bold tabular-nums font-mono ${
                        isHovered ? "fill-white" : "fill-[var(--foreground)]"
                      }`}
                    >
                      {liftLabel}
                    </text>
                  </g>

                  {/* Loyalty Member Bar */}
                  <rect
                    x={bar.xMember}
                    y={bar.yMember}
                    width={bar.barW}
                    height={bar.hMember}
                    fill="var(--primary)"
                    rx={3}
                    className={`transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-90"}`}
                  />

                  {/* Non-Member Bar */}
                  <rect
                    x={bar.xNonMember}
                    y={bar.yNonMember}
                    width={bar.barW}
                    height={bar.hNonMember}
                    fill="#94a3b8"
                    rx={3}
                    className={`transition-all duration-300 ${isHovered ? "opacity-90" : "opacity-60"}`}
                  />

                  {/* X Axis Label */}
                  <text
                    x={bar.slotX + bar.slotW / 2}
                    y={CHART_HEIGHT - PADDING.bottom + 18}
                    textAnchor="middle"
                    className={`text-[11px] ${
                      isHovered
                        ? "fill-[var(--foreground)] font-bold"
                        : "fill-[var(--muted-foreground)] font-medium"
                    }`}
                  >
                    Week {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip */}
          {hoveredBar && (
            <div
              className="absolute pointer-events-none z-30 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl p-2.5 text-xs text-[var(--foreground)] min-w-[170px] -translate-x-1/2 -translate-y-full transition-all duration-75"
              style={{
                left: `${((hoveredBar.slotX + hoveredBar.slotW / 2) / CHART_WIDTH) * 100}%`,
                top: `${(hoveredBar.yMember / CHART_HEIGHT) * 100}%`,
              }}
            >
              <div className="font-semibold text-xs border-b border-[var(--border)] pb-1 mb-1.5 text-[var(--foreground)]">
                {hoveredBar.data.period}
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--primary)] font-semibold">Members:</span>
                  <span className="font-bold">{hoveredBar.data.memberRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--muted-foreground)]">Non-members:</span>
                  <span className="font-semibold">{hoveredBar.data.nonMemberRate}%</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Lift:</span>
                  <span>+{hoveredBar.data.lift} pts</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="table-container max-h-[220px] overflow-y-auto">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th className="text-right">Members</th>
                <th className="text-right">Non-members</th>
                <th className="text-right">Lift</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((d, i) => (
                <tr key={i} className="hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="font-medium text-xs text-[var(--foreground)]">{d.period}</td>
                  <td className="text-right tabular-nums font-bold text-xs text-[var(--primary)]">
                    {d.memberRate}%
                  </td>
                  <td className="text-right tabular-nums text-xs text-[var(--muted-foreground)]">
                    {d.nonMemberRate}%
                  </td>
                  <td className="text-right tabular-nums">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      +{d.lift} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Summary Benchmark */}
      <div className="pt-3 border-t border-[var(--border)]/60 mt-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="text-[var(--muted-foreground)]">30-day average:</span>
          <span className="font-semibold text-[var(--foreground)]">
            {memberRepeatRate}% vs {nonMemberRepeatRate}%
          </span>
        </div>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          +{lift} pts net lift
        </span>
      </div>
    </div>
  );
}

