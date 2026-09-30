'use client';

import React, { useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { UsageOrder, BillingPeriod } from '@/lib/billing/billing-types';
import { FREE_ORDER_THRESHOLD, calculateEstimatedCharge } from '@/lib/billing/billing-data';

interface OrderUsageTabProps {
  orders: UsageOrder[];
  countedOrdersCount: number;
  excludedOrdersCount: number;
  underReviewOrdersCount: number;
  period: BillingPeriod;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  billingFilter: 'all' | 'counted' | 'excluded' | 'under_review';
  onBillingFilterChange: (f: 'all' | 'counted' | 'excluded' | 'under_review') => void;
  storeStatusFilter: string;
  onStoreStatusFilterChange: (s: string) => void;
  currentPage: number;
  onPageChange: (p: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onSelectOrder: (order: UsageOrder) => void;
}

export function OrderUsageTab({
  orders,
  countedOrdersCount,
  excludedOrdersCount,
  underReviewOrdersCount,
  period,
  searchQuery,
  onSearchChange,
  billingFilter,
  onBillingFilterChange,
  storeStatusFilter,
  onStoreStatusFilterChange,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onSelectOrder,
}: OrderUsageTabProps) {
  const isPast = period.status !== 'open';
  const effectiveCounted = isPast ? period.countedOrders : countedOrdersCount;
  const isBillable = effectiveCounted > FREE_ORDER_THRESHOLD;
  const estimatedCharge = isPast
    ? period.finalCharge ?? calculateEstimatedCharge(effectiveCounted)
    : calculateEstimatedCharge(effectiveCounted);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // 1. Billing status filter
      if (billingFilter !== 'all' && ord.billingStatus !== billingFilter) {
        return false;
      }
      // 2. Store status filter
      if (storeStatusFilter !== 'all' && ord.storeStatus !== storeStatusFilter) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesNumber = ord.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = ord.customerName.toLowerCase().includes(q);
        const matchesEmail = ord.customerEmail?.toLowerCase().includes(q);
        if (!matchesNumber && !matchesCustomer && !matchesEmail) {
          return false;
        }
      }
      return true;
    });
  }, [orders, billingFilter, storeStatusFilter, searchQuery]);

  // Pagination
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* 1. Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Total synced
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] block mt-0.5">
            {orders.length}
          </span>
        </div>

        <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Counted orders
          </span>
          <span className="text-[20px] font-bold text-emerald-600 block mt-0.5">
            {effectiveCounted}
          </span>
        </div>

        <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Excluded orders
          </span>
          <span className="text-[20px] font-bold text-[#71717a] block mt-0.5">
            {excludedOrdersCount}
          </span>
        </div>

        <div className="p-4 bg-white border border-[#ebebeb] rounded-xl shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Under review
          </span>
          <span className="text-[20px] font-bold text-amber-600 block mt-0.5">
            {underReviewOrdersCount}
          </span>
        </div>

        <div className="p-4 bg-purple-50/60 border border-purple-200/60 rounded-xl shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5f3ed8]">
            {isPast ? 'Final charge' : 'Estimated charge'}
          </span>
          <span className="text-[20px] font-bold text-[#5f3ed8] block mt-0.5">
            ${estimatedCharge.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex items-center flex-1 max-w-[380px] bg-zinc-50 border border-[#ebebeb] rounded-xl h-[38px] px-3">
            <Search className="size-4 text-[#71717a] mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by order number or customer..."
              className="w-full bg-transparent text-[13px] text-[#0a0a0a] placeholder-[#71717a] outline-none"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: `All (${orders.length})` },
                { id: 'counted', label: `Counted (${effectiveCounted})` },
                { id: 'excluded', label: `Excluded (${excludedOrdersCount})` },
                { id: 'under_review', label: `Under review (${underReviewOrdersCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onBillingFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer ${
                  billingFilter === tab.id
                    ? 'bg-[#5f3ed8] text-white border-[#5f3ed8] shadow-xs'
                    : 'bg-zinc-50 text-[#71717a] border-[#ebebeb] hover:bg-zinc-100 hover:text-[#0a0a0a]'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Store Order Status Filter Dropdown */}
            <select
              value={storeStatusFilter}
              onChange={(e) => onStoreStatusFilterChange(e.target.value)}
              className="h-[34px] px-2.5 bg-zinc-50 border border-[#ebebeb] rounded-xl text-[12px] font-medium text-[#71717a] outline-none cursor-pointer"
            >
              <option value="all">All store statuses</option>
              <option value="paid">Paid</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
              <option value="draft">Draft</option>
              <option value="test">Test</option>
            </select>
          </div>
        </div>

        {/* Informative Note */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#71717a] pt-1 border-t border-[#ebebeb]">
          <Info className="size-3.5 text-[#5f3ed8] shrink-0" />
          <span>
            Order totals are shown for identification only. Order value does not affect the usage fee.
          </span>
        </div>
      </div>

      {/* 3. Usage Table */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold uppercase tracking-wider text-[#71717a] h-[40px]">
                <th className="px-4 py-2 w-28">Order</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2 w-32">Order date</th>
                <th className="px-4 py-2 w-28 text-right">Order total</th>
                <th className="px-4 py-2 w-28">Store status</th>
                <th className="px-4 py-2">Billing status</th>
                <th className="px-4 py-2 text-right w-32">Usage charge</th>
                <th className="px-4 py-2 text-right w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#71717a]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ShoppingBag className="size-8 text-[#a1a1aa]" />
                      <span className="font-semibold text-[#0a0a0a]">
                        No orders found
                      </span>
                      <p className="text-[12px] text-[#71717a] max-w-sm">
                        No orders match the current search or filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord) => {
                  const isCounted = ord.billingStatus === 'counted';
                  const isExcluded = ord.billingStatus === 'excluded';
                  const isUnderReview = ord.billingStatus === 'under_review';

                  const displayedCharge = isCounted
                    ? isBillable
                      ? '$0.05'
                      : '$0.00'
                    : isExcluded
                    ? '$0.00'
                    : 'Pending';

                  return (
                    <tr
                      key={ord.id}
                      onClick={() => onSelectOrder(ord)}
                      className="hover:bg-zinc-50 cursor-pointer transition-colors"
                    >
                      {/* Order Number */}
                      <td className="px-4 py-3 font-semibold text-[#0a0a0a] font-mono">
                        {ord.orderNumber}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#0a0a0a]">
                          {ord.customerName}
                        </div>
                        <div className="text-[11px] text-[#71717a] font-mono truncate max-w-[200px]">
                          {ord.customerEmail}
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="px-4 py-3 text-[#71717a] text-[12px] whitespace-nowrap">
                        {ord.orderDate}
                      </td>

                      {/* Order Total (Identifier only) */}
                      <td className="px-4 py-3 text-right font-mono text-[#71717a] text-[12px]">
                        ${ord.orderTotal.toFixed(2)}
                      </td>

                      {/* Store Status */}
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#71717a] px-2 py-0.5 bg-zinc-100 rounded">
                          {ord.storeStatus}
                        </span>
                      </td>

                      {/* Billing Status */}
                      <td className="px-4 py-3">
                        {isCounted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="size-3" />
                            {isBillable ? 'Counted' : 'Free usage'}
                          </span>
                        ) : isExcluded ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-[#71717a]">
                            <XCircle className="size-3" />
                            Excluded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="size-3" />
                            Under review
                          </span>
                        )}
                      </td>

                      {/* Usage Charge */}
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        <span
                          className={
                            isCounted && isBillable
                              ? 'text-[#5f3ed8]'
                              : isUnderReview
                              ? 'text-amber-600 font-sans text-[11px]'
                              : 'text-[#71717a]'
                          }
                        >
                          {displayedCharge}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectOrder(ord);
                          }}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#5f3ed8] hover:underline cursor-pointer"
                        >
                          <Eye className="size-3" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 border-t border-[#ebebeb] bg-[#f7f7f8] text-[12px] text-[#71717a]">
          <div className="flex items-center gap-2">
            <span>
              Showing {totalItems > 0 ? startIndex + 1 : 0} to{' '}
              {Math.min(startIndex + pageSize, totalItems)} of {totalItems} orders
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="bg-white border border-[#ebebeb] rounded-lg px-2 py-1 text-[12px] outline-none cursor-pointer"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="size-8 rounded-lg border border-[#ebebeb] bg-white hover:bg-zinc-50 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="size-8 rounded-lg border border-[#ebebeb] bg-white hover:bg-zinc-50 disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
