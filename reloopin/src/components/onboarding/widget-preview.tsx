"use client";

import { useState } from "react";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Crown,
  ShoppingBag,
  Store,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandingConfig } from "@/lib/onboarding/onboarding-types";
import { PRESET_BRAND_COLORS } from "@/lib/onboarding/onboarding-data";
import {
  validateHexColor,
  getReadableBrandForeground,
} from "@/lib/onboarding/onboarding-validation";

export function WidgetPreview({
  data,
  onSaveBranding,
  onContinue,
  overrideState,
}: {
  data: BrandingConfig;
  onSaveBranding: (updated: BrandingConfig) => void;
  onContinue: () => void;
  overrideState?: string;
}) {
  const [brandColor, setBrandColor] = useState(
    overrideState === "custom_color"
      ? "#2563EB"
      : overrideState === "invalid_color"
        ? "#ZZZZZZ"
        : overrideState === "low_contrast"
          ? "#FACC15" // yellow with low contrast
          : data.brandColor || "#4F46E5",
  );
  const [storeName] = useState(data.storeName || "Northstar Goods");
  const [previewMode, setPreviewMode] = useState<"launcher" | "open">(
    overrideState === "launcher"
      ? "launcher"
      : overrideState === "open_widget"
        ? "open"
        : data.previewMode || "open",
  );
  const [previewCustomer, setPreviewCustomer] = useState<"existing" | "new">(
    data.previewCustomer || "existing",
  );
  const [isSaved, setIsSaved] = useState(overrideState === "saved");
  const [previewError, setPreviewError] = useState(
    overrideState === "preview_failed",
  );

  const validation = validateHexColor(brandColor);
  // Normal-sized customer text must meet AA, including light brand colors.
  const previewForeground = getReadableBrandForeground(brandColor);

  const handleColorChange = (hex: string) => {
    setBrandColor(hex);
    setIsSaved(false);
  };

  const handleApplyRecommended = () => {
    if (validation.recommendedColor) {
      setBrandColor(validation.recommendedColor);
      setIsSaved(false);
    }
  };

  const handleResetDefault = () => {
    setBrandColor("#4F46E5");
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!validation.valid) return;
    setIsSaved(true);
    onSaveBranding({
      brandColor,
      storeName,
      previewMode,
      previewCustomer,
      isSaved: true,
    });
  };

  return (
    <div className="onboarding-content-panel onboarding-branding-panel">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Make it feel like your store
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
          Choose how your loyalty widget appears to customers.
        </p>
      </div>

      {/* 2-Column Responsive Layout: Config (56%) | Preview (44%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration (7 cols ≈ 56%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand Color Config Card */}
          <div className="branding-controls space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[var(--foreground)]">
                  Primary brand color
                </label>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-[11px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={11} />
                  <span>Reset to default</span>
                </button>
              </div>

              {/* Color Picker & Hex Input */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    aria-label="Pick brand color"
                    value={validation.valid ? brandColor : "#4F46E5"}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)] bg-transparent p-0.5"
                  />
                </div>

                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--muted-foreground)]">
                    HEX
                  </span>
                  <input
                    type="text"
                    aria-label="Primary brand color"
                    aria-invalid={!validation.valid}
                    value={brandColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    placeholder="#4F46E5"
                    className={`w-full h-10 pl-12 pr-3 rounded-lg bg-[var(--input)] border text-xs font-mono text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                      !validation.valid
                        ? "border-[var(--destructive)]"
                        : !validation.accessible
                          ? "border-[var(--warning)]"
                          : "border-[var(--border)]"
                    }`}
                  />
                </div>
              </div>

              {/* Validation Feedback */}
              {!validation.valid && (
                <p
                  role="alert"
                  className="text-xs font-medium text-[var(--destructive)] mt-2 flex items-center gap-1.5"
                >
                  <AlertTriangle size={13} />
                  <span>{validation.errorMessage}</span>
                </p>
              )}

              {validation.valid && !validation.accessible && (
                <div className="p-3 mt-3 rounded-lg bg-[var(--warning-container)]/30 border border-[var(--warning)]/40 text-xs text-[var(--foreground)] space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      size={14}
                      className="text-[var(--warning)] shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="font-semibold">
                        This color may be difficult to read:
                      </span>{" "}
                      White text on this background has a contrast ratio of only{" "}
                      {validation.contrastRatio}:1.
                    </div>
                  </div>

                  {validation.recommendedColor && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        Recommended accessible shade:{" "}
                        {validation.recommendedColor}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyRecommended}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Use recommended color
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Color Presets */}
            <div className="pt-2 border-t border-[var(--border)]">
              <span className="block text-[11px] font-semibold text-[var(--muted-foreground)] mb-2.5 uppercase tracking-wider">
                Preset palettes
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_BRAND_COLORS.map((preset) => {
                  const isSelected =
                    brandColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleColorChange(preset.hex)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? "bg-[var(--muted)] border-[var(--primary)] ring-2 ring-[var(--primary)]/30"
                          : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--ring)]"
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full shadow-2xs flex items-center justify-center text-white"
                        style={{ backgroundColor: preset.hex }}
                      >
                        {isSelected && <CheckCircle2 size={12} />}
                      </span>
                      <span className="text-[10px] font-semibold text-[var(--foreground)]">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Store Identity Auto-Detection */}
            <div className="pt-2 border-t border-[var(--border)]">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-2xs">
                    <Store size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                      Connected Store Identity
                    </span>
                    <h4 className="text-xs font-bold text-[var(--foreground)]">
                      {storeName}
                    </h4>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-[var(--secondary)] bg-[var(--secondary-container)] px-2 py-0.5 rounded-full">
                  Auto-applied
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            {isSaved ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--secondary)] bg-[var(--secondary-container)] px-2.5 py-1 rounded-full">
                <CheckCircle2 size={12} />
                <span>Branding saved</span>
              </span>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {!isSaved ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  disabled={!validation.valid || overrideState === "saving"}
                  className="text-xs h-9 px-4 font-semibold"
                >
                  Save branding
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onContinue}
                  className="text-xs h-9 px-4 font-semibold"
                >
                  Finish setup
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Widget Preview (5 cols ≈ 44%) */}
        <div className="branding-live-preview space-y-3">
          {/* Controls toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] text-xs">
            {/* Launcher vs Open */}
            <div className="flex items-center rounded-lg bg-[var(--card)] p-0.5 border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setPreviewMode("launcher")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  previewMode === "launcher"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Launcher
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("open")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  previewMode === "open"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Open widget
              </button>
            </div>

            {/* Existing Customer vs New Customer */}
            <div className="flex items-center rounded-lg bg-[var(--card)] p-0.5 border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setPreviewCustomer("existing")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  previewCustomer === "existing"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setPreviewCustomer("new")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  previewCustomer === "new"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Guest
              </button>
            </div>
          </div>

          {/* Browser / Device Simulation Canvas */}
          <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs relative min-h-[460px] flex flex-col justify-between overflow-hidden">
            {/* Fake Store Header Bar */}
            <div className="pb-3 mb-3 border-b border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                <Store size={13} />
                <span>{storeName} Storefront</span>
              </div>
              <span className="text-[10px] bg-[var(--muted)] px-1.5 py-0.5 rounded">
                Live Preview
              </span>
            </div>

            {previewError ? (
              <div className="my-auto text-center p-6 space-y-3">
                <AlertTriangle
                  size={24}
                  className="text-[var(--warning)] mx-auto"
                />
                <h4 className="text-xs font-bold text-[var(--foreground)]">
                  Preview unavailable
                </h4>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Your color is saved. Try refreshing the preview.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewError(false)}
                  className="text-xs h-7 px-3 gap-1.5"
                >
                  <RefreshCw size={11} />
                  <span>Refresh preview</span>
                </Button>
              </div>
            ) : previewMode === "launcher" ? (
              /* LAUNCHER PREVIEW */
              <div className="my-auto flex flex-col items-center justify-center p-8 text-center space-y-4">
                <p className="text-xs text-[var(--muted-foreground)] max-w-[220px]">
                  The floating widget launcher stays anchored in your
                  store&apos;s bottom-right corner.
                </p>

                <div
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-white font-semibold text-xs transition-transform hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: validation.valid ? brandColor : "#4F46E5",
                    color: previewForeground,
                  }}
                >
                  <Gift size={16} />
                  <span>Rewards</span>
                </div>
              </div>
            ) : (
              /* OPEN WIDGET PREVIEW */
              <div className="w-full max-w-[320px] mx-auto rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden bg-[var(--background)] flex flex-col text-left my-auto">
                {/* Widget Header Banner with Brand Color */}
                <div
                  className="p-5 text-white flex flex-col justify-between"
                  style={{
                    backgroundColor: validation.valid ? brandColor : "#4F46E5",
                    color: previewForeground,
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold tracking-tight">
                      {storeName} Rewards
                    </span>
                    <span
                      className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  </div>

                  {previewCustomer === "existing" ? (
                    <div>
                      <p className="text-[11px] opacity-90">Welcome back,</p>
                      <h4 className="text-base font-bold">Maya Chen</h4>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold">
                        <Sparkles size={12} />
                        <span>2,450 points</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-bold leading-tight">
                        Join {storeName} Rewards
                      </h4>
                      <p className="text-[11px] opacity-90 mt-0.5">
                        Earn points every time you shop.
                      </p>
                    </div>
                  )}
                </div>

                {/* Widget Body */}
                <div className="p-4 space-y-3 text-xs bg-[var(--card)]">
                  {previewCustomer === "existing" ? (
                    <>
                      <div className="p-2.5 rounded-lg bg-[var(--muted)]/60 border border-[var(--border)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown size={14} className="text-[var(--warning)]" />
                          <span className="font-semibold text-[var(--foreground)] text-[11px]">
                            Gold Member
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          View VIP status →
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/40 cursor-pointer text-center">
                          <ShoppingBag
                            size={14}
                            className="mx-auto mb-1 text-[var(--primary)]"
                          />
                          <span className="text-[10px] font-semibold text-[var(--foreground)] block">
                            Earn points
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)]/40 cursor-pointer text-center">
                          <Gift
                            size={14}
                            className="mx-auto mb-1 text-[var(--secondary)]"
                          />
                          <span className="text-[10px] font-semibold text-[var(--foreground)] block">
                            View rewards
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-2 text-center space-y-3">
                      <div className="p-3 rounded-lg bg-[var(--muted)]/40 border border-[var(--border)] text-left space-y-1 text-[11px] text-[var(--muted-foreground)]">
                        <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                          <CheckCircle2
                            size={12}
                            className="text-[var(--secondary)]"
                          />
                          <span>Earn 1 point per $1 spent</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)]">
                          <CheckCircle2
                            size={12}
                            className="text-[var(--secondary)]"
                          />
                          <span>Exclusive VIP tier perks</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full py-2 rounded-lg text-white font-semibold text-xs shadow-xs cursor-pointer transition-opacity hover:opacity-95"
                        style={{
                          backgroundColor: validation.valid
                            ? brandColor
                            : "#4F46E5",
                          color: previewForeground,
                        }}
                      >
                        Join rewards
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Safe small note */}
            <div className="pt-2 text-center">
              <span className="text-[10px] text-[var(--muted-foreground)]">
                Visual preview only · Fully interactive on storefront after
                launch
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
