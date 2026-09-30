'use client';

import React from 'react';
import { PlusCircle, MinusCircle, RefreshCw, Receipt, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BillingActivityItem } from '@/lib/billing/billing-types';

interface BillingActivityTimelineProps {
  items: BillingActivityItem[];
}

export function BillingActivityTimeline({ items }: BillingActivityTimelineProps) {
  const getIcon = (type: BillingActivityItem['type']) => {
    switch (type) {
      case 'order_added':
        return <PlusCircle className="size-3.5 text-[#5f3ed8]" />;
      case 'order_excluded':
        return <MinusCircle className="size-3.5 text-amber-600" />;
      case 'count_recalculated':
        return <RefreshCw className="size-3.5 text-blue-600" />;
      case 'invoice_created':
        return <Receipt className="size-3.5 text-[#71717a]" />;
      case 'payment_success':
        return <CheckCircle2 className="size-3.5 text-emerald-600" />;
      case 'payment_failed':
        return <AlertTriangle className="size-3.5 text-red-600" />;
      default:
        return <RefreshCw className="size-3.5 text-[#71717a]" />;
    }
  };

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-4">
      <div>
        <h3 className="text-[16px] font-bold text-[#0a0a0a]">
          Billing activity & adjustments
        </h3>
        <p className="text-[12px] text-[#71717a] mt-0.5">
          Audit log of recent order synchronizations, refunds, and recalculations.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {items.slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] text-[13px]"
          >
            <div className="mt-0.5 size-7 rounded-lg bg-white border border-[#ebebeb] flex items-center justify-center shrink-0">
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-[#0a0a0a]">
                  {item.title}
                </span>
                <span className="text-[11px] text-[#71717a] shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-[12px] text-[#71717a] mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
