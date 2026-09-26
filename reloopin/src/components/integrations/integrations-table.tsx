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

export function IntegrationsTable({
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

  const getCategoryLabel = (category: IntegrationRecord["category"]) => {
    switch (category) {
      case "store":
        return "Store";
      case "pos":
        return "POS";
      case "social":
        return "Social";
      case "reviews":
        return "Reviews";
      case "custom_api":
        return "Custom API";
      default:
        return category;
    }
  };

  const getRowMenuItems = (item: IntegrationRecord) => {
    const items = [];

    // Default actions depending on status
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
      // Active or Syncing (Default)
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
    <div className="table-container border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
              <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Integration</th>
              <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Category</th>
              <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Assigned store</th>
              <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Status</th>
              <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Last synced</th>
              <th className="py-3 px-4 font-medium text-[var(--muted-foreground)]">Activity</th>
              <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {integrations.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[var(--muted)]/50 transition-colors group"
                data-testid={`integration-row-${item.id}`}
              >
                {/* Integration Cell */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <PlatformIcon platform={item.platform} size={28} />
                    <div>
                      <Link
                        href={`/integrations/${item.id}`}
                        className="font-medium text-[var(--foreground)] hover:underline focus:outline-none focus:underline block"
                      >
                        {item.name}
                      </Link>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {item.platformName}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category Cell */}
                <td className="py-3.5 px-4 text-[var(--muted-foreground)]">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--muted)] text-[11px] font-medium border border-[var(--border)]">
                    {getCategoryLabel(item.category)}
                  </span>
                </td>

                {/* Assigned Store Cell */}
                <td className="py-3.5 px-4 text-[var(--foreground)]">
                  {item.isStoreWorkspace ? (
                    <span className="font-medium text-[var(--foreground)] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                      Store workspace
                    </span>
                  ) : (
                    <span className="text-[var(--muted-foreground)]">{item.assignedStore}</span>
                  )}
                </td>

                {/* Status Badge Cell */}
                <td className="py-3.5 px-4">
                  <IntegrationStatusBadge status={item.status} size="sm" />
                </td>

                {/* Last Synced Cell */}
                <td className="py-3.5 px-4 text-[var(--muted-foreground)] text-[11px] whitespace-nowrap">
                  {item.lastSynced}
                </td>

                {/* Activity Cell */}
                <td className="py-3.5 px-4 text-[var(--muted-foreground)] text-[11px]">
                  <span
                    className={
                      item.activitySummary === "Sync failed"
                        ? "text-[var(--destructive)] font-medium"
                        : ""
                    }
                  >
                    {item.activitySummary}
                  </span>
                </td>

                {/* Actions Menu Cell */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
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
                        className="button button-ghost button-icon p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        title="Sync now"
                        aria-label={`Sync ${item.name}`}
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}

                    <Menu
                      label={`More actions for ${item.name}`}
                      trigger={<MoreHorizontal size={15} />}
                      items={getRowMenuItems(item)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
