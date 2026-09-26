"use client";

import { Button } from "@/components/ui/button";
import { Plus, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

export function IntegrationsHeader({
  onOpenAPISettings,
}: {
  onOpenAPISettings: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Integrations
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Connect stores and channels to keep customer, order, and loyalty data in sync.
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAPISettings}
          className="text-xs flex items-center gap-1.5"
          data-testid="api-settings-button"
        >
          <KeyRound size={13} className="text-[var(--muted-foreground)]" />
          API settings
        </Button>

        <Button
          size="sm"
          onClick={() => router.push("/integrations/new")}
          className="text-xs flex items-center gap-1.5"
          data-testid="add-integration-button"
        >
          <Plus size={14} />
          Add integration
        </Button>
      </div>
    </div>
  );
}
