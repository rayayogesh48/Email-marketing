'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UsageOrder } from '@/lib/billing/billing-types';
import { billingStore } from '@/lib/billing/billing-store';
import { toast } from 'sonner';
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ShoppingBag,
  User,
  Calendar,
  ShieldAlert,
} from 'lucide-react';

interface OrderDetailSheetProps {
  order: UsageOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailSheet({ order, open, onOpenChange }: OrderDetailSheetProps) {
  if (!order) return null;

  const handleManualExclude = () => {
    billingStore.excludeOneOrder();
    toast.success(`Order ${order.orderNumber} excluded from billing. Billing charge updated.`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-full overflow-y-auto bg-white p-6">
        <SheetHeader className="text-left pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center font-bold text-xs">
                #
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-[#0a0a0a]">
                  Order {order.orderNumber}
                </SheetTitle>
                <SheetDescription className="text-xs text-[#71717a]">
                  Placed on {order.orderDate}
                </SheetDescription>
              </div>
            </div>

            {order.billingStatus === 'counted' && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Counted
              </Badge>
            )}
            {order.billingStatus === 'excluded' && (
              <Badge variant="outline" className="bg-zinc-100 text-zinc-600 border-zinc-200 font-medium">
                <XCircle className="h-3 w-3 mr-1 text-zinc-400" />
                Excluded
              </Badge>
            )}
            {order.billingStatus === 'under_review' && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-medium">
                <Clock className="h-3 w-3 mr-1" />
                Under Review
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-sm">
          {/* Billing impact banner */}
          {order.billingStatus === 'counted' && (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                <DollarSign className="h-4 w-4 shrink-0" />
                Billed at $0.05 (Cycle active)
              </div>
              <p className="text-xs text-emerald-700">
                This completed order was registered within the current monthly billing period and is included in the counted order total.
              </p>
            </div>
          )}

          {order.billingStatus === 'excluded' && (
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <div className="flex items-center gap-2 text-zinc-800 font-semibold text-xs">
                <XCircle className="h-4 w-4 text-zinc-500 shrink-0" />
                No charge: {order.exclusionReason || 'Excluded from billing'}
              </div>
              <p className="text-xs text-zinc-600">
                This order was not counted toward your billing tier. Excluded orders do not impact your free order threshold or monthly total.
              </p>
            </div>
          )}

          {order.billingStatus === 'under_review' && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                <Clock className="h-4 w-4 shrink-0" />
                Pending Verification
              </div>
              <p className="text-xs text-amber-700">
                Awaiting fraud verification and webhook synchronization. If confirmed valid, it will be added to this cycle&apos;s counted orders.
              </p>
            </div>
          )}

          {/* Order Details Grid */}
          <div className="rounded-xl border border-[#ebebeb] p-4 space-y-3.5 bg-white">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#71717a]">
              Customer & Order Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-zinc-400" /> Customer
                </span>
                <p className="font-medium text-[#0a0a0a]">{order.customerName}</p>
                <p className="text-[#71717a] text-[11px] truncate">{order.customerEmail}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5">
                  <ShoppingBag className="h-3.5 w-3.5 text-zinc-400" /> Order Total
                </span>
                <p className="font-semibold text-[#0a0a0a] text-sm">
                  ${order.orderTotal.toFixed(2)} {order.currency}
                </p>
                <p className="text-[#71717a] text-[11px] capitalize">{order.storeStatus}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" /> Order Date
                </span>
                <p className="font-medium text-[#0a0a0a]">{order.orderDate}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#71717a] flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-zinc-400" /> Billing Charge
                </span>
                <p className="font-medium text-[#0a0a0a]">
                  {order.billingStatus === 'counted' ? '$0.05' : '$0.00'}
                </p>
              </div>
            </div>
          </div>

          {/* External links and manual dispute/exclude */}
          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              className="w-full justify-between h-9 text-xs border-[#ebebeb] hover:bg-[#f4f4f5] text-[#0a0a0a] cursor-pointer"
              onClick={() => {
                window.open(`https://admin.shopify.com/store/northstargoods/orders/${order.id}`, '_blank');
              }}
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5 text-zinc-500" />
                View order in Shopify Admin
              </span>
              <span className="text-[11px] text-[#71717a]">shopify.com</span>
            </Button>

            {order.billingStatus === 'counted' && (
              <div className="p-3 bg-red-50/50 border border-red-200/60 rounded-xl space-y-2">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-red-800">
                      Dispute or manually exclude order
                    </h5>
                    <p className="text-[11px] text-red-700/80 leading-relaxed mt-0.5">
                      If this was an internal staff test or anomalous order not filtered by Shopify, you can exclude it from your counted total.
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleManualExclude}
                  className="w-full h-8 text-xs bg-red-600 hover:bg-red-700 text-white font-medium cursor-pointer"
                >
                  Exclude from billing count
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
