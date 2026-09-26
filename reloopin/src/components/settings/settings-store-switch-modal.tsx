"use client";

import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SettingsStoreSwitchModal({
  isOpen,
  currentStoreName,
  targetStoreName,
  onKeepEditing,
  onDiscardAndSwitch,
}: {
  isOpen: boolean;
  currentStoreName: string;
  targetStoreName: string;
  onKeepEditing: () => void;
  onDiscardAndSwitch: () => void;
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onKeepEditing}
      title="Switch stores without saving?"
      description={`Your unsaved changes for ${currentStoreName} will be lost if you switch to ${targetStoreName}.`}
    >
      <div className="space-y-4 pt-2">
        <p className="text-xs text-[var(--muted-foreground)]">
          Discard uncommitted updates and load the configuration for <strong className="text-[var(--foreground)]">{targetStoreName}</strong>?
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onKeepEditing}
            className="text-xs"
          >
            Keep editing
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDiscardAndSwitch}
            className="text-xs"
            data-testid="discard-and-switch-button"
          >
            Discard and switch
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function SettingsLeavePageModal({
  isOpen,
  onContinueEditing,
  onLeaveWithoutSaving,
}: {
  isOpen: boolean;
  onContinueEditing: () => void;
  onLeaveWithoutSaving: () => void;
}) {
  return (
    <Modal
      open={isOpen}
      onClose={onContinueEditing}
      title="Leave without saving?"
      description="Your latest settings changes have not been saved and will be discarded."
    >
      <div className="space-y-4 pt-2">
        <p className="text-xs text-[var(--muted-foreground)]">
          Are you sure you want to navigate away? Unsaved modifications will be reverted.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onContinueEditing}
            className="text-xs"
          >
            Continue editing
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onLeaveWithoutSaving}
            className="text-xs"
            data-testid="confirm-leave-button"
          >
            Leave without saving
          </Button>
        </div>
      </div>
    </Modal>
  );
}
