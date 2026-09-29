"use client";

import React from "react";
import { X, ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";

export function ActivityDetailsSheet() {
  const {
    activityDetailsSheetOpen,
    closeActivityDetailsSheet,
    selectedTransactionForDetail,
    selectedCustomerId,
    customers,
  } = useCustomerStore();

  if (!activityDetailsSheetOpen || !selectedTransactionForDetail) return null;

  const tx = selectedTransactionForDetail;
  const isPositive = tx.points > 0;
  const customer = customers.find((c) => c.id === selectedCustomerId);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeActivityDetailsSheet}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-[480px] bg-white border-l border-[#ebebeb] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200 text-[#0a0a0a]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
          <div>
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              Activity details
            </h3>
            <p className="text-[12px] text-[#71717a] mt-0.5">
              Point transaction audit record
            </p>
          </div>
          <button
            onClick={closeActivityDetailsSheet}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Point Delta Card */}
          <div className="p-6 bg-[#f7f7f8] rounded-2xl border border-[#ebebeb] text-center flex flex-col items-center">
            <div
              className={`size-12 rounded-xl flex items-center justify-center mb-3 ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="size-6" />
              ) : (
                <ArrowDownLeft className="size-6" />
              )}
            </div>

            <span
              className={`text-[28px] font-extrabold tracking-tight ${
                isPositive
                  ? "text-emerald-600"
                  : "text-amber-600"
              }`}
            >
              {isPositive ? `+${tx.points}` : tx.points} pts
            </span>

            <span className="text-[14px] font-semibold text-[#0a0a0a] mt-1">
              {tx.reason}
            </span>

            <span className="text-[12px] text-[#71717a] mt-0.5 uppercase tracking-wider font-bold">
              {tx.type} Transaction
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#71717a]">
              Transaction Receipt
            </h4>
            <div className="divide-y divide-zinc-200/70 bg-white border border-[#ebebeb] rounded-xl px-4 text-[13px]">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Transaction ID</span>
                <span className="font-mono text-[#0a0a0a]">{tx.id}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Customer</span>
                <span className="font-medium text-[#0a0a0a]">
                  {customer?.name || "Customer"}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Date & Time</span>
                <span className="text-[#0a0a0a]">{tx.date}</span>
              </div>
              {tx.orderNumber && (
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#71717a]">Order reference</span>
                  <span className="font-mono font-bold text-[#5f3ed8]">
                    {tx.orderNumber}
                  </span>
                </div>
              )}
              <div className="py-2.5 flex justify-between">
                <span className="text-[#71717a]">Logged by</span>
                <span className="text-[#0a0a0a]">
                  {tx.performedBy || "System automation"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {tx.note && (
            <div className="p-4 bg-white border border-[#ebebeb] rounded-xl space-y-1.5">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#71717a] flex items-center gap-1.5">
                <FileText className="size-3.5" />
                Staff Remarks
              </span>
              <p className="text-[13px] text-[#0a0a0a] italic">
                &ldquo;{tx.note}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
