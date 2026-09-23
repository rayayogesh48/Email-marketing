"use client";

import { CheckCircle2, Circle, ArrowRight, Sparkles } from "lucide-react";
import { DashboardSetupChecklist } from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";

export function FirstRunDashboard({
  checklist,
  onStepAction,
  onExploreDashboard,
}: {
  checklist: DashboardSetupChecklist;
  onStepAction: (stepId: string) => void;
  onExploreDashboard: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--secondary-container)] text-[var(--secondary)] text-xs font-semibold mb-3">
            <Sparkles size={13} />
            <span>Storefront live</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Your loyalty program is live
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
            Customer activity will appear here after customers begin earning and redeeming points. Here are your completed foundations and recommended next steps to drive shopper engagement.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={onExploreDashboard}
              className="text-xs h-8 gap-1.5"
            >
              <span>Explore dashboard</span>
              <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Required steps completed */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] tracking-tight">
              Completed core setup
            </h3>
            <span className="text-xs font-semibold text-[var(--secondary)] bg-[var(--secondary-container)] px-2 py-0.5 rounded-full">
              4 of 4 completed
            </span>
          </div>

          <div className="space-y-3">
            {checklist.requiredSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[var(--muted)]/40 border border-[var(--border)]/70"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-[var(--secondary)] shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--foreground)]">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                      {step.explanation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onStepAction(step.id)}
                  className="text-[11px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] shrink-0 cursor-pointer"
                >
                  {step.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended next steps */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--foreground)] tracking-tight">
              Recommended next steps
            </h3>
            <span className="text-xs font-medium text-[var(--muted-foreground)]">
              Optional growth actions
            </span>
          </div>

          <div className="space-y-3">
            {checklist.optionalSteps.map((step) => (
              <div
                key={step.id}
                className="flex items-start justify-between gap-3 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:border-[var(--ring)] transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <Circle
                    size={15}
                    className="text-[var(--muted-foreground)] shrink-0 mt-0.5"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--foreground)]">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                      {step.explanation}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStepAction(step.id)}
                  className="h-7 px-2 text-xs font-medium text-[var(--primary)] shrink-0"
                >
                  {step.actionLabel}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

