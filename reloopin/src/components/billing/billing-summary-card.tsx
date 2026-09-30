'use client';

import React from 'react';
import { BillingPeriod, PaymentDetails } from '@/lib/billing/billing-types';
import { PRICE_PER_ORDER, FREE_ORDER_THRESHOLD, calculateEstimatedCharge } from '@/lib/billing/billing-data';

interface BillingSummaryCardProps {
  period: BillingPeriod;
  countedOrders: number;
  excludedOrders: number;
  paymentDetails: PaymentDetails;
}

export function BillingSummaryCard({
  period,
  countedOrders,
  excludedOrders,
  paymentDetails,
}: BillingSummaryCardProps) {
  const isPast = period.status !== 'open';
  const effectiveCounted = isPast ? period.countedOrders : countedOrders;
  const charge = isPast
    ? period.finalCharge ?? calculateEstimatedCharge(effectiveCounted)
    : calculateEstimatedCharge(effectiveCounted);

  const billingMethodText =
    paymentDetails.billingMode === 'platform'
      ? 'Shopify billing'
      : paymentDetails.hasPaymentMethod && paymentDetails.last4
      ? `${paymentDetails.brand?.toUpperCase() || 'Card'} ending in ${paymentDetails.last4}`
      : 'No payment method configured';

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-[16px] font-bold text-[#0a0a0a]">
        Billing summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
        <div className="space-y-1">
          <span className="text-[#71717a] block text-[11px] font-bold uppercase tracking-wider">
            Billing Period
          </span>
          <span className="font-semibold text-[#0a0a0a] block">
            {period.name}
          </span>
          <span className="text-[11px] text-[#71717a] block">
            {period.startsAt} – {period.endsAt}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#71717a] block text-[11px] font-bold uppercase tracking-wider">
            Counted Orders
          </span>
          <span className="font-semibold text-[#0a0a0a] block">
            {effectiveCounted.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#71717a] block">
            {excludedOrders} excluded from billing
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#71717a] block text-[11px] font-bold uppercase tracking-wider">
            Rate Per Order
          </span>
          <span className="font-semibold text-[#0a0a0a] block">
            ${PRICE_PER_ORDER.toFixed(2)} / order
          </span>
          <span className="text-[11px] text-[#71717a] block">
            First {FREE_ORDER_THRESHOLD} orders free
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[#71717a] block text-[11px] font-bold uppercase tracking-wider">
            {isPast ? 'Final Charge' : 'Estimated Charge'}
          </span>
          <span className="font-bold text-[#0a0a0a] text-[15px] block">
            ${charge.toFixed(2)}
          </span>
          <span className="text-[11px] text-[#71717a] block">
            {isPast ? 'Invoiced & settled' : 'Due on Oct 1, 2026'}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-[#ebebeb] flex flex-col sm:flex-row sm:items-center justify-between text-[12px] text-[#71717a] gap-2">
        <div>
          Payment method:{' '}
          <strong className="text-[#0a0a0a]">
            {billingMethodText}
          </strong>
        </div>
        <div>
          Next invoice date:{' '}
          <strong className="text-[#0a0a0a]">
            {isPast ? 'Closed' : '1 October 2026'}
          </strong>
        </div>
      </div>
    </div>
  );
}
