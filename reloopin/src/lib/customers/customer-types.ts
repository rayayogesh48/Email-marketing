export type VipTier = "none" | "silver" | "gold" | "platinum";

export type CustomerStatus = "active" | "inactive" | "loyalty_paused" | "import_pending";

export type TransactionType = "earned" | "redeemed" | "adjusted" | "bonus" | "refund";

export interface PointTransaction {
  id: string;
  date: string;
  type: TransactionType;
  points: number; // positive for earned/bonus/adjusted-add, negative for redeemed/adjusted-deduct
  reason: string;
  orderNumber?: string;
  note?: string;
  performedBy?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  itemsCount: number;
  pointsEarned: number;
  status: "completed" | "processing" | "refunded";
}

export interface Customer {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  vipTier: VipTier;
  pointBalance: number;
  lifetimeValue: number;
  lifetimePoints: number;
  pointsRedeemed: number;
  rewardsRedeemedCount: number;
  status: CustomerStatus;
  loyaltyMember: boolean;
  lastActivity: string;
  joinedDate: string;
  totalOrders: number;
  externalCustomerId?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  transactions: PointTransaction[];
  orders: CustomerOrder[];
  notes?: string;
}

export type CustomerFilterTier = "all" | VipTier;
export type CustomerFilterStatus = "all" | CustomerStatus;

export type CustomerSortField =
  | "name"
  | "points"
  | "ltv"
  | "joinedDate"
  | "lastActivity";

export type SortDirection = "asc" | "desc";

export interface CustomerFilterState {
  searchQuery: string;
  tier: CustomerFilterTier;
  status: CustomerFilterStatus;
  sortBy: CustomerSortField;
  sortDirection: SortDirection;
}

export type CustomerListState =
  | "default"
  | "loading"
  | "empty"
  | "no_results"
  | "load_failure"
  | "import_success";

export type CustomerPreviewState =
  | "default"
  | "loading"
  | "empty"
  | "no_results"
  | "load_failure"
  | "import_success"
  | "customer-drawer"
  | "account-details-sheet"
  | "activity-details-sheet"
  | "add-customer-dialog"
  | "deduct-points-dialog"
  | "reward-points-dialog"
  | "import-step-1"
  | "import-step-2"
  | "import-step-3"
  | "import-step-4"
  | "import-processing"
  | "import-full-success"
  | "import-partial-success"
  | "import-failed"
  | "import-history"
  | "tier-silver"
  | "tier-gold"
  | "tier-platinum"
  | "status-inactive";

export type AdjustmentType = "add" | "deduct";

export type AdjustmentReason =
  | "Customer support courtesy"
  | "Promotional bonus"
  | "Order correction / refund"
  | "Manual adjustment"
  | "Referral reward manual grant"
  | "Goodwill gesture"
  | "Other";

export interface ExportOptions {
  scope: "all" | "filtered" | "active";
  format: "csv" | "xlsx";
  fields: {
    name: boolean;
    email: boolean;
    tier: boolean;
    points: boolean;
    ltv: boolean;
    status: boolean;
    lastActivity: boolean;
    joinedDate: boolean;
  };
}

// -------------------------------------------------------------
// Dedicated Customer Import Flow Types
// -------------------------------------------------------------

export type ImportStep = 1 | 2 | 3 | 4;

export type ReloopinField =
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "date_of_birth"
  | "loyalty_member"
  | "points_balance"
  | "lifetime_points"
  | "status"
  | "external_customer_id"
  | "joined_at"
  | "city"
  | "region"
  | "country"
  | "postal_code"
  | "do_not_import";

export interface SupportedFieldDefinition {
  field: string;
  templateColumn: ReloopinField;
  required: boolean;
  format: string;
  example: string;
}

export interface ColumnMappingItem {
  sourceColumn: string;
  sampleValues: string[];
  destinationField: ReloopinField;
  confidence: "high" | "needs_review" | "unmapped";
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
  suggestedCorrection?: string;
}

export interface ImportValidationRow {
  rowNumber: number;
  originalData: Record<string, string>;
  editedData: Record<string, string>;
  status: "ready" | "warning" | "error" | "skipped";
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  isDuplicate: boolean;
  existingCustomerId?: string;
}

export type DuplicatePolicy = "skip" | "update";
export type PointsPolicy = "keep" | "replace" | "add";

export type ImportPhase =
  | "preparing"
  | "creating"
  | "updating"
  | "points"
  | "finalizing"
  | "done";

export type ImportResultType =
  | "full_success"
  | "partial_success"
  | "complete_failure"
  | "cancelled";

export interface ImportResultSummaryData {
  status: ImportResultType;
  fileName: string;
  totalProcessed: number;
  importedCount: number;
  updatedCount: number;
  skippedCount: number;
  failedCount: number;
  failedRows: ImportValidationRow[];
}

export interface ImportHistoryRecord {
  id: string;
  fileName: string;
  importedBy: string;
  startedAt: string;
  status: "completed" | "completed_with_issues" | "failed" | "cancelled" | "processing";
  importedCount: number;
  updatedCount: number;
  failedCount: number;
  skippedCount: number;
}
