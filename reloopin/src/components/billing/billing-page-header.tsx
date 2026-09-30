'use client';

import React from 'react';
import { BillingTab, BillingPermission } from '@/lib/billing/billing-types';
import { ArrowRight, BarChart3, Receipt, CreditCard, LayoutDashboard } from 'lucide-react';

interface BillingPageHeaderProps {
  activeTab: BillingTab;
  onTabChange: (tab: BillingTab) => void;
  onViewOrderUsage: () => void;
  permission: BillingPermission;
  countedOrdersCount: number;
}

export function BillingPageHeader({
  activeTab,
  onTabChange,
  onViewOrderUsage,
  permission,
  countedOrdersCount,
}: BillingPageHeaderProps) {
  const tabs: { id: BillingTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'usage', label: 'Order usage', icon: BarChart3 },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'payment', label: 'Payment details', icon: CreditCard },
  ];

  return (
    <div className="space-y-5 pb-2">
      {/* Title & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[24px] font-bold tracking-tight text-[#0a0a0a]">
              Billing
            </h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-[#5f3ed8] border border-[#5f3ed8]/20">
              Usage-based
            </span>
          </div>
          <p className="text-[14px] text-[#71717a] mt-1">
            Track monthly order usage, estimated charges, payment details, and invoices.
          </p>
        </div>

        {activeTab !== 'usage' && (
          <button
            type="button"
            onClick={onViewOrderUsage}
            className="flex items-center gap-1.5 h-[36px] px-4 bg-white border border-[#ebebeb] hover:bg-[#fafafa] text-[#0a0a0a] rounded-xl text-[13px] font-medium shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View order usage</span>
            <ArrowRight className="size-3.5 text-[#71717a]" />
          </button>
        )}
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-1 border-b border-[#ebebeb] overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium border-b-2 -mb-[1px] transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#5f3ed8] text-[#5f3ed8] font-semibold'
                  : 'border-transparent text-[#71717a] hover:text-[#0a0a0a]'
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.id === 'usage' && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#5f3ed8]/10 text-[#5f3ed8]'
                      : 'bg-zinc-100 text-[#71717a]'
                  }`}
                >
                  {countedOrdersCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
