'use client';

import React, { useState } from 'react';
import {
  Gift,
  Users,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import {
  REWARD_KPIS,
  REWARD_PERFORMANCE,
  RewardPerformanceRow,
} from '@/lib/mock-data/analytics-v2';
import { toast } from 'sonner';

interface RewardsTabProps {
  onOpenCalculationInfo: () => void;
}

export function RewardsTab({ onOpenCalculationInfo }: RewardsTabProps) {
  const [sortField, setSortField] = useState<keyof RewardPerformanceRow>('timesUsed');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [hoveredScatterReward, setHoveredScatterReward] = useState<RewardPerformanceRow | null>(null);

  // Sorting
  const sortedRewards = [...REWARD_PERFORMANCE].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (field: keyof RewardPerformanceRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getStatusBadge = (status: RewardPerformanceRow['status'], isWarning?: boolean) => {
    if (isWarning || status === 'Low return' || status === 'Needs review') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="size-3" /> {status}
        </span>
      );
    }
    if (status === 'Strong performer') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="size-3" /> {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
        {status}
      </span>
    );
  };

  // Scatter Plot Coordinates
  const scatterWidth = 600;
  const scatterHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const minX = 0;
  const maxX = 35; // Cost per redemption ($0 - $35)
  const minY = 35; // Repeat purchase % (35% - 85%)
  const maxY = 85;

  const getScatterCoord = (cost: number, repeat: number) => {
    const x = paddingX + ((cost - minX) / (maxX - minX)) * (scatterWidth - paddingX * 2);
    const y =
      scatterHeight -
      paddingY -
      ((repeat - minY) / (maxY - minY)) * (scatterHeight - paddingY * 2);
    return { x, y };
  };

  const kpiIcons = [
    <Gift key="1" className="size-4 text-[#5f3ed8]" />,
    <Users key="2" className="size-4 text-emerald-600" />,
    <DollarSign key="3" className="size-4 text-zinc-500" />,
    <ShoppingCart key="4" className="size-4 text-blue-600" />,
  ];

  return (
    <div className="space-y-6">
      {/* 1. Reward KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REWARD_KPIS.map((kpi, idx) => (
          <div
            key={kpi.label}
            className="p-4 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-2 hover:border-zinc-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#71717a]">{kpi.label}</span>
              {kpiIcons[idx]}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-[#0a0a0a]">{kpi.value}</span>
            </div>

            <p className="text-[11px] text-[#71717a] truncate">{kpi.subtext}</p>
          </div>
        ))}
      </div>

      {/* 2. Reward Performance Table */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Reward performance</h3>
              <button
                type="button"
                onClick={onOpenCalculationInfo}
                className="text-[#a1a1aa] hover:text-[#71717a] transition-colors"
                title="View return calculations"
              >
                <HelpCircle className="size-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Efficiency breakdown by discount tier, utilization, and gross margin return
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717a]">
              Sorted by: <span className="font-semibold text-[#0a0a0a]">{sortField}</span>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#ebebeb] rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-[#ebebeb] text-[#71717a] font-medium sticky top-0">
                <th className="py-2.5 px-3">Reward</th>
                <th
                  onClick={() => handleSort('pointsRequired')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#0a0a0a]"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    Points Req. <ArrowUpDown className="size-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('timesUsed')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#0a0a0a]"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    Times Used <ArrowUpDown className="size-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('costNum')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#0a0a0a]"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    Reward Cost <ArrowUpDown className="size-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Avg. Order</th>
                <th
                  onClick={() => handleSort('repeatNum')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#0a0a0a]"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    30d Repeat <ArrowUpDown className="size-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('returnNum')}
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-[#0a0a0a]"
                >
                  <div className="inline-flex items-center gap-1 justify-end">
                    Return per $1 <ArrowUpDown className="size-3 opacity-60" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f5]">
              {sortedRewards.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-zinc-50/70 transition-colors ${
                    row.isWarning ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-semibold text-[#0a0a0a]">{row.name}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#71717a]">
                    {row.pointsRequired} pts
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-[#0a0a0a]">
                    {row.timesUsed}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#71717a]">
                    {row.rewardCost}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#71717a]">{row.avgOrder}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#0a0a0a]">
                    {row.repeatPurchase30d}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#5f3ed8]">
                    {row.returnPerDollar}
                  </td>
                  <td className="py-2.5 px-3 text-center">{getStatusBadge(row.status, row.isWarning)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Cost Compared With Usage & Reward Opportunity Chart (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost Compared With Usage (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Cost compared with usage</h3>
              <p className="text-xs text-[#71717a] mt-0.5">
                Exposing rewards disproportionate to total spend
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-[#5f3ed8]" />
              <span className="text-[#0a0a0a] font-medium">% Usage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-xs bg-amber-500" />
              <span className="text-[#0a0a0a] font-medium">% Total cost</span>
            </div>
          </div>

          {/* Paired horizontal bars */}
          <div className="space-y-4 pt-1">
            {REWARD_PERFORMANCE.map((rew) => (
              <div key={rew.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#0a0a0a]">{rew.name}</span>
                  <span className="text-[11px] text-[#71717a]">
                    {rew.timesUsed} claims ({rew.usageShare}%)
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Usage Bar */}
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5f3ed8] rounded-full"
                      style={{ width: `${rew.usageShare * 2}%` }}
                    />
                  </div>
                  {/* Cost Bar */}
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${rew.costShare * 2}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-[#71717a]">
                  <span>Cost: {rew.rewardCost}</span>
                  <span className={rew.isWarning ? 'font-bold text-amber-700' : ''}>
                    {rew.costShare}% of budget
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Highlight Callout */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1">
            <div className="font-semibold text-amber-900 flex items-center gap-1">
              <AlertTriangle className="size-3.5 text-amber-600" />
              Review $25 off reward
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              The $25 off coupon represents 18% of redemptions but accounts for 37% of total reward cost with the lowest repeat conversion ($7.12 return per $1 spent).
            </p>
          </div>
        </div>

        {/* Reward Opportunity Scatter Plot (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Reward opportunity matrix</h3>
              <p className="text-xs text-[#71717a] mt-0.5">
                Cost per redemption vs 30-day repeat purchase rate
              </p>
            </div>
            <span className="text-[11px] text-[#71717a] bg-zinc-100 px-2 py-0.5 rounded">
              Bubble size = Volume
            </span>
          </div>

          {/* SVG Scatter Plot */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${scatterWidth} ${scatterHeight}`}
              className="w-full h-56 overflow-visible"
            >
              {/* Quadrant Lines */}
              <line
                x1={scatterWidth / 2}
                y1={paddingY}
                x2={scatterWidth / 2}
                y2={scatterHeight - paddingY}
                stroke="#e4e4e7"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={paddingX}
                y1={scatterHeight / 2}
                x2={scatterWidth - paddingX}
                y2={scatterHeight / 2}
                stroke="#e4e4e7"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Quadrant Watermark Labels */}
              <text x={paddingX + 10} y={paddingY + 16} fontSize="10" fill="#a1a1aa" fontWeight="500">
                ⭐ Core Drivers (High Ret. / Low Cost)
              </text>
              <text
                x={scatterWidth - paddingX - 10}
                y={paddingY + 16}
                textAnchor="end"
                fontSize="10"
                fill="#a1a1aa"
                fontWeight="500"
              >
                💎 High Investment VIP
              </text>
              <text
                x={scatterWidth - paddingX - 10}
                y={scatterHeight - paddingY - 10}
                textAnchor="end"
                fontSize="10"
                fill="#f87171"
                fontWeight="500"
              >
                ⚠️ Inefficient / Review
              </text>

              {/* Horizontal & Vertical Axes */}
              <line
                x1={paddingX}
                y1={scatterHeight - paddingY}
                x2={scatterWidth - paddingX}
                y2={scatterHeight - paddingY}
                stroke="#d4d4d8"
                strokeWidth="1.5"
              />
              <line
                x1={paddingX}
                y1={paddingY}
                x2={paddingX}
                y2={scatterHeight - paddingY}
                stroke="#d4d4d8"
                strokeWidth="1.5"
              />

              {/* Axis Labels */}
              <text
                x={scatterWidth / 2}
                y={scatterHeight - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#71717a"
              >
                Cost per Redemption ($) →
              </text>
              <text
                x={paddingX}
                y={paddingY - 12}
                textAnchor="middle"
                fontSize="10"
                fill="#71717a"
              >
                Repeat Rate (%)
              </text>

              {/* Rewards Scatter Nodes */}
              {REWARD_PERFORMANCE.map((rew) => {
                const coord = getScatterCoord(rew.scatterCostPerRedemption, rew.repeatNum);
                const radius = Math.max(7, Math.min(18, Math.sqrt(rew.timesUsed) * 0.55));
                const isWarning = rew.isWarning;

                return (
                  <g
                    key={rew.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredScatterReward(rew)}
                    onMouseLeave={() => setHoveredScatterReward(null)}
                  >
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={radius}
                      fill={isWarning ? 'rgba(239, 68, 68, 0.75)' : 'rgba(95, 62, 216, 0.75)'}
                      stroke={isWarning ? '#dc2626' : '#5f3ed8'}
                      strokeWidth="1.5"
                      className="transition-all hover:opacity-100"
                    />

                    {/* Reward Name Label */}
                    <text
                      x={coord.x}
                      y={coord.y - radius - 4}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill="#0a0a0a"
                      fontWeight="600"
                      className="pointer-events-none drop-shadow-xs"
                    >
                      {rew.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip */}
            {hoveredScatterReward && (
              <div className="absolute top-2 right-4 bg-[#0a0a0a] text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 space-y-1 max-w-xs pointer-events-none">
                <div className="font-semibold text-zinc-100">{hoveredScatterReward.name}</div>
                <div className="text-[11px] text-zinc-300">
                  Cost per claim: ${hoveredScatterReward.scatterCostPerRedemption} | Repeat rate:{' '}
                  {hoveredScatterReward.repeatPurchase30d}
                </div>
                <div className="text-[11px] text-emerald-400">
                  Return: {hoveredScatterReward.returnPerDollar} per $1
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#f4f4f5] text-xs text-[#71717a]">
            Top left quadrant highlights core drivers ($10 coupon & Free shipping) with high retention at low per-redemption cost.
          </div>
        </div>
      </div>
    </div>
  );
}
