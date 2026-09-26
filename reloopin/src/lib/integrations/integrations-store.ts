"use client";

import { useSyncExternalStore } from "react";
import {
  APISettings,
  IntegrationRecord,
  PrototypeListState,
  StoreOption,
} from "./integrations-types";
import {
  DEFAULT_API_SETTINGS,
  INITIAL_INTEGRATIONS,
  INITIAL_STORES,
} from "./integrations-data";

const STORAGE_KEY = "reloopin_integrations_v1";

interface IntegrationsState {
  integrations: IntegrationRecord[];
  stores: StoreOption[];
  apiSettings: APISettings;
  selectedStoreId: string;
  listState: PrototypeListState;
}

const DEFAULT_STATE: IntegrationsState = {
  integrations: INITIAL_INTEGRATIONS,
  stores: INITIAL_STORES,
  apiSettings: DEFAULT_API_SETTINGS,
  selectedStoreId: "northstar",
  listState: "default",
};

let memoryState: IntegrationsState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function loadStoredState(): IntegrationsState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      integrations: Array.isArray(parsed.integrations)
        ? parsed.integrations
        : DEFAULT_STATE.integrations,
      stores: Array.isArray(parsed.stores)
        ? parsed.stores
        : DEFAULT_STATE.stores,
      apiSettings: parsed.apiSettings || DEFAULT_STATE.apiSettings,
      selectedStoreId: parsed.selectedStoreId || DEFAULT_STATE.selectedStoreId,
      listState: parsed.listState || DEFAULT_STATE.listState,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: IntegrationsState) {
  memoryState = state;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }
  notify();
}

// Initial hydration if in browser
if (typeof window !== "undefined") {
  memoryState = loadStoredState();
}

export const integrationsStore = {
  getState(): IntegrationsState {
    return memoryState;
  },

  getIntegrations(): IntegrationRecord[] {
    return memoryState.integrations;
  },

  getIntegrationById(id: string): IntegrationRecord | undefined {
    return memoryState.integrations.find((item) => item.id === id);
  },

  getStores(): StoreOption[] {
    return memoryState.stores;
  },

  getStoreWorkspaces(): StoreOption[] {
    // Only return stores that are workspaces (from store & POS integrations)
    return memoryState.stores.filter((s) => s.isWorkspace);
  },

  getAPISettings(): APISettings {
    return memoryState.apiSettings;
  },

  addIntegration(record: Partial<IntegrationRecord>): IntegrationRecord {
    const currentState = memoryState;
    const isStore = record.isStoreWorkspace ?? false;
    const storeSlug = (record.name || "store")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newStoreId = isStore ? `store-${storeSlug}-${Date.now().toString(36)}` : undefined;

    const newRecord: IntegrationRecord = {
      id: record.id || `${record.platform || "int"}-${Date.now().toString(36)}`,
      name: record.name || "New Integration",
      platform: record.platform || "shopify",
      platformName: record.platformName || "Shopify",
      category: record.category || "store",
      status: "active",
      assignedStore: isStore ? "Store workspace" : record.assignedStore || "Northstar Goods",
      assignedStoreIds: isStore ? (newStoreId ? [newStoreId] : ["northstar"]) : record.assignedStoreIds || ["northstar"],
      isStoreWorkspace: isStore,
      workspaceStoreId: newStoreId,
      storeUrl: record.storeUrl,
      platformUrl: record.platformUrl,
      productEndpoint: record.productEndpoint,
      customerEndpoint: record.customerEndpoint,
      metadataJson: record.metadataJson,
      socialHandle: record.socialHandle,
      connectedAt: "Just now",
      lastSynced: "Just now",
      lastSyncedAt: "Today at " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      nextScheduledSync: "In 15 minutes",
      activitySummary: "Initial sync completed",
      stats: {
        customersSynced: isStore ? 180 : 0,
        productsSynced: isStore ? 45 : 0,
        ordersSynced: isStore ? 320 : 0,
        reviewsSynced: record.category === "reviews" ? 54 : 0,
      },
      dataAccess: record.dataAccess || {
        customers: isStore || record.category === "social" ? "available" : "unavailable",
        products: isStore ? "available" : "unavailable",
        orders: isStore ? "available" : "unavailable",
        reviews: record.category === "reviews" ? "available" : "unavailable",
      },
      syncSummary: {
        recordsSynced: isStore ? 545 : 54,
        recordsSkipped: 0,
        recordsFailed: 0,
        syncProgressPercent: 100,
        syncProgressText: isStore ? "545 of 545 records" : "54 of 54 records",
      },
      credentials: {
        clientKeyMasked: record.credentials?.clientKeyMasked || "live_••••••••••••9201",
        clientSecretMasked: "••••••••••••••••",
        apiKeyMasked: "rw_••••••••••••••Dpt",
        keyLastRotated: "Today",
      },
      syncRecords: [
        {
          dataType: "Customers",
          synced: isStore ? 180 : 0,
          skipped: 0,
          failed: 0,
          lastSynced: "Just now",
          status: "Complete",
        },
        {
          dataType: "Products",
          synced: isStore ? 45 : 0,
          skipped: 0,
          failed: 0,
          lastSynced: "Just now",
          status: "Complete",
        },
        {
          dataType: "Orders",
          synced: isStore ? 320 : 0,
          skipped: 0,
          failed: 0,
          lastSynced: "Just now",
          status: "Complete",
        },
        {
          dataType: "Reviews",
          synced: record.category === "reviews" ? 54 : 0,
          skipped: 0,
          failed: 0,
          lastSynced: record.category === "reviews" ? "Just now" : "Never synced",
          status: record.category === "reviews" ? "Complete" : "Skipped",
        },
      ],
      syncErrors: [],
      activityLog: [
        {
          id: `act-${Date.now()}-1`,
          event: "Sync completed",
          description: "Initial synchronization finished with zero errors.",
          result: "Success",
          performedBy: "System sync worker",
          date: "Just now",
        },
        {
          id: `act-${Date.now()}-2`,
          event: "Integration connected",
          description: `${record.name || "Integration"} authorized and credentials secured.`,
          result: "Success",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
      ],
    };

    let updatedStores = currentState.stores;
    if (isStore && newStoreId) {
      const newStoreOption: StoreOption = {
        id: newStoreId,
        name: record.name?.replace(/\s+(Store|POS|WooCommerce|Shopify)$/i, "") || "New Store",
        platform: record.platformName || "Shopify",
        avatarLetter: (record.name || "S").charAt(0).toUpperCase(),
        status: "Connected",
        isWorkspace: true,
      };
      updatedStores = [...currentState.stores, newStoreOption];
    }

    saveState({
      ...currentState,
      integrations: [newRecord, ...currentState.integrations],
      stores: updatedStores,
    });

    return newRecord;
  },

  updateIntegration(
    id: string,
    updates: Partial<IntegrationRecord>,
  ): IntegrationRecord | undefined {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return undefined;

    const updated: IntegrationRecord = {
      ...target,
      ...updates,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Integration updated",
          description: "Configuration details and settings updated by merchant.",
          result: "Info",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
    });

    return updated;
  },

  pauseIntegration(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    const updated: IntegrationRecord = {
      ...target,
      status: "paused",
      nextScheduledSync: "Paused by merchant",
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Integration paused",
          description: "Data syncing paused. Existing loyalty history remains accessible.",
          result: "Warning",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
    });
  },

  resumeIntegration(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    const updated: IntegrationRecord = {
      ...target,
      status: "active",
      lastSynced: "Just now",
      nextScheduledSync: "In 15 minutes",
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Integration resumed",
          description: "Real-time background data synchronization resumed.",
          result: "Success",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
    });
  },

  reconnectIntegration(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    const updated: IntegrationRecord = {
      ...target,
      status: "active",
      statusIssue: undefined,
      lastSynced: "Just now",
      activitySummary: "Reconnected and synced",
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Integration reconnected",
          description: "Authentication renewed and connection permissions verified.",
          result: "Success",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    // If store workspace had needs attention, mark store as Connected
    const updatedStores = currentState.stores.map((s) =>
      s.id === target.workspaceStoreId || target.assignedStoreIds.includes(s.id)
        ? { ...s, status: "Connected" as const }
        : s,
    );

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
      stores: updatedStores,
    });
  },

  removeIntegration(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    // If store workspace, also remove the store from stores list so it disappears from sidebar store switcher!
    let updatedStores = currentState.stores;
    if (target.isStoreWorkspace && target.workspaceStoreId) {
      updatedStores = currentState.stores.filter(
        (s) => s.id !== target.workspaceStoreId,
      );
    }

    saveState({
      ...currentState,
      integrations: currentState.integrations.filter((item) => item.id !== id),
      stores: updatedStores,
    });
  },

  syncIntegrationNow(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    const updated: IntegrationRecord = {
      ...target,
      lastSynced: "Just now",
      lastSyncedAt: "Today at " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      activitySummary: "Catalog and customers synced",
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Sync completed",
          description: "Manual on-demand sync completed successfully.",
          result: "Success",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
    });
  },

  rotateCredentials(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    const updated: IntegrationRecord = {
      ...target,
      credentials: {
        ...target.credentials,
        clientKeyMasked: `pk_rot_${Math.random().toString(36).substring(2, 6)}••••••••${Math.random().toString(36).substring(2, 6)}`,
        keyLastRotated: "Today",
      },
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Credentials changed",
          description: "API key and client credentials rotated. Prior keys invalidated.",
          result: "Info",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
    });
  },

  revokeCredentials(id: string) {
    const currentState = memoryState;
    const target = currentState.integrations.find((item) => item.id === id);
    if (!target) return;

    const updated: IntegrationRecord = {
      ...target,
      status: "disconnected",
      statusIssue: "API credentials revoked by account owner.",
      credentials: {
        clientKeyMasked: "Revoked",
        clientSecretMasked: "Revoked",
        apiKeyMasked: "Revoked",
        keyLastRotated: "Revoked today",
      },
      activityLog: [
        {
          id: `act-${Date.now()}`,
          event: "Credentials revoked",
          description: "Account owner revoked API keys. Integration is disconnected.",
          result: "Failed",
          performedBy: "Alex Morgan (Owner)",
          date: "Just now",
        },
        ...target.activityLog,
      ],
    };

    saveState({
      ...currentState,
      integrations: currentState.integrations.map((item) =>
        item.id === id ? updated : item,
      ),
    });
  },

  updateAPISettings(settings: Partial<APISettings>) {
    const currentState = memoryState;
    saveState({
      ...currentState,
      apiSettings: {
        ...currentState.apiSettings,
        ...settings,
      },
    });
  },

  setSelectedStore(storeId: string) {
    saveState({
      ...memoryState,
      selectedStoreId: storeId,
    });
  },

  setListState(state: PrototypeListState) {
    saveState({
      ...memoryState,
      listState: state,
    });
  },

  resetDemo() {
    saveState(DEFAULT_STATE);
  },

  clearIntegrations() {
    saveState({
      ...memoryState,
      integrations: [],
      listState: "empty",
    });
  },

  addSampleIntegrations() {
    saveState({
      ...DEFAULT_STATE,
      integrations: [
        ...INITIAL_INTEGRATIONS,
        {
          id: "square-pos-northstar",
          name: "Square Register POS",
          platform: "square",
          platformName: "Square",
          category: "pos",
          status: "active",
          assignedStore: "Store workspace",
          assignedStoreIds: ["northstar"],
          isStoreWorkspace: true,
          connectedAt: "Aug 15, 2026",
          lastSynced: "12 minutes ago",
          lastSyncedAt: "Sep 26, 2026 at 2:00 PM",
          nextScheduledSync: "In 3 minutes",
          activitySummary: "4 orders synced",
          stats: {
            customersSynced: 840,
            productsSynced: 120,
            ordersSynced: 2150,
          },
          dataAccess: {
            customers: "available",
            products: "available",
            orders: "available",
          },
          syncSummary: {
            recordsSynced: 3110,
            recordsSkipped: 0,
            recordsFailed: 0,
            syncProgressPercent: 100,
            syncProgressText: "3,110 of 3,110 records",
          },
          credentials: {
            clientKeyMasked: "sq_live_••••••••1890",
            clientSecretMasked: "••••••••••••••••",
            apiKeyMasked: "rw_••••••••••••••Dpt",
            keyLastRotated: "Aug 15, 2026",
          },
          syncRecords: [
            {
              dataType: "Customers",
              synced: 840,
              skipped: 0,
              failed: 0,
              lastSynced: "12 minutes ago",
              status: "Complete",
            },
            {
              dataType: "Products",
              synced: 120,
              skipped: 0,
              failed: 0,
              lastSynced: "12 minutes ago",
              status: "Complete",
            },
            {
              dataType: "Orders",
              synced: 2150,
              skipped: 0,
              failed: 0,
              lastSynced: "12 minutes ago",
              status: "Complete",
            },
            {
              dataType: "Reviews",
              synced: 0,
              skipped: 0,
              failed: 0,
              lastSynced: "Never synced",
              status: "Skipped",
            },
          ],
          syncErrors: [],
          activityLog: [
            {
              id: "act-sq1",
              event: "Sync completed",
              description: "In-store registers synced 4 offline sales.",
              result: "Success",
              performedBy: "Square webhook",
              date: "12 minutes ago",
            },
          ],
        },
        {
          id: "custom-api-warehouse",
          name: "Custom Warehouse Gateway",
          platform: "custom_api",
          platformName: "Custom API",
          category: "custom_api",
          status: "active",
          assignedStore: "Northstar Goods",
          assignedStoreIds: ["northstar"],
          isStoreWorkspace: false,
          platformUrl: "https://api.warehousesync.internal",
          productEndpoint: "https://api.warehousesync.internal/v2/inventory",
          connectedAt: "Sep 1, 2026",
          lastSynced: "1 hour ago",
          lastSyncedAt: "Sep 26, 2026 at 1:30 PM",
          nextScheduledSync: "In 50 minutes",
          activitySummary: "Inventory levels verified",
          metadataJson: '{\n  "warehouseId": "WH-904",\n  "batchSize": 250\n}',
          stats: {
            customersSynced: 0,
            productsSynced: 684,
            ordersSynced: 0,
          },
          dataAccess: {
            customers: "unavailable",
            products: "available",
            orders: "unavailable",
          },
          syncSummary: {
            recordsSynced: 684,
            recordsSkipped: 0,
            recordsFailed: 0,
            syncProgressPercent: 100,
            syncProgressText: "684 of 684 inventory items",
          },
          credentials: {
            clientKeyMasked: "wh_••••••••••••••••7214",
            clientSecretMasked: "••••••••••••••••",
            apiKeyMasked: "rw_••••••••••••••Dpt",
            keyLastRotated: "Sep 1, 2026",
          },
          syncRecords: [
            {
              dataType: "Customers",
              synced: 0,
              skipped: 0,
              failed: 0,
              lastSynced: "Never synced",
              status: "Skipped",
            },
            {
              dataType: "Products",
              synced: 684,
              skipped: 0,
              failed: 0,
              lastSynced: "1 hour ago",
              status: "Complete",
            },
            {
              dataType: "Orders",
              synced: 0,
              skipped: 0,
              failed: 0,
              lastSynced: "Never synced",
              status: "Skipped",
            },
            {
              dataType: "Reviews",
              synced: 0,
              skipped: 0,
              failed: 0,
              lastSynced: "Never synced",
              status: "Skipped",
            },
          ],
          syncErrors: [],
          activityLog: [
            {
              id: "act-c1",
              event: "Sync completed",
              description: "Custom inventory webhook synchronized 684 SKUs.",
              result: "Success",
              performedBy: "Warehouse worker",
              date: "1 hour ago",
            },
          ],
        },
      ],
    });
  },
};

export function useIntegrationsStore() {
  const state = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => memoryState,
    () => DEFAULT_STATE,
  );

  return {
    ...state,
    addIntegration: integrationsStore.addIntegration,
    updateIntegration: integrationsStore.updateIntegration,
    pauseIntegration: integrationsStore.pauseIntegration,
    resumeIntegration: integrationsStore.resumeIntegration,
    reconnectIntegration: integrationsStore.reconnectIntegration,
    removeIntegration: integrationsStore.removeIntegration,
    syncIntegrationNow: integrationsStore.syncIntegrationNow,
    rotateCredentials: integrationsStore.rotateCredentials,
    revokeCredentials: integrationsStore.revokeCredentials,
    updateAPISettings: integrationsStore.updateAPISettings,
    setSelectedStore: integrationsStore.setSelectedStore,
    setListState: integrationsStore.setListState,
    resetDemo: integrationsStore.resetDemo,
    clearIntegrations: integrationsStore.clearIntegrations,
    addSampleIntegrations: integrationsStore.addSampleIntegrations,
  };
}
