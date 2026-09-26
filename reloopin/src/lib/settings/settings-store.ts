"use client";

import { useSyncExternalStore } from "react";
import {
  UserProfile,
  StoreProfile,
  BrandingSettings,
  TeamMember,
  TeamRole,
  MemberStatus,
  NotificationGroup,
  SummaryPreferences,
  PreviewState,
} from "./settings-types";
import {
  initialCurrentUser,
  initialStoreProfiles,
  initialBrandings,
  initialTeamMembers,
  sampleAdditionalMembers,
  initialNotificationGroups,
  initialSummaryPreferences,
  defaultTeamSeatLimit,
} from "./settings-data";

export interface SettingsStoreData {
  currentUser: UserProfile;
  activeStoreId: string;
  storeProfiles: Record<string, StoreProfile>;
  brandings: Record<string, BrandingSettings>;
  teamMembers: TeamMember[];
  notificationGroups: NotificationGroup[];
  summaryPreferences: SummaryPreferences;
  teamSeatLimit: number;
  previewState: PreviewState;
  isReadOnly: boolean;
  isOffline: boolean;
  isSessionExpired: boolean;
  isRestricted: boolean;
  isPageError: boolean;
  isSimulatingSaveFailure: boolean;
}

const STORAGE_KEY = "reloopin_settings_v1";

function getInitialData(): SettingsStoreData {
  const fallbackState: SettingsStoreData = {
    currentUser: initialCurrentUser,
    activeStoreId: "northstar",
    storeProfiles: initialStoreProfiles,
    brandings: initialBrandings,
    teamMembers: initialTeamMembers,
    notificationGroups: initialNotificationGroups,
    summaryPreferences: initialSummaryPreferences,
    teamSeatLimit: defaultTeamSeatLimit,
    previewState: "default",
    isReadOnly: false,
    isOffline: false,
    isSessionExpired: false,
    isRestricted: false,
    isPageError: false,
    isSimulatingSaveFailure: false,
  };

  if (typeof window === "undefined") {
    return fallbackState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        currentUser:
          parsed.currentUser && parsed.currentUser.email
            ? { ...initialCurrentUser, ...parsed.currentUser }
            : initialCurrentUser,
        activeStoreId: parsed.activeStoreId || "northstar",
        storeProfiles: { ...initialStoreProfiles, ...(parsed.storeProfiles || {}) },
        brandings: { ...initialBrandings, ...(parsed.brandings || {}) },
        teamMembers:
          Array.isArray(parsed.teamMembers) && parsed.teamMembers.length > 0
            ? parsed.teamMembers
            : initialTeamMembers,
        notificationGroups:
          Array.isArray(parsed.notificationGroups) && parsed.notificationGroups.length > 0
            ? parsed.notificationGroups
            : initialNotificationGroups,
        summaryPreferences: parsed.summaryPreferences
          ? { ...initialSummaryPreferences, ...parsed.summaryPreferences }
          : initialSummaryPreferences,
        teamSeatLimit:
          typeof parsed.teamSeatLimit === "number" ? parsed.teamSeatLimit : defaultTeamSeatLimit,
        previewState: "default",
        isReadOnly: false,
        isOffline: false,
        isSessionExpired: false,
        isRestricted: false,
        isPageError: false,
        isSimulatingSaveFailure: false,
      };
    }
  } catch (err) {
    console.error("Failed to load settings store:", err);
  }

  return fallbackState;
}

let storeState: SettingsStoreData = getInitialData();
const listeners = new Set<() => void>();

function emitChange() {
  if (typeof window !== "undefined") {
    try {
      const toPersist: SettingsStoreData = {
        ...storeState,
        previewState: "default",
        isReadOnly: false,
        isOffline: false,
        isSessionExpired: false,
        isRestricted: false,
        isPageError: false,
        isSimulatingSaveFailure: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch (err) {
      console.error("Failed to persist settings store:", err);
    }
  }
  listeners.forEach((l) => l());
}

export const settingsStore = {
  getSnapshot(): SettingsStoreData {
    return storeState;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  updateUserProfile(updates: Partial<UserProfile>) {
    storeState = {
      ...storeState,
      currentUser: {
        ...storeState.currentUser,
        ...updates,
      },
    };
    emitChange();
  },

  initiateEmailChange(newEmail: string) {
    storeState = {
      ...storeState,
      currentUser: {
        ...storeState.currentUser,
        pendingEmail: newEmail,
        emailVerificationStatus: "verification_sent",
      },
    };
    emitChange();
  },

  setVerificationStatus(status: UserProfile["emailVerificationStatus"]) {
    storeState = {
      ...storeState,
      currentUser: {
        ...storeState.currentUser,
        emailVerificationStatus: status,
      },
    };
    emitChange();
  },

  confirmEmailVerification() {
    if (storeState.currentUser.pendingEmail) {
      storeState = {
        ...storeState,
        currentUser: {
          ...storeState.currentUser,
          email: storeState.currentUser.pendingEmail,
          pendingEmail: undefined,
          emailVerificationStatus: "verified",
        },
      };
      emitChange();
    }
  },

  cancelEmailChange() {
    storeState = {
      ...storeState,
      currentUser: {
        ...storeState.currentUser,
        pendingEmail: undefined,
        emailVerificationStatus: "none",
      },
    };
    emitChange();
  },

  changePassword() {
    storeState = {
      ...storeState,
      currentUser: {
        ...storeState.currentUser,
        passwordLastChanged: "Just now",
      },
    };
    emitChange();
  },

  updateStoreProfile(storeId: string, updates: Partial<StoreProfile>) {
    const current = storeState.storeProfiles[storeId] || initialStoreProfiles[storeId];
    storeState = {
      ...storeState,
      storeProfiles: {
        ...storeState.storeProfiles,
        [storeId]: {
          ...current,
          ...updates,
        },
      },
    };
    emitChange();
  },

  updateBranding(storeId: string, updates: Partial<BrandingSettings>) {
    const current = storeState.brandings[storeId] || initialBrandings[storeId];
    storeState = {
      ...storeState,
      brandings: {
        ...storeState.brandings,
        [storeId]: {
          ...current,
          ...updates,
        },
      },
    };
    emitChange();
  },

  resetBranding(storeId: string) {
    storeState = {
      ...storeState,
      brandings: {
        ...storeState.brandings,
        [storeId]: {
          storeId,
          logoUrl: undefined,
          brandColor: storeId === "urban" ? "#2563EB" : "#7B72EB",
          senderName: storeId === "urban" ? "Urban Goods" : "Northstar Goods",
        },
      },
    };
    emitChange();
  },

  inviteTeamMember(data: {
    email: string;
    role: TeamRole;
    storeAccess: "all" | string[];
    name?: string;
    message?: string;
  }) {
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: data.name || data.email.split("@")[0].replace(/[._-]/g, " "),
      email: data.email,
      role: data.role,
      status: "invitation_pending",
      storeAccess: data.storeAccess,
      lastActive: "Never signed in",
      isCurrentUser: false,
      invitationSentDate: "Just now",
      invitationToken: `tok_${Math.random().toString(36).substring(2, 10)}`,
    };

    storeState = {
      ...storeState,
      teamMembers: [...storeState.teamMembers, newMember],
    };
    emitChange();
    return newMember;
  },

  resendInvitation(memberId: string) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: "invitation_pending",
              invitationSentDate: "Just now",
            }
          : m,
      ),
    };
    emitChange();
  },

  cancelInvitation(memberId: string) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.filter((m) => m.id !== memberId),
    };
    emitChange();
  },

  expireInvitation(memberId: string) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: "invitation_expired",
            }
          : m,
      ),
    };
    emitChange();
  },

  updateMemberAccess(
    memberId: string,
    updates: {
      role?: TeamRole;
      storeAccess?: "all" | string[];
      status?: MemberStatus;
    },
  ) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.map((m) =>
        m.id === memberId ? { ...m, ...updates } : m,
      ),
    };
    emitChange();
  },

  removeTeamMember(memberId: string) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.filter((m) => m.id !== memberId),
    };
    emitChange();
  },

  leaveTeam(memberId: string) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.filter((m) => m.id !== memberId),
    };
    emitChange();
  },

  transferOwnership(newOwnerId: string) {
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.map((m) => {
        if (m.id === newOwnerId) {
          return {
            ...m,
            role: "owner",
            storeAccess: "all",
          };
        }
        if (m.isCurrentUser || m.role === "owner") {
          return {
            ...m,
            role: "admin",
          };
        }
        return m;
      }),
    };
    emitChange();
  },

  updateNotificationToggle(
    groupId: string,
    itemId: string,
    channel: "email" | "inApp",
    value: boolean,
  ) {
    storeState = {
      ...storeState,
      notificationGroups: storeState.notificationGroups.map((grp) => {
        if (grp.id !== groupId) return grp;
        return {
          ...grp,
          items: grp.items.map((item) => {
            if (item.id !== itemId || item.isCritical) return item;
            return {
              ...item,
              [channel]: value,
            };
          }),
        };
      }),
    };
    emitChange();
  },

  toggleAllNotifications(channel: "email" | "inApp", enabled: boolean) {
    storeState = {
      ...storeState,
      notificationGroups: storeState.notificationGroups.map((grp) => ({
        ...grp,
        items: grp.items.map((item) => {
          if (item.isCritical) return item;
          return {
            ...item,
            [channel]: enabled,
          };
        }),
      })),
    };
    emitChange();
  },

  updateSummaryPreferences(updates: Partial<SummaryPreferences>) {
    storeState = {
      ...storeState,
      summaryPreferences: {
        ...storeState.summaryPreferences,
        ...updates,
      },
    };
    emitChange();
  },

  switchActiveStore(storeId: string) {
    storeState = {
      ...storeState,
      activeStoreId: storeId,
    };
    emitChange();
  },

  setPreviewState(state: PreviewState) {
    let isReadOnly = false;
    let isOffline = false;
    let isSessionExpired = false;
    let isRestricted = false;
    let isPageError = false;
    let isSimulatingSaveFailure = false;

    if (state === "read_only_access") isReadOnly = true;
    if (state === "offline") isOffline = true;
    if (state === "session_expired") isSessionExpired = true;
    if (state === "restricted_access") isRestricted = true;
    if (state === "page_error") isPageError = true;
    if (state === "save_failed" || state === "store_save_failed" || state === "notifications_save_failed") {
      isSimulatingSaveFailure = true;
    }

    storeState = {
      ...storeState,
      previewState: state,
      isReadOnly,
      isOffline,
      isSessionExpired,
      isRestricted,
      isPageError,
      isSimulatingSaveFailure,
    };
    emitChange();
  },

  addSampleMembers() {
    const existingIds = new Set(storeState.teamMembers.map((m) => m.id));
    const toAdd = sampleAdditionalMembers.filter((m) => !existingIds.has(m.id));
    storeState = {
      ...storeState,
      teamMembers: [...storeState.teamMembers, ...toAdd],
    };
    emitChange();
  },

  clearTeamMembers() {
    // Keep only owner
    storeState = {
      ...storeState,
      teamMembers: storeState.teamMembers.filter((m) => m.role === "owner"),
    };
    emitChange();
  },

  resetDemoData() {
    storeState = {
      currentUser: initialCurrentUser,
      activeStoreId: "northstar",
      storeProfiles: initialStoreProfiles,
      brandings: initialBrandings,
      teamMembers: initialTeamMembers,
      notificationGroups: initialNotificationGroups,
      summaryPreferences: initialSummaryPreferences,
      teamSeatLimit: defaultTeamSeatLimit,
      previewState: "default",
      isReadOnly: false,
      isOffline: false,
      isSessionExpired: false,
      isRestricted: false,
      isPageError: false,
      isSimulatingSaveFailure: false,
    };
    emitChange();
  },

  clearLocalData() {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error("Failed to remove settings from localStorage:", err);
      }
    }
    this.resetDemoData();
  },

  getServerSnapshot(): SettingsStoreData {
    return {
      currentUser: initialCurrentUser,
      activeStoreId: "northstar",
      storeProfiles: initialStoreProfiles,
      brandings: initialBrandings,
      teamMembers: initialTeamMembers,
      notificationGroups: initialNotificationGroups,
      summaryPreferences: initialSummaryPreferences,
      teamSeatLimit: defaultTeamSeatLimit,
      previewState: "default",
      isReadOnly: false,
      isOffline: false,
      isSessionExpired: false,
      isRestricted: false,
      isPageError: false,
      isSimulatingSaveFailure: false,
    };
  },
};

export function useSettingsStore(): SettingsStoreData {
  return useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getServerSnapshot,
  );
}
