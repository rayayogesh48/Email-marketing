"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PreviewState, SettingsSection } from "@/lib/settings/settings-types";
import { settingsStore } from "@/lib/settings/settings-store";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  RotateCcw,
  Check,
  Users,
  ShieldAlert,
  Clock,
  Sparkles,
  ChevronRight,
  User,
  Store,
  Palette,
  Bell,
  Globe,
} from "lucide-react";

interface StateGroup {
  name: string;
  section?: SettingsSection;
  icon: typeof Globe;
  states: {
    id: PreviewState;
    label: string;
    description: string;
    targetSection?: SettingsSection;
  }[];
}

const stateGroups: StateGroup[] = [
  {
    name: "Global states",
    icon: Globe,
    states: [
      { id: "default", label: "Default", description: "Standard operational view" },
      { id: "loading", label: "Loading", description: "Skeleton placeholder layout" },
      { id: "saving", label: "Saving", description: "Active saving indicator" },
      { id: "saved", label: "Saved", description: "Changes saved notification" },
      { id: "save_failed", label: "Save failed", description: "Error banner when saving" },
      { id: "unsaved_changes", label: "Unsaved changes", description: "Sticky bar displayed" },
      { id: "offline", label: "Offline", description: "Network disconnected notice" },
      { id: "session_expired", label: "Session expired", description: "Re-authentication required" },
      { id: "restricted_access", label: "Restricted access", description: "Permission denied banner" },
      { id: "read_only_access", label: "Read-only access", description: "View-only lock mode" },
      { id: "store_switching", label: "Store switching", description: "Unsaved prompt modal" },
      { id: "page_error", label: "Page error", description: "Fatal load failure with retry" },
    ],
  },
  {
    name: "Account states",
    section: "account",
    icon: User,
    states: [
      { id: "account_default", label: "Default profile", description: "Standard personal info", targetSection: "account" },
      { id: "account_editing", label: "Editing profile", description: "Form with modifications", targetSection: "account" },
      { id: "account_email_verification_required", label: "Email verification required", description: "New email pending confirmation", targetSection: "account" },
      { id: "account_verification_sent", label: "Verification sent", description: "Sent state banner", targetSection: "account" },
      { id: "account_invalid_email", label: "Invalid email", description: "Field validation error", targetSection: "account" },
      { id: "account_change_password", label: "Change password dialog", description: "Password change modal", targetSection: "account" },
      { id: "account_incorrect_password", label: "Incorrect password error", description: "Auth rejection simulation", targetSection: "account" },
      { id: "account_password_changed", label: "Password changed", description: "Success notification", targetSection: "account" },
    ],
  },
  {
    name: "Store states",
    section: "store",
    icon: Store,
    states: [
      { id: "store_default", label: "Default store profile", description: "Standard store information", targetSection: "store" },
      { id: "store_missing_info", label: "Missing information", description: "Required field validation", targetSection: "store" },
      { id: "store_invalid_website", label: "Invalid website", description: "Bad URL format error", targetSection: "store" },
      { id: "store_data_synced", label: "Store data synced", description: "Live synced currency/timezone", targetSection: "store" },
      { id: "store_synced_field_locked", label: "Synced field locked", description: "Platform-locked badge", targetSection: "store" },
      { id: "store_disconnected", label: "Store disconnected", description: "Reconnect required banner", targetSection: "store" },
      { id: "store_save_successful", label: "Save successful", description: "Store updated toast", targetSection: "store" },
      { id: "store_save_failed", label: "Save failed", description: "Retryable store update failure", targetSection: "store" },
    ],
  },
  {
    name: "Branding states",
    section: "branding",
    icon: Palette,
    states: [
      { id: "branding_default", label: "Default branding", description: "Reloopin brand colors", targetSection: "branding" },
      { id: "branding_uploading_logo", label: "Uploading logo", description: "Upload in progress", targetSection: "branding" },
      { id: "branding_logo_uploaded", label: "Logo uploaded", description: "Custom merchant logo preview", targetSection: "branding" },
      { id: "branding_invalid_logo", label: "Invalid logo error", description: "File size/type rejection", targetSection: "branding" },
      { id: "branding_custom_color", label: "Custom color", description: "Hex picker modified", targetSection: "branding" },
      { id: "branding_low_contrast", label: "Low contrast warning", description: "WCAG warning & suggestion", targetSection: "branding" },
      { id: "branding_preview_loading", label: "Preview loading", description: "Widget skeleton", targetSection: "branding" },
      { id: "branding_preview_failed", label: "Preview failed", description: "Widget rendering fallback", targetSection: "branding" },
      { id: "branding_reset", label: "Reset branding modal", description: "Confirmation dialog", targetSection: "branding" },
    ],
  },
  {
    name: "Team states",
    section: "team",
    icon: Users,
    states: [
      { id: "team_default", label: "Members populated", description: "Team table with all roles", targetSection: "team" },
      { id: "team_owner_only", label: "Owner only", description: "Sole member view", targetSection: "team" },
      { id: "team_search_no_results", label: "Search no results", description: "Empty filter query", targetSection: "team" },
      { id: "team_invite_member", label: "Invite member modal", description: "Invitation dialog opened", targetSection: "team" },
      { id: "team_sending_invitation", label: "Sending invitation", description: "Loading button state", targetSection: "team" },
      { id: "team_invitation_sent", label: "Invitation sent", description: "Link copy & success", targetSection: "team" },
      { id: "team_invitation_failed", label: "Invitation failed", description: "Network error simulation", targetSection: "team" },
      { id: "team_pending_invitation", label: "Pending invitation", description: "Awaiting acceptance", targetSection: "team" },
      { id: "team_expired_invitation", label: "Expired invitation", description: "7-day link expired badge", targetSection: "team" },
      { id: "team_seat_limit_reached", label: "Seat limit reached", description: "5 of 5 seats used alert", targetSection: "team" },
      { id: "team_edit_member", label: "Edit member access", description: "Side sheet for roles", targetSection: "team" },
      { id: "team_change_role", label: "Change role dialog", description: "Elevation / reduction alert", targetSection: "team" },
      { id: "team_remove_member", label: "Remove member dialog", description: "Destructive confirmation", targetSection: "team" },
      { id: "team_transfer_ownership", label: "Transfer ownership", description: "Type TRANSFER modal", targetSection: "team" },
      { id: "team_restricted_action", label: "Restricted action", description: "Staff removal block", targetSection: "team" },
    ],
  },
  {
    name: "Notification states",
    section: "notifications",
    icon: Bell,
    states: [
      { id: "notifications_default", label: "Default preferences", description: "Standard operational mix", targetSection: "notifications" },
      { id: "notifications_modified", label: "Modified preferences", description: "Dirty preferences bar", targetSection: "notifications" },
      { id: "notifications_saving", label: "Saving preferences", description: "In-progress save bar", targetSection: "notifications" },
      { id: "notifications_saved", label: "Saved preferences", description: "Success confirmation", targetSection: "notifications" },
      { id: "notifications_save_failed", label: "Save failed", description: "Error toast and retry", targetSection: "notifications" },
      { id: "notifications_all_disabled", label: "All optional disabled", description: "Security only banner", targetSection: "notifications" },
    ],
  },
];

export function PreviewStatesDrawer({
  currentSection,
}: {
  currentSection: SettingsSection;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentState = searchParams.get("state") || "default";

  const handleSelectState = (stateId: PreviewState, targetSection?: SettingsSection) => {
    settingsStore.setPreviewState(stateId);
    const section = targetSection || currentSection;
    const url = `/settings/${section}?state=${stateId}`;
    router.push(url);
    setOpen(false);
  };

  const handleResetDemo = () => {
    settingsStore.resetDemoData();
    router.push(`/settings/${currentSection}`);
    setOpen(false);
  };

  const handleAddSampleMembers = () => {
    settingsStore.addSampleMembers();
    setOpen(false);
  };

  const handleClearMembers = () => {
    settingsStore.clearTeamMembers();
    setOpen(false);
  };

  const handleSimulateSaveFailure = () => {
    settingsStore.setPreviewState("save_failed");
    setOpen(false);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-6 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md shadow-md text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all cursor-pointer group"
        data-testid="settings-preview-states-button"
        title="Open Settings Preview States"
      >
        <Wrench size={13} className="text-[var(--primary)] group-hover:rotate-45 transition-transform" />
        <span>Preview states</span>
      </button>

      {/* Slide-over Drawer / Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Settings states"
        description="Open any screen, dialog, or operational state for design and development review."
        side={true}
      >
        <div className="space-y-6 pt-2">
          {/* Quick Demo Controls */}
          <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-[var(--border)]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemo}
              className="text-[11px] h-7 px-2.5"
            >
              <RotateCcw size={12} className="mr-1" />
              Reset demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSampleMembers}
              className="text-[11px] h-7 px-2.5"
            >
              <Users size={12} className="mr-1" />
              Add members
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearMembers}
              className="text-[11px] h-7 px-2.5 text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
            >
              Clear team
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateSaveFailure}
              className="text-[11px] h-7 px-2.5 text-[var(--warning,#f59e0b)] hover:bg-[var(--warning,#f59e0b)]/10"
            >
              <ShieldAlert size={12} className="mr-1" />
              Save fail
            </Button>
          </div>

          {/* Grouped States List */}
          <div className="p-5 space-y-6">
            {stateGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.name} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                    <Icon size={13} />
                    <span>{group.name}</span>
                    <span className="text-[10px] lowercase font-normal ml-auto">
                      {group.states.length} states
                    </span>
                  </div>

                  <div className="border border-[var(--border)] rounded-xl divide-y divide-[var(--border)] overflow-hidden bg-[var(--card)] shadow-2xs">
                    {group.states.map((st) => {
                      const isSelected = currentState === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => handleSelectState(st.id, st.targetSection)}
                          className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between text-xs transition-colors hover:bg-[var(--muted)]/60 cursor-pointer ${
                            isSelected ? "bg-[var(--accent)] font-medium text-[var(--accent-foreground)]" : "text-[var(--foreground)]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 font-medium">
                              {st.label}
                              {st.targetSection && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--muted)] text-[var(--muted-foreground)] font-normal">
                                  {st.targetSection}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[var(--muted-foreground)]">
                              {st.description}
                            </div>
                          </div>

                          {isSelected ? (
                            <Check size={14} className="text-[var(--primary)] shrink-0 ml-2" />
                          ) : (
                            <ChevronRight size={13} className="text-[var(--muted-foreground)]/50 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}
