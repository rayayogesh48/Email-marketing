"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileCheck,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useCustomerStore, autoMapColumn, updateCustomerStoreState } from "@/lib/customers/customer-store";
import {
  PROTOTYPE_IMPORT_LIMITS,
  SAMPLE_TEMPLATE_CSV,
} from "@/lib/customers/customer-data";
import { ColumnMappingItem, ReloopinField } from "@/lib/customers/customer-types";
import { toast } from "sonner";

export function StepUploadFile() {
  const {
    uploadedFile,
    setUploadedFile,
    removeUploadedFile,
    setSelectedSheet,
    openSupportedFields,
    loadDemoCsvFile,
  } = useCustomerStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Template downloads
  const handleDownloadCsvTemplate = () => {
    const blob = new Blob([SAMPLE_TEMPLATE_CSV], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reloopin-customers-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV template downloaded.");
  };

  const handleDownloadXlsxTemplate = () => {
    // In browser prototype, deliver valid CSV named template.xlsx or .csv
    const blob = new Blob([SAMPLE_TEMPLATE_CSV], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reloopin-customers-template.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Excel template downloaded.");
  };

  // Process selected file
  const processFile = (file: File) => {
    setErrorMsg(null);

    // Validate type
    const isCsv = file.name.endsWith(".csv") || file.type.includes("csv");
    const isXlsx =
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls") ||
      file.type.includes("spreadsheet") ||
      file.type.includes("excel");

    if (!isCsv && !isXlsx) {
      setErrorMsg(
        "Choose a CSV or Excel file. This file type is not supported. Upload a .csv, .xlsx, or .xls file."
      );
      return;
    }

    // Validate size (10 MB)
    if (file.size > PROTOTYPE_IMPORT_LIMITS.maxSizeBytes) {
      setErrorMsg(
        `This file is too large. Upload a file smaller than ${PROTOTYPE_IMPORT_LIMITS.maxSizeLabel}.`
      );
      return;
    }

    // Client-side text parsing for CSV / simulation for Excel
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text || !text.trim()) {
        setErrorMsg("The selected file is empty. Please upload a file with customer rows.");
        return;
      }

      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        setErrorMsg(
          "We couldn't find column headers. Make sure the first row contains labels such as first name, last name, and email."
        );
        return;
      }

      // Check row limit
      if (lines.length - 1 > PROTOTYPE_IMPORT_LIMITS.maxRows) {
        setErrorMsg(
          `Row limit exceeded. File has ${lines.length.toLocaleString()} rows, but maximum allowed is ${PROTOTYPE_IMPORT_LIMITS.maxRowsLabel}.`
        );
        return;
      }

      const rawHeaders = lines[0].split(",").map((h) => h.replace(/^["']|["']$/g, "").trim());
      const rawRows = lines.map((l) =>
        l.split(",").map((v) => v.replace(/^["']|["']$/g, "").trim())
      );

      // Auto-generate initial mappings
      const autoMappings: ColumnMappingItem[] = rawHeaders.map((header, idx) => {
        const mapped = autoMapColumn(header);
        const sampleValues = rawRows
          .slice(1, 4)
          .map((r) => r[idx] || "")
          .filter(Boolean);

        return {
          sourceColumn: header,
          sampleValues,
          destinationField: mapped.field,
          confidence: mapped.confidence,
        };
      });

      const isMultiSheet = isXlsx && file.name.includes("workbook");
      const sheetNames = isMultiSheet
        ? ["Customers (Active)", "Old Records", "Internal Staff"]
        : ["Sheet1"];

      // Update store
      updateCustomerStoreState((prev) => ({
        ...prev,
        uploadedFile: {
          name: file.name,
          size: file.size,
          type: file.type || (isCsv ? "text/csv" : "application/vnd.ms-excel"),
          sheetNames,
          selectedSheet: sheetNames[0],
        },
        rawHeaders,
        rawRows,
        columnMappings: autoMappings,
      }));

      toast.success(`Loaded ${file.name} with ${(lines.length - 1).toLocaleString()} customer rows.`);
    };

    reader.onerror = () => {
      setErrorMsg("Failed to read file. Please ensure it is not locked or corrupted.");
    };

    reader.readAsText(file.slice(0, 1024 * 1024)); // Read sample chunk
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Prepare your file section */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              Start with our sample file
            </h3>
            <p className="text-[13px] text-[#71717a] mt-1 max-w-[580px]">
              Download a template to see the supported columns and formatting. You can remove optional columns you do not need.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadCsvTemplate}
              className="flex items-center gap-1.5 h-[36px] px-3.5 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-xl text-[13px] font-medium shadow-sm transition-colors"
            >
              <Download className="size-4 text-[#71717a]" />
              <span>Download CSV template</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadXlsxTemplate}
              className="flex items-center gap-1.5 h-[36px] px-3.5 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-xl text-[13px] font-medium shadow-sm transition-colors"
            >
              <FileSpreadsheet className="size-4 text-[#71717a]" />
              <span>Download Excel template</span>
            </button>

            <button
              type="button"
              onClick={openSupportedFields}
              className="text-[13px] font-semibold text-[#5f3ed8] hover:underline px-2 py-1"
            >
              View supported fields
            </button>
          </div>
        </div>
      </div>

      {/* 2. Upload Area or Selected File Card */}
      {!uploadedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all bg-white ${
            dragOver
              ? "border-[#5f3ed8] bg-[#5f3ed8]/5 scale-[1.005]"
              : "border-[#ebebeb] hover:border-[#5f3ed8]/50 hover:bg-zinc-50/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          <div className="flex flex-col items-center max-w-[420px] mx-auto">
            <div className="size-14 rounded-2xl bg-[#5f3ed8]/10 text-[#5f3ed8] flex items-center justify-center mb-3.5 shadow-sm">
              <Upload className="size-7 stroke-[1.8]" />
            </div>

            <h4 className="text-[16px] font-bold text-[#0a0a0a]">
              Drop your customer file here
            </h4>
            <p className="text-[13px] text-[#71717a] mt-1">
              CSV or Excel, up to 10 MB.
            </p>

            <button
              type="button"
              className="mt-4 flex items-center gap-1.5 h-[36px] px-5 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-xl text-[13px] font-semibold shadow-sm transition-all"
            >
              <span>Choose file</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <FileCheck className="size-6" />
              </div>
              <div>
                <span className="text-[16px] font-bold text-[#0a0a0a] block font-mono">
                  {uploadedFile.name}
                </span>
                <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#71717a] mt-1">
                  <span>{formatSize(uploadedFile.size)}</span>
                  <span>•</span>
                  <span>{uploadedFile.type}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-600">
                    File ready for mapping
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-[34px] px-3 border border-[#ebebeb] hover:bg-zinc-50 text-[13px] font-medium rounded-xl text-[#0a0a0a] transition-colors"
              >
                Replace file
              </button>
              <button
                type="button"
                onClick={removeUploadedFile}
                className="size-8 rounded-xl flex items-center justify-center text-[#71717a] hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          {/* Multiple sheet selector if workbook */}
          {uploadedFile.sheetNames.length > 1 && (
            <div className="pt-3 border-t border-[#ebebeb]">
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1.5 flex items-center gap-1.5">
                <Layers className="size-4 text-[#5f3ed8]" />
                <span>Choose the sheet containing customers</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {uploadedFile.sheetNames.map((sheet) => (
                  <button
                    key={sheet}
                    type="button"
                    onClick={() => setSelectedSheet(sheet)}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium border transition-all ${
                      uploadedFile.selectedSheet === sheet
                        ? "bg-[#5f3ed8] text-white border-[#5f3ed8] shadow-sm"
                        : "bg-zinc-50 border-[#ebebeb] text-[#0a0a0a] hover:bg-zinc-100"
                    }`}
                  >
                    {sheet}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-[13px] text-red-700">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Upload error</span>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="size-6 rounded flex items-center justify-center text-red-600 hover:bg-red-100"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 3. Supported-file guidance */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl p-5 shadow-sm space-y-2.5">
        <h4 className="text-[13px] font-bold text-[#0a0a0a] flex items-center gap-1.5">
          <Info className="size-4 text-[#71717a]" />
          <span>File formatting requirements</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[12px] text-[#5b5a5a]">
          <div>• Accepted file formats: <strong>.csv</strong>, <strong>.xlsx</strong>, <strong>.xls</strong></div>
          <div>• First row should contain column headers</div>
          <div>• One customer per row (duplicate emails will be handled in step 3)</div>
          <div>• Email address is used to identify existing customers</div>
          <div>• Maximum file size: <strong>{PROTOTYPE_IMPORT_LIMITS.maxSizeLabel}</strong></div>
          <div>• Maximum record limit: <strong>{PROTOTYPE_IMPORT_LIMITS.maxRowsLabel}</strong></div>
          <div>• Password-protected spreadsheets are not supported</div>
          <div>• Character encoding: UTF-8 standard</div>
        </div>
      </div>

      {/* 4. Prototype Demo Shortcuts */}
      <div className="p-4 bg-[#f7f7f8] border border-[#ebebeb] rounded-2xl space-y-2">
        <div className="flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#71717a]">
          <Sparkles className="size-3.5 text-[#5f3ed8]" />
          <span>Prototype Demo Data Shortcuts</span>
        </div>
        <p className="text-[12px] text-[#71717a]">
          Click any preset to simulate loading a sample file into the import workflow:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => loadDemoCsvFile("valid")}
            className="h-[32px] px-3 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[12px] font-medium rounded-lg text-[#0a0a0a] shadow-sm transition-colors"
          >
            Load clean CSV example (5 valid rows)
          </button>
          <button
            type="button"
            onClick={() => loadDemoCsvFile("errors")}
            className="h-[32px] px-3 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[12px] font-medium rounded-lg text-[#0a0a0a] shadow-sm transition-colors"
          >
            Load CSV with errors & duplicates (5 rows)
          </button>
          <button
            type="button"
            onClick={() => loadDemoCsvFile("multisheet")}
            className="h-[32px] px-3 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[12px] font-medium rounded-lg text-[#0a0a0a] shadow-sm transition-colors"
          >
            Load multi-sheet Excel workbook
          </button>
        </div>
      </div>
    </div>
  );
}
