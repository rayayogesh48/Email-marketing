"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Search,
  Download,
  SkipForward,
  Edit2,
  Users,
  Coins,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { DuplicatePolicy, PointsPolicy } from "@/lib/customers/customer-types";
import { EditImportRowSheet } from "./edit-import-row-sheet";
import { toast } from "sonner";

export function StepReviewData() {
  const {
    validationRows,
    validationFilter,
    setValidationFilter,
    validationSearchQuery,
    setValidationSearchQuery,
    openEditRowSheet,
    skipAllRowsWithErrors,
    duplicatePolicy,
    setDuplicatePolicy,
    pointsPolicy,
    setPointsPolicy,
    loyaltyEnrollmentPolicy,
    setLoyaltyEnrollmentPolicy,
  } = useCustomerStore();

  const totalCount = validationRows.length;
  const errorCount = validationRows.filter((r) => r.status === "error").length;
  const warningCount = validationRows.filter((r) => r.status === "warning").length;
  const readyCount = validationRows.filter((r) => r.status === "ready").length;
  const skippedCount = validationRows.filter((r) => r.status === "skipped").length;

  // Filter rows
  const filteredRows = validationRows.filter((r) => {
    if (validationFilter === "errors" && r.status !== "error") return false;
    if (validationFilter === "warnings" && r.status !== "warning") return false;
    if (validationFilter === "ready" && r.status !== "ready") return false;
    if (validationFilter === "skipped" && r.status !== "skipped") return false;

    if (validationSearchQuery.trim()) {
      const q = validationSearchQuery.toLowerCase().trim();
      const name = `${r.editedData["first_name"] || ""} ${r.editedData["last_name"] || ""}`.toLowerCase();
      const email = (r.editedData["email"] || "").toLowerCase();
      if (!name.includes(q) && !email.includes(q)) return false;
    }

    return true;
  });

  const handleDownloadIssueReport = () => {
    const issues = validationRows.flatMap((r) => [
      ...r.errors.map((e) => ({ row: r.rowNumber, email: r.editedData["email"] || "", ...e })),
      ...r.warnings.map((w) => ({ row: r.rowNumber, email: r.editedData["email"] || "", ...w })),
    ]);

    if (issues.length === 0) {
      toast.info("No issues detected in file.");
      return;
    }

    const headers = ["Original Row", "Customer Email", "Field", "Issue Type", "Issue Message", "Suggested Correction"];
    const rows = issues.map((iss) => [
      iss.row,
      `"${iss.email}"`,
      iss.field,
      iss.severity.toUpperCase(),
      `"${iss.message.replace(/"/g, '""')}"`,
      `"${(iss.suggestedCorrection || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reloopin-import-issues-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Validation issue report downloaded.");
  };

  return (
    <div className="space-y-6">
      {/* 1. Validation Summary (4 compact neutral cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Total rows
          </span>
          <span className="text-[20px] font-bold text-[#0a0a0a] mt-0.5 block">
            {totalCount.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Ready to import
          </span>
          <span className="text-[20px] font-bold text-emerald-600 mt-0.5 block">
            {readyCount.toLocaleString()}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#ebebeb] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Warnings
          </span>
          <span className="text-[20px] font-bold text-amber-600 mt-0.5 block">
            {warningCount.toLocaleString()}
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-sm ${
            errorCount > 0
              ? "bg-red-50/50 border-red-200"
              : "bg-white border-[#ebebeb]"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Blocking errors
          </span>
          <span
            className={`text-[20px] font-bold mt-0.5 block ${
              errorCount > 0 ? "text-red-600" : "text-[#71717a]"
            }`}
          >
            {errorCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 2. Policies Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Existing Customers Policy Card */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#5f3ed8]" />
            <h4 className="text-[14px] font-bold text-[#0a0a0a]">
              Existing customers
            </h4>
          </div>
          <p className="text-[12px] text-[#71717a]">
            Choose how to handle customer records already registered in Northstar Goods:
          </p>

          <div className="space-y-2">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#ebebeb] hover:bg-zinc-50 cursor-pointer text-[13px]">
              <input
                type="radio"
                name="duplicatePolicy"
                checked={duplicatePolicy === "skip"}
                onChange={() => setDuplicatePolicy("skip")}
                className="mt-0.5 accent-[#5f3ed8]"
              />
              <div>
                <span className="font-semibold text-[#0a0a0a] block">
                  Skip existing customers (Recommended)
                </span>
                <span className="text-[11px] text-[#71717a]">
                  Do not overwrite or alter existing customer profiles.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#ebebeb] hover:bg-zinc-50 cursor-pointer text-[13px]">
              <input
                type="radio"
                name="duplicatePolicy"
                checked={duplicatePolicy === "update"}
                onChange={() => setDuplicatePolicy("update")}
                className="mt-0.5 accent-[#5f3ed8]"
              />
              <div>
                <span className="font-semibold text-[#0a0a0a] block">
                  Update existing customers
                </span>
                <span className="text-[11px] text-[#71717a]">
                  Update only non-blank imported fields. Existing values will not be erased.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Imported Points Policy Card */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-[#ea580c]" />
            <h4 className="text-[14px] font-bold text-[#0a0a0a]">
              Imported points
            </h4>
          </div>
          <p className="text-[12px] text-[#71717a]">
            For new customers, points become opening balances. For existing members:
          </p>

          <div className="space-y-2">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#ebebeb] hover:bg-zinc-50 cursor-pointer text-[13px]">
              <input
                type="radio"
                name="pointsPolicy"
                checked={pointsPolicy === "keep"}
                onChange={() => setPointsPolicy("keep")}
                className="mt-0.5 accent-[#5f3ed8]"
              />
              <div>
                <span className="font-semibold text-[#0a0a0a] block">
                  Keep existing points (Recommended)
                </span>
                <span className="text-[11px] text-[#71717a]">
                  Preserve current loyalty balances without making changes.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#ebebeb] hover:bg-zinc-50 cursor-pointer text-[13px]">
              <input
                type="radio"
                name="pointsPolicy"
                checked={pointsPolicy === "replace"}
                onChange={() => setPointsPolicy("replace")}
                className="mt-0.5 accent-[#5f3ed8]"
              />
              <div>
                <span className="font-semibold text-[#0a0a0a] block">
                  Replace with imported balance
                </span>
                <span className="text-[11px] text-amber-600">
                  Overwrites balances. Requires confirmation in Step 4.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl border border-[#ebebeb] hover:bg-zinc-50 cursor-pointer text-[13px]">
              <input
                type="radio"
                name="pointsPolicy"
                checked={pointsPolicy === "add"}
                onChange={() => setPointsPolicy("add")}
                className="mt-0.5 accent-[#5f3ed8]"
              />
              <div>
                <span className="font-semibold text-[#0a0a0a] block">
                  Add imported points to current balance
                </span>
                <span className="text-[11px] text-purple-600">
                  Credits additional points. Requires confirmation in Step 4.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Loyalty Enrollment Toggle */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[14px] font-bold text-[#0a0a0a] block">
            Enroll imported customers in loyalty
          </span>
          <span className="text-[12px] text-[#71717a]">
            Customers can earn points and move through VIP tiers after import.
          </span>
        </div>
        <input
          type="checkbox"
          checked={loyaltyEnrollmentPolicy}
          onChange={(e) => setLoyaltyEnrollmentPolicy(e.target.checked)}
          className="size-4 accent-[#5f3ed8] rounded cursor-pointer"
        />
      </div>

      {/* 4. Validation Table & Toolbar */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All rows (${totalCount})` },
              { id: "errors", label: `Errors (${errorCount})`, alert: errorCount > 0 },
              { id: "warnings", label: `Warnings (${warningCount})` },
              { id: "ready", label: `Ready (${readyCount})` },
              { id: "skipped", label: `Skipped (${skippedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setValidationFilter(tab.id as typeof validationFilter)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition-all ${
                  validationFilter === tab.id
                    ? "bg-[#5f3ed8] text-white border-[#5f3ed8] shadow-sm"
                    : tab.alert
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-zinc-50 text-[#71717a] border-[#ebebeb] hover:bg-zinc-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex items-center bg-white border border-[#ebebeb] rounded-xl h-[34px] px-2.5 w-[200px]">
              <Search className="size-3.5 text-[#71717a] mr-1.5" />
              <input
                type="text"
                value={validationSearchQuery}
                onChange={(e) => setValidationSearchQuery(e.target.value)}
                placeholder="Search rows..."
                className="w-full bg-transparent text-[12px] outline-none"
              />
            </div>

            {/* Bulk skip errors */}
            {errorCount > 0 && (
              <button
                type="button"
                onClick={skipAllRowsWithErrors}
                className="flex items-center gap-1.5 h-[34px] px-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-[12px] font-medium hover:bg-amber-100"
              >
                <SkipForward className="size-3.5" />
                <span>Skip all errors ({errorCount})</span>
              </button>
            )}

            {/* Download Issue Report */}
            {(errorCount > 0 || warningCount > 0) && (
              <button
                type="button"
                onClick={handleDownloadIssueReport}
                className="flex items-center gap-1.5 h-[34px] px-3 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[12px] font-medium rounded-xl text-[#0a0a0a]"
                title="Download validation issue report"
              >
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Download report</span>
              </button>
            )}
          </div>
        </div>

        {/* Validation Rows Table */}
        <div className="border border-[#ebebeb] rounded-xl overflow-x-auto text-[13px]">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold text-[#71717a] uppercase tracking-wider h-[38px]">
                <th className="px-3 py-2 w-12 text-center">Row</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2 w-28">Phone</th>
                <th className="px-3 py-2 w-24">Points</th>
                <th className="px-3 py-2 w-20">Status</th>
                <th className="px-3 py-2">Validation Issues</th>
                <th className="px-3 py-2 w-20 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebebeb]">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#71717a] text-[13px]">
                    No rows match this filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => {
                  const hasErr = r.status === "error";
                  const hasWarn = r.status === "warning";
                  const isSkipped = r.status === "skipped";

                  return (
                    <tr
                      key={r.rowNumber}
                      className={`hover:bg-zinc-50 transition-colors ${
                        hasErr
                          ? "bg-red-50/20"
                          : hasWarn
                          ? "bg-amber-50/20"
                          : isSkipped
                          ? "opacity-60 bg-zinc-50/50"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center font-mono text-[12px] text-[#71717a]">
                        {r.rowNumber}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-[#0a0a0a]">
                        {`${r.editedData["first_name"] || ""} ${r.editedData["last_name"] || ""}`.trim() || (
                          <span className="text-red-500 italic">Missing name</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[12px]">
                        {r.editedData["email"] ? (
                          <span className="text-[#0a0a0a]">
                            {r.editedData["email"]}
                          </span>
                        ) : (
                          <span className="text-red-500 italic">Missing email</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] text-[#71717a]">
                        {r.editedData["phone"] || "—"}
                      </td>
                      <td className="px-3 py-2.5 text-[12px] font-medium text-[#5f3ed8]">
                        {r.editedData["points_balance"] !== undefined
                          ? `${r.editedData["points_balance"]} pts`
                          : "0 pts"}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] uppercase font-bold text-[#71717a]">
                        {r.editedData["status"] || "ACTIVE"}
                      </td>
                      <td className="px-3 py-2.5">
                        {isSkipped ? (
                          <span className="inline-flex items-center text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                            Skipped
                          </span>
                        ) : hasErr ? (
                          <div className="flex flex-col gap-0.5">
                            {r.errors.map((e, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[11px] text-red-600 font-medium"
                              >
                                <AlertCircle className="size-3 shrink-0" />
                                {e.message}
                              </span>
                            ))}
                          </div>
                        ) : hasWarn ? (
                          <div className="flex flex-col gap-0.5">
                            {r.warnings.map((w, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-medium"
                              >
                                <AlertTriangle className="size-3 shrink-0" />
                                {w.message}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                            <CheckCircle2 className="size-3.5" />
                            Valid
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => openEditRowSheet(r.rowNumber)}
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#5f3ed8] hover:underline"
                        >
                          <Edit2 className="size-3" />
                          <span>Fix</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer Modal */}
      <EditImportRowSheet />
    </div>
  );
}
