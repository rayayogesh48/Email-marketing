'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { CheckCircle2, XCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CountedOrderRulesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CountedOrderRulesSheet({ open, onOpenChange }: CountedOrderRulesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full overflow-y-auto bg-white p-6">
        <SheetHeader className="text-left pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-lg font-semibold text-[#0a0a0a]">
                Counted-Order Rules
              </SheetTitle>
              <SheetDescription className="text-xs text-[#71717a]">
                How Reloopin calculates counted store orders for billing
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm text-[#0a0a0a]">
          {/* Summary Box */}
          <div className="rounded-xl p-4 bg-[#f8f7ff] border border-[#e5e1fc] text-xs text-[#5f3ed8] leading-relaxed">
            <strong>Key rule:</strong> Billing is solely determined by the number of valid customer orders processed by your connected store in the billing cycle. The first 50 orders are free. At 51+ orders, you are charged $0.05 per counted order for the entire month.
          </div>

          {/* Section 1: What counts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Counted toward billing
              </Badge>
              <span className="text-xs text-[#71717a] font-medium">Included in monthly count</span>
            </div>
            <ul className="space-y-2 text-xs text-[#52525b]">
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Completed & Paid Orders</strong>
                  Standard transactions successfully processed by your checkout and marked as paid.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Unfulfilled & Partially Fulfilled Orders</strong>
                  Orders awaiting packaging or partial dispatch that have valid payments.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Draft Orders Converted to Sales</strong>
                  Invoice or manual wholesale draft orders once converted and paid by the customer.
                </div>
              </li>
            </ul>
          </div>

          {/* Section 2: What is excluded */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-zinc-50 text-zinc-600 border-zinc-200 font-medium">
                <XCircle className="h-3 w-3 mr-1 text-zinc-400" />
                Excluded (No Charge)
              </Badge>
              <span className="text-xs text-[#71717a] font-medium">Never billed</span>
            </div>
            <ul className="space-y-2 text-xs text-[#52525b]">
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <XCircle className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Cancelled & Voided Orders</strong>
                  Orders that were cancelled before delivery or voided prior to settlement.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <XCircle className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Full Refunds (in same cycle)</strong>
                  Orders fully returned or refunded within the active billing cycle are automatically deducted.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <XCircle className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Test & Sandbox Orders</strong>
                  Orders placed using Bogus Gateway, Shopify payments test mode, or test customer emails.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <XCircle className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Fraud & High-Risk Orders</strong>
                  Orders flagged by store fraud detection algorithms or chargeback investigations.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#fcfcfc] p-2.5 rounded-lg border border-[#f0f0f0]">
                <XCircle className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-[#0a0a0a] font-semibold block">Duplicate Webhooks</strong>
                  Idempotent sync events preventing accidental double-counting.
                </div>
              </li>
            </ul>
          </div>

          {/* Section 3: Under Review */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Under Review
              </Badge>
              <span className="text-xs text-[#71717a] font-medium">Temporary holding state</span>
            </div>
            <div className="bg-[#fcfcfc] p-3 rounded-lg border border-[#f0f0f0] text-xs text-[#52525b] space-y-2">
              <p>
                Recent orders placed within the last 2 hours may temporarily show as <strong>Under Review</strong> while awaiting:
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-500 pl-1">
                <li>Automated fraud analysis from payment gateway</li>
                <li>Store webhook confirmation & status reconciliation</li>
                <li>Settlement confirmation</li>
              </ul>
              <p className="text-[11px] text-[#71717a] pt-1">
                Under-review orders are neither billed nor excluded until their status resolves, typically within 15 to 45 minutes.
              </p>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#ebebeb] text-xs text-[#71717a] flex items-start gap-2">
            <HelpCircle className="h-4 w-4 shrink-0 text-[#71717a] mt-0.5" />
            <span>
              Have questions about order exclusion or believe an order was miscounted? Contact support anytime or review the order details in your Order Usage tab.
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
