"use client";

import { IntegrationRecord } from "@/lib/integrations/integrations-types";
import { PlatformIcon } from "./platform-icon";
import { IntegrationStatusBadge } from "./integration-status-badge";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/ui/menu";
import {
  RefreshCw,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Pause,
  Play,
  RotateCw,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function IntegrationDetailHeader({
  integration,
  onSyncNow,
  onTestConnection,
  onPause,
  onResume,
  onReconnect,
  onRemove,
  isSyncing = false,
}: {
  integration: IntegrationRecord;
  onSyncNow: () => void;
  onTestConnection: () => void;
  onPause: () => void;
  onResume: () => void;
  onReconnect: () => void;
  onRemove: () => void;
  isSyncing?: boolean;
}) {
  const router = useRouter();

  const getMenuItems = () => {
    const items = [];

    if (integration.status === "paused") {
      items.push({
        label: "Resume integration",
        icon: <Play size={13} className="mr-2 text-[var(--success,#16a34a)]" />,
        action: onResume,
      });
    } else {
      items.push({
        label: "Pause integration",
        icon: <Pause size={13} className="mr-2 text-[var(--muted-foreground)]" />,
        action: onPause,
      });
    }

    if (
      integration.status === "needs_attention" ||
      integration.status === "disconnected" ||
      integration.status === "connection_expired"
    ) {
      items.push({
        label: "Reconnect",
        icon: <RotateCw size={13} className="mr-2 text-[var(--primary)]" />,
        action: onReconnect,
      });
    }

    items.push({
      label: "Remove integration",
      icon: <Trash2 size={13} className="mr-2 text-[var(--destructive)]" />,
      danger: true,
      action: onRemove,
    });

    return items;
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Back to Integrations breadcrumb */}
      <div>
        <Link
          href="/integrations"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={13} />
          Back to integrations
        </Link>
      </div>

      {/* Main Header Container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <div className="flex items-start gap-3.5">
          <PlatformIcon platform={integration.platform} size={42} />
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
                {integration.name}
              </h1>
              <IntegrationStatusBadge status={integration.status} size="sm" />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted-foreground)]">
              <span>{integration.platformName}</span>
              <span>•</span>
              <span>
                {integration.isStoreWorkspace ? "Store workspace" : integration.assignedStore}
              </span>
              <span>•</span>
              <span>Last synced {integration.lastSynced}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={onSyncNow}
            disabled={isSyncing || integration.status === "paused"}
            className="flex items-center gap-1.5"
            data-testid="detail-sync-now-button"
          >
            <RefreshCw size={13} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Sync now"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onTestConnection}
            className="flex items-center gap-1.5 text-xs"
            data-testid="detail-test-connection-button"
          >
            <CheckCircle2 size={13} className="text-[var(--primary)]" />
            Test connection
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/integrations/${integration.id}/edit`)}
            className="flex items-center gap-1.5 text-xs"
            data-testid="detail-edit-button"
          >
            <Edit size={13} />
            Edit
          </Button>

          <Menu
            label="More actions"
            trigger={<MoreHorizontal size={15} />}
            items={getMenuItems()}
          />
        </div>
      </div>
    </div>
  );
}
