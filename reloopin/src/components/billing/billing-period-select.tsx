'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { BillingPeriod } from '@/lib/billing/billing-types';

interface BillingPeriodSelectProps {
  periods: BillingPeriod[];
  selectedPeriodId: string;
  onSelectPeriod: (periodId: string) => void;
}

export function BillingPeriodSelect({
  periods,
  selectedPeriodId,
  onSelectPeriod,
}: BillingPeriodSelectProps) {
  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId) || periods[0];
  const isPast = selectedPeriod.status !== 'open';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white border border-[#ebebeb] rounded-2xl shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-zinc-100 text-[#71717a] flex items-center justify-center">
          <Calendar className="size-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
            Billing period
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold text-[#0a0a0a]">
              {selectedPeriod.name}
            </span>
            {isPast ? (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-[#71717a]">
                Closed • {selectedPeriod.finalCharge === 0 ? 'Free tier' : `$${(selectedPeriod.finalCharge || 0).toFixed(2)}`}
              </span>
            ) : (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Current month • Open
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedPeriodId}
          onChange={(e) => onSelectPeriod(e.target.value)}
          className="h-[36px] pl-3 pr-8 bg-zinc-50 border border-[#ebebeb] rounded-xl text-[13px] font-medium text-[#0a0a0a] outline-none focus:border-[#5f3ed8] cursor-pointer appearance-none"
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.name} {period.status === 'open' ? '(Current)' : `• ${period.finalCharge === 0 ? 'Free ($0.00)' : `$${period.finalCharge?.toFixed(2)}`}`}
            </option>
          ))}
        </select>
        <ChevronDown className="size-4 text-[#71717a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
