"use client";

import { useState } from "react";
import { IntegrationRecord, SyncErrorItem } from "@/lib/integrations/integrations-types";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";

export function IntegrationSyncTab({
  integration,
  onSyncAll,
  isSyncing = false,
}: {
  integration: IntegrationRecord;
  onSyncAll: () => void;
  isSyncing?: boolean;
}) {
  const [errors, setErrors] = useState<SyncErrorItem[]>(integration.syncErrors || []);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const handleRetryError = (errId: string) => {
    setRetryingId(errId);
    setTimeout(() => {
      setErrors((prev) => prev.filter((e) => e.id !== errId));
      setRetryingId(null);
      toast.success("Record retry succeeded. Record synchronized.");
    }, 1000);
  };

  const handleSkipError = (errId: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== errId));
    toast.info("Error record marked as skipped.");
  };

  const handleRetryAll = () => {
    setRetryingId("all");
    setTimeout(() => {
      setErrors([]);
      setRetryingId(null);
      toast.success("All failed records retried and resolved.");
    }, 1200);
  };

  return (
    <div className="space-y-6" data-testid="integration-sync-tab">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Data synchronization status
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Monitor real-time data ingestion across customer records, products, and transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {errors.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryAll}
              disabled={retryingId === "all"}
              className="text-xs text-[var(--warning,#d97706)] flex items-center gap-1.5"
            >
              <RotateCw size={13} className={retryingId === "all" ? "animate-spin" : ""} />
              Retry failed records
            </Button>
          )}

          <Button
            size="sm"
            onClick={onSyncAll}
            disabled={isSyncing}
            className="text-xs flex items-center gap-1.5"
            data-testid="sync-all-data-button"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing catalog..." : "Sync all data"}
          </Button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--muted-foreground)] block mb-1">
            Last successful sync
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {integration.lastSynced}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--muted-foreground)] block mb-1">
            Records synced
          </span>
          <span className="text-xl font-semibold text-[var(--success,#16a34a)] tabular-nums">
            {integration.syncSummary.recordsSynced.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--muted-foreground)] block mb-1">
            Records skipped
          </span>
          <span className="text-xl font-semibold text-[var(--muted-foreground)] tabular-nums">
            {integration.syncSummary.recordsSkipped.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
          <span className="text-xs text-[var(--muted-foreground)] block mb-1">
            Records failed
          </span>
          <span
            className={`text-xl font-semibold tabular-nums ${
              errors.length > 0 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"
            }`}
          >
            {errors.length}
          </span>
        </div>
      </div>

      {/* Sync Progress Bar (Active/Syncing simulation) */}
      {isSyncing && (
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--foreground)] flex items-center gap-1.5">
              <RefreshCw size={13} className="animate-spin text-[var(--primary)]" />
              Syncing customers & orders
            </span>
            <span className="text-[var(--muted-foreground)] font-mono">
              1,840 of 2,486 records (74%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--muted)] overflow-hidden">
            <div className="h-full bg-[var(--primary)] transition-all duration-300 w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* Sync Table */}
      <div className="table-container border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--muted)]/20">
          <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
            Data Type Breakdown
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Data type</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Synced</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Skipped</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Failed</th>
                <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Last synced</th>
                <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {integration.syncRecords.map((rec) => (
                <tr key={rec.dataType} className="hover:bg-[var(--muted)]/30">
                  <td className="py-3 px-4 font-medium text-[var(--foreground)]">
                    {rec.dataType}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[var(--foreground)] font-mono">
                    {rec.synced.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[var(--muted-foreground)] font-mono">
                    {rec.skipped.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 tabular-nums font-mono">
                    <span className={rec.failed > 0 ? "text-[var(--destructive)] font-semibold" : "text-[var(--muted-foreground)]"}>
                      {rec.failed.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted-foreground)]">
                    {rec.lastSynced}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        rec.status === "Complete"
                          ? "bg-[var(--color-success-bg,rgba(34,197,94,0.1))] text-[var(--success,#16a34a)]"
                          : rec.status === "Failed"
                          ? "bg-[var(--color-destructive-container,rgba(239,68,68,0.1))] text-[var(--destructive)]"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {rec.status === "Complete" ? (
                        <CheckCircle2 size={11} />
                      ) : rec.status === "Failed" ? (
                        <XCircle size={11} />
                      ) : null}
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sync Errors Table */}
      {errors.length > 0 && (
        <div className="table-container border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--color-destructive-container,rgba(239,68,68,0.06))] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-[var(--destructive)]" />
              <h4 className="text-xs font-semibold text-[var(--destructive)] uppercase tracking-wider">
                Sync Issues ({errors.length})
              </h4>
            </div>
            <span className="text-[11px] text-[var(--muted-foreground)]">
              Fix issues and retry records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                  <th className="py-2.5 px-4 font-medium text-[var(--muted-foreground)]">Record</th>
                  <th className="py-2.5 px-4 font-medium text-[var(--muted-foreground)]">Data type</th>
                  <th className="py-2.5 px-4 font-medium text-[var(--muted-foreground)]">Issue</th>
                  <th className="py-2.5 px-4 font-medium text-[var(--muted-foreground)]">Last attempt</th>
                  <th className="py-2.5 px-4 text-right font-medium text-[var(--muted-foreground)]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {errors.map((err) => (
                  <tr key={err.id} className="hover:bg-[var(--muted)]/30">
                    <td className="py-3 px-4 font-medium text-[var(--foreground)]">
                      {err.record}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">
                      <span className="px-2 py-0.5 rounded-md bg-[var(--muted)] text-[10px] border border-[var(--border)]">
                        {err.dataType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--destructive)] max-w-xs">
                      {err.issue}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)] text-[11px]">
                      {err.lastAttempt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={retryingId === err.id}
                          onClick={() => handleRetryError(err.id)}
                          className="h-7 px-2 text-[11px] flex items-center gap-1"
                        >
                          <RotateCw
                            size={11}
                            className={retryingId === err.id ? "animate-spin" : ""}
                          />
                          Retry
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSkipError(err.id)}
                          className="h-7 px-2 text-[11px] text-[var(--muted-foreground)]"
                        >
                          Skip
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
