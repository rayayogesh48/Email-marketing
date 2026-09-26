"use client";

import { useState } from "react";
import { IntegrationRecord } from "@/lib/integrations/integrations-types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import {
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export function IntegrationCredentialsTab({
  integration,
  onRotateCredentials,
  onRevokeCredentials,
}: {
  integration: IntegrationRecord;
  onRotateCredentials: () => void;
  onRevokeCredentials: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isRotateModalOpen, setIsRotateModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);

  // New credential input states (replace)
  const [newKey, setNewKey] = useState("");
  const [newSecret, setNewSecret] = useState("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmRotate = () => {
    onRotateCredentials();
    setIsRotateModalOpen(false);
    toast.success("Credentials rotated successfully. Prior keys have been revoked.");
  };

  const handleConfirmRevoke = () => {
    onRevokeCredentials();
    setIsRevokeModalOpen(false);
    toast.error("Credentials revoked. Integration disconnected.");
  };

  const handleConfirmReplace = () => {
    onRotateCredentials();
    setIsReplaceModalOpen(false);
    setNewKey("");
    setNewSecret("");
    toast.success("Credentials updated successfully.");
  };

  return (
    <div className="space-y-6 max-w-3xl" data-testid="integration-credentials-tab">
      {/* Security Info Banner */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 flex items-start gap-3">
        <ShieldCheck size={18} className="text-[var(--success,#16a34a)] mt-0.5 shrink-0" />
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-[var(--foreground)]">
            Encrypted credential vault
          </h4>
          <p className="text-[var(--muted-foreground)] leading-relaxed">
            API secrets are securely stored with AES-256 encryption. Plaintext secrets are never stored in your browser DOM or rendered in HTML.
          </p>
        </div>
      </div>

      {/* Credentials Card */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-5">
        <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
          Secured access keys & endpoints
        </h3>

        <div className="space-y-4 text-xs">
          {/* Merchant Client Key */}
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <span className="text-[var(--muted-foreground)] font-medium">Merchant client key</span>
            <div className="flex items-center justify-between gap-3">
              <code className="font-mono text-xs text-[var(--foreground)] bg-[var(--muted)] px-2.5 py-1 rounded-md">
                {integration.credentials.clientKeyMasked}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(integration.credentials.clientKeyMasked, "Client key")}
                className="h-7 px-2.5 text-[11px] flex items-center gap-1.5"
              >
                {copiedKey === "Client key" ? <Check size={12} className="text-[var(--success,#16a34a)]" /> : <Copy size={12} />}
                Copy
              </Button>
            </div>
          </div>

          {/* Merchant Client Secret */}
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted-foreground)] font-medium">Merchant client secret</span>
              <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-1">
                <Lock size={10} /> Masked by security policy
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <code className="font-mono text-xs text-[var(--muted-foreground)] tracking-widest bg-[var(--muted)] px-2.5 py-1 rounded-md select-none">
                ••••••••••••••••••••••••
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReplaceModalOpen(true)}
                className="h-7 px-2.5 text-[11px]"
              >
                Replace
              </Button>
            </div>
          </div>

          {/* Reloopin API Key */}
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <span className="text-[var(--muted-foreground)] font-medium">Reloopin webhook API key</span>
            <div className="flex items-center justify-between gap-3">
              <code className="font-mono text-xs text-[var(--foreground)] bg-[var(--muted)] px-2.5 py-1 rounded-md">
                {integration.credentials.apiKeyMasked}
              </code>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(integration.credentials.apiKeyMasked, "Reloopin API key")}
                  className="h-7 px-2.5 text-[11px] flex items-center gap-1.5"
                >
                  {copiedKey === "Reloopin API key" ? <Check size={12} className="text-[var(--success,#16a34a)]" /> : <Copy size={12} />}
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRotateModalOpen(true)}
                  className="h-7 px-2.5 text-[11px]"
                >
                  Rotate
                </Button>
              </div>
            </div>
          </div>

          {/* Endpoints if available */}
          {(integration.productEndpoint || integration.customerEndpoint) && (
            <div className="pt-2 space-y-3 border-t border-[var(--border)]">
              {integration.productEndpoint && (
                <div>
                  <span className="text-[var(--muted-foreground)] block mb-1">
                    Product API endpoint
                  </span>
                  <code className="block p-2 rounded-lg bg-[var(--muted)] font-mono text-[11px] text-[var(--foreground)] truncate">
                    {integration.productEndpoint}
                  </code>
                </div>
              )}
              {integration.customerEndpoint && (
                <div>
                  <span className="text-[var(--muted-foreground)] block mb-1">
                    Customer API endpoint
                  </span>
                  <code className="block p-2 rounded-lg bg-[var(--muted)] font-mono text-[11px] text-[var(--foreground)] truncate">
                    {integration.customerEndpoint}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Credential Actions Bar */}
        <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-[var(--muted-foreground)]">
            Last rotated: <span className="font-medium text-[var(--foreground)]">{integration.credentials.keyLastRotated || "Never"}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRotateModalOpen(true)}
              className="text-xs"
            >
              Rotate credentials
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsRevokeModalOpen(true)}
              className="text-xs"
            >
              Revoke credentials
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: Replace Credentials */}
      <Modal
        open={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        title="Replace credentials"
        description="Enter the updated API keys or credentials for this integration. Prior secrets will be invalidated."
      >
        <div className="space-y-4 py-3 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-[var(--foreground)]">New client key</label>
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. pk_live_••••••••"
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-[var(--foreground)]">New client secret</label>
            <input
              type="password"
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg font-mono"
            />
          </div>

          <div className="dialog-actions flex justify-end gap-2 pt-3">
            <Button variant="outline" size="sm" onClick={() => setIsReplaceModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmReplace}>
              Save credentials
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Rotate Confirmation */}
      <Modal
        open={isRotateModalOpen}
        onClose={() => setIsRotateModalOpen(false)}
        title="Rotate credentials?"
        description="Rotating your credentials will issue new client keys immediately. Connected webhooks must be updated with the new signing secret."
      >
        <div className="py-3 text-xs space-y-4">
          <div className="p-3 bg-[var(--color-warning-bg,rgba(234,179,8,0.1))] border border-[var(--warning,#d97706)]/20 rounded-lg text-[var(--warning,#d97706)] flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>Active transactions will pause until the new webhook secret is applied in your platform settings.</span>
          </div>

          <div className="dialog-actions flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsRotateModalOpen(false)}>
              Keep current keys
            </Button>
            <Button size="sm" onClick={handleConfirmRotate}>
              Rotate credentials
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Revoke Confirmation */}
      <Modal
        open={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
        title="Revoke credentials?"
        description="Revoking credentials will immediately disconnect this integration and reject all incoming sync requests."
      >
        <div className="py-3 text-xs space-y-4">
          <div className="p-3 bg-[var(--color-destructive-container,rgba(239,68,68,0.1))] border border-[var(--destructive)]/20 rounded-lg text-[var(--destructive)] flex items-start gap-2">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>This integration will be marked as disconnected. You can reconnect it later using new API credentials.</span>
          </div>

          <div className="dialog-actions flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsRevokeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmRevoke}>
              Revoke credentials
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
