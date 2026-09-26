"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SettingsSection } from "@/lib/settings/settings-types";
import { useSettingsStore, settingsStore } from "@/lib/settings/settings-store";
import { SettingsHeader } from "./settings-header";
import { SettingsNavigation } from "./settings-navigation";
import { DirtyFormActionBar } from "./dirty-form-action-bar";
import {
  SettingsStoreSwitchModal,
  SettingsLeavePageModal,
} from "./settings-store-switch-modal";
import {
  ReadOnlyNotice,
  RestrictedAccessState,
  OfflineNotice,
  SessionExpiredNotice,
  PageErrorState,
  SettingsLoadingSkeleton,
} from "./shared-state-banners";
import { PreviewStatesDrawer } from "./preview-states-drawer";

import { AccountProfileForm } from "./account-profile-form";
import { StoreProfileForm } from "./store-profile-form";
import { BrandingForm } from "./branding-form";
import { TeamSection } from "./team-section";
import { NotificationsSection } from "./notifications-section";
import {
  availableStores,
  initialStoreProfiles,
  initialBrandings,
} from "@/lib/settings/settings-data";
import { toast } from "sonner";

export function SettingsModule({
  section = "account",
  onSwitchStore,
}: {
  section?: SettingsSection;
  onSwitchStore?: (storeId: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stateQuery = searchParams.get("state");

  const store = useSettingsStore();

  // Active state flags
  const activePreviewState = stateQuery || store.previewState;
  const isReadOnly = store.isReadOnly || activePreviewState === "read_only_access";
  const isOffline = store.isOffline || activePreviewState === "offline";
  const isSessionExpired = store.isSessionExpired || activePreviewState === "session_expired";
  const isRestricted = store.isRestricted || activePreviewState === "restricted_access";
  const isPageError = store.isPageError || activePreviewState === "page_error";
  const isLoading = activePreviewState === "loading";

  // Dirty form management
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [saveCallback, setSaveCallback] = useState<(() => void) | null>(null);
  const [cancelCallback, setCancelCallback] = useState<(() => void) | null>(null);

  // Store switch confirmation modal
  const [pendingStoreSwitchId, setPendingStoreSwitchId] = useState<string | null>(null);

  // Navigation leave confirmation modal
  const [pendingNavSection, setPendingNavSection] = useState<SettingsSection | null>(null);

  const activeStoreObj =
    availableStores.find((s) => s.id === store.activeStoreId) || availableStores[0];
  const targetStoreObj =
    availableStores.find((s) => s.id === pendingStoreSwitchId) || availableStores[0];

  const isStoreSpecific = ["store", "branding", "team", "notifications"].includes(section);

  const handleDirtyChange = useCallback(
    (dirty: boolean, saveFn: () => void, cancelFn: () => void) => {
      setIsFormDirty(dirty);
      setSaveCallback(() => saveFn);
      setCancelCallback(() => cancelFn);
    },
    [],
  );

  // Store switch requested from header or switcher
  const handleStoreSwitchRequest = (targetStoreId: string) => {
    if (targetStoreId === store.activeStoreId) return;

    if (isFormDirty) {
      setPendingStoreSwitchId(targetStoreId);
    } else {
      performStoreSwitch(targetStoreId);
    }
  };

  const performStoreSwitch = (targetStoreId: string) => {
    settingsStore.switchActiveStore(targetStoreId);
    if (onSwitchStore) {
      onSwitchStore(targetStoreId);
    }
    toast.success(`Switched active store to ${availableStores.find((s) => s.id === targetStoreId)?.name}`);
  };

  const handleConfirmStoreSwitch = () => {
    if (cancelCallback) cancelCallback();
    setIsFormDirty(false);
    if (pendingStoreSwitchId) {
      performStoreSwitch(pendingStoreSwitchId);
      setPendingStoreSwitchId(null);
    }
  };

  // Nav item clicked
  const handleNavigationAttempt = (targetSection: SettingsSection): boolean => {
    if (targetSection === section) return true;
    if (isFormDirty) {
      setPendingNavSection(targetSection);
      return false;
    }
    return true;
  };

  const handleConfirmLeavePage = () => {
    if (cancelCallback) cancelCallback();
    setIsFormDirty(false);
    if (pendingNavSection) {
      router.push(`/settings?section=${pendingNavSection}`);
      setPendingNavSection(null);
    }
  };

  if (isPageError) {
    return (
      <div className="p-6 md:p-8">
        <PageErrorState
          onRetry={() => {
            settingsStore.setPreviewState("default");
            router.push(`/settings?section=${section}`);
          }}
        />
        <PreviewStatesDrawer currentSection={section} />
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="p-6 md:p-8">
        <RestrictedAccessState
          onBack={() => {
            settingsStore.setPreviewState("default");
            router.push("/dashboard");
          }}
        />
        <PreviewStatesDrawer currentSection={section} />
      </div>
    );
  }

  const currentStoreProfile =
    (store.storeProfiles && store.storeProfiles[store.activeStoreId]) ||
    store.storeProfiles?.northstar ||
    initialStoreProfiles.northstar;
  const currentBranding =
    (store.brandings && store.brandings[store.activeStoreId]) ||
    store.brandings?.northstar ||
    initialBrandings.northstar;

  return (
    <div className="w-full min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Shared Header */}
        <SettingsHeader
          activeStoreId={store.activeStoreId}
          isStoreSpecific={isStoreSpecific}
          onSwitchStoreRequest={handleStoreSwitchRequest}
        />

        {/* Global Notices */}
        {isOffline && <OfflineNotice />}
        {isSessionExpired && (
          <SessionExpiredNotice
            onSignIn={() => {
              settingsStore.setPreviewState("default");
              toast.success("Signed in successfully. Session restored.");
            }}
          />
        )}
        {isReadOnly && <ReadOnlyNotice />}

        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Secondary Navigation */}
          <SettingsNavigation
            currentSection={section}
            onNavigate={handleNavigationAttempt}
          />

          {/* Main Task Area (max-w ~880px) */}
          <main className="flex-1 w-full max-w-[880px]" id="settings-main-content">
            {isLoading ? (
              <SettingsLoadingSkeleton />
            ) : section === "account" ? (
              <AccountProfileForm
                user={store.currentUser}
                existingEmails={store.teamMembers.map((m) => m.email)}
                isReadOnly={isReadOnly}
                previewState={activePreviewState || undefined}
                onUpdateUser={(updates) => settingsStore.updateUserProfile(updates)}
                onInitiateEmailChange={(email) => settingsStore.initiateEmailChange(email)}
                onConfirmEmailVerification={() => settingsStore.confirmEmailVerification()}
                onCancelEmailChange={() => settingsStore.cancelEmailChange()}
                onDirtyChange={handleDirtyChange}
              />
            ) : section === "store" ? (
              <StoreProfileForm
                storeProfile={currentStoreProfile}
                isReadOnly={isReadOnly}
                previewState={activePreviewState || undefined}
                onUpdateStoreProfile={(updates) =>
                  settingsStore.updateStoreProfile(store.activeStoreId, updates)
                }
                onDirtyChange={handleDirtyChange}
              />
            ) : section === "branding" ? (
              <BrandingForm
                branding={currentBranding}
                storeName={activeStoreObj.name}
                isReadOnly={isReadOnly}
                previewState={activePreviewState || undefined}
                onUpdateBranding={(updates) =>
                  settingsStore.updateBranding(store.activeStoreId, updates)
                }
                onResetBranding={() => settingsStore.resetBranding(store.activeStoreId)}
                onDirtyChange={handleDirtyChange}
              />
            ) : section === "team" ? (
              <TeamSection
                members={store.teamMembers}
                currentStoreName={activeStoreObj.name}
                seatLimit={store.teamSeatLimit}
                isReadOnly={isReadOnly}
                previewState={activePreviewState || undefined}
                onInviteMember={(data) => settingsStore.inviteTeamMember(data)}
                onResendInvitation={(id) => settingsStore.resendInvitation(id)}
                onCancelInvitation={(id) => settingsStore.cancelInvitation(id)}
                onUpdateMemberAccess={(id, updates) =>
                  settingsStore.updateMemberAccess(id, updates)
                }
                onRemoveMember={(id) => settingsStore.removeTeamMember(id)}
                onLeaveTeam={(id) => settingsStore.leaveTeam(id)}
                onTransferOwnership={(id) => settingsStore.transferOwnership(id)}
              />
            ) : section === "notifications" ? (
              <NotificationsSection
                groups={store.notificationGroups}
                summaryPreferences={store.summaryPreferences}
                isReadOnly={isReadOnly}
                previewState={activePreviewState || undefined}
                onUpdateToggle={(grpId, itemId, channel, val) =>
                  settingsStore.updateNotificationToggle(grpId, itemId, channel, val)
                }
                onUpdateSummaryPreferences={(updates) =>
                  settingsStore.updateSummaryPreferences(updates)
                }
                onDirtyChange={handleDirtyChange}
              />
            ) : null}
          </main>
        </div>
      </div>

      {/* Sticky Bottom Action Bar when dirty */}
      <DirtyFormActionBar
        isDirty={isFormDirty}
        saveText={section === "notifications" ? "Save preferences" : "Save changes"}
        onCancel={() => {
          if (cancelCallback) cancelCallback();
          setIsFormDirty(false);
        }}
        onSave={() => {
          if (saveCallback) saveCallback();
        }}
      />

      {/* Confirmation Modals */}
      <SettingsStoreSwitchModal
        isOpen={Boolean(pendingStoreSwitchId)}
        currentStoreName={activeStoreObj.name}
        targetStoreName={targetStoreObj.name}
        onKeepEditing={() => setPendingStoreSwitchId(null)}
        onDiscardAndSwitch={handleConfirmStoreSwitch}
      />

      <SettingsLeavePageModal
        isOpen={Boolean(pendingNavSection)}
        onContinueEditing={() => setPendingNavSection(null)}
        onLeaveWithoutSaving={handleConfirmLeavePage}
      />

      {/* Floating Preview States Drawer Button */}
      <PreviewStatesDrawer currentSection={section} />
    </div>
  );
}
