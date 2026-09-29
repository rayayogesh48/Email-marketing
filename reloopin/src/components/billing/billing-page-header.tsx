"use client";

import { BillingTab, BillingPermission } from "@/lib/billing/billing-types";
import { CreditCard, Sparkles, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingPageHeader({
  activeTab,
  onTabChange,
  onViewPlans,
  permission,
}: {
  activeTab: BillingTab;
  onTabChange: (tab: BillingTab) => void;
  onViewPlans: () => void;
  permission: BillingPermission;
}) {
  const tabs: { id: BillingTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "plans", label: "Plans" },
    { id: "payment-methods", label: "Payment methods" },
    { id: "invoices", label: "Invoices" },
  ];

  return (
    <div className="pb-6 mb-8 border-b border-[var(--border)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Billing & plans
            </h1>
            {permission === "staff" && (
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                <ShieldAlert size={12} />
                View only
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Manage your subscription, usage, payment details, and invoices.
          </p>
        </div>

        {/* Primary Action - only show when not already on Plans tab */}
        {activeTab !== "plans" && (
          <Button
            onClick={onViewPlans}
            variant="outline"
            size="sm"
            className="self-start sm:self-center gap-1.5 text-xs font-medium"
          >
            <Sparkles size={14} className="text-[var(--primary)]" />
            View plans
          </Button>
        )}
      </div>

      {/* Tabs navigation */}
      <nav className="flex items-center gap-1 -mb-[1px] overflow-x-auto" aria-label="Billing sections">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
