"use client";

import Image from "next/image";
import { HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingStep } from "@/lib/onboarding/onboarding-types";
import { REQUIRED_SETUP_STEPS } from "@/lib/onboarding/onboarding-store";

const STEP_LABELS: Record<string, string> = {
  "connect-store": "Connect store",
  "points-rule": "Points rule",
  "vip-tiers": "VIP tiers",
  branding: "Branding",
};

export function OnboardingNavigation({
  currentStep,
  completedSteps,
  onStepClick,
}: {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
}) {
  return (
    <nav aria-label="Onboarding step progress" className="onboarding-step-nav">
      <ol>
        {REQUIRED_SETUP_STEPS.map((step, index) => {
          const current = currentStep === step;
          const completed = completedSteps.includes(step) && !current;
          return (
            <li key={step}>
              <button
                type="button"
                onClick={() => onStepClick(step)}
                disabled={!current && !completed}
                aria-current={current ? "step" : undefined}
                className={`onboarding-step ${current ? "is-current" : completed ? "is-completed" : "is-upcoming"}`}
              >
                <span className="onboarding-step-indicator">
                  {completed ? (
                    <Image
                      src="/onboarding/check.svg"
                      width={12}
                      height={12}
                      alt="Completed"
                    />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{STEP_LABELS[step]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function OnboardingHeader({
  currentStep,
  onOpenHelp,
  onSaveAndExit,
}: {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
  onOpenHelp: () => void;
  onSaveAndExit: () => void;
}) {
  const stepIndex = REQUIRED_SETUP_STEPS.indexOf(currentStep);
  const progress =
    stepIndex >= 0
      ? (stepIndex + 1) * 25
      : currentStep === "review" || currentStep === "success"
        ? 100
        : 0;
  return (
    <header className="onboarding-header">
      <div className="onboarding-header-inner">
        <div className="onboarding-brand">
          <span className="onboarding-logo">
            <Image
              src="/onboarding/refresh-cw.svg"
              width={12}
              height={12}
              alt=""
            />
          </span>
          <span>Reloopin</span>
        </div>
        <div className="onboarding-header-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenHelp}
            aria-label="Get onboarding help and FAQs"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Help</span>
          </Button>
          {currentStep !== "success" && (
            <Button variant="ghost" size="sm" onClick={onSaveAndExit}>
              <LogOut size={13} />
              <span>Save & exit</span>
            </Button>
          )}
          <span className="onboarding-step-label">
            {stepIndex >= 0
              ? `Step ${stepIndex + 1} of 4`
              : currentStep === "review"
                ? "Review setup"
                : currentStep === "success"
                  ? "Setup complete"
                  : "Setup overview"}
          </span>
        </div>
      </div>
      <div
        className="onboarding-progress"
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
