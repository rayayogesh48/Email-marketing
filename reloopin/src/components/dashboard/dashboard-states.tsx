"use client";

import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Lock,
  RefreshCw,
  Unplug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardSkeletons() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard">
      {/* Summary Skeleton */}
      <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2">
        <div className="h-4 w-48 bg-[var(--muted)] rounded" />
        <div className="h-3 w-96 bg-[var(--muted)] rounded" />
      </div>

      {/* 4 KPI Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-3"
          >
            <div className="h-3.5 w-24 bg-[var(--muted)] rounded" />
            <div className="h-7 w-28 bg-[var(--muted)] rounded" />
            <div className="h-3 w-32 bg-[var(--muted)] rounded" />
          </div>
        ))}
      </div>

      {/* Two Medium Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] h-72 space-y-4">
          <div className="h-4 w-32 bg-[var(--muted)] rounded" />
          <div className="h-48 w-full bg-[var(--muted)]/50 rounded" />
        </div>
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] h-72 space-y-4">
          <div className="h-4 w-40 bg-[var(--muted)] rounded" />
          <div className="h-48 w-full bg-[var(--muted)]/50 rounded" />
        </div>
      </div>

      {/* Lists Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] h-64 space-y-3">
          <div className="h-4 w-36 bg-[var(--muted)] rounded" />
          <div className="h-10 w-full bg-[var(--muted)]/40 rounded" />
          <div className="h-10 w-full bg-[var(--muted)]/40 rounded" />
          <div className="h-10 w-full bg-[var(--muted)]/40 rounded" />
        </div>
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] h-64 space-y-3">
          <div className="h-4 w-36 bg-[var(--muted)] rounded" />
          <div className="h-10 w-full bg-[var(--muted)]/40 rounded" />
          <div className="h-10 w-full bg-[var(--muted)]/40 rounded" />
          <div className="h-10 w-full bg-[var(--muted)]/40 rounded" />
        </div>
      </div>
    </div>
  );
}

export function StoreDisconnectedState({
  storeName,
  onReconnect,
}: {
  storeName: string;
  onReconnect: () => void;
}) {
  return (
    <div className="py-16 px-4 max-w-xl mx-auto text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-[var(--destructive-container)] text-[var(--destructive)] flex items-center justify-center mb-4 shadow-xs">
        <Unplug size={28} />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
        Reconnect your store to update the dashboard
      </h2>
      <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
        Reloopin cannot sync customer, order, or loyalty activity while {storeName} is disconnected. Reconnecting takes under 30 seconds.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="default"
          onClick={onReconnect}
          className="text-xs h-9 px-4 gap-2"
        >
          <RefreshCw size={14} />
          <span>Reconnect store</span>
        </Button>
        <Button variant="outline" className="text-xs h-9 px-4" asChild>
          <Link href="/settings#integrations">View integration settings</Link>
        </Button>
      </div>
    </div>
  );
}

export function PageErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-16 px-4 max-w-md mx-auto text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-xl bg-[var(--destructive-container)] text-[var(--destructive)] flex items-center justify-center mb-3">
        <AlertCircle size={24} />
      </div>

      <h2 className="text-lg font-bold text-[var(--foreground)]">
        Dashboard could not be loaded
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
        We couldn&apos;t retrieve your dashboard data. Try refreshing the page.
      </p>

      <Button
        variant="default"
        size="sm"
        onClick={onRetry}
        className="mt-5 text-xs h-8 px-4"
      >
        Try again
      </Button>
    </div>
  );
}

export function RestrictedAccessState() {
  return (
    <div className="py-16 px-4 max-w-md mx-auto text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center mb-3">
        <Lock size={24} />
      </div>

      <h2 className="text-lg font-bold text-[var(--foreground)]">
        You don&apos;t have access to the dashboard
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
        Ask the account owner or administrator for permission to view merchant metrics.
      </p>

      <Button variant="outline" size="sm" asChild className="mt-5 text-xs h-8 px-4">
        <Link href="/">Back to account</Link>
      </Button>
    </div>
  );
}

export function SectionErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--destructive)]/30 text-center flex flex-col items-center justify-center min-h-[220px]">
      <AlertTriangle size={20} className="text-[var(--destructive)] mb-2" />
      <h4 className="text-xs font-semibold text-[var(--foreground)]">
        Couldn&apos;t load this section
      </h4>
      <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xs">
        An error occurred while calculating points activity.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="mt-3 text-xs h-7 px-3"
      >
        Try again
      </Button>
    </div>
  );
}

export function OnboardingIncompleteBanner({
  onContinueSetup,
}: {
  onContinueSetup: () => void;
}) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-[var(--warning-container)]/30 border border-[var(--warning)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="text-[var(--warning)] shrink-0 mt-0.5" />
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">
            Finish setting up your loyalty program
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Complete the remaining steps before customers can fully earn and redeem points. <strong>2 of 4 required steps completed</strong>.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="default"
          size="sm"
          onClick={onContinueSetup}
          className="text-xs h-7 px-3 bg-[var(--warning)] hover:bg-[var(--warning)]/90 text-black font-semibold"
        >
          <span>Continue setup</span>
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
}

export function StaleDataBanner({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-[var(--warning-container)]/30 border border-[var(--warning)]/30 flex items-center justify-between text-xs">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-[var(--warning)] shrink-0" />
        <span className="text-[var(--foreground)]">
          <strong>Dashboard data may be outdated:</strong> The latest store sync has not finished. These results were last updated 6 hours ago.
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          className="font-semibold text-[var(--primary)] hover:underline cursor-pointer"
        >
          Refresh
        </button>
        <span className="text-[var(--muted-foreground)]">·</span>
        <Link href="/settings#integrations" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          View integration
        </Link>
      </div>
    </div>
  );
}

export function NoLoyaltyActivityBanner({
  onExpandRange,
}: {
  onExpandRange: () => void;
}) {
  return (
    <div className="mb-4 p-3 rounded-lg bg-[var(--info-container)]/30 border border-[var(--info)]/30 flex items-center justify-between text-xs">
      <span className="text-[var(--foreground)]">
        <strong>No loyalty activity during this period:</strong> Try a wider date range or review your earning rules.
      </span>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onExpandRange}
          className="font-semibold text-[var(--primary)] hover:underline cursor-pointer"
        >
          Last 90 days
        </button>
        <span className="text-[var(--muted-foreground)]">·</span>
        <Link href="/points" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          View earning rules
        </Link>
      </div>
    </div>
  );
}

