"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IntegrationRecord, APISettings } from "@/lib/integrations/integrations-types";
import {
  AlertTriangle,
  RotateCw,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

// ============================================================================
// PAUSE INTEGRATION DIALOG
// ============================================================================
export function PauseIntegrationDialog({
  open,
  onClose,
  integration,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  integration: IntegrationRecord | null;
  onConfirm: () => void;
}) {
  if (!integration) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Pause this integration?"
      description="Reloopin will stop syncing new data until the integration is resumed. Existing loyalty history will remain available."
    >
      <div className="py-3 text-xs space-y-4">
        <div className="p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg text-[var(--muted-foreground)] leading-relaxed">
          Customer points balances and reward redemptions accumulated to date will not be lost.
        </div>

        <div className="dialog-actions flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Keep active
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
              toast.info("Integration paused");
            }}
            data-testid="confirm-pause-button"
          >
            Pause integration
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// REMOVE INTEGRATION DIALOG (Typed confirmation for store workspaces)
// ============================================================================
export function RemoveIntegrationDialog({
  open,
  onClose,
  integration,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  integration: IntegrationRecord | null;
  onConfirm: () => void;
}) {
  const [typedConfirmation, setTypedConfirmation] = useState("");

  if (!integration) return null;

  const isStore = integration.isStoreWorkspace;
  const canRemove = !isStore || typedConfirmation.trim() === integration.name.trim();

  const handleClose = () => {
    setTypedConfirmation("");
    onClose();
  };

  const handleConfirm = () => {
    if (!canRemove) return;
    onConfirm();
    setTypedConfirmation("");
    onClose();
    toast.success("Integration removed");
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Remove ${integration.name}?`}
      description={`Reloopin will stop syncing customers, products, orders, and loyalty activity from this ${isStore ? "store" : "channel"}. Existing loyalty history will remain available.`}
    >
      <div className="py-3 text-xs space-y-4">
        {isStore && (
          <div className="p-3 bg-[var(--color-warning-bg,rgba(234,179,8,0.1))] border border-[var(--warning,#d97706)]/20 rounded-lg text-[var(--warning,#d97706)] flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Store workspace removal</span>
              <span>This store will also be removed from the sidebar store switcher.</span>
            </div>
          </div>
        )}

        {isStore ? (
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-[var(--foreground)] block">
              Type <strong className="font-mono text-[var(--primary)]">{integration.name}</strong> to confirm:
            </label>
            <input
              type="text"
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              placeholder={integration.name}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-medium"
              data-testid="remove-confirm-input"
            />
          </div>
        ) : (
          <p className="text-xs text-[var(--muted-foreground)]">
            Are you sure you want to disconnect this channel integration?
          </p>
        )}

        <div className="dialog-actions flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Keep integration
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={!canRemove}
            onClick={handleConfirm}
            data-testid="confirm-remove-button"
          >
            Remove integration
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// RECONNECT INTEGRATION MODAL
// ============================================================================
export function ReconnectIntegrationModal({
  open,
  onClose,
  integration,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  integration: IntegrationRecord | null;
  onConfirm: () => void;
}) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  if (!integration) return null;

  const handleReconnect = () => {
    setIsReconnecting(true);
    setTimeout(() => {
      onConfirm();
      setIsReconnecting(false);
      onClose();
      toast.success("Integration reconnected");
    }, 1200);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Reconnect ${integration.name}`}
      description="Renew credentials and verify webhooks to restore continuous background syncing."
    >
      <div className="py-3 text-xs space-y-4">
        {integration.statusIssue && (
          <div className="p-3 bg-[var(--color-warning-bg,rgba(234,179,8,0.1))] border border-[var(--warning,#d97706)]/20 rounded-lg text-[var(--warning,#d97706)] flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span className="leading-relaxed">{integration.statusIssue}</span>
          </div>
        )}

        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Clicking Reconnect will re-validate the platform URL, verify API permission scopes, and clear previous sync interruptions.
        </p>

        <div className="dialog-actions flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleReconnect}
            disabled={isReconnecting}
            className="flex items-center gap-1.5"
            data-testid="confirm-reconnect-button"
          >
            <RotateCw size={13} className={isReconnecting ? "animate-spin" : ""} />
            {isReconnecting ? "Verifying..." : "Reconnect now"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ============================================================================
// API SETTINGS MODAL
// ============================================================================
export function APISettingsModal({
  open,
  onClose,
  settings,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  settings: APISettings;
  onSave: (updated: Partial<APISettings>) => void;
}) {
  const [interval, setInterval] = useState(settings.syncInterval);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = () => {
    onSave({ syncInterval: interval });
    onClose();
    toast.success("API settings saved");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="API settings"
      description="Manage your account API credentials, global webhook signing secrets, and sync frequencies."
    >
      <div className="py-3 text-xs space-y-4">
        {/* Public API Key */}
        <div className="space-y-1">
          <span className="text-[var(--muted-foreground)] font-medium">Reloopin public API key</span>
          <div className="flex items-center justify-between gap-2 bg-[var(--muted)]/50 p-2.5 rounded-lg border border-[var(--border)]">
            <code className="font-mono text-xs text-[var(--foreground)] truncate">
              {settings.reloopinApiKey}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(settings.reloopinApiKey, "API Key")}
              className="h-7 px-2 text-[11px] shrink-0 flex items-center gap-1"
            >
              {copiedKey === "API Key" ? <Check size={12} className="text-[var(--success,#16a34a)]" /> : <Copy size={12} />}
              Copy
            </Button>
          </div>
        </div>

        {/* Webhook Secret */}
        <div className="space-y-1">
          <span className="text-[var(--muted-foreground)] font-medium">Webhook signing secret</span>
          <div className="flex items-center justify-between gap-2 bg-[var(--muted)]/50 p-2.5 rounded-lg border border-[var(--border)]">
            <code className="font-mono text-xs text-[var(--foreground)] truncate">
              {settings.webhookSigningSecret}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(settings.webhookSigningSecret, "Signing Secret")}
              className="h-7 px-2 text-[11px] shrink-0 flex items-center gap-1"
            >
              {copiedKey === "Signing Secret" ? <Check size={12} className="text-[var(--success,#16a34a)]" /> : <Copy size={12} />}
              Copy
            </Button>
          </div>
        </div>

        {/* Sync Interval */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[var(--muted-foreground)] font-medium block">
            Default synchronization interval
          </label>
          <select
            value={interval}
            onChange={(e) => setInterval(e.target.value as APISettings["syncInterval"])}
            className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] cursor-pointer"
          >
            <option value="15m">Every 15 minutes (Recommended)</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
          </select>
        </div>

        {/* Whitelisted IPs */}
        <div className="space-y-1 pt-1">
          <span className="text-[var(--muted-foreground)] font-medium block">Allowed server IP addresses</span>
          <div className="p-2.5 bg-[var(--muted)]/40 rounded-lg border border-[var(--border)] font-mono text-[11px] text-[var(--muted-foreground)] space-y-0.5">
            {settings.ipWhitelist.map((ip) => (
              <div key={ip}>• {ip}</div>
            ))}
          </div>
        </div>

        <div className="dialog-actions flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save settings
          </Button>
        </div>
      </div>
    </Modal>
  );
}
