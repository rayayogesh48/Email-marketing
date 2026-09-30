'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, AlertCircle, WifiOff } from 'lucide-react';
import { BillingSyncStatus } from '@/lib/billing/billing-types';

interface SyncStatusBannerProps {
  status: BillingSyncStatus;
  isSyncing: boolean;
  onRetrySync: () => void;
}

export function SyncStatusBanner({
  status,
  isSyncing,
  onRetrySync,
}: SyncStatusBannerProps) {
  if (status === 'up_to_date' && !isSyncing) return null;

  if (isSyncing || status === 'syncing') {
    return (
      <div className="flex items-center gap-3 p-3.5 bg-purple-50/70 border border-purple-200/60 rounded-xl text-[13px] text-purple-900">
        <RefreshCw className="size-4 animate-spin text-[#5f3ed8] shrink-0" />
        <div className="flex-1">
          <span className="font-semibold">Updating order usage... </span>
          <span className="text-purple-800/80">
            Checking for new and changed store orders. Your current estimate remains visible.
          </span>
        </div>
      </div>
    );
  }

  if (status === 'sync_delayed') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-[13px] text-amber-900">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Order usage may be delayed</span>
            <span className="text-amber-800 text-[12px]">
              We haven&apos;t received the latest store data from Shopify. Your final bill may change after synchronization resumes.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onRetrySync}
            className="flex items-center gap-1.5 h-[32px] px-3 bg-white border border-amber-300 text-[12px] font-semibold text-amber-900 rounded-lg hover:bg-amber-100/50 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span>Retry sync</span>
          </button>
          <Link
            href="/integrations"
            className="h-[32px] px-3 bg-white border border-amber-300 text-[12px] font-semibold text-amber-900 rounded-lg hover:bg-amber-100/50 transition-colors inline-flex items-center"
          >
            View integration
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'calculation_failed') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-900">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">We couldn&apos;t update your billing usage</span>
            <span className="text-red-800 text-[12px]">
              Your last confirmed estimate is still available. Try again after the store connection is restored.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onRetrySync}
            className="flex items-center gap-1.5 h-[32px] px-3 bg-white border border-red-300 text-[12px] font-semibold text-red-900 rounded-lg hover:bg-red-100/50 transition-colors cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span>Try again</span>
          </button>
          <Link
            href="/integrations"
            className="h-[32px] px-3 bg-white border border-red-300 text-[12px] font-semibold text-red-900 rounded-lg hover:bg-red-100/50 transition-colors inline-flex items-center"
          >
            Check integration
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'store_disconnected') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-900">
        <div className="flex items-start gap-2.5">
          <WifiOff className="size-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Store connection lost</span>
            <span className="text-red-800 text-[12px]">
              Billing usage is paused until your store reconnects. Orders will be synchronized after reconnection resumes.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/integrations"
            className="h-[32px] px-3 bg-red-600 hover:bg-red-700 text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors inline-flex items-center"
          >
            Reconnect store
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
