"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { ImportStepper } from "./import-stepper";
import { StepUploadFile } from "./step-upload-file";
import { StepMapColumns } from "./step-map-columns";
import { StepReviewData } from "./step-review-data";
import { StepConfirmImport } from "./step-confirm-import";
import { SupportedFieldsSheet } from "../supported-fields-sheet";
import { ImportFooter } from "./import-footer";
import { CustomerPreviewStates } from "../customer-preview-states";

export function ImportPageComponent() {
  const { importStep, setImportStep } = useCustomerStore();

  return (
    <div className="light w-full min-h-screen bg-[#f9f9f9] text-[#0a0a0a] flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-6 max-w-[1200px] w-full mx-auto pb-28">
        {/* Back Link */}
        <div>
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#71717a] hover:text-[#0a0a0a] font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to customers</span>
          </Link>
        </div>

        {/* Page Heading */}
        <div>
          <h1 className="text-[22px] font-bold text-[#0a0a0a] tracking-tight">
            Import customers
          </h1>
          <p className="text-[13px] text-[#71717a] mt-1">
            Upload a CSV or Excel file, map your columns, and review the data before importing.
          </p>
        </div>

        {/* Stepper */}
        <ImportStepper
          currentStep={importStep}
          onStepClick={(step) => {
            if (step < importStep) setImportStep(step);
          }}
        />

        {/* Step Views */}
        {importStep === 1 && <StepUploadFile />}
        {importStep === 2 && <StepMapColumns />}
        {importStep === 3 && <StepReviewData />}
        {importStep === 4 && <StepConfirmImport />}
      </div>

      {/* Sheets & Drawers */}
      <SupportedFieldsSheet />

      {/* Sticky Action Footer */}
      <ImportFooter />

      {/* Preview States Controller */}
      <CustomerPreviewStates />
    </div>
  );
}
