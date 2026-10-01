'use client';

import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  Flame,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import {
  POINTS_KPIS,
  POINTS_MOVEMENT,
  POINTS_DISTRIBUTION,
  OUTSTANDING_TREND,
  EXPIRATION_SUMMARIES,
  EARNING_SOURCES,
} from '@/lib/mock-data/analytics-v2';

interface PointsTabProps {
  onOpenCalculationInfo: () => void;
}

export function PointsTab({ onOpenCalculationInfo }: PointsTabProps) {
  const [hoveredMovementIdx, setHoveredMovementIdx] = useState<number | null>(null);

  // SVG Chart Dimensions for Points Movement (Gap Chart)
  const chartHeight = 220;
  const chartWidth = 660;
  const paddingX = 40;
  const paddingY = 24;

  const maxPointsVal = 500; // in thousands (500k)
  const minPointsVal = 150;

  const getCoord = (index: number, val: number) => {
    const x = paddingX + (index / (POINTS_MOVEMENT.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      ((val - minPointsVal) / (maxPointsVal - minPointsVal)) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const earnedPoints = POINTS_MOVEMENT.map((d, i) => getCoord(i, d.earned));
  const redeemedPoints = POINTS_MOVEMENT.map((d, i) => getCoord(i, d.redeemed));

  const earnedPath = earnedPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const redeemedPath = redeemedPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  // Shaded area between earned and redeemed lines
  const reverseRedeemed = [...redeemedPoints].reverse();
  const gapAreaPath = `${earnedPath} L ${reverseRedeemed[0].x} ${reverseRedeemed[0].y} ` +
    reverseRedeemed.slice(1).reduce((acc, pt) => `${acc} L ${pt.x} ${pt.y}`, '') + ' Z';

  // SVG for Outstanding Value Trend
  const outChartWidth = 560;
  const outChartHeight = 160;
  const maxOutVal = 36000;
  const minOutVal = 20000;

  const getOutCoord = (index: number, val: number) => {
    const x = 30 + (index / (OUTSTANDING_TREND.length - 1)) * (outChartWidth - 60);
    const y =
      outChartHeight -
      20 -
      ((val - minOutVal) / (maxOutVal - minOutVal)) * (outChartHeight - 40);
    return { x, y };
  };

  const outPoints = OUTSTANDING_TREND.map((d, i) => getOutCoord(i, d.value));
  const outPath = outPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const outArea = `${outPath} L ${outPoints[outPoints.length - 1].x} ${outChartHeight - 20} L ${outPoints[0].x} ${outChartHeight - 20} Z`;

  const kpiIcons = [
    <Coins key="1" className="size-4 text-[#5f3ed8]" />,
    <TrendingUp key="2" className="size-4 text-emerald-600" />,
    <Flame key="3" className="size-4 text-zinc-500" />,
    <AlertTriangle key="4" className="size-4 text-amber-600" />,
  ];

  return (
    <div className="space-y-6">
      {/* 1. Points KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {POINTS_KPIS.map((kpi, idx) => {
          const isRisk = idx === 3;
          return (
            <div
              key={kpi.label}
              className={`p-4 rounded-xl border bg-white shadow-2xs space-y-2 transition-all ${
                isRisk ? 'border-amber-200 bg-amber-50/20' : 'border-[#ebebeb] hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#71717a]">{kpi.label}</span>
                {kpiIcons[idx]}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[#0a0a0a]">{kpi.value}</span>
                <span
                  className={`text-xs font-medium ${
                    isRisk ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {kpi.trend}
                </span>
              </div>

              <p className="text-[11px] text-[#71717a] truncate">{kpi.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* 2. Points Movement: Earned vs Redeemed (Two-line chart with shaded gap) */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#0a0a0a]">
                Points earned and redeemed
              </h3>
              <button
                type="button"
                onClick={onOpenCalculationInfo}
                className="text-[#a1a1aa] hover:text-[#71717a] transition-colors"
                title="View metric details"
              >
                <HelpCircle className="size-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Net balance liability gap between issued loyalty points and claimed rewards
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#5f3ed8]" />
              <span className="font-medium text-[#0a0a0a]">Points earned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-600" />
              <span className="font-medium text-[#0a0a0a]">Points redeemed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#5f3ed8]/15 border border-[#5f3ed8]/30" />
              <span className="text-[#71717a]">Net liability gap</span>
            </div>
          </div>
        </div>

        {/* SVG Gap Chart */}
        <div className="relative pt-2 pb-1">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Horizontal Gridlines */}
            {[200, 300, 400, 500].map((tick) => {
              const y =
                chartHeight -
                paddingY -
                ((tick - minPointsVal) / (maxPointsVal - minPointsVal)) * (chartHeight - paddingY * 2);
              return (
                <g key={tick}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#f4f4f5"
                    strokeWidth="1"
                  />
                  <text x={paddingX - 10} y={y + 3} textAnchor="end" fontSize="10" fill="#a1a1aa">
                    {tick}k
                  </text>
                </g>
              );
            })}

            {/* Shaded Gap Area */}
            <path d={gapAreaPath} fill="rgba(95, 62, 216, 0.08)" />

            {/* Redeemed Line (Green) */}
            <path d={redeemedPath} fill="none" stroke="#059669" strokeWidth="2.5" />

            {/* Earned Line (Purple Brand) */}
            <path d={earnedPath} fill="none" stroke="#5f3ed8" strokeWidth="2.5" />

            {/* Hover Vertical Guide & Points */}
            {POINTS_MOVEMENT.map((pt, i) => {
              const eCoord = earnedPoints[i];
              const rCoord = redeemedPoints[i];
              const isHovered = hoveredMovementIdx === i;

              return (
                <g key={pt.month}>
                  {/* Invisible Hit Area */}
                  <rect
                    x={eCoord.x - 20}
                    y={paddingY}
                    width={40}
                    height={chartHeight - paddingY * 2}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredMovementIdx(i)}
                    onMouseLeave={() => setHoveredMovementIdx(null)}
                  />

                  {/* Vertical Guide Line */}
                  {isHovered && (
                    <line
                      x1={eCoord.x}
                      y1={paddingY}
                      x2={eCoord.x}
                      y2={chartHeight - paddingY}
                      stroke="#a1a1aa"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Dots */}
                  <circle
                    cx={eCoord.x}
                    cy={eCoord.y}
                    r={isHovered ? 4.5 : 3}
                    fill="#5f3ed8"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={rCoord.x}
                    cy={rCoord.y}
                    r={isHovered ? 4.5 : 3}
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Month Label */}
                  <text
                    x={eCoord.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isHovered ? '#0a0a0a' : '#71717a'}
                    fontWeight={isHovered ? '600' : '400'}
                  >
                    {pt.month}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip on Hover */}
          {hoveredMovementIdx !== null && (
            <div
              className="absolute pointer-events-none bg-[#0a0a0a] text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 space-y-1"
              style={{
                left: `${(earnedPoints[hoveredMovementIdx].x / chartWidth) * 100}%`,
                top: `${earnedPoints[hoveredMovementIdx].y - 20}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="font-semibold text-zinc-200">
                {POINTS_MOVEMENT[hoveredMovementIdx].month} 2026
              </div>
              <div className="flex items-center justify-between gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-[#5f3ed8]" />
                  Earned:
                </span>
                <span className="font-bold text-white">
                  {POINTS_MOVEMENT[hoveredMovementIdx].earned}k pts
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Redeemed:
                </span>
                <span className="font-bold text-white">
                  {POINTS_MOVEMENT[hoveredMovementIdx].redeemed}k pts
                </span>
              </div>
              <div className="pt-1 border-t border-zinc-800 flex items-center justify-between gap-4 text-[10px] text-amber-400">
                <span>Net unredeemed:</span>
                <span>+{POINTS_MOVEMENT[hoveredMovementIdx].gap}k pts</span>
              </div>
            </div>
          )}
        </div>

        {/* Takeaway footer */}
        <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between text-xs text-[#71717a]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#0a0a0a]">Takeaway:</span>
            <span>
              Customers earned points faster than they redeemed them, increasing outstanding point value by +$12,620 this period.
            </span>
          </div>
          <span className="text-[11px] text-[#a1a1aa] shrink-0">Current ratio: 1.53 : 1</span>
        </div>
      </div>

      {/* 3. Points Distribution & Outstanding Trend (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Points Distribution (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Points distribution</h3>
              <p className="text-xs text-[#71717a] mt-0.5">
                Customer concentration across balance brackets
              </p>
            </div>
          </div>

          {/* Distribution Bars */}
          <div className="space-y-3 pt-1">
            {POINTS_DISTRIBUTION.map((item) => (
              <div key={item.range} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0a0a0a]">{item.range}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#71717a] font-mono text-[11px]">
                      {item.customers} customers
                    </span>
                    <span className="font-bold text-[#0a0a0a]">{item.dollarValue}</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5f3ed8] rounded-full transition-all"
                    style={{ width: `${item.share * 2}%` }}
                  />
                </div>

                <div className="flex justify-end text-[10px] text-[#71717a]">
                  {item.share}% of total points pool
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Note */}
          <div className="p-3 bg-[#f8f7ff] border border-[#e5e1fc] rounded-lg text-xs flex items-center justify-between">
            <span className="text-[#5f3ed8] font-semibold">
              316 customers hold 70% of outstanding points.
            </span>
            <span className="text-[11px] text-[#71717a]">High redemption readiness</span>
          </div>
        </div>

        {/* Outstanding Value Trend & Expiration (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Outstanding point value</h3>
              <p className="text-xs text-[#71717a] mt-0.5">Store liability growth over time</p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
              $32,400 Liability
            </span>
          </div>

          {/* SVG Area Chart */}
          <div className="pt-1">
            <svg
              viewBox={`0 0 ${outChartWidth} ${outChartHeight}`}
              className="w-full h-32 overflow-visible"
            >
              {/* Minimal horizontal line */}
              <line
                x1={30}
                y1={outChartHeight - 20}
                x2={outChartWidth - 30}
                y2={outChartHeight - 20}
                stroke="#e4e4e7"
                strokeWidth="1"
              />

              {/* Area gradient */}
              <defs>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path d={outArea} fill="url(#outGrad)" />
              <path d={outPath} fill="none" stroke="#d97706" strokeWidth="2.5" />

              {/* Dots & Labels */}
              {OUTSTANDING_TREND.map((d, i) => {
                const coord = outPoints[i];
                return (
                  <g key={d.date}>
                    <circle cx={coord.x} cy={coord.y} r="3.5" fill="#d97706" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={coord.x}
                      y={outChartHeight - 6}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill="#71717a"
                    >
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Expiration Summaries */}
          <div className="pt-2 border-t border-[#f4f4f5] space-y-2">
            <div className="text-xs font-medium text-[#0a0a0a] flex items-center gap-1.5">
              <Clock className="size-3.5 text-[#71717a]" /> Upcoming points expiration:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {EXPIRATION_SUMMARIES.map((exp) => (
                <div key={exp.label} className="p-2 rounded-lg bg-zinc-50 border border-[#ebebeb] text-center">
                  <div className="text-[10px] text-[#71717a]">{exp.label}</div>
                  <div className="text-xs font-bold text-[#0a0a0a] mt-0.5">{exp.value}</div>
                  <div className="text-[9px] text-[#a1a1aa] font-mono">{exp.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Earning Sources */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-[#0a0a0a]">Earning sources</h3>
            <p className="text-xs text-[#71717a] mt-0.5">
              Distribution of loyalty points awarded across program activities
            </p>
          </div>
          <span className="text-xs text-[#71717a]">Total issued: 1.85M points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {EARNING_SOURCES.map((source) => (
            <div
              key={source.source}
              className="p-3.5 rounded-lg border border-[#ebebeb] bg-[#fafafa] space-y-2 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0a0a0a]">{source.source}</span>
                <span className="text-xs font-bold text-[#5f3ed8]">{source.points}</span>
              </div>

              <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5f3ed8] rounded-full"
                  style={{ width: `${source.pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#71717a]">
                <span>{source.pct}% of all points</span>
                <span className="font-mono text-[#0a0a0a] font-medium">{source.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

