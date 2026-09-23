"use client";

import { PrototypeState } from "@/lib/analytics-data";
import { SlidersHorizontal } from "lucide-react";

export function PrototypeStateSwitcher({
  currentState,
  onStateChange,
}: {
  currentState: PrototypeState;
  onStateChange: (state: PrototypeState) => void;
}) {
  const options: { value: PrototypeState; label: string }[] = [
    { value: "default", label: "Default (Full data)" },
    { value: "loading", label: "Loading (Skeletons)" },
    { value: "first_day", label: "First day (No activity)" },
    { value: "low_data", label: "Low data (Early insights)" },
    { value: "no_activity", label: "No period activity" },
    { value: "no_filter_results", label: "No filter results" },
    { value: "partial_data", label: "Partial data (Orders failed)" },
    { value: "stale_data", label: "Stale data (Sync delayed)" },
    { value: "disconnected", label: "Store disconnected" },
    { value: "section_error", label: "Section error (Single card)" },
    { value: "page_error", label: "Page error (Full failure)" },
    { value: "restricted", label: "Restricted access (Permissions)" },
    { value: "roi_unavailable", label: "ROI unavailable (Prerequisites)" },
    { value: "exporting", label: "Exporting (Modal progress)" },
    { value: "export_failed", label: "Export failed (Modal error)" },
  ];

  return (
    <div className="flex items-center gap-2 bg-[var(--muted)] border border-[var(--border)] rounded-md px-2.5 py-1 text-xs">
      <SlidersHorizontal size={13} className="text-[var(--muted-foreground)]" />
      <label htmlFor="preview-state-select" className="text-[var(--muted-foreground)] font-medium text-[11px] whitespace-nowrap">
        Preview state:
      </label>
      <select
        id="preview-state-select"
        value={currentState}
        onChange={(e) => onStateChange(e.target.value as PrototypeState)}
        className="bg-transparent text-[var(--foreground)] font-semibold text-xs border-0 focus:ring-0 focus:outline-none cursor-pointer py-0.5 pl-1 pr-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--card)] text-[var(--foreground)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

