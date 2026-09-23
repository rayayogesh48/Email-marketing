"use client";

import { useState, useId } from "react";
import { Sparkles, ChevronDown, CheckCircle2, AlertTriangle, Calculator } from "lucide-react";
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
  const [ruleName, setRuleName] = useState(data.ruleName || "Points for purchases");
  const [pointsEarned, setPointsEarned] = useState<number | string>(
    data.pointsEarned ?? 1
  );
  const [perOrderSpend, setPerOrderSpend] = useState<number | string>(
    data.perOrderSpend ?? 1
  );
  const [minimumOrder, setMinimumOrder] = useState<string>(
    data.minimumOrder !== null && data.minimumOrder !== undefined
      ? String(data.minimumOrder)
      : ""
  );
  const [maximumPoints, setMaximumPoints] = useState<string>(
    data.maximumPoints !== null && data.maximumPoints !== undefined
      ? String(data.maximumPoints)
      : ""
  );
  const [showAdvanced, setShowAdvanced] = useState(
    overrideState === "minimum_order" || overrideState === "maximum_points"
  );
  const [isSaved, setIsSaved] = useState(data.isSaved || false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  if (!isNaN(parsedPoints) && !isNaN(parsedSpend) && parsedSpend > 0 && parsedPoints > 0) {
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
    parsedMax ? `Maximum ${parsedMax} points limit.` : "No maximum points limit."
  }`;

  return (
    <div className="max-w-[680px] mx-auto py-8 sm:py-10 px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
          Choose how customers earn points
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
          Start with a purchase rule. You can create more earning rules later.
        </p>
      </div>

      <div className="space-y-6">
        {/* Main Card */}
        <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xs space-y-5">
          {/* Rule Name */}
          <div>
            <label
              htmlFor={ruleNameId}
              className="block text-xs font-semibold text-[var(--foreground)] mb-1.5"
            >
              Rule name
            </label>
            <input
              id={ruleNameId}
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
              <p className="text-xs font-medium text-[var(--destructive)] mt-1 flex items-center gap-1">
                <AlertTriangle size={12} />
                <span>{errors.ruleName}</span>
              </p>
            )}
          </div>

          {/* Earning Rate Row: Customers earn X points for every $Y spent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={pointsEarnedId}
                className="block text-xs font-semibold text-[var(--foreground)] mb-1.5"
              >
                Customers earn
              </label>
              <div className="relative flex items-center">
                <input
                  id={pointsEarnedId}
                  type="number"
                  min="1"
                  step="1"
                  value={pointsEarned}
                  onChange={(e) => {
                    setPointsEarned(e.target.value);
                    setIsSaved(false);
                    if (errors.pointsEarned) setErrors({ ...errors, pointsEarned: "" });
                  }}
                  className={`w-full h-9 pl-3 pr-14 rounded-lg bg-[var(--input)] border text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] tabular-nums ${
                    errors.pointsEarned ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  }`}
                />
                <span className="absolute right-3 text-xs font-medium text-[var(--muted-foreground)] pointer-events-none">
                  {Number(pointsEarned) === 1 ? "point" : "points"}
                </span>
              </div>
              {errors.pointsEarned && (
                <p className="text-xs font-medium text-[var(--destructive)] mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  <span>{errors.pointsEarned}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={perOrderSpendId}
                className="block text-xs font-semibold text-[var(--foreground)] mb-1.5"
              >
                For every
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-medium text-[var(--muted-foreground)] pointer-events-none">
                  $
                </span>
                <input
                  id={perOrderSpendId}
                  type="number"
                  min="0.01"
                  step="0.5"
                  value={perOrderSpend}
                  onChange={(e) => {
                    setPerOrderSpend(e.target.value);
                    setIsSaved(false);
                    if (errors.perOrderSpend) setErrors({ ...errors, perOrderSpend: "" });
                  }}
                  className={`w-full h-9 pl-6 pr-14 rounded-lg bg-[var(--input)] border text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] tabular-nums ${
                    errors.perOrderSpend ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  }`}
                />
                <span className="absolute right-3 text-xs font-medium text-[var(--muted-foreground)] pointer-events-none">
                  spent
                </span>
              </div>
              {errors.perOrderSpend && (
                <p className="text-xs font-medium text-[var(--destructive)] mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  <span>{errors.perOrderSpend}</span>
                </p>
              )}
            </div>
          </div>

          {/* Live Example Card */}
          <div className="p-4 rounded-xl bg-[var(--primary-container)]/25 border border-[var(--primary)]/25 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0">
              <Calculator size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">
                Live calculation preview
              </span>
              <p className="text-xs font-medium text-[var(--foreground)] mt-0.5">
                A $50 order earns your customer{" "}
                <strong className="text-[var(--primary)] text-sm font-bold tabular-nums">
                  {calculatedExamplePoints} points
                </strong>
                .
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                Calculated in real time based on your selected earn rate.
              </p>
            </div>
          </div>

          {/* Collapsible Advanced Options */}
          <div className="pt-2 border-t border-[var(--border)]">
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
                    Customers only earn points when the order reaches this amount.
                  </p>
                  {errors.minimumOrder && (
                    <p className="text-xs text-[var(--destructive)] mt-1">
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
                    <p className="text-xs text-[var(--destructive)] mt-1">
                      {errors.maximumPoints}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rule Summary Banner */}
        <div className="p-4 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] flex items-start justify-between gap-4">
          <div className="flex items-start gap-2.5">
            <Sparkles size={16} className="text-[var(--secondary)] shrink-0 mt-0.5" />
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

