"use client";

import { ReactNode } from "react";
import { SectionErrorCard } from "./analytics-states";

export function ChartCard({
  title,
  children,
  action,
  heroValue,
  isError = false,
  onRetry,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  icon?: unknown;
  heroValue?: string;
  heroSubtitle?: string;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}) {
  if (isError) {
    return <SectionErrorCard title={title} onRetry={onRetry} />;
  }

  return (
    <section
      className={`bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xs flex flex-col overflow-hidden ${className}`}
      aria-label={title}
    >
      {/* Clean Card Header Bar (No icons, no unwanted sub-text) */}
      <div className="flex h-12 items-center justify-between border-b border-[var(--border)] px-4 sm:px-5">
        <h2 className="text-sm font-semibold tracking-tight text-[var(--foreground)] truncate">
          {title}
        </h2>

        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {heroValue && (
          <div className="mb-3">
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] tabular-nums">
              {heroValue}
            </p>
          </div>
        )}

        <div className="w-full flex-1 flex flex-col justify-center">{children}</div>
      </div>
    </section>
  );
}

