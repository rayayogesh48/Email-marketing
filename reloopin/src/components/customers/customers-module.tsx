"use client";

import React from "react";
import { CheckCircle2, X } from "lucide-react";
import { CustomerToolbar } from "./customer-toolbar";
import { CustomerTable } from "./customer-table";
import { CustomerEmptyState } from "./customer-empty-state";
import { CustomerProfileView } from "./customer-profile-view";
import { AddCustomerDialog } from "./add-customer-dialog";
import { AccountDetailsSheet } from "./account-details-sheet";
import { ActivityDetailsSheet } from "./activity-details-sheet";
import { DeductPointsDialog } from "./deduct-points-dialog";
import { RewardPointsDialog } from "./reward-points-dialog";
import { ExportCustomersModal } from "./export-customers-modal";
import { ImportHistorySheet } from "./import-history-sheet";
import { SupportedFieldsSheet } from "./supported-fields-sheet";
import { CustomerPreviewStates } from "./customer-preview-states";
import { ImportPageComponent } from "./import/import-page-component";
import { useCustomerStore, getFilteredCustomers } from "@/lib/customers/customer-store";

export function CustomersModule({
  customerId,
  isImport,
}: {
  customerId?: string;
  isImport?: boolean;
}) {
  const store = useCustomerStore();
  const { filtered } = getFilteredCustomers(store);

  // If on /customers/import
  if (isImport) {
    return <ImportPageComponent />;
  }

  // If on /customers/[customerId]
  if (customerId) {
    const customer =
      store.customers.find((c) => c.id === customerId) || store.customers[0];

    if (!customer) {
      return (
        <div className="light w-full min-h-screen bg-[#f9f9f9] text-[#0a0a0a] p-8">
          <CustomerEmptyState variant="no_results" />
        </div>
      );
    }

    return (
      <div className="light w-full min-h-screen bg-[#f9f9f9] text-[#0a0a0a] flex flex-col">
        <CustomerProfileView customer={customer} isFullPage={true} />
        <AccountDetailsSheet />
        <ActivityDetailsSheet />
        <DeductPointsDialog />
        <RewardPointsDialog />
        <CustomerPreviewStates />
      </div>
    );
  }

  // Loading skeleton view in light mode
  const renderLoadingSkeletons = () => (
    <div className="w-full bg-white border border-[#ebebeb] rounded-[12px] overflow-hidden shadow-xs">
      <div className="h-[40px] bg-[#f7f7f8] border-b border-[#ebebeb]" />
      <div className="divide-y divide-[#ebebeb]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[76px] px-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="size-[38px] rounded-full bg-zinc-200 shrink-0" />
              <div className="space-y-2">
                <div className="h-3.5 w-32 bg-zinc-200 rounded" />
                <div className="h-3 w-44 bg-zinc-100 rounded" />
              </div>
            </div>
            <div className="h-6 w-20 bg-zinc-200 rounded-full" />
            <div className="h-4 w-16 bg-zinc-200 rounded" />
            <div className="h-4 w-16 bg-zinc-200 rounded" />
            <div className="h-6 w-16 bg-zinc-200 rounded-full" />
            <div className="h-4 w-24 bg-zinc-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="light w-full min-h-screen bg-[#f9f9f9] text-[#0a0a0a] flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-4 max-w-[1400px] w-full mx-auto">
        {/* Page Title Header matching Figma 2062:24091 */}
        <div className="flex items-center justify-between pt-1">
          <h1 className="text-[20px] font-bold text-[#0a0a0a] tracking-[-0.36px]">
            Customers
          </h1>
        </div>

        {/* Import Success Banner */}
        {store.importSuccessBannerMessage && (
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2.5 text-[14px] font-medium">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{store.importSuccessBannerMessage}</span>
            </div>
            <button
              onClick={store.dismissImportSuccessBanner}
              className="p-1 hover:bg-emerald-100 rounded-md transition-colors"
              title="Dismiss banner"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Toolbar Controls */}
        <CustomerToolbar />

        {/* Table or Empty/Loading State */}
        {store.listState === "loading" ? (
          renderLoadingSkeletons()
        ) : store.listState === "load_failure" ? (
          <CustomerEmptyState variant="load_failure" />
        ) : store.customers.length === 0 || store.listState === "empty" ? (
          <CustomerEmptyState variant="empty" />
        ) : filtered.length === 0 || store.listState === "no_results" ? (
          <CustomerEmptyState variant="no_results" />
        ) : (
          <CustomerTable />
        )}
      </div>

      {/* Slide-over Drawers & Modals */}
      <AddCustomerDialog />
      <AccountDetailsSheet />
      <ActivityDetailsSheet />
      <DeductPointsDialog />
      <RewardPointsDialog />
      <ImportHistorySheet />
      <SupportedFieldsSheet />
      <ExportCustomersModal />

      {/* Floating Preview States Controller */}
      <CustomerPreviewStates />
    </div>
  );
}
