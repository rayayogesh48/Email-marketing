'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

interface BillingExplanationCardProps {
  onOpenRules: () => void;
}

export function BillingExplanationCard({ onOpenRules }: BillingExplanationCardProps) {
  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              How billing works
            </h3>
          </div>
          <p className="text-[13px] text-[#71717a] leading-relaxed max-w-[620px]">
            Your first 50 monthly orders are free. If your store processes more than 50 counted orders, all counted orders that month are billed at $0.05 each.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRules}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#5f3ed8] hover:underline shrink-0 pt-0.5 cursor-pointer"
        >
          <span>View counted-order rules</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#ebebeb] text-[12px]">
        <div className="flex items-start gap-2 text-[#71717a]">
          <ShieldCheck className="size-4 text-[#5f3ed8] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#0a0a0a]">Fixed usage fee:</strong> Not a commission. Order total, revenue, and cart discounts do not affect your fee.
          </span>
        </div>
        <div className="flex items-start gap-2 text-[#71717a]">
          <DollarSign className="size-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#0a0a0a]">Predictable pricing:</strong> Cancelled, refunded, draft, and test orders are automatically excluded from billing.
          </span>
        </div>
      </div>
    </div>
  );
}
