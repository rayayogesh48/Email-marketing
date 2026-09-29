"use client";

import React from "react";
import { X, Table, FileSpreadsheet, Info } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { SUPPORTED_FIELDS_METADATA } from "@/lib/customers/customer-data";

export function SupportedFieldsSheet() {
  const { supportedFieldsOpen, closeSupportedFields } = useCustomerStore();

  if (!supportedFieldsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeSupportedFields}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-[680px] bg-white border-l border-[#ebebeb] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <FileSpreadsheet className="size-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0a0a0a]">
                Supported fields specification
              </h3>
              <p className="text-[12px] text-[#71717a] mt-0.5">
                Column headers and data formatting accepted in CSV and Excel imports
              </p>
            </div>
          </div>
          <button
            onClick={closeSupportedFields}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Important rules callout */}
          <div className="p-4 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] space-y-2 text-[13px] text-[#5b5a5a]">
            <div className="flex items-center gap-1.5 font-bold text-[#0a0a0a]">
              <Info className="size-4 text-[#5f3ed8]" />
              <span>Import Rules & System Logic</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[12px] leading-relaxed">
              <li>
                <strong>VIP tier</strong> is calculated by Reloopin from the merchant&apos;s active tier rules. Do not import a tier name directly.
              </li>
              <li>
                <strong>Lifetime value</strong> and <strong>last activity</strong> are calculated from store orders. Do not import them.
              </li>
              <li>
                If <code className="bg-zinc-200 px-1 py-0.5 rounded text-[11px]">loyalty_member</code> is blank, the import-level enrollment setting will be applied.
              </li>
              <li>
                If points fields are blank, Reloopin uses 0 for new customers and keeps existing customer balances unchanged.
              </li>
            </ul>
          </div>

          {/* Table */}
          <div className="border border-[#ebebeb] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Field</th>
                  <th className="py-2.5 px-3">Template column</th>
                  <th className="py-2.5 px-2">Req.</th>
                  <th className="py-2.5 px-3">Format</th>
                  <th className="py-2.5 px-3">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {SUPPORTED_FIELDS_METADATA.map((f) => (
                  <tr key={f.templateColumn} className="hover:bg-zinc-50">
                    <td className="py-2.5 px-3 font-semibold text-[#0a0a0a]">
                      {f.field}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[12px] text-[#5f3ed8]">
                      {f.templateColumn}
                    </td>
                    <td className="py-2.5 px-2">
                      {f.required ? (
                        <span className="text-[11px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          Yes
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#71717a]">No</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#71717a] text-[12px]">
                      {f.format}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[12px] text-[#0a0a0a]">
                      {f.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
