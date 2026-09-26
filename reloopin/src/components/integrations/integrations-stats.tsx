"use client";

import { IntegrationRecord } from "@/lib/integrations/integrations-types";
import { CheckCircle2, RefreshCw, AlertTriangle, PauseCircle } from "lucide-react";

export function IntegrationsStats({
  integrations,
  isLoading = false,
}: {
  integrations: IntegrationRecord[];
  isLoading?: boolean;
}) {
  const connectedCount = integrations.filter((i) => i.status !== "disconnected").length;
  const activeCount = integrations.filter((i) => i.status === "active" || i.status === "syncing").length;
  const needsAttentionCount = integrations.filter(
    (i) => i.status === "needs_attention" || i.status === "connection_expired",
  ).length;
  const pausedCount = integrations.filter((i) => i.status === "paused").length;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] animate-pulse space-y-3"
          >
            <div className="h-3.5 w-24 bg-[var(--muted)] rounded" />
            <div className="h-8 w-16 bg-[var(--muted)] rounded" />
            <div className="h-3 w-40 bg-[var(--muted)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      id: "connected",
      title: "Connected",
      value: connectedCount,
      description: "Integrations connected to your account",
      icon: CheckCircle2,
      iconColor: "text-[var(--primary)]",
    },
    {
      id: "active",
      title: "Active",
      value: activeCount,
      description: "Currently syncing data",
      icon: RefreshCw,
      iconColor: "text-[var(--success,#16a34a)]",
    },
    {
      id: "needs-attention",
      title: "Needs attention",
      value: needsAttentionCount,
      description: "Connection or sync issues",
      icon: AlertTriangle,
      iconColor:
        needsAttentionCount > 0
          ? "text-[var(--warning,#d97706)]"
          : "text-[var(--muted-foreground)]",
    },
  ];

  if (pausedCount > 0) {
    statItems.push({
      id: "paused",
      title: "Paused",
      value: pausedCount,
      description: "Connected but not syncing",
      icon: PauseCircle,
      iconColor: "text-[var(--muted-foreground)]",
    });
  }

  const gridColsClass =
    statItems.length === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-3";

  return (
    <div className={`grid ${gridColsClass} gap-4 mb-6`} data-testid="integrations-stats">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs transition-shadow hover:shadow-sm"
          >
            <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] font-medium">
              <span>{stat.title}</span>
              <Icon size={16} className={stat.iconColor} aria-hidden="true" />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] tabular-nums">
              {stat.value}
            </div>
            <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
