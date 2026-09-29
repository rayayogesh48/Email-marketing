"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingHeader, OnboardingNavigation } from "./onboarding-header";
import { OnboardingFooter } from "./onboarding-footer";
import { WelcomeScreen } from "./welcome-screen";
import { ResumeScreen } from "./resume-screen";
import { ConnectStoreStep } from "./connect-store-step";
import { EarningRuleForm } from "./earning-rule-form";
import { VIPTierList } from "./vip-tier-list";
import { WidgetPreview } from "./widget-preview";
import { ReviewSetup } from "./review-setup";
import { SuccessScreen } from "./success-screen";
import { PreviewStates } from "./preview-states";
import {
  HelpSheet,
  SaveAndExitDialog,
  RestartSetupDialog,
  UnsavedChangesDialog,
} from "./onboarding-dialogs";
import {
  loadOnboardingState,
  saveOnboardingState,
  clearOnboardingState,
  getNextIncompleteStep,
  REQUIRED_SETUP_STEPS,
} from "@/lib/onboarding/onboarding-store";
import {
  OnboardingState,
  OnboardingStep,
  AutosaveStatus,
} from "@/lib/onboarding/onboarding-types";
import { INITIAL_ONBOARDING_STATE } from "@/lib/onboarding/onboarding-data";
import { Lock, LogIn, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function OnboardingFlow({
  initialStep,
}: {
  initialStep?: OnboardingStep;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load persisted state safely with lazy initializer
  const [state, setState] = useState<OnboardingState>(() =>
    loadOnboardingState(),
  );
  const isClientReady = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>(() =>
    typeof navigator !== "undefined" && !navigator.onLine ? "offline" : "saved",
  );

  // Dialog toggles
  const [showHelp, setShowHelp] = useState(false);
  const [showSaveAndExit, setShowSaveAndExit] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  // Read URL query params
  const stepParam = (searchParams.get("step") as OnboardingStep) || initialStep;
  const stateParam = searchParams.get("state") || undefined;

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setAutosaveStatus("saved");
    const handleOffline = () => setAutosaveStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Derived active step from URL params or saved progress
  const currentStep: OnboardingStep =
    stepParam ||
    (state.completedSteps.length > 0 && !state.onboardingCompleted
      ? "resume"
      : state.currentStep || "welcome");

  // Update URL search parameters
  const updateRoute = useCallback(
    (step: OnboardingStep, subState?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step);
      if (subState && subState !== "default") {
        params.set("state", subState);
      } else {
        params.delete("state");
      }
      router.push(`/onboarding?${params.toString()}`);
    },
    [router, searchParams],
  );

  // Autosave state handler
  const updateAndPersist = useCallback(
    (updater: (prev: OnboardingState) => OnboardingState) => {
      setState((prev) => {
        const next = updater(prev);
        setAutosaveStatus("saving");
        try {
          saveOnboardingState(next);
          setTimeout(() => setAutosaveStatus("saved"), 350);
        } catch {
          setAutosaveStatus("failed");
        }
        return next;
      });
    },
    [],
  );

  // Navigate to a specific step
  const handleStepChange = (targetStep: OnboardingStep) => {
    updateAndPersist((prev) => ({
      ...prev,
      currentStep: targetStep,
    }));
    updateRoute(targetStep);
  };

  // Step completion helper
  const handleCompleteCurrentStep = (
    step: OnboardingStep,
    nextStep: OnboardingStep,
  ) => {
    updateAndPersist((prev) => ({
      ...prev,
      completedSteps: Array.from(new Set([...prev.completedSteps, step])),
      currentStep: nextStep,
    }));
    updateRoute(nextStep);
  };

  // Reset demo
  const handleResetDemo = () => {
    clearOnboardingState();
    setState(INITIAL_ONBOARDING_STATE);
    updateRoute("welcome");
  };

  // Mark all steps complete
  const handleMarkAllComplete = () => {
    updateAndPersist((prev) => ({
      ...prev,
      completedSteps: REQUIRED_SETUP_STEPS,
      currentStep: "review",
    }));
    updateRoute("review");
  };

  // Confirm Save and Exit
  const handleConfirmSaveAndExit = () => {
    setShowSaveAndExit(false);
    saveOnboardingState(state);
    router.push("/dashboard");
  };

  // Confirm Restart Setup
  const handleConfirmRestart = () => {
    setShowRestartDialog(false);
    clearOnboardingState();
    setState({
      ...INITIAL_ONBOARDING_STATE,
      currentStep: "welcome",
    });
    updateRoute("welcome");
  };

  // Successful Activation
  const handleActivationComplete = () => {
    updateAndPersist((prev) => ({
      ...prev,
      onboardingCompleted: true,
      currentStep: "success",
    }));
    updateRoute("success");
  };

  // Go to dashboard from success screen
  const handleGoToDashboard = () => {
    saveOnboardingState({
      ...state,
      onboardingCompleted: true,
      tourCompleted: false,
    });
    router.push("/dashboard?tour=true");
  };

  const previewControls = (
    <PreviewStates
      currentStep={currentStep}
      currentStateParam={stateParam}
      onSelectState={(step, subState) => {
        updateAndPersist((p) => ({ ...p, currentStep: step }));
        updateRoute(step, subState);
      }}
      onResetDemo={handleResetDemo}
      onMarkAllComplete={handleMarkAllComplete}
      onClearProgress={clearOnboardingState}
    />
  );

  if (!isClientReady || stateParam === "loading") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between p-6">
        <div className="max-w-[720px] w-full mx-auto space-y-6 pt-12">
          <div className="h-8 w-48 bg-[var(--muted)]/60 rounded-lg animate-pulse" />
          <div className="h-24 w-full bg-[var(--muted)]/40 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-32 bg-[var(--muted)]/40 rounded-xl animate-pulse" />
            <div className="h-32 bg-[var(--muted)]/40 rounded-xl animate-pulse" />
          </div>
        </div>
        {isClientReady && previewControls}
      </div>
    );
  }

  // Permission restricted state
  if (stateParam === "permission_restricted") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[var(--destructive-container)] text-[var(--destructive)] flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            You don&apos;t have permission to change loyalty settings
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Ask the account owner or store administrator for setup access.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="text-xs h-9 px-4"
          >
            Back to dashboard
          </Button>
        </div>
        {isClientReady && previewControls}
      </div>
    );
  }

  // Session expired state
  if (stateParam === "session_expired") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[var(--warning-container)] text-[var(--warning)] flex items-center justify-center mx-auto">
            <LogIn size={24} />
          </div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            Your session has expired
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Sign in again to continue setting up your loyalty program. Your
            local progress has been preserved.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => updateRoute(currentStep, "default")}
            className="text-xs h-9 px-4"
          >
            Sign in again
          </Button>
        </div>
        {isClientReady && previewControls}
      </div>
    );
  }

  return (
    <div className="onboarding-shell min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col relative selection:bg-[var(--primary-container)] selection:text-[var(--primary)]">
      {/* Offline Alert Banner */}
      {(autosaveStatus === "offline" || stateParam === "offline") && (
        <div className="bg-[var(--warning-bg)] border-b border-[var(--warning)]/30 text-[var(--warning)] py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
          <WifiOff size={14} />
          <span>
            You&apos;re offline. Reconnect before continuing so your changes are
            not lost.
          </span>
        </div>
      )}

      {/* Header */}
      <OnboardingHeader
        currentStep={currentStep}
        completedSteps={state.completedSteps}
        onStepClick={handleStepChange}
        onOpenHelp={() => setShowHelp(true)}
        onSaveAndExit={() => setShowSaveAndExit(true)}
      />

      {/* Main Content Area */}
      <main
        className={`onboarding-main ${["points-rule", "vip-tiers", "branding"].includes(currentStep) ? "has-step-nav" : ""}`}
      >
        {["points-rule", "vip-tiers", "branding"].includes(currentStep) && (
          <OnboardingNavigation
            currentStep={currentStep}
            completedSteps={state.completedSteps}
            onStepClick={handleStepChange}
          />
        )}
        <div className="onboarding-main-column">
          {currentStep === "welcome" && (
            <WelcomeScreen
              onStartSetup={() => {
                updateAndPersist((p) => ({
                  ...p,
                  currentStep: "connect-store",
                }));
                updateRoute("connect-store");
              }}
            />
          )}

          {currentStep === "resume" && (
            <ResumeScreen
              completedSteps={state.completedSteps}
              onContinueSetup={() => {
                const next = getNextIncompleteStep(state.completedSteps);
                updateAndPersist((p) => ({ ...p, currentStep: next }));
                updateRoute(next);
              }}
              onStartOver={() => setShowRestartDialog(true)}
            />
          )}

          {currentStep === "connect-store" && (
            <ConnectStoreStep
              key={`${currentStep}:${stateParam || "default"}`}
              data={state.storeConnection}
              onUpdateConnection={(updated) =>
                updateAndPersist((p) => ({
                  ...p,
                  storeConnection: { ...p.storeConnection, ...updated },
                }))
              }
              onContinue={() =>
                handleCompleteCurrentStep("connect-store", "points-rule")
              }
              overrideState={stateParam}
            />
          )}

          {currentStep === "points-rule" && (
            <EarningRuleForm
              key={`${currentStep}:${stateParam || "default"}`}
              data={state.earningRule}
              onSaveRule={(updated) =>
                updateAndPersist((p) => ({
                  ...p,
                  earningRule: updated,
                }))
              }
              onContinue={() =>
                handleCompleteCurrentStep("points-rule", "vip-tiers")
              }
              overrideState={stateParam}
            />
          )}

          {currentStep === "vip-tiers" && (
            <VIPTierList
              key={`${currentStep}:${stateParam || "default"}`}
              tiers={state.vipTiers}
              onSaveTiers={(updated) =>
                updateAndPersist((p) => ({
                  ...p,
                  vipTiers: updated,
                }))
              }
              onContinue={() =>
                handleCompleteCurrentStep("vip-tiers", "branding")
              }
              overrideState={stateParam}
            />
          )}

          {currentStep === "branding" && (
            <WidgetPreview
              key={`${currentStep}:${stateParam || "default"}`}
              data={state.branding}
              onSaveBranding={(updated) =>
                updateAndPersist((p) => ({
                  ...p,
                  branding: updated,
                }))
              }
              onContinue={() => handleCompleteCurrentStep("branding", "review")}
              overrideState={stateParam}
            />
          )}

          {currentStep === "review" && (
            <ReviewSetup
              key={`${currentStep}:${stateParam || "default"}`}
              state={state}
              onNavigateToStep={(target) => {
                updateAndPersist((p) => ({ ...p, currentStep: target }));
                updateRoute(target);
              }}
              onActivateSuccess={handleActivationComplete}
              onSaveAndExit={() => setShowSaveAndExit(true)}
              overrideState={stateParam}
            />
          )}

          {currentStep === "success" && (
            <SuccessScreen
              state={state}
              onGoToDashboard={handleGoToDashboard}
            />
          )}

          {/* Step actions and autosave status */}
          {currentStep !== "welcome" &&
            currentStep !== "resume" &&
            currentStep !== "success" && (
              <OnboardingFooter
                showBack={currentStep !== "connect-store"}
                backLabel={currentStep === "connect-store" ? "Cancel" : "Back"}
                onBack={() => {
                  const stepOrder: OnboardingStep[] = [
                    "connect-store",
                    "points-rule",
                    "vip-tiers",
                    "branding",
                    "review",
                  ];
                  const idx = stepOrder.indexOf(currentStep);
                  if (idx > 0) {
                    const prev = stepOrder[idx - 1];
                    updateAndPersist((p) => ({ ...p, currentStep: prev }));
                    updateRoute(prev);
                  }
                }}
                continueLabel={
                  currentStep === "connect-store"
                    ? "Continue to points rule"
                    : currentStep === "points-rule"
                      ? "Continue to VIP tiers"
                      : currentStep === "vip-tiers"
                        ? "Continue to branding"
                        : currentStep === "branding"
                          ? "Finish setup"
                          : "Activate loyalty program"
                }
                onContinue={() => {
                  if (currentStep === "connect-store") {
                    handleCompleteCurrentStep("connect-store", "points-rule");
                  } else if (currentStep === "points-rule") {
                    handleCompleteCurrentStep("points-rule", "vip-tiers");
                  } else if (currentStep === "vip-tiers") {
                    handleCompleteCurrentStep("vip-tiers", "branding");
                  } else if (currentStep === "branding") {
                    handleCompleteCurrentStep("branding", "review");
                  } else if (currentStep === "review") {
                    handleActivationComplete();
                  }
                }}
                isContinueLoading={stateParam === "saving"}
                autosaveStatus={
                  stateParam === "saving"
                    ? "saving"
                    : stateParam === "save_failed"
                      ? "failed"
                      : stateParam === "offline"
                        ? "offline"
                        : stateParam === "saved"
                          ? "saved"
                          : autosaveStatus
                }
                onRetryAutosave={() => {
                  setAutosaveStatus("saving");
                  if (stateParam === "save_failed") updateRoute(currentStep);
                  setTimeout(() => setAutosaveStatus("saved"), 300);
                }}
              />
            )}
        </div>
      </main>

      {/* Persistent Floating Bottom-Left Preview States Tool */}
      {previewControls}

      {/* Dialogs */}
      <HelpSheet open={showHelp} onClose={() => setShowHelp(false)} />

      <SaveAndExitDialog
        open={showSaveAndExit}
        onClose={() => setShowSaveAndExit(false)}
        onConfirmExit={handleConfirmSaveAndExit}
      />

      <RestartSetupDialog
        open={showRestartDialog}
        onClose={() => setShowRestartDialog(false)}
        onConfirmRestart={handleConfirmRestart}
      />

      <UnsavedChangesDialog
        open={showUnsavedDialog || stateParam === "unsaved_changes"}
        onClose={() => {
          setShowUnsavedDialog(false);
          if (stateParam === "unsaved_changes") updateRoute(currentStep);
        }}
        onConfirmLeave={() => {
          setShowUnsavedDialog(false);
          router.push("/dashboard");
        }}
        onRetrySave={() => {
          setShowUnsavedDialog(false);
          if (stateParam === "unsaved_changes") updateRoute(currentStep);
          saveOnboardingState(state);
        }}
      />
    </div>
  );
}
