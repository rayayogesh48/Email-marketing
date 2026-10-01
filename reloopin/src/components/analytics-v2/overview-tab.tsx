'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  OVERVIEW_KPIS,
  PROGRAM_PERFORMANCE_TREND,
  MEMBERS_VS_NON_MEMBERS,
} from '@/lib/mock-data/analytics-v2';
import { toast } from 'sonner';

interface OverviewTabProps {
  onOpenCalculationInfo: () => void;
  onNavigateToTab: (tab: 'retention' | 'members' | 'points' | 'rewards') => void;
}

export function OverviewTab({
  onOpenCalculationInfo,
  onNavigateToTab,
}: OverviewTabProps) {
  const [metricTab, setMetricTab] = useState<'revenue' | 'orders' | 'rewards'>('revenue');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG Chart Dimensions
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 24;

  const dataValues = PROGRAM_PERFORMANCE_TREND.map((d) => {
    if (metricTab === 'revenue') return { current: d.revenueCurrent, prev: d.revenuePrevious };
    if (metricTab === 'orders') return { current: d.ordersCurrent, prev: d.ordersPrevious };
    return { current: d.rewardsCurrent, prev: d.rewardsPrevious };
  });

  const maxVal = Math.max(...dataValues.map((d) => Math.max(d.current, d.prev))) * 1.15;
  const minVal = 0;

  const getCoordinates = (index: number, val: number) => {
    const x = paddingX + (index / (PROGRAM_PERFORMANCE_TREND.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const currentPoints = dataValues.map((d, i) => getCoordinates(i, d.current));
  const prevPoints = dataValues.map((d, i) => getCoordinates(i, d.prev));

  const currentPath = currentPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const prevPath = prevPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  const areaPath = `${currentPath} L ${currentPoints[currentPoints.length - 1].x} ${chartHeight - paddingY} L ${currentPoints[0].x} ${chartHeight - paddingY} Z`;

  const formatMetricVal = (num: number) => {
    if (metricTab === 'revenue') return `$${num.toLocaleString()}`;
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary Panel */}
      <div className="p-4 bg-[#f8f7ff] border border-[#e5e1fc] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#5f3ed8] text-white">
              <Sparkles className="size-3" />
              Executive summary
            </span>
            <span className="font-bold text-sm text-[#0a0a0a]">
              Your loyalty program is driving repeat revenue
            </span>
          </div>
          <p className="text-xs text-[#52525b] leading-relaxed max-w-3xl">
            12% of customers generated 38% of store revenue. Members ordered more frequently, but outstanding point value increased this period.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCalculationInfo}
          className="text-xs font-medium text-[#5f3ed8] hover:text-[#5034b8] underline underline-offset-2 shrink-0 self-start md:self-center"
        >
          How this is calculated
        </button>
      </div>

      {/* 2. Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_KPIS.map((kpi) => (
          <div
            key={kpi.id}
            className={`p-4 rounded-xl border bg-white shadow-2xs space-y-2 transition-all ${
              kpi.isRisk
                ? 'border-amber-200 bg-amber-50/20'
                : 'border-[#ebebeb] hover:border-zinc-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#71717a]">
                {kpi.label}
              </span>
              <div title={kpi.tooltip} className="cursor-help text-[#a1a1aa] hover:text-[#71717a]">
                <HelpCircle className="size-3.5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-bold tracking-tight ${kpi.isRisk ? 'text-amber-900' : 'text-[#0a0a0a]'}`}>
                {kpi.value}
              </span>
              <span
                className={`inline-flex items-center text-[11px] font-semibold ${
                  kpi.isRisk
                    ? 'text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded'
                    : 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded'
                }`}
              >
                {kpi.change}
              </span>
            </div>

            <p className="text-[11px] text-[#71717a] truncate">
              {kpi.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Performance Trend (Large Chart) */}
      <div className="p-6 bg-white border border-[#ebebeb] rounded-xl shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#0a0a0a]">
              Program performance
            </h3>
            <p className="text-xs text-[#71717a]">
              Track cumulative performance and compare directly against the previous 30-day window.
            </p>
          </div>

          {/* Metric tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg shrink-0">
            {(['revenue', 'orders', 'rewards'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMetricTab(tab)}
                className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                  metricTab === tab
                    ? 'bg-white text-[#0a0a0a] shadow-xs font-semibold'
                    : 'text-[#71717a] hover:text-[#0a0a0a]'
                }`}
              >
                {tab === 'rewards' ? 'Rewards redeemed' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-[#71717a]">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#5f3ed8]" />
            <span className="font-medium text-[#0a0a0a]">Current period</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 border-b-2 border-dashed border-[#a1a1aa]" />
            <span>Previous period</span>
          </div>
        </div>

        {/* SVG Line / Area Chart */}
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 overflow-visible"
          >
            <defs>
              <linearGradient id="programTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5f3ed8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#5f3ed8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
              return (
                <line
                  key={pct}
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#ebebeb"
                  strokeWidth="1"
                />
              );
            })}

            {/* Shaded Area for current period */}
            <path d={areaPath} fill="url(#programTrendGradient)" />

            {/* Previous Period Dashed Line */}
            <path
              d={prevPath}
              fill="none"
              stroke="#a1a1aa"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Current Period Solid Line */}
            <path
              d={currentPath}
              fill="none"
              stroke="#5f3ed8"
              strokeWidth="2.5"
            />

            {/* Points & Interactive Nodes */}
            {currentPoints.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === i ? 5 : 3.5}
                  fill="#ffffff"
                  stroke="#5f3ed8"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {/* Date Label on X Axis */}
                <text
                  x={pt.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-[#71717a] font-medium"
                >
                  {PROGRAM_PERFORMANCE_TREND[i].date}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredIdx !== null && (
            <div
              className="absolute pointer-events-none bg-[#0a0a0a] text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 z-20"
              style={{
                left: `${(currentPoints[hoveredIdx].x / chartWidth) * 100}%`,
                top: `${(currentPoints[hoveredIdx].y / chartHeight) * 100 - 20}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="font-semibold text-zinc-300 text-[10px]">
                {PROGRAM_PERFORMANCE_TREND[hoveredIdx].label}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#a78bfa] font-bold">
                  {formatMetricVal(dataValues[hoveredIdx].current)}
                </span>
                <span className="text-[10px] text-zinc-400">
                  (vs {formatMetricVal(dataValues[hoveredIdx].prev)})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Short Takeaway */}
        <div className="pt-2 border-t border-[#ebebeb] text-xs text-[#52525b] flex items-center gap-1.5">
          <Info className="size-3.5 text-[#5f3ed8] shrink-0" />
          <span>Member revenue increased 14% while total member orders increased 11%.</span>
        </div>
      </div>

      {/* 4. Members Compared with Non-Members */}
      <div className="p-6 bg-white border border-[#ebebeb] rounded-xl shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-semibold text-[#0a0a0a]">
            Members compared with non-members
          </h3>
          <p className="text-xs text-[#71717a]">
            Side-by-side performance indicators normalized per customer cohort.
          </p>
        </div>

        {/* Comparison Bars */}
        <div className="space-y-4 pt-2">
          {MEMBERS_VS_NON_MEMBERS.map((item) => {
            const memberPct = Math.min(100, (item.memberNum / item.maxScale) * 100);
            const nonMemberPct = Math.min(100, (item.nonMemberNum / item.maxScale) * 100);

            return (
              <div key={item.metric} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0a0a0a]">{item.metric}</span>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-[#5f3ed8] font-bold">{item.memberValue} (Members)</span>
                    <span className="text-[#71717a]">{item.nonMemberValue} (Non-members)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Member bar */}
                  <div className="h-5 bg-zinc-100 rounded-md overflow-hidden">
                    <div
                      className="h-full bg-[#5f3ed8] rounded-md transition-all duration-500"
                      style={{ width: `${memberPct}%` }}
                    />
                  </div>

                  {/* Non-member bar */}
                  <div className="h-5 bg-zinc-100 rounded-md overflow-hidden">
                    <div
                      className="h-full bg-zinc-300 rounded-md transition-all duration-500"
                      style={{ width: `${nonMemberPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guidance Note */}
        <p className="text-[11px] text-[#71717a] pt-2 border-t border-[#ebebeb] italic">
          This comparison shows correlation, not direct program impact. High-spending customers are more likely to reach a VIP tier.
        </p>
      </div>

      {/* 5. Needs Attention (3 Insight Cards) */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-[#0a0a0a]">
          Needs attention
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Unused points */}
          <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#5f3ed8] uppercase tracking-wider block">
                Unused points
              </span>
              <p className="text-xs text-[#0a0a0a] leading-relaxed">
                984 customers earned points but have never redeemed them.
              </p>
            </div>
            <div>
              <Link
                href="/customers"
                className="inline-flex items-center text-xs font-semibold text-[#5f3ed8] hover:text-[#5034b8] gap-1"
              >
                <span>View customers</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: At-risk members */}
          <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
                At-risk members
              </span>
              <p className="text-xs text-[#0a0a0a] leading-relaxed">
                41 Gold and Silver members have not ordered in more than 60 days.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  toast.success('Win-back campaign drafted for 41 at-risk VIP members.');
                  onNavigateToTab('members');
                }}
                className="inline-flex items-center text-xs font-semibold text-[#5f3ed8] hover:text-[#5034b8] gap-1"
              >
                <span>Create win-back campaign</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Low-performing reward */}
          <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-2xs flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
                Low-performing reward
              </span>
              <p className="text-xs text-[#0a0a0a] leading-relaxed">
                The $25 off reward has the lowest return at $7.12 per $1 spent.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => onNavigateToTab('rewards')}
                className="inline-flex items-center text-xs font-semibold text-[#5f3ed8] hover:text-[#5034b8] gap-1"
              >
                <span>View reward performance</span>
                <ArrowRight className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

