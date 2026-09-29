"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Info,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import { VIPTier } from "@/lib/onboarding/onboarding-types";
import { validateTiers } from "@/lib/onboarding/onboarding-validation";
import { RemoveTierDialog } from "./onboarding-dialogs";

const PRESET_TIER_COLORS = [
  "#94A3B8", // Silver / Slate
  "#EAB308", // Gold
  "#334155", // Platinum / Dark slate
  "#8B5CF6", // Purple / Diamond
  "#EC4899", // Pink / Ruby
  "#10B981", // Emerald
];

export function VIPTierList({
  tiers,
  onSaveTiers,
  onContinue,
  overrideState,
}: {
  tiers: VIPTier[];
  onSaveTiers: (updated: VIPTier[]) => void;
  onContinue: () => void;
  overrideState?: string;
}) {
  const [tierList, setTierList] = useState<VIPTier[]>(
    overrideState === "invalid_thresholds"
      ? tiers.map((tier, index) =>
          index === 1 ? { ...tier, minimumPoints: 0 } : tier,
        )
      : tiers,
  );
  const [editingTier, setEditingTier] = useState<VIPTier | null>(
    overrideState === "editing_tier" ? tiers[0] : null,
  );
  const [showAddModal, setShowAddModal] = useState(
    overrideState === "add_tier",
  );
  const [tierPendingRemoval, setTierPendingRemoval] = useState<VIPTier | null>(
    null,
  );
  const [isSaved, setIsSaved] = useState(overrideState === "saved");
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    fieldErrors: Record<string, string>;
    generalError?: string;
  }>(
    overrideState === "invalid_thresholds"
      ? validateTiers(tierList)
      : { valid: true, fieldErrors: {} },
  );

  // Add tier form state
  const [newTierName, setNewTierName] = useState("");
  const [newTierPoints, setNewTierPoints] = useState<number | string>("");
  const [newTierColor, setNewTierColor] = useState(PRESET_TIER_COLORS[3]);
  const [modalError, setModalError] = useState<string | null>(null);

  // Validate and auto-sort tiers
  const handleTiersChange = (newList: VIPTier[]) => {
    // Sort by minimum points ascending
    const sorted = [...newList].sort(
      (a, b) => a.minimumPoints - b.minimumPoints,
    );
    setTierList(sorted);
    setIsSaved(false);

    const check = validateTiers(sorted);
    setValidationResult(check);
  };

  const handleSaveAll = () => {
    const check = validateTiers(tierList);
    setValidationResult(check);

    if (!check.valid) {
      setIsSaved(false);
      return;
    }

    setIsSaved(true);
    onSaveTiers(tierList);
  };

  // Add new tier handler
  const handleAddNewTier = () => {
    if (!newTierName.trim()) {
      setModalError("Enter a tier name.");
      return;
    }
    const pointsNum = Number(newTierPoints);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      setModalError("Minimum points must be a positive number.");
      return;
    }

    if (
      tierList.some(
        (t) => t.name.toLowerCase().trim() === newTierName.toLowerCase().trim(),
      )
    ) {
      setModalError("A tier with this name already exists.");
      return;
    }

    if (tierList.some((t) => t.minimumPoints === pointsNum)) {
      setModalError("A tier with this points requirement already exists.");
      return;
    }

    const newTier: VIPTier = {
      id: `tier-${Date.now()}`,
      name: newTierName.trim(),
      minimumPoints: pointsNum,
      color: newTierColor,
    };

    const updated = [...tierList, newTier];
    handleTiersChange(updated);
    setShowAddModal(false);
    setNewTierName("");
    setNewTierPoints("");
    setModalError(null);
  };

  // Edit existing tier handler
  const handleUpdateEditingTier = () => {
    if (!editingTier) return;
    if (!editingTier.name.trim()) {
      setModalError("Enter a tier name.");
      return;
    }

    const updated = tierList.map((t) =>
      t.id === editingTier.id ? editingTier : t,
    );
    handleTiersChange(updated);
    setEditingTier(null);
  };

  // Delete tier handler
  const handleConfirmRemove = () => {
    if (!tierPendingRemoval) return;
    const updated = tierList.filter((t) => t.id !== tierPendingRemoval.id);
    handleTiersChange(updated);
    setTierPendingRemoval(null);
  };

  return (
    <div className="onboarding-content-panel onboarding-tiers-panel">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Set up your VIP tiers
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
            Reward your best customers with better benefits as they earn more
            points.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="text-xs h-8 px-3 gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Add tier</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Tier Cards List */}
        <div className="space-y-3">
          {tierList.map((tier, idx) => {
            const hasOrderError =
              validationResult.fieldErrors[`${tier.id}-order`];
            const hasPointsError =
              validationResult.fieldErrors[`${tier.id}-points`];
            const hasNameError =
              validationResult.fieldErrors[`${tier.id}-name`];
            const isFirst = idx === 0;

            return (
              <div
                key={tier.id}
                className={`tier-card p-4 rounded-xl border bg-[var(--card)] shadow-2xs transition-all ${
                  hasOrderError || hasPointsError || hasNameError
                    ? "border-[var(--destructive)] ring-1 ring-[var(--destructive)]"
                    : "border-[var(--border)] hover:border-[var(--ring)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Color dot & name */}
                  <div className="flex items-center gap-3">
                    <span
                      className="onboarding-tier-icon"
                      style={{
                        backgroundColor: `${tier.color}18`,
                        color: tier.color,
                      }}
                    >
                      <Crown size={20} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[var(--foreground)]">
                          {tier.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">
                          Tier {idx + 1}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {isFirst && tier.minimumPoints === 0
                          ? "Starting tier for all new members"
                          : `Reach ${tier.minimumPoints.toLocaleString()} lifetime points`}
                      </p>
                    </div>
                  </div>

                  {/* Right: Points threshold & actions */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-[var(--foreground)] tabular-nums">
                        {tier.minimumPoints.toLocaleString()} pts
                      </span>
                      <p className="text-[10px] text-[var(--muted-foreground)]">
                        Threshold
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTier(tier)}
                        aria-label={`Edit ${tier.name} tier`}
                        className="p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>

                      {tierList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setTierPendingRemoval(tier)}
                          aria-label={`Remove ${tier.name} tier`}
                          className="p-1.5 rounded-md hover:bg-[var(--destructive-container)] text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inline Errors if any */}
                {(hasOrderError || hasPointsError || hasNameError) && (
                  <div
                    role="alert"
                    className="mt-2.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--destructive)] flex items-center gap-1.5"
                  >
                    <AlertTriangle size={13} />
                    <span>
                      {hasNameError || hasPointsError || hasOrderError}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global Tier Error notice */}
        {validationResult.generalError && (
          <div className="p-3 rounded-lg bg-[var(--destructive-container)]/20 border border-[var(--destructive)]/40 text-xs text-[var(--destructive)] flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{validationResult.generalError}</span>
          </div>
        )}

        {/* Informational Callout: How tiers work */}
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-start gap-3">
          <Info size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-[var(--foreground)]">
              How VIP tiers work
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Customers automatically move to a higher tier when they reach its
              points requirement. You can set up custom tier rewards (such as
              point multipliers or free gifts) anytime in settings.
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--secondary)] bg-[var(--secondary-container)] px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} />
              <span>VIP tiers saved</span>
            </span>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {!isSaved ? (
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveAll}
                disabled={overrideState === "saving"}
                className="text-xs h-9 px-4 font-semibold"
              >
                Save VIP tiers
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onContinue}
                className="text-xs h-9 px-4 font-semibold"
              >
                Continue to branding
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ADD TIER MODAL */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setModalError(null);
        }}
        title="Add VIP Tier"
        description="Define a new milestone for your loyal shoppers."
      >
        <div className="space-y-4 mt-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Tier name
            </label>
            <input
              type="text"
              aria-label="Tier name"
              value={newTierName}
              onChange={(e) => {
                setNewTierName(e.target.value);
                setModalError(null);
              }}
              placeholder="e.g. Diamond"
              className="w-full h-9 px-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Minimum lifetime points required
            </label>
            <input
              type="number"
              aria-label="Minimum lifetime points required"
              min="1"
              value={newTierPoints}
              onChange={(e) => {
                setNewTierPoints(e.target.value);
                setModalError(null);
              }}
              placeholder="e.g. 5000"
              className="w-full h-9 px-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)] tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">
              Tier badge color
            </label>
            <div className="flex items-center gap-2">
              {PRESET_TIER_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={`Use tier color ${hex}`}
                  aria-pressed={newTierColor === hex}
                  onClick={() => setNewTierColor(hex)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    newTierColor === hex
                      ? "scale-110 ring-2 ring-[var(--ring)] ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          {modalError && (
            <p
              role="alert"
              className="text-xs text-[var(--destructive)] font-medium flex items-center gap-1"
            >
              <AlertTriangle size={13} />
              <span>{modalError}</span>
            </p>
          )}

          <div className="pt-3 flex justify-end gap-2 border-t border-[var(--border)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAddModal(false);
                setModalError(null);
              }}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddNewTier}
              className="text-xs font-semibold"
            >
              Add tier
            </Button>
          </div>
        </div>
      </Modal>

      {/* EDIT TIER MODAL */}
      {editingTier && (
        <Modal
          open={Boolean(editingTier)}
          onClose={() => setEditingTier(null)}
          title={`Edit ${editingTier.name} Tier`}
          description="Update the tier name, threshold, and badge color."
        >
          <div className="space-y-4 mt-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Tier name
              </label>
              <input
                type="text"
                aria-label="Tier name"
                value={editingTier.name}
                onChange={(e) =>
                  setEditingTier({ ...editingTier, name: e.target.value })
                }
                className="w-full h-9 px-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Minimum lifetime points required
              </label>
              <input
                type="number"
                aria-label="Minimum lifetime points required"
                min="0"
                value={editingTier.minimumPoints}
                onChange={(e) =>
                  setEditingTier({
                    ...editingTier,
                    minimumPoints: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full h-9 px-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">
                Tier badge color
              </label>
              <div className="flex items-center gap-2">
                {PRESET_TIER_COLORS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    aria-label={`Use tier color ${hex}`}
                    onClick={() =>
                      setEditingTier({ ...editingTier, color: hex })
                    }
                    className={`w-7 h-7 rounded-full transition-transform ${
                      editingTier.color === hex
                        ? "scale-110 ring-2 ring-[var(--ring)] ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[var(--border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingTier(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleUpdateEditingTier}
                className="text-xs font-semibold"
              >
                Update tier
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* REMOVE TIER CONFIRMATION */}
      {tierPendingRemoval && (
        <RemoveTierDialog
          open={Boolean(tierPendingRemoval)}
          tierName={tierPendingRemoval.name}
          onClose={() => setTierPendingRemoval(null)}
          onConfirmRemove={handleConfirmRemove}
        />
      )}
    </div>
  );
}
