"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileSpreadsheet,
  ArrowRight,
  Split,
  Eye,
  Info,
} from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { ReloopinField } from "@/lib/customers/customer-types";

export function StepMapColumns() {
  const {
    uploadedFile,
    setImportStep,
    rawHeaders,
    rawRows,
    columnMappings,
    updateColumnMapping,
    firstRowIsHeader,
    setFirstRowIsHeader,
    headerRowIndex,
    setHeaderRowIndex,
    splitFullNameColumn,
  } = useCustomerStore();

  const [previewRowsOpen, setPreviewRowsOpen] = useState(false);
  const [splitPreviewOpen, setSplitPreviewOpen] = useState(false);

  const destinationOptions: { value: ReloopinField; label: string; required?: boolean }[] = [
    { value: "first_name", label: "First name", required: true },
    { value: "last_name", label: "Last name", required: true },
    { value: "email", label: "Email address", required: true },
    { value: "phone", label: "Phone number" },
    { value: "date_of_birth", label: "Date of birth" },
    { value: "loyalty_member", label: "Loyalty member status" },
    { value: "points_balance", label: "Current points balance" },
    { value: "lifetime_points", label: "Lifetime points" },
    { value: "status", label: "Customer status" },
    { value: "external_customer_id", label: "External customer ID" },
    { value: "joined_at", label: "Joined date" },
    { value: "city", label: "City" },
    { value: "region", label: "Region / State" },
    { value: "country", label: "Country" },
    { value: "postal_code", label: "Postal code" },
    { value: "do_not_import", label: "Do not import (Ignore)" },
  ];

  // Validation checks
  const mappedDestinations = columnMappings
    .map((m) => m.destinationField)
    .filter((d) => d !== "do_not_import");

  const hasFirstName = mappedDestinations.includes("first_name");
  const hasLastName = mappedDestinations.includes("last_name");
  const hasEmail = mappedDestinations.includes("email");

  const hasDuplicateMapping = mappedDestinations.some(
    (field, idx) => mappedDestinations.indexOf(field) !== idx
  );

  const mappedCount = columnMappings.filter((m) => m.destinationField !== "do_not_import").length;
  const ignoredCount = columnMappings.filter((m) => m.destinationField === "do_not_import").length;
  const needsReviewCount = columnMappings.filter((m) => m.confidence === "needs_review").length;

  const missingRequired = [
    !hasFirstName && "First name",
    !hasLastName && "Last name",
    !hasEmail && "Email address",
  ].filter(Boolean) as string[];

  // Has single "name" column?
  const hasSingleNameColumn =
    columnMappings.some((m) => m.sourceColumn.toLowerCase() === "name" || m.sourceColumn.toLowerCase() === "full name") &&
    (!hasFirstName || !hasLastName);

  return (
    <div className="space-y-6">
      {/* 1. File summary card */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="size-5" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-[#0a0a0a] font-mono block">
              {uploadedFile?.name || "customers.csv"}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#71717a] mt-0.5">
              <span>Sheet: <strong>{uploadedFile?.selectedSheet || "Sheet1"}</strong></span>
              <span>•</span>
              <span><strong>{rawRows.length > 0 ? (rawRows.length - 1).toLocaleString() : 0}</strong> rows detected</span>
              <span>•</span>
              <span><strong>{rawHeaders.length}</strong> columns detected</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setImportStep(1)}
          className="h-[34px] px-3.5 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-xl text-[13px] font-medium transition-colors shrink-0"
        >
          Change file
        </button>
      </div>

      {/* 2. Header-row controls & Full-name transform helper */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0a0a0a] cursor-pointer">
              <input
                type="checkbox"
                checked={firstRowIsHeader}
                onChange={(e) => setFirstRowIsHeader(e.target.checked)}
                className="size-4 accent-[#5f3ed8] rounded"
              />
              <span>First row contains column names</span>
            </label>

            <button
              type="button"
              onClick={() => setPreviewRowsOpen(!previewRowsOpen)}
              className="flex items-center gap-1 text-[12px] font-medium text-[#5f3ed8] hover:underline"
            >
              <Eye className="size-3.5" />
              <span>{previewRowsOpen ? "Hide data preview" : "Preview first 3 rows"}</span>
            </button>
          </div>

          {/* Single Name column split transform action */}
          {hasSingleNameColumn && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSplitPreviewOpen(true)}
                className="flex items-center gap-1.5 h-[32px] px-3 bg-purple-50 text-[#5f3ed8] border border-[#5f3ed8]/30 rounded-lg text-[12px] font-medium hover:bg-purple-100 transition-colors"
              >
                <Split className="size-3.5" />
                <span>Split full name into first and last name</span>
              </button>
            </div>
          )}
        </div>

        {/* First 3 rows preview */}
        {previewRowsOpen && (
          <div className="border border-[#ebebeb] rounded-xl overflow-x-auto text-[12px] animate-in fade-in">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold text-[#71717a]">
                  <th className="p-2 w-12 text-center">Row</th>
                  {rawHeaders.map((h, i) => (
                    <th key={i} className="p-2 font-mono">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebebeb]">
                {rawRows.slice(0, 4).map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx === 0 ? "bg-zinc-50 font-bold" : ""}>
                    <td className="p-2 text-center text-[#71717a]">{rIdx === 0 ? "H" : rIdx}</td>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 truncate max-w-[180px]">
                        {cell || <span className="text-[#a1a1aa] italic">empty</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Split Name Preview Dialog */}
        {splitPreviewOpen && (
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl text-[13px] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0a0a0a] flex items-center gap-1.5">
                <Split className="size-4 text-[#5f3ed8]" />
                Preview: Split Full Name Column
              </span>
              <button
                onClick={() => setSplitPreviewOpen(false)}
                className="text-[#71717a] hover:text-black"
              >
                Cancel
              </button>
            </div>
            <p className="text-[12px] text-[#5b5a5a]">
              Your source column <code className="font-mono bg-purple-100 px-1 py-0.5 rounded">Name</code> will be split into <code className="font-mono font-semibold">first_name</code> and <code className="font-mono font-semibold">last_name</code> on the first space (e.g. &ldquo;Maya Chen&rdquo; &rarr; Maya | Chen).
            </p>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSplitPreviewOpen(false)}
                className="h-[30px] px-3 bg-white border rounded-lg text-[12px] font-medium text-[#71717a]"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={() => {
                  splitFullNameColumn();
                  setSplitPreviewOpen(false);
                }}
                className="h-[30px] px-4 bg-[#5f3ed8] text-white rounded-lg text-[12px] font-semibold"
              >
                Apply Split Transform
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Mapping Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#ebebeb] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Mapped fields
          </span>
          <span className="text-[18px] font-bold text-[#0a0a0a] mt-0.5 block">
            {mappedCount} of {columnMappings.length}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#ebebeb] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Ignored columns
          </span>
          <span className="text-[18px] font-bold text-[#71717a] mt-0.5 block">
            {ignoredCount}
          </span>
        </div>

        <div
          className={`p-3.5 rounded-xl border shadow-sm ${
            missingRequired.length > 0
              ? "bg-red-50/50 border-red-200"
              : "bg-white border-[#ebebeb]"
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Required remaining
          </span>
          <span
            className={`text-[18px] font-bold mt-0.5 block ${
              missingRequired.length > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {missingRequired.length === 0 ? "All mapped ✓" : `${missingRequired.length} missing`}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-[#ebebeb] shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
            Needs review
          </span>
          <span className="text-[18px] font-bold text-amber-600 mt-0.5 block">
            {needsReviewCount}
          </span>
        </div>
      </div>

      {/* Warnings & Incomplete Required Callouts */}
      {missingRequired.length > 0 && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-[13px] text-red-700">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            <strong>Required fields unmapped:</strong> Please map destination fields for:{" "}
            {missingRequired.join(", ")}.
          </span>
        </div>
      )}

      {hasDuplicateMapping && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-[13px] text-amber-800">
          <AlertTriangle className="size-4 shrink-0" />
          <span>
            <strong>Duplicate destination detected:</strong> Multiple source columns are mapped to the same destination field. Each field can only be mapped once.
          </span>
        </div>
      )}

      {/* 4. Column Mapping Table */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-[13px]">
          <thead>
            <tr className="bg-[#f7f7f8] border-b border-[#ebebeb] text-[11px] font-bold text-[#71717a] uppercase tracking-wider h-[40px]">
              <th className="px-4 py-2.5 w-[220px]">File column</th>
              <th className="px-4 py-2.5">Example data from file</th>
              <th className="px-4 py-2.5 w-[280px]">Reloopin destination field</th>
              <th className="px-4 py-2.5 w-[140px] text-right">Mapping status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ebebeb]">
            {columnMappings.map((mapping) => {
              const isIgnored = mapping.destinationField === "do_not_import";
              const isRequiredField = ["first_name", "last_name", "email"].includes(
                mapping.destinationField
              );
              const isDuplicate =
                !isIgnored &&
                columnMappings.filter((m) => m.destinationField === mapping.destinationField)
                  .length > 1;

              return (
                <tr
                  key={mapping.sourceColumn}
                  className="hover:bg-zinc-50 transition-colors"
                >
                  {/* File column */}
                  <td className="px-4 py-3 font-semibold text-[#0a0a0a] font-mono">
                    {mapping.sourceColumn}
                  </td>

                  {/* Sample values */}
                  <td className="px-4 py-3 text-[12px] text-[#71717a]">
                    {mapping.sampleValues.length > 0 ? (
                      <span className="truncate block max-w-[340px]">
                        {mapping.sampleValues.join(", ")}
                      </span>
                    ) : (
                      <span className="italic text-[#a1a1aa]">No sample values found</span>
                    )}
                  </td>

                  {/* Destination dropdown */}
                  <td className="px-4 py-3">
                    <select
                      value={mapping.destinationField}
                      onChange={(e) =>
                        updateColumnMapping(
                          mapping.sourceColumn,
                          e.target.value as ReloopinField
                        )
                      }
                      className={`w-full h-[36px] px-3 bg-white border rounded-xl text-[13px] outline-none transition-colors ${
                        isDuplicate
                          ? "border-amber-500 focus:border-amber-500"
                          : isRequiredField
                          ? "border-[#5f3ed8]/40 font-medium"
                          : "border-[#ebebeb] focus:border-[#5f3ed8]"
                      }`}
                    >
                      {destinationOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} {opt.required ? "(Required)" : ""}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-right">
                    {isDuplicate ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        <AlertTriangle className="size-3" />
                        Duplicate
                      </span>
                    ) : isIgnored ? (
                      <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-[#71717a]">
                        Ignored
                      </span>
                    ) : mapping.confidence === "needs_review" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <HelpCircle className="size-3" />
                        Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="size-3" />
                        Mapped
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
