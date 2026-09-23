"use client";

import { Suspense } from "react";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="h-8 w-48 bg-[var(--muted)]/60 rounded-lg animate-pulse" />
        </div>
      }
    >
      <OnboardingFlow initialStep="success" />
    </Suspense>
  );
}

