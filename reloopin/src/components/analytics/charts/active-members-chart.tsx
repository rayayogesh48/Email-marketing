"use client";

import { useMemo, useState } from "react";
import { ActiveMemberDataPoint } from "@/lib/analytics-data";

const CHART_WIDTH = 640;
const CHART_HEIGHT = 260;
const CHART_PADDING = { top: 24, right: 20, bottom: 36, left: 45 };

export function ActiveMembersChart({
  dailyData,
  weeklyData,
  onSelectPoint,
}: {
  dailyData: ActiveMemberDataPoint[];
  weeklyData: ActiveMemberDataPoint[];
  onSelectPoint?: (point: ActiveMemberDataPoint) => void;
}) {
  const [interval, setInterval] = useState<"daily" | "weekly">("daily");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const data = interval === "daily" ? dailyData : weeklyData;

  const { maxVal, pointsCurrent, pointsPrevious, chartH } = useMemo(() => {
    let max = 0;
    data.forEach((d) => {
      if (d.current > max) max = d.current;
      if (d.previous > max) max = d.previous;
    });
    max = Math.ceil((max * 1.12) / 10) * 10 || 100;
    const min = 0;

    const w = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
    const h = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

    const ptsCurr = data.map((d, i) => {
      const x = CHART_PADDING.left + (i / Math.max(1, data.length - 1)) * w;
      const y = CHART_PADDING.top + h - ((d.current - min) / (max - min)) * h;
      return { x, y, data: d };
    });

    const ptsPrev = data.map((d, i) => {
      const x = CHART_PADDING.left + (i / Math.max(1, data.length - 1)) * w;
      const y = CHART_PADDING.top + h - ((d.previous - min) / (max - min)) * h;
      return { x, y, data: d };
    });

    return {
      maxVal: max,
      pointsCurrent: ptsCurr,
      pointsPrevious: ptsPrev,
      chartH: h,
      chartW: w,
    };
  }, [data]);

  const pathCurrent = useMemo(() => {
    if (!pointsCurrent.length) return "";
    return pointsCurrent.reduce(
      (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
      ""
    );
  }, [pointsCurrent]);

  const areaPathCurrent = useMemo(() => {
    if (!pointsCurrent.length) return "";
    const bottomY = CHART_PADDING.top + chartH;
    const firstX = pointsCurrent[0].x;
    const lastX = pointsCurrent[pointsCurrent.length - 1].x;
    return `${pathCurrent} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [pathCurrent, pointsCurrent, chartH]);

  const pathPrevious = useMemo(() => {
    if (!pointsPrevious.length) return "";
    return pointsPrevious.reduce(
      (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
      ""
    );
  }, [pointsPrevious]);

  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  const xLabels = useMemo(() => {
    if (interval === "weekly") {
      return data.map((d, i) => ({ label: `Wk ${i + 1}`, x: pointsCurrent[i]?.x || 0 }));
    }
    const step = Math.ceil(data.length / 5);
    return data
      .map((d, i) => ({ label: d.label, x: pointsCurrent[i]?.x || 0, idx: i }))
      .filter((_, i) => i % step === 0 || i === data.length - 1);
  }, [data, interval, pointsCurrent]);

  const hoveredPoint = hoverIndex !== null ? pointsCurrent[hoverIndex] : null;

  return (
    <div className="relative w-full">
      {/* Chart Top Controls & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 rounded-full bg-[var(--primary)] inline-block shadow-xs" />
            <span className="font-semibold text-[var(--foreground)]">Current period</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-b-2 border-dashed border-[var(--muted-foreground)] inline-block opacity-60" />
            <span className="text-[var(--muted-foreground)] font-medium">Previous period</span>
          </div>
        </div>

        <div className="inline-flex rounded-lg p-0.5 bg-[var(--muted)] border border-[var(--border)] text-xs shadow-2xs">
          <button
            type="button"
            className={`px-3 py-1 rounded-md transition-all ${
              interval === "daily"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setInterval("daily")}
          >
            Daily
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-md transition-all ${
              interval === "weekly"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            onClick={() => setInterval("weekly")}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto rounded-lg">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full h-auto select-none overflow-visible"
          role="img"
          aria-label="Active members trend chart"
        >
          <title>Active members trend</title>
          <desc>
            Line chart showing customer count across current and previous periods.
          </desc>

          <defs>
            <linearGradient id="activeMembersGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick) => {
            const y = CHART_PADDING.top + chartH - (tick / maxVal) * chartH;
            return (
              <g key={tick}>
                <line
                  x1={CHART_PADDING.left}
                  y1={y}
                  x2={CHART_WIDTH - CHART_PADDING.right}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray={tick === 0 ? "none" : "3 3"}
                  strokeWidth="1"
                />
                <text
                  x={CHART_PADDING.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="inherit"
                  fill="var(--muted-foreground)"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Area fill under current period */}
          <path d={areaPathCurrent} fill="url(#activeMembersGradient)" />

          {/* Previous period line (dashed) */}
          <path
            d={pathPrevious}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.55"
          />

          {/* Current period line (primary) */}
          <path
            d={pathCurrent}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X Axis labels */}
          {xLabels.map((lbl, idx) => (
            <text
              key={idx}
              x={lbl.x}
              y={CHART_HEIGHT - 10}
              textAnchor="middle"
              fontSize="10"
              fontFamily="inherit"
              fill="var(--muted-foreground)"
            >
              {lbl.label}
            </text>
          ))}

          {/* Vertical hover crosshair line */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={CHART_PADDING.top}
              x2={hoveredPoint.x}
              y2={CHART_PADDING.top + chartH}
              stroke="var(--primary)"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />
          )}

          {/* Interactive points */}
          {pointsCurrent.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? "6" : "3"}
                fill={hoverIndex === i ? "var(--primary)" : "var(--card)"}
                stroke="var(--primary)"
                strokeWidth={hoverIndex === i ? "2.5" : "2"}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectPoint?.(pt.data)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                tabIndex={0}
                role="button"
                aria-label={`${pt.data.label}: ${pt.data.current} active members. Click for details.`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectPoint?.(pt.data);
                  }
                }}
              />
              {/* Invisible hit-target */}
              <rect
                x={pt.x - 12}
                y={CHART_PADDING.top}
                width="24"
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() => onSelectPoint?.(pt.data)}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Hover Tooltip Card */}
      {hoveredPoint && (
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl p-3 text-xs pointer-events-none z-30 min-w-48 animate-in fade-in zoom-in-95 duration-100"
          role="tooltip"
        >
          <div className="font-bold text-xs text-[var(--foreground)] border-b border-[var(--border)] pb-1.5 mb-2 flex items-center justify-between">
            <span>{hoveredPoint.data.label}</span>
            <span className="text-[10px] font-normal text-[var(--muted-foreground)]">Click to drill down</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center py-0.5">
              <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" /> Current:
              </span>
              <strong className="text-[var(--foreground)] font-bold tabular-nums">
                {hoveredPoint.data.current} members
              </strong>
            </div>
            <div className="flex justify-between items-center py-0.5">
              <span className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] opacity-50" /> Previous:
              </span>
              <span className="text-[var(--muted-foreground)] tabular-nums">
                {hoveredPoint.data.previous} members
              </span>
            </div>
          </div>
          <div className="border-t border-[var(--border)] mt-2 pt-1.5 text-[10px] text-[var(--muted-foreground)] flex justify-between">
            <span>New: +{hoveredPoint.data.newMembers}</span>
            <span>Returning: {hoveredPoint.data.returningMembers}</span>
            <span>Orders: {hoveredPoint.data.orders}</span>
          </div>
        </div>
      )}
    </div>
  );
}
