"use client";

import { Sparkles } from "lucide-react";

export function AnalyticsSummary({
  headline,
  subline,
  badge,
}: {
  headline: string;
  subline: string;
  badge?: string;
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 sm:p-5 mb-6 flex items-start gap-3.5 shadow-xs">
      <div className="w-8 h-8 rounded-lg bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)]">
            {headline}
          </h2>
          {badge && (
            <span className="badge font-medium text-[10px] px-2 py-0.5 rounded-full bg-[var(--primary-container)] text-[var(--primary)] border border-transparent">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
          {subline}
        </p>
      </div>
    </div>
  );
}

