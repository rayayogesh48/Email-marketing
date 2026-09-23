"use client";

import { useMemo, useState } from "react";
import { ROITimePoint } from "@/lib/analytics-data";
import { BarChart3, Table as TableIcon } from "lucide-react";

const ROI_WIDTH = 640;
const ROI_HEIGHT = 240;
const ROI_PADDING = { top: 20, right: 20, bottom: 35, left: 55 };

export function ROITrendChart({
  data,
}: {
  data: ROITimePoint[];
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { maxVal, bars } = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      if (d.incrementalRevenue > max) max = d.incrementalRevenue;
      if (d.cost > max) max = d.cost;
    });
    max = Math.ceil((max * 1.15) / 2000) * 2000 || 14000;

    const chartW = ROI_WIDTH - ROI_PADDING.left - ROI_PADDING.right;
    const chartH = ROI_HEIGHT - ROI_PADDING.top - ROI_PADDING.bottom;
    const slotW = chartW / data.length;
    const barW = Math.min(22, (slotW - 20) / 2);

    const computed = data.map((d, i) => {
      const slotX = ROI_PADDING.left + i * slotW;
      const xRevenue = slotX + (slotW / 2) - barW - 2;
      const xCost = slotX + (slotW / 2) + 2;

      const hRevenue = (d.incrementalRevenue / max) * chartH;
      const hCost = (d.cost / max) * chartH;

      const yRevenue = ROI_PADDING.top + chartH - hRevenue;
      const yCost = ROI_PADDING.top + chartH - hCost;

      return {
        data: d,
        slotX,
        slotW,
        xRevenue,
        yRevenue,
        hRevenue,
        xCost,
        yCost,
        hCost,
        barW,
      };
    });

    return { maxVal: max, bars: computed };
  }, [data]);

  const yTicks = [0, Math.round(maxVal / 2), maxVal];
  const hoveredBar = hoverIndex !== null ? bars[hoverIndex] : null;

  return (
    <div className="w-full">
      {/* Legend and Toggle */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c026d3] inline-block shadow-2xs" />
            <span className="font-semibold text-[var(--foreground)]">Incremental revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] inline-block shadow-2xs" />
            <span className="font-semibold text-[var(--foreground)]">Program cost</span>
          </div>
        </div>

        <div className="inline-flex rounded-lg p-0.5 bg-[var(--muted)] border border-[var(--border)] text-xs shadow-2xs">
          <button
            type="button"
            className={`px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 transition-all ${
              view === "chart"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setView("chart")}
            aria-label="View ROI trend as chart"
          >
            <BarChart3 size={13} />
            <span>Chart</span>
          </button>
          <button
            type="button"
            className={`px-2.5 py-1 rounded-md inline-flex items-center gap-1.5 transition-all ${
              view === "table"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setView("table")}
            aria-label="View ROI trend as table"
          >
            <TableIcon size={13} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${ROI_WIDTH} ${ROI_HEIGHT}`}
            className="w-full h-auto select-none"
            role="img"
            aria-label="Value generated over time grouped column chart"
          >
            <title>Value generated over time</title>
            <desc>
              Grouped column chart comparing estimated incremental revenue and program cost.
            </desc>

            {yTicks.map((tick) => {
              const chartH = ROI_HEIGHT - ROI_PADDING.top - ROI_PADDING.bottom;
              const y = ROI_PADDING.top + chartH - (tick / maxVal) * chartH;
              return (
                <g key={tick}>
                  <line
                    x1={ROI_PADDING.left}
                    y1={y}
                    x2={ROI_WIDTH - ROI_PADDING.right}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray={tick === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={ROI_PADDING.left - 6}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--muted-foreground)"
                  >
                    ${tick.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {bars.map((bar, i) => (
              <g key={i}>
                {/* Revenue bar (fuchsia) */}
                <rect
                  x={bar.xRevenue}
                  y={bar.yRevenue}
                  width={bar.barW}
                  height={bar.hRevenue}
                  fill="#c026d3"
                  rx="2.5"
                  opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.4}
                  className="transition-opacity duration-150"
                />
                {/* Cost bar (amber) */}
                <rect
                  x={bar.xCost}
                  y={bar.yCost}
                  width={bar.barW}
                  height={bar.hCost}
                  fill="#d97706"
                  rx="2.5"
                  opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.4}
                  className="transition-opacity duration-150"
                />
                {/* X axis label */}
                <text
                  x={bar.slotX + bar.slotW / 2}
                  y={ROI_HEIGHT - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--muted-foreground)"
                >
                  Wk {i + 1}
                </text>
                {/* Hit area */}
                <rect
                  x={bar.slotX}
                  y={ROI_PADDING.top}
                  width={bar.slotW}
                  height={ROI_HEIGHT - ROI_PADDING.top - ROI_PADDING.bottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${bar.data.period}: $${bar.data.incrementalRevenue.toLocaleString()} incremental revenue, $${bar.data.cost.toLocaleString()} cost, $${bar.data.netValue.toLocaleString()} net value`}
                />
              </g>
            ))}
          </svg>

          {hoveredBar && (
            <div
              className="absolute top-8 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl p-3 text-xs pointer-events-none z-30 min-w-48 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${Math.max(20, Math.min(80, ((hoveredBar.slotX + hoveredBar.slotW / 2) / ROI_WIDTH) * 100))}%`,
              }}
              role="tooltip"
            >
              <div className="font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-1.5 mb-2">
                {hoveredBar.data.period}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#c026d3]" /> Incremental revenue:
                  </span>
                  <strong className="text-[var(--foreground)] font-bold tabular-nums">
                    ${hoveredBar.data.incrementalRevenue.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d97706]" /> Program cost:
                  </span>
                  <span className="text-[var(--muted-foreground)] tabular-nums">
                    ${hoveredBar.data.cost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="border-t border-[var(--border)] mt-2 pt-1.5 text-[11px] flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Estimated net value:</span>
                <strong className="text-[#16a34a] tabular-nums font-bold">
                  +${hoveredBar.data.netValue.toLocaleString()}
                </strong>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th className="text-right">Incremental revenue</th>
                <th className="text-right">Program cost</th>
                <th className="text-right">Net value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.period}>
                  <td className="font-medium">{row.period}</td>
                  <td className="text-right tabular-nums text-[#c026d3] font-medium">
                    ${row.incrementalRevenue.toLocaleString()}
                  </td>
                  <td className="text-right tabular-nums text-[#d97706]">
                    -${row.cost.toLocaleString()}
                  </td>
                  <td className="text-right tabular-nums text-[#16a34a] font-bold">
                    +${row.netValue.toLocaleString()}
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
