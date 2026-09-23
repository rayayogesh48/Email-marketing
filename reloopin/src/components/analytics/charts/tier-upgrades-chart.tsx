"use client";

import { useMemo, useState } from "react";
import { TierUpgradeTimePoint } from "@/lib/analytics-data";
import { BarChart3, Table as TableIcon } from "lucide-react";

const UPGRADE_WIDTH = 500;
const UPGRADE_HEIGHT = 200;
const UPGRADE_PADDING = { top: 20, right: 20, bottom: 35, left: 35 };

export function TierUpgradesChart({
  data,
}: {
  data: TierUpgradeTimePoint[];
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { maxVal, bars } = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      if (d.upgrades > max) max = d.upgrades;
      if (d.previous > max) max = d.previous;
    });
    max = Math.ceil((max * 1.15) / 5) * 5 || 35;

    const chartW = UPGRADE_WIDTH - UPGRADE_PADDING.left - UPGRADE_PADDING.right;
    const chartH = UPGRADE_HEIGHT - UPGRADE_PADDING.top - UPGRADE_PADDING.bottom;
    const slotW = chartW / data.length;
    const barW = Math.min(28, slotW * 0.45);

    const computed = data.map((d, i) => {
      const slotX = UPGRADE_PADDING.left + i * slotW;
      const x = slotX + (slotW / 2) - (barW / 2);
      const h = (d.upgrades / max) * chartH;
      const y = UPGRADE_PADDING.top + chartH - h;

      return {
        data: d,
        slotX,
        slotW,
        x,
        y,
        h,
        barW,
      };
    });

    return { maxVal: max, bars: computed };
  }, [data]);

  const yTicks = [0, Math.round(maxVal / 2), maxVal];
  const hoveredBar = hoverIndex !== null ? bars[hoverIndex] : null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-xs text-[var(--muted-foreground)]">
          Total upgrades: <strong className="text-[var(--foreground)]">96</strong>
        </div>

        <div className="inline-flex rounded-md p-0.5 bg-[var(--muted)] border border-[var(--border)] text-xs">
          <button
            type="button"
            className={`px-2.5 py-1 rounded inline-flex items-center gap-1.5 transition-colors ${
              view === "chart"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-medium"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setView("chart")}
            aria-label="View tier upgrades as chart"
          >
            <BarChart3 size={13} />
            <span>Chart</span>
          </button>
          <button
            type="button"
            className={`px-2.5 py-1 rounded inline-flex items-center gap-1.5 transition-colors ${
              view === "table"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-medium"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setView("table")}
            aria-label="View tier upgrades as table"
          >
            <TableIcon size={13} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${UPGRADE_WIDTH} ${UPGRADE_HEIGHT}`}
            className="w-full h-auto select-none"
            role="img"
            aria-label="Tier upgrades by week column chart"
          >
            <title>Tier upgrades over time</title>
            <desc>Column chart showing loyalty tier upgrades each week.</desc>

            {yTicks.map((tick) => {
              const chartH = UPGRADE_HEIGHT - UPGRADE_PADDING.top - UPGRADE_PADDING.bottom;
              const y = UPGRADE_PADDING.top + chartH - (tick / maxVal) * chartH;
              return (
                <g key={tick}>
                  <line
                    x1={UPGRADE_PADDING.left}
                    y1={y}
                    x2={UPGRADE_WIDTH - UPGRADE_PADDING.right}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray={tick === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={UPGRADE_PADDING.left - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--muted-foreground)"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {bars.map((bar, i) => (
              <g key={i}>
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.barW}
                  height={bar.h}
                  fill="var(--primary)"
                  rx="3"
                  opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.4}
                />
                <text
                  x={bar.slotX + bar.slotW / 2}
                  y={UPGRADE_HEIGHT - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  Wk {i + 1}
                </text>
                {/* Hit area */}
                <rect
                  x={bar.slotX}
                  y={UPGRADE_PADDING.top}
                  width={bar.slotW}
                  height={UPGRADE_HEIGHT - UPGRADE_PADDING.top - UPGRADE_PADDING.bottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${bar.data.period}: ${bar.data.upgrades} upgrades`}
                />
              </g>
            ))}
          </svg>

          {hoveredBar && (
            <div
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-[var(--card)] border border-[var(--border)] rounded-md shadow-lg p-2 text-xs pointer-events-none z-10 min-w-36"
              role="tooltip"
            >
              <div className="font-medium text-[var(--foreground)] border-b border-[var(--border)] pb-1 mb-1">
                {hoveredBar.data.period}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Upgrades:</span>
                <strong className="text-[var(--foreground)] tabular-nums">
                  {hoveredBar.data.upgrades} customers
                </strong>
              </div>
              <div className="flex justify-between items-center text-[10px] text-[var(--muted-foreground)] mt-0.5">
                <span>Previous period:</span>
                <span className="tabular-nums">{hoveredBar.data.previous}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Week</th>
                <th className="text-right">Upgrades</th>
                <th className="text-right">Previous</th>
                <th className="text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.period}>
                  <td className="font-medium">{row.period}</td>
                  <td className="text-right tabular-nums font-semibold">{row.upgrades}</td>
                  <td className="text-right tabular-nums text-[var(--muted-foreground)]">
                    {row.previous}
                  </td>
                  <td className="text-right tabular-nums text-[#16a34a] font-medium">
                    +{row.upgrades - row.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
