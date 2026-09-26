"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useIntegrationsStore,
} from "@/lib/integrations/integrations-store";
import {
  IntegrationRecord,
} from "@/lib/integrations/integrations-types";
import { IntegrationsHeader } from "./integrations-header";
import { IntegrationsStats } from "./integrations-stats";
import { IntegrationsFilters, FilterState } from "./integrations-filters";
import { IntegrationsTable } from "./integrations-table";
import { IntegrationsGrid } from "./integrations-grid";
import {
  IntegrationsEmptyState,
  SearchNoResultsState,
  FilterNoResultsState,
  PageErrorState,
  RestrictedAccessState,
  IntegrationLimitReachedState,
} from "./integrations-states";
import { AddIntegrationFlow } from "./add-integration-flow";
import { IntegrationDetailHeader } from "./integration-detail-header";
import { IntegrationOverviewTab } from "./integration-overview-tab";
import { IntegrationSyncTab } from "./integration-sync-tab";
import { IntegrationCredentialsTab } from "./integration-credentials-tab";
import { IntegrationActivityTab } from "./integration-activity-tab";
import { IntegrationEditPage } from "./integration-edit-page";
import {
  PauseIntegrationDialog,
  RemoveIntegrationDialog,
  ReconnectIntegrationModal,
  APISettingsModal,
} from "./integration-dialogs";
import { ConnectionTestModal } from "./connection-test-modal";
import { PreviewStatesDrawer } from "./preview-states-drawer";
import { toast } from "sonner";
import { LayoutDashboard, Database, KeyRound, Activity } from "lucide-react";

export function IntegrationsModule({
  view = "list",
  integrationId,
  onSwitchStore,
}: {
  view?: "list" | "new" | "detail" | "edit";
  integrationId?: string;
  onSwitchStore?: (storeId: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateQuery = searchParams.get("state") || "default";
  const tabQuery = searchParams.get("tab") || "overview";

  const {
    integrations,
    stores,
    apiSettings,
    addIntegration,
    updateIntegration,
    pauseIntegration,
    resumeIntegration,
    reconnectIntegration,
    removeIntegration,
    syncIntegrationNow,
    rotateCredentials,
    revokeCredentials,
    updateAPISettings,
    resetDemo,
    clearIntegrations,
    addSampleIntegrations,
  } = useIntegrationsStore();

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    search: "",
    status: "all",
    storeId: "all",
    platform: "all",
    viewMode: "table",
  });

  // Dialog & Action states
  const [targetIntegration, setTargetIntegration] = useState<IntegrationRecord | null>(null);
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isReconnectModalOpen, setIsReconnectModalOpen] = useState(false);
  const [isAPISettingsOpen, setIsAPISettingsOpen] = useState(false);
  const [isTestConnectionOpen, setIsTestConnectionOpen] = useState(false);
  const [activeSyncingId, setActiveSyncingId] = useState<string | null>(null);

  // Active integration for detail or edit view
  const activeIntegration = integrationId
    ? integrations.find((i) => i.id === integrationId) || integrations[0]
    : integrations[0];

  // Filtering logic
  const filteredIntegrations = integrations.filter((item) => {
    // Category filter
    if (filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchPlatform = item.platformName.toLowerCase().includes(q);
      const matchStore = item.assignedStore.toLowerCase().includes(q);
      if (!matchName && !matchPlatform && !matchStore) return false;
    }
    // Status filter
    if (filters.status !== "all") {
      if (filters.status === "connected") {
        if (item.status === "disconnected") return false;
      } else if (item.status !== filters.status) {
        return false;
      }
    }
    // Assigned store filter
    if (filters.storeId !== "all") {
      if (!item.assignedStoreIds.includes(filters.storeId) && !item.assignedStoreIds.includes("all")) {
        return false;
      }
    }
    // Platform filter
    if (filters.platform !== "all" && item.platform !== filters.platform) {
      return false;
    }
    return true;
  });

  // Action handlers
  const handleSync = (item: IntegrationRecord) => {
    setActiveSyncingId(item.id);
    setTimeout(() => {
      syncIntegrationNow(item.id);
      setActiveSyncingId(null);
      toast.success(`${item.name} synced successfully.`);
    }, 1200);
  };

  const handlePause = (item: IntegrationRecord) => {
    setTargetIntegration(item);
    setIsPauseDialogOpen(true);
  };

  const handleResume = (item: IntegrationRecord) => {
    resumeIntegration(item.id);
    toast.success("Integration resumed: New platform data will begin syncing again.");
  };

  const handleReconnect = (item: IntegrationRecord) => {
    setTargetIntegration(item);
    setIsReconnectModalOpen(true);
  };

  const handleRemove = (item: IntegrationRecord) => {
    setTargetIntegration(item);
    setIsRemoveDialogOpen(true);
  };

  const handleTestConnection = (item: IntegrationRecord) => {
    setTargetIntegration(item);
    setIsTestConnectionOpen(true);
  };

  const handleViewIssue = (item: IntegrationRecord) => {
    router.push(`/integrations/${item.id}?tab=sync`);
  };

  // ==========================================================================
  // VIEW: ADD NEW INTEGRATION (/integrations/new)
  // ==========================================================================
  if (view === "new") {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <AddIntegrationFlow
          stores={stores}
          existingIntegrations={integrations.map((i) => ({ id: i.id, name: i.name }))}
          onAddIntegration={addIntegration}
          onSwitchStore={onSwitchStore}
        />
        <PreviewStatesDrawer
          onResetDemo={resetDemo}
          onAddSampleIntegrations={addSampleIntegrations}
          onClearIntegrations={clearIntegrations}
          onSimulateError={() => {}}
        />
      </div>
    );
  }

  // ==========================================================================
  // VIEW: EDIT INTEGRATION (/integrations/[integrationId]/edit)
  // ==========================================================================
  if (view === "edit" && activeIntegration) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <IntegrationEditPage
          integration={activeIntegration}
          stores={stores}
          existingIntegrations={integrations.map((i) => ({ id: i.id, name: i.name }))}
          onUpdate={updateIntegration}
        />
        <PreviewStatesDrawer
          onResetDemo={resetDemo}
          onAddSampleIntegrations={addSampleIntegrations}
          onClearIntegrations={clearIntegrations}
          onSimulateError={() => {}}
        />
      </div>
    );
  }

  // ==========================================================================
  // VIEW: INTEGRATION DETAIL (/integrations/[integrationId])
  // ==========================================================================
  if (view === "detail" && activeIntegration) {
    const detailTabs = [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "sync", label: "Data sync", icon: Database },
      { id: "credentials", label: "Credentials", icon: KeyRound },
      { id: "activity", label: "Activity", icon: Activity },
    ];

    const currentTab = detailTabs.some((t) => t.id === tabQuery) ? tabQuery : "overview";

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <IntegrationDetailHeader
          integration={activeIntegration}
          isSyncing={activeSyncingId === activeIntegration.id}
          onSyncNow={() => handleSync(activeIntegration)}
          onTestConnection={() => handleTestConnection(activeIntegration)}
          onPause={() => handlePause(activeIntegration)}
          onResume={() => handleResume(activeIntegration)}
          onReconnect={() => handleReconnect(activeIntegration)}
          onRemove={() => handleRemove(activeIntegration)}
        />

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] mb-6 overflow-x-auto">
          {detailTabs.map((t) => {
            const Icon = t.icon;
            const isTabActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => router.push(`/integrations/${activeIntegration.id}?tab=${t.id}`)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  isTabActive
                    ? "border-[var(--primary)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
                }`}
                data-testid={`detail-tab-${t.id}`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        {currentTab === "overview" && (
          <IntegrationOverviewTab integration={activeIntegration} />
        )}

        {currentTab === "sync" && (
          <IntegrationSyncTab
            integration={activeIntegration}
            isSyncing={activeSyncingId === activeIntegration.id}
            onSyncAll={() => handleSync(activeIntegration)}
          />
        )}

        {currentTab === "credentials" && (
          <IntegrationCredentialsTab
            integration={activeIntegration}
            onRotateCredentials={() => rotateCredentials(activeIntegration.id)}
            onRevokeCredentials={() => revokeCredentials(activeIntegration.id)}
          />
        )}

        {currentTab === "activity" && (
          <IntegrationActivityTab activityLog={activeIntegration.activityLog} />
        )}

        {/* Dialogs */}
        <PauseIntegrationDialog
          open={isPauseDialogOpen}
          onClose={() => setIsPauseDialogOpen(false)}
          integration={targetIntegration}
          onConfirm={() => targetIntegration && pauseIntegration(targetIntegration.id)}
        />

        <RemoveIntegrationDialog
          open={isRemoveDialogOpen}
          onClose={() => setIsRemoveDialogOpen(false)}
          integration={targetIntegration}
          onConfirm={() => {
            if (targetIntegration) {
              removeIntegration(targetIntegration.id);
              router.push("/integrations");
            }
          }}
        />

        <ReconnectIntegrationModal
          open={isReconnectModalOpen}
          onClose={() => setIsReconnectModalOpen(false)}
          integration={targetIntegration}
          onConfirm={() => targetIntegration && reconnectIntegration(targetIntegration.id)}
        />

        <ConnectionTestModal
          open={isTestConnectionOpen}
          onClose={() => setIsTestConnectionOpen(false)}
          outcome="success"
          onProceedToReview={() => setIsTestConnectionOpen(false)}
        />

        <PreviewStatesDrawer
          onResetDemo={resetDemo}
          onAddSampleIntegrations={addSampleIntegrations}
          onClearIntegrations={clearIntegrations}
          onSimulateError={() => {}}
        />
      </div>
    );
  }

  // ==========================================================================
  // VIEW: MAIN INTEGRATIONS LIST (/integrations)
  // ==========================================================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto" data-testid="integrations-module-container">
      {/* State: Page Error */}
      {stateQuery === "page_error" ? (
        <PageErrorState onRetry={() => router.push("/integrations")} />
      ) : stateQuery === "restricted" ? (
        <RestrictedAccessState />
      ) : (
        <>
          {/* State: Limit Reached Banner */}
          {stateQuery === "limit_reached" && (
            <IntegrationLimitReachedState onManage={() => router.push("/integrations")} />
          )}

          <IntegrationsHeader onOpenAPISettings={() => setIsAPISettingsOpen(true)} />

          <IntegrationsStats
            integrations={integrations}
            isLoading={stateQuery === "loading"}
          />

          <IntegrationsFilters
            filters={filters}
            onChange={(upd) => setFilters((prev) => ({ ...prev, ...upd }))}
            integrations={integrations}
            stores={stores}
            filteredCount={filteredIntegrations.length}
          />

          {/* Table or Grid or Empty */}
          {stateQuery === "loading" ? (
            <div className="p-12 text-center text-xs text-[var(--muted-foreground)]">
              Loading integrations...
            </div>
          ) : integrations.length === 0 || stateQuery === "empty" ? (
            <IntegrationsEmptyState onAddIntegration={() => router.push("/integrations/new")} />
          ) : filteredIntegrations.length === 0 ? (
            filters.search ? (
              <SearchNoResultsState onClearSearch={() => setFilters((p) => ({ ...p, search: "" }))} />
            ) : (
              <FilterNoResultsState
                onClearFilters={() =>
                  setFilters({
                    category: "all",
                    search: "",
                    status: "all",
                    storeId: "all",
                    platform: "all",
                    viewMode: filters.viewMode,
                  })
                }
              />
            )
          ) : filters.viewMode === "grid" ? (
            <IntegrationsGrid
              integrations={filteredIntegrations}
              onSync={handleSync}
              onPause={handlePause}
              onResume={handleResume}
              onReconnect={handleReconnect}
              onRemove={handleRemove}
              onTestConnection={handleTestConnection}
              onViewIssue={handleViewIssue}
            />
          ) : (
            <IntegrationsTable
              integrations={filteredIntegrations}
              onSync={handleSync}
              onPause={handlePause}
              onResume={handleResume}
              onReconnect={handleReconnect}
              onRemove={handleRemove}
              onTestConnection={handleTestConnection}
              onViewIssue={handleViewIssue}
            />
          )}
        </>
      )}

      {/* Dialogs */}
      <PauseIntegrationDialog
        open={isPauseDialogOpen}
        onClose={() => setIsPauseDialogOpen(false)}
        integration={targetIntegration}
        onConfirm={() => targetIntegration && pauseIntegration(targetIntegration.id)}
      />

      <RemoveIntegrationDialog
        open={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        integration={targetIntegration}
        onConfirm={() => targetIntegration && removeIntegration(targetIntegration.id)}
      />

      <ReconnectIntegrationModal
        open={isReconnectModalOpen}
        onClose={() => setIsReconnectModalOpen(false)}
        integration={targetIntegration}
        onConfirm={() => targetIntegration && reconnectIntegration(targetIntegration.id)}
      />

      <APISettingsModal
        open={isAPISettingsOpen}
        onClose={() => setIsAPISettingsOpen(false)}
        settings={apiSettings}
        onSave={updateAPISettings}
      />

      <ConnectionTestModal
        open={isTestConnectionOpen}
        onClose={() => setIsTestConnectionOpen(false)}
        outcome="success"
        onProceedToReview={() => setIsTestConnectionOpen(false)}
      />

      <PreviewStatesDrawer
        onResetDemo={resetDemo}
        onAddSampleIntegrations={addSampleIntegrations}
        onClearIntegrations={clearIntegrations}
        onSimulateError={() => router.push("/integrations?state=page_error")}
      />
    </div>
  );
}
