"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  NotificationGroup,
  SummaryPreferences,
} from "@/lib/settings/settings-types";
import {
  Bell,
  Mail,
  Lock,
  ExternalLink,
  ShieldAlert,
  Info,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export function NotificationsSection({
  groups,
  summaryPreferences,
  isReadOnly,
  previewState,
  onUpdateToggle,
  onUpdateSummaryPreferences,
  onDirtyChange,
}: {
  groups: NotificationGroup[];
  summaryPreferences: SummaryPreferences;
  isReadOnly?: boolean;
  previewState?: string;
  onUpdateToggle: (
    groupId: string,
    itemId: string,
    channel: "email" | "inApp",
    value: boolean,
  ) => void;
  onUpdateSummaryPreferences: (updates: Partial<SummaryPreferences>) => void;
  onDirtyChange: (isDirty: boolean, handleSave: () => void, handleCancel: () => void) => void;
}) {
  // Local state for tracking dirty changes
  const [localGroups, setLocalGroups] = useState<NotificationGroup[]>(groups);
  const [localSummary, setLocalSummary] = useState<SummaryPreferences>(summaryPreferences);

  // Determine if modified
  const isDirty =
    previewState === "notifications_modified" ||
    JSON.stringify(localGroups) !== JSON.stringify(groups) ||
    JSON.stringify(localSummary) !== JSON.stringify(summaryPreferences);

  const handleCancel = useCallback(() => {
    setLocalGroups(groups);
    setLocalSummary(summaryPreferences);
  }, [groups, summaryPreferences]);

  const handleSave = useCallback(() => {
    if (isReadOnly) return;
    if (previewState === "notifications_save_failed") {
      toast.error("Preferences could not be saved: Your previous notification settings are still active.");
      return;
    }

    // Commit changes to store
    localGroups.forEach((grp) => {
      grp.items.forEach((item) => {
        onUpdateToggle(grp.id, item.id, "email", item.email);
        onUpdateToggle(grp.id, item.id, "inApp", item.inApp);
      });
    });
    onUpdateSummaryPreferences(localSummary);
    toast.success("Notification preferences saved");
  }, [isReadOnly, previewState, localGroups, localSummary, onUpdateToggle, onUpdateSummaryPreferences]);

  useEffect(() => {
    onDirtyChange(isDirty, handleSave, handleCancel);
  }, [isDirty, handleSave, handleCancel, onDirtyChange]);

  const handleToggleItem = (
    groupId: string,
    itemId: string,
    channel: "email" | "inApp",
    value: boolean,
  ) => {
    if (isReadOnly) return;
    setLocalGroups((prev) =>
      prev.map((grp) => {
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
    );
  };

  // Check if all optional notifications are disabled
  const allOptionalDisabled =
    previewState === "notifications_all_disabled" ||
    localGroups.every((grp) =>
      grp.items.every((item) => item.isCritical || (!item.email && !item.inApp)),
    );

  const anyEmailEnabled = localGroups.some((g) =>
    g.items.some((i) => !i.isCritical && i.email),
  );
  const anyInAppEnabled = localGroups.some((g) =>
    g.items.some((i) => !i.isCritical && i.inApp),
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Notifications
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Choose which account and store updates you want to receive.
        </p>
      </div>

      {/* Information Callout */}
      <div className="p-3.5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 flex items-start gap-3 text-xs text-[var(--foreground)]">
        <Info size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block">These settings are for you</strong>
          <p className="text-[var(--muted-foreground)] mt-0.5">
            They control notifications sent to your team account. Customer loyalty emails are managed in{" "}
            <Link href="/" className="text-[var(--primary)] underline font-medium">
              Email marketing
            </Link>.
          </p>
        </div>
      </div>

      {/* Non-blocking Notice: All optional notifications disabled */}
      {allOptionalDisabled && (
        <div className="p-3.5 rounded-xl border border-[var(--muted-foreground)]/20 bg-[var(--muted)]/40 flex items-start gap-3 text-xs">
          <ShieldAlert size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-[var(--foreground)] block">
              Optional notifications are turned off
            </strong>
            <p className="text-[var(--muted-foreground)] mt-0.5">
              You’ll still receive important security and account messages.
            </p>
          </div>
        </div>
      )}

      {/* Global Channel Master Toggles */}
      <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="text-xs font-semibold text-[var(--foreground)]">
            Delivery channel defaults
          </div>
          <div className="text-[11px] text-[var(--muted-foreground)]">
            Quickly toggle all optional notifications across channels.
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const nextState = !anyEmailEnabled;
              setLocalGroups((prev) =>
                prev.map((g) => ({
                  ...g,
                  items: g.items.map((i) => (i.isCritical ? i : { ...i, email: nextState })),
                })),
              );
            }}
            disabled={isReadOnly}
            className="flex items-center gap-1.5 text-xs text-[var(--foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <Mail size={13} className="text-[var(--muted-foreground)]" />
            <span>Email {anyEmailEnabled ? "on" : "off"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextState = !anyInAppEnabled;
              setLocalGroups((prev) =>
                prev.map((g) => ({
                  ...g,
                  items: g.items.map((i) => (i.isCritical ? i : { ...i, inApp: nextState })),
                })),
              );
            }}
            disabled={isReadOnly}
            className="flex items-center gap-1.5 text-xs text-[var(--foreground)] hover:text-[var(--primary)] transition-colors cursor-pointer"
          >
            <Bell size={13} className="text-[var(--muted-foreground)]" />
            <span>In-app {anyInAppEnabled ? "on" : "off"}</span>
          </button>
        </div>
      </div>

      {/* Grouped Notification Sections */}
      <div className="space-y-6">
        {localGroups.map((group) => (
          <div
            key={group.id}
            className="border border-[var(--border)] rounded-xl bg-[var(--card)] overflow-hidden shadow-xs"
          >
            <div className="p-4 bg-[var(--muted)]/50 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[var(--foreground)]">
                  {group.title}
                </h3>
                {group.description && (
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {group.description}
                  </p>
                )}
              </div>

              {group.linkToBilling && (
                <Link
                  href="/billing"
                  className="text-[11px] font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                >
                  Manage billing <ExternalLink size={11} />
                </Link>
              )}
            </div>

            <div className="divide-y divide-[var(--border)]">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[var(--muted)]/20 transition-colors"
                >
                  <div className="space-y-0.5 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--foreground)]">
                        {item.label}
                      </span>
                      {item.isCritical && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-[var(--muted)] text-[10px] text-[var(--muted-foreground)] font-semibold border border-[var(--border)]">
                          <Lock size={10} />
                          Required
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-[var(--muted-foreground)]">
                        {item.description}
                      </p>
                    )}
                    {item.lockedReason && (
                      <p className="text-[10px] text-[var(--primary)] font-medium">
                        {item.lockedReason}
                      </p>
                    )}
                  </div>

                  {/* Toggles for Email & In-App */}
                  <div className="flex items-center gap-6 shrink-0 pt-1 sm:pt-0">
                    {/* Email Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.email}
                        disabled={item.isCritical || isReadOnly}
                        onChange={(e) =>
                          handleToggleItem(group.id, item.id, "email", e.target.checked)
                        }
                        className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)] disabled:opacity-50"
                      />
                      <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Mail size={12} /> Email
                      </span>
                    </label>

                    {/* In-app Toggle */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.inApp}
                        disabled={item.isCritical || isReadOnly}
                        onChange={(e) =>
                          handleToggleItem(group.id, item.id, "inApp", e.target.checked)
                        }
                        className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)] disabled:opacity-50"
                      />
                      <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
                        <Bell size={12} /> In-app
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Notifications Card */}
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-5 shadow-xs">
        <div>
          <h3 className="text-xs font-semibold text-[var(--foreground)]">
            Executive Summary Reports
          </h3>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Periodic digests designed to keep stakeholders aligned without inbox clutter.
          </p>
        </div>

        {/* Weekly loyalty summary */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium text-xs text-[var(--foreground)]">
              <Calendar size={14} className="text-[var(--primary)]" />
              <span>Weekly loyalty summary</span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Receive a weekly overview of members, points, redemptions, and program value.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={localSummary.weeklyDeliveryDay}
              disabled={!localSummary.weeklySummaryEnabled || isReadOnly}
              onChange={(e) =>
                setLocalSummary({
                  ...localSummary,
                  weeklyDeliveryDay: e.target.value as SummaryPreferences["weeklyDeliveryDay"],
                })
              }
              className="px-2.5 py-1 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] disabled:opacity-50"
            >
              <option value="monday">Monday morning</option>
              <option value="tuesday">Tuesday morning</option>
              <option value="wednesday">Wednesday morning</option>
              <option value="thursday">Thursday morning</option>
              <option value="friday">Friday morning</option>
            </select>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={localSummary.weeklySummaryEnabled}
                disabled={isReadOnly}
                onChange={(e) =>
                  setLocalSummary({
                    ...localSummary,
                    weeklySummaryEnabled: e.target.checked,
                  })
                }
              />
              <span className="text-[11px] text-[var(--muted-foreground)]">Enabled</span>
            </label>
          </div>
        </div>

        {/* Monthly performance summary */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium text-xs text-[var(--foreground)]">
              <Calendar size={14} className="text-[var(--primary)]" />
              <span>Monthly performance summary</span>
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Receive a monthly overview of loyalty performance and estimated program ROI.
            </p>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs shrink-0">
            <input
              type="checkbox"
              checked={localSummary.monthlySummaryEnabled}
              disabled={isReadOnly}
              onChange={(e) =>
                setLocalSummary({
                  ...localSummary,
                  monthlySummaryEnabled: e.target.checked,
                })
              }
            />
            <span className="text-[11px] text-[var(--muted-foreground)]">Enabled</span>
          </label>
        </div>
      </div>
    </div>
  );
}
