"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Wrench,
  RotateCcw,
  PlusCircle,
  Trash2,
  AlertOctagon,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";

export interface StatePreset {
  id: string;
  name: string;
  description: string;
  targetPath?: string;
  queryParam: string;
}

export function PreviewStatesDrawer({
  onResetDemo,
  onAddSampleIntegrations,
  onClearIntegrations,
  onSimulateError,
}: {
  onResetDemo: () => void;
  onAddSampleIntegrations: () => void;
  onClearIntegrations: () => void;
  onSimulateError: () => void;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentState = searchParams.get("state") || "default";

  const stateGroups: { title: string; states: StatePreset[] }[] = [
    {
      title: "Integration list",
      states: [
        {
          id: "default",
          name: "Default (Populated)",
          description: "All active integrations loaded with KPI statistics",
          targetPath: "/integrations",
          queryParam: "state=default",
        },
        {
          id: "loading",
          name: "Loading skeletons",
          description: "Data loading layout with skeleton placeholders",
          targetPath: "/integrations",
          queryParam: "state=loading",
        },
        {
          id: "empty",
          name: "Empty state",
          description: "Zero integrations connected with onboarding prompt",
          targetPath: "/integrations",
          queryParam: "state=empty",
        },
        {
          id: "search_empty",
          name: "Search no results",
          description: "Empty search query result with clear search CTA",
          targetPath: "/integrations",
          queryParam: "state=search_empty",
        },
        {
          id: "filter_empty",
          name: "Filter no results",
          description: "Category or status filter returned zero records",
          targetPath: "/integrations",
          queryParam: "state=filter_empty",
        },
        {
          id: "page_error",
          name: "Page error",
          description: "Network or platform fetch failure with retry action",
          targetPath: "/integrations",
          queryParam: "state=page_error",
        },
        {
          id: "restricted",
          name: "Restricted access",
          description: "Missing permissions to view integrations module",
          targetPath: "/integrations",
          queryParam: "state=restricted",
        },
        {
          id: "limit_reached",
          name: "Integration limit reached",
          description: "Account store limit reached banner with upgrade CTA",
          targetPath: "/integrations",
          queryParam: "state=limit_reached",
        },
      ],
    },
    {
      title: "Connection & testing",
      states: [
        {
          id: "platform_selection",
          name: "Platform selection",
          description: "Step 1 catalog of stores, POS, social, and review apps",
          targetPath: "/integrations/new",
          queryParam: "step=choose",
        },
        {
          id: "test_success",
          name: "Test success",
          description: "Connection test modal: all 5 access permissions verified",
          targetPath: "/integrations/new",
          queryParam: "test=success",
        },
        {
          id: "partial_access",
          name: "Partial access",
          description: "Connection test modal: product catalog access limited",
          targetPath: "/integrations/new",
          queryParam: "test=partial_access",
        },
        {
          id: "auth_failed",
          name: "Authentication failed",
          description: "Connection test modal: invalid client credentials",
          targetPath: "/integrations/new",
          queryParam: "test=auth_failed",
        },
        {
          id: "url_unavailable",
          name: "URL unavailable",
          description: "Connection test modal: platform endpoint unreachable",
          targetPath: "/integrations/new",
          queryParam: "test=url_unavailable",
        },
        {
          id: "permission_missing",
          name: "Missing permission",
          description: "Connection test modal: OAuth customer scope missing",
          targetPath: "/integrations/new",
          queryParam: "test=permission_missing",
        },
        {
          id: "timeout",
          name: "Timeout",
          description: "Connection test modal: gateway response timeout",
          targetPath: "/integrations/new",
          queryParam: "test=timeout",
        },
        {
          id: "rate_limit",
          name: "Rate limit",
          description: "Connection test modal: too many test attempts",
          targetPath: "/integrations/new",
          queryParam: "test=rate_limit",
        },
      ],
    },
    {
      title: "Integration status & detail",
      states: [
        {
          id: "detail_overview",
          name: "Detail: Overview",
          description: "Northstar Shopify Store overview with data capabilities",
          targetPath: "/integrations/shopify-northstar",
          queryParam: "tab=overview",
        },
        {
          id: "detail_sync",
          name: "Detail: Data sync",
          description: "Live sync table, progress indicator, and error ledger",
          targetPath: "/integrations/shopify-northstar",
          queryParam: "tab=sync",
        },
        {
          id: "detail_sync_issues",
          name: "Detail: Sync issues",
          description: "Urban Goods WooCommerce with pending record errors",
          targetPath: "/integrations/woocommerce-urban",
          queryParam: "tab=sync",
        },
        {
          id: "detail_credentials",
          name: "Detail: Credentials",
          description: "Masked secrets vault, replace, rotate, and revoke",
          targetPath: "/integrations/shopify-northstar",
          queryParam: "tab=credentials",
        },
        {
          id: "detail_activity",
          name: "Detail: Audit activity",
          description: "Chronological event timeline with results and actors",
          targetPath: "/integrations/shopify-northstar",
          queryParam: "tab=activity",
        },
      ],
    },
  ];

  const handleSelectState = (preset: StatePreset) => {
    const target = preset.targetPath || pathname;
    const url = `${target}?${preset.queryParam}`;
    router.push(url);
    setOpen(false);
    toast.info(`Switched to preview state: ${preset.name}`);
  };

  return (
    <>
      {/* Floating Button fixed at bottom-left */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 left-6 z-40 flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-full bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-md hover:bg-[var(--muted)] hover:border-[var(--ring)] transition-all cursor-pointer group"
        data-testid="preview-states-button"
        title="Open Onboarding & Integration states"
      >
        <Wrench size={14} className="text-[var(--primary)] group-hover:rotate-45 transition-transform" />
        <span>Preview states</span>
      </button>

      {/* Slide-over Side Drawer */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        side={true}
        title="Integration states"
        description="Open any screen or system state for design and development review."
      >
        <div className="py-4 space-y-6 text-xs overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
          {/* Quick Demo Utilities Bar */}
          <div className="p-3.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] block">
              Quick demo actions
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onResetDemo();
                  router.push("/integrations");
                  setOpen(false);
                  toast.success("Demo reset to default integrations");
                }}
                className="text-[11px] h-8 justify-start"
              >
                <RotateCcw size={12} className="mr-1.5" />
                Reset demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onAddSampleIntegrations();
                  router.push("/integrations");
                  setOpen(false);
                  toast.success("Added Square POS & Custom API integrations");
                }}
                className="text-[11px] h-8 justify-start"
              >
                <PlusCircle size={12} className="mr-1.5" />
                Add samples
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClearIntegrations();
                  router.push("/integrations?state=empty");
                  setOpen(false);
                  toast.info("Cleared all integrations (Empty state)");
                }}
                className="text-[11px] h-8 justify-start"
              >
                <Trash2 size={12} className="mr-1.5" />
                Clear all
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onSimulateError();
                  router.push("/integrations?state=page_error");
                  setOpen(false);
                  toast.error("Simulated page error state");
                }}
                className="text-[11px] h-8 justify-start"
              >
                <AlertOctagon size={12} className="mr-1.5" />
                Simulate error
              </Button>
            </div>
          </div>

          {/* Grouped State Presets */}
          {stateGroups.map((group) => (
            <div key={group.title} className="space-y-2.5">
              <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider">
                {group.title}
              </h4>
              <div className="space-y-1.5">
                {group.states.map((preset) => {
                  const isSelected = currentState === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectState(preset)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start justify-between gap-2.5 ${
                        isSelected
                          ? "bg-[var(--card)] border-[var(--primary)] shadow-xs"
                          : "bg-[var(--card)]/60 border-[var(--border)] hover:bg-[var(--muted)]/50 cursor-pointer"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[var(--foreground)] block">
                          {preset.name}
                        </span>
                        <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-[var(--primary)] shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
