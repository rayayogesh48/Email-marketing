"use client";

import { AlertTriangle, Lock, WifiOff, Clock, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ReadOnlyNotice() {
  return (
    <div className="p-3.5 mb-6 rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 flex items-start gap-3 text-xs">
      <Lock size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
      <div>
        <strong className="font-semibold text-[var(--foreground)] block">
          You have view-only access
        </strong>
        <p className="text-[var(--muted-foreground)] mt-0.5">
          Ask an Owner or Admin if you need permission to make changes.
        </p>
      </div>
    </div>
  );
}

export function RestrictedAccessState({ onBack }: { onBack?: () => void }) {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] flex items-center justify-center mx-auto mb-4">
        <Lock size={22} />
      </div>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        You don’t have access to this setting
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 mb-6">
        Ask the account owner or administrator for permission to view this section.
      </p>
      {onBack ? (
        <Button variant="outline" size="sm" onClick={onBack} className="text-xs">
          <ArrowLeft size={13} className="mr-1.5" /> Back to dashboard
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild className="text-xs">
          <Link href="/dashboard">
            <ArrowLeft size={13} className="mr-1.5" /> Back to dashboard
          </Link>
        </Button>
      )}
    </div>
  );
}

export function OfflineNotice() {
  return (
    <div className="p-3.5 mb-6 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 flex items-start gap-3 text-xs text-[var(--destructive)]">
      <WifiOff size={16} className="shrink-0 mt-0.5" />
      <div>
        <strong className="font-semibold block">You’re offline</strong>
        <p className="mt-0.5 opacity-90">
          Reconnect before saving your changes. Prototype changes are held locally.
        </p>
      </div>
    </div>
  );
}

export function SessionExpiredNotice({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="p-4 mb-6 rounded-xl border border-[var(--warning,#f59e0b)]/40 bg-[var(--warning,#f59e0b)]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-3">
        <Clock size={16} className="text-[var(--warning,#f59e0b)] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[var(--foreground)] block">
            Your session has expired
          </strong>
          <p className="text-[var(--muted-foreground)] mt-0.5">
            Sign in again to continue. Your uncommitted form values will be preserved.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="default"
        size="sm"
        onClick={onSignIn}
        className="text-xs shrink-0"
      >
        Sign in again
      </Button>
    </div>
  );
}

export function PageErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={22} />
      </div>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Settings could not be loaded
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 mb-6">
        We couldn’t retrieve your account settings. Check your connection or retry.
      </p>
      <Button variant="default" size="sm" onClick={onRetry} className="text-xs">
        <RefreshCw size={13} className="mr-1.5" /> Try again
      </Button>
    </div>
  );
}

export function SectionErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-6 rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 text-center my-6">
      <AlertTriangle size={20} className="text-[var(--destructive)] mx-auto mb-2" />
      <h3 className="text-sm font-semibold text-[var(--foreground)]">
        Couldn’t load this section
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] mt-1 mb-4">
        An error occurred while loading settings for this section.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
        <RefreshCw size={13} className="mr-1.5" /> Try again
      </Button>
    </div>
  );
}

export function DisconnectedStoreBanner({
  storeName,
  onReconnect,
}: {
  storeName: string;
  onReconnect: () => void;
}) {
  return (
    <div className="p-3.5 mb-6 rounded-xl border border-[var(--warning,#f59e0b)]/40 bg-[var(--warning,#f59e0b)]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-3">
        <AlertTriangle size={16} className="text-[var(--warning,#f59e0b)] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[var(--foreground)] block">
            Store information may be outdated
          </strong>
          <p className="text-[var(--muted-foreground)] mt-0.5">
            <strong>{storeName}</strong> is disconnected. Reconnect the store to update synced information.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReconnect}
        className="text-xs shrink-0 text-[var(--warning,#f59e0b)] border-[var(--warning,#f59e0b)]/40 hover:bg-[var(--warning,#f59e0b)]/10"
      >
        Reconnect store
      </Button>
    </div>
  );
}

export function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-2xl">
      <div className="space-y-2">
        <div className="h-5 w-40 bg-[var(--muted)] rounded-md" />
        <div className="h-4 w-72 bg-[var(--muted)]/70 rounded-md" />
      </div>

      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-4">
        <div className="h-4 w-32 bg-[var(--muted)] rounded-md" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-9 bg-[var(--muted)] rounded-lg" />
          <div className="h-9 bg-[var(--muted)] rounded-lg" />
        </div>
        <div className="h-9 bg-[var(--muted)] rounded-lg" />
      </div>

      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-4">
        <div className="h-4 w-44 bg-[var(--muted)] rounded-md" />
        <div className="h-9 bg-[var(--muted)] rounded-lg" />
      </div>
    </div>
  );
}
