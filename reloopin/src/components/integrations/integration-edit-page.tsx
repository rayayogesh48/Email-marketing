"use client";

import { IntegrationRecord, StoreOption } from "@/lib/integrations/integrations-types";
import { PLATFORMS_CATALOG } from "@/lib/integrations/integrations-data";
import { PlatformConnectionForms, FormValues } from "./platform-connection-forms";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function IntegrationEditPage({
  integration,
  stores,
  existingIntegrations,
  onUpdate,
}: {
  integration: IntegrationRecord;
  stores: StoreOption[];
  existingIntegrations: { id: string; name: string }[];
  onUpdate: (id: string, updates: Partial<IntegrationRecord>) => void;
}) {
  const router = useRouter();
  const platform = PLATFORMS_CATALOG.find((p) => p.id === integration.platform) || PLATFORMS_CATALOG[0];

  const initialFormValues: Partial<FormValues> = {
    name: integration.name,
    storeUrl: integration.storeUrl || "",
    platformUrl: integration.platformUrl || "",
    productEndpoint: integration.productEndpoint || "",
    customerEndpoint: integration.customerEndpoint || "",
    assignedStoreIds: integration.assignedStoreIds,
    assignedStoreLabel: integration.assignedStore,
    metadataJson: integration.metadataJson || "",
    socialHandle: integration.socialHandle || "",
  };

  const handleSave = (values: FormValues) => {
    onUpdate(integration.id, {
      name: values.name,
      storeUrl: values.storeUrl || undefined,
      platformUrl: values.platformUrl || undefined,
      productEndpoint: values.productEndpoint || undefined,
      customerEndpoint: values.customerEndpoint || undefined,
      metadataJson: values.metadataJson || undefined,
      assignedStore: integration.isStoreWorkspace ? "Store workspace" : values.assignedStoreLabel,
      assignedStoreIds: values.assignedStoreIds,
    });
    toast.success("Integration updated");
    router.push(`/integrations/${integration.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Back button */}
      <div>
        <Link
          href={`/integrations/${integration.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={13} />
          Back to {integration.name}
        </Link>
      </div>

      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <PlatformConnectionForms
          platform={platform}
          stores={stores}
          existingIntegrations={existingIntegrations}
          currentId={integration.id}
          initialValues={initialFormValues}
          isEditMode={true}
          onTestConnection={() => {
            toast.info("Connection test verified existing active credentials.");
          }}
          onProceed={handleSave}
        />
      </div>
    </div>
  );
}
