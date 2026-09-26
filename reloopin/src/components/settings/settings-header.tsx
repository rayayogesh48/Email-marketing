"use client";

import { StoreOption } from "@/lib/settings/settings-types";
import { availableStores } from "@/lib/settings/settings-data";
import { Store, ChevronDown } from "lucide-react";
import { Menu } from "@/components/ui/menu";

export function SettingsHeader({
  activeStoreId,
  isStoreSpecific,
  onSwitchStoreRequest,
}: {
  activeStoreId: string;
  isStoreSpecific: boolean;
  onSwitchStoreRequest: (storeId: string) => void;
}) {
  const currentStore: StoreOption =
    availableStores.find((s) => s.id === activeStoreId) || availableStores[0];

  return (
    <div className="pb-6 mb-6 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
          Manage your account, store information, team access, and notifications.
        </p>
      </div>

      {/* Active store indicator / switcher */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-xs">
          <div className="w-7 h-7 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-semibold text-xs">
            <Store size={14} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {currentStore.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)] font-medium">
                {currentStore.platform}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
            </div>
            {isStoreSpecific ? (
              <span className="text-[11px] text-[var(--primary)] font-medium block">
                Editing store settings
              </span>
            ) : (
              <span className="text-[11px] text-[var(--muted-foreground)] block">
                Account-wide setting
              </span>
            )}
          </div>

          <Menu
            label="Switch active store"
            trigger={<ChevronDown size={14} />}
            items={availableStores.map((st) => ({
              label: `${st.name} (${st.platform})`,
              action: () => onSwitchStoreRequest(st.id),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
