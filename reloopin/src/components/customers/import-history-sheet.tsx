"use client";

import React from "react";
import { X, History, FileText, CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { toast } from "sonner";

export function ImportHistorySheet() {
  const { importHistoryOpen, closeImportHistory, importHistory } = useCustomerStore();

  if (!importHistoryOpen) return null;

  const handleDownloadReport = (fileName: string) => {
    const content = `Report for ${fileName}\nStatus: Completed\nTimestamp: ${new Date().toISOString()}\n`;
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `import-report-${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded issue report for ${fileName}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeImportHistory}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full max-w-[560px] bg-white border-l border-[#ebebeb] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center">
              <History className="size-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0a0a0a]">
                Import history
              </h3>
              <p className="text-[12px] text-[#71717a] mt-0.5">
                Audit log of recent CSV and Excel customer uploads
              </p>
            </div>
          </div>
          <button
            onClick={closeImportHistory}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {importHistory.length === 0 ? (
            <div className="text-center py-12 text-[#71717a] text-[13px]">
              No imports have been performed yet.
            </div>
          ) : (
            importHistory.map((item) => {
              const isSuccess = item.status === "completed";
              const isPartial = item.status === "completed_with_issues";
              return (
                <div
                  key={item.id}
                  className="p-4 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 text-[#5f3ed8]" />
                        <span className="text-[14px] font-bold text-[#0a0a0a] font-mono">
                          {item.fileName}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#71717a] mt-1">
                        By {item.importedBy} • {item.startedAt}
                      </div>
                    </div>

                    {isSuccess ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="size-3" />
                        Completed
                      </span>
                    ) : isPartial ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        <AlertTriangle className="size-3" />
                        With issues
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                        <XCircle className="size-3" />
                        Failed
                      </span>
                    )}
                  </div>

                  {/* Counts row */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-200/70 text-[12px]">
                    <div>
                      <span className="text-[#71717a] block text-[10px] uppercase font-bold">
                        Imported
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {item.importedCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block text-[10px] uppercase font-bold">
                        Updated
                      </span>
                      <span className="font-semibold text-[#0a0a0a]">
                        {item.updatedCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block text-[10px] uppercase font-bold">
                        Skipped
                      </span>
                      <span className="font-semibold text-[#71717a]">
                        {item.skippedCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#71717a] block text-[10px] uppercase font-bold">
                        Failed
                      </span>
                      <span className="font-semibold text-red-600">
                        {item.failedCount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleDownloadReport(item.fileName)}
                      className="flex items-center gap-1 text-[12px] font-medium text-[#5f3ed8] hover:underline"
                    >
                      <Download className="size-3" />
                      <span>Download report</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
