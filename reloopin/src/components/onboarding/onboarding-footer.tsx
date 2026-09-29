"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutosaveStatus } from "@/lib/onboarding/onboarding-types";

export function OnboardingFooter({
  showBack = true,
  backLabel = "Back",
  onBack,
  continueLabel = "Continue",
  continueIcon,
  onContinue,
  isContinueDisabled = false,
  isContinueLoading = false,
  autosaveStatus = "saved",
  onRetryAutosave,
}: {
  showBack?: boolean;
  backLabel?: string;
  onBack?: () => void;
  continueLabel?: string;
  continueIcon?: React.ReactNode;
  onContinue: () => void;
  isContinueDisabled?: boolean;
  isContinueLoading?: boolean;
  autosaveStatus?: AutosaveStatus;
  onRetryAutosave?: () => void;
}) {
  return (
    <footer className="onboarding-footer">
      <div className="onboarding-footer-inner">
        {/* Left: Back / Cancel Button */}
        <div className="onboarding-footer-back">
          {showBack && onBack ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              disabled={isContinueLoading}
              className="text-xs h-9 px-3 gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>{backLabel}</span>
            </Button>
          ) : (
            <div className="w-16" />
          )}
        </div>

        {/* Center: Autosave Status Indicator */}
        <div
          role="status"
          aria-live="polite"
          className="onboarding-footer-status flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)] select-none"
        >
          {autosaveStatus === "saving" && (
            <span className="inline-flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <Loader2
                size={12}
                className="animate-spin text-[var(--primary)]"
              />
              <span>Saving...</span>
            </span>
          )}

          {autosaveStatus === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-[var(--muted-foreground)]">
              <Check size={12} className="text-[var(--secondary)]" />
              <span>Changes saved</span>
            </span>
          )}

          {autosaveStatus === "failed" && (
            <button
              type="button"
              onClick={onRetryAutosave}
              className="inline-flex items-center gap-1.5 text-[var(--destructive)] hover:underline cursor-pointer"
            >
              <AlertCircle size={12} />
              <span>Save failed. Try again</span>
            </button>
          )}

          {autosaveStatus === "offline" && (
            <span className="inline-flex items-center gap-1.5 text-[var(--warning)]">
              <WifiOff size={12} />
              <span>You&apos;re offline</span>
            </span>
          )}
        </div>

        {/* Right: Primary Continue Action */}
        <div className="onboarding-footer-primary">
          <Button
            variant="default"
            size="sm"
            onClick={onContinue}
            disabled={isContinueDisabled || isContinueLoading}
            className="text-xs h-9 px-4 font-semibold gap-2 shadow-xs"
          >
            {isContinueLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{continueLabel}</span>
                {continueIcon || <ArrowRight size={14} />}
              </>
            )}
          </Button>
        </div>
      </div>
    </footer>
  );
}
