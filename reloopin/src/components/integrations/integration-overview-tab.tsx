"use client";

import { useState } from "react";
import { IntegrationRecord } from "@/lib/integrations/integrations-types";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
} from "lucide-react";
import { toast } from "sonner";

export function IntegrationOverviewTab({
  integration,
}: {
  integration: IntegrationRecord;
}) {
  const [showDevDetails, setShowDevDetails] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCapabilityBadge = (status: "available" | "limited" | "unavailable") => {
    switch (status) {
      case "available":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--success,#16a34a)] bg-[var(--color-success-bg,rgba(34,197,94,0.1))] px-2 py-0.5 rounded-full">
            <CheckCircle2 size={12} /> Available
          </span>
        );
      case "limited":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--warning,#d97706)] bg-[var(--color-warning-bg,rgba(234,179,8,0.1))] px-2 py-0.5 rounded-full">
            <AlertTriangle size={12} /> Limited
          </span>
        );
      case "unavailable":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full border border-[var(--border)]">
            <XCircle size={12} /> Unavailable
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" data-testid="integration-overview-tab">
      {/* Top 2-Column Grid: Connection Details & Sync Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Details Card */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-4">
          <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
            Connection details
          </h3>

          <div className="divide-y divide-[var(--border)] text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Platform</span>
              <span className="font-medium text-[var(--foreground)]">{integration.platformName}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Integration name</span>
              <span className="font-medium text-[var(--foreground)]">{integration.name}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Assigned store</span>
              <span className="font-medium text-[var(--foreground)]">
                {integration.isStoreWorkspace ? "Store workspace" : integration.assignedStore}
              </span>
            </div>

            {(integration.storeUrl || integration.platformUrl) && (
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">Address / URL</span>
                <span className="font-mono text-[11px] text-[var(--foreground)] truncate max-w-[220px]">
                  {integration.storeUrl || integration.platformUrl}
                </span>
              </div>
            )}

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Connected on</span>
              <span className="text-[var(--foreground)]">{integration.connectedAt}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Last updated</span>
              <span className="text-[var(--foreground)]">{integration.lastSyncedAt}</span>
            </div>
          </div>
        </div>

        {/* Sync Summary Card */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-4">
          <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
            Sync summary
          </h3>

          <div className="divide-y divide-[var(--border)] text-xs">
            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Customers synced</span>
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {integration.stats.customersSynced.toLocaleString()}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Products synced</span>
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {integration.stats.productsSynced.toLocaleString()}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Orders synced</span>
              <span className="font-medium text-[var(--foreground)] tabular-nums">
                {integration.stats.ordersSynced.toLocaleString()}
              </span>
            </div>

            {integration.stats.reviewsSynced !== undefined && (
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[var(--muted-foreground)]">Reviews imported</span>
                <span className="font-medium text-[var(--foreground)] tabular-nums">
                  {integration.stats.reviewsSynced.toLocaleString()}
                </span>
              </div>
            )}

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Last successful sync</span>
              <span className="text-[var(--foreground)]">{integration.lastSynced}</span>
            </div>

            <div className="py-2.5 flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Next scheduled sync</span>
              <span className="text-[var(--foreground)]">{integration.nextScheduledSync}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Access Capabilities */}
      <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-4">
        <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
          Data access capabilities
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--foreground)]">Customers</span>
              {getCapabilityBadge(integration.dataAccess.customers)}
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
              Read customer profiles, lifetime spend, and reward balances.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--foreground)]">Products</span>
              {getCapabilityBadge(integration.dataAccess.products)}
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
              Read catalog items, SKUs, inventory status, and variants.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--foreground)]">Orders</span>
              {getCapabilityBadge(integration.dataAccess.orders)}
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
              Listen to purchase webhooks and award points automatically.
            </p>
          </div>

          <div className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--foreground)]">Reviews</span>
              {getCapabilityBadge(integration.dataAccess.reviews || "unavailable")}
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
              Award points for verified customer ratings and testimonials.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Details (Collapsed) */}
      <div className="border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowDevDetails(!showDevDetails)}
          className="w-full px-5 py-3 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center justify-between bg-[var(--muted)]/30 text-left transition-colors"
          data-testid="toggle-developer-details"
        >
          <span className="flex items-center gap-2">
            <Database size={14} /> Developer details
          </span>
          {showDevDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {showDevDetails && (
          <div className="p-5 border-t border-[var(--border)] space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Integration ID</span>
              <div className="flex items-center gap-2">
                <code className="bg-[var(--muted)] px-2 py-0.5 rounded text-[11px] font-mono">
                  {integration.id}
                </code>
                <button
                  onClick={() => copyToClipboard(integration.id, "Integration ID")}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
                  aria-label="Copy Integration ID"
                >
                  {copiedKey === "Integration ID" ? <Check size={12} className="text-[var(--success,#16a34a)]" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Merchant ID</span>
              <div className="flex items-center gap-2">
                <code className="bg-[var(--muted)] px-2 py-0.5 rounded text-[11px] font-mono">
                  mch_928104829
                </code>
                <button
                  onClick={() => copyToClipboard("mch_928104829", "Merchant ID")}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1"
                  aria-label="Copy Merchant ID"
                >
                  {copiedKey === "Merchant ID" ? <Check size={12} className="text-[var(--success,#16a34a)]" /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Internal platform type</span>
              <span className="font-mono text-[11px]">{integration.platform}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)]">Connected timestamp</span>
              <span className="text-[var(--muted-foreground)]">{integration.connectedAt}</span>
            </div>

            {integration.metadataJson && (
              <div className="pt-2">
                <span className="text-[var(--muted-foreground)] block mb-1.5">Raw metadata</span>
                <pre className="p-3 rounded-lg bg-[var(--muted)] font-mono text-[11px] overflow-x-auto text-[var(--foreground)]">
                  {integration.metadataJson}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
