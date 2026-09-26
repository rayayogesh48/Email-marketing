"use client";

import { IntegrationRecord } from "@/lib/integrations/integrations-types";
import { PlatformIcon } from "./platform-icon";
import { IntegrationStatusBadge } from "./integration-status-badge";
import { Menu } from "@/components/ui/menu";
import {
  MoreHorizontal,
  RefreshCw,
  Play,
  Pause,
  ExternalLink,
  Edit,
  Trash2,
  AlertTriangle,
  RotateCw,
  Activity,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function IntegrationsGrid({
  integrations,
  onSync,
  onPause,
  onResume,
  onTestConnection,
  onReconnect,
  onRemove,
  onViewIssue,
}: {
  integrations: IntegrationRecord[];
  onSync: (integration: IntegrationRecord) => void;
  onPause: (integration: IntegrationRecord) => void;
  onResume: (integration: IntegrationRecord) => void;
  onTestConnection: (integration: IntegrationRecord) => void;
  onReconnect: (integration: IntegrationRecord) => void;
  onRemove: (integration: IntegrationRecord) => void;
  onViewIssue: (integration: IntegrationRecord) => void;
}) {
  const router = useRouter();

  const getRowMenuItems = (item: IntegrationRecord) => {
    const items = [];

    if (item.status === "paused") {
      items.push({
        label: "Resume syncing",
        icon: <Play size={13} className="mr-2 text-[var(--success,#16a34a)]" />,
        action: () => onResume(item),
      });
      items.push({
        label: "Test connection",
        icon: <CheckCircle2 size={13} className="mr-2" />,
        action: () => onTestConnection(item),
      });
      items.push({
        label: "Edit",
        icon: <Edit size={13} className="mr-2" />,
        action: () => router.push(`/integrations/${item.id}/edit`),
      });
      items.push({
        label: "Remove integration",
        icon: <Trash2 size={13} className="mr-2 text-[var(--destructive)]" />,
        danger: true,
        action: () => onRemove(item),
      });
    } else if (item.status === "needs_attention") {
      items.push({
        label: "View issue",
        icon: <AlertTriangle size={13} className="mr-2 text-[var(--warning,#d97706)]" />,
        action: () => onViewIssue(item),
      });
      items.push({
        label: "Reconnect",
        icon: <RotateCw size={13} className="mr-2 text-[var(--primary)]" />,
        action: () => onReconnect(item),
      });
      items.push({
        label: "Test connection",
        icon: <CheckCircle2 size={13} className="mr-2" />,
        action: () => onTestConnection(item),
      });
      items.push({
        label: "Remove integration",
        icon: <Trash2 size={13} className="mr-2 text-[var(--destructive)]" />,
        danger: true,
        action: () => onRemove(item),
      });
    } else if (item.status === "disconnected") {
      items.push({
        label: "Reconnect",
        icon: <RotateCw size={13} className="mr-2 text-[var(--primary)]" />,
        action: () => onReconnect(item),
      });
      items.push({
        label: "View previous activity",
        icon: <Activity size={13} className="mr-2" />,
        action: () => router.push(`/integrations/${item.id}?tab=activity`),
      });
      items.push({
        label: "Remove integration",
        icon: <Trash2 size={13} className="mr-2 text-[var(--destructive)]" />,
        danger: true,
        action: () => onRemove(item),
      });
    } else {
      items.push({
        label: "View details",
        icon: <ExternalLink size={13} className="mr-2" />,
        action: () => router.push(`/integrations/${item.id}`),
      });
      items.push({
        label: "Sync now",
        icon: <RefreshCw size={13} className="mr-2" />,
        action: () => onSync(item),
      });
      items.push({
        label: "Test connection",
        icon: <CheckCircle2 size={13} className="mr-2" />,
        action: () => onTestConnection(item),
      });
      items.push({
        label: "Edit",
        icon: <Edit size={13} className="mr-2" />,
        action: () => router.push(`/integrations/${item.id}/edit`),
      });
      items.push({
        label: "Pause",
        icon: <Pause size={13} className="mr-2" />,
        action: () => onPause(item),
      });
      items.push({
        label: "Remove integration",
        icon: <Trash2 size={13} className="mr-2 text-[var(--destructive)]" />,
        danger: true,
        action: () => onRemove(item),
      });
    }

    return items;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="integrations-grid">
      {integrations.map((item) => (
        <div
          key={item.id}
          className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs flex flex-col justify-between hover:border-[var(--ring)] transition-all group"
          data-testid={`integration-card-${item.id}`}
        >
          {/* Card Top: Logo, Name, Badge, Menu */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <PlatformIcon platform={item.platform} size={36} />
                <div>
                  <Link
                    href={`/integrations/${item.id}`}
                    className="font-medium text-sm text-[var(--foreground)] hover:underline block leading-tight"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {item.platformName}
                  </span>
                </div>
              </div>

              <Menu
                label={`More actions for ${item.name}`}
                trigger={<MoreHorizontal size={16} />}
                items={getRowMenuItems(item)}
              />
            </div>

            {/* Status & Store assignment */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <IntegrationStatusBadge status={item.status} size="sm" />
              <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                {item.isStoreWorkspace ? "Store workspace" : item.assignedStore}
              </span>
            </div>

            {/* Sync activity info */}
            <p className="text-xs text-[var(--muted-foreground)] mb-4 line-clamp-2">
              {item.activitySummary === "Sync failed" ? (
                <span className="text-[var(--destructive)] font-medium">Sync issue detected</span>
              ) : (
                item.activitySummary
              )}
            </p>
          </div>

          {/* Card Bottom: Last synced & Primary action */}
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 mt-auto">
            <span className="text-[11px] text-[var(--muted-foreground)]">
              Synced {item.lastSynced}
            </span>

            {item.status === "needs_attention" ? (
              <button
                onClick={() => onReconnect(item)}
                className="button button-outline button-sm text-xs text-[var(--warning,#d97706)] hover:bg-[var(--warning,#d97706)]/10"
              >
                Reconnect
              </button>
            ) : item.status === "paused" ? (
              <button
                onClick={() => onResume(item)}
                className="button button-outline button-sm text-xs"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={() => onSync(item)}
                className="button button-outline button-sm text-xs flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                Sync now
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
