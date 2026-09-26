"use client";

import { Button } from "@/components/ui/button";
import {
  Plug,
  Search,
  Filter,
  AlertTriangle,
  ShieldAlert,
  Layers,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function IntegrationsEmptyState({
  onAddIntegration,
}: {
  onAddIntegration: () => void;
}) {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto border border-dashed border-[var(--border)] rounded-2xl bg-[var(--card)] my-6">
      <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4 text-[var(--primary)]">
        <Plug size={24} />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1.5">
        Connect your first platform
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-6">
        Add a store or channel to start syncing customer, order, and loyalty data.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={onAddIntegration} className="w-full sm:w-auto">
          Add integration
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            window.open("https://reloopin.com/integrations-guide", "_blank");
          }}
          className="w-full sm:w-auto"
        >
          Learn about integrations
        </Button>
      </div>
    </div>
  );
}

export function SearchNoResultsState({
  onClearSearch,
}: {
  onClearSearch: () => void;
}) {
  return (
    <div className="py-12 px-4 text-center max-w-sm mx-auto border border-[var(--border)] rounded-xl bg-[var(--card)] my-6">
      <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-3 text-[var(--muted-foreground)]">
        <Search size={18} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
        No matching integrations
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
        Try another name, platform, or category.
      </p>
      <Button variant="outline" size="sm" onClick={onClearSearch}>
        Clear search
      </Button>
    </div>
  );
}

export function FilterNoResultsState({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) {
  return (
    <div className="py-12 px-4 text-center max-w-sm mx-auto border border-[var(--border)] rounded-xl bg-[var(--card)] my-6">
      <div className="w-10 h-10 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-3 text-[var(--muted-foreground)]">
        <Filter size={18} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
        No integrations match these filters
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
        Change or clear the filters to see your integrations.
      </p>
      <Button variant="outline" size="sm" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}

export function PageErrorState({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <div className="py-14 px-6 text-center max-w-md mx-auto border border-[var(--border)] rounded-2xl bg-[var(--card)] my-8">
      <div className="w-12 h-12 rounded-xl bg-[var(--color-destructive-container,rgba(239,68,68,0.1))] flex items-center justify-center mx-auto mb-4 text-[var(--destructive)]">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1.5">
        Integrations could not be loaded
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-6">
        We couldn’t retrieve your connected platforms. Try refreshing the page.
      </p>
      <Button onClick={onRetry} className="inline-flex items-center gap-2">
        <RefreshCw size={14} />
        Try again
      </Button>
    </div>
  );
}

export function RestrictedAccessState() {
  const router = useRouter();
  return (
    <div className="py-14 px-6 text-center max-w-md mx-auto border border-[var(--border)] rounded-2xl bg-[var(--card)] my-8">
      <div className="w-12 h-12 rounded-xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4 text-[var(--warning,#d97706)]">
        <ShieldAlert size={24} />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)] mb-1.5">
        You don’t have access to integrations
      </h3>
      <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-6">
        Ask the account owner or administrator for integration permission.
      </p>
      <Button variant="outline" onClick={() => router.push("/dashboard")}>
        Back to dashboard
      </Button>
    </div>
  );
}

export function IntegrationLimitReachedState({
  onManage,
}: {
  onManage: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-[var(--color-warning-bg,rgba(234,179,8,0.2))] bg-[var(--color-warning-bg,rgba(234,179,8,0.06))] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <Layers size={18} className="text-[var(--warning,#d97706)] mt-0.5 shrink-0" />
        <div>
          <h4 className="text-xs font-semibold text-[var(--foreground)]">
            Integration limit reached
          </h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Your current plan supports up to 2 store integrations.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onManage}>
          Manage integrations
        </Button>
        <Button
          size="sm"
          onClick={() => {
            alert("Upgrade Plan modal opened");
          }}
        >
          View plans
        </Button>
      </div>
    </div>
  );
}
