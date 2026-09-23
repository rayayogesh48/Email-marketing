"use client";

import { CheckCircle2, AlertCircle, Info, ArrowRight, HelpCircle } from "lucide-react";
import { DashboardProgramSummary } from "@/lib/dashboard/dashboard-types";
import Link from "next/link";

export function ProgramSummary({
  summary,
  onOpenMethodology,
}: {
  summary: DashboardProgramSummary;
  onOpenMethodology: () => void;
}) {
  const isPositive = summary.status === "positive";
  const isNegative = summary.status === "negative";
  const isLowData = summary.status === "low_data";

  return (
    <section
      aria-label="Loyalty program summary"
      className={`mb-6 p-4 sm:p-5 rounded-xl border transition-all ${
        isPositive
          ? "bg-[var(--card)] border-[var(--border)] shadow-2xs"
          : isNegative
          ? "bg-[var(--destructive-container)]/30 border-[var(--destructive)]/30"
          : isLowData
          ? "bg-[var(--warning-container)]/30 border-[var(--warning)]/30"
          : "bg-[var(--card)] border-[var(--border)] shadow-2xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
              isPositive
                ? "bg-[var(--secondary)]/10 text-[var(--secondary)]"
                : isNegative
                ? "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                : isLowData
                ? "bg-[var(--warning)]/10 text-[var(--warning)]"
                : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            {isPositive && <CheckCircle2 size={18} />}
            {isNegative && <AlertCircle size={18} />}
            {isLowData && <Info size={18} />}
            {!isPositive && !isNegative && !isLowData && <Info size={18} />}
          </div>

          <div>
            <h2 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
              {summary.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-0.5 leading-relaxed max-w-2xl">
              {summary.description}
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1 sm:pt-0">
          {summary.actions.map((act) => {
            if (act.actionKey === "view_methodology") {
              return (
                <button
                  key={act.label}
                  type="button"
                  onClick={onOpenMethodology}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer"
                >
                  <HelpCircle size={13} />
                  <span>{act.label}</span>
                </button>
              );
            }

            if (act.href) {
              return (
                <Link
                  key={act.label}
                  href={act.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 shadow-2xs transition-opacity"
                >
                  <span>{act.label}</span>
                  <ArrowRight size={13} />
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
}

