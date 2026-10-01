'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Repeat,
  Users,
  Coins,
  Gift,
  Crown,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { AnalyticsTabId } from '@/lib/mock-data/analytics-v2';

interface AnalyticsTabsProps {
  activeTab: AnalyticsTabId;
  onTabChange: (tab: AnalyticsTabId) => void;
  onOpenRoi: () => void;
}

const TABS: { id: AnalyticsTabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'retention', label: 'Retention', icon: Repeat },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'points', label: 'Points', icon: Coins },
  { id: 'rewards', label: 'Rewards', icon: Gift },
];

export function AnalyticsTabs({
  activeTab,
  onTabChange,
  onOpenRoi,
}: AnalyticsTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ebebeb] pb-2">
      {/* 5 Main Reporting Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#5f3ed8] text-white shadow-xs'
                  : 'text-[#71717a] hover:text-[#0a0a0a] hover:bg-[#fafafa]'
              }`}
            >
              <Icon className="size-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary External / Modal Report Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* VIP Tiers Link */}
        <Link
          href="/analytics?tab=vip"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
          title="Open VIP tiers breakdown in legacy analytics"
        >
          <Crown className="size-3.5 text-amber-600" />
          <span>VIP tiers</span>
          <ExternalLink className="size-3 text-[#a1a1aa]" />
        </Link>

        {/* Program ROI Action */}
        <button
          type="button"
          onClick={onOpenRoi}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#5f3ed8] hover:bg-[#f8f7ff] transition-colors"
        >
          <TrendingUp className="size-3.5" />
          <span>Program ROI</span>
        </button>
      </div>
    </div>
  );
}

