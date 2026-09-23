"use client";

import { Layers, HelpCircle, LogOut, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from "@/lib/onboarding/onboarding-types";
import { REQUIRED_SETUP_STEPS } from "@/lib/onboarding/onboarding-store";

const STEP_LABELS: Record<string, string> = {
  "connect-store": "Connect store",
  "points-rule": "Earning rule",
  "vip-tiers": "VIP tiers",
  branding: "Branding",
};

export function OnboardingHeader({
  currentStep,
  completedSteps,
  onStepClick,
  onOpenHelp,
  onSaveAndExit,
}: {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
  onOpenHelp: () => void;
  onSaveAndExit: () => void;
}) {
  const currentStepIndex = REQUIRED_SETUP_STEPS.indexOf(currentStep);
  const isNumberedStep = currentStepIndex !== -1;
  const stepNumber = isNumberedStep ? currentStepIndex + 1 : null;

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-base sm:text-lg text-[var(--foreground)]">
            <span className="w-7 h-7 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-xs">
              <Layers size={16} />
            </span>
            <span>reloopin</span>
            <span className="text-[10px] text-[var(--muted-foreground)] -mt-2 -ml-0.5">
              ®
            </span>
          </div>
        </div>

        {/* Center: Step Progress Stepper */}
        {isNumberedStep && (
          <nav
            aria-label="Onboarding step progress"
            className="flex items-center justify-center flex-1 max-w-md mx-auto"
          >
            {/* Desktop / Tablet Stepper */}
            <div className="hidden sm:flex items-center gap-1.5">
              {REQUIRED_SETUP_STEPS.map((step, idx) => {
                const isCurrent = step === currentStep;
                const isCompleted = completedSteps.includes(step);
                const stepIdx = idx + 1;
                const label = STEP_LABELS[step];

                return (
                  <div key={step} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => (isCompleted || isCurrent ? onStepClick(step) : null)}
                      disabled={!isCompleted && !isCurrent}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        isCurrent
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs font-semibold"
                          : isCompleted
                            ? "bg-[var(--secondary-container)] text-[var(--secondary)] hover:opacity-90 cursor-pointer"
                            : "text-[var(--muted-foreground)] opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isCurrent
                            ? "bg-[var(--primary-foreground)] text-[var(--primary)]"
                            : isCompleted
                              ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                              : "border border-current"
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <Check size={10} strokeWidth={3} />
                        ) : (
                          stepIdx
                        )}
                      </span>
                      <span>{label}</span>
                    </button>

                    {idx < REQUIRED_SETUP_STEPS.length - 1 && (
                      <div
                        className={`w-3 h-0.5 mx-0.5 ${
                          completedSteps.includes(REQUIRED_SETUP_STEPS[idx])
                            ? "bg-[var(--secondary)]"
                            : "bg-[var(--border)]"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Compact Badge */}
            <div className="sm:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)] text-xs">
              <span className="font-semibold text-[var(--foreground)]">
                Step {stepNumber} of 4
              </span>
              <span className="text-[var(--muted-foreground)]">·</span>
              <span className="text-[var(--muted-foreground)] truncate max-w-[110px]">
                {STEP_LABELS[currentStep]}
              </span>
            </div>
          </nav>
        )}

        {/* Non-numbered states (Review / Success / Welcome / Resume) */}
        {!isNumberedStep && (
          <div className="flex-1 flex justify-center text-xs font-medium text-[var(--muted-foreground)]">
            {currentStep === "review" && (
              <span className="px-3 py-1 rounded-full bg-[var(--primary-container)] text-[var(--primary)] font-semibold">
                Review & Activate
              </span>
            )}
            {currentStep === "success" && (
              <span className="px-3 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] font-semibold">
                Setup Complete
              </span>
            )}
            {(currentStep === "welcome" || currentStep === "resume") && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                Setup Overview · 5-10 min
              </span>
            )}
          </div>
        )}

        {/* Right: Help & Save and exit */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHelp}
            aria-label="Get onboarding help and FAQs"
            className="text-xs h-8 px-2.5 gap-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Help</span>
          </Button>

          {currentStep !== "success" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveAndExit}
              className="text-xs h-8 px-2.5 gap-1.5"
            >
              <LogOut size={13} />
              <span>Save & exit</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

