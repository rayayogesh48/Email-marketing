"use client";

import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Info,
  KeyRound,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import {
  DEFAULT_PLATFORMS,
  DEFAULT_SYNC_ITEMS,
} from "@/lib/onboarding/onboarding-data";
import {
  PlatformId,
  StoreConnectionData,
  StoreConnectionState,
} from "@/lib/onboarding/onboarding-types";

export function ConnectStoreStep({
  data,
  onUpdateConnection,
  onContinue,
  overrideState,
}: {
  data: StoreConnectionData;
  onUpdateConnection: (updated: Partial<StoreConnectionData>) => void;
  onContinue: () => void;
  overrideState?: string;
}) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>(
    data.platform || "woocommerce"
  );
  const [storeUrl, setStoreUrl] = useState(data.storeUrl || "https://northstargoods.com");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showManualConnect, setShowManualConnect] = useState(false);
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [showSyncDetailsModal, setShowSyncDetailsModal] = useState(false);

  // Active connection sub-state (can be overridden by preview switcher)
  const connectionState: StoreConnectionState =
    (overrideState as StoreConnectionState) || data.connectionState || "select_platform";

  // URL validation
  const validateUrl = (url: string) => {
    if (!url || !url.trim()) {
      setUrlError("Enter a store website address.");
      return false;
    }
    const clean = url.trim().toLowerCase();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      setUrlError("Use the full address, such as https://northstargoods.com.");
      return false;
    }
    setUrlError(null);
    return true;
  };

  // State transition simulations
  const handleInitiateConnection = () => {
    if (!validateUrl(storeUrl)) return;
    onUpdateConnection({
      platform: selectedPlatform,
      storeUrl,
      connectionState: "connecting",
    });

    // Simulate transition to waiting for approval
    setTimeout(() => {
      onUpdateConnection({ connectionState: "waiting_approval" });
    }, 1200);
  };

  const handleApproveAccess = () => {
    onUpdateConnection({ connectionState: "verifying" });

    // Simulate verification -> connected -> syncing -> sync complete
    setTimeout(() => {
      onUpdateConnection({
        connectionState: "connected",
        connectedAt: "Just now",
        storeName: "Northstar Goods",
      });
    }, 1000);
  };

  const handleStartSync = () => {
    onUpdateConnection({
      connectionState: "syncing",
      syncProgress: DEFAULT_SYNC_ITEMS.map((item) => ({
        ...item,
        status: item.id === "products" ? "syncing" : "complete",
      })),
    });

    setTimeout(() => {
      onUpdateConnection({
        connectionState: "sync_complete",
        syncProgress: DEFAULT_SYNC_ITEMS,
      });
    }, 1500);
  };

  const handleCancelConnection = () => {
    onUpdateConnection({ connectionState: "select_platform" });
  };

  const currentPlatformObj = DEFAULT_PLATFORMS.find(
    (p) => p.id === selectedPlatform
  );

  return (
    <div className="max-w-[760px] mx-auto py-8 sm:py-10 px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Connect your store
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
          Connect your store so Reloopin can sync customers, orders, and loyalty activity.
        </p>
      </div>

      {/* 1. SELECT PLATFORM & STORE URL FORM */}
      {connectionState === "select_platform" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[var(--foreground)]">
              Choose your ecommerce platform
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFAULT_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatform === platform.id;
                const isAvailable = platform.availability === "available";

                return (
                  <div
                    key={platform.id}
                    onClick={() => (isAvailable ? setSelectedPlatform(platform.id) : null)}
                    className={`p-4 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? "bg-[var(--card)] border-[var(--primary)] shadow-xs ring-1 ring-[var(--primary)]"
                        : isAvailable
                          ? "bg-[var(--card)] border-[var(--border)] hover:border-[var(--ring)] cursor-pointer"
                          : "bg-[var(--muted)]/40 border-[var(--border)] opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          }`}
                        >
                          {platform.id === "woocommerce" ? "WC" : platform.id === "shopify" ? "SH" : "EC"}
                        </div>
                        <span className="text-xs font-bold text-[var(--foreground)]">
                          {platform.name}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isAvailable
                            ? isSelected
                              ? "bg-[var(--primary-container)] text-[var(--primary)]"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                            : "bg-[var(--border)] text-[var(--muted-foreground)]"
                        }`}
                      >
                        {platform.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                      {platform.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Store URL Input */}
          <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs space-y-4">
            <div>
              <label
                htmlFor="store-url"
                className="block text-xs font-semibold text-[var(--foreground)] mb-1.5"
              >
                Store URL
              </label>
              <div className="relative">
                <input
                  id="store-url"
                  type="url"
                  value={storeUrl}
                  onChange={(e) => {
                    setStoreUrl(e.target.value);
                    if (urlError) validateUrl(e.target.value);
                  }}
                  placeholder="https://northstargoods.com"
                  className={`w-full h-10 px-3 rounded-lg bg-[var(--input)] border text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all ${
                    urlError ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  }`}
                />
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1.5">
                Enter the website address customers use to visit your store.
              </p>
              {urlError && (
                <p className="text-xs font-medium text-[var(--destructive)] mt-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>{urlError}</span>
                </p>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowManualConnect(!showManualConnect)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Connect manually</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform ${showManualConnect ? "rotate-180" : ""}`}
                />
              </button>

              <Button
                variant="default"
                size="sm"
                onClick={handleInitiateConnection}
                className="text-xs h-9 px-4 font-semibold gap-1.5"
              >
                <span>Connect store</span>
                <ExternalLink size={13} />
              </Button>
            </div>

            {/* Collapsed Manual Credentials */}
            {showManualConnect && (
              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <div className="p-3 rounded-lg bg-[var(--muted)]/50 text-[11px] text-[var(--muted-foreground)] flex items-start gap-2">
                  <KeyRound size={14} className="shrink-0 mt-0.5 text-[var(--primary)]" />
                  <span>
                    If your store blocks automated OAuth redirects, enter your platform API Consumer Key and Consumer Secret with Read/Write permissions.
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">
                      Consumer Key
                    </label>
                    <input
                      type="text"
                      value={consumerKey}
                      onChange={(e) => setConsumerKey(e.target.value)}
                      placeholder="ck_..."
                      className="w-full h-8 px-2.5 rounded-md bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[var(--muted-foreground)] mb-1">
                      Consumer Secret
                    </label>
                    <input
                      type="password"
                      value={consumerSecret}
                      onChange={(e) => setConsumerSecret(e.target.value)}
                      placeholder="cs_..."
                      className="w-full h-8 px-2.5 rounded-md bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CONNECTING / REDIRECTING STATE */}
      {(connectionState === "connecting" || connectionState === "redirecting") && (
        <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center mx-auto">
            <Loader2 size={24} className="animate-spin" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Connecting your store
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xs mx-auto leading-relaxed">
              We&apos;re opening {currentPlatformObj?.name || "WooCommerce"} so you can approve the connection.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-xs font-mono text-[var(--foreground)] truncate">
            {storeUrl}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelConnection}
            className="text-xs h-8 px-4"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* 3. WAITING FOR APPROVAL STATE */}
      {connectionState === "waiting_approval" && (
        <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center mx-auto">
            <ExternalLink size={24} />
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Approve the connection in {currentPlatformObj?.name || "WooCommerce"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1.5 max-w-xs mx-auto leading-relaxed">
              After approving access in the external store window, return here to finish connecting your store.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleApproveAccess}
              className="text-xs h-9 px-4 font-semibold gap-1.5"
            >
              <CheckCircle2 size={14} />
              <span>I&apos;ve approved access</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelConnection}
              className="text-xs h-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Cancel connection
            </Button>
          </div>
        </div>
      )}

      {/* 4. VERIFYING STATE */}
      {connectionState === "verifying" && (
        <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--secondary-container)] text-[var(--secondary)] flex items-center justify-center mx-auto">
            <RefreshCw size={22} className="animate-spin" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              Verifying your connection
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-1.5 max-w-xs mx-auto leading-relaxed">
              We&apos;re checking that Reloopin can access the customer and order data needed for your loyalty program.
            </p>
          </div>

          <div className="w-full bg-[var(--muted)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--secondary)] h-full w-2/3 animate-pulse" />
          </div>
        </div>
      )}

      {/* 5. CONNECTED STATE */}
      {connectionState === "connected" && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--secondary)]/40 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--secondary-container)] text-[var(--secondary)] flex items-center justify-center shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] text-[10px] font-bold mb-1">
                    <span>Connected</span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--foreground)]">
                    {data.storeName || "Northstar Goods"} is connected successfully
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {storeUrl} · WooCommerce · Connected {data.connectedAt || "just now"}
                  </p>
                </div>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={handleStartSync}
                className="text-xs h-9 px-4 font-semibold gap-1.5 shrink-0"
              >
                <RefreshCw size={13} />
                <span>Start syncing</span>
              </Button>
            </div>
          </div>

          {/* Existing customer informational callout */}
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-start gap-3">
            <Info size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[var(--foreground)]">
                Existing customers will be added automatically
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Existing customers will start with 0 points. They will earn points from eligible activity after the loyalty program is activated.
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] opacity-80">
                Past orders will not automatically generate points.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. SYNCING PROGRESS & COMPLETE STATE */}
      {(connectionState === "syncing" || connectionState === "sync_complete") && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  {connectionState === "sync_complete"
                    ? "Your store is ready"
                    : "Syncing your store data"}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {connectionState === "sync_complete"
                    ? "We synced 2,486 customers, 8,420 orders, and 684 products."
                    : "Fetching store records to initialize points and tiers."}
                </p>
              </div>

              {connectionState === "sync_complete" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] text-xs font-bold">
                  <CheckCircle2 size={13} />
                  <span>Sync complete</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--primary-container)] text-[var(--primary)] text-xs font-bold">
                  <Loader2 size={13} className="animate-spin" />
                  <span>Syncing...</span>
                </span>
              )}
            </div>

            {/* Progress list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEFAULT_SYNC_ITEMS.map((item) => {
                const isComplete =
                  connectionState === "sync_complete" || item.id !== "products";

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg bg-[var(--muted)]/40 border border-[var(--border)] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
                        {item.label}
                      </span>
                      <div className="text-base font-bold text-[var(--foreground)] tabular-nums">
                        {isComplete ? item.count.toLocaleString() : "Syncing..."}
                      </div>
                    </div>
                    {isComplete ? (
                      <CheckCircle2 size={16} className="text-[var(--secondary)]" />
                    ) : (
                      <Loader2 size={16} className="animate-spin text-[var(--primary)]" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions for sync */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setShowSyncDetailsModal(true)}
                className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline cursor-pointer"
              >
                View sync details
              </button>

              {connectionState === "sync_complete" ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onContinue}
                  className="text-xs h-9 px-4 font-semibold"
                >
                  Continue to earning rule
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartSync}
                  className="text-xs h-8 px-3 gap-1.5"
                >
                  <RefreshCw size={12} />
                  <span>Simulate complete</span>
                </Button>
              )}
            </div>
          </div>

          {/* Existing customer info callout */}
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-start gap-3">
            <Info size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-[var(--foreground)]">
                Existing customers will be added automatically
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                Existing customers will start with 0 points. They will earn points from eligible activity after the loyalty program is activated.
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] opacity-80">
                Past orders will not automatically generate points.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. ERROR STATES */}
      {/* Invalid Store URL Error */}
      {connectionState === "invalid_url" && (
        <div className="p-6 rounded-xl bg-[var(--destructive-container)]/20 border border-[var(--destructive)]/40 space-y-3">
          <div className="flex items-start gap-3">
            <XCircle size={20} className="text-[var(--destructive)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--destructive)]">
                Enter a valid store URL
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Use the full address, such as https://northstargoods.com.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelConnection}
            className="text-xs h-8 px-3"
          >
            Edit store URL
          </Button>
        </div>
      )}

      {/* Permission Denied Error */}
      {connectionState === "permission_denied" && (
        <div className="p-6 rounded-xl bg-[var(--destructive-container)]/20 border border-[var(--destructive)]/40 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--destructive)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--destructive)]">
                Permission was not approved
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Reloopin needs access to customer and order data to run your loyalty program.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="default"
              size="sm"
              onClick={handleInitiateConnection}
              className="text-xs h-8 px-3"
            >
              Try again
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancelConnection}
              className="text-xs h-8 px-3"
            >
              Choose another platform
            </Button>
          </div>
        </div>
      )}

      {/* Connection Expired Error */}
      {connectionState === "connection_expired" && (
        <div className="p-6 rounded-xl bg-[var(--destructive-container)]/20 border border-[var(--destructive)]/40 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--destructive)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--destructive)]">
                Connection request expired
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Start the connection again to continue.
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={handleInitiateConnection}
            className="text-xs h-8 px-3"
          >
            Reconnect store
          </Button>
        </div>
      )}

      {/* Already Connected Error */}
      {connectionState === "already_connected" && (
        <div className="p-6 rounded-xl bg-[var(--warning-container)]/30 border border-[var(--warning)]/50 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--warning)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">
                This store is already connected
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Northstar Goods is connected to another Reloopin account.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="text-xs h-8 px-3">
            Contact support
          </Button>
        </div>
      )}

      {/* Partial Sync Warning */}
      {connectionState === "partial_sync" && (
        <div className="p-6 rounded-xl bg-[var(--warning-container)]/30 border border-[var(--warning)]/50 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-[var(--warning)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--foreground)]">
                Some store data could not be synced
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Customers and orders are ready, but product data is still unavailable.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="default"
              size="sm"
              onClick={onContinue}
              className="text-xs h-8 px-3"
            >
              Continue setup
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartSync}
              className="text-xs h-8 px-3"
            >
              Try product sync again
            </Button>
          </div>
        </div>
      )}

      {/* Connection Failed Error */}
      {connectionState === "connection_failed" && (
        <div className="p-6 rounded-xl bg-[var(--destructive-container)]/20 border border-[var(--destructive)]/40 space-y-3">
          <div className="flex items-start gap-3">
            <XCircle size={20} className="text-[var(--destructive)] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-[var(--destructive)]">
                Store connection failed
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                We couldn&apos;t connect Northstar Goods. Check the store URL and try again.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="default"
              size="sm"
              onClick={handleInitiateConnection}
              className="text-xs h-8 px-3"
            >
              Try again
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleCancelConnection();
                setShowManualConnect(true);
              }}
              className="text-xs h-8 px-3"
            >
              Connect manually
            </Button>
          </div>
        </div>
      )}

      {/* Sync Details Modal */}
      <Modal
        open={showSyncDetailsModal}
        onClose={() => setShowSyncDetailsModal(false)}
        title="Store Data Sync Details"
        description="Records retrieved from WooCommerce to initialize your loyalty database."
      >
        <div className="space-y-4 mt-3">
          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg">
            <div className="p-3 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--muted-foreground)]">Customers</span>
              <span className="font-bold text-[var(--foreground)]">2,486 records synced</span>
            </div>
            <div className="p-3 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--muted-foreground)]">Historical Orders</span>
              <span className="font-bold text-[var(--foreground)]">8,420 orders synced</span>
            </div>
            <div className="p-3 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--muted-foreground)]">Products Catalog</span>
              <span className="font-bold text-[var(--foreground)]">684 items mapped</span>
            </div>
            <div className="p-3 flex items-center justify-between text-xs">
              <span className="font-medium text-[var(--muted-foreground)]">Webhooks Status</span>
              <span className="text-[var(--secondary)] font-semibold flex items-center gap-1">
                <CheckCircle2 size={12} /> Active (order.created, customer.created)
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSyncDetailsModal(false)}
              className="text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
