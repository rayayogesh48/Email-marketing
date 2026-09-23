"use client";

import { CheckCircle2, Circle, ArrowRight, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OnboardingStep } from "@/lib/onboarding/onboarding-types";
import { REQUIRED_SETUP_STEPS } from "@/lib/onboarding/onboarding-store";

const STEP_DETAILS: Record<
  OnboardingStep,
  { title: string; completedText: string; pendingText: string }
> = {
  "connect-store": {
    title: "Connect store",
    completedText: "Store connected and data synced",
    pendingText: "Platform connection pending",
  },
  "points-rule": {
    title: "Earning rule",
    completedText: "Purchase earning rule configured",
    pendingText: "Points rule not configured",
  },
  "vip-tiers": {
    title: "VIP tiers",
    completedText: "VIP milestones established",
    pendingText: "Tiers incomplete",
  },
  branding: {
    title: "Branding",
    completedText: "Widget customized to brand",
    pendingText: "Branding not started",
  },
  welcome: { title: "Welcome", completedText: "Completed", pendingText: "Pending" },
  resume: { title: "Resume", completedText: "Completed", pendingText: "Pending" },
  review: { title: "Review", completedText: "Completed", pendingText: "Pending" },
  success: { title: "Success", completedText: "Completed", pendingText: "Pending" },
};

export function ResumeScreen({
  completedSteps,
  onContinueSetup,
  onStartOver,
}: {
  completedSteps: OnboardingStep[];
  onContinueSetup: () => void;
  onStartOver: () => void;
}) {
  const completedCount = REQUIRED_SETUP_STEPS.filter((step) =>
    completedSteps.includes(step)
  ).length;

  return (
    <div className="max-w-[640px] mx-auto py-8 sm:py-12 px-4">
      <div className="text-center max-w-lg mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] text-xs font-semibold mb-3">
          Saved progress found
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Continue setting up your loyalty program
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
          You completed <strong className="text-[var(--foreground)]">{completedCount} of 4</strong> steps. Continue where you left off.
        </p>
      </div>

      {/* Progress Checklist */}
      <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs space-y-3 mb-8">
        {REQUIRED_SETUP_STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step);
          const detail = STEP_DETAILS[step];

          return (
            <div
              key={step}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                isDone
                  ? "bg-[var(--secondary-container)]/20 border-[var(--secondary)]/30"
                  : "bg-[var(--muted)]/40 border-[var(--border)]"
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2
                    size={18}
                    className="text-[var(--secondary)] shrink-0"
                  />
                ) : (
                  <Circle
                    size={18}
                    className="text-[var(--muted-foreground)] opacity-50 shrink-0"
                  />
                )}
                <div>
                  <h4 className="text-xs font-semibold text-[var(--foreground)]">
                    Step {idx + 1}: {detail.title}
                  </h4>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {isDone ? detail.completedText : detail.pendingText}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isDone
                    ? "bg-[var(--secondary-container)] text-[var(--secondary)]"
                    : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                }`}
              >
                {isDone ? "Completed" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={onContinueSetup}
          className="w-full sm:w-auto h-10 px-6 font-semibold text-xs gap-2 shadow-xs"
        >
          <span>Continue setup</span>
          <ArrowRight size={14} />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onStartOver}
          className="w-full sm:w-auto h-10 px-4 text-xs gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Start over</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-full sm:w-auto h-10 px-4 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <Link href="/dashboard">
            <LayoutDashboard size={13} className="mr-1.5" />
            <span>View dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

