"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Plus,
  Users,
  Eye,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Coins,
  Gem,
  Crown,
  Star,
  AlertCircle,
  FileText,
  History,
  Activity,
  UserCheck,
  MinusCircle,
  PlusCircle,
  Check,
} from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { CustomerPreviewState } from "@/lib/customers/customer-types";
import { toast } from "sonner";

export function CustomerPreviewStates() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    previewState,
    setPreviewState,
    resetDemoData,
    clearAllCustomers,
    addSampleCustomers,
  } = useCustomerStore();

  const handleSelectState = (state: CustomerPreviewState) => {
    setPreviewState(state);
    if (state.startsWith("import-step") || state.startsWith("import-") && state !== "import_success" && state !== "import-history") {
      router.push("/customers/import");
    } else if (state === "customer-drawer") {
      router.push("/customers/cust-01");
    } else if (["default", "loading", "empty", "no_results", "load_failure", "import_success", "tier-silver", "tier-gold", "tier-platinum", "status-inactive"].includes(state)) {
      router.push("/customers");
    }
    toast.info(`Switched to preview state: ${state}`);
    setOpen(false);
  };

  const sections: {
    category: string;
    items: {
      id: CustomerPreviewState;
      title: string;
      description: string;
      icon: React.ComponentType<{ className?: string }>;
    }[];
  }[] = [
    {
      category: "Customer List States (Figma 2062:24091)",
      items: [
        {
          id: "default",
          title: "Default Populated Table",
          description: "Full directory with badges, balances, sorting and pagination",
          icon: Users,
        },
        {
          id: "loading",
          title: "Loading Skeletons",
          description: "Pulsing placeholder rows while customer records load",
          icon: Activity,
        },
        {
          id: "empty",
          title: "Empty Database",
          description: "Zero records state with import and manual add CTA",
          icon: Eye,
        },
        {
          id: "no_results",
          title: "No Search Results",
          description: "Search filter returns zero records with clear filters CTA",
          icon: AlertCircle,
        },
        {
          id: "load_failure",
          title: "Load Failure State",
          description: "Error boundary state with retry action",
          icon: AlertCircle,
        },
        {
          id: "import_success",
          title: "Import Success Banner",
          description: "Green alert displaying '1,210 customers imported successfully'",
          icon: CheckCircle2,
        },
      ],
    },
    {
      category: "Linked Modals & Sheets",
      items: [
        {
          id: "add-customer-dialog",
          title: "Add Customer Dialog (Figma 2062:24513)",
          description: "New member form with loyalty & starting points toggles",
          icon: Plus,
        },
        {
          id: "customer-drawer",
          title: "Customer Profile View (Figma 2062:24758)",
          description: "360 view with 5 key metrics, tier progress and point ledger",
          icon: UserCheck,
        },
        {
          id: "account-details-sheet",
          title: "Account Details Sheet (Figma 2062:25637)",
          description: "Full customer metadata, address, consent & external IDs",
          icon: FileText,
        },
        {
          id: "activity-details-sheet",
          title: "Activity Details Sheet (Figma 2062:25417)",
          description: "Transaction receipt audit with staff notes & order refs",
          icon: Activity,
        },
        {
          id: "deduct-points-dialog",
          title: "Deduct Points Dialog (Figma 2062:25184)",
          description: "Destructive red action with reason & overdraft warnings",
          icon: MinusCircle,
        },
        {
          id: "reward-points-dialog",
          title: "Reward Points Dialog (Figma 2062:24951)",
          description: "Purple bonus action with quick +50 / +250 / +1000 pills",
          icon: PlusCircle,
        },
      ],
    },
    {
      category: "Dedicated Import Flow (/customers/import)",
      items: [
        {
          id: "import-step-1",
          title: "Step 1: Upload File",
          description: "Dropzone, template downloads, multi-sheet workbook selector",
          icon: Upload,
        },
        {
          id: "import-step-2",
          title: "Step 2: Map Columns",
          description: "Column mapping table, split full-name transform",
          icon: FileSpreadsheet,
        },
        {
          id: "import-step-3",
          title: "Step 3: Review Data",
          description: "Row validation table with inline error edit drawer",
          icon: Eye,
        },
        {
          id: "import-step-4",
          title: "Step 4: Confirm Import",
          description: "Pre-import review, points confirmation & policies",
          icon: CheckCircle2,
        },
        {
          id: "import-processing",
          title: "Import Processing Progress",
          description: "Determinate 5-stage animated progress bar",
          icon: Activity,
        },
        {
          id: "import-full-success",
          title: "Import Full Success",
          description: "100% of rows imported with VIP calculation summary",
          icon: CheckCircle2,
        },
        {
          id: "import-partial-success",
          title: "Import Partial Success",
          description: "Import completed with skipped/failed rows & error log download",
          icon: AlertCircle,
        },
        {
          id: "import-failed",
          title: "Import Complete Failure",
          description: "File rejected due to structural corruption or missing fields",
          icon: AlertCircle,
        },
        {
          id: "import-history",
          title: "Import History Sheet",
          description: "Past bulk imports list with audit status and reports",
          icon: History,
        },
      ],
    },
    {
      category: "VIP Tier & Status Filters",
      items: [
        {
          id: "tier-silver",
          title: "Filter: Silver Tier",
          description: "Filter list for Silver loyalty members",
          icon: Star,
        },
        {
          id: "tier-gold",
          title: "Filter: Gold Tier",
          description: "Filter list for Gold loyalty members",
          icon: Crown,
        },
        {
          id: "tier-platinum",
          title: "Filter: Platinum Tier",
          description: "Filter list for top tier Platinum members",
          icon: Gem,
        },
        {
          id: "status-inactive",
          title: "Filter: Inactive Status",
          description: "Filter list for inactive customer accounts",
          icon: Users,
        },
      ],
    },
  ];

  return (
    <>
      {/* Floating Button at Bottom-Left */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white/95 text-zinc-700 hover:text-black shadow-md backdrop-blur hover:bg-zinc-50 transition-all text-[12px] font-medium"
      >
        <SlidersHorizontal className="size-3.5" />
        <span>Preview states</span>
      </button>

      {/* Right Drawer Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-w-[440px] bg-white border-l border-[#ebebeb] shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebebeb] shrink-0">
              <div>
                <h3 className="text-[16px] font-bold text-[#0a0a0a] flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-[#5f3ed8]" />
                  Preview States
                </h3>
                <p className="text-[12px] text-[#71717a] mt-0.5">
                  Test and inspect all 7 Figma design views & import flow
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="size-8 rounded-lg flex items-center justify-center text-[#71717a] hover:text-[#0a0a0a] hover:bg-zinc-100 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* List of States Grouped */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {sections.map((section) => (
                <div key={section.category} className="space-y-1.5">
                  <h4 className="text-[11px] font-bold text-[#71717a] uppercase tracking-wider px-1">
                    {section.category}
                  </h4>
                  <div className="space-y-1.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = previewState === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectState(item.id)}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl border text-left transition-all ${
                            isActive
                              ? "border-[#5f3ed8] bg-[#5f3ed8]/5"
                              : "border-[#ebebeb] hover:bg-zinc-50"
                          }`}
                        >
                          <div
                            className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isActive
                                ? "bg-[#5f3ed8] text-white"
                                : "bg-zinc-100 text-[#71717a]"
                            }`}
                          >
                            <Icon className="size-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-semibold text-[#0a0a0a]">
                                {item.title}
                              </span>
                              {isActive && (
                                <CheckCircle2 className="size-3.5 text-[#5f3ed8] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-[#71717a] mt-0.5 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Actions Footer */}
            <div className="p-4 border-t border-[#ebebeb] bg-[#f7f7f8] space-y-2 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                Database Controls
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    resetDemoData();
                    toast.success("Reset customer demo database to original defaults.");
                  }}
                  className="flex items-center justify-center gap-1.5 h-[34px] px-3 bg-white border border-[#ebebeb] rounded-lg text-[12px] font-medium text-[#0a0a0a] hover:bg-zinc-50 transition-colors"
                >
                  <RotateCcw className="size-3.5 text-[#71717a]" />
                  <span>Reset Demo</span>
                </button>

                <button
                  onClick={() => {
                    clearAllCustomers();
                    toast.info("Cleared all customers (viewing empty state).");
                  }}
                  className="flex items-center justify-center gap-1.5 h-[34px] px-3 bg-white border border-[#ebebeb] rounded-lg text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-3.5 text-red-500" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
