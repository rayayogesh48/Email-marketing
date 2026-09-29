"use client";

import { AlertTriangle, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl">
      <div className="space-y-2">
        <div className="h-6 w-48 bg-[var(--muted)] rounded-md" />
        <div className="h-4 w-80 bg-[var(--muted)]/70 rounded-md" />
      </div>

      <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)] space-y-4">
        <div className="h-5 w-40 bg-[var(--muted)] rounded-md" />
        <div className="h-8 w-32 bg-[var(--muted)] rounded-md" />
        <div className="h-4 w-72 bg-[var(--muted)]/60 rounded-md" />
      </div>

      <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card)] space-y-4">
        <div className="h-5 w-36 bg-[var(--muted)] rounded-md" />
        <div className="space-y-3">
          <div className="h-4 bg-[var(--muted)] rounded-md" />
          <div className="h-3 bg-[var(--muted)]/50 rounded-full" />
          <div className="h-4 bg-[var(--muted)] rounded-md" />
          <div className="h-3 bg-[var(--muted)]/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BillingErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-12 px-6 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] flex items-center justify-center mx-auto mb-4">
        <AlertTriangle size={22} />
      </div>
      <h2 className="text-base font-semibold text-[var(--foreground)]">
        Billing could not be loaded
      </h2>
      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 mb-6">
        We couldn’t retrieve your subscription details. Check your connection or retry.
      </p>
      <Button variant="default" size="sm" onClick={onRetry} className="text-xs">
        <RefreshCw size={13} className="mr-1.5" /> Try again
      </Button>
    </div>
  );
}

export function BillingPermissionNotice() {
  return (
    <div className="p-3.5 mb-6 rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 flex items-start gap-3 text-xs">
      <Lock size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
      <div>
        <strong className="font-semibold text-[var(--foreground)] block">
          You have view-only billing access
        </strong>
        <p className="text-[var(--muted-foreground)] mt-0.5">
          Only the account owner or billing admin can change the subscription or payment methods.
        </p>
      </div>
    </div>
  );
}
