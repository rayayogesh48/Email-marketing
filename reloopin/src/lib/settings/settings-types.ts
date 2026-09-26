export type SettingsSection =
  | "account"
  | "store"
  | "branding"
  | "team"
  | "notifications";

export type TeamRole = "owner" | "admin" | "staff" | "viewer";

export type MemberStatus =
  | "active"
  | "invitation_pending"
  | "invitation_expired"
  | "suspended";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pendingEmail?: string;
  emailVerificationStatus?:
    | "none"
    | "verification_sent"
    | "resending"
    | "resent"
    | "expired"
    | "failed"
    | "verified";
  avatarUrl?: string;
  language: string;
  timezone: string;
  passwordLastChanged: string;
}

export interface BusinessAddress {
  addressLine: string;
  city: string;
  region: string;
  country: string;
  postalCode: string;
}

export interface StoreProfile {
  id: string;
  name: string;
  publicDisplayName: string;
  website: string;
  supportEmail: string;
  supportPhoneCountryCode: string;
  supportPhoneNumber: string;
  address: BusinessAddress;
  currency: string;
  currencySyncedFrom: string;
  currencyLastSynced: string;
  timezone: string;
  isDisconnected?: boolean;
}

export interface BrandingSettings {
  storeId: string;
  logoUrl?: string;
  brandColor: string;
  senderName: string;
}

export interface ContrastValidation {
  ratioWithWhite: number;
  ratioWithDark: number;
  isAccessibleOnWhite: boolean;
  isAccessibleOnDark: boolean;
  isValid: boolean;
  recommendedColor?: string;
  message?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: TeamRole;
  status: MemberStatus;
  storeAccess: "all" | string[]; // "all" or array of store IDs
  lastActive: string;
  isCurrentUser?: boolean;
  invitationSentDate?: string;
  invitationToken?: string;
}

export interface RoleCapability {
  id: string;
  label: string;
  owner: "allowed" | "read_only" | "not_allowed";
  admin: "allowed" | "read_only" | "not_allowed";
  staff: "allowed" | "read_only" | "not_allowed";
  viewer: "allowed" | "read_only" | "not_allowed";
}

export interface NotificationItem {
  id: string;
  label: string;
  description?: string;
  email: boolean;
  inApp: boolean;
  isCritical?: boolean; // Critical security or payment notification that cannot be disabled
  lockedReason?: string;
}

export interface NotificationGroup {
  id: string;
  title: string;
  description?: string;
  linkToBilling?: boolean;
  items: NotificationItem[];
}

export interface SummaryPreferences {
  weeklySummaryEnabled: boolean;
  weeklyDeliveryDay: "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
  monthlySummaryEnabled: boolean;
}

export interface StoreOption {
  id: string;
  name: string;
  platform: string;
  isConnected: boolean;
}

export type PreviewState =
  // Global
  | "default"
  | "loading"
  | "saving"
  | "saved"
  | "save_failed"
  | "unsaved_changes"
  | "offline"
  | "session_expired"
  | "restricted_access"
  | "read_only_access"
  | "store_switching"
  | "page_error"
  // Account
  | "account_default"
  | "account_editing"
  | "account_email_verification_required"
  | "account_verification_sent"
  | "account_invalid_email"
  | "account_change_password"
  | "account_incorrect_password"
  | "account_password_changed"
  // Store
  | "store_default"
  | "store_missing_info"
  | "store_invalid_website"
  | "store_data_synced"
  | "store_synced_field_locked"
  | "store_disconnected"
  | "store_save_successful"
  | "store_save_failed"
  // Branding
  | "branding_default"
  | "branding_uploading_logo"
  | "branding_logo_uploaded"
  | "branding_invalid_logo"
  | "branding_custom_color"
  | "branding_low_contrast"
  | "branding_preview_loading"
  | "branding_preview_failed"
  | "branding_reset"
  // Team
  | "team_default"
  | "team_owner_only"
  | "team_search_no_results"
  | "team_invite_member"
  | "team_sending_invitation"
  | "team_invitation_sent"
  | "team_invitation_failed"
  | "team_pending_invitation"
  | "team_expired_invitation"
  | "team_seat_limit_reached"
  | "team_edit_member"
  | "team_change_role"
  | "team_remove_member"
  | "team_transfer_ownership"
  | "team_restricted_action"
  // Notifications
  | "notifications_default"
  | "notifications_modified"
  | "notifications_saving"
  | "notifications_saved"
  | "notifications_save_failed"
  | "notifications_all_disabled";
