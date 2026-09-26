export type IntegrationCategory =
  | "store"
  | "pos"
  | "social"
  | "reviews"
  | "custom_api";

export type PlatformId =
  | "shopify"
  | "woocommerce"
  | "shopify_pos"
  | "clover"
  | "square"
  | "instagram"
  | "tiktok"
  | "twitter"
  | "google_reviews"
  | "trustpilot"
  | "custom_api";

export type PlatformAvailability = "available" | "coming_soon";

export interface PlatformDefinition {
  id: PlatformId;
  name: string;
  category: IntegrationCategory;
  categoryLabel: string;
  description: string;
  availability: PlatformAvailability;
  isStoreWorkspace: boolean;
  logoType: string;
  defaultName: string;
}

export type IntegrationStatus =
  | "active"
  | "syncing"
  | "paused"
  | "needs_attention"
  | "connection_expired"
  | "disconnected";

export type DataAccessLevel = "available" | "limited" | "unavailable";

export interface SyncRecordItem {
  dataType: "Customers" | "Products" | "Orders" | "Reviews";
  synced: number;
  skipped: number;
  failed: number;
  lastSynced: string;
  status: "Complete" | "Syncing" | "Failed" | "Skipped";
}

export interface SyncErrorItem {
  id: string;
  record: string;
  dataType: "Customer" | "Order" | "Product" | "Review";
  issue: string;
  lastAttempt: string;
  status: "pending" | "retrying" | "skipped" | "resolved";
}

export interface AuditActivityItem {
  id: string;
  event: string;
  description: string;
  result: "Success" | "Warning" | "Failed" | "Info";
  performedBy: string;
  date: string;
}

export interface IntegrationCredentials {
  clientKeyMasked: string;
  clientSecretMasked: string;
  apiKeyMasked: string;
  keyLastRotated?: string;
}

export interface IntegrationRecord {
  id: string;
  name: string;
  platform: PlatformId;
  platformName: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  statusIssue?: string;
  assignedStore: string;
  assignedStoreIds: string[];
  isStoreWorkspace: boolean;
  workspaceStoreId?: string;
  storeUrl?: string;
  platformUrl?: string;
  productEndpoint?: string;
  customerEndpoint?: string;
  metadataJson?: string;
  socialHandle?: string;
  connectedAt: string;
  lastSynced: string;
  lastSyncedAt: string;
  nextScheduledSync: string;
  activitySummary: string;
  stats: {
    customersSynced: number;
    productsSynced: number;
    ordersSynced: number;
    reviewsSynced?: number;
  };
  dataAccess: {
    customers: DataAccessLevel;
    products: DataAccessLevel;
    orders: DataAccessLevel;
    reviews?: DataAccessLevel;
  };
  syncSummary: {
    recordsSynced: number;
    recordsSkipped: number;
    recordsFailed: number;
    syncProgressPercent?: number;
    syncProgressText?: string;
  };
  credentials: IntegrationCredentials;
  syncRecords: SyncRecordItem[];
  syncErrors: SyncErrorItem[];
  activityLog: AuditActivityItem[];
}

export type ConnectionOutcome =
  | "success"
  | "partial_access"
  | "auth_failed"
  | "url_unavailable"
  | "permission_missing"
  | "timeout"
  | "rate_limit";

export interface ConnectionTestResult {
  outcome: ConnectionOutcome;
  title: string;
  message: string;
  customerAccess: DataAccessLevel;
  productAccess: DataAccessLevel;
  orderAccess: DataAccessLevel;
}

export interface APISettings {
  reloopinApiKey: string;
  webhookSigningSecret: string;
  syncInterval: "15m" | "hourly" | "daily";
  ipWhitelist: string[];
}

export interface StoreOption {
  id: string;
  name: string;
  platform: string;
  avatarLetter: string;
  status: "Connected" | "Syncing" | "Needs attention" | "Disconnected";
  isWorkspace: boolean;
}

export type PrototypeListState =
  | "default"
  | "loading"
  | "empty"
  | "search_empty"
  | "filter_empty"
  | "page_error"
  | "restricted"
  | "limit_reached";

export type PrototypeConnectionState =
  | "platform_selection"
  | "connecting"
  | "redirecting"
  | "waiting_approval"
  | "verifying"
  | "test_success"
  | "partial_access"
  | "auth_failed"
  | "url_unavailable"
  | "permission_missing"
  | "timeout"
  | "rate_limit"
  | "cancelled"
  | "expired";

export type PrototypeStatusState =
  | "active"
  | "syncing"
  | "paused"
  | "needs_attention"
  | "disconnected"
  | "reconnecting";

export type PrototypeSyncState =
  | "sync_idle"
  | "syncing"
  | "sync_success"
  | "partial_sync"
  | "sync_failed"
  | "record_errors";

export type PrototypeCredentialsState =
  | "masked"
  | "replacing"
  | "rotating"
  | "revoking"
  | "permission_restricted"
  | "operation_failed";

export type PrototypeRemovalState =
  | "confirm_remove"
  | "removing"
  | "removed"
  | "removal_failed";
