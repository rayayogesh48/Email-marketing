"use client";

import { useState } from "react";
import {
  Wrench,
  RotateCcw,
  CheckCheck,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { OnboardingStep } from "@/lib/onboarding/onboarding-types";

export interface StatePresetItem {
  id: string;
  label: string;
  step: OnboardingStep;
  stateParam: string;
}

interface StateCategory {
  title: string;
  items: StatePresetItem[];
}

const STATE_CATEGORIES: StateCategory[] = [
  {
    title: "Global States",
    items: [
      { id: "welcome", label: "Welcome screen", step: "welcome", stateParam: "default" },
      { id: "resume", label: "Resume onboarding", step: "resume", stateParam: "default" },
      { id: "loading", label: "Loading skeletons", step: "connect-store", stateParam: "loading" },
      { id: "saving", label: "Saving status", step: "points-rule", stateParam: "saving" },
      { id: "saved", label: "Saved status", step: "points-rule", stateParam: "saved" },
      { id: "save_failed", label: "Save failed", step: "points-rule", stateParam: "save_failed" },
      { id: "offline", label: "Offline banner", step: "connect-store", stateParam: "offline" },
      { id: "session_expired", label: "Session expired", step: "connect-store", stateParam: "session_expired" },
      { id: "unsaved_changes", label: "Unsaved changes dialog", step: "points-rule", stateParam: "unsaved_changes" },
      { id: "permission_restricted", label: "Permission restricted", step: "welcome", stateParam: "permission_restricted" },
    ],
  },
  {
    title: "Connect Store",
    items: [
      { id: "select_platform", label: "Select platform", step: "connect-store", stateParam: "select_platform" },
      { id: "connecting", label: "Connecting", step: "connect-store", stateParam: "connecting" },
      { id: "redirecting", label: "Redirecting to store", step: "connect-store", stateParam: "redirecting" },
      { id: "waiting_approval", label: "Waiting for approval", step: "connect-store", stateParam: "waiting_approval" },
      { id: "verifying", label: "Verifying connection", step: "connect-store", stateParam: "verifying" },
      { id: "connected", label: "Connected (Pre-sync)", step: "connect-store", stateParam: "connected" },
      { id: "syncing", label: "Syncing customers & orders", step: "connect-store", stateParam: "syncing" },
      { id: "sync_complete", label: "Sync complete", step: "connect-store", stateParam: "sync_complete" },
      { id: "permission_denied", label: "Permission denied", step: "connect-store", stateParam: "permission_denied" },
      { id: "connection_cancelled", label: "Connection cancelled", step: "connect-store", stateParam: "select_platform" },
      { id: "invalid_url", label: "Invalid store URL", step: "connect-store", stateParam: "invalid_url" },
      { id: "already_connected", label: "Already connected", step: "connect-store", stateParam: "already_connected" },
      { id: "connection_expired", label: "Connection expired", step: "connect-store", stateParam: "connection_expired" },
      { id: "connection_failed", label: "Connection failed", step: "connect-store", stateParam: "connection_failed" },
      { id: "partial_sync", label: "Partial sync warning", step: "connect-store", stateParam: "partial_sync" },
      { id: "store_disconnected", label: "Store disconnected", step: "connect-store", stateParam: "permission_denied" },
    ],
  },
  {
    title: "Earning Rule",
    items: [
      { id: "default_rule", label: "Default rule (1 pt / $1)", step: "points-rule", stateParam: "default" },
      { id: "custom_rate", label: "Custom rate (2 pts / $1)", step: "points-rule", stateParam: "custom_rate" },
      { id: "minimum_order", label: "Minimum order limit", step: "points-rule", stateParam: "minimum_order" },
      { id: "maximum_points", label: "Maximum points per order", step: "points-rule", stateParam: "maximum_points" },
      { id: "rule_validation_error", label: "Validation errors", step: "points-rule", stateParam: "validation_error" },
      { id: "rule_saved", label: "Rule saved state", step: "points-rule", stateParam: "saved" },
    ],
  },
  {
    title: "VIP Tiers",
    items: [
      { id: "default_tiers", label: "Default 3 tiers", step: "vip-tiers", stateParam: "default" },
      { id: "add_tier", label: "Add tier dialog open", step: "vip-tiers", stateParam: "add_tier" },
      { id: "invalid_thresholds", label: "Invalid thresholds error", step: "vip-tiers", stateParam: "invalid_thresholds" },
      { id: "tiers_saved", label: "VIP tiers saved", step: "vip-tiers", stateParam: "saved" },
    ],
  },
  {
    title: "Branding",
    items: [
      { id: "default_color", label: "Default Indigo (#4F46E5)", step: "branding", stateParam: "default" },
      { id: "custom_color", label: "Custom color (#2563EB)", step: "branding", stateParam: "custom_color" },
      { id: "low_contrast", label: "Low contrast warning (#FACC15)", step: "branding", stateParam: "low_contrast" },
      { id: "invalid_color", label: "Invalid hex color", step: "branding", stateParam: "invalid_color" },
      { id: "preview_failed", label: "Preview failed fallback", step: "branding", stateParam: "preview_failed" },
      { id: "branding_saved", label: "Branding saved", step: "branding", stateParam: "saved" },
    ],
  },
  {
    title: "Review & Activation",
    items: [
      { id: "ready_to_activate", label: "Ready to activate", step: "review", stateParam: "default" },
      { id: "missing_store", label: "Missing store connection", step: "review", stateParam: "missing_store_connection" },
      { id: "invalid_rule", label: "Invalid earning rule", step: "review", stateParam: "invalid_earning_rule" },
      { id: "invalid_tiers_rev", label: "Invalid VIP tiers", step: "review", stateParam: "invalid_tiers" },
      { id: "activating", label: "Activating sequence", step: "review", stateParam: "activating" },
      { id: "activation_failed", label: "Activation failed error", step: "review", stateParam: "activation_failed" },
    ],
  },
  {
    title: "Completion",
    items: [
      { id: "success_screen", label: "Success celebration", step: "success", stateParam: "default" },
      { id: "dashboard_tour", label: "Dashboard tour", step: "success", stateParam: "tour" },
    ],
  },
];

export function PreviewStates({
  currentStep,
  currentStateParam,
  onSelectState,
  onResetDemo,
  onMarkAllComplete,
  onClearProgress,
}: {
  currentStep: OnboardingStep;
  currentStateParam?: string;
  onSelectState: (step: OnboardingStep, stateParam: string) => void;
  onResetDemo: () => void;
  onMarkAllComplete: () => void;
  onClearProgress: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Bottom-Left Button */}
      <div className="fixed bottom-20 left-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--card)]/90 hover:bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-md hover:border-[var(--ring)] backdrop-blur-md text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95"
          aria-label="Open onboarding preview states panel"
        >
          <Wrench size={13} className="text-[var(--primary)]" />
          <span>Preview states</span>
        </button>
      </div>

      {/* Slide-over Side Panel */}
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Onboarding states"
        description="Open any screen or system state for design and development review."
        side={true}
        wide={true}
      >
        <div className="space-y-6 mt-4 pb-6">
          {/* Quick Utility Controls */}
          <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Demo utilities
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onResetDemo();
                  setIsOpen(false);
                }}
                className="text-[11px] h-8 gap-1.5 justify-start"
              >
                <RotateCcw size={12} />
                <span>Reset demo</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onMarkAllComplete();
                  setIsOpen(false);
                }}
                className="text-[11px] h-8 gap-1.5 justify-start"
              >
                <CheckCheck size={12} className="text-[var(--secondary)]" />
                <span>Mark all complete</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClearProgress();
                  setIsOpen(false);
                }}
                className="text-[11px] h-8 gap-1.5 justify-start col-span-2 text-[var(--destructive)] hover:bg-[var(--destructive-container)]"
              >
                <Trash2 size={12} />
                <span>Clear saved progress</span>
              </Button>
            </div>
          </div>

          {/* Grouped States by Step */}
          <div className="space-y-5">
            {STATE_CATEGORIES.map((category) => (
              <div key={category.title} className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground)] px-1">
                  {category.title}
                </h4>

                <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
                  {category.items.map((item) => {
                    const isSelected =
                      currentStep === item.step &&
                      (currentStateParam === item.stateParam ||
                        (!currentStateParam && item.stateParam === "default"));

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectState(item.step, item.stateParam);
                          setIsOpen(false);
                        }}
                        className={`w-full p-2.5 text-left flex items-center justify-between transition-colors cursor-pointer text-xs ${
                          isSelected
                            ? "bg-[var(--primary-container)]/30 font-bold text-[var(--primary)]"
                            : "hover:bg-[var(--muted)]/50 text-[var(--foreground)]"
                        }`}
                      >
                        <span className="truncate pr-2">{item.label}</span>
                        <ChevronRight
                          size={13}
                          className={
                            isSelected
                              ? "text-[var(--primary)] shrink-0"
                              : "text-[var(--muted-foreground)] opacity-40 shrink-0"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
