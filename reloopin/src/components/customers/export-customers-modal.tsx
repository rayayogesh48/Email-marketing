"use client";

import React, { useState } from "react";
import { X, FileSpreadsheet, Download, Check, Users } from "lucide-react";
import { useCustomerStore, getFilteredCustomers } from "@/lib/customers/customer-store";
import { ExportOptions } from "@/lib/customers/customer-types";
import { toast } from "sonner";

export function ExportCustomersModal() {
  const store = useCustomerStore();
  const { exportModalOpen, closeExportModal, triggerExport, customers } = store;

  const { filtered: filteredCustomers } = getFilteredCustomers(store);
  const activeCustomers = customers.filter((c) => c.status === "active");

  const [scope, setScope] = useState<"all" | "filtered" | "active">("all");
  const [format, setFormat] = useState<"csv" | "xlsx">("csv");
  const [fields, setFields] = useState({
    name: true,
    email: true,
    tier: true,
    points: true,
    ltv: true,
    status: true,
    lastActivity: true,
    joinedDate: true,
  });

  const [isExporting, setIsExporting] = useState(false);

  if (!exportModalOpen) return null;

  const toggleField = (key: keyof typeof fields) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getTargetCount = () => {
    if (scope === "filtered") return filteredCustomers.length;
    if (scope === "active") return activeCustomers.length;
    return customers.length;
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const options: ExportOptions = {
        scope,
        format,
        fields,
      };
      const count = triggerExport(options);
      setIsExporting(false);
      toast.success(`Export ready! ${count} customer records downloaded.`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={closeExportModal}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[520px] bg-white border border-[#ebebeb] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <FileSpreadsheet className="size-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0a0a0a]">
                Export Customers
              </h3>
              <p className="text-[13px] text-[#71717a]">
                Download customer segment data for reporting or CRM import
              </p>
            </div>
          </div>
          <button
            onClick={closeExportModal}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* Export Scope */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1.5">
              Select Customer Segment
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scope === "all"
                    ? "border-[#5f3ed8] bg-[#5f3ed8]/5"
                    : "border-[#ebebeb] hover:bg-zinc-50"
                }`}
              >
                <div className="text-[13px] font-semibold text-[#0a0a0a]">
                  All Records
                </div>
                <div className="text-[12px] text-[#71717a] mt-0.5">
                  {customers.length} total
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope("filtered")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scope === "filtered"
                    ? "border-[#5f3ed8] bg-[#5f3ed8]/5"
                    : "border-[#ebebeb] hover:bg-zinc-50"
                }`}
              >
                <div className="text-[13px] font-semibold text-[#0a0a0a]">
                  Filtered View
                </div>
                <div className="text-[12px] text-[#71717a] mt-0.5">
                  {filteredCustomers.length} results
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope("active")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  scope === "active"
                    ? "border-[#5f3ed8] bg-[#5f3ed8]/5"
                    : "border-[#ebebeb] hover:bg-zinc-50"
                }`}
              >
                <div className="text-[13px] font-semibold text-[#0a0a0a]">
                  Active Only
                </div>
                <div className="text-[12px] text-[#71717a] mt-0.5">
                  {activeCustomers.length} active
                </div>
              </button>
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1.5">
              File Format
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 text-[13px] text-[#0a0a0a] cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  className="accent-[#5f3ed8]"
                />
                <span>CSV (.csv) - Recommended</span>
              </label>
              <label className="flex items-center gap-2 text-[13px] text-[#0a0a0a] cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  checked={format === "xlsx"}
                  onChange={() => setFormat("xlsx")}
                  className="accent-[#5f3ed8]"
                />
                <span>Excel Spreadsheet (.xlsx)</span>
              </label>
            </div>
          </div>

          {/* Fields Selection */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-2">
              Columns to Include
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#f7f7f8] p-3 rounded-xl border border-[#ebebeb] text-[13px]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.name}
                  onChange={() => toggleField("name")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Customer Name</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.email}
                  onChange={() => toggleField("email")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Email Address</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.tier}
                  onChange={() => toggleField("tier")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">VIP Tier</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.points}
                  onChange={() => toggleField("points")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Points Balance</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.ltv}
                  onChange={() => toggleField("ltv")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Lifetime Value</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.status}
                  onChange={() => toggleField("status")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Account Status</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.lastActivity}
                  onChange={() => toggleField("lastActivity")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Last Activity</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fields.joinedDate}
                  onChange={() => toggleField("joinedDate")}
                  className="accent-[#5f3ed8] rounded"
                />
                <span className="text-[#0a0a0a]">Joined Date</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#ebebeb]">
          <span className="text-[12px] text-[#71717a]">
            Ready to export {getTargetCount()} rows
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={closeExportModal}
              className="h-[38px] px-4 rounded-xl text-[14px] font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={handleExport}
              className="flex items-center gap-2 h-[38px] px-5 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
            >
              {isExporting ? (
                <span>Generating file...</span>
              ) : (
                <>
                  <Download className="size-4" />
                  <span>Download CSV</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
