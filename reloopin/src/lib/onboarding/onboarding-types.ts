export type OnboardingStep =
  | "welcome"
  | "resume"
  | "connect-store"
  | "points-rule"
  | "vip-tiers"
  | "branding"
  | "review"
  | "success";

export type PlatformId = "woocommerce" | "shopify" | "wix" | "bigcommerce";

export type PlatformAvailability = "available" | "coming_soon";

export interface PlatformOption {
  id: PlatformId;
  name: string;
  badge: string;
  availability: PlatformAvailability;
  description: string;
}

export type StoreConnectionState =
  | "select_platform"
  | "connecting"
  | "redirecting"
  | "waiting_approval"
  | "verifying"
  | "connected"
  | "syncing"
  | "sync_complete"
  | "permission_denied"
  | "connection_cancelled"
  | "invalid_url"
  | "already_connected"
  | "connection_expired"
  | "connection_failed"
  | "partial_sync"
  | "store_disconnected";

export type SyncItemStatus = "waiting" | "syncing" | "complete" | "failed";

export interface SyncProgressItem {
  id: "customers" | "orders" | "products";
  label: string;
  count: number;
  totalTarget: number;
  status: SyncItemStatus;
}

export interface StoreConnectionData {
  platform: PlatformId;
  storeName: string;
  storeUrl: string;
  connectedAt?: string;
  connectionState: StoreConnectionState;
  syncProgress: SyncProgressItem[];
}

export interface EarningRuleConfig {
  ruleName: string;
  pointsEarned: number;
  perOrderSpend: number;
  minimumOrder: number | null;
  maximumPoints: number | null;
  isSaved?: boolean;
}

export interface VIPTier {
  id: string;
  name: string;
  minimumPoints: number;
  color: string;
  isDefault?: boolean;
}

export interface BrandingConfig {
  brandColor: string;
  storeName: string;
  previewMode: "launcher" | "open";
  previewCustomer: "existing" | "new";
  isSaved?: boolean;
}

export type ActivationStatus =
  | "idle"
  | "confirming"
  | "activating"
  | "failed"
  | "activated";

export type AutosaveStatus = "saving" | "saved" | "failed" | "offline";

export type GlobalSystemState =
  | "none"
  | "loading"
  | "saving"
  | "saved"
  | "save_failed"
  | "offline"
  | "session_expired"
  | "unsaved_changes"
  | "permission_restricted";

export interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  storeConnection: StoreConnectionData;
  earningRule: EarningRuleConfig;
  vipTiers: VIPTier[];
  branding: BrandingConfig;
  activationStatus: ActivationStatus;
  onboardingCompleted: boolean;
  tourCompleted: boolean;
  lastUpdated: string;
  systemState: GlobalSystemState;
  overrideStepState?: string;
}

