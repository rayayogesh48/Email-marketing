import { useSyncExternalStore } from "react";
import {
  Customer,
  CustomerFilterTier,
  CustomerFilterStatus,
  CustomerSortField,
  SortDirection,
  CustomerListState,
  CustomerPreviewState,
  VipTier,
  PointTransaction,
  ExportOptions,
  ImportStep,
  ReloopinField,
  ColumnMappingItem,
  ImportValidationRow,
  ValidationIssue,
  DuplicatePolicy,
  PointsPolicy,
  ImportPhase,
  ImportResultSummaryData,
  ImportHistoryRecord,
} from "./customer-types";
import {
  initialCustomers,
  initialImportHistory,
  PROTOTYPE_IMPORT_LIMITS,
} from "./customer-data";

export interface CustomerStoreState {
  customers: Customer[];
  searchQuery: string;
  tierFilter: CustomerFilterTier;
  statusFilter: CustomerFilterStatus;
  sortBy: CustomerSortField;
  sortDirection: SortDirection;
  currentPage: number;
  pageSize: number;
  listState: CustomerListState;
  importSuccessBannerMessage: string | null;

  // Selected for profile/drawer
  selectedCustomerId: string | null;

  // Modals & Sheets
  addCustomerModalOpen: boolean; // 2062:24513
  accountDetailsSheetOpen: boolean; // 2062:25637
  activityDetailsSheetOpen: boolean; // 2062:25417
  selectedTransactionForDetail: PointTransaction | null;
  deductPointsModalOpen: boolean; // 2062:25184
  rewardPointsModalOpen: boolean; // 2062:24951
  adjustPointsCustomerId: string | null;
  exportModalOpen: boolean;
  importHistoryOpen: boolean;
  supportedFieldsOpen: boolean;
  previewDrawerOpen: boolean;
  previewState: CustomerPreviewState;
  importHistory: ImportHistoryRecord[];

  // Dedicated Import Flow (/customers/import)
  importStep: ImportStep;
  uploadedFile: {
    name: string;
    size: number;
    type: string;
    sheetNames: string[];
    selectedSheet: string;
  } | null;
  firstRowIsHeader: boolean;
  headerRowIndex: number;
  rawHeaders: string[];
  rawRows: string[][];
  columnMappings: ColumnMappingItem[];
  validationRows: ImportValidationRow[];
  validationFilter: "all" | "errors" | "warnings" | "ready" | "skipped";
  validationSearchQuery: string;
  editingRowNumber: number | null;
  duplicatePolicy: DuplicatePolicy;
  pointsPolicy: PointsPolicy;
  loyaltyEnrollmentPolicy: boolean;
  confirmedPointsChange: boolean;
  importPhase: ImportPhase;
  importProgressPercent: number;
  importProcessedCount: number;
  importResult: ImportResultSummaryData | null;
  leaveConfirmationOpen: boolean;
}

const STORAGE_KEY = "reloopin:customers:v2";

const initialStoreState: CustomerStoreState = {
  customers: initialCustomers,
  searchQuery: "",
  tierFilter: "all",
  statusFilter: "all",
  sortBy: "lastActivity",
  sortDirection: "desc",
  currentPage: 1,
  pageSize: 25,
  listState: "default",
  importSuccessBannerMessage: null,

  selectedCustomerId: null,
  addCustomerModalOpen: false,
  accountDetailsSheetOpen: false,
  activityDetailsSheetOpen: false,
  selectedTransactionForDetail: null,
  deductPointsModalOpen: false,
  rewardPointsModalOpen: false,
  adjustPointsCustomerId: null,
  exportModalOpen: false,
  importHistoryOpen: false,
  supportedFieldsOpen: false,
  previewDrawerOpen: false,
  previewState: "default",
  importHistory: initialImportHistory,

  importStep: 1,
  uploadedFile: null,
  firstRowIsHeader: true,
  headerRowIndex: 0,
  rawHeaders: [],
  rawRows: [],
  columnMappings: [],
  validationRows: [],
  validationFilter: "all",
  validationSearchQuery: "",
  editingRowNumber: null,
  duplicatePolicy: "skip",
  pointsPolicy: "keep",
  loyaltyEnrollmentPolicy: true,
  confirmedPointsChange: false,
  importPhase: "preparing",
  importProgressPercent: 0,
  importProcessedCount: 0,
  importResult: null,
  leaveConfirmationOpen: false,
};

let currentState: CustomerStoreState = initialStoreState;
const listeners = new Set<() => void>();

function safeLoadState(): CustomerStoreState {
  if (typeof window === "undefined") return initialStoreState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialStoreState;
    const parsed = JSON.parse(raw);
    return {
      ...initialStoreState,
      ...parsed,
      customers: Array.isArray(parsed.customers) ? parsed.customers : initialCustomers,
      importHistory: Array.isArray(parsed.importHistory)
        ? parsed.importHistory
        : initialImportHistory,
    };
  } catch {
    return initialStoreState;
  }
}

function persistState(state: CustomerStoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        customers: state.customers,
        searchQuery: state.searchQuery,
        tierFilter: state.tierFilter,
        statusFilter: state.statusFilter,
        importHistory: state.importHistory,
      })
    );
  } catch {
    // Ignore storage quota
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function updateState(updater: (prev: CustomerStoreState) => CustomerStoreState) {
  currentState = updater(currentState);
  persistState(currentState);
  notify();
}

if (typeof window !== "undefined") {
  currentState = safeLoadState();
}

export function subscribeCustomers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCustomersSnapshot(): CustomerStoreState {
  return currentState;
}

// -------------------------------------------------------------
// Auto-mapping heuristics
// -------------------------------------------------------------
export function autoMapColumn(header: string): {
  field: ReloopinField;
  confidence: "high" | "needs_review" | "unmapped";
} {
  const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (["firstname", "first", "fname", "givenname"].includes(norm)) {
    return { field: "first_name", confidence: "high" };
  }
  if (["lastname", "last", "lname", "surname", "familyname"].includes(norm)) {
    return { field: "last_name", confidence: "high" };
  }
  if (["email", "emailaddress", "useremail", "mail"].includes(norm)) {
    return { field: "email", confidence: "high" };
  }
  if (["phone", "phonenumber", "mobile", "cell", "telephone"].includes(norm)) {
    return { field: "phone", confidence: "high" };
  }
  if (["dateofbirth", "dob", "birthdate", "birthday"].includes(norm)) {
    return { field: "date_of_birth", confidence: "high" };
  }
  if (["loyaltymember", "loyalty", "enrolled", "member"].includes(norm)) {
    return { field: "loyalty_member", confidence: "high" };
  }
  if (
    [
      "pointsbalance",
      "points",
      "currentpoints",
      "pointbalance",
      "balance",
    ].includes(norm)
  ) {
    return { field: "points_balance", confidence: "high" };
  }
  if (["lifetimepoints", "totalpoints", "earnedpoints"].includes(norm)) {
    return { field: "lifetime_points", confidence: "high" };
  }
  if (["status", "customerstatus", "accountstatus"].includes(norm)) {
    return { field: "status", confidence: "high" };
  }
  if (
    [
      "externalcustomerid",
      "customerid",
      "externalid",
      "shopifyid",
      "wcid",
    ].includes(norm)
  ) {
    return { field: "external_customer_id", confidence: "high" };
  }
  if (["joinedat", "joineddate", "createdat", "signupdate"].includes(norm)) {
    return { field: "joined_at", confidence: "high" };
  }
  if (["city"].includes(norm)) {
    return { field: "city", confidence: "high" };
  }
  if (["region", "state", "province"].includes(norm)) {
    return { field: "region", confidence: "high" };
  }
  if (["country", "nation"].includes(norm)) {
    return { field: "country", confidence: "high" };
  }
  if (["postalcode", "zip", "zipcode", "postcode"].includes(norm)) {
    return { field: "postal_code", confidence: "high" };
  }

  // Low confidence / partial checks
  if (norm.includes("name")) {
    return { field: "first_name", confidence: "needs_review" };
  }
  if (norm.includes("pt") || norm.includes("point")) {
    return { field: "points_balance", confidence: "needs_review" };
  }

  return { field: "do_not_import", confidence: "unmapped" };
}

// -------------------------------------------------------------
// Validation engine
// -------------------------------------------------------------
export function validateImportRow(
  rowIdx: number,
  record: Record<string, string>,
  existingCustomers: Customer[],
  fileEmailsSeen: Map<string, number>
): ImportValidationRow {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const firstName = (record["first_name"] || "").trim();
  const lastName = (record["last_name"] || "").trim();
  const email = (record["email"] || "").trim();
  const phone = (record["phone"] || "").trim();
  const dob = (record["date_of_birth"] || "").trim();
  const loyaltyMemberStr = (record["loyalty_member"] || "").trim();
  const pointsStr = (record["points_balance"] || "").trim();
  const lifetimePointsStr = (record["lifetime_points"] || "").trim();
  const statusStr = (record["status"] || "").trim();

  // Required: First Name
  if (!firstName) {
    errors.push({
      field: "first_name",
      message: "Missing first name.",
      severity: "error",
      suggestedCorrection: "Enter the customer's given name.",
    });
  }

  // Required: Last Name
  if (!lastName) {
    errors.push({
      field: "last_name",
      message: "Missing last name.",
      severity: "error",
      suggestedCorrection: "Enter the customer's surname.",
    });
  }

  // Required: Email
  if (!email) {
    errors.push({
      field: "email",
      message: "Missing email address.",
      severity: "error",
      suggestedCorrection: "Provide a valid email (e.g. name@domain.com).",
    });
  } else {
    // Format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({
        field: "email",
        message: "Invalid email format.",
        severity: "error",
        suggestedCorrection: "Ensure email has @ and valid domain.",
      });
    }

    // In-file duplicate check
    const normEmail = email.toLowerCase();
    if (fileEmailsSeen.has(normEmail)) {
      errors.push({
        field: "email",
        message: `Duplicate email inside file (already found in row ${fileEmailsSeen.get(
          normEmail
        )}).`,
        severity: "error",
        suggestedCorrection: "Remove or combine duplicate email rows.",
      });
    } else {
      fileEmailsSeen.set(normEmail, rowIdx + 1);
    }
  }

  // Check if customer already exists in Reloopin
  const normEmail = email.toLowerCase();
  const matchedExisting = existingCustomers.find(
    (c) => c.email.toLowerCase() === normEmail
  );
  const isDuplicate = !!matchedExisting;
  if (isDuplicate) {
    warnings.push({
      field: "email",
      message: `Customer already exists in Northstar Goods (${matchedExisting.name}).`,
      severity: "warning",
      suggestedCorrection: "Will be updated or skipped according to policy.",
    });
  }

  // Points check
  if (pointsStr) {
    const ptsNum = Number(pointsStr);
    if (isNaN(ptsNum) || !Number.isInteger(ptsNum)) {
      errors.push({
        field: "points_balance",
        message: "Points balance must be a whole number.",
        severity: "error",
        suggestedCorrection: "Round to nearest integer.",
      });
    } else if (ptsNum < 0) {
      errors.push({
        field: "points_balance",
        message: "Points balance cannot be negative.",
        severity: "error",
        suggestedCorrection: "Must be 0 or greater.",
      });
    } else if (ptsNum > 100000) {
      warnings.push({
        field: "points_balance",
        message: "Very high points balance (> 100,000 pts).",
        severity: "warning",
      });
    }
  }

  // Lifetime points check
  if (lifetimePointsStr) {
    const ltNum = Number(lifetimePointsStr);
    const currNum = Number(pointsStr) || 0;
    if (isNaN(ltNum) || !Number.isInteger(ltNum) || ltNum < 0) {
      errors.push({
        field: "lifetime_points",
        message: "Lifetime points must be a whole number, 0 or greater.",
        severity: "error",
      });
    } else if (ltNum < currNum) {
      warnings.push({
        field: "lifetime_points",
        message: "Lifetime points is lower than current points balance.",
        severity: "warning",
        suggestedCorrection: "Lifetime points should typically equal or exceed current points.",
      });
    }
  }

  // Status check
  if (statusStr) {
    const sNorm = statusStr.toUpperCase();
    if (!["ACTIVE", "INACTIVE"].includes(sNorm)) {
      errors.push({
        field: "status",
        message: `Invalid status "${statusStr}". Must be ACTIVE or INACTIVE.`,
        severity: "error",
        suggestedCorrection: "Set to ACTIVE or INACTIVE.",
      });
    }
  }

  // Date of birth check
  if (dob) {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob) || isNaN(Date.parse(dob))) {
      errors.push({
        field: "date_of_birth",
        message: "Invalid date format. Expected YYYY-MM-DD.",
        severity: "error",
        suggestedCorrection: "Format date as YYYY-MM-DD.",
      });
    } else if (new Date(dob) > new Date()) {
      warnings.push({
        field: "date_of_birth",
        message: "Date of birth is in the future.",
        severity: "warning",
      });
    }
  }

  // Loyalty member format
  if (loyaltyMemberStr) {
    const lm = loyaltyMemberStr.toUpperCase();
    if (!["TRUE", "FALSE", "1", "0", "YES", "NO"].includes(lm)) {
      errors.push({
        field: "loyalty_member",
        message: 'Invalid loyalty_member value. Use "TRUE" or "FALSE".',
        severity: "error",
      });
    }
  }

  // Phone normalization warning
  if (phone && !phone.startsWith("+") && phone.replace(/\D/g, "").length < 10) {
    warnings.push({
      field: "phone",
      message: "Phone number may be missing country code or area code.",
      severity: "warning",
    });
  }

  let rowStatus: "ready" | "warning" | "error" = "ready";
  if (errors.length > 0) rowStatus = "error";
  else if (warnings.length > 0) rowStatus = "warning";

  return {
    rowNumber: rowIdx + 1,
    originalData: record,
    editedData: record,
    status: rowStatus,
    errors,
    warnings,
    isDuplicate,
    existingCustomerId: matchedExisting?.id,
  };
}

// -------------------------------------------------------------
// Hook
// -------------------------------------------------------------
export function useCustomerStore() {
  const state = useSyncExternalStore(
    subscribeCustomers,
    getCustomersSnapshot,
    () => initialStoreState
  );

  return {
    ...state,

    // Filter & Sort
    setSearchQuery: (searchQuery: string) => {
      updateState((prev) => ({ ...prev, searchQuery, currentPage: 1 }));
    },
    setTierFilter: (tierFilter: CustomerFilterTier) => {
      updateState((prev) => ({ ...prev, tierFilter, currentPage: 1 }));
    },
    setStatusFilter: (statusFilter: CustomerFilterStatus) => {
      updateState((prev) => ({ ...prev, statusFilter, currentPage: 1 }));
    },
    setSort: (sortBy: CustomerSortField) => {
      updateState((prev) => {
        const isSame = prev.sortBy === sortBy;
        const sortDirection = isSame && prev.sortDirection === "asc" ? "desc" : "asc";
        return { ...prev, sortBy, sortDirection };
      });
    },
    setCurrentPage: (currentPage: number) => {
      updateState((prev) => ({ ...prev, currentPage }));
    },
    setPageSize: (pageSize: number) => {
      updateState((prev) => ({ ...prev, pageSize, currentPage: 1 }));
    },
    clearFilters: () => {
      updateState((prev) => ({
        ...prev,
        searchQuery: "",
        tierFilter: "all",
        statusFilter: "all",
        currentPage: 1,
      }));
    },
    setListState: (listState: CustomerListState) => {
      updateState((prev) => ({ ...prev, listState }));
    },
    dismissImportSuccessBanner: () => {
      updateState((prev) => ({ ...prev, importSuccessBannerMessage: null }));
    },

    // Selected customer
    setSelectedCustomerId: (selectedCustomerId: string | null) => {
      updateState((prev) => ({ ...prev, selectedCustomerId }));
    },

    // Dialog & Sheet openers (matching Figma nodes)
    openAddCustomerModal: () => {
      updateState((prev) => ({ ...prev, addCustomerModalOpen: true }));
    },
    closeAddCustomerModal: () => {
      updateState((prev) => ({ ...prev, addCustomerModalOpen: false }));
    },
    openAccountDetailsSheet: () => {
      updateState((prev) => ({ ...prev, accountDetailsSheetOpen: true }));
    },
    closeAccountDetailsSheet: () => {
      updateState((prev) => ({ ...prev, accountDetailsSheetOpen: false }));
    },
    openActivityDetailsSheet: (tx: PointTransaction) => {
      updateState((prev) => ({
        ...prev,
        activityDetailsSheetOpen: true,
        selectedTransactionForDetail: tx,
      }));
    },
    closeActivityDetailsSheet: () => {
      updateState((prev) => ({
        ...prev,
        activityDetailsSheetOpen: false,
        selectedTransactionForDetail: null,
      }));
    },
    openDeductPointsModal: (customerId?: string) => {
      updateState((prev) => ({
        ...prev,
        deductPointsModalOpen: true,
        adjustPointsCustomerId: customerId || prev.selectedCustomerId || prev.customers[0]?.id || null,
      }));
    },
    closeDeductPointsModal: () => {
      updateState((prev) => ({
        ...prev,
        deductPointsModalOpen: false,
        adjustPointsCustomerId: null,
      }));
    },
    openRewardPointsModal: (customerId?: string) => {
      updateState((prev) => ({
        ...prev,
        rewardPointsModalOpen: true,
        adjustPointsCustomerId: customerId || prev.selectedCustomerId || prev.customers[0]?.id || null,
      }));
    },
    closeRewardPointsModal: () => {
      updateState((prev) => ({
        ...prev,
        rewardPointsModalOpen: false,
        adjustPointsCustomerId: null,
      }));
    },
    openExportModal: () => {
      updateState((prev) => ({ ...prev, exportModalOpen: true }));
    },
    closeExportModal: () => {
      updateState((prev) => ({ ...prev, exportModalOpen: false }));
    },
    openImportHistory: () => {
      updateState((prev) => ({ ...prev, importHistoryOpen: true }));
    },
    closeImportHistory: () => {
      updateState((prev) => ({ ...prev, importHistoryOpen: false }));
    },
    openSupportedFields: () => {
      updateState((prev) => ({ ...prev, supportedFieldsOpen: true }));
    },
    closeSupportedFields: () => {
      updateState((prev) => ({ ...prev, supportedFieldsOpen: false }));
    },
    setPreviewDrawerOpen: (previewDrawerOpen: boolean) => {
      updateState((prev) => ({ ...prev, previewDrawerOpen }));
    },

    // Export Trigger
    triggerExport: (options: ExportOptions) => {
      let exportList = state.customers;
      if (options.scope === "filtered") {
        exportList = getFilteredCustomers(state).filtered;
      } else if (options.scope === "active") {
        exportList = state.customers.filter((c) => c.status === "active");
      }

      const headers: string[] = [];
      if (options.fields.name) headers.push("Name");
      if (options.fields.email) headers.push("Email");
      if (options.fields.tier) headers.push("VIP Tier");
      if (options.fields.points) headers.push("Point Balance");
      if (options.fields.ltv) headers.push("Lifetime Value ($)");
      if (options.fields.status) headers.push("Status");
      if (options.fields.lastActivity) headers.push("Last Activity");
      if (options.fields.joinedDate) headers.push("Joined Date");

      const rows = exportList.map((c) => {
        const row: string[] = [];
        if (options.fields.name) row.push(`"${c.name}"`);
        if (options.fields.email) row.push(`"${c.email}"`);
        if (options.fields.tier) row.push(`"${c.vipTier}"`);
        if (options.fields.points) row.push(`${c.pointBalance}`);
        if (options.fields.ltv) row.push(`${c.lifetimeValue}`);
        if (options.fields.status) row.push(`"${c.status}"`);
        if (options.fields.lastActivity) row.push(`"${c.lastActivity}"`);
        if (options.fields.joinedDate) row.push(`"${c.joinedDate}"`);
        return row.join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `customers_export_${options.scope}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return exportList.length;
    },

    // Backwards-compatible aliases
    openNewCustomerModal: () => {
      updateState((prev) => ({ ...prev, addCustomerModalOpen: true }));
    },
    closeNewCustomerModal: () => {
      updateState((prev) => ({ ...prev, addCustomerModalOpen: false }));
    },
    newCustomerModalOpen: state.addCustomerModalOpen,
    openImportModal: () => {
      if (typeof window !== "undefined") window.location.href = "/customers/import";
    },
    closeImportModal: () => {},
    importModalOpen: false,
    openAdjustPointsModal: (customerId?: string) => {
      updateState((prev) => ({
        ...prev,
        rewardPointsModalOpen: true,
        adjustPointsCustomerId: customerId || prev.selectedCustomerId || prev.customers[0]?.id || null,
      }));
    },
    closeAdjustPointsModal: () => {
      updateState((prev) => ({
        ...prev,
        rewardPointsModalOpen: false,
        deductPointsModalOpen: false,
        adjustPointsCustomerId: null,
      }));
    },
    adjustPointsModalOpen: state.rewardPointsModalOpen || state.deductPointsModalOpen,
    adjustPoints: (
      customerId: string,
      points: number,
      type: "add" | "deduct",
      reason: string,
      note?: string
    ) => {
      if (type === "add") {
        updateState((prev) => ({
          ...prev,
          rewardPointsModalOpen: false,
          customers: prev.customers.map((c) =>
            c.id === customerId
              ? {
                  ...c,
                  pointBalance: c.pointBalance + points,
                  lifetimePoints: c.lifetimePoints + points,
                  lastActivity: "Just now",
                }
              : c
          ),
        }));
      } else {
        updateState((prev) => ({
          ...prev,
          deductPointsModalOpen: false,
          customers: prev.customers.map((c) =>
            c.id === customerId
              ? {
                  ...c,
                  pointBalance: Math.max(0, c.pointBalance - points),
                  lastActivity: "Just now",
                }
              : c
          ),
        }));
      }
    },
    importCustomers: (importedList: Customer[]) => {
      updateState((prev) => ({
        ...prev,
        customers: [...importedList, ...prev.customers],
      }));
    },

    // Mutations: Add customer
    addCustomer: (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      dateOfBirth?: string;
      loyaltyMember: boolean;
      startingPoints?: number;
      startingReason?: string;
    }) => {
      const pts = data.startingPoints || 0;
      const calculatedTier: VipTier =
        pts >= 5000 ? "platinum" : pts >= 2500 ? "gold" : pts > 0 ? "silver" : "none";

      const transactions: PointTransaction[] = [];
      if (pts > 0) {
        transactions.push({
          id: `tx-${Date.now()}`,
          date: "Just now",
          type: "bonus",
          points: pts,
          reason: data.startingReason || "Welcome signup points",
          performedBy: "Store Admin",
        });
      }

      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: `${data.firstName.trim()} ${data.lastName.trim()}`,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || "",
        dateOfBirth: data.dateOfBirth?.trim() || "",
        vipTier: calculatedTier,
        pointBalance: pts,
        lifetimeValue: 0,
        lifetimePoints: pts,
        pointsRedeemed: 0,
        rewardsRedeemedCount: 0,
        status: "active",
        loyaltyMember: data.loyaltyMember,
        lastActivity: "Just now",
        joinedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
        totalOrders: 0,
        orders: [],
        transactions,
        notes: "Added manually via Reloopin dashboard.",
      };

      updateState((prev) => ({
        ...prev,
        customers: [newCustomer, ...prev.customers],
        addCustomerModalOpen: false,
        selectedCustomerId: newCustomer.id,
      }));

      return newCustomer;
    },

    // Mutations: Reward points
    rewardPoints: (
      customerId: string,
      points: number,
      reason: string,
      note?: string
    ) => {
      let updated: Customer | null = null;
      updateState((prev) => {
        const nextCustomers = prev.customers.map((c) => {
          if (c.id !== customerId) return c;
          const newBal = c.pointBalance + points;
          const newLifetime = c.lifetimePoints + points;
          const newTier: VipTier =
            newBal >= 5000 ? "platinum" : newBal >= 2500 ? "gold" : "silver";

          const tx: PointTransaction = {
            id: `tx-${Date.now()}`,
            date: "Just now",
            type: "bonus",
            points,
            reason,
            note: note || undefined,
            performedBy: "Store Admin",
          };

          updated = {
            ...c,
            pointBalance: newBal,
            lifetimePoints: newLifetime,
            vipTier: newTier,
            lastActivity: "Just now",
            transactions: [tx, ...c.transactions],
          };
          return updated;
        });

        return {
          ...prev,
          customers: nextCustomers,
          rewardPointsModalOpen: false,
          adjustPointsCustomerId: null,
        };
      });
      return updated;
    },

    // Mutations: Deduct points
    deductPoints: (
      customerId: string,
      points: number,
      reason: string,
      note?: string
    ) => {
      let updated: Customer | null = null;
      updateState((prev) => {
        const nextCustomers = prev.customers.map((c) => {
          if (c.id !== customerId) return c;
          const newBal = Math.max(0, c.pointBalance - points);
          const tx: PointTransaction = {
            id: `tx-${Date.now()}`,
            date: "Just now",
            type: "adjusted",
            points: -points,
            reason,
            note: note || undefined,
            performedBy: "Store Admin",
          };

          updated = {
            ...c,
            pointBalance: newBal,
            lastActivity: "Just now",
            transactions: [tx, ...c.transactions],
          };
          return updated;
        });

        return {
          ...prev,
          customers: nextCustomers,
          deductPointsModalOpen: false,
          adjustPointsCustomerId: null,
        };
      });
      return updated;
    },

    // ---------------------------------------------------------
    // Import flow state mutations
    // ---------------------------------------------------------
    setImportStep: (step: ImportStep) => {
      updateState((prev) => ({ ...prev, importStep: step }));
    },
    setUploadedFile: (file: CustomerStoreState["uploadedFile"]) => {
      updateState((prev) => ({ ...prev, uploadedFile: file }));
    },
    setSelectedSheet: (selectedSheet: string) => {
      updateState((prev) => ({
        ...prev,
        uploadedFile: prev.uploadedFile ? { ...prev.uploadedFile, selectedSheet } : null,
      }));
    },
    removeUploadedFile: () => {
      updateState((prev) => ({
        ...prev,
        uploadedFile: null,
        rawHeaders: [],
        rawRows: [],
        columnMappings: [],
        validationRows: [],
        importStep: 1,
      }));
    },
    setFirstRowIsHeader: (firstRowIsHeader: boolean) => {
      updateState((prev) => ({ ...prev, firstRowIsHeader }));
    },
    setHeaderRowIndex: (headerRowIndex: number) => {
      updateState((prev) => {
        const selectedHeaders = prev.rawRows[headerRowIndex] || prev.rawHeaders;
        const autoMappings: ColumnMappingItem[] = selectedHeaders.map((header) => {
          const mapping = autoMapColumn(header);
          const sampleValues = prev.rawRows
            .slice(headerRowIndex + 1, headerRowIndex + 4)
            .map((r) => r[selectedHeaders.indexOf(header)] || "")
            .filter(Boolean);

          return {
            sourceColumn: header,
            sampleValues,
            destinationField: mapping.field,
            confidence: mapping.confidence,
          };
        });

        return {
          ...prev,
          headerRowIndex,
          rawHeaders: selectedHeaders,
          columnMappings: autoMappings,
        };
      });
    },
    setColumnMappings: (columnMappings: ColumnMappingItem[]) => {
      updateState((prev) => ({ ...prev, columnMappings }));
    },
    updateColumnMapping: (sourceColumn: string, destinationField: ReloopinField) => {
      updateState((prev) => {
        const nextMappings = prev.columnMappings.map((m) => {
          if (m.sourceColumn !== sourceColumn) return m;
          return {
            ...m,
            destinationField,
            confidence: (destinationField === "do_not_import"
              ? "unmapped"
              : "high") as "high" | "unmapped",
          };
        });
        return { ...prev, columnMappings: nextMappings };
      });
    },
    splitFullNameColumn: () => {
      updateState((prev) => {
        const updated = prev.columnMappings.map((m) => {
          if (m.sourceColumn.toLowerCase().includes("name")) {
            return { ...m, destinationField: "first_name" as ReloopinField, confidence: "high" as const };
          }
          return m;
        });
        return { ...prev, columnMappings: updated };
      });
    },
    runValidation: () => {
      updateState((prev) => {
        const emailMap = new Map<string, number>();
        const headerRow = prev.rawHeaders;
        const dataRows = prev.rawRows.slice(prev.headerRowIndex + 1);

        const rows: ImportValidationRow[] = dataRows.map((rowVals, rIdx) => {
          const record: Record<string, string> = {};
          headerRow.forEach((hdr, hIdx) => {
            const mapped = prev.columnMappings.find((m) => m.sourceColumn === hdr);
            if (mapped && mapped.destinationField !== "do_not_import") {
              record[mapped.destinationField] = rowVals[hIdx] || "";
            }
          });

          return validateImportRow(rIdx, record, prev.customers, emailMap);
        });

        return {
          ...prev,
          validationRows: rows,
          importStep: 3,
        };
      });
    },
    setValidationFilter: (
      validationFilter: "all" | "errors" | "warnings" | "ready" | "skipped"
    ) => {
      updateState((prev) => ({ ...prev, validationFilter }));
    },
    setValidationSearchQuery: (validationSearchQuery: string) => {
      updateState((prev) => ({ ...prev, validationSearchQuery }));
    },
    openEditRowSheet: (rowNumber: number) => {
      updateState((prev) => ({ ...prev, editingRowNumber: rowNumber }));
    },
    closeEditRowSheet: () => {
      updateState((prev) => ({ ...prev, editingRowNumber: null }));
    },
    saveEditedRow: (rowNumber: number, editedData: Record<string, string>) => {
      updateState((prev) => {
        const emailMap = new Map<string, number>();
        const nextRows = prev.validationRows.map((r, idx) => {
          if (r.rowNumber !== rowNumber) {
            const em = (r.editedData["email"] || "").toLowerCase();
            if (em) emailMap.set(em, idx + 1);
            return r;
          }

          const validated = validateImportRow(
            idx,
            editedData,
            prev.customers,
            emailMap
          );
          return {
            ...validated,
            editedData,
          };
        });

        return { ...prev, validationRows: nextRows, editingRowNumber: null };
      });
    },
    skipRow: (rowNumber: number) => {
      updateState((prev) => {
        const nextRows = prev.validationRows.map((r) =>
          r.rowNumber === rowNumber ? { ...r, status: "skipped" as const } : r
        );
        return { ...prev, validationRows: nextRows, editingRowNumber: null };
      });
    },
    skipAllRowsWithErrors: () => {
      updateState((prev) => {
        const nextRows = prev.validationRows.map((r) =>
          r.status === "error" ? { ...r, status: "skipped" as const } : r
        );
        return { ...prev, validationRows: nextRows };
      });
    },
    setDuplicatePolicy: (duplicatePolicy: DuplicatePolicy) => {
      updateState((prev) => ({ ...prev, duplicatePolicy }));
    },
    setPointsPolicy: (pointsPolicy: PointsPolicy) => {
      updateState((prev) => ({ ...prev, pointsPolicy }));
    },
    setLoyaltyEnrollmentPolicy: (loyaltyEnrollmentPolicy: boolean) => {
      updateState((prev) => ({ ...prev, loyaltyEnrollmentPolicy }));
    },
    setConfirmedPointsChange: (confirmedPointsChange: boolean) => {
      updateState((prev) => ({ ...prev, confirmedPointsChange }));
    },

    // Run determinate mock import
    executeImport: () => {
      updateState((prev) => ({
        ...prev,
        importStep: 4,
        importPhase: "preparing",
        importProgressPercent: 10,
        importProcessedCount: 0,
      }));

      // Stage 2: Creating
      setTimeout(() => {
        updateState((prev) => ({
          ...prev,
          importPhase: "creating",
          importProgressPercent: 35,
          importProcessedCount: Math.round(prev.validationRows.length * 0.35),
        }));

        // Stage 3: Updating existing
        setTimeout(() => {
          updateState((prev) => ({
            ...prev,
            importPhase: "updating",
            importProgressPercent: 65,
            importProcessedCount: Math.round(prev.validationRows.length * 0.65),
          }));

          // Stage 4: Points
          setTimeout(() => {
            updateState((prev) => ({
              ...prev,
              importPhase: "points",
              importProgressPercent: 88,
              importProcessedCount: Math.round(prev.validationRows.length * 0.88),
            }));

            // Stage 5: Finalizing
            setTimeout(() => {
              updateState((prev) => {
                const now = new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                });

                const newCustomersToAdd: Customer[] = [];
                const updatedCustomerMap = new Map<string, Customer>();
                let importedCount = 0;
                let updatedCount = 0;
                let skippedCount = 0;
                let failedCount = 0;
                const failedRows: ImportValidationRow[] = [];

                prev.validationRows.forEach((r) => {
                  if (r.status === "skipped") {
                    skippedCount++;
                    return;
                  }
                  if (r.status === "error") {
                    failedCount++;
                    failedRows.push(r);
                    return;
                  }

                  const data = r.editedData;
                  const email = data["email"] || "";
                  const normEmail = email.toLowerCase();
                  const existing = prev.customers.find(
                    (c) => c.email.toLowerCase() === normEmail
                  );

                  const ptsVal = Number(data["points_balance"]) || 0;
                  const ltPtsVal = Number(data["lifetime_points"]) || ptsVal;
                  const isLoyaltyMember =
                    data["loyalty_member"] !== undefined && data["loyalty_member"] !== ""
                      ? ["true", "1", "yes"].includes(data["loyalty_member"].toLowerCase())
                      : prev.loyaltyEnrollmentPolicy;

                  const status: Customer["status"] =
                    (data["status"] || "").toUpperCase() === "INACTIVE"
                      ? "inactive"
                      : "active";

                  if (existing) {
                    if (prev.duplicatePolicy === "skip") {
                      skippedCount++;
                      return;
                    }

                    // Update existing
                    updatedCount++;
                    let newPoints = existing.pointBalance;
                    const txs = [...existing.transactions];

                    if (prev.pointsPolicy === "replace" && ptsVal > 0) {
                      newPoints = ptsVal;
                      txs.unshift({
                        id: `tx-imp-${Date.now()}-${r.rowNumber}`,
                        date: "Just now",
                        type: "adjusted",
                        points: ptsVal - existing.pointBalance,
                        reason: "Opening balance from customer CSV import",
                        performedBy: "Import Flow",
                      });
                    } else if (prev.pointsPolicy === "add" && ptsVal > 0) {
                      newPoints = existing.pointBalance + ptsVal;
                      txs.unshift({
                        id: `tx-imp-${Date.now()}-${r.rowNumber}`,
                        date: "Just now",
                        type: "bonus",
                        points: ptsVal,
                        reason: "Imported points addition from customer CSV",
                        performedBy: "Import Flow",
                      });
                    }

                    const updated: Customer = {
                      ...existing,
                      firstName: data["first_name"] || existing.firstName,
                      lastName: data["last_name"] || existing.lastName,
                      name: `${data["first_name"] || existing.firstName || ""} ${
                        data["last_name"] || existing.lastName || ""
                      }`.trim() || existing.name,
                      phone: data["phone"] || existing.phone,
                      dateOfBirth: data["date_of_birth"] || existing.dateOfBirth,
                      loyaltyMember: isLoyaltyMember,
                      pointBalance: newPoints,
                      lifetimePoints: Math.max(existing.lifetimePoints, ltPtsVal),
                      status,
                      city: data["city"] || existing.city,
                      region: data["region"] || existing.region,
                      country: data["country"] || existing.country,
                      postalCode: data["postal_code"] || existing.postalCode,
                      externalCustomerId:
                        data["external_customer_id"] || existing.externalCustomerId,
                      lastActivity: "Just now",
                      transactions: txs,
                    };
                    updatedCustomerMap.set(existing.id, updated);
                  } else {
                    // Create new
                    importedCount++;
                    const calculatedTier: VipTier =
                      ptsVal >= 5000
                        ? "platinum"
                        : ptsVal >= 2500
                        ? "gold"
                        : ptsVal > 0
                        ? "silver"
                        : "none";

                    const txs: PointTransaction[] = [];
                    if (ptsVal > 0) {
                      txs.push({
                        id: `tx-imp-${Date.now()}-${r.rowNumber}`,
                        date: "Just now",
                        type: "bonus",
                        points: ptsVal,
                        reason: "Opening balance from customer CSV import",
                        performedBy: "Import Flow",
                      });
                    }

                    const created: Customer = {
                      id: `cust-imp-${Date.now()}-${r.rowNumber}`,
                      name: `${data["first_name"] || ""} ${data["last_name"] || ""}`.trim() || "Customer",
                      firstName: data["first_name"] || "",
                      lastName: data["last_name"] || "",
                      email,
                      phone: data["phone"] || "",
                      dateOfBirth: data["date_of_birth"] || "",
                      vipTier: calculatedTier,
                      pointBalance: ptsVal,
                      lifetimeValue: 0,
                      lifetimePoints: ltPtsVal,
                      pointsRedeemed: 0,
                      rewardsRedeemedCount: 0,
                      status,
                      loyaltyMember: isLoyaltyMember,
                      lastActivity: "Just now",
                      joinedDate: data["joined_at"] || now,
                      totalOrders: 0,
                      externalCustomerId: data["external_customer_id"] || "",
                      city: data["city"] || "",
                      region: data["region"] || "",
                      country: data["country"] || "",
                      postalCode: data["postal_code"] || "",
                      transactions: txs,
                      orders: [],
                    };
                    newCustomersToAdd.push(created);
                  }
                });

                const nextCustomers = prev.customers.map((c) =>
                  updatedCustomerMap.has(c.id) ? updatedCustomerMap.get(c.id)! : c
                );
                const finalCustomers = [...newCustomersToAdd, ...nextCustomers];

                let resultStatus: ImportResultSummaryData["status"] = "full_success";
                if (failedCount > 0 || skippedCount > 0) {
                  resultStatus = importedCount === 0 && updatedCount === 0
                    ? "complete_failure"
                    : "partial_success";
                }

                const resultSummary: ImportResultSummaryData = {
                  status: resultStatus,
                  fileName: prev.uploadedFile?.name || "customers.csv",
                  totalProcessed: prev.validationRows.length,
                  importedCount,
                  updatedCount,
                  skippedCount,
                  failedCount,
                  failedRows,
                };

                const historyRecord: ImportHistoryRecord = {
                  id: `imp-hist-${Date.now()}`,
                  fileName: prev.uploadedFile?.name || "customers.csv",
                  importedBy: "Alex (Owner)",
                  startedAt: `${now} · ${new Date().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}`,
                  status:
                    resultStatus === "full_success"
                      ? "completed"
                      : resultStatus === "partial_success"
                      ? "completed_with_issues"
                      : "failed",
                  importedCount,
                  updatedCount,
                  failedCount,
                  skippedCount,
                };

                return {
                  ...prev,
                  customers: finalCustomers,
                  importPhase: "done",
                  importProgressPercent: 100,
                  importProcessedCount: prev.validationRows.length,
                  importResult: resultSummary,
                  importHistory: [historyRecord, ...prev.importHistory],
                  importSuccessBannerMessage:
                    importedCount > 0 || updatedCount > 0
                      ? `${(importedCount + updatedCount).toLocaleString()} customers imported successfully.`
                      : null,
                };
              });
            }, 400);
          }, 400);
        }, 400);
      }, 400);
    },

    // Reset import wizard
    resetImportWizard: () => {
      updateState((prev) => ({
        ...prev,
        importStep: 1,
        uploadedFile: null,
        rawHeaders: [],
        rawRows: [],
        columnMappings: [],
        validationRows: [],
        editingRowNumber: null,
        confirmedPointsChange: false,
        importPhase: "preparing",
        importProgressPercent: 0,
        importProcessedCount: 0,
        importResult: null,
      }));
    },

    // Preview state switcher
    setPreviewState: (state: CustomerPreviewState) => {
      updateState((prev) => {
        switch (state) {
          case "default":
            return {
              ...prev,
              previewState: "default",
              listState: "default",
              customers: initialCustomers,
              searchQuery: "",
              tierFilter: "all",
              statusFilter: "all",
              selectedCustomerId: null,
              addCustomerModalOpen: false,
              accountDetailsSheetOpen: false,
              activityDetailsSheetOpen: false,
              deductPointsModalOpen: false,
              rewardPointsModalOpen: false,
              importStep: 1,
            };
          case "loading":
            return {
              ...prev,
              previewState: "loading",
              listState: "loading",
            };
          case "empty":
            return {
              ...prev,
              previewState: "empty",
              listState: "empty",
              customers: [],
              searchQuery: "",
              tierFilter: "all",
              statusFilter: "all",
              selectedCustomerId: null,
            };
          case "no_results":
            return {
              ...prev,
              previewState: "no_results",
              listState: "no_results",
              searchQuery: "xyz_nonexistent_query_9999",
            };
          case "load_failure":
            return {
              ...prev,
              previewState: "load_failure",
              listState: "load_failure",
            };
          case "import_success":
            return {
              ...prev,
              previewState: "import_success",
              listState: "default",
              importSuccessBannerMessage: "1,210 customers imported successfully.",
            };
          case "customer-drawer":
            return {
              ...prev,
              previewState: "customer-drawer",
              selectedCustomerId: initialCustomers[0].id,
            };
          case "account-details-sheet":
            return {
              ...prev,
              previewState: "account-details-sheet",
              selectedCustomerId: initialCustomers[0].id,
              accountDetailsSheetOpen: true,
            };
          case "activity-details-sheet":
            return {
              ...prev,
              previewState: "activity-details-sheet",
              selectedCustomerId: initialCustomers[0].id,
              selectedTransactionForDetail: initialCustomers[0].transactions[0],
              activityDetailsSheetOpen: true,
            };
          case "add-customer-dialog":
            return {
              ...prev,
              previewState: "add-customer-dialog",
              addCustomerModalOpen: true,
            };
          case "deduct-points-dialog":
            return {
              ...prev,
              previewState: "deduct-points-dialog",
              adjustPointsCustomerId: initialCustomers[0].id,
              deductPointsModalOpen: true,
            };
          case "reward-points-dialog":
            return {
              ...prev,
              previewState: "reward-points-dialog",
              adjustPointsCustomerId: initialCustomers[0].id,
              rewardPointsModalOpen: true,
            };
          case "import-step-1":
            return {
              ...prev,
              previewState: "import-step-1",
              importStep: 1,
            };
          case "import-step-2":
            return {
              ...prev,
              previewState: "import-step-2",
              importStep: 2,
              uploadedFile: {
                name: "shopify_customers_export.csv",
                size: 245000,
                type: "text/csv",
                sheetNames: ["Sheet1"],
                selectedSheet: "Sheet1",
              },
              rawHeaders: ["first_name", "last_name", "email", "phone", "points_balance"],
              rawRows: [
                ["first_name", "last_name", "email", "phone", "points_balance"],
                ["Maya", "Chen", "maya@example.com", "+14155550142", "1250"],
                ["Daniel", "Kim", "daniel@example.com", "", "0"],
              ],
              columnMappings: [
                { sourceColumn: "first_name", destinationField: "first_name", sampleValues: ["Maya", "Daniel"], confidence: "high" },
                { sourceColumn: "last_name", destinationField: "last_name", sampleValues: ["Chen", "Kim"], confidence: "high" },
                { sourceColumn: "email", destinationField: "email", sampleValues: ["maya@example.com", "daniel@example.com"], confidence: "high" },
                { sourceColumn: "phone", destinationField: "phone", sampleValues: ["+14155550142"], confidence: "high" },
                { sourceColumn: "points_balance", destinationField: "points_balance", sampleValues: ["1250", "0"], confidence: "high" },
              ],
            };
          case "import-step-3":
            return {
              ...prev,
              previewState: "import-step-3",
              importStep: 3,
              validationRows: [
                {
                  rowNumber: 1,
                  originalData: { first_name: "Maya", last_name: "Chen", email: "maya@example.com", points_balance: "1250" },
                  editedData: { first_name: "Maya", last_name: "Chen", email: "maya@example.com", points_balance: "1250" },
                  status: "ready",
                  errors: [],
                  warnings: [],
                  isDuplicate: false,
                },
                {
                  rowNumber: 2,
                  originalData: { first_name: "Daniel", last_name: "Kim", email: "ramkarki@gmail.com", points_balance: "500" },
                  editedData: { first_name: "Daniel", last_name: "Kim", email: "ramkarki@gmail.com", points_balance: "500" },
                  status: "warning",
                  errors: [],
                  warnings: [{ field: "email", message: "Customer already exists in Northstar Goods.", severity: "warning" }],
                  isDuplicate: true,
                  existingCustomerId: "cust-01",
                },
                {
                  rowNumber: 3,
                  originalData: { first_name: "", last_name: "Taylor", email: "invalid-email", points_balance: "-10" },
                  editedData: { first_name: "", last_name: "Taylor", email: "invalid-email", points_balance: "-10" },
                  status: "error",
                  errors: [
                    { field: "first_name", message: "Missing first name.", severity: "error" },
                    { field: "email", message: "Invalid email format.", severity: "error" },
                    { field: "points_balance", message: "Points balance cannot be negative.", severity: "error" },
                  ],
                  warnings: [],
                  isDuplicate: false,
                },
              ],
            };
          case "import-step-4":
            return {
              ...prev,
              previewState: "import-step-4",
              importStep: 4,
              validationRows: [
                {
                  rowNumber: 1,
                  originalData: { first_name: "Maya", last_name: "Chen", email: "maya@example.com" },
                  editedData: { first_name: "Maya", last_name: "Chen", email: "maya@example.com" },
                  status: "ready",
                  errors: [],
                  warnings: [],
                  isDuplicate: false,
                },
              ],
            };
          case "import-processing":
            return {
              ...prev,
              previewState: "import-processing",
              importStep: 4,
              importPhase: "creating",
              importProgressPercent: 45,
              importProcessedCount: 545,
              validationRows: new Array(1210).fill(null).map((_, i) => ({
                rowNumber: i + 1,
                originalData: {},
                editedData: {},
                status: "ready" as const,
                errors: [],
                warnings: [],
                isDuplicate: false,
              })),
            };
          case "import-full-success":
            return {
              ...prev,
              previewState: "import-full-success",
              importStep: 4,
              importPhase: "done",
              importResult: {
                status: "full_success",
                fileName: "shopify_customers_export.csv",
                totalProcessed: 1210,
                importedCount: 1210,
                updatedCount: 0,
                skippedCount: 0,
                failedCount: 0,
                failedRows: [],
              },
            };
          case "import-partial-success":
            return {
              ...prev,
              previewState: "import-partial-success",
              importStep: 4,
              importPhase: "done",
              importResult: {
                status: "partial_success",
                fileName: "shopify_customers_export.csv",
                totalProcessed: 1210,
                importedCount: 1160,
                updatedCount: 32,
                skippedCount: 10,
                failedCount: 8,
                failedRows: [
                  {
                    rowNumber: 14,
                    originalData: { email: "bad.email@domain" },
                    editedData: { email: "bad.email@domain" },
                    status: "error",
                    errors: [{ field: "email", message: "Malformed domain", severity: "error" }],
                    warnings: [],
                    isDuplicate: false,
                  },
                ],
              },
            };
          case "import-failed":
            return {
              ...prev,
              previewState: "import-failed",
              importStep: 4,
              importPhase: "done",
              importResult: {
                status: "complete_failure",
                fileName: "corrupt_data.csv",
                totalProcessed: 250,
                importedCount: 0,
                updatedCount: 0,
                skippedCount: 0,
                failedCount: 250,
                failedRows: [],
              },
            };
          case "import-history":
            return {
              ...prev,
              previewState: "import-history",
              importHistoryOpen: true,
            };
          case "tier-silver":
            return {
              ...prev,
              previewState: "tier-silver",
              tierFilter: "silver",
              statusFilter: "all",
              searchQuery: "",
            };
          case "tier-gold":
            return {
              ...prev,
              previewState: "tier-gold",
              tierFilter: "gold",
              statusFilter: "all",
              searchQuery: "",
            };
          case "tier-platinum":
            return {
              ...prev,
              previewState: "tier-platinum",
              tierFilter: "platinum",
              statusFilter: "all",
              searchQuery: "",
            };
          case "status-inactive":
            return {
              ...prev,
              previewState: "status-inactive",
              statusFilter: "inactive",
              tierFilter: "all",
              searchQuery: "",
            };
          default:
            return prev;
        }
      });
    },

    // Demo utilities
    resetDemoData: () => {
      updateState(() => ({
        ...initialStoreState,
        customers: initialCustomers,
        importHistory: initialImportHistory,
      }));
    },
    clearAllCustomers: () => {
      updateState((prev) => ({
        ...prev,
        customers: [],
        selectedCustomerId: null,
      }));
    },
    addSampleCustomers: () => {
      updateState((prev) => ({
        ...prev,
        customers: initialCustomers,
      }));
    },
    loadDemoCsvFile: (mode: "valid" | "errors" | "multisheet") => {
      if (mode === "valid") {
        const headers = ["first_name", "last_name", "email", "phone", "points_balance", "status"];
        const rows = [
          headers,
          ["Maya", "Chen", "maya.chen@sample.example", "+14155550142", "1250", "ACTIVE"],
          ["Daniel", "Kim", "daniel.kim@sample.example", "+12065550198", "600", "ACTIVE"],
          ["Sarah", "Alvarez", "sarah.a@sample.example", "+15125550183", "2400", "ACTIVE"],
          ["Liam", "O'Connor", "liam.oc@sample.example", "+16175550134", "150", "ACTIVE"],
          ["Amina", "Zayn", "amina.z@sample.example", "+13125550172", "3800", "ACTIVE"],
        ];
        const mappings: ColumnMappingItem[] = headers.map((h) => ({
          sourceColumn: h,
          sampleValues: ["Maya", "Daniel", "Sarah"],
          destinationField: h as ReloopinField,
          confidence: "high",
        }));

        updateState((prev) => ({
          ...prev,
          uploadedFile: {
            name: "customers_clean_batch_2026.csv",
            size: 14200,
            type: "text/csv",
            sheetNames: ["Customers"],
            selectedSheet: "Customers",
          },
          rawHeaders: headers,
          rawRows: rows,
          columnMappings: mappings,
          importStep: 2,
        }));
      } else if (mode === "errors") {
        const headers = ["first_name", "last_name", "email", "phone", "points_balance"];
        const rows = [
          headers,
          ["Maya", "Chen", "maya.chen@sample.example", "+14155550142", "1250"],
          ["", "Kim", "daniel.kim@sample.example", "+12065550198", "600"], // Missing first name
          ["Sarah", "Alvarez", "bad_email_format", "+15125550183", "2400"], // Invalid email
          ["Liam", "O'Connor", "ramkarki@gmail.com", "+16175550134", "150"], // Existing customer
          ["Amina", "Zayn", "amina.z@sample.example", "+13125550172", "-50"], // Negative points
        ];
        const mappings: ColumnMappingItem[] = headers.map((h) => ({
          sourceColumn: h,
          sampleValues: ["Maya", "Chen"],
          destinationField: h as ReloopinField,
          confidence: "high",
        }));

        updateState((prev) => ({
          ...prev,
          uploadedFile: {
            name: "customers_with_issues_demo.csv",
            size: 11500,
            type: "text/csv",
            sheetNames: ["Data"],
            selectedSheet: "Data",
          },
          rawHeaders: headers,
          rawRows: rows,
          columnMappings: mappings,
          importStep: 2,
        }));
      } else {
        // Multi-sheet workbook
        const headers = ["first_name", "last_name", "email", "points_balance"];
        const rows = [
          headers,
          ["Elena", "Rostova", "elena@example.com", "4920"],
          ["David", "Chen", "david@example.com", "980"],
        ];
        const mappings: ColumnMappingItem[] = headers.map((h) => ({
          sourceColumn: h,
          sampleValues: ["Elena", "David"],
          destinationField: h as ReloopinField,
          confidence: "high",
        }));

        updateState((prev) => ({
          ...prev,
          uploadedFile: {
            name: "retail_annual_workbook.xlsx",
            size: 584000,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            sheetNames: ["2026 Customers (Active)", "2025 Archive", "Store Staff (Internal)"],
            selectedSheet: "2026 Customers (Active)",
          },
          rawHeaders: headers,
          rawRows: rows,
          columnMappings: mappings,
          importStep: 2,
        }));
      }
    },
  };
}

(useCustomerStore as unknown as { setState: (updater: (prev: CustomerStoreState) => CustomerStoreState) => void }).setState = updateState;
export const updateCustomerStoreState = updateState;

// -------------------------------------------------------------
// Pure Selector: Filter, Sort & Paginate Customers
// -------------------------------------------------------------
export function getFilteredCustomers(state: CustomerStoreState): {
  filtered: Customer[];
  paginated: Customer[];
  totalCount: number;
  totalPages: number;
} {
  let list = [...state.customers];

  // Search filter
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchEmail = c.email.toLowerCase().includes(q);
      const matchPhone = c.phone?.toLowerCase().includes(q) || false;
      return matchName || matchEmail || matchPhone;
    });
  }

  // Tier filter
  if (state.tierFilter !== "all") {
    list = list.filter((c) => c.vipTier === state.tierFilter);
  }

  // Status filter
  if (state.statusFilter !== "all") {
    list = list.filter((c) => c.status === state.statusFilter);
  }

  // Sort
  list.sort((a, b) => {
    let aVal: string | number = "";
    let bVal: string | number = "";

    switch (state.sortBy) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "points":
        aVal = a.pointBalance;
        bVal = b.pointBalance;
        break;
      case "ltv":
        aVal = a.lifetimeValue;
        bVal = b.lifetimeValue;
        break;
      case "joinedDate":
        aVal = Date.parse(a.joinedDate) || 0;
        bVal = Date.parse(b.joinedDate) || 0;
        break;
      case "lastActivity":
      default:
        aVal = a.pointBalance; // fallback ranking
        bVal = b.pointBalance;
        break;
    }

    if (aVal < bVal) return state.sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return state.sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / state.pageSize));
  const startIndex = (state.currentPage - 1) * state.pageSize;
  const paginated = list.slice(startIndex, startIndex + state.pageSize);

  return {
    filtered: list,
    paginated,
    totalCount,
    totalPages,
  };
}
