'use client';

import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  Clock,
  Info,
  Zap,
} from 'lucide-react';
import { BillingPeriod } from '@/lib/billing/billing-types';
import {
  FREE_ORDER_THRESHOLD,
  PRICE_PER_ORDER,
  calculateEstimatedCharge,
} from '@/lib/billing/billing-data';

interface CurrentUsageCardProps {
  period: BillingPeriod;
  countedOrders: number;
  lastSyncedAt?: string;
}

export function CurrentUsageCard({
  period,
  countedOrders,
  lastSyncedAt = '2 minutes ago',
}: CurrentUsageCardProps) {
  const isPast = period.status !== 'open';
  const effectiveCount = isPast ? period.countedOrders : countedOrders;
  const charge = isPast
    ? period.finalCharge ?? calculateEstimatedCharge(effectiveCount)
    : calculateEstimatedCharge(effectiveCount);

  const isFree = effectiveCount <= FREE_ORDER_THRESHOLD;
  const freeRemaining = Math.max(0, FREE_ORDER_THRESHOLD - effectiveCount);
  const isApproaching = effectiveCount >= 40 && effectiveCount <= 49;
  const isAtThreshold = effectiveCount === 50;
  const isFirstBillable = effectiveCount === 51;
  const isHighUsage = effectiveCount >= 1000;

  // Progress percentage (scale: 0 to 50 is 0-70% of bar width, >50 extends to 100%)
  const progressPercent = isFree
    ? (effectiveCount / FREE_ORDER_THRESHOLD) * 70
    : Math.min(100, 70 + ((effectiveCount - FREE_ORDER_THRESHOLD) / (FREE_ORDER_THRESHOLD * 2)) * 30);

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
      {/* Top Row: Usage Status + Estimated Charge */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#ebebeb]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#71717a]">
              Monthly Counted Orders
            </span>
            <span className="text-[#a1a1aa]">•</span>
            <span className="text-[12px] text-[#71717a] flex items-center gap-1">
              <Clock className="size-3" />
              <span>Updated {lastSyncedAt}</span>
            </span>
          </div>

          {/* Strong Heading based on threshold */}
          {effectiveCount === 0 ? (
            <div>
              <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0a0a0a]">
                No counted orders this month
              </h2>
              <p className="text-[14px] text-[#71717a] mt-0.5">
                Your billing usage will appear after eligible store orders are synchronized.
              </p>
            </div>
          ) : isFree ? (
            <div>
              <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0a0a0a]">
                {effectiveCount} of {FREE_ORDER_THRESHOLD} free orders used
              </h2>
              <p className="text-[14px] text-[#71717a] mt-0.5">
                You have{' '}
                <strong className="text-emerald-600 font-semibold">
                  {freeRemaining} free order{freeRemaining === 1 ? '' : 's'} remaining
                </strong>{' '}
                this month.
              </p>
            </div>
          ) : isFirstBillable ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#5f3ed8] animate-pulse" />
                <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0a0a0a]">
                  Usage-based billing is now active
                </h2>
              </div>
              <p className="text-[14px] text-[#71717a] mt-0.5">
                Your store has processed <strong>51 counted orders</strong> this month.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#5f3ed8]" />
                <h2 className="text-[22px] sm:text-[24px] font-bold text-[#0a0a0a]">
                  {isHighUsage ? `${effectiveCount.toLocaleString()} counted orders this month` : 'Usage-based billing is active'}
                </h2>
              </div>
              <p className="text-[14px] text-[#71717a] mt-0.5">
                You have processed{' '}
                <strong className="text-[#0a0a0a]">
                  {effectiveCount.toLocaleString()} counted orders
                </strong>{' '}
                this monthly billing period.
              </p>
            </div>
          )}
        </div>

        {/* Big Amount Card */}
        <div className="bg-[#f7f7f8] border border-[#ebebeb] rounded-2xl p-4 sm:p-5 min-w-[240px] text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            {isPast ? 'Final charge' : 'Current estimated charge'}
          </span>
          <div className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-[#0a0a0a] mt-0.5">
            ${charge.toFixed(2)}
          </div>
          <div className="text-[12px] text-[#71717a] mt-0.5 font-mono">
            {isFree ? (
              <span className="text-emerald-600 font-semibold font-sans">
                Free tier ($0.00)
              </span>
            ) : (
              <span>
                {effectiveCount} orders × ${PRICE_PER_ORDER.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar Visualization */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-[#0a0a0a] font-semibold">
              {effectiveCount.toLocaleString()} orders
            </span>
            <span className="text-[#a1a1aa]">•</span>
            <span className="text-[#71717a]">
              {isFree
                ? `${freeRemaining} free orders remaining`
                : `${effectiveCount - FREE_ORDER_THRESHOLD} orders above threshold`}
            </span>
          </div>

          <div className="text-[12px] text-[#71717a] font-medium">
            Threshold: <strong>{FREE_ORDER_THRESHOLD} orders</strong>
          </div>
        </div>

        {/* Progress Track with 50-Threshold Marker */}
        <div className="relative w-full h-3.5 bg-zinc-100 rounded-full overflow-hidden">
          {/* 50 Threshold reference line marker */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-zinc-400 z-10"
            style={{ left: '70%' }}
            title="Free threshold (50 orders)"
          />

          {/* Filled Bar */}
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFree
                ? isApproaching || isAtThreshold
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
                : 'bg-[#5f3ed8]'
            }`}
            style={{ width: `${Math.max(2, progressPercent)}%` }}
          />
        </div>

        {/* Progress Labels */}
        <div className="relative flex justify-between text-[11px] text-[#71717a] pt-0.5">
          <span>0 (Free start)</span>
          <span
            className="absolute -translate-x-1/2 font-semibold text-[#0a0a0a]"
            style={{ left: '70%' }}
          >
            50 (Threshold)
          </span>
          <span>Billable zone ($0.05/order)</span>
        </div>
      </div>

      {/* Threshold Specific Alerts & Callouts */}
      {isApproaching && !isPast && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-[13px] text-amber-900">
          <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">You&apos;re approaching your free monthly limit</span>
            <p className="text-amber-800 leading-relaxed text-[12px]">
              You have used {effectiveCount} of 50 free orders. If your store processes more than 50 counted orders this month, all counted orders will be billed at $0.05 each.
            </p>
          </div>
        </div>
      )}

      {isAtThreshold && !isPast && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-start gap-3 text-[13px] text-amber-900">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-[14px]">You&apos;ve reached your free monthly limit</span>
            <p className="text-amber-800 leading-relaxed text-[13px]">
              Your current estimated charge is <strong>$0.00</strong>. Your next counted order will activate usage-based billing for all counted orders this month.
            </p>
            <div className="pt-1 font-mono text-[12px] text-amber-900 font-semibold">
              Example: 51 orders × $0.05 = $2.55
            </div>
          </div>
        </div>
      )}

      {isFirstBillable && !isPast && (
        <div className="p-4 bg-purple-50 border-2 border-[#5f3ed8]/30 rounded-xl flex items-start gap-3 text-[13px] text-purple-900">
          <Zap className="size-5 text-[#5f3ed8] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-[14px]">Usage-based billing is now active</span>
            <p className="text-purple-800 leading-relaxed text-[13px]">
              Your store has processed 51 counted orders this month. Each counted order is billed at $0.05.
            </p>
            <div className="pt-1 font-mono text-[13px] font-bold text-[#5f3ed8]">
              51 orders × $0.05 = $2.55
            </div>
          </div>
        </div>
      )}

      {!isFree && !isFirstBillable && (
        <div className="p-3.5 bg-zinc-50 border border-[#ebebeb] rounded-xl flex items-center justify-between text-[13px]">
          <div className="flex items-center gap-2 text-[#71717a]">
            <Info className="size-4 text-[#5f3ed8]" />
            <span>
              Billing formula:{' '}
              <strong className="text-[#0a0a0a] font-mono">
                {effectiveCount} orders × ${PRICE_PER_ORDER.toFixed(2)} = ${charge.toFixed(2)}
              </strong>
            </span>
          </div>
          <span className="text-[12px] text-[#71717a] hidden sm:inline">
            Updates in real time as store orders sync
          </span>
        </div>
      )}
    </div>
  );
}
