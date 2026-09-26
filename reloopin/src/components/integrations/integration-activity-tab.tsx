"use client";

import { AuditActivityItem } from "@/lib/integrations/integrations-types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Clock,
  User,
  Cpu,
} from "lucide-react";

export function IntegrationActivityTab({
  activityLog,
}: {
  activityLog: AuditActivityItem[];
}) {
  const getResultBadge = (result: AuditActivityItem["result"]) => {
    switch (result) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--success,#16a34a)] bg-[var(--color-success-bg,rgba(34,197,94,0.1))] px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} /> Success
          </span>
        );
      case "Warning":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--warning,#d97706)] bg-[var(--color-warning-bg,rgba(234,179,8,0.1))] px-2 py-0.5 rounded-full">
            <AlertTriangle size={11} /> Warning
          </span>
        );
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--destructive)] bg-[var(--color-destructive-container,rgba(239,68,68,0.1))] px-2 py-0.5 rounded-full">
            <XCircle size={11} /> Failed
          </span>
        );
      case "Info":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--primary)] bg-[var(--color-primary-container,rgba(99,102,241,0.1))] px-2 py-0.5 rounded-full">
            <Info size={11} /> Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-3xl" data-testid="integration-activity-tab">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            Audit Activity Timeline
          </h3>
          <p className="text-xs text-[var(--muted-foreground)]">
            Chronological record of synchronization runs, connection tests, and credential changes.
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
        {activityLog.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Node Dot */}
            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-[var(--card)] border-2 border-[var(--primary)] shadow-xs" />

            <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-2 hover:border-[var(--ring)] transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  {item.event}
                </span>
                <div className="flex items-center gap-2">
                  {getResultBadge(item.result)}
                  <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
                    <Clock size={11} /> {item.date}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--foreground)] leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-[var(--border)]/60 flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
                {item.performedBy.includes("System") ? (
                  <Cpu size={12} className="text-[var(--muted-foreground)]" />
                ) : (
                  <User size={12} className="text-[var(--muted-foreground)]" />
                )}
                <span>Performed by {item.performedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
