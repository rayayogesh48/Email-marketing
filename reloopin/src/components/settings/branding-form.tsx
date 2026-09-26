"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BrandingSettings } from "@/lib/settings/settings-types";
import {
  calculateContrast,
  validateImageFile,
} from "@/lib/settings/settings-validation";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/dialog";
import {
  Upload,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Award,
  Gift,
} from "lucide-react";
import { toast } from "sonner";

const PRESET_COLORS = [
  { label: "Reloopin Violet", hex: "#7B72EB" },
  { label: "Royal Blue", hex: "#2563EB" },
  { label: "Emerald Green", hex: "#059669" },
  { label: "Amber Gold", hex: "#D97706" },
  { label: "Ruby Red", hex: "#DC2626" },
  { label: "Midnight Dark", hex: "#111827" },
];

export function BrandingForm({
  branding,
  storeName,
  isReadOnly,
  previewState,
  onUpdateBranding,
  onResetBranding,
  onDirtyChange,
}: {
  branding: BrandingSettings;
  storeName: string;
  isReadOnly?: boolean;
  previewState?: string;
  onUpdateBranding: (updates: Partial<BrandingSettings>) => void;
  onResetBranding: () => void;
  onDirtyChange: (isDirty: boolean, handleSave: () => void, handleCancel: () => void) => void;
}) {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(branding.logoUrl);
  const [brandColor, setBrandColor] = useState<string>(
    previewState === "branding_low_contrast" ? "#FDE047" : branding.brandColor,
  );
  const [senderName, setSenderName] = useState(branding.senderName);
  const [activePreviewTab, setActivePreviewTab] = useState<"widget" | "email">("widget");

  const [resetDialogOpen, setResetDialogOpen] = useState(
    previewState === "branding_reset",
  );
  const [logoError, setLogoError] = useState<string | null>(
    previewState === "branding_invalid_logo" ? "Upload a PNG, JPG, or WebP image under 2 MB." : null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty =
    logoUrl !== branding.logoUrl ||
    brandColor !== branding.brandColor ||
    senderName !== branding.senderName;

  const handleCancel = useCallback(() => {
    setLogoUrl(branding.logoUrl);
    setBrandColor(branding.brandColor);
    setSenderName(branding.senderName);
    setLogoError(null);
  }, [branding]);

  const handleSave = useCallback(() => {
    if (isReadOnly) return;
    onUpdateBranding({
      logoUrl,
      brandColor,
      senderName: senderName.trim() || storeName,
    });
    toast.success("Branding updated");
  }, [isReadOnly, logoUrl, brandColor, senderName, storeName, onUpdateBranding]);

  useEffect(() => {
    onDirtyChange(isDirty, handleSave, handleCancel);
  }, [isDirty, handleSave, handleCancel, onDirtyChange]);

  // Handle Logo Upload
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateImageFile(file);
    if (err) {
      setLogoError(err);
      return;
    }

    setLogoError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const contrast = calculateContrast(brandColor);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Branding
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Set the default brand styles used across your loyalty widget and emails.
        </p>
      </div>

      {/* Information Callout */}
      <div className="p-3.5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 flex items-start gap-3 text-xs text-[var(--foreground)]">
        <Sparkles size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
        <div>
          Changes apply to the customer widget and supported email templates for{" "}
          <strong className="text-[var(--foreground)]">{storeName}</strong>.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration (approx 55%) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Store Logo Card */}
          <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Store Logo
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 flex items-center justify-center p-2 overflow-hidden shrink-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={storeName}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-[var(--muted-foreground)] text-center px-1">
                    {storeName}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoFileChange}
                  className="hidden"
                  disabled={isReadOnly}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isReadOnly}
                    className="text-xs h-8"
                  >
                    <Upload size={13} className="mr-1.5" />
                    {logoUrl ? "Replace logo" : "Upload logo"}
                  </Button>
                  {logoUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setLogoUrl(undefined)}
                      disabled={isReadOnly}
                      className="text-xs h-8 text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                    >
                      <Trash2 size={13} className="mr-1.5" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  PNG, JPG, or WebP. Square or horizontal logo. Max 2 MB. Transparent background recommended.
                </p>
                {logoError && (
                  <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                    <AlertTriangle size={12} /> {logoError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Brand Color Card */}
          <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
                Brand Color
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setBrandColor("#7B72EB")}
                disabled={isReadOnly}
                className="text-[11px] h-6 px-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Reset color
              </Button>
            </div>

            {/* Color Input Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={brandColor.startsWith("#") && brandColor.length === 7 ? brandColor : "#7B72EB"}
                  onChange={(e) => setBrandColor(e.target.value)}
                  disabled={isReadOnly}
                  className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer p-0.5 bg-transparent shrink-0"
                />
              </div>

              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  disabled={isReadOnly}
                  maxLength={7}
                  className="w-full sm:w-44 px-3 py-2 text-xs font-mono uppercase bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                  placeholder="#7B72EB"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] text-[var(--muted-foreground)] block font-medium">
                Preset palettes
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setBrandColor(preset.hex)}
                    disabled={isReadOnly}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border transition-all cursor-pointer ${
                      brandColor.toLowerCase() === preset.hex.toLowerCase()
                        ? "border-[var(--foreground)] bg-[var(--accent)] font-semibold shadow-xs"
                        : "border-[var(--border)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: preset.hex }}
                    />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Validation Notice */}
            {!contrast.isValid && contrast.message && (
              <div className="p-3 rounded-lg border border-[var(--warning,#f59e0b)]/40 bg-[var(--warning,#f59e0b)]/10 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <AlertTriangle size={15} className="text-[var(--warning,#f59e0b)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--foreground)] block">
                      This color may be difficult to read
                    </strong>
                    <p className="text-[var(--muted-foreground)] mt-0.5">
                      {contrast.message} Contrast ratio: {contrast.ratioWithWhite}:1 with white text.
                    </p>
                  </div>
                </div>

                {contrast.recommendedColor && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setBrandColor(contrast.recommendedColor!)}
                    className="text-xs h-7 ml-6 border-[var(--warning,#f59e0b)]/50 hover:bg-[var(--warning,#f59e0b)]/20"
                  >
                    Use recommended color ({contrast.recommendedColor})
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sender Name Card */}
          <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-4 shadow-xs">
            <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Email Sender Name
            </h3>

            <div className="space-y-1.5">
              <label
                htmlFor="sender-name"
                className="text-xs font-medium text-[var(--foreground)] block"
              >
                Sender name
              </label>
              <input
                id="sender-name"
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={isReadOnly}
                className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
                placeholder="Northstar Goods"
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                This name appears as the friendly sender in supported customer loyalty emails.
              </p>
            </div>
          </div>

          {/* Reset Branding Card */}
          <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-xl bg-[var(--card)]">
            <div>
              <div className="text-xs font-medium text-[var(--foreground)]">Reset to default</div>
              <div className="text-[11px] text-[var(--muted-foreground)]">
                Revert custom logo and brand colors to Reloopin defaults.
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResetDialogOpen(true)}
              disabled={isReadOnly}
              className="text-xs text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
            >
              <RotateCcw size={12} className="mr-1.5" />
              Reset branding
            </Button>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview (approx 45%) */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
              Live Preview
            </span>
            <div className="flex items-center bg-[var(--muted)] p-0.5 rounded-lg border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setActivePreviewTab("widget")}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  activePreviewTab === "widget"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Widget
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab("email")}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                  activePreviewTab === "email"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                Email
              </button>
            </div>
          </div>

          {/* Live Preview Display Box */}
          <div className="border border-[var(--border)] rounded-2xl bg-[var(--card)] p-4 shadow-sm overflow-hidden min-h-[460px] flex flex-col justify-center">
            {activePreviewTab === "widget" ? (
              /* Widget Preview */
              <div className="w-full max-w-[320px] mx-auto space-y-4">
                {/* Simulated Widget Card */}
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-md overflow-hidden text-xs">
                  {/* Brand Header */}
                  <div
                    className="p-4 text-white relative transition-colors duration-200"
                    style={{ backgroundColor: brandColor }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt=""
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          storeName.charAt(0)
                        )}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/25 font-semibold uppercase tracking-wider">
                        Rewards
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm">Welcome back, Sarah!</h4>
                    <p className="text-[11px] opacity-90">You have 750 points available</p>
                  </div>

                  {/* Widget Body */}
                  <div className="p-4 space-y-3 bg-[var(--card)]">
                    <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-[var(--primary)]" />
                        <div>
                          <div className="font-semibold text-[11px] text-[var(--foreground)]">Gold VIP Tier</div>
                          <div className="text-[10px] text-[var(--muted-foreground)]">1.5x points on every order</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--primary)]">Active</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-medium text-[var(--foreground)]">Available Rewards</div>
                      <div className="p-2.5 rounded-xl border border-[var(--border)] flex items-center justify-between hover:bg-[var(--muted)]/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <Gift size={14} className="text-[var(--muted-foreground)]" />
                          <span className="text-[11px] text-[var(--foreground)]">$10 Off Next Order</span>
                        </div>
                        <button
                          type="button"
                          className="px-2 py-1 rounded-md text-[10px] font-semibold text-white shadow-2xs transition-colors"
                          style={{ backgroundColor: brandColor }}
                        >
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Launcher Button */}
                <div className="flex justify-end pr-2">
                  <div
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full text-white font-medium text-xs shadow-lg cursor-pointer transition-transform hover:scale-105"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Gift size={14} />
                    <span>Rewards</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Email Preview */
              <div className="w-full max-w-[340px] mx-auto rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-md overflow-hidden text-xs">
                {/* Email Client Top Bar */}
                <div className="px-3 py-2 bg-[var(--muted)] border-b border-[var(--border)] flex items-center gap-2 text-[10px] text-[var(--muted-foreground)]">
                  <span className="font-medium text-[var(--foreground)]">From:</span> {senderName || storeName} &lt;loyalty@{storeName.toLowerCase().replace(/\s+/g, "")}.com&gt;
                </div>

                {/* Email Header with Brand Accent */}
                <div
                  className="h-2 w-full transition-colors duration-200"
                  style={{ backgroundColor: brandColor }}
                />

                <div className="p-5 space-y-4">
                  {/* Brand Logo in Email */}
                  <div className="text-center py-1">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt=""
                        className="h-7 mx-auto object-contain"
                      />
                    ) : (
                      <strong className="text-sm tracking-tight text-[var(--foreground)]">
                        {senderName || storeName}
                      </strong>
                    )}
                  </div>

                  {/* Email Content */}
                  <div className="text-center space-y-1.5">
                    <h4 className="font-bold text-sm text-[var(--foreground)]">
                      You’ve earned 50 points!
                    </h4>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      Thanks for your recent purchase. Your loyalty balance is growing.
                    </p>
                  </div>

                  {/* Points Box */}
                  <div className="p-3 rounded-xl bg-[var(--muted)]/60 text-center space-y-0.5">
                    <div className="text-[10px] uppercase font-semibold text-[var(--muted-foreground)] tracking-wider">
                      Current balance
                    </div>
                    <div
                      className="text-lg font-bold"
                      style={{ color: brandColor }}
                    >
                      800 points
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      className="w-full py-2 rounded-lg text-white font-semibold text-xs shadow-xs"
                      style={{ backgroundColor: brandColor }}
                    >
                      Redeem your reward
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        title="Reset branding?"
        description={`Your custom logo and brand color will be replaced with Reloopin defaults for ${storeName}.`}
      >
        <div className="pt-2 space-y-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            Are you sure you want to revert your styling customization? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResetDialogOpen(false)}
              className="text-xs"
            >
              Keep branding
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                onResetBranding();
                setResetDialogOpen(false);
                toast.success("Branding reset to Reloopin defaults");
              }}
              className="text-xs"
            >
              Reset branding
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
