"use client";

import { useState } from "react";
import {
  PlatformDefinition,
  StoreOption,
  ConnectionOutcome,
  ConnectionTestResult,
  IntegrationRecord,
} from "@/lib/integrations/integrations-types";
import { PLATFORMS_CATALOG } from "@/lib/integrations/integrations-data";
import { PlatformSelector } from "./platform-selector";
import { PlatformConnectionForms, FormValues } from "./platform-connection-forms";
import { ConnectionTestModal } from "./connection-test-modal";
import { IntegrationReviewStep } from "./integration-review-step";
import { Check, ChevronRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddIntegrationFlow({
  stores,
  existingIntegrations,
  onAddIntegration,
  onSwitchStore,
}: {
  stores: StoreOption[];
  existingIntegrations: { id: string; name: string }[];
  onAddIntegration: (record: Partial<IntegrationRecord>) => IntegrationRecord;
  onSwitchStore?: (storeId: string) => void;
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformDefinition | null>(
    PLATFORMS_CATALOG[0] || null,
  );
  const [formValues, setFormValues] = useState<FormValues | null>(null);

  // Test modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testOutcome, setTestOutcome] = useState<ConnectionOutcome>("success");
  const [testResult, setTestResult] = useState<ConnectionTestResult | undefined>(undefined);

  const steps = [
    { number: 1, label: "Choose platform" },
    { number: 2, label: "Connect" },
    { number: 3, label: "Review" },
  ];

  const handleSelectPlatform = (platform: PlatformDefinition) => {
    setSelectedPlatform(platform);
    setCurrentStep(2);
  };

  const handleTestConnection = (
    values: FormValues,
    outcome: ConnectionOutcome = "success",
  ) => {
    setFormValues(values);
    setTestOutcome(outcome);
    setIsTestModalOpen(true);
  };

  const handleProceedFromForm = (values: FormValues) => {
    setFormValues(values);
    setCurrentStep(3);
  };

  const handleProceedToReview = (result: ConnectionTestResult) => {
    setTestResult(result);
    setIsTestModalOpen(false);
    setCurrentStep(3);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Top Breadcrumb & Exit link */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <button
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
            } else {
              router.push("/integrations");
            }
          }}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={14} />
          {currentStep === 1 ? "Back to integrations" : "Back"}
        </button>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    isCurrent
                      ? "bg-[var(--primary)] text-white"
                      : isCompleted
                      ? "bg-[var(--muted)] text-[var(--foreground)] font-semibold"
                      : "text-[var(--muted-foreground)] opacity-60"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={12} className="text-[var(--success,#16a34a)]" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ChevronRight size={13} className="text-[var(--muted-foreground)] opacity-40" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Step Content */}
      <div className="pt-2">
        {currentStep === 1 && (
          <PlatformSelector
            selectedPlatform={selectedPlatform?.id || null}
            onSelectPlatform={handleSelectPlatform}
          />
        )}

        {currentStep === 2 && selectedPlatform && (
          <PlatformConnectionForms
            platform={selectedPlatform}
            stores={stores}
            existingIntegrations={existingIntegrations}
            initialValues={formValues || undefined}
            onTestConnection={handleTestConnection}
            onProceed={handleProceedFromForm}
          />
        )}

        {currentStep === 3 && selectedPlatform && formValues && (
          <IntegrationReviewStep
            platform={selectedPlatform}
            values={formValues}
            testResult={testResult}
            onBack={() => setCurrentStep(2)}
            onComplete={onAddIntegration}
            onSwitchStore={onSwitchStore}
          />
        )}
      </div>

      {/* Connection Test Simulation Modal */}
      <ConnectionTestModal
        open={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        outcome={testOutcome}
        onProceedToReview={handleProceedToReview}
      />
    </div>
  );
}
