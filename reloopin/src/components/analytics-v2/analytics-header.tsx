'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  Store,
  Clock,
  FileSpreadsheet,
  FileText,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalyticsTabId } from '@/lib/mock-data/analytics-v2';
import { toast } from 'sonner';

interface AnalyticsHeaderProps {
  activeTab: AnalyticsTabId;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  tierFilter: string;
  onTierFilterChange: (val: string) => void;
  storeName: string;
  onStoreChange: (val: string) => void;
}

const SECTION_METADATA: Record<
  AnalyticsTabId,
  { title: string; description: string }
> = {
  overview: {
    title: 'Program Overview',
    description: 'High-level loyalty impact, member revenue contribution, and key program KPIs.',
  },
  retention: {
    title: 'Member Retention',
    description: 'Track how quickly members return, repeat order curves, and customer health cohorts.',
  },
  members: {
    title: 'Member Segments & Journey',
    description: 'Customer progression through point earning, reward redemption, and VIP tiers.',
  },
  points: {
    title: 'Points Economy',
    description: 'Monitor points issuance velocity, redemption volume, and outstanding liabilities.',
  },
  rewards: {
    title: 'Reward Performance',
    description: 'Identify profitable incentives, evaluate cost versus usage, and spot underperforming rewards.',
  },
};

export function AnalyticsHeader({
  activeTab,
  dateRange,
  onDateRangeChange,
  tierFilter,
  onTierFilterChange,
  storeName,
  onStoreChange,
}: AnalyticsHeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const metadata = SECTION_METADATA[activeTab];

  const handleExport = (format: string) => {
    setExportOpen(false);
    toast.info(`Your report is being prepared (${format}).`);
  };

  return (
    <div className="space-y-4">
      {/* Top row: Breadcrumb + Last updated */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#71717a] font-medium">
          <Link href="/analytics" className="hover:text-[#5f3ed8] transition-colors">
            Analytics
          </Link>
          <span>/</span>
          <span className="text-[#0a0a0a]">{metadata.title}</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#71717a] font-medium">
          <Clock className="size-3 text-emerald-600" />
          <span>Updated today at 6:39 AM</span>
        </div>
      </div>

      {/* Middle row: Title + Actions */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0a0a0a]">
            {metadata.title}
          </h1>
          <p className="text-xs text-[#71717a] mt-1">
            {metadata.description}
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Store Selector */}
          <div className="relative">
            <select
              value={storeName}
              onChange={(e) => onStoreChange(e.target.value)}
              className="h-8 pl-8 pr-7 bg-white border border-[#ebebeb] rounded-lg text-xs font-medium text-[#0a0a0a] outline-none hover:bg-[#fafafa] focus:border-[#5f3ed8] appearance-none cursor-pointer shadow-2xs"
            >
              <option value="Northstar Supply">Northstar Supply</option>
              <option value="Alpine Apparel">Alpine Apparel</option>
              <option value="Loom & Thread">Loom & Thread</option>
            </select>
            <Store className="size-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-3 text-[#71717a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Tier Filter */}
          <div className="relative">
            <select
              value={tierFilter}
              onChange={(e) => onTierFilterChange(e.target.value)}
              className="h-8 pl-8 pr-7 bg-white border border-[#ebebeb] rounded-lg text-xs font-medium text-[#0a0a0a] outline-none hover:bg-[#fafafa] focus:border-[#5f3ed8] appearance-none cursor-pointer shadow-2xs"
            >
              <option value="All VIP tiers">All VIP tiers</option>
              <option value="Gold">Gold tier only</option>
              <option value="Silver">Silver tier only</option>
              <option value="Bronze">Bronze tier only</option>
            </select>
            <Filter className="size-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-3 text-[#71717a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Date Range Selector */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="h-8 pl-8 pr-7 bg-white border border-[#ebebeb] rounded-lg text-xs font-medium text-[#0a0a0a] outline-none hover:bg-[#fafafa] focus:border-[#5f3ed8] appearance-none cursor-pointer shadow-2xs"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 90 days">Last 90 days</option>
              <option value="Last 12 months">Last 12 months</option>
            </select>
            <Calendar className="size-3.5 text-[#71717a] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="size-3 text-[#71717a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Report Dropdown */}
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExportOpen(!exportOpen)}
              className="h-8 px-3 text-xs font-medium border-[#ebebeb] bg-white text-[#0a0a0a] hover:bg-[#fafafa] shadow-2xs"
            >
              <Download className="size-3.5 mr-1.5 text-[#71717a]" />
              <span>Export report</span>
              <ChevronDown className="size-3 ml-1 text-[#71717a]" />
            </Button>

            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setExportOpen(false)}
                />
                <div className="absolute right-0 top-9 z-30 w-44 bg-white border border-[#ebebeb] rounded-xl shadow-lg p-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleExport('CSV')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#0a0a0a] hover:bg-[#fafafa] flex items-center gap-2"
                  >
                    <FileSpreadsheet className="size-3.5 text-[#71717a]" />
                    <span>Download CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('PDF')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#0a0a0a] hover:bg-[#fafafa] flex items-center gap-2"
                  >
                    <FileText className="size-3.5 text-[#71717a]" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('Email')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#0a0a0a] hover:bg-[#fafafa] flex items-center gap-2"
                  >
                    <Mail className="size-3.5 text-[#71717a]" />
                    <span>Email report</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

