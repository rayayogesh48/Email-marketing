'use client';

import React from 'react';
import { RefreshCw, CreditCard, ShieldAlert } from 'lucide-react';
import { BillingPermission } from '@/lib/billing/billing-types';

interface PaymentFailureAlertProps {
  isVisible: boolean;
  isRetrying: boolean;
  gracePeriodEndsAt?: string;
  permission: BillingPermission;
  amount: number;
  onRetryPayment: () => void;
  onUpdatePaymentMethod: () => void;
}

export function PaymentFailureAlert({
  isVisible,
  isRetrying,
  gracePeriodEndsAt = '7 October 2026',
  permission,
  amount,
  onRetryPayment,
  onUpdatePaymentMethod,
}: PaymentFailureAlertProps) {
  if (!isVisible) return null;

  const canManagePayment = permission === 'owner' || permission === 'billing_admin';

  return (
    <div className="rounded-2xl border-2 border-red-300 bg-red-50/80 p-5 shadow-xs space-y-3 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="size-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="size-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-red-950">
              Your payment failed
            </h3>
            <p className="text-[13px] text-red-800 mt-1 leading-relaxed max-w-[620px]">
              We couldn&apos;t process your usage charge of ${amount > 0 ? amount.toFixed(2) : '19.20'}. Your store data remains safe, but please update your payment method before {gracePeriodEndsAt} to avoid service disruption.
            </p>
            {!canManagePayment && (
              <p className="text-[12px] text-red-700 mt-2 font-medium">
                Only the account owner or billing admin can update payment methods or retry payments.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
          <button
            type="button"
            disabled={!canManagePayment || isRetrying}
            onClick={onUpdatePaymentMethod}
            className="flex items-center gap-1.5 h-[36px] px-3.5 bg-white border border-red-200 hover:bg-red-50 text-[13px] font-semibold text-red-900 rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <CreditCard className="size-3.5" />
            <span>Update payment method</span>
          </button>

          <button
            type="button"
            disabled={!canManagePayment || isRetrying}
            onClick={onRetryPayment}
            className="flex items-center gap-1.5 h-[36px] px-4 bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Try payment again'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
