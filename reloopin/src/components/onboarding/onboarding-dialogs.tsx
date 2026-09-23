"use client";

import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ONBOARDING_FAQS } from "@/lib/onboarding/onboarding-data";
import { HelpCircle, AlertTriangle, RotateCcw } from "lucide-react";

export function HelpSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Onboarding Help & FAQs"
      description="Quick guidance to help you launch your loyalty program."
      side={true}
    >
      <div className="space-y-5 mt-4">
        <div className="p-4 rounded-xl bg-[var(--primary-container)]/30 border border-[var(--primary)]/30 text-xs leading-relaxed text-[var(--foreground)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--primary)] mb-1">
            <HelpCircle size={15} />
            <span>Launch in under 10 minutes</span>
          </div>
          The onboarding flow sets up the initial building blocks of your loyalty program. You can fine-tune every rule, tier, reward, and automation later from the dashboard.
        </div>

        <div className="space-y-4">
          {ONBOARDING_FAQS.map((faq, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-[var(--card)] border border-[var(--border)]"
            >
              <h4 className="text-xs font-semibold text-[var(--foreground)] mb-1.5">
                {faq.question}
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border)] flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function SaveAndExitDialog({
  open,
  onClose,
  onConfirmExit,
}: {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Leave setup for now?"
      description="Your progress is saved. You can continue from where you stopped."
    >
      <div className="space-y-4 mt-3">
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Your store connection, earning rules, VIP tiers, and custom branding choices are securely saved in your browser. When you return, Reloopin will pick up right where you left off.
        </p>

        <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
          <span className="font-semibold text-[var(--foreground)]">Note:</span> Your loyalty program will remain inactive until you complete the remaining steps and activate it.
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Continue setup
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirmExit}
            className="text-xs"
          >
            Save and exit
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function RestartSetupDialog({
  open,
  onClose,
  onConfirmRestart,
}: {
  open: boolean;
  onClose: () => void;
  onConfirmRestart: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Start setup again?"
      description="Your current onboarding progress will be cleared. Your connected store will not be disconnected."
    >
      <div className="space-y-4 mt-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--destructive-container)]/30 border border-[var(--destructive)]/30 text-xs text-[var(--destructive)]">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Caution:</span> All customized points rules, VIP tier additions, and widget branding settings will reset to initial default values.
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Keep progress
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirmRestart}
            className="text-xs bg-[var(--destructive)] hover:bg-[var(--destructive)]/90 text-[var(--destructive-foreground)] gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Start again</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function RemoveTierDialog({
  open,
  tierName,
  onClose,
  onConfirmRemove,
}: {
  open: boolean;
  tierName: string;
  onClose: () => void;
  onConfirmRemove: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Remove ${tierName || "this"} tier?`}
      description="Customers will not be assigned to this tier when the loyalty program launches."
    >
      <div className="space-y-4 mt-3">
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          Removing this tier will adjust the VIP progression. Customers with qualifying points will automatically qualify for the next eligible tier.
        </p>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Keep tier
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onConfirmRemove}
            className="text-xs bg-[var(--destructive)] hover:bg-[var(--destructive)]/90 text-[var(--destructive-foreground)]"
          >
            Remove tier
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function UnsavedChangesDialog({
  open,
  onClose,
  onConfirmLeave,
  onRetrySave,
}: {
  open: boolean;
  onClose: () => void;
  onConfirmLeave: () => void;
  onRetrySave: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Your latest changes are not saved"
      description="Stay on this page and try saving again before leaving."
    >
      <div className="space-y-4 mt-3">
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          A recent update could not be synced to local storage. If you leave now, you might lose unsaved form inputs.
        </p>

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-[var(--border)]">
          <Button variant="outline" size="sm" onClick={onConfirmLeave} className="text-xs">
            Leave without saving
          </Button>
          <Button variant="default" size="sm" onClick={onRetrySave} className="text-xs">
            Stay and retry
          </Button>
        </div>
      </div>
    </Modal>
  );
}

