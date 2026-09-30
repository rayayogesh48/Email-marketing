'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BillingTab, UsageOrder, Invoice, BillingPreviewState } from '@/lib/billing/billing-types';
import { useBillingStore, billingStore } from '@/lib/billing/billing-store';
import { BillingPageHeader } from './billing-page-header';
import { PaymentFailureAlert } from './payment-failure-alert';
import { SyncStatusBanner } from './sync-status-banner';
import { BillingPeriodSelect } from './billing-period-select';
import { CurrentUsageCard } from './current-usage-card';
import { BillingExplanationCard } from './billing-explanation-card';
import { BillingSummaryCard } from './billing-summary-card';
import { UsageTrendChart } from './usage-trend-chart';
import { RecentUsageTable } from './recent-usage-table';
import { BillingActivityTimeline } from './billing-activity-timeline';
import { OrderUsageTab } from './order-usage-tab';
import { InvoicesTab } from './invoices-tab';
import { PaymentDetailsTab } from './payment-details-tab';
import { CountedOrderRulesSheet } from './counted-order-rules-sheet';
import { OrderDetailSheet } from './order-detail-sheet';
import { InvoiceDetailDrawer } from './invoice-detail-drawer';
import { PaymentMethodDialog } from './payment-method-dialog';
import { PreviewStatesDrawer } from './preview-states-drawer';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

interface BillingModuleProps {
  initialTab?: BillingTab;
}

export function BillingModule({ initialTab = 'overview' }: BillingModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useBillingStore();

  const tabQuery = searchParams.get('tab') as BillingTab | null;
  const stateQuery = searchParams.get('state');

  // Modal / Drawer local states
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UsageOrder | null>(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // Sync tab from URL
  useEffect(() => {
    if (tabQuery && ['overview', 'usage', 'invoices', 'payment'].includes(tabQuery)) {
      if (tabQuery !== store.activeTab) {
        billingStore.setActiveTab(tabQuery);
      }
    }
  }, [tabQuery, store.activeTab]);

  // Sync preset state from URL
  useEffect(() => {
    if (stateQuery && stateQuery !== store.previewState) {
      billingStore.setPreviewState(stateQuery as BillingPreviewState);
    }
  }, [stateQuery, store.previewState]);

  const handleTabChange = (tab: BillingTab) => {
    billingStore.setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`/settings/billing?${params.toString()}`, { scroll: false });
  };

  const handleOpenOrder = (order: UsageOrder) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleOpenInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setInvoiceDetailOpen(true);
  };

  const handleRetryPayment = async () => {
    const success = await billingStore.retryPayment();
    if (success) {
      toast.success('Payment recovered successfully. Grace period cleared.');
    } else {
      toast.error('Payment retry declined. Please update your payment method.');
    }
  };

  const selectedPeriod =
    store.periods.find((p) => p.id === store.selectedPeriodId) ||
    store.periods[0];

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      {/* Read-Only Staff Notice */}
      {store.permission === 'staff' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <strong>Staff view (read-only):</strong> You are viewing billing with Staff permissions. Managing payment methods requires Owner or Billing Admin privileges.
            </span>
          </div>
          <button
            onClick={() => billingStore.setPermission('owner')}
            className="text-[11px] underline font-medium hover:text-amber-950 shrink-0 ml-2"
          >
            Switch to Owner
          </button>
        </div>
      )}

      {/* Payment Failure & Grace Period Alert */}
      <PaymentFailureAlert
        isVisible={store.paymentFailureActive || store.paymentDetails.status === 'failed'}
        isRetrying={store.isRetryingPayment}
        gracePeriodEndsAt={store.paymentDetails.gracePeriodEndsAt || '7 October 2026'}
        permission={store.permission}
        amount={selectedPeriod.estimatedCharge}
        onRetryPayment={handleRetryPayment}
        onUpdatePaymentMethod={() => setPaymentDialogOpen(true)}
      />

      {/* Sync Status Banner */}
      <SyncStatusBanner
        status={store.syncStatus}
        isSyncing={store.isSyncing}
        onRetrySync={() => billingStore.retrySync()}
      />

      {/* Page Header with 4 Tabs */}
      <BillingPageHeader
        activeTab={store.activeTab}
        onTabChange={handleTabChange}
        onViewOrderUsage={() => handleTabChange('usage')}
        permission={store.permission}
        countedOrdersCount={store.countedOrdersCount}
      />

      {/* TAB 1: OVERVIEW */}
      {store.activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Period selector & active store context */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-[#71717a]">
                Displaying usage for store: <strong className="text-[#0a0a0a] font-semibold">Northstar Goods</strong> (Shopify Connected)
              </span>
            </div>
            <BillingPeriodSelect
              periods={store.periods}
              selectedPeriodId={selectedPeriod.id}
              onSelectPeriod={(periodId) => billingStore.setSelectedPeriod(periodId)}
            />
          </div>

          {/* Primary Usage Hero Card */}
          <CurrentUsageCard
            period={selectedPeriod}
            countedOrders={store.countedOrdersCount}
          />

          {/* 30-Day Cumulative Usage Chart */}
          <UsageTrendChart
            countedOrdersCount={store.countedOrdersCount}
          />

          {/* 2-Column Explanation & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BillingExplanationCard onOpenRules={() => setRulesOpen(true)} />
            <BillingSummaryCard
              period={selectedPeriod}
              countedOrders={store.countedOrdersCount}
              excludedOrders={store.excludedOrdersCount}
              paymentDetails={store.paymentDetails}
            />
          </div>

          {/* Recent Usage Table (Latest 5 orders) */}
          <RecentUsageTable
            orders={store.orders}
            onSelectOrder={handleOpenOrder}
            onViewAllOrders={() => handleTabChange('usage')}
          />

          {/* Activity Timeline */}
          <BillingActivityTimeline items={store.timeline} />
        </div>
      )}

      {/* TAB 2: ORDER USAGE */}
      {store.activeTab === 'usage' && (
        <OrderUsageTab
          orders={store.orders}
          countedOrdersCount={store.countedOrdersCount}
          excludedOrdersCount={store.excludedOrdersCount}
          underReviewOrdersCount={store.underReviewOrdersCount}
          period={selectedPeriod}
          searchQuery={store.searchQuery}
          onSearchChange={(q) => billingStore.setSearchQuery(q)}
          billingFilter={store.billingStatusFilter}
          onBillingFilterChange={(f) => billingStore.setBillingStatusFilter(f)}
          storeStatusFilter={store.storeStatusFilter}
          onStoreStatusFilterChange={(s) => billingStore.setStoreStatusFilter(s)}
          currentPage={store.currentPage}
          onPageChange={(p) => billingStore.setCurrentPage(p)}
          pageSize={store.pageSize}
          onPageSizeChange={(size) => billingStore.setPageSize(size)}
          onSelectOrder={handleOpenOrder}
        />
      )}

      {/* TAB 3: INVOICES */}
      {store.activeTab === 'invoices' && (
        <InvoicesTab
          invoices={store.invoices}
          permission={store.permission}
          onViewInvoice={handleOpenInvoice}
        />
      )}

      {/* TAB 4: PAYMENT DETAILS */}
      {store.activeTab === 'payment' && (
        <PaymentDetailsTab
          paymentDetails={store.paymentDetails}
          permission={store.permission}
          onOpenPaymentModal={() => setPaymentDialogOpen(true)}
          onSwitchBillingMode={(mode) => billingStore.setBillingMode(mode)}
        />
      )}

      {/* OVERLAYS & SHEETS */}
      <CountedOrderRulesSheet
        open={rulesOpen}
        onOpenChange={setRulesOpen}
      />

      <OrderDetailSheet
        order={selectedOrder}
        open={orderDetailOpen}
        onOpenChange={setOrderDetailOpen}
      />

      <InvoiceDetailDrawer
        open={invoiceDetailOpen}
        onClose={() => setInvoiceDetailOpen(false)}
        invoice={selectedInvoice}
      />

      <PaymentMethodDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        isPlatformManaged={store.paymentDetails.billingMode === 'platform'}
      />

      {/* Floating Developer Preview States Controller */}
      <PreviewStatesDrawer store={store} />
    </div>
  );
}
