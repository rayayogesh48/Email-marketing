"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";

export function ImportFooter() {
  const {
    importStep,
    setImportStep,
    uploadedFile,
    columnMappings,
    validationRows,
    runValidation,
    importPhase,
    importResult,
  } = useCustomerStore();

  // If on result screen or running import, do not render standard sticky footer
  if (importResult || (importStep === 4 && importPhase !== "preparing")) {
    return null;
  }

  // Step 1 rules
  const canContinueStep1 = !!uploadedFile;

  // Step 2 rules: First name, Last name, and Email must be mapped
  const mappedDests = columnMappings
    .map((m) => m.destinationField)
    .filter((d) => d !== "do_not_import");
  const hasFirstName = mappedDests.includes("first_name");
  const hasLastName = mappedDests.includes("last_name");
  const hasEmail = mappedDests.includes("email");
  const hasDuplicate = mappedDests.some(
    (field, idx) => mappedDests.indexOf(field) !== idx
  );
  const canContinueStep2 = hasFirstName && hasLastName && hasEmail && !hasDuplicate;

  // Step 3 rules: Unresolved blocking errors must be 0
  const unskippedErrors = validationRows.filter(
    (r) => r.status === "error"
  ).length;
  const canContinueStep3 = unskippedErrors === 0 && validationRows.length > 0;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-[#ebebeb] py-3.5 px-6 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        {/* Left Back action */}
        {importStep === 1 ? (
          <Link
            href="/customers"
            className="flex items-center gap-1.5 text-[14px] font-medium text-[#71717a] hover:text-[#0a0a0a] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Cancel import</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setImportStep((importStep - 1) as typeof importStep)}
            className="flex items-center gap-1.5 h-[38px] px-4 rounded-xl border border-[#ebebeb] bg-white hover:bg-zinc-50 text-[13px] font-medium text-[#71717a] hover:text-[#0a0a0a]"
          >
            <ArrowLeft className="size-4" />
            <span>
              {importStep === 2
                ? "Back to upload"
                : importStep === 3
                ? "Back to mapping"
                : "Back to review"}
            </span>
          </button>
        )}

        {/* Right Continue action */}
        {importStep === 1 && (
          <button
            type="button"
            disabled={!canContinueStep1}
            onClick={() => setImportStep(2)}
            className="flex items-center gap-2 h-[40px] px-6 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
          >
            <span>Continue to mapping</span>
            <ArrowRight className="size-4" />
          </button>
        )}

        {importStep === 2 && (
          <button
            type="button"
            disabled={!canContinueStep2}
            onClick={runValidation}
            className="flex items-center gap-2 h-[40px] px-6 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
          >
            <span>Validate data</span>
            <ArrowRight className="size-4" />
          </button>
        )}

        {importStep === 3 && (
          <button
            type="button"
            disabled={!canContinueStep3}
            onClick={() => setImportStep(4)}
            className="flex items-center gap-2 h-[40px] px-6 bg-[#5f3ed8] hover:bg-[#5234c2] disabled:opacity-50 text-white rounded-xl text-[14px] font-semibold shadow-sm transition-all"
          >
            <span>Review import</span>
            <ArrowRight className="size-4" />
          </button>
        )}

        {importStep === 4 && <div />}
      </div>
    </div>
  );
}
