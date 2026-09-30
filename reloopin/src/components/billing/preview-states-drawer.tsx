'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { billingStore, BillingStoreState } from '@/lib/billing/billing-store';
import { BillingPreviewState, BillingSyncStatus, PaymentMethodStatus, BillingPermission } from '@/lib/billing/billing-types';
import { calculateEstimatedCharge } from '@/lib/billing/billing-data';
import {
  Sparkles,
  RotateCcw,
  Plus,
  Minus,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { toast } from 'sonner';

interface PreviewStatesDrawerProps {
  store: BillingStoreState;
}

export function PreviewStatesDrawer({ store }: PreviewStatesDrawerProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleApplyPreset = (state: BillingPreviewState) => {
    billingStore.setPreviewState(state);
    toast.info(`Preset applied: ${state.replace(/_/g, ' ')}`);

    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', store.activeTab);
    params.set('state', state);
    router.replace(`/settings/billing?${params.toString()}`, { scroll: false });
  };

  const handleAddOrders = (count: number) => {
    billingStore.addCountedOrders(count);
    const newTotal = store.countedOrdersCount + count;
    toast.success(`Added ${count} counted orders. New count: ${newTotal}`);
  };

  const handleSubtractOrder = () => {
    if (store.countedOrdersCount <= 0) {
      toast.warning('Already at 0 counted orders');
      return;
    }
    billingStore.excludeOneOrder();
    toast.info(`Subtracted 1 order (refund simulation). New count: ${store.countedOrdersCount - 1}`);
  };

  const handleReset = () => {
    billingStore.resetPrototype();
    toast.success('Reset all billing prototype data to default (76 orders)');
    router.replace('/settings/billing?tab=overview', { scroll: false });
  };

  const estimated = calculateEstimatedCharge(store.countedOrdersCount);

  return (
    <>
      {/* Floating button at bottom-left */}
      <div className="fixed bottom-5 left-5 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-8 px-3 rounded-full bg-white/95 backdrop-blur border border-[#ebebeb] shadow-sm text-xs font-medium text-[#0a0a0a] hover:bg-[#fafafa] transition-all flex items-center gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#5f3ed8]" />
          <span>Preview states</span>
          <Badge
            variant="secondary"
            className="text-[10px] h-4 px-1 bg-[#5f3ed8]/10 text-[#5f3ed8] font-mono"
          >
            {store.countedOrdersCount} ord
          </Badge>
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="sm:max-w-md w-full overflow-y-auto bg-white p-6">
          <SheetHeader className="text-left pb-4 border-b border-[#ebebeb]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <SheetTitle className="text-base font-semibold text-[#0a0a0a]">
                    Billing State Simulator
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#71717a]">
                    Switch between usage levels, sync banners & errors
                  </SheetDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 text-xs text-[#71717a] hover:text-[#0a0a0a]"
                title="Reset to default prototype data"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </SheetHeader>

          <div className="mt-5 space-y-6 text-xs">
            {/* Live Status Pill */}
            <div className="p-3 rounded-xl bg-[#fafafa] border border-[#ebebeb] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#71717a] block font-medium">Current Active State</span>
                <span className="font-semibold text-sm text-[#0a0a0a]">
                  {store.countedOrdersCount} counted orders
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#71717a] block font-medium">Estimated Charge</span>
                <span className="font-bold text-sm text-[#5f3ed8]">
                  ${estimated.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quick Order Steppers */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a] block">
                Quick Order Adjustments
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddOrders(1)}
                  className="h-8 text-xs border-[#ebebeb] hover:bg-[#fafafa]"
                >
                  <Plus className="h-3 w-3 mr-1 text-emerald-600" /> +1 Order
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddOrders(10)}
                  className="h-8 text-xs border-[#ebebeb] hover:bg-[#fafafa]"
                >
                  <Plus className="h-3 w-3 mr-1 text-emerald-600" /> +10 Orders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubtractOrder}
                  className="h-8 text-xs border-[#ebebeb] hover:bg-[#fafafa] text-rose-600"
                >
                  <Minus className="h-3 w-3 mr-1" /> -1 (Refund)
                </Button>
              </div>
            </div>

            {/* Usage Threshold Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a] block">
                Usage & Pricing Thresholds
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: 'zero_orders',
                    name: '0 orders — Brand new store',
                    orders: 0,
                    cost: '$0.00',
                    desc: 'Free tier, progress at 0%',
                  },
                  {
                    id: 'safe_free',
                    name: '24 orders — Halfway in free tier',
                    orders: 24,
                    cost: '$0.00',
                    desc: '26 orders remaining in free allowance',
                  },
                  {
                    id: 'approaching_threshold',
                    name: '44 orders — Approaching threshold',
                    orders: 44,
                    cost: '$0.00',
                    desc: 'Warning state: 6 orders left before billing',
                  },
                  {
                    id: 'threshold_reached',
                    name: '50 orders — Exactly at threshold',
                    orders: 50,
                    cost: '$0.00 (Free)',
                    desc: 'Maximum free usage boundary reached',
                  },
                  {
                    id: 'first_billable',
                    name: '51 orders — Billing activated',
                    orders: 51,
                    cost: '$2.55 (51 × $0.05)',
                    desc: 'First order into billing tier (full month billed)',
                  },
                  {
                    id: 'active_billing',
                    name: '76 orders — Default prototype',
                    orders: 76,
                    cost: '$3.80 (76 × $0.05)',
                    desc: 'Standard active store usage scenario',
                  },
                  {
                    id: 'high_usage',
                    name: '1,420 orders — Enterprise store',
                    orders: 1420,
                    cost: '$71.00',
                    desc: 'Peak volume e-commerce merchant',
                  },
                ].map((preset) => {
                  const isSelected = store.countedOrdersCount === preset.orders;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id as BillingPreviewState)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#5f3ed8] bg-[#f8f7ff]'
                          : 'border-[#ebebeb] bg-white hover:bg-[#fafafa]'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-[#0a0a0a] text-xs">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                          {preset.desc}
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[11px] font-mono shrink-0 ml-2 ${
                          preset.cost.includes('Free') || preset.cost.includes('$0.00')
                            ? 'bg-zinc-100 text-zinc-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {preset.cost}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sync & Store Connectivity States */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a] block">
                Sync & Integration Edge States
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => billingStore.setSyncStatus('syncing')}
                  className={`h-8 text-xs border-[#ebebeb] justify-start ${
                    store.syncStatus === 'syncing' ? 'border-[#5f3ed8] bg-[#f8f7ff]' : ''
                  }`}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-blue-600 animate-spin" />
                  Sync in progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => billingStore.setSyncStatus('sync_delayed')}
                  className={`h-8 text-xs border-[#ebebeb] justify-start ${
                    store.syncStatus === 'sync_delayed' ? 'border-amber-500 bg-amber-50/50' : ''
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                  Sync delayed (&gt;2h)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => billingStore.setSyncStatus('calculation_failed')}
                  className={`h-8 text-xs border-[#ebebeb] justify-start ${
                    store.syncStatus === 'calculation_failed' ? 'border-rose-500 bg-rose-50/50' : ''
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-rose-600" />
                  Calculation failed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => billingStore.setSyncStatus('store_disconnected')}
                  className={`h-8 text-xs border-[#ebebeb] justify-start ${
                    store.syncStatus === 'store_disconnected' ? 'border-zinc-500 bg-zinc-100' : ''
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
                  Store disconnected
                </Button>
              </div>
            </div>

            {/* Payment & Permission States */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a] block">
                Payment & Access Modes
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (store.paymentFailureActive || store.paymentDetails.status === 'failed') {
                      billingStore.setPaymentStatus('valid', false);
                      toast.success('Payment status marked valid');
                    } else {
                      billingStore.setPaymentStatus('failed', true);
                      toast.error('Payment failure simulated');
                    }
                  }}
                  className={`h-8 text-xs border-[#ebebeb] justify-start ${
                    store.paymentFailureActive || store.paymentDetails.status === 'failed' ? 'border-rose-500 bg-rose-50/50 text-rose-700' : ''
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5 text-rose-600" />
                  {store.paymentFailureActive || store.paymentDetails.status === 'failed' ? 'Fix payment' : 'Fail payment'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newMode = store.paymentDetails.billingMode === 'platform' ? 'direct' : 'platform';
                    billingStore.setBillingMode(newMode);
                    toast.info(`Switched billing mode to: ${newMode}`);
                  }}
                  className="h-8 text-xs border-[#ebebeb] justify-start"
                >
                  <CreditCard className="h-3.5 w-3.5 mr-1.5 text-[#5f3ed8]" />
                  Toggle mode: {store.paymentDetails.billingMode === 'platform' ? 'Shopify' : 'Direct Card'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPerm: BillingPermission = store.permission === 'owner' ? 'staff' : 'owner';
                    billingStore.setPermission(newPerm);
                    toast.info(`Switched role permission: ${newPerm}`);
                  }}
                  className={`h-8 text-xs border-[#ebebeb] justify-start col-span-2 ${
                    store.permission === 'staff' ? 'border-amber-400 bg-amber-50/40' : ''
                  }`}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                  Toggle role: {store.permission === 'owner' ? 'Owner (Full access)' : 'Staff (Read-only)'}
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
