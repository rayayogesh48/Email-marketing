"use client";

import React, { useState, useEffect } from "react";
import { X, AlertCircle, AlertTriangle, CheckCircle2, Save, SkipForward } from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { toast } from "sonner";

export function EditImportRowSheet() {
  const {
    editingRowNumber,
    closeEditRowSheet,
    validationRows,
    saveEditedRow,
    skipRow,
  } = useCustomerStore();

  const activeRow = validationRows.find((r) => r.rowNumber === editingRowNumber);

  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activeRow) {
      setFormData({ ...activeRow.editedData });
    }
  }, [activeRow]);

  if (!editingRowNumber || !activeRow) return null;

  const handleChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveEditedRow(activeRow.rowNumber, formData);
    toast.success(`Row #${activeRow.rowNumber} updated and revalidated.`);
  };

  const handleSkip = () => {
    skipRow(activeRow.rowNumber);
    toast.info(`Row #${activeRow.rowNumber} marked as skipped.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={closeEditRowSheet}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-[500px] bg-white border-l border-[#ebebeb] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ebebeb]">
          <div>
            <h3 className="text-[16px] font-bold text-[#0a0a0a]">
              Fix Row #{activeRow.rowNumber}
            </h3>
            <p className="text-[12px] text-[#71717a] mt-0.5">
              Edit values to resolve validation errors or skip this record
            </p>
          </div>
          <button
            onClick={closeEditRowSheet}
            className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Active Issues Box */}
          {activeRow.errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <span className="text-[12px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="size-4" />
                Blocking Errors ({activeRow.errors.length})
              </span>
              <ul className="text-[12px] text-red-600 list-disc pl-5 space-y-1">
                {activeRow.errors.map((err, i) => (
                  <li key={i}>
                    <strong>{err.field}:</strong> {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeRow.warnings.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <span className="text-[12px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="size-4" />
                Warnings ({activeRow.warnings.length})
              </span>
              <ul className="text-[12px] text-amber-700 list-disc pl-5 space-y-1">
                {activeRow.warnings.map((w, i) => (
                  <li key={i}>
                    <strong>{w.field}:</strong> {w.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData["first_name"] || ""}
                onChange={(e) => handleChange("first_name", e.target.value)}
                className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData["last_name"] || ""}
                onChange={(e) => handleChange("last_name", e.target.value)}
                className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData["email"] || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                Phone number
              </label>
              <input
                type="text"
                value={formData["phone"] || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+1 415 555 0142"
                className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Current points
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData["points_balance"] || ""}
                  onChange={(e) => handleChange("points_balance", e.target.value)}
                  className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                  Status
                </label>
                <select
                  value={(formData["status"] || "ACTIVE").toUpperCase()}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0a0a0a] mb-1">
                Date of birth (YYYY-MM-DD)
              </label>
              <input
                type="text"
                placeholder="1994-08-21"
                value={formData["date_of_birth"] || ""}
                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                className="w-full h-[38px] px-3 bg-white border border-[#ebebeb] rounded-xl text-[13px] text-[#0a0a0a] outline-none focus:border-[#5f3ed8]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-5 border-t border-[#ebebeb]">
            <button
              type="button"
              onClick={handleSkip}
              className="flex items-center gap-1.5 h-[36px] px-3 rounded-xl text-[13px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              <SkipForward className="size-4" />
              <span>Skip row</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeEditRowSheet}
                className="h-[36px] px-3.5 rounded-xl text-[13px] font-medium text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 h-[36px] px-4 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-xl text-[13px] font-semibold shadow-sm transition-all"
              >
                <Save className="size-4" />
                <span>Save changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
