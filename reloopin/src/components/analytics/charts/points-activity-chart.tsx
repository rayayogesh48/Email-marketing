"use client";

import { useMemo, useState } from "react";
import { PointsActivityDataPoint } from "@/lib/analytics-data";
import { BarChart3, Table as TableIcon } from "lucide-react";

const POINTS_WIDTH = 640;
const POINTS_HEIGHT = 260;
const POINTS_PADDING = { top: 20, right: 20, bottom: 40, left: 55 };

export function PointsActivityChart({
  data,
}: {
  data: PointsActivityDataPoint[];
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const { maxVal, bars } = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      if (d.earned > max) max = d.earned;
      if (d.redeemed > max) max = d.redeemed;
    });
    max = Math.ceil((max * 1.1) / 1000) * 1000 || 10000;

    const chartW = POINTS_WIDTH - POINTS_PADDING.left - POINTS_PADDING.right;
    const chartH = POINTS_HEIGHT - POINTS_PADDING.top - POINTS_PADDING.bottom;
    const slotW = chartW / data.length;
    const barW = Math.max(3, Math.min(8, (slotW - 4) / 2));

    const computed = data.map((d, i) => {
      const slotX = POINTS_PADDING.left + i * slotW;
      const xEarned = slotX + (slotW / 2) - barW - 1;
      const xRedeemed = slotX + (slotW / 2) + 1;

      const hEarned = (d.earned / max) * chartH;
      const hRedeemed = (d.redeemed / max) * chartH;

      const yEarned = POINTS_PADDING.top + chartH - hEarned;
      const yRedeemed = POINTS_PADDING.top + chartH - hRedeemed;

      return {
        data: d,
        slotX,
        slotW,
        xEarned,
        yEarned,
        hEarned,
        xRedeemed,
        yRedeemed,
        hRedeemed,
        barW,
      };
    });

    return { maxVal: max, bars: computed };
  }, [data]);

  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  // X axis labels sampled
  const step = Math.ceil(data.length / 5);
  const xLabels = data
    .map((d, i) => ({ label: d.label, x: bars[i]?.slotX + (bars[i]?.slotW / 2) || 0, idx: i }))
    .filter((_, i) => i % step === 0 || i === data.length - 1);

  const hoveredBar = hoverIndex !== null ? bars[hoverIndex] : null;

  return (
    <div className="w-full">
      {/* Header controls: Legend + View Toggle */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] inline-block shadow-2xs" />
            <span className="font-semibold text-[var(--foreground)]">Points earned</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c026d3] inline-block shadow-2xs" />
            <span className="font-semibold text-[var(--foreground)]">Points redeemed</span>
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
            aria-label="View points activity as chart"
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
            aria-label="View points activity as table"
          >
            <TableIcon size={13} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${POINTS_WIDTH} ${POINTS_HEIGHT}`}
            className="w-full h-auto select-none"
            role="img"
            aria-label="Points earned and redeemed grouped column chart"
          >
            <title>Points activity</title>
            <desc>Grouped bar chart comparing points earned (green) and points redeemed (fuchsia).</desc>

            {/* Grid lines */}
            {yTicks.map((tick) => {
              const chartH = POINTS_HEIGHT - POINTS_PADDING.top - POINTS_PADDING.bottom;
              const y = POINTS_PADDING.top + chartH - (tick / maxVal) * chartH;
              return (
                <g key={tick}>
                  <line
                    x1={POINTS_PADDING.left}
                    y1={y}
                    x2={POINTS_WIDTH - POINTS_PADDING.right}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray={tick === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={POINTS_PADDING.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="var(--muted-foreground)"
                  >
                    {tick.toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {bars.map((bar, i) => (
              <g key={i}>
                {/* Earned bar (green) */}
                <rect
                  x={bar.xEarned}
                  y={bar.yEarned}
                  width={bar.barW}
                  height={bar.hEarned}
                  fill="#16a34a"
                  rx="2"
                  opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.4}
                  className="transition-opacity duration-150"
                />
                {/* Redeemed bar (fuchsia) */}
                <rect
                  x={bar.xRedeemed}
                  y={bar.yRedeemed}
                  width={bar.barW}
                  height={bar.hRedeemed}
                  fill="#c026d3"
                  rx="2"
                  opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.4}
                  className="transition-opacity duration-150"
                />
                {/* Hover hit area */}
                <rect
                  x={bar.slotX}
                  y={POINTS_PADDING.top}
                  width={bar.slotW}
                  height={POINTS_HEIGHT - POINTS_PADDING.top - POINTS_PADDING.bottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${bar.data.label}: ${bar.data.earned.toLocaleString()} earned, ${bar.data.redeemed.toLocaleString()} redeemed`}
                />
              </g>
            ))}

            {/* X Axis Labels */}
            {xLabels.map((lbl, idx) => (
              <text
                key={idx}
                x={lbl.x}
                y={POINTS_HEIGHT - 12}
                textAnchor="middle"
                fontSize="10"
                fill="var(--muted-foreground)"
              >
                {lbl.label}
              </text>
            ))}
          </svg>

          {/* Tooltip */}
          {hoveredBar && (
            <div
              className="absolute top-8 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl p-3 text-xs pointer-events-none z-30 min-w-48 -translate-x-1/2 animate-in fade-in zoom-in-95 duration-100"
              style={{
                left: `${Math.max(20, Math.min(80, ((hoveredBar.slotX + hoveredBar.slotW / 2) / POINTS_WIDTH) * 100))}%`,
              }}
              role="tooltip"
            >
              <div className="font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-1.5 mb-2">
                {hoveredBar.data.label}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center py-0.5">
                  <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a]" /> Points earned:
                  </span>
                  <strong className="text-[var(--foreground)] font-bold tabular-nums">
                    +{hoveredBar.data.earned.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                    <span className="w-2 h-2 rounded-full bg-[#c026d3]" /> Points redeemed:
                  </span>
                  <strong className="text-[var(--foreground)] font-bold tabular-nums">
                    -{hoveredBar.data.redeemed.toLocaleString()}
                  </strong>
                </div>
              </div>
              <div className="border-t border-[var(--border)] mt-2 pt-1.5 text-[11px] flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Net point change:</span>
                <span
                  className={`font-bold tabular-nums ${
                    hoveredBar.data.netChange >= 0 ? "text-[#16a34a]" : "text-[#dc2626]"
                  }`}
                >
                  {hoveredBar.data.netChange >= 0 ? "+" : ""}
                  {hoveredBar.data.netChange.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Accessible Table View */
        <div className="table-container max-h-72 overflow-y-auto">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th className="text-right">Points earned</th>
                <th className="text-right">Points redeemed</th>
                <th className="text-right">Net change</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.date}>
                  <td className="font-medium">{row.label}</td>
                  <td className="text-right tabular-nums text-[#16a34a]">
                    +{row.earned.toLocaleString()}
                  </td>
                  <td className="text-right tabular-nums text-[#c026d3]">
                    -{row.redeemed.toLocaleString()}
                  </td>
                  <td className="text-right tabular-nums font-medium">
                    {row.netChange >= 0 ? "+" : ""}
                    {row.netChange.toLocaleString()}
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
