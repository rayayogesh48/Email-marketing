"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";
import {
  AnalyticsFixture,
  generateCSVExport,
  PrototypeState,
} from "@/lib/analytics-data";
import { toast } from "sonner";

export function ExportAnalyticsDialog({
  open,
  onClose,
  fixture,
  prototypeState,
}: {
  open: boolean;
  onClose: () => void;
  fixture: AnalyticsFixture;
  prototypeState: PrototypeState;
}) {
  const [scope, setScope] = useState<"all" | "loyalty" | "vip" | "roi">("all");
  const [format, setFormat] = useState<"csv">("csv");
  const [internalState, setInternalState] = useState<
    "idle" | "preparing" | "downloading" | "success" | "failed"
  >("idle");

  // Determine effective status: prototype state override or user action
  const isPrototypeExporting = prototypeState === "exporting";
  const isPrototypeFailed = prototypeState === "export_failed";

  const effectiveStatus = isPrototypeFailed
    ? "failed"
    : isPrototypeExporting
    ? "preparing"
    : internalState;

  const handleExport = () => {
    if (isPrototypeFailed) {
      setInternalState("failed");
      return;
    }

    setInternalState("preparing");

    setTimeout(() => {
      setInternalState("downloading");

      try {
        const csvContent = generateCSVExport(fixture, scope);
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const filename = `reloopin-analytics-${scope}-${new Date().toISOString().split("T")[0]}.csv`;

        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setInternalState("success");
        toast.success("Analytics report exported.");

        setTimeout(() => {
          setInternalState("idle");
          onClose();
        }, 1200);
      } catch {
        setInternalState("failed");
      }
    }, 800);
  };

  const handleReset = () => {
    setInternalState("idle");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Export analytics"
      description="Download analytics for the selected date range."
      wide={false}
    >
      <div className="space-y-5 pt-3">
        {/* Selected Period Info */}
        <div className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Date range:</span>
            <strong className="text-[var(--foreground)]">{fixture.currentDateRangeLabel}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted-foreground)]">Comparison:</span>
            <span className="text-[var(--muted-foreground)]">{fixture.comparisonRangeLabel}</span>
          </div>
        </div>

        {effectiveStatus === "failed" ? (
          /* Failed state */
          <div className="p-4 rounded-xl bg-[var(--destructive-container)] border border-[var(--destructive)]/30 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] mx-auto flex items-center justify-center">
              <AlertCircle size={22} />
            </div>
            <h4 className="font-semibold text-sm text-[var(--foreground)]">Export failed</h4>
            <p className="text-xs text-[var(--muted-foreground)]">
              We could not prepare the report. Try again.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="outline" onClick={handleReset}>
                Try again
              </Button>
            </div>
          </div>
        ) : effectiveStatus === "preparing" || effectiveStatus === "downloading" ? (
          /* Preparing / downloading state */
          <div className="p-8 text-center space-y-3">
            <Loader2 size={32} className="animate-spin text-[var(--primary)] mx-auto" />
            <h4 className="font-semibold text-sm text-[var(--foreground)]">
              {effectiveStatus === "preparing" ? "Preparing analytics report..." : "Downloading report..."}
            </h4>
            <p className="text-xs text-[var(--muted-foreground)]">
              Compiling metrics and calculating period comparison deltas.
            </p>
          </div>
        ) : effectiveStatus === "success" ? (
          /* Success state */
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 size={32} className="text-[#16a34a] mx-auto" />
            <h4 className="font-semibold text-sm text-[var(--foreground)]">Report exported!</h4>
            <p className="text-xs text-[var(--muted-foreground)]">
              Your CSV download has started.
            </p>
          </div>
        ) : (
          /* Normal form controls */
          <>
            {/* Report Scope */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--foreground)] block">
                Select report
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  { id: "all", label: "Complete analytics" },
                  { id: "loyalty", label: "Loyalty performance" },
                  { id: "vip", label: "VIP tiers" },
                  { id: "roi", label: "Program ROI" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                      scope === item.id
                        ? "border-[var(--primary)] bg-[var(--primary-container)]/40 text-[var(--foreground)]"
                        : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-[var(--ring)]"
                    }`}
                    onClick={() => setScope(item.id as typeof scope)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--foreground)] block">
                Format
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${
                    format === "csv"
                      ? "border-[var(--primary)] bg-[var(--primary-container)]/40 text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)]"
                  }`}
                  onClick={() => setFormat("csv")}
                >
                  <FileSpreadsheet size={15} />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border)]">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleExport}>
                <Download size={13} className="mr-1.5" /> Export report
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

