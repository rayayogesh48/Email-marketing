'use client';

import React, { useState } from 'react';
import {
  Users,
  Award,
  Gift,
  Crown,
  AlertCircle,
  Mail,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  LOYALTY_JOURNEY,
  NEW_MEMBERS_WEEKLY,
  TIER_ACTIVITY_MATRIX,
  CONTACTABLE_MEMBERS,
  ContactableMember,
} from '@/lib/mock-data/analytics-v2';
import { toast } from 'sonner';

interface MembersTabProps {
  onOpenCalculationInfo: () => void;
}

export function MembersTab({ onOpenCalculationInfo }: MembersTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('Everyone');
  const [hoveredWeekIdx, setHoveredWeekIdx] = useState<number | null>(null);

  // Filter members table
  const filteredMembers = CONTACTABLE_MEMBERS.filter((m) => {
    if (selectedFilter === 'Everyone') return true;
    return m.reason === selectedFilter;
  });

  // Funnel icons
  const journeyIcons = [
    <Users key="1" className="size-4 text-zinc-500" />,
    <Award key="2" className="size-4 text-[#5f3ed8]" />,
    <Gift key="3" className="size-4 text-emerald-600" />,
    <Crown key="4" className="size-4 text-amber-500" />,
  ];

  // SVG Bar Chart Dimensions for New Members Trend
  const barChartWidth = 600;
  const barChartHeight = 180;
  const maxWeekly = 130;
  const paddingX = 40;
  const paddingY = 24;

  const getTierBadge = (tier: 'Gold' | 'Silver' | 'Bronze') => {
    if (tier === 'Gold') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Crown className="size-3" /> Gold
        </span>
      );
    }
    if (tier === 'Silver') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
          <Award className="size-3" /> Silver
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
        <Award className="size-3" /> Bronze
      </span>
    );
  };

  const getReasonBadge = (reason: ContactableMember['reason']) => {
    switch (reason) {
      case 'Going quiet':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            Going quiet
          </span>
        );
      case 'Close to next tier':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Close to tier
          </span>
        );
      case 'Unused points':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
            Unused points
          </span>
        );
      case 'Points expiring':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            Points expiring
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Loyalty Journey Funnel */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-[#0a0a0a]">Loyalty journey</h3>
            <p className="text-xs text-[#71717a] mt-0.5">
              Customer progression from initial store contact to high-value VIP status
            </p>
          </div>
          <span className="text-xs font-medium text-[#71717a]">
            Cohort: All registered accounts
          </span>
        </div>

        {/* Funnel Stages Progression */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {LOYALTY_JOURNEY.map((stage, idx) => (
            <div
              key={stage.stage}
              className="p-3.5 rounded-xl border border-[#ebebeb] bg-[#fafafa] space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {journeyIcons[idx]}
                  <span className="text-xs font-semibold text-[#0a0a0a]">{stage.stage}</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#0a0a0a]">
                  {stage.count.toLocaleString()}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5f3ed8] rounded-full transition-all"
                  style={{ width: `${stage.conversion}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#71717a]">Conversion</span>
                <span className="font-semibold text-[#0a0a0a]">{stage.conversion}%</span>
              </div>

              {/* Arrow connector */}
              {idx < LOYALTY_JOURNEY.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 size-6 rounded-full bg-white border border-[#ebebeb] items-center justify-center text-[#71717a] shadow-xs z-10">
                  <ChevronRight className="size-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Highlight Largest Drop Callout */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5">
          <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-semibold text-amber-900">Opportunity identified: </span>
            <span className="text-amber-800">
              984 customers earned points but have not redeemed a reward.
            </span>
            <span className="text-amber-700 ml-1">
              Sending a first-redemption voucher reminder can recover up to $18,400 in repeat purchases.
            </span>
          </div>
          <button
            type="button"
            onClick={() => toast.success('Targeted reminder campaign queued for 984 inactive earners')}
            className="text-xs font-medium text-amber-900 hover:text-amber-950 underline underline-offset-2 shrink-0"
          >
            Launch campaign
          </button>
        </div>
      </div>

      {/* 2. New Members Trend & Tier Matrix (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Trend Chart (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0a0a0a]">New members trend</h3>
              <p className="text-xs text-[#71717a] mt-0.5">Customers earning their first points</p>
            </div>
          </div>

          {/* SVG Grouped Bar Chart */}
          <div className="pt-2">
            <svg
              viewBox={`0 0 ${barChartWidth} ${barChartHeight}`}
              className="w-full h-44 overflow-visible"
            >
              {/* Minimal Gridlines */}
              {[0, 50, 100].map((tick) => {
                const y = barChartHeight - paddingY - (tick / maxWeekly) * (barChartHeight - paddingY * 2);
                return (
                  <g key={tick}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={barChartWidth - 10}
                      y2={y}
                      stroke="#f4f4f5"
                      strokeWidth="1"
                    />
                    <text x={paddingX - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#a1a1aa">
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {NEW_MEMBERS_WEEKLY.map((item, idx) => {
                const groupWidth = (barChartWidth - paddingX - 20) / NEW_MEMBERS_WEEKLY.length;
                const groupX = paddingX + idx * groupWidth;
                const barWidth = 18;

                const currentHeight = (item.current / maxWeekly) * (barChartHeight - paddingY * 2);
                const prevHeight = (item.previous / maxWeekly) * (barChartHeight - paddingY * 2);

                const currentY = barChartHeight - paddingY - currentHeight;
                const prevY = barChartHeight - paddingY - prevHeight;

                const isHovered = hoveredWeekIdx === idx;

                return (
                  <g
                    key={item.week}
                    onMouseEnter={() => setHoveredWeekIdx(idx)}
                    onMouseLeave={() => setHoveredWeekIdx(null)}
                    className="cursor-pointer"
                  >
                    {/* Previous Period Bar */}
                    <rect
                      x={groupX + groupWidth / 2 - barWidth - 2}
                      y={prevY}
                      width={barWidth}
                      height={prevHeight}
                      rx="3"
                      fill="#e4e4e7"
                      className="transition-all"
                    />

                    {/* Current Period Bar */}
                    <rect
                      x={groupX + groupWidth / 2 + 2}
                      y={currentY}
                      width={barWidth}
                      height={currentHeight}
                      rx="3"
                      fill={isHovered ? '#5034b8' : '#5f3ed8'}
                      className="transition-all"
                    />

                    {/* Week Label */}
                    <text
                      x={groupX + groupWidth / 2}
                      y={barChartHeight - 6}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={isHovered ? '#0a0a0a' : '#71717a'}
                      fontWeight={isHovered ? '600' : '400'}
                    >
                      {item.week.replace(' (partial)', '*')}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend & Tooltip note */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#f4f4f5]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-xs bg-[#5f3ed8]" />
                  <span className="font-medium text-[#0a0a0a]">Current period</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-xs bg-[#e4e4e7]" />
                  <span className="text-[#71717a]">Previous period</span>
                </div>
              </div>
              <span className="text-[11px] text-[#a1a1aa]">*Partial week</span>
            </div>
          </div>
        </div>

        {/* Tier and Activity Matrix (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0a0a0a]">Tier & activity matrix</h3>
              <p className="text-xs text-[#71717a] mt-0.5">
                Segment volume and risk levels across loyalty tiers
              </p>
            </div>
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
              41 Gold & Silver at risk
            </span>
          </div>

          <div className="overflow-x-auto border border-[#ebebeb] rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-[#ebebeb] text-[#71717a] font-medium">
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3 text-center">Active (&lt;30d)</th>
                  <th className="py-2.5 px-3 text-center">Cooling (30-60d)</th>
                  <th className="py-2.5 px-3 text-center">At risk (60-90d)</th>
                  <th className="py-2.5 px-3 text-center">Lapsed (&gt;90d)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f4f5]">
                {TIER_ACTIVITY_MATRIX.map((row) => (
                  <tr key={row.tier} className="hover:bg-zinc-50/50">
                    <td className="py-2.5 px-3 font-semibold text-[#0a0a0a]">
                      {getTierBadge(row.tier)}
                    </td>

                    {/* Active */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="font-bold text-[#0a0a0a]">{row.active.count}</div>
                      <div className="text-[10px] text-[#71717a]">{row.active.pct}%</div>
                    </td>

                    {/* Cooling */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="font-bold text-[#0a0a0a]">{row.cooling.count}</div>
                      <div className="text-[10px] text-[#71717a]">{row.cooling.pct}%</div>
                    </td>

                    {/* At Risk */}
                    <td className="py-2.5 px-3 text-center">
                      <div
                        className={`inline-block px-2 py-0.5 rounded ${
                          row.atRisk.highlight
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'text-[#0a0a0a] font-bold'
                        }`}
                      >
                        {row.atRisk.count}
                        <span className="text-[10px] ml-1 font-normal opacity-80">
                          ({row.atRisk.pct}%)
                        </span>
                      </div>
                    </td>

                    {/* Lapsed */}
                    <td className="py-2.5 px-3 text-center">
                      <div
                        className={`inline-block px-2 py-0.5 rounded ${
                          row.lapsed.highlight
                            ? 'bg-rose-100 text-rose-900 font-semibold'
                            : 'text-[#0a0a0a] font-bold'
                        }`}
                      >
                        {row.lapsed.count}
                        <span className="text-[10px] ml-1 font-normal opacity-80">
                          ({row.lapsed.pct}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-[#71717a]">
            Highlighted cells indicate high-spending Gold & Silver members who haven't ordered in over 60 days.
          </p>
        </div>
      </div>

      {/* 3. Members Worth Contacting Table */}
      <div className="p-5 rounded-xl border border-[#ebebeb] bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm text-[#0a0a0a]">Members worth contacting</h3>
            <p className="text-xs text-[#71717a] mt-0.5">
              High-priority accounts requiring proactive engagement
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.success(`Win-back email flow prepared for ${filteredMembers.length} targeted customers`)
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5f3ed8] hover:bg-[#5034b8] text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Mail className="size-3.5" />
            Create campaign
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f4f4f5]">
          <span className="text-xs font-medium text-[#71717a] flex items-center gap-1 mr-1">
            <Filter className="size-3 text-[#a1a1aa]" /> Filter:
          </span>
          {['Everyone', 'Going quiet', 'Close to next tier', 'Unused points', 'Points expiring'].map(
            (chip) => {
              const isSelected = selectedFilter === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSelectedFilter(chip)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#5f3ed8] text-white shadow-xs'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-[#71717a]'
                  }`}
                >
                  {chip}
                </button>
              );
            }
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#ebebeb] rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-[#ebebeb] text-[#71717a] font-medium sticky top-0">
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Trigger Reason</th>
                <th className="py-2.5 px-3">Last Order</th>
                <th className="py-2.5 px-3 text-right">Lifetime Spend</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f4f5]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-[#0a0a0a]">{member.name}</div>
                    <div className="text-[11px] text-[#71717a] font-mono">{member.email}</div>
                  </td>
                  <td className="py-2.5 px-3">{getTierBadge(member.tier)}</td>
                  <td className="py-2.5 px-3">{getReasonBadge(member.reason)}</td>
                  <td className="py-2.5 px-3 text-[#71717a]">{member.lastOrder}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium text-[#0a0a0a]">
                    {member.spend}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(`Personalized outreach queued for ${member.name}`)
                      }
                      className="text-xs font-semibold text-[#5f3ed8] hover:text-[#5034b8] hover:underline"
                    >
                      Send offer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[#71717a] text-xs">
                    No members match the current filter "{selectedFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

