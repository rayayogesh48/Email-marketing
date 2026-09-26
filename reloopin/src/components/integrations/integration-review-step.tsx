"use client";

import { useState } from "react";
import {
  PlatformDefinition,
  IntegrationRecord,
  ConnectionTestResult,
} from "@/lib/integrations/integrations-types";
import { FormValues } from "./platform-connection-forms";
import { PlatformIcon } from "./platform-icon";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Check,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function IntegrationReviewStep({
  platform,
  values,
  testResult,
  onBack,
  onComplete,
  onSwitchStore,
}: {
  platform: PlatformDefinition;
  values: FormValues;
  testResult?: ConnectionTestResult;
  onBack: () => void;
  onComplete: (record: Partial<IntegrationRecord>) => IntegrationRecord;
  onSwitchStore?: (storeId: string) => void;
}) {
  const router = useRouter();
  const [submissionState, setSubmissionState] = useState<
    "idle" | "adding" | "success"
  >("idle");
  const [addingStep, setAddingStep] = useState(0);
  const [createdRecord, setCreatedRecord] = useState<IntegrationRecord | null>(null);

  const addingMilestones = [
    "Saving integration",
    "Securing credentials",
    "Preparing sync",
    platform.isStoreWorkspace ? "Creating store workspace" : "Linking channel activity",
  ];

  const handleAddIntegration = () => {
    if (submissionState !== "idle") return;

    setSubmissionState("adding");
    setAddingStep(0);

    setTimeout(() => setAddingStep(1), 400);
    setTimeout(() => setAddingStep(2), 850);
    setTimeout(() => setAddingStep(3), 1300);
    setTimeout(() => {
      const record = onComplete({
        name: values.name,
        platform: platform.id,
        platformName: platform.name,
        category: platform.category,
        isStoreWorkspace: platform.isStoreWorkspace,
        storeUrl: values.storeUrl || undefined,
        platformUrl: values.platformUrl || undefined,
        productEndpoint: values.productEndpoint || undefined,
        customerEndpoint: values.customerEndpoint || undefined,
        metadataJson: values.metadataJson || undefined,
        socialHandle: values.socialHandle || undefined,
        assignedStore: platform.isStoreWorkspace ? "Store workspace" : values.assignedStoreLabel,
        assignedStoreIds: values.assignedStoreIds,
      });
      setCreatedRecord(record);
      setSubmissionState("success");
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      {submissionState !== "success" ? (
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Review integration
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Check the connection details before adding it to your account.
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg,rgba(34,197,94,0.12))] text-[var(--success,#16a34a)] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Integration connected
          </h2>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-md mx-auto">
            <strong className="text-[var(--foreground)]">{values.name}</strong> is connected and ready to sync.
          </p>
        </div>
      )}

      {/* Adding in progress card */}
      {submissionState === "adding" && (
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-5 animate-in fade-in">
          <div className="flex items-center gap-3">
            <RefreshCw size={20} className="animate-spin text-[var(--primary)] shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Adding integration
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                We’re saving the connection and preparing the first data sync.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            {addingMilestones.map((milestone, idx) => {
              const isDone = addingStep > idx;
              const isCurrent = addingStep === idx;

              return (
                <div key={milestone} className="flex items-center justify-between text-xs py-1">
                  <span className={isCurrent ? "font-medium text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}>
                    {milestone}
                  </span>
                  {isDone ? (
                    <span className="text-[var(--success,#16a34a)] flex items-center gap-1">
                      <Check size={13} /> Complete
                    </span>
                  ) : isCurrent ? (
                    <span className="text-[var(--primary)] flex items-center gap-1 font-medium">
                      <RefreshCw size={12} className="animate-spin" /> In progress...
                    </span>
                  ) : (
                    <span className="text-[var(--muted-foreground)]/60">Waiting</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success State Card */}
      {submissionState === "success" && createdRecord && (
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-6">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Initial sync status
            </h3>
            <div className="space-y-2.5 bg-[var(--muted)]/40 p-4 rounded-xl border border-[var(--border)]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--foreground)]">Customers</span>
                <span className="text-[var(--primary)] flex items-center gap-1 font-medium">
                  <RefreshCw size={12} className="animate-spin" /> Syncing...
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--foreground)]">Products</span>
                <span className="text-[var(--muted-foreground)]">Waiting</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--foreground)]">Orders</span>
                <span className="text-[var(--muted-foreground)]">Waiting</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 border-t border-[var(--border)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/integrations")}
              className="w-full sm:w-auto"
            >
              Back to integrations
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`/integrations/${createdRecord.id}`)}
              className="w-full sm:w-auto"
              data-testid="view-integration-button"
            >
              View integration
            </Button>
            {createdRecord.isStoreWorkspace && createdRecord.workspaceStoreId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onSwitchStore && createdRecord.workspaceStoreId) {
                    onSwitchStore(createdRecord.workspaceStoreId);
                  }
                  router.push(`/dashboard?store=${createdRecord.workspaceStoreId}`);
                }}
                className="w-full sm:w-auto text-[var(--primary)]"
                data-testid="switch-to-store-button"
              >
                Switch to {createdRecord.name.replace(/\s+(Store|POS)$/i, "")}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Review Summary Card (Idle State) */}
      {submissionState === "idle" && (
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs space-y-5">
          {/* Identity preview */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-[var(--border)]">
            <PlatformIcon platform={platform.id} size={40} />
            <div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                {values.name}
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                {platform.name} · {platform.categoryLabel}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[var(--muted-foreground)] block mb-1">
                Category
              </span>
              <span className="font-medium text-[var(--foreground)] capitalize">
                {platform.category.replace("_", " ")}
              </span>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block mb-1">
                Assigned store
              </span>
              <span className="font-medium text-[var(--foreground)]">
                {platform.isStoreWorkspace ? "New store workspace" : values.assignedStoreLabel}
              </span>
            </div>

            {(values.storeUrl || values.platformUrl) && (
              <div className="sm:col-span-2">
                <span className="text-[var(--muted-foreground)] block mb-1">
                  URL / Address
                </span>
                <span className="font-medium text-[var(--foreground)] font-mono text-[11px]">
                  {values.storeUrl || values.platformUrl}
                </span>
              </div>
            )}

            <div>
              <span className="text-[var(--muted-foreground)] block mb-1">
                Data access
              </span>
              <div className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
                <span>Customers</span> · <span>Products</span> · <span>Orders</span>
              </div>
            </div>

            <div>
              <span className="text-[var(--muted-foreground)] block mb-1">
                Connection
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-[var(--success,#16a34a)]">
                <CheckCircle2 size={13} /> {testResult?.title || "Tested successfully"}
              </span>
            </div>
          </div>

          {/* Sticky Footer / Actions */}
          <div className="pt-5 border-t border-[var(--border)] flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ChevronLeft size={14} className="mr-1" />
              Back
            </Button>
            <Button
              size="sm"
              onClick={handleAddIntegration}
              className="flex items-center gap-1.5"
              data-testid="add-integration-final-button"
            >
              Add integration
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
