"use client";

import { useState, useId } from "react";
import Image from "next/image";
import {
  Sparkles,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EarningRuleConfig } from "@/lib/onboarding/onboarding-types";
import { validateEarningRule } from "@/lib/onboarding/onboarding-validation";

export function EarningRuleForm({
  data,
  onSaveRule,
  onContinue,
  overrideState,
}: {
  data: EarningRuleConfig;
  onSaveRule: (updated: EarningRuleConfig) => void;
  onContinue: () => void;
  overrideState?: string;
}) {
  const [ruleName, setRuleName] = useState(
    data.ruleName || "Points for purchases",
  );
  const [pointsEarned, setPointsEarned] = useState<number | string>(
    overrideState === "custom_rate"
      ? 2
      : overrideState === "validation_error"
        ? 0
        : (data.pointsEarned ?? 1),
  );
  const [perOrderSpend, setPerOrderSpend] = useState<number | string>(
    data.perOrderSpend ?? 1,
  );
  const [minimumOrder, setMinimumOrder] = useState<string>(
    overrideState === "minimum_order"
      ? "25"
      : data.minimumOrder !== null && data.minimumOrder !== undefined
        ? String(data.minimumOrder)
        : "",
  );
  const [maximumPoints, setMaximumPoints] = useState<string>(
    overrideState === "maximum_points"
      ? "100"
      : data.maximumPoints !== null && data.maximumPoints !== undefined
        ? String(data.maximumPoints)
        : "",
  );
  const [showAdvanced, setShowAdvanced] = useState(
    overrideState === "minimum_order" || overrideState === "maximum_points",
  );
  const [isSaved, setIsSaved] = useState(
    overrideState === "saved" ||
      (![
        "custom_rate",
        "minimum_order",
        "maximum_points",
        "validation_error",
      ].includes(overrideState || "") &&
        data.isSaved) ||
      false,
  );
  const [errors, setErrors] = useState<Record<string, string>>(
    overrideState === "validation_error"
      ? { pointsEarned: "Points must be greater than 0." }
      : {},
  );

  const ruleNameId = useId();
  const pointsEarnedId = useId();
  const perOrderSpendId = useId();
  const minOrderId = useId();
  const maxPointsId = useId();

  // Dynamic live calculation: $50 order calculation
  const parsedPoints = Number(pointsEarned);
  const parsedSpend = Number(perOrderSpend);
  const parsedMin = minimumOrder ? Number(minimumOrder) : null;
  const parsedMax = maximumPoints ? Number(maximumPoints) : null;

  let calculatedExamplePoints = 0;
  if (
    !isNaN(parsedPoints) &&
    !isNaN(parsedSpend) &&
    parsedSpend > 0 &&
    parsedPoints > 0
  ) {
    const raw = Math.floor((50 / parsedSpend) * parsedPoints);
    calculatedExamplePoints = parsedMax ? Math.min(raw, parsedMax) : raw;
  }

  const handleSave = () => {
    const configToValidate: EarningRuleConfig = {
      ruleName,
      pointsEarned: parsedPoints,
      perOrderSpend: parsedSpend,
      minimumOrder: parsedMin,
      maximumPoints: parsedMax,
    };

    const validation = validateEarningRule(configToValidate);
    if (!validation.valid) {
      setErrors(validation.errors);
      setIsSaved(false);
      return;
    }

    setErrors({});
    setIsSaved(true);
    onSaveRule({
      ...configToValidate,
      isSaved: true,
    });
  };

  // Human-readable rule summary
  const summaryText = `Customers earn ${parsedPoints || 1} ${
    parsedPoints === 1 ? "point" : "points"
  } for every $${parsedSpend || 1} spent. ${
    parsedMin ? `Minimum order $${parsedMin}.` : "No minimum order."
  } ${
    parsedMax
      ? `Maximum ${parsedMax} points limit.`
      : "No maximum points limit."
  }`;

  return (
    <div className="onboarding-content-panel onboarding-rule-panel">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Set your earning rule
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
          Choose how many points customers earn when they spend at your store.
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Card */}
        <div className="onboarding-form-fields space-y-5">
          {/* Rule Name */}
          <div className="onboarding-rule-name">
            <label
              htmlFor={ruleNameId}
              className="block text-xs font-semibold text-[var(--foreground)] mb-1.5"
            >
              Rule name
            </label>
            <input
              id={ruleNameId}
              aria-invalid={!!errors.ruleName}
              aria-describedby={
                errors.ruleName ? `${ruleNameId}-error` : undefined
              }
              type="text"
              value={ruleName}
              onChange={(e) => {
                setRuleName(e.target.value);
                setIsSaved(false);
                if (errors.ruleName) setErrors({ ...errors, ruleName: "" });
              }}
              className="w-full h-9 px-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
            {errors.ruleName && (
              <p
                id={`${ruleNameId}-error`}
                role="alert"
                className="text-xs font-medium text-[var(--destructive)] mt-1 flex items-center gap-1"
              >
                <AlertTriangle size={12} />
                <span>{errors.ruleName}</span>
              </p>
            )}
          </div>

          {/* Editable sentence; original earning fields and save validation are preserved. */}
          <div className="onboarding-rule-builder">
            <div className="rule-points">
              <input
                id={pointsEarnedId}
                aria-label="Customers earn"
                aria-invalid={!!errors.pointsEarned}
                aria-describedby={
                  errors.pointsEarned ? `${pointsEarnedId}-error` : undefined
                }
                type="number"
                min="1"
                step="1"
                value={pointsEarned}
                onChange={(e) => {
                  setPointsEarned(e.target.value);
                  setIsSaved(false);
                  if (errors.pointsEarned)
                    setErrors({ ...errors, pointsEarned: "" });
                }}
              />
              <span>{Number(pointsEarned) === 1 ? "point" : "points"}</span>
              {errors.pointsEarned && (
                <p
                  id={`${pointsEarnedId}-error`}
                  role="alert"
                  className="rule-error"
                >
                  {errors.pointsEarned}
                </p>
              )}
            </div>
            <div className="rule-spend">
              <span>Every</span>
              <div className="rule-input">
                <span className="currency-symbol" aria-hidden="true">
                  $
                </span>
                <input
                  id={perOrderSpendId}
                  aria-label="For every"
                  aria-invalid={!!errors.perOrderSpend}
                  aria-describedby={
                    errors.perOrderSpend
                      ? `${perOrderSpendId}-error`
                      : undefined
                  }
                  type="number"
                  min="0.01"
                  step="0.5"
                  value={perOrderSpend}
                  onChange={(e) => {
                    setPerOrderSpend(e.target.value);
                    setIsSaved(false);
                    if (errors.perOrderSpend)
                      setErrors({ ...errors, perOrderSpend: "" });
                  }}
                />
              </div>
              <span className="text-[var(--muted-foreground)]">
                spent earns
              </span>
              {errors.perOrderSpend && (
                <p
                  id={`${perOrderSpendId}-error`}
                  role="alert"
                  className="rule-error"
                >
                  {errors.perOrderSpend}
                </p>
              )}
            </div>
          </div>
          <div className="onboarding-rule-example" aria-live="polite">
            <Image src="/onboarding/info.svg" width={16} height={16} alt="" />
            <p>
              <strong>Example:</strong> A $50 order will reward your customer
              with <strong>{calculatedExamplePoints} points</strong>.
            </p>
          </div>

          {/* Collapsible Advanced Options */}
          <div className="onboarding-rule-options pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-semibold text-[var(--foreground)] hover:text-[var(--primary)] inline-flex items-center gap-1.5 cursor-pointer py-1"
            >
              <span>Advanced options</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
              />
            </button>

            {showAdvanced && (
              <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={minOrderId}
                    className="block text-xs font-medium text-[var(--foreground)] mb-1"
                  >
                    Minimum order
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-[var(--muted-foreground)] pointer-events-none">
                      $
                    </span>
                    <input
                      id={minOrderId}
                      type="number"
                      min="0"
                      value={minimumOrder}
                      onChange={(e) => {
                        setMinimumOrder(e.target.value);
                        setIsSaved(false);
                      }}
                      placeholder="No minimum"
                      className="w-full h-8 pl-6 pr-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                    Customers only earn points when the order reaches this
                    amount.
                  </p>
                  {errors.minimumOrder && (
                    <p
                      role="alert"
                      className="text-xs text-[var(--destructive)] mt-1"
                    >
                      {errors.minimumOrder}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor={maxPointsId}
                    className="block text-xs font-medium text-[var(--foreground)] mb-1"
                  >
                    Maximum points per order
                  </label>
                  <input
                    id={maxPointsId}
                    type="number"
                    min="1"
                    value={maximumPoints}
                    onChange={(e) => {
                      setMaximumPoints(e.target.value);
                      setIsSaved(false);
                    }}
                    placeholder="No limit"
                    className="w-full h-8 px-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                  />
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                    Limit how many points a customer can earn from one order.
                  </p>
                  {errors.maximumPoints && (
                    <p
                      role="alert"
                      className="text-xs text-[var(--destructive)] mt-1"
                    >
                      {errors.maximumPoints}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rule Summary Banner */}
        <div className="onboarding-rule-summary bg-[var(--muted)] border border-[var(--border)] flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <Sparkles
              size={16}
              className="text-[var(--secondary)] shrink-0 mt-0.5"
            />
            <div>
              <h4 className="text-xs font-semibold text-[var(--foreground)]">
                Active earning rule summary
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
                {summaryText}
              </p>
            </div>
          </div>

          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--secondary)] bg-[var(--secondary-container)] px-2.5 py-1 rounded-full shrink-0">
              <CheckCircle2 size={12} />
              <span>Earning rule saved</span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {!isSaved ? (
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={overrideState === "saving"}
              className="text-xs h-9 px-4 font-semibold"
            >
              Save earning rule
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onContinue}
              className="text-xs h-9 px-4 font-semibold"
            >
              Continue to VIP tiers
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
