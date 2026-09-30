'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { UsageOrder } from '@/lib/billing/billing-types';

interface RecentUsageTableProps {
  orders: UsageOrder[];
  onViewAllOrders: () => void;
  onSelectOrder: (order: UsageOrder) => void;
}

export function RecentUsageTable({
  orders,
  onViewAllOrders,
  onSelectOrder,
}: RecentUsageTableProps) {
  const recentFive = orders.slice(0, 5);

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-[#0a0a0a]">
            Recent order activity
          </h3>
          <p className="text-[12px] text-[#71717a] mt-0.5">
            Latest synchronized orders and their billing contribution.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllOrders}
          className="flex items-center gap-1 text-[13px] font-semibold text-[#5f3ed8] hover:underline cursor-pointer"
        >
          <span>View all order usage</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      <div className="border border-[#ebebeb] rounded-xl overflow-hidden text-[13px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold uppercase tracking-wider text-[#71717a] h-[36px]">
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Billing status</th>
              <th className="px-4 py-2 text-right">Usage charge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebebeb]">
            {recentFive.map((order) => {
              const isCounted = order.billingStatus === 'counted';
              const isExcluded = order.billingStatus === 'excluded';

              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className="hover:bg-zinc-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-[#0a0a0a] font-mono">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-[#0a0a0a]">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3 text-[#71717a] text-[12px]">
                    {order.orderDate}
                  </td>
                  <td className="px-4 py-3">
                    {isCounted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3" />
                        {order.usageCharge > 0 ? 'Counted ($0.05)' : 'Free usage ($0.00)'}
                      </span>
                    ) : isExcluded ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-[#71717a]">
                        <XCircle className="size-3" />
                        Excluded ($0.00)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="size-3" />
                        Under review
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-[#0a0a0a]">
                    {order.usageCharge > 0 ? `$${order.usageCharge.toFixed(2)}` : '$0.00'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
