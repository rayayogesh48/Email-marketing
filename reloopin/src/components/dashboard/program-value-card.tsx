"use client";

import { HelpCircle, ArrowRight, AlertCircle } from "lucide-react";
import { DashboardProgramValue } from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProgramValueCard({
  programValue,
  onOpenMethodology,
}: {
  programValue: DashboardProgramValue;
  onOpenMethodology: () => void;
}) {
  if (!programValue.isAvailable) {
    return (
      <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
            Estimated program value
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Attributed incremental revenue and return on program spend.
          </p>

          <div className="mt-8 p-6 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-center flex flex-col items-center">
            <div className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-2">
              <AlertCircle size={20} />
            </div>
            <h4 className="text-xs font-semibold text-[var(--foreground)]">
              Program value is not available yet
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm leading-relaxed">
              We need more order and loyalty activity before estimating the program&apos;s financial impact.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs h-7 rounded-md"
              asChild
            >
              <Link href="/settings">Review loyalty settings</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate percentages for proportional bar
  const totalBar = programValue.incrementalRevenue + programValue.programCost;
  const revPct = Math.round((programValue.incrementalRevenue / totalBar) * 100);
  const costPct = 100 - revPct;

  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
              Estimated program value
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Attributed revenue and return on investment.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenMethodology}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] inline-flex items-center gap-1 cursor-pointer transition-colors"
            aria-label="How this is calculated"
          >
            <HelpCircle size={13} />
            <span className="hidden sm:inline">Methodology</span>
          </button>
        </div>

        {/* Hero Return Multiple Statement */}
        <div className="p-3.5 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] my-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">
              Return multiple
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
              {programValue.returnMultiple}x
            </span>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {programValue.summary}
          </p>
        </div>

        {/* Proportional Comparison Bar */}
        <div className="my-4">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#c026d3]">
              Attributed revenue: ${programValue.incrementalRevenue.toLocaleString()}
            </span>
            <span className="text-[#d97706]">
              Cost: ${programValue.programCost.toLocaleString()}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[var(--muted)] overflow-hidden flex">
            <div
              style={{ width: `${revPct}%` }}
              className="bg-[#c026d3] h-full transition-all"
              title={`Attributed revenue: ${revPct}%`}
            />
            <div
              style={{ width: `${costPct}%` }}
              className="bg-[#d97706] h-full transition-all"
              title={`Program cost: ${costPct}%`}
            />
          </div>
        </div>

        {/* Ledger Breakdown Lines */}
        <div className="space-y-2 pt-2 border-t border-[var(--border)] text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--muted-foreground)]">
              Estimated incremental revenue
            </span>
            <span className="font-semibold tabular-nums text-[#c026d3]">
              +${programValue.incrementalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--muted-foreground)]">
              Total program cost
            </span>
            <span className="font-semibold tabular-nums text-[#d97706]">
              -${programValue.programCost.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-t border-dashed border-[var(--border)]">
            <span className="font-semibold text-[var(--foreground)]">
              Estimated net value
            </span>
            <span className="font-bold tabular-nums text-[var(--secondary)] text-sm">
              +${programValue.netValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-[var(--muted-foreground)]/80 mt-3 italic leading-relaxed">
          These values are estimates and should be used as directional insights, not audited financial results.
        </p>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <button
          type="button"
          onClick={onOpenMethodology}
          className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
        >
          How this is calculated
        </button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-7 px-2 text-xs font-medium text-[var(--primary)] gap-1 hover:bg-[var(--primary-container)]/30"
        >
          <Link href="/analytics?tab=roi">
            <span>View Program ROI</span>
            <ArrowRight size={12} />
          </Link>
        </Button>
      </div>
    </div>
  );
}

