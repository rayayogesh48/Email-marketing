"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Loader2 } from "lucide-react";

export function DirtyFormActionBar({
  isDirty,
  isSaving,
  isSaved,
  saveText = "Save changes",
  onCancel,
  onSave,
}: {
  isDirty: boolean;
  isSaving?: boolean;
  isSaved?: boolean;
  saveText?: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  if (!isDirty && !isSaving && !isSaved) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 py-3 shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-200"
      role="region"
      aria-label="Unsaved changes bar"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
              <Loader2 size={14} className="animate-spin text-[var(--primary)]" />
              Saving changes...
            </span>
          ) : isSaved ? (
            <span className="flex items-center gap-1.5 text-xs text-[var(--success,#10b981)] font-medium">
              <Check size={14} />
              Changes saved
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-[var(--foreground)] font-medium">
              <AlertCircle size={14} className="text-[var(--warning,#f59e0b)]" />
              Careful — you have unsaved changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs min-w-[90px]"
            data-testid="dirty-bar-save-button"
          >
            {isSaving ? "Saving..." : saveText}
          </Button>
        </div>
      </div>
    </div>
  );
}
