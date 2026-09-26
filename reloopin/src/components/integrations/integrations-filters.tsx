"use client";

import {
  IntegrationCategory,
  IntegrationRecord,
  IntegrationStatus,
  PlatformId,
  StoreOption,
} from "@/lib/integrations/integrations-types";
import { PLATFORMS_CATALOG } from "@/lib/integrations/integrations-data";
import {
  Search,
  X,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FilterState {
  category: IntegrationCategory | "all";
  search: string;
  status: IntegrationStatus | "all" | "connected";
  storeId: string;
  platform: PlatformId | "all";
  viewMode: "table" | "grid";
}

export function IntegrationsFilters({
  filters,
  onChange,
  integrations,
  stores,
  filteredCount,
}: {
  filters: FilterState;
  onChange: (updater: Partial<FilterState>) => void;
  integrations: IntegrationRecord[];
  stores: StoreOption[];
  filteredCount: number;
}) {
  // Compute counts per category
  const counts: Record<string, number> = {
    all: integrations.length,
    store: integrations.filter((i) => i.category === "store").length,
    pos: integrations.filter((i) => i.category === "pos").length,
    social: integrations.filter((i) => i.category === "social").length,
    reviews: integrations.filter((i) => i.category === "reviews").length,
    custom_api: integrations.filter((i) => i.category === "custom_api").length,
  };

  const categories: { id: IntegrationCategory | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "store", label: "Stores" },
    { id: "pos", label: "POS" },
    { id: "social", label: "Social" },
    { id: "reviews", label: "Reviews" },
    { id: "custom_api", label: "Custom API" },
  ];

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.storeId !== "all" ||
    filters.platform !== "all" ||
    filters.category !== "all";

  const clearAllFilters = () => {
    onChange({
      category: "all",
      search: "",
      status: "all",
      storeId: "all",
      platform: "all",
    });
  };

  return (
    <div className="space-y-4 mb-5">
      {/* Category Tabs / Chips */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Category filters">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            const count = counts[cat.id] ?? 0;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onChange({ category: cat.id })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle: Table vs Grid */}
        <div className="flex items-center gap-1 bg-[var(--muted)] p-0.5 rounded-lg shrink-0">
          <button
            onClick={() => onChange({ viewMode: "table" })}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              filters.viewMode === "table"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            title="Table view"
            aria-label="Table view"
          >
            <TableIcon size={14} />
          </button>
          <button
            onClick={() => onChange({ viewMode: "grid" })}
            className={`p-1.5 rounded-md text-xs transition-colors ${
              filters.viewMode === "grid"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            title="Grid view"
            aria-label="Grid view"
          >
            <LayoutGrid size={14} />
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Select Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search integrations"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] focus:ring-1 focus:ring-[var(--ring)]"
              aria-label="Search integrations"
            />
            {filters.search && (
              <button
                onClick={() => onChange({ search: "" })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                aria-label="Clear search query"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value as FilterState["status"] })}
              className="py-1.5 px-3 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="connected">Connected (All non-disconnected)</option>
              <option value="active">Active</option>
              <option value="syncing">Syncing</option>
              <option value="paused">Paused</option>
              <option value="needs_attention">Needs attention</option>
              <option value="connection_expired">Connection expired</option>
              <option value="disconnected">Disconnected</option>
            </select>
          </div>

          {/* Assigned Store Dropdown */}
          <div className="relative">
            <select
              value={filters.storeId}
              onChange={(e) => onChange({ storeId: e.target.value })}
              className="py-1.5 px-3 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] cursor-pointer"
              aria-label="Filter by assigned store"
            >
              <option value="all">All assigned stores</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Platform Dropdown */}
          <div className="relative">
            <select
              value={filters.platform}
              onChange={(e) => onChange({ platform: e.target.value as PlatformId | "all" })}
              className="py-1.5 px-3 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] cursor-pointer"
              aria-label="Filter by platform"
            >
              <option value="all">All platforms</option>
              {PLATFORMS_CATALOG.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X size={13} className="mr-1" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-xs text-[var(--muted-foreground)]">
          Showing <span className="font-semibold text-[var(--foreground)]">{filteredCount}</span>{" "}
          {filteredCount === 1 ? "integration" : "integrations"}
        </div>
      </div>
    </div>
  );
}
