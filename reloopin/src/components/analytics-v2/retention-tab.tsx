'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  TrendingUp,
  Clock,
  UserCheck,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  RETENTION_KPIS,
  SECOND_ORDER_CURVE,
  MEMBER_HEALTH_DATA,
  RETENTION_COHORT,
} from '@/lib/mock-data/analytics-v2';

interface RetentionTabProps {
  onOpenCalculationInfo: () => void;
}

export function RetentionTab({ onOpenCalculationInfo }: RetentionTabProps) {
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);
  const [hoveredCohortCell, setHoveredCohortCell] = useState<{ row: number; col: string } | null>(null);

  // SVG Chart Dimensions for Cumulative Second-Order Curve
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 44;
  const paddingY = 24;

  const maxVal = 100; // Percentage 0 - 100%
  const minVal = 0;
  const maxDays = 90;

  const getCoordinates = (days: number, rate: number) => {
    const x = paddingX + (days / maxDays) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((rate - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const memberPoints = SECOND_ORDER_CURVE.map((d) => getCoordinates(d.days, d.memberRate));
  const nonMemberPoints = SECOND_ORDER_CURVE.map((d) => getCoordinates(d.days, d.nonMemberRate));

  const memberPath = memberPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const nonMemberPath = nonMemberPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  // Highlight day 21 (where memberRate is 50%)
  const day21Coord = getCoordinates(21, 50);

  // Heatmap color helper
  const getCohortBg = (val: number | null) => {
    if (val === null) return 'bg-zinc-50 text-zinc-300';
    if (val >= 90) return 'bg-[#5f3ed8] text-white font-semibold';
    if (val >= 65) return 'bg-[#7c5ce9] text-white font-medium';
    if (val >= 50) return 'bg-[#a38cf4] text-white font-medium';
    if (val >= 40) return 'bg-[#d8d0fb] text-[#2c1d68] font-medium';
    return 'bg-[#ede9fe] text-[#3c2a8f] font-normal';
  };

  const kpiIcons = [
    <TrendingUp key="1" className="size-4 text-emerald-600" />,
    <Clock key="2" className="size-4 text-[#5f3ed8]" />,
    <UserCheck key="3" className="size-4 text-blue-600" />,
    <AlertTriangle key="4" className="size-4 text-amber-600" />,
  ];

  return (
    <div className="space-y-6">
      {/* 1. Retention KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {RETENTION_KPIS.map((kpi, idx) => {
          const isWarning = idx === 3;
          return (
            <div
              key={kpi.label}
              className={`p-4 rounded-xl border bg-white shadow-2xs space-y-2 transition-all ${
                isWarning ? 'border-amber-200 bg-amber-50/20' : 'border-[#ebebeb] hover:border-zinc-300'
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
                    isWarning ? 'text-amber-700' : 'text-emerald-700'
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

      {/* 2. Second-Order Cumulative Curve Chart */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#0a0a0a]">
                Customers placing a second order
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
              Cumulative repurchase rate over days elapsed following initial purchase
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#5f3ed8]" />
              <span className="font-medium text-[#0a0a0a]">Loyalty members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#a1a1aa]" />
              <span className="text-[#71717a]">Non-members</span>
            </div>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative pt-2 pb-1">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 overflow-visible"
            preserveAspectRatio="none"
          >
            {/* Minimal Horizontal Gridlines */}
            {[0, 25, 50, 75, 100].map((tick) => {
              const y = chartHeight - paddingY - (tick / 100) * (chartHeight - paddingY * 2);
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
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="#a1a1aa"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Non-Member Line */}
            <path
              d={nonMemberPath}
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Loyalty Member Line */}
            <path
              d={memberPath}
              fill="none"
              stroke="#5f3ed8"
              strokeWidth="2.5"
            />

            {/* Day 21 Benchmark Marker & Annotation */}
            <line
              x1={day21Coord.x}
              y1={chartHeight - paddingY}
              x2={day21Coord.x}
              y2={day21Coord.y}
              stroke="#5f3ed8"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <circle
              cx={day21Coord.x}
              cy={day21Coord.y}
              r="4.5"
              fill="#5f3ed8"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Day 21 Annotation Label */}
            <g transform={`translate(${day21Coord.x + 8}, ${day21Coord.y - 12})`}>
              <rect
                x="0"
                y="-18"
                width="186"
                height="24"
                rx="6"
                fill="#ffffff"
                stroke="#5f3ed8"
                strokeWidth="1"
                className="shadow-xs"
              />
              <text x="8" y="-3" fontSize="10.5" fontWeight="600" fill="#5f3ed8">
                50% order again by day 21
              </text>
            </g>

            {/* Data points & hover triggers */}
            {SECOND_ORDER_CURVE.map((pt, i) => {
              const mCoord = memberPoints[i];
              const isHovered = hoveredDayIdx === i;

              return (
                <g key={pt.days}>
                  {/* Invisible hover trigger */}
                  <rect
                    x={mCoord.x - 18}
                    y={paddingY}
                    width={36}
                    height={chartHeight - paddingY * 2}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDayIdx(i)}
                    onMouseLeave={() => setHoveredDayIdx(null)}
                  />

                  {/* Circle dot on member line */}
                  <circle
                    cx={mCoord.x}
                    cy={mCoord.y}
                    r={isHovered ? 5 : 3.5}
                    fill={isHovered ? '#5034b8' : '#5f3ed8'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all"
                  />

                  {/* Day label below axis */}
                  <text
                    x={mCoord.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    fontSize="10"
                    fill={isHovered ? '#0a0a0a' : '#71717a'}
                    fontWeight={isHovered ? '600' : '400'}
                  >
                    Day {pt.days}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredDayIdx !== null && (
            <div
              className="absolute pointer-events-none bg-[#0a0a0a] text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 space-y-1"
              style={{
                left: `${(memberPoints[hoveredDayIdx].x / chartWidth) * 100}%`,
                top: `${memberPoints[hoveredDayIdx].y - 30}px`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="font-semibold text-zinc-200">
                Day {SECOND_ORDER_CURVE[hoveredDayIdx].days} after 1st order
              </div>
              <div className="flex items-center justify-between gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <span className="size-2 rounded-full bg-[#5f3ed8]" />
                  Members:
                </span>
                <span className="font-bold text-white">
                  {SECOND_ORDER_CURVE[hoveredDayIdx].memberRate}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="size-2 rounded-full bg-zinc-400" />
                  Non-members:
                </span>
                <span className="font-medium text-zinc-300">
                  {SECOND_ORDER_CURVE[hoveredDayIdx].nonMemberRate}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Takeaway footer */}
        <div className="pt-3 border-t border-[#f4f4f5] flex items-center justify-between text-xs text-[#71717a]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#0a0a0a]">Key takeaway:</span>
            <span>
              Loyalty members reach a 50% repeat purchase threshold in 21 days, compared to 90+ days for non-members.
            </span>
          </div>
          <span className="text-[11px] text-[#a1a1aa] shrink-0">Sample: 3,641 accounts</span>
        </div>
      </div>

      {/* 3. Member Health Breakdown (Single Stacked Bar) */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-[#0a0a0a]">Member health</h3>
            <p className="text-xs text-[#71717a] mt-0.5">
              Distribution of all 432 active enrolled members by days since last order
            </p>
          </div>
          <span className="text-xs font-semibold text-[#0a0a0a] bg-zinc-100 px-2.5 py-1 rounded-md">
            Total: {MEMBER_HEALTH_DATA.total} members
          </span>
        </div>

        {/* Single Stacked Horizontal Bar */}
        <div className="h-7 w-full rounded-lg overflow-hidden flex shadow-2xs p-0.5 bg-zinc-100 gap-0.5">
          {MEMBER_HEALTH_DATA.segments.map((seg) => (
            <div
              key={seg.label}
              style={{ width: `${seg.percentage}%` }}
              className={`h-full ${seg.color} first:rounded-l-[6px] last:rounded-r-[6px] transition-all relative group flex items-center justify-center`}
              title={`${seg.label}: ${seg.count} (${seg.percentage}%)`}
            >
              {seg.percentage >= 15 && (
                <span className="text-[11px] font-semibold text-white drop-shadow-xs">
                  {seg.percentage}%
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Detailed segment breakdown cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {MEMBER_HEALTH_DATA.segments.map((seg) => (
            <div
              key={seg.label}
              className="p-3 rounded-lg border border-[#f4f4f5] bg-zinc-50/50 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`size-2.5 rounded-full ${seg.color}`} />
                  <span className="text-xs font-medium text-[#0a0a0a]">{seg.label}</span>
                </div>
                <span className="text-xs font-bold text-[#0a0a0a]">{seg.count}</span>
              </div>
              <p className="text-[11px] text-[#71717a]">{seg.desc}</p>
              <div className="text-[10px] font-medium text-[#a1a1aa] pt-0.5">
                {seg.percentage}% of member base
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Retention Cohort Heatmap */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Retention cohort</h3>
              <span className="text-[11px] font-medium bg-[#f8f7ff] text-[#5f3ed8] px-2 py-0.5 rounded-md border border-[#e5e1fc]">
                Monthly repeat rate
              </span>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Percentage of monthly joiners returning to purchase in subsequent months
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#71717a]">
            <span>Low</span>
            <div className="flex gap-0.5">
              <span className="size-3 rounded-xs bg-[#ede9fe]" />
              <span className="size-3 rounded-xs bg-[#d8d0fb]" />
              <span className="size-3 rounded-xs bg-[#a38cf4]" />
              <span className="size-3 rounded-xs bg-[#7c5ce9]" />
              <span className="size-3 rounded-xs bg-[#5f3ed8]" />
            </div>
            <span>High (100%)</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto border border-[#ebebeb] rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-[#ebebeb] text-[#71717a] font-medium">
                <th className="py-2.5 px-3">Join Cohort</th>
                <th className="py-2.5 px-3 text-right">Cohort Size</th>
                <th className="py-2.5 px-3 text-center">Month 0</th>
                <th className="py-2.5 px-3 text-center">Month 1</th>
                <th className="py-2.5 px-3 text-center">Month 2</th>
                <th className="py-2.5 px-3 text-center">Month 3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f5]">
              {RETENTION_COHORT.map((row, rIdx) => (
                <tr key={row.cohort} className="hover:bg-zinc-50/50">
                  <td className="py-2.5 px-3 font-medium text-[#0a0a0a]">{row.cohort}</td>
                  <td className="py-2.5 px-3 text-right text-[#71717a] font-mono text-[11px]">
                    {row.size}
                  </td>

                  {/* Month 0 */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block w-16 py-1 rounded text-center text-xs ${getCohortBg(
                        row.m0
                      )}`}
                    >
                      {row.m0}%
                    </span>
                  </td>

                  {/* Month 1 */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block w-16 py-1 rounded text-center text-xs ${getCohortBg(
                        row.m1
                      )}`}
                    >
                      {row.m1}%
                    </span>
                  </td>

                  {/* Month 2 */}
                  <td className="py-2.5 px-3 text-center">
                    {row.m2 !== null ? (
                      <span
                        className={`inline-block w-16 py-1 rounded text-center text-xs ${getCohortBg(
                          row.m2
                        )}`}
                      >
                        {row.m2}%
                      </span>
                    ) : (
                      <span className="text-[#a1a1aa] font-mono text-[11px]">—</span>
                    )}
                  </td>

                  {/* Month 3 */}
                  <td className="py-2.5 px-3 text-center">
                    {row.m3 !== null ? (
                      <span
                        className={`inline-block w-16 py-1 rounded text-center text-xs ${getCohortBg(
                          row.m3
                        )}`}
                      >
                        {row.m3}%
                      </span>
                    ) : (
                      <span className="text-[#a1a1aa] font-mono text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cohort Footnote & Explainer */}
        <div className="flex items-start gap-2 p-3 bg-zinc-50 rounded-lg text-xs text-[#71717a] border border-[#f4f4f5]">
          <Info className="size-4 text-[#5f3ed8] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-[#0a0a0a]">Understanding cohort retention:</span>
            <p>
              Each row follows a monthly signup group. For instance, out of 148 customers who joined in May 2026, 54% returned in Month 1, and 39% remained active in Month 3. Recent cohorts (Aug & Sep) show higher Month 1 retention (+13% improvement) following the introduction of the 15% VIP welcome voucher.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
