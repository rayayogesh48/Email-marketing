"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Upload,
  FileSpreadsheet,
  Plus,
  X,
  Check,
  History,
  HelpCircle,
} from "lucide-react";
import { useCustomerStore } from "@/lib/customers/customer-store";
import { CustomerFilterTier, CustomerFilterStatus } from "@/lib/customers/customer-types";

export function CustomerToolbar() {
  const router = useRouter();
  const {
    searchQuery,
    setSearchQuery,
    tierFilter,
    setTierFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    openAddCustomerModal,
    openExportModal,
    openImportHistory,
    openSupportedFields,
  } = useCustomerStore();

  const [tierDropdownOpen, setTierDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [importDropdownOpen, setImportDropdownOpen] = useState(false);

  const tierRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tierRef.current && !tierRef.current.contains(event.target as Node)) {
        setTierDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (importRef.current && !importRef.current.contains(event.target as Node)) {
        setImportDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tierLabels: Record<CustomerFilterTier, string> = {
    all: "VIP Tiers",
    none: "No Tier",
    silver: "Silver Tier",
    gold: "Gold Tier",
    platinum: "Platinum Tier",
  };

  const statusLabels: Record<CustomerFilterStatus, string> = {
    all: "Status",
    active: "Active",
    inactive: "Inactive",
    loyalty_paused: "Loyalty Paused",
    import_pending: "Import Pending",
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" || tierFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
        {/* Left controls: Search + Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex items-center bg-white border border-[#ebebeb] rounded-[12px] h-[36px] px-3 w-[260px] shadow-xs transition-all focus-within:border-[#5f3ed8] focus-within:ring-2 focus-within:ring-[#5f3ed8]/10">
            <Search className="size-4 text-[#71717a] shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full bg-transparent text-[14px] text-[#0a0a0a] placeholder-[#71717a] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#a1a1aa] hover:text-[#0a0a0a] transition-colors"
                title="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* VIP Tiers Filter Dropdown */}
          <div className="relative" ref={tierRef}>
            <button
              onClick={() => {
                setTierDropdownOpen(!tierDropdownOpen);
                setStatusDropdownOpen(false);
                setImportDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 h-[36px] px-3 rounded-[12px] text-[14px] font-medium border transition-colors shadow-xs ${
                tierFilter !== "all"
                  ? "bg-[#5f3ed8]/5 text-[#5f3ed8] border-[#5f3ed8]/30"
                  : "bg-white text-[#0a0a0a] border-[#ebebeb] hover:bg-zinc-50"
              }`}
            >
              <span>{tierLabels[tierFilter]}</span>
              <ChevronDown
                className={`size-4 text-[#71717a] transition-transform ${
                  tierDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {tierDropdownOpen && (
              <div className="absolute top-[42px] left-0 z-30 min-w-[160px] bg-white border border-[#ebebeb] rounded-[12px] shadow-lg py-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                  Filter by VIP Tier
                </div>
                {(["all", "silver", "gold", "platinum", "none"] as CustomerFilterTier[]).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTierFilter(t);
                        setTierDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors ${
                        tierFilter === t
                          ? "bg-[#5f3ed8]/10 text-[#5f3ed8] font-semibold"
                          : "text-[#0a0a0a] hover:bg-zinc-100"
                      }`}
                    >
                      <span className="capitalize">{tierLabels[t]}</span>
                      {tierFilter === t && <Check className="size-3.5 text-[#5f3ed8]" />}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setTierDropdownOpen(false);
                setImportDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 h-[36px] px-3 rounded-[12px] text-[14px] font-medium border transition-colors shadow-xs ${
                statusFilter !== "all"
                  ? "bg-[#5f3ed8]/5 text-[#5f3ed8] border-[#5f3ed8]/30"
                  : "bg-white text-[#0a0a0a] border-[#ebebeb] hover:bg-zinc-50"
              }`}
            >
              <span>{statusLabels[statusFilter]}</span>
              <ChevronDown
                className={`size-4 text-[#71717a] transition-transform ${
                  statusDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {statusDropdownOpen && (
              <div className="absolute top-[42px] left-0 z-30 min-w-[170px] bg-white border border-[#ebebeb] rounded-[12px] shadow-lg py-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-[#71717a] uppercase tracking-wider">
                  Filter by Status
                </div>
                {(
                  [
                    "all",
                    "active",
                    "inactive",
                    "loyalty_paused",
                    "import_pending",
                  ] as CustomerFilterStatus[]
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors ${
                      statusFilter === s
                        ? "bg-[#5f3ed8]/10 text-[#5f3ed8] font-semibold"
                        : "text-[#0a0a0a] hover:bg-zinc-100"
                    }`}
                  >
                    <span>{statusLabels[s]}</span>
                    {statusFilter === s && <Check className="size-3.5 text-[#5f3ed8]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right actions: Import Data, Export Data, New Customer */}
        <div className="flex items-center gap-2">
          {/* Import Data with Dropdown Options */}
          <div className="relative inline-flex" ref={importRef}>
            <Link
              href="/customers/import"
              className="flex items-center gap-1.5 h-[36px] px-3 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-l-[12px] border-r-0 text-[14px] font-medium shadow-xs transition-colors"
            >
              <Upload className="size-4 text-[#71717a]" />
              <span>Import data</span>
            </Link>
            <button
              onClick={() => {
                setImportDropdownOpen(!importDropdownOpen);
                setTierDropdownOpen(false);
                setStatusDropdownOpen(false);
              }}
              aria-label="Import options"
              className="flex items-center justify-center h-[36px] px-2 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#71717a] hover:text-[#0a0a0a] rounded-r-[12px] shadow-xs transition-colors"
            >
              <ChevronDown className={`size-3.5 transition-transform ${importDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {importDropdownOpen && (
              <div className="absolute right-0 top-[42px] z-30 min-w-[210px] bg-white border border-[#ebebeb] rounded-[12px] shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setImportDropdownOpen(false);
                    router.push("/customers/import");
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#0a0a0a] hover:bg-zinc-100 text-left transition-colors"
                >
                  <Upload className="size-4 text-[#5f3ed8]" />
                  <span>Start new CSV/Excel import</span>
                </button>
                <button
                  onClick={() => {
                    setImportDropdownOpen(false);
                    openImportHistory();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#0a0a0a] hover:bg-zinc-100 text-left transition-colors"
                >
                  <History className="size-4 text-[#71717a]" />
                  <span>View import history</span>
                </button>
                <button
                  onClick={() => {
                    setImportDropdownOpen(false);
                    openSupportedFields();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[#0a0a0a] hover:bg-zinc-100 text-left transition-colors"
                >
                  <HelpCircle className="size-4 text-[#71717a]" />
                  <span>Supported fields & rules</span>
                </button>
              </div>
            )}
          </div>

          {/* Export Data */}
          <button
            onClick={openExportModal}
            className="flex items-center gap-2 h-[36px] px-3 bg-white border border-[#ebebeb] hover:bg-zinc-50 text-[#0a0a0a] rounded-[12px] text-[14px] font-medium shadow-xs transition-colors"
          >
            <FileSpreadsheet className="size-4 text-[#71717a]" />
            <span>Export</span>
          </button>

          {/* New Customer Button (Figma 2062:24513) */}
          <button
            onClick={openAddCustomerModal}
            className="flex items-center gap-1.5 h-[36px] px-3.5 bg-[#5f3ed8] hover:bg-[#5234c2] text-white rounded-[12px] text-[14px] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all active:scale-[0.98]"
          >
            <Plus className="size-4 stroke-[2.5]" />
            <span>New customer</span>
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[12px] text-[#71717a] font-medium mr-1">
            Active filters:
          </span>

          {searchQuery.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#ebebeb] rounded-full text-[12px] text-[#0a0a0a] shadow-xs">
              <span className="text-[#71717a]">Query:</span>
              <strong className="font-medium">"{searchQuery}"</strong>
              <button
                onClick={() => setSearchQuery("")}
                className="hover:text-red-500 transition-colors ml-0.5"
                title="Remove search"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {tierFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#5f3ed8]/10 border border-[#5f3ed8]/30 rounded-full text-[12px] text-[#5f3ed8] shadow-xs">
              <span className="opacity-80">Tier:</span>
              <strong className="font-medium">{tierLabels[tierFilter]}</strong>
              <button
                onClick={() => setTierFilter("all")}
                className="hover:text-red-500 transition-colors ml-0.5"
                title="Remove tier filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-[12px] text-[#0a0a0a] shadow-xs">
              <span className="text-[#71717a]">Status:</span>
              <strong className="font-medium">{statusLabels[statusFilter]}</strong>
              <button
                onClick={() => setStatusFilter("all")}
                className="hover:text-red-500 transition-colors ml-0.5"
                title="Remove status filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearFilters}
            className="text-[12px] text-[#5f3ed8] hover:text-[#5234c2] font-semibold underline underline-offset-2 ml-1"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
