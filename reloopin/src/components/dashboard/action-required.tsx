"use client";

import { useState } from "react";
import { AlertTriangle, Info, X, ArrowRight, ExternalLink } from "lucide-react";
import { DashboardAlert } from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";

export function ActionRequired({
  alerts,
  onOpenAllAlerts,
  onActionClick,
}: {
  alerts: DashboardAlert[];
  onOpenAllAlerts: () => void;
  onActionClick?: (alert: DashboardAlert) => void;
}) {
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("reloopin:dismissed_alerts");
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  if (activeAlerts.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("reloopin:dismissed_alerts", JSON.stringify(updated));
      } catch {
        // Ignore session storage errors
      }
    }
  };

  const inlineAlerts = activeAlerts.slice(0, 3);
  const hasMore = activeAlerts.length > 3;

  return (
    <section className="mb-6 space-y-3" aria-label="Action required items">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--warning)] animate-pulse" />
          <h2 className="text-sm font-semibold text-[var(--foreground)] tracking-tight">
            {activeAlerts.length} {activeAlerts.length === 1 ? "item needs" : "items need"} your attention
          </h2>
        </div>

        {hasMore && (
          <button
            type="button"
            onClick={onOpenAllAlerts}
            className="text-xs font-medium text-[var(--primary)] hover:underline cursor-pointer"
          >
            View all ({activeAlerts.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {inlineAlerts.map((alert) => {
          const isWarning = alert.type === "warning" || alert.type === "critical";

          return (
            <div
              key={alert.id}
              className={`relative flex flex-col justify-between p-3.5 rounded-lg border transition-all ${
                isWarning
                  ? "bg-[var(--warning-container)]/25 border-[var(--warning)]/30 hover:border-[var(--warning)]/50"
                  : "bg-[var(--info-container)]/25 border-[var(--info)]/30 hover:border-[var(--info)]/50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isWarning ? (
                      <AlertTriangle size={15} className="text-[var(--warning)] shrink-0" />
                    ) : (
                      <Info size={15} className="text-[var(--info)] shrink-0" />
                    )}
                    <h3 className="text-xs font-semibold text-[var(--foreground)] leading-snug">
                      {alert.title}
                    </h3>
                  </div>

                  {alert.isDismissible && (
                    <button
                      type="button"
                      onClick={() => handleDismiss(alert.id)}
                      className="p-1 -mr-1 -mt-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded transition-colors"
                      aria-label={`Dismiss ${alert.title}`}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[var(--border)]/60 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onActionClick?.(alert)}
                  className="h-7 px-2 text-xs font-medium text-[var(--foreground)] hover:text-[var(--primary)] gap-1 p-0 justify-start"
                >
                  <span>{alert.actionLabel}</span>
                  {alert.actionHref?.startsWith("http") ? (
                    <ExternalLink size={11} />
                  ) : (
                    <ArrowRight size={11} />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

