import {
  INITIAL_ONBOARDING_STATE,
  DEFAULT_SYNC_ITEMS,
  INITIAL_VIP_TIERS,
} from "./onboarding-data";
import { OnboardingState, OnboardingStep } from "./onboarding-types";

const STORAGE_KEY = "reloopin_onboarding_v1";

export const REQUIRED_SETUP_STEPS: OnboardingStep[] = [
  "connect-store",
  "points-rule",
  "vip-tiers",
  "branding",
];

export function loadOnboardingState(): OnboardingState {
  if (typeof window === "undefined") {
    return INITIAL_ONBOARDING_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_ONBOARDING_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_ONBOARDING_STATE,
      ...parsed,
      storeConnection: {
        ...INITIAL_ONBOARDING_STATE.storeConnection,
        ...(parsed.storeConnection || {}),
        syncProgress:
          parsed.storeConnection?.syncProgress || DEFAULT_SYNC_ITEMS,
      },
      earningRule: {
        ...INITIAL_ONBOARDING_STATE.earningRule,
        ...(parsed.earningRule || {}),
      },
      vipTiers: parsed.vipTiers?.length ? parsed.vipTiers : INITIAL_VIP_TIERS,
      branding: {
        ...INITIAL_ONBOARDING_STATE.branding,
        ...(parsed.branding || {}),
      },
    };
  } catch {
    return INITIAL_ONBOARDING_STATE;
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      ...state,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to persist onboarding state", err);
  }
}

export function clearOnboardingState(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear onboarding state", err);
  }
}

export function getCompletedStepsCount(completedSteps: OnboardingStep[]): number {
  return REQUIRED_SETUP_STEPS.filter((step) => completedSteps.includes(step))
    .length;
}

export function getNextIncompleteStep(
  completedSteps: OnboardingStep[]
): OnboardingStep {
  for (const step of REQUIRED_SETUP_STEPS) {
    if (!completedSteps.includes(step)) {
      return step;
    }
  }
  return "review";
}

