import {
  CheckCircle2,
  RefreshCw,
  PauseCircle,
  AlertTriangle,
  Clock,
  XCircle,
} from "lucide-react";
import { IntegrationStatus } from "@/lib/integrations/integrations-types";

export function IntegrationStatusBadge({
  status,
  size = "md",
}: {
  status: IntegrationStatus;
  size?: "sm" | "md";
}) {
  const iconSize = size === "sm" ? 11 : 13;
  const paddingClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]";

  switch (status) {
    case "active":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-success-bg,rgba(34,197,94,0.12))] text-[var(--success,#16a34a)] ${paddingClass}`}
        >
          <CheckCircle2 size={iconSize} className="shrink-0" aria-hidden="true" />
          <span>Active</span>
        </span>
      );
    case "syncing":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-info-container,rgba(59,130,246,0.12))] text-[var(--info,#2563eb)] ${paddingClass}`}
        >
          <RefreshCw size={iconSize} className="shrink-0 animate-spin" aria-hidden="true" />
          <span>Syncing</span>
        </span>
      );
    case "paused":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)] ${paddingClass}`}
        >
          <PauseCircle size={iconSize} className="shrink-0" aria-hidden="true" />
          <span>Paused</span>
        </span>
      );
    case "needs_attention":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-warning-bg,rgba(234,179,8,0.12))] text-[var(--warning,#d97706)] ${paddingClass}`}
        >
          <AlertTriangle size={iconSize} className="shrink-0" aria-hidden="true" />
          <span>Needs attention</span>
        </span>
      );
    case "connection_expired":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-warning-bg,rgba(234,179,8,0.12))] text-[var(--warning,#d97706)] ${paddingClass}`}
        >
          <Clock size={iconSize} className="shrink-0" aria-hidden="true" />
          <span>Connection expired</span>
        </span>
      );
    case "disconnected":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[var(--color-destructive-container,rgba(239,68,68,0.12))] text-[var(--destructive,#dc2626)] ${paddingClass}`}
        >
          <XCircle size={iconSize} className="shrink-0" aria-hidden="true" />
          <span>Disconnected</span>
        </span>
      );
  }
}
