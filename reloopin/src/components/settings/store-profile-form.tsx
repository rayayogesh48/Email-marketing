"use client";

import { useState, useEffect, useCallback } from "react";
import { StoreProfile } from "@/lib/settings/settings-types";
import {
  validateStoreName,
  validateStoreWebsite,
  validateSupportEmail,
  validateSupportPhone,
} from "@/lib/settings/settings-validation";
import {
  Lock,
  AlertCircle,
  MapPin,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { DisconnectedStoreBanner } from "./shared-state-banners";

export function StoreProfileForm({
  storeProfile,
  isReadOnly,
  previewState,
  onUpdateStoreProfile,
  onDirtyChange,
}: {
  storeProfile: StoreProfile;
  isReadOnly?: boolean;
  previewState?: string;
  onUpdateStoreProfile: (updates: Partial<StoreProfile>) => void;
  onDirtyChange: (isDirty: boolean, handleSave: () => void, handleCancel: () => void) => void;
}) {
  const [name, setName] = useState(storeProfile.name);
  const [publicDisplayName, setPublicDisplayName] = useState(storeProfile.publicDisplayName);
  const [website, setWebsite] = useState(storeProfile.website);
  const [supportEmail, setSupportEmail] = useState(storeProfile.supportEmail);
  const [supportPhoneCountryCode, setSupportPhoneCountryCode] = useState(
    storeProfile.supportPhoneCountryCode || "+1",
  );
  const [supportPhoneNumber, setSupportPhoneNumber] = useState(
    storeProfile.supportPhoneNumber || "",
  );
  const [addressLine, setAddressLine] = useState(storeProfile.address.addressLine);
  const [city, setCity] = useState(storeProfile.address.city);
  const [region, setRegion] = useState(storeProfile.address.region);
  const [country, setCountry] = useState(storeProfile.address.country);
  const [postalCode, setPostalCode] = useState(storeProfile.address.postalCode);
  const [timezone, setTimezone] = useState(storeProfile.timezone);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDisconnected, setIsDisconnected] = useState(
    previewState === "store_disconnected" || storeProfile.isDisconnected,
  );

  const isDirty =
    name !== storeProfile.name ||
    publicDisplayName !== storeProfile.publicDisplayName ||
    website !== storeProfile.website ||
    supportEmail !== storeProfile.supportEmail ||
    supportPhoneCountryCode !== (storeProfile.supportPhoneCountryCode || "+1") ||
    supportPhoneNumber !== (storeProfile.supportPhoneNumber || "") ||
    addressLine !== storeProfile.address.addressLine ||
    city !== storeProfile.address.city ||
    region !== storeProfile.address.region ||
    country !== storeProfile.address.country ||
    postalCode !== storeProfile.address.postalCode ||
    timezone !== storeProfile.timezone;

  const handleCancel = useCallback(() => {
    setName(storeProfile.name);
    setPublicDisplayName(storeProfile.publicDisplayName);
    setWebsite(storeProfile.website);
    setSupportEmail(storeProfile.supportEmail);
    setSupportPhoneCountryCode(storeProfile.supportPhoneCountryCode || "+1");
    setSupportPhoneNumber(storeProfile.supportPhoneNumber || "");
    setAddressLine(storeProfile.address.addressLine);
    setCity(storeProfile.address.city);
    setRegion(storeProfile.address.region);
    setCountry(storeProfile.address.country);
    setPostalCode(storeProfile.address.postalCode);
    setTimezone(storeProfile.timezone);
    setErrors({});
  }, [storeProfile]);

  const handleSave = useCallback(() => {
    if (isReadOnly) return;
    const newErrors: Record<string, string> = {};

    const nameErr = validateStoreName(name);
    if (nameErr) newErrors.name = nameErr;

    const webErr = validateStoreWebsite(website);
    if (webErr) newErrors.website = webErr;

    const emailErr = validateSupportEmail(supportEmail);
    if (emailErr) newErrors.supportEmail = emailErr;

    const phoneErr = validateSupportPhone(supportPhoneNumber);
    if (phoneErr) newErrors.supportPhoneNumber = phoneErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onUpdateStoreProfile({
      name: name.trim(),
      publicDisplayName: publicDisplayName.trim(),
      website: website.trim(),
      supportEmail: supportEmail.trim(),
      supportPhoneCountryCode,
      supportPhoneNumber: supportPhoneNumber.trim(),
      address: {
        addressLine: addressLine.trim(),
        city: city.trim(),
        region: region.trim(),
        country: country.trim(),
        postalCode: postalCode.trim(),
      },
      timezone,
    });
    toast.success("Store profile updated");
  }, [
    isReadOnly,
    name,
    publicDisplayName,
    website,
    supportEmail,
    supportPhoneCountryCode,
    supportPhoneNumber,
    addressLine,
    city,
    region,
    country,
    postalCode,
    timezone,
    onUpdateStoreProfile,
  ]);

  useEffect(() => {
    onDirtyChange(isDirty, handleSave, handleCancel);
  }, [isDirty, handleSave, handleCancel, onDirtyChange]);

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--primary)] px-2 py-0.5 rounded-full bg-[var(--primary)]/10">
            Editing {storeProfile.name}
          </span>
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Store profile
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Manage the business information used across Reloopin.
        </p>
      </div>

      {/* Disconnected Store Warning */}
      {isDisconnected && (
        <DisconnectedStoreBanner
          storeName={storeProfile.name}
          onReconnect={() => {
            setIsDisconnected(false);
            toast.success(`${storeProfile.name} reconnected successfully!`);
          }}
        />
      )}

      {/* Basic Store Information */}
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-5 shadow-xs">
        <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
          Store Information
        </h3>

        {/* Store Name & Public Display Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="store-name"
              className="text-xs font-medium text-[var(--foreground)] block"
            >
              Store name <span className="text-[var(--destructive)]">*</span>
            </label>
            <input
              id="store-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isReadOnly}
              className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] ${
                errors.name ? "border-[var(--destructive)]" : "border-[var(--border)]"
              }`}
              placeholder="Northstar Goods"
            />
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Appears in dashboard and merchant loyalty experience.
            </p>
            {errors.name && (
              <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="public-display-name"
              className="text-xs font-medium text-[var(--foreground)] block"
            >
              Public display name
            </label>
            <input
              id="public-display-name"
              type="text"
              value={publicDisplayName}
              onChange={(e) => setPublicDisplayName(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
              placeholder="Northstar Rewards"
            />
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Use a different name for customer-facing loyalty content.
            </p>
          </div>
        </div>

        {/* Store Website */}
        <div className="space-y-1.5">
          <label
            htmlFor="store-website"
            className="text-xs font-medium text-[var(--foreground)] block"
          >
            Store website <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            id="store-website"
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={isReadOnly}
            className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] ${
              errors.website ? "border-[var(--destructive)]" : "border-[var(--border)]"
            }`}
            placeholder="https://northstargoods.com"
          />
          {errors.website && (
            <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> {errors.website}
            </p>
          )}
        </div>

        {/* Support Email & Support Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="support-email"
              className="text-xs font-medium text-[var(--foreground)] block"
            >
              Support email
            </label>
            <input
              id="support-email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={isReadOnly}
              className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] ${
                errors.supportEmail ? "border-[var(--destructive)]" : "border-[var(--border)]"
              }`}
              placeholder="support@northstargoods.com"
            />
            <p className="text-[11px] text-[var(--muted-foreground)]">
              Customers may see this address in loyalty emails.
            </p>
            {errors.supportEmail && (
              <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {errors.supportEmail}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="support-phone"
              className="text-xs font-medium text-[var(--foreground)] block"
            >
              Support phone
            </label>
            <div className="flex gap-2">
              <select
                value={supportPhoneCountryCode}
                onChange={(e) => setSupportPhoneCountryCode(e.target.value)}
                disabled={isReadOnly}
                className="w-20 px-2 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] shrink-0"
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+49">+49 (DE)</option>
              </select>
              <input
                id="support-phone"
                type="tel"
                value={supportPhoneNumber}
                onChange={(e) => setSupportPhoneNumber(e.target.value)}
                disabled={isReadOnly}
                className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] ${
                  errors.supportPhoneNumber
                    ? "border-[var(--destructive)]"
                    : "border-[var(--border)]"
                }`}
                placeholder="555-234-5678"
              />
            </div>
            {errors.supportPhoneNumber && (
              <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                <AlertCircle size={12} /> {errors.supportPhoneNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Business Address Card */}
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-4 shadow-xs">
        <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin size={13} />
          Business Address
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[var(--foreground)] block">
            Address line
          </label>
          <input
            type="text"
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            disabled={isReadOnly}
            className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
            placeholder="120 Franklin St, Suite 400"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground)] block">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
              placeholder="New York"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground)] block">
              State / Region
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
              placeholder="NY"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground)] block">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
              placeholder="United States"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--foreground)] block">
              Postal code
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={isReadOnly}
              className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
              placeholder="10013"
            />
          </div>
        </div>
      </div>

      {/* Synced Integrations Fields */}
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card)] space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider flex items-center gap-1.5">
            <Lock size={13} />
            Synced Commerce Fields
          </h3>
          <span className="text-[11px] text-[var(--muted-foreground)]">
            Last synced {storeProfile.currencyLastSynced}
          </span>
        </div>

        {/* Currency (Synced Read-Only) */}
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[var(--foreground)] flex items-center gap-2">
                <span>Currency: <strong className="text-sm">{storeProfile.currency}</strong></span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                  <Check size={10} />
                  Synced from {storeProfile.currencySyncedFrom}
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                Your store’s default currency is synced from {storeProfile.currencySyncedFrom} and locked to prevent checkout discrepancies.
              </p>
            </div>
            <Lock size={16} className="text-[var(--muted-foreground)] shrink-0 ml-4" />
          </div>
        </div>

        {/* Store Timezone */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-medium text-[var(--foreground)] block">
            Store timezone
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={isReadOnly}
            className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)]"
          >
            <option value="America/New_York">America/New_York (Eastern Time)</option>
            <option value="America/Chicago">America/Chicago (Central Time)</option>
            <option value="America/Denver">America/Denver (Mountain Time)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (Pacific Time)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Used for campaign schedules, activity dates, and store reports.
          </p>
        </div>
      </div>
    </div>
  );
}
