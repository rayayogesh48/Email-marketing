'use client';

import React from 'react';
import { BarChart3, FilterX, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalyticsDataState } from '@/lib/mock-data/analytics-v2';

interface EmptyAnalyticsStateProps {
  state: AnalyticsDataState;
  onResetFilters?: () => void;
  onRetry?: () => void;
}

export function EmptyAnalyticsState({
  state,
  onResetFilters,
  onRetry,
}: EmptyAnalyticsStateProps) {
  if (state === 'loading') {
    return (
      <div className="w-full space-y-6 animate-pulse">
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-white border border-[#ebebeb] rounded-xl space-y-3">
              <div className="h-3 w-24 bg-zinc-200 rounded" />
              <div className="h-7 w-32 bg-zinc-200 rounded" />
              <div className="h-3 w-40 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>

        {/* Skeleton Chart */}
        <div className="p-6 bg-white border border-[#ebebeb] rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1.5">
              <div className="h-4 w-44 bg-zinc-200 rounded" />
              <div className="h-3 w-64 bg-zinc-100 rounded" />
            </div>
            <div className="h-8 w-48 bg-zinc-100 rounded-lg" />
          </div>
          <div className="h-64 bg-zinc-100 rounded-lg" />
        </div>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="py-16 px-6 bg-white border border-[#ebebeb] rounded-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4">
        <div className="size-14 rounded-full bg-[#f8f7ff] border border-[#e5e1fc] text-[#5f3ed8] flex items-center justify-center">
          <BarChart3 className="size-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#0a0a0a]">
            Analytics will appear here
          </h3>
          <p className="text-xs text-[#71717a] max-w-sm">
            Data will become available after customers start earning points and placing orders.
          </p>
        </div>
      </div>
    );
  }

  if (state === 'no_filter_results') {
    return (
      <div className="py-16 px-6 bg-white border border-[#ebebeb] rounded-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4">
        <div className="size-14 rounded-full bg-zinc-100 text-[#71717a] flex items-center justify-center">
          <FilterX className="size-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#0a0a0a]">
            No data for these filters
          </h3>
          <p className="text-xs text-[#71717a] max-w-sm">
            Try changing the date range, tier, or store.
          </p>
        </div>
        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="h-8 px-4 text-xs font-medium border-[#ebebeb] text-[#0a0a0a] hover:bg-[#fafafa]"
          >
            Reset filters
          </Button>
        )}
      </div>
    );
  }

  if (state === 'sync_delayed') {
    return (
      <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 mb-6">
        <div className="flex items-center gap-2.5">
          <RefreshCw className="size-4 text-amber-600 shrink-0 animate-spin" />
          <div>
            <span className="font-semibold block text-[#0a0a0a]">Your latest data is still syncing</span>
            <span className="text-[11px] text-amber-800">
              You can continue viewing the previous report while we update the latest activity.
            </span>
          </div>
        </div>
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-7 px-3 text-xs bg-white border-amber-300 text-amber-900 hover:bg-amber-50 shrink-0"
          >
            Refresh
          </Button>
        )}
      </div>
    );
  }

  if (state === 'data_unavailable') {
    return (
      <div className="py-16 px-6 bg-white border border-[#ebebeb] rounded-xl flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4">
        <div className="size-14 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="size-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#0a0a0a]">
            Analytics are temporarily unavailable
          </h3>
          <p className="text-xs text-[#71717a] max-w-sm">
            Your loyalty data is safe. Try refreshing the report in a few minutes.
          </p>
        </div>
        {onRetry && (
          <Button
            type="button"
            size="sm"
            onClick={onRetry}
            className="h-8 px-4 text-xs font-semibold bg-[#5f3ed8] hover:bg-[#5034b8] text-white"
          >
            Retry now
          </Button>
        )}
      </div>
    );
  }

  return null;
}

