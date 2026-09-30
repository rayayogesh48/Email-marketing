'use client';

import React from 'react';
import {
  CreditCard,
  ExternalLink,
  AlertTriangle,
  Plus,
  Building,
} from 'lucide-react';
import { PaymentDetails, BillingPermission } from '@/lib/billing/billing-types';

interface PaymentDetailsTabProps {
  paymentDetails: PaymentDetails;
  permission: BillingPermission;
  onOpenPaymentModal: () => void;
  onSwitchBillingMode: (mode: 'platform' | 'direct') => void;
}

export function PaymentDetailsTab({
  paymentDetails,
  permission,
  onOpenPaymentModal,
  onSwitchBillingMode,
}: PaymentDetailsTabProps) {
  const canManage = permission === 'owner' || permission === 'billing_admin';
  const isPlatform = paymentDetails.billingMode === 'platform';
  const isExpiring = paymentDetails.status === 'expiring_soon';
  const hasMethod = paymentDetails.hasPaymentMethod;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Mode Switcher Toggle (Prototype control) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-zinc-50 border border-[#ebebeb] rounded-2xl text-[13px]">
        <div>
          <span className="font-semibold text-[#0a0a0a] block">
            Billing mode
          </span>
          <span className="text-[12px] text-[#71717a]">
            {isPlatform
              ? 'App charges approved and processed via Shopify Billing API.'
              : 'Direct credit card payment processed via merchant gateway.'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#ebebeb] rounded-xl">
          <button
            type="button"
            onClick={() => onSwitchBillingMode('platform')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              isPlatform
                ? 'bg-[#5f3ed8] text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#0a0a0a]'
            }`}
          >
            Platform (Shopify)
          </button>
          <button
            type="button"
            onClick={() => onSwitchBillingMode('direct')}
            className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              !isPlatform
                ? 'bg-[#5f3ed8] text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#0a0a0a]'
            }`}
          >
            Direct billing
          </button>
        </div>
      </div>

      {/* Permissions Callout for Staff */}
      {!canManage && (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-[12px] text-amber-800">
          Only the account owner or billing admin can manage payment details and billing methods.
        </div>
      )}

      {/* 1. Platform-Managed Billing (Shopify Mode) */}
      {isPlatform ? (
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Building className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#0a0a0a]">
                  Managed through Shopify
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <p className="text-[13px] text-[#71717a] mt-1 leading-relaxed max-w-[560px]">
                Your monthly usage charges, payment method approvals, and invoices are managed directly inside your Shopify store administration.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ebebeb] flex items-center justify-between">
            <span className="text-[12px] text-[#71717a]">
              Connected store: <strong>Northstar Goods</strong> (Shopify Plus)
            </span>

            <a
              href="https://admin.shopify.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 h-[36px] px-4 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-xl text-[13px] font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <span>Open Shopify billing</span>
              <ExternalLink className="size-3.5 text-[#71717a]" />
            </a>
          </div>
        </div>
      ) : (
        /* 2. Direct Billing Mode */
        <div className="space-y-4">
          {/* Card Expiring Soon Alert */}
          {isExpiring && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-[13px] text-amber-900">
              <AlertTriangle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Your card expires soon</span>
                <p className="text-amber-800 text-[12px] mt-0.5">
                  Update your payment method to avoid interrupted billing when your monthly usage invoice is processed.
                </p>
              </div>
              <button
                type="button"
                disabled={!canManage}
                onClick={onOpenPaymentModal}
                className="h-[30px] px-3 bg-white border border-amber-300 rounded-lg text-[12px] font-semibold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Update card
              </button>
            </div>
          )}

          {/* If No Payment Method Configured */}
          {!hasMethod ? (
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-7 text-center shadow-xs space-y-3">
              <div className="size-12 rounded-2xl bg-zinc-100 text-[#71717a] flex items-center justify-center mx-auto">
                <CreditCard className="size-6" />
              </div>
              <h3 className="text-[17px] font-bold text-[#0a0a0a]">
                Add a payment method
              </h3>
              <p className="text-[13px] text-[#71717a] max-w-md mx-auto leading-relaxed">
                Your current order usage is still tracked. Add a credit card before your first billable invoice of 51+ orders is due.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!canManage}
                  onClick={onOpenPaymentModal}
                  className="inline-flex items-center gap-1.5 h-[38px] px-5 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-xl text-[13px] font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>Add payment method</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Card Details Card */
            <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-purple-50 text-[#5f3ed8] flex items-center justify-center shrink-0">
                    <CreditCard className="size-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-bold text-[#0a0a0a]">
                        {paymentDetails.brand?.toUpperCase() || 'Visa'} ending in {paymentDetails.last4 || '4242'}
                      </h3>
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Default
                      </span>
                    </div>
                    <p className="text-[13px] text-[#71717a]">
                      Expires {paymentDetails.expiryMonth ? String(paymentDetails.expiryMonth).padStart(2, '0') : '08'}/
                      {paymentDetails.expiryYear || '2028'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canManage}
                    onClick={onOpenPaymentModal}
                    className="h-[36px] px-4 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Update payment method
                  </button>
                </div>
              </div>

              {/* Billing Contact Details */}
              <div className="pt-4 border-t border-[#ebebeb] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
                    Billing Contact Name
                  </span>
                  <span className="font-semibold text-[#0a0a0a] mt-0.5 block">
                    {paymentDetails.billingName || 'Olivia Morgan'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a] block">
                    Billing Notification Email
                  </span>
                  <span className="font-mono text-[#0a0a0a] mt-0.5 block">
                    {paymentDetails.billingEmail || 'billing@northstargoods.com'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
