"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Users,
  Coins,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { toast } from "sonner";

export function StepConfirmImport() {
  const {
    uploadedFile,
    validationRows,
    duplicatePolicy,
    pointsPolicy,
    loyaltyEnrollmentPolicy,
    confirmedPointsChange,
    setConfirmedPointsChange,
    executeImport,
    importPhase,
    importProgressPercent,
    importProcessedCount,
    importResult,
    resetImportWizard,
    setImportStep,
  } = useCustomerStore();

  const validRows = validationRows.filter((r) => r.status !== "error" && r.status !== "skipped");
  const skippedRows = validationRows.filter((r) => r.status === "skipped");
  const newCustomersCount = validRows.filter((r) => !r.isDuplicate).length;
  const existingCustomersCount = validRows.filter((r) => r.isDuplicate).length;
  const withPointsCount = validRows.filter((r) => Number(r.editedData["points_balance"]) > 0).length;

  const pointsChangeWillOccur =
    existingCustomersCount > 0 && (pointsPolicy === "replace" || pointsPolicy === "add");

  const canExecute = !pointsChangeWillOccur || confirmedPointsChange;

  // Phase labels
  const phaseLabels: Record<string, string> = {
    preparing: "Phase 1 of 5: Preparing customer records and payload...",
    creating: "Phase 2 of 5: Enrolling new customer accounts in Northstar Goods...",
    updating: "Phase 3 of 5: Synchronizing existing member profiles...",
    points: "Phase 4 of 5: Recording starting point credits in loyalty ledger...",
    finalizing: "Phase 5 of 5: Rebuilding VIP tier indexes and cache...",
    done: "Import completed.",
  };

  const handleDownloadFailedRows = () => {
    if (!importResult || importResult.failedRows.length === 0) return;
    const headers = ["Row", "Error Message", "Customer Name", "Email"];
    const rows = importResult.failedRows.map((r) => [
      r.rowNumber,
      `"${r.errors.map((e) => e.message).join("; ").replace(/"/g, '""')}"`,
      `"${r.editedData["first_name"] || ""} ${r.editedData["last_name"] || ""}"`,
      `"${r.editedData["email"] || ""}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `failed-import-rows-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded failed rows file.");
  };

  // 1. Result screen if completed
  if (importResult) {
    if (importResult.status === "full_success") {
      return (
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-10 shadow-sm text-center max-w-[640px] mx-auto animate-in zoom-in-95">
          <div className="size-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="size-8" />
          </div>

          <h3 className="text-[22px] font-bold text-[#0a0a0a]">
            Customers imported successfully
          </h3>
          <p className="text-[14px] text-[#71717a] mt-1.5 max-w-[420px] mx-auto">
            {importResult.importedCount.toLocaleString()} customers were added to Northstar Goods.
          </p>

          <div className="grid grid-cols-4 gap-3 my-6 p-4 bg-[#f7f7f8] border border-[#ebebeb] rounded-xl text-left text-[13px]">
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Imported</span>
              <span className="font-bold text-emerald-600 text-[18px]">
                {importResult.importedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Updated</span>
              <span className="font-bold text-[#0a0a0a] text-[18px]">
                {importResult.updatedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Skipped</span>
              <span className="font-bold text-[#71717a] text-[18px]">
                {importResult.skippedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Failed</span>
              <span className="font-bold text-[#71717a] text-[18px]">0</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetImportWizard}
              className="h-[40px] px-5 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[14px] font-medium rounded-xl text-[#0a0a0a] transition-colors"
            >
              Import another file
            </button>
            <Link
              href="/customers"
              className="flex items-center gap-1.5 h-[40px] px-6 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
            >
              <span>View customers</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      );
    }

    if (importResult.status === "partial_success") {
      return (
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-10 shadow-sm text-center max-w-[640px] mx-auto animate-in zoom-in-95">
          <div className="size-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <AlertTriangle className="size-8" />
          </div>

          <h3 className="text-[22px] font-bold text-[#0a0a0a]">
            Import completed with some issues
          </h3>
          <p className="text-[14px] text-[#71717a] mt-1.5 max-w-[440px] mx-auto">
            Most customers were imported, but some rows were skipped or failed.
          </p>

          <div className="grid grid-cols-4 gap-3 my-6 p-4 bg-[#f7f7f8] border border-[#ebebeb] rounded-xl text-left text-[13px]">
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Imported</span>
              <span className="font-bold text-emerald-600 text-[18px]">
                {importResult.importedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Updated</span>
              <span className="font-bold text-[#0a0a0a] text-[18px]">
                {importResult.updatedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Skipped</span>
              <span className="font-bold text-[#71717a] text-[18px]">
                {importResult.skippedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#71717a] block text-[11px] uppercase font-bold">Failed</span>
              <span className="font-bold text-red-600 text-[18px]">
                {importResult.failedCount.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleDownloadFailedRows}
              className="flex items-center gap-1.5 h-[40px] px-4 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[14px] font-medium rounded-xl text-[#0a0a0a]"
            >
              <Download className="size-4" />
              <span>Download failed rows</span>
            </button>
            <Link
              href="/customers"
              className="flex items-center gap-1.5 h-[40px] px-6 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
            >
              <span>View customers</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      );
    }

    // Complete failure
    return (
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-10 shadow-sm text-center max-w-[600px] mx-auto animate-in zoom-in-95">
        <div className="size-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <XCircle className="size-8" />
        </div>

        <h3 className="text-[22px] font-bold text-[#0a0a0a]">
          We couldn&apos;t complete the import
        </h3>
        <p className="text-[14px] text-[#71717a] mt-1.5 max-w-[420px] mx-auto">
          No customers were added. Your existing customer data has not been changed.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => setImportStep(1)}
            className="flex items-center gap-1.5 h-[40px] px-5 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[14px] font-medium rounded-xl text-[#0a0a0a]"
          >
            <RotateCcw className="size-4" />
            <span>Try again</span>
          </button>
          <Link
            href="/customers"
            className="h-[40px] px-6 bg-zinc-100 hover:bg-zinc-200 text-[#0a0a0a] rounded-xl text-[14px] font-semibold transition-all inline-flex items-center justify-center"
          >
            Back to customers
          </Link>
        </div>
      </div>
    );
  }

  // 2. Determinate Processing State
  if (importProgressPercent > 0 && importProgressPercent < 100) {
    return (
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-10 shadow-sm text-center max-w-[600px] mx-auto animate-in zoom-in-95 space-y-6">
        <div className="size-14 rounded-2xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="size-7 animate-spin" />
        </div>

        <div>
          <h3 className="text-[20px] font-bold text-[#0a0a0a]">
            Importing customers
          </h3>
          <p className="text-[13px] text-[#71717a] mt-1">
            Keep this page open while we validate and add your customers.
          </p>
        </div>

        {/* Determinate progress bar */}
        <div className="space-y-2 text-left">
          <div className="flex justify-between text-[13px] font-semibold text-[#0a0a0a]">
            <span>{phaseLabels[importPhase] || "Processing..."}</span>
            <span>{importProgressPercent}%</span>
          </div>

          <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5f3ed8] rounded-full transition-all duration-300"
              style={{ width: `${importProgressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-[#71717a] pt-1">
            <span>Processed: {importProcessedCount.toLocaleString()} rows</span>
            <span>Total: {validationRows.length.toLocaleString()} rows</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#f7f7f8] rounded-xl border border-[#ebebeb] text-[12px] text-[#71717a]">
          ⚠️ Please do not navigate away or refresh while the import is processing.
        </div>
      </div>
    );
  }

  // 3. Pre-import Review Screen (Default Step 4 view)
  return (
    <div className="space-y-6 max-w-[800px] mx-auto">
      {/* Title */}
      <div>
        <h3 className="text-[18px] font-bold text-[#0a0a0a]">
          Review your import
        </h3>
        <p className="text-[13px] text-[#71717a] mt-0.5">
          Confirm what will happen before adding these customers to Northstar Goods.
        </p>
      </div>

      {/* Summary Review Card */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="text-[14px] font-bold text-[#0a0a0a]">
          Import plan breakdown
        </h4>

        <div className="divide-y divide-zinc-200/70 text-[13px]">
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">File name & sheet</span>
            <span className="font-semibold text-[#0a0a0a] font-mono">
              {uploadedFile?.name} ({uploadedFile?.selectedSheet})
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">Total valid rows</span>
            <span className="font-bold text-emerald-600 text-[14px]">
              {validRows.length.toLocaleString()} rows
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">New customer profiles to create</span>
            <span className="font-semibold text-[#0a0a0a]">
              {newCustomersCount.toLocaleString()}
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">Existing customers in store</span>
            <span className="font-semibold text-[#0a0a0a]">
              {existingCustomersCount.toLocaleString()} (Policy: {duplicatePolicy.toUpperCase()})
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">Skipped rows</span>
            <span className="text-[#71717a]">{skippedRows.length.toLocaleString()}</span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">Loyalty program enrollment</span>
            <span className="text-emerald-600 font-semibold">
              {loyaltyEnrollmentPolicy ? "Enrolled" : "Skip enrollment"}
            </span>
          </div>
          <div className="py-2.5 flex justify-between">
            <span className="text-[#71717a]">Customers receiving points</span>
            <span className="font-semibold text-[#5f3ed8]">
              {withPointsCount.toLocaleString()} (Strategy: {pointsPolicy.toUpperCase()})
            </span>
          </div>
        </div>
      </div>

      {/* Warning Callout when points change */}
      {pointsChangeWillOccur && (
        <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-bold text-amber-900">
                This import will change existing customer balances
              </h4>
              <p className="text-[13px] text-amber-800 mt-1 leading-relaxed">
                {existingCustomersCount.toLocaleString()} existing customers will receive imported point adjustments. Each change will appear in the customer&apos;s activity history.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 pt-2 border-t border-amber-200 text-[13px] font-semibold text-amber-900 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmedPointsChange}
              onChange={(e) => setConfirmedPointsChange(e.target.checked)}
              className="size-4 accent-[#5f3ed8] rounded"
            />
            <span>I understand that this import will change customer point balances.</span>
          </label>
        </div>
      )}

      {/* Confirmation Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setImportStep(3)}
          className="h-[40px] px-5 rounded-xl border border-[#ebebeb] bg-white hover:bg-zinc-50 text-[14px] font-medium text-[#71717a] hover:text-[#0a0a0a]"
        >
          Back to review
        </button>

        <button
          type="button"
          disabled={!canExecute || validRows.length === 0}
          onClick={executeImport}
          className="flex items-center gap-2 h-[42px] px-7 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-bold shadow-md transition-all active:scale-[0.98]"
        >
          <span>Import {validRows.length.toLocaleString()} customers</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
