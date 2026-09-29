"use client";

import React from "react";
import Link from "next/link";
import { Users, RotateCcw, Plus, Upload, AlertCircle, Search } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";

export function CustomerEmptyState({
  variant,
}: {
  variant?: "empty" | "no_results" | "load_failure";
}) {
  const {
    clearFilters,
    openAddCustomerModal,
    addSampleCustomers,
    listState,
    setListState,
    customers,
  } = useCustomerStore();

  const activeVariant =
    variant ||
    (listState === "load_failure"
      ? "load_failure"
      : listState === "empty" || customers.length === 0
      ? "empty"
      : "no_results");

  if (activeVariant === "load_failure") {
    return (
      <div className="w-full bg-white border border-red-200 rounded-[12px] p-12 text-center flex flex-col items-center justify-center min-h-[360px] shadow-sm">
        <div className="size-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 shadow-xs">
          <AlertCircle className="size-7 stroke-[1.8]" />
        </div>

        <h3 className="text-[18px] font-semibold text-[#0a0a0a] mb-1.5">
          We couldn’t load your customers
        </h3>

        <p className="text-[14px] text-[#71717a] max-w-[420px] mb-6 leading-relaxed">
          There was an unexpected error retrieving customer records from your store. Check your network connection or retry.
        </p>

        <button
          onClick={() => setListState("default")}
          className="flex items-center gap-2 h-[36px] px-4 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-[12px] text-[14px] font-semibold shadow-sm transition-all"
        >
          <RotateCcw className="size-4" />
          <span>Retry loading</span>
        </button>
      </div>
    );
  }

  if (activeVariant === "empty") {
    return (
      <div className="w-full bg-white border border-[#ebebeb] rounded-[12px] p-12 text-center flex flex-col items-center justify-center min-h-[380px] shadow-sm">
        <div className="size-14 rounded-2xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center mb-4 shadow-xs">
          <Users className="size-7 stroke-[1.8]" />
        </div>

        <h3 className="text-[18px] font-semibold text-[#0a0a0a] mb-1.5">
          No customers yet
        </h3>

        <p className="text-[14px] text-[#71717a] max-w-[440px] mb-6 leading-relaxed">
          Your customer loyalty directory is empty. Import existing customer lists via CSV or Excel, or add your first customer manually.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/customers/import"
            className="flex items-center gap-2 h-[36px] px-4 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-[12px] text-[14px] font-medium shadow-sm transition-colors"
          >
            <Upload className="size-4 text-[#71717a]" />
            <span>Import customers</span>
          </Link>

          <button
            onClick={openAddCustomerModal}
            className="flex items-center gap-2 h-[36px] px-4 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-[12px] text-[14px] font-semibold shadow-sm transition-all"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>New customer</span>
          </button>

          <button
            onClick={addSampleCustomers}
            className="flex items-center gap-1.5 h-[36px] px-3.5 text-[13px] text-[#71717a] hover:text-[#0a0a0a] transition-colors"
          >
            <RotateCcw className="size-3.5" />
            <span>Load demo members</span>
          </button>
        </div>
      </div>
    );
  }

  // Default: no_results from search / filter
  return (
    <div className="w-full bg-white border border-[#ebebeb] rounded-[12px] p-12 text-center flex flex-col items-center justify-center min-h-[360px] shadow-sm">
      <div className="size-14 rounded-2xl bg-zinc-100 text-[#71717a] flex items-center justify-center mb-4 shadow-xs">
        <Search className="size-7 stroke-[1.8]" />
      </div>

      <h3 className="text-[18px] font-semibold text-[#0a0a0a] mb-1.5">
        No customers found
      </h3>

      <p className="text-[14px] text-[#71717a] max-w-[420px] mb-6 leading-relaxed">
        We couldn't find any customers matching your current filters or search term. Try adjusting your query or resetting filters.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 h-[36px] px-4 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-[12px] text-[14px] font-medium shadow-sm transition-colors"
        >
          <RotateCcw className="size-4 text-[#71717a]" />
          <span>Clear all filters</span>
        </button>

        <button
          onClick={openAddCustomerModal}
          className="flex items-center gap-2 h-[36px] px-4 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-[12px] text-[14px] font-semibold shadow-sm transition-all"
        >
          <Plus className="size-4 stroke-[2.5]" />
          <span>New customer</span>
        </button>
      </div>
    </div>
  );
}
