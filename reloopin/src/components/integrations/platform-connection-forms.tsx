"use client";

import { useState } from "react";
import {
  PlatformDefinition,
  StoreOption,
  ConnectionOutcome,
} from "@/lib/integrations/integrations-types";
import {
  validateIntegrationName,
  validateStoreUrl,
  validateStoreAssignment,
  validateClientKey,
  validateClientSecret,
  validateEndpointUrl,
  validateJsonMetadata,
  formatJsonString,
} from "@/lib/integrations/integrations-validation";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "./platform-icon";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  HelpCircle,
  ExternalLink,
  Code,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export interface FormValues {
  name: string;
  storeUrl: string;
  platformUrl: string;
  clientKey: string;
  clientSecret: string;
  productEndpoint: string;
  customerEndpoint: string;
  assignedStoreIds: string[];
  assignedStoreLabel: string;
  metadataJson: string;
  socialHandle: string;
}

export function PlatformConnectionForms({
  platform,
  stores,
  existingIntegrations,
  currentId,
  initialValues,
  isEditMode = false,
  onTestConnection,
  onProceed,
}: {
  platform: PlatformDefinition;
  stores: StoreOption[];
  existingIntegrations: { id: string; name: string }[];
  currentId?: string;
  initialValues?: Partial<FormValues>;
  isEditMode?: boolean;
  onTestConnection: (values: FormValues, outcome?: ConnectionOutcome) => void;
  onProceed: (values: FormValues) => void;
}) {
  const getInitialName = () => {
    if (initialValues?.name) return initialValues.name;
    const baseName = platform.defaultName;
    const exists = existingIntegrations.some(
      (item) => item.name.toLowerCase() === baseName.toLowerCase() && item.id !== currentId
    );
    if (!exists) return baseName;
    let counter = 2;
    while (
      existingIntegrations.some(
        (item) => item.name.toLowerCase() === `${baseName} ${counter}`.toLowerCase() && item.id !== currentId
      )
    ) {
      counter++;
    }
    return `${baseName} ${counter}`;
  };

  const [values, setValues] = useState<FormValues>({
    name: getInitialName(),
    storeUrl: initialValues?.storeUrl || (platform.id === "shopify" ? "northstar-goods.myshopify.com" : platform.id === "woocommerce" ? "https://northstargoods.com" : ""),
    platformUrl: initialValues?.platformUrl || "",
    clientKey: initialValues?.clientKey || "",
    clientSecret: initialValues?.clientSecret || "",
    productEndpoint: initialValues?.productEndpoint || "",
    customerEndpoint: initialValues?.customerEndpoint || "",
    assignedStoreIds: initialValues?.assignedStoreIds || (stores[0] ? [stores[0].id] : ["northstar"]),
    assignedStoreLabel: initialValues?.assignedStoreLabel || (platform.isStoreWorkspace ? "Store workspace" : stores[0]?.name || "Northstar Goods"),
    metadataJson: initialValues?.metadataJson || '{\n  "storeId": "northstar",\n  "syncInterval": "hourly"\n}',
    socialHandle: initialValues?.socialHandle || "@northstargoods",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSecret, setShowSecret] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [showCredentialsHelper, setShowCredentialsHelper] = useState(false);

  // Simulated redirect/approval states for OAuth platforms
  const [simulatedOAuthState, setSimulatedOAuthState] = useState<
    "idle" | "redirecting" | "waiting_approval" | "verifying" | "authorized"
  >("idle");

  const handleChange = (field: keyof FormValues, val: string | string[]) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateAll = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const nameErr = validateIntegrationName(
      values.name,
      existingIntegrations,
      currentId,
    );
    if (nameErr) newErrors.name = nameErr;

    // Validate Store URL
    if (platform.id === "shopify" || platform.id === "woocommerce") {
      const urlErr = validateStoreUrl(values.storeUrl, platform.id);
      if (urlErr) newErrors.storeUrl = urlErr;
    }

    // Validate WooCommerce keys
    if (platform.id === "woocommerce") {
      const keyErr = validateClientKey(values.clientKey, true);
      if (keyErr) newErrors.clientKey = keyErr;
      const secretErr = validateClientSecret(values.clientSecret, true);
      if (secretErr) newErrors.clientSecret = secretErr;
    }

    // Validate assigned store for channels & POS
    if (!platform.isStoreWorkspace) {
      const storeErr = validateStoreAssignment(values.assignedStoreIds);
      if (storeErr) newErrors.assignedStoreIds = storeErr;
    } else if (platform.category === "pos") {
      const storeErr = validateStoreAssignment(values.assignedStoreIds);
      if (storeErr) newErrors.assignedStoreIds = storeErr;
    }

    // Custom API validation
    if (platform.id === "custom_api") {
      const platUrlErr = validateEndpointUrl(values.platformUrl, "Platform");
      if (platUrlErr) newErrors.platformUrl = platUrlErr;

      if (values.productEndpoint) {
        const prodErr = validateEndpointUrl(values.productEndpoint, "Product");
        if (prodErr) newErrors.productEndpoint = prodErr;
      }

      if (values.customerEndpoint) {
        const custErr = validateEndpointUrl(values.customerEndpoint, "Customer");
        if (custErr) newErrors.customerEndpoint = custErr;
      }

      const jsonRes = validateJsonMetadata(values.metadataJson);
      if (!jsonRes.valid) {
        newErrors.metadataJson = jsonRes.error || "This JSON is not valid. Fix the highlighted error.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnectionClick = () => {
    if (!validateAll()) return;
    onTestConnection(values, "success");
  };

  const handleSimulatedOAuth = () => {
    if (!validateAll()) return;
    setSimulatedOAuthState("redirecting");
    setTimeout(() => {
      setSimulatedOAuthState("waiting_approval");
    }, 800);
  };

  const handleSimulatedApproval = () => {
    setSimulatedOAuthState("verifying");
    setTimeout(() => {
      setSimulatedOAuthState("authorized");
    }, 900);
  };

  const formatJson = () => {
    const formatted = formatJsonString(values.metadataJson);
    handleChange("metadataJson", formatted);
  };

  const resetJson = () => {
    handleChange(
      "metadataJson",
      '{\n  "storeId": "northstar",\n  "syncInterval": "hourly"\n}',
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Form Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
        <PlatformIcon platform={platform.id} size={36} />
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            {isEditMode ? `Edit ${values.name}` : `Connect ${platform.name}`}
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            {platform.description}
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateAll()) onProceed(values);
        }}
        className="space-y-5"
      >
        {/* Field: Integration Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="integration-name"
            className="text-xs font-medium text-[var(--foreground)] block"
          >
            Integration name <span className="text-[var(--destructive)]">*</span>
          </label>
          <input
            id="integration-name"
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] ${
              errors.name ? "border-[var(--destructive)]" : "border-[var(--border)]"
            }`}
            placeholder="e.g. Northstar Shopify Store"
          />
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Use a name your team will recognize.
          </p>
          {errors.name && (
            <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> {errors.name}
            </p>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SHOPIFY FIELDS */}
        {/* ========================================================================= */}
        {platform.id === "shopify" && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="shopify-url"
                className="text-xs font-medium text-[var(--foreground)] block"
              >
                Shopify store URL <span className="text-[var(--destructive)]">*</span>
              </label>
              <input
                id="shopify-url"
                type="text"
                value={values.storeUrl}
                onChange={(e) => handleChange("storeUrl", e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] ${
                  errors.storeUrl ? "border-[var(--destructive)]" : "border-[var(--border)]"
                }`}
                placeholder="northstar-goods.myshopify.com"
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Enter your .myshopify.com store address.
              </p>
              {errors.storeUrl && (
                <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                  <AlertCircle size={12} /> {errors.storeUrl}
                </p>
              )}
            </div>

            {/* Simulated Redirect & Approval flow */}
            {simulatedOAuthState !== "idle" && (
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 space-y-3">
                {simulatedOAuthState === "redirecting" && (
                  <div className="flex items-center gap-2.5 text-xs text-[var(--foreground)]">
                    <RefreshCw size={14} className="animate-spin text-[var(--primary)]" />
                    <span>Connecting your store: We’re opening Shopify so you can approve the connection...</span>
                  </div>
                )}
                {simulatedOAuthState === "waiting_approval" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground)]">
                      <ExternalLink size={14} className="text-[var(--primary)]" />
                      <span>Approve the connection in Shopify</span>
                    </div>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      After approving access in the Shopify App Store, return here to finish connecting your store.
                    </p>
                    <Button size="sm" type="button" onClick={handleSimulatedApproval}>
                      I’ve approved access
                    </Button>
                  </div>
                )}
                {simulatedOAuthState === "verifying" && (
                  <div className="flex items-center gap-2.5 text-xs text-[var(--foreground)]">
                    <RefreshCw size={14} className="animate-spin text-[var(--primary)]" />
                    <span>Verifying your connection and API permissions...</span>
                  </div>
                )}
                {simulatedOAuthState === "authorized" && (
                  <div className="flex items-center justify-between text-xs text-[var(--success,#16a34a)] font-medium">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Store verified and authorized successfully!
                    </span>
                    <Button
                      size="sm"
                      type="button"
                      onClick={handleTestConnectionClick}
                      className="text-xs"
                    >
                      Test connection
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Manual Credentials Accordion */}
            <div className="border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowManual(!showManual)}
                className="w-full px-4 py-2.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center justify-between bg-[var(--muted)]/30 text-left"
              >
                <span>Connect manually (Custom App API credentials)</span>
                {showManual ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {showManual && (
                <div className="p-4 space-y-3 bg-[var(--card)] border-t border-[var(--border)]">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[var(--foreground)]">
                      Merchant client key
                    </label>
                    <input
                      type="text"
                      value={values.clientKey}
                      onChange={(e) => handleChange("clientKey", e.target.value)}
                      placeholder="shpat_••••••••••••••••"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[var(--foreground)]">
                      Merchant client secret
                    </label>
                    <input
                      type="password"
                      value={values.clientSecret}
                      onChange={(e) => handleChange("clientSecret", e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full px-3 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* WOOCOMMERCE FIELDS */}
        {/* ========================================================================= */}
        {platform.id === "woocommerce" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="woo-url"
                className="text-xs font-medium text-[var(--foreground)] block"
              >
                Store URL <span className="text-[var(--destructive)]">*</span>
              </label>
              <input
                id="woo-url"
                type="text"
                value={values.storeUrl}
                onChange={(e) => handleChange("storeUrl", e.target.value)}
                className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[var(--ring)] ${
                  errors.storeUrl ? "border-[var(--destructive)]" : "border-[var(--border)]"
                }`}
                placeholder="https://northstargoods.com"
              />
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Enter your website address customers use to visit your store.
              </p>
              {errors.storeUrl && (
                <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                  <AlertCircle size={12} /> {errors.storeUrl}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Consumer key <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="text"
                  value={values.clientKey}
                  onChange={(e) => handleChange("clientKey", e.target.value)}
                  placeholder="ck_••••••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Consumer secret <span className="text-[var(--destructive)]">*</span>
                </label>
                <input
                  type="password"
                  value={values.clientSecret}
                  onChange={(e) => handleChange("clientSecret", e.target.value)}
                  placeholder="cs_••••••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
                />
              </div>
            </div>

            {/* Helper link */}
            <div>
              <button
                type="button"
                onClick={() => setShowCredentialsHelper(!showCredentialsHelper)}
                className="text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1"
              >
                <HelpCircle size={13} /> Where can I find these credentials?
              </button>

              {showCredentialsHelper && (
                <div className="mt-2 p-3 bg-[var(--muted)]/50 border border-[var(--border)] rounded-lg text-xs text-[var(--muted-foreground)] leading-relaxed space-y-1">
                  <p>In your WordPress admin dashboard:</p>
                  <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                    <li>Go to <strong>WooCommerce → Settings → Advanced → REST API</strong>.</li>
                    <li>Click <strong>Add key</strong> with Read/Write permissions.</li>
                    <li>Copy the Consumer Key and Consumer Secret into the fields above.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POINT OF SALE (POS) FIELDS */}
        {/* ========================================================================= */}
        {platform.category === "pos" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="assigned-store-pos"
                className="text-xs font-medium text-[var(--foreground)] block"
              >
                Assigned store <span className="text-[var(--destructive)]">*</span>
              </label>
              <select
                id="assigned-store-pos"
                value={values.assignedStoreIds[0] || ""}
                onChange={(e) => {
                  const s = stores.find((st) => st.id === e.target.value);
                  handleChange("assignedStoreIds", [e.target.value]);
                  handleChange("assignedStoreLabel", s?.name || "Northstar Goods");
                }}
                className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)]"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.platform})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Choose the store workspace this physical retail register will synchronize with.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-medium text-[var(--foreground)]">
                  Simulated POS OAuth Authorization
                </span>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  Authorize terminal device pairing and customer sales capture.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleTestConnectionClick}
                data-testid={`connect-pos-${platform.id}`}
              >
                Connect {platform.name}
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SOCIAL & REVIEWS FIELDS */}
        {/* ========================================================================= */}
        {(platform.category === "social" || platform.category === "reviews") && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--foreground)] block">
                Assigned stores <span className="text-[var(--destructive)]">*</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                    <input
                      type="radio"
                      name="storeAssignment"
                      checked={values.assignedStoreIds.includes("all")}
                      onChange={() => {
                        handleChange("assignedStoreIds", ["all"]);
                        handleChange("assignedStoreLabel", "All stores");
                      }}
                    />
                    <span>All stores</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                    <input
                      type="radio"
                      name="storeAssignment"
                      checked={!values.assignedStoreIds.includes("all")}
                      onChange={() => {
                        handleChange("assignedStoreIds", [stores[0]?.id || "northstar"]);
                        handleChange("assignedStoreLabel", stores[0]?.name || "Northstar Goods");
                      }}
                    />
                    <span>Select specific store</span>
                  </label>
                </div>

                {!values.assignedStoreIds.includes("all") && (
                  <select
                    value={values.assignedStoreIds[0] || ""}
                    onChange={(e) => {
                      const s = stores.find((st) => st.id === e.target.value);
                      handleChange("assignedStoreIds", [e.target.value]);
                      handleChange("assignedStoreLabel", s?.name || "Northstar Goods");
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] mt-1"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Profile Selection */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 space-y-2">
              <span className="text-xs font-medium text-[var(--foreground)] block">
                Authorized account profile
              </span>
              <div className="flex items-center gap-3 bg-[var(--card)] p-2.5 rounded-lg border border-[var(--border)]">
                <PlatformIcon platform={platform.id} size={24} />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-[var(--foreground)] block">
                    Northstar Goods
                  </span>
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    {values.socialHandle}
                  </span>
                </div>
                <span className="text-[10px] text-[var(--success,#16a34a)] font-medium bg-[var(--color-success-bg,rgba(34,197,94,0.1))] px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CUSTOM API FIELDS */}
        {/* ========================================================================= */}
        {platform.id === "custom_api" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="api-url"
                className="text-xs font-medium text-[var(--foreground)] block"
              >
                Platform URL <span className="text-[var(--destructive)]">*</span>
              </label>
              <input
                id="api-url"
                type="text"
                value={values.platformUrl}
                onChange={(e) => handleChange("platformUrl", e.target.value)}
                placeholder="https://api.example.com"
                className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] font-mono ${
                  errors.platformUrl ? "border-[var(--destructive)]" : "border-[var(--border)]"
                }`}
              />
              {errors.platformUrl && (
                <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                  <AlertCircle size={12} /> {errors.platformUrl}
                </p>
              )}
            </div>

            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Merchant client key (Optional)
                </label>
                <input
                  type="text"
                  value={values.clientKey}
                  onChange={(e) => handleChange("clientKey", e.target.value)}
                  placeholder="pk_live_••••••••"
                  className="w-full px-3 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Merchant client secret (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={values.clientSecret}
                    onChange={(e) => handleChange("clientSecret", e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full pl-3 pr-9 py-2 text-xs bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    aria-label={showSecret ? "Hide secret" : "Show secret"}
                  >
                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* API Endpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Product API endpoint (Optional)
                </label>
                <input
                  type="text"
                  value={values.productEndpoint}
                  onChange={(e) => handleChange("productEndpoint", e.target.value)}
                  placeholder="https://api.example.com/products"
                  className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] font-mono ${
                    errors.productEndpoint ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  }`}
                />
                {errors.productEndpoint && (
                  <p className="text-[11px] text-[var(--destructive)] font-medium">
                    {errors.productEndpoint}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] block">
                  Customer API endpoint (Optional)
                </label>
                <input
                  type="text"
                  value={values.customerEndpoint}
                  onChange={(e) => handleChange("customerEndpoint", e.target.value)}
                  placeholder="https://api.example.com/customers"
                  className={`w-full px-3 py-2 text-xs bg-[var(--card)] border rounded-lg text-[var(--foreground)] font-mono ${
                    errors.customerEndpoint ? "border-[var(--destructive)]" : "border-[var(--border)]"
                  }`}
                />
                {errors.customerEndpoint && (
                  <p className="text-[11px] text-[var(--destructive)] font-medium">
                    {errors.customerEndpoint}
                  </p>
                )}
              </div>
            </div>

            {/* Advanced JSON Metadata Editor */}
            <div className="border border-[var(--border)] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowMetadata(!showMetadata)}
                className="w-full px-4 py-2.5 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center justify-between bg-[var(--muted)]/30 text-left"
              >
                <span className="flex items-center gap-1.5">
                  <Code size={13} /> Advanced configuration: Integration metadata (JSON)
                </span>
                {showMetadata ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {showMetadata && (
                <div className="p-4 space-y-3 bg-[var(--card)] border-t border-[var(--border)]">
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="text-[var(--muted-foreground)]">Custom payload parameters</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={formatJson}
                        className="text-[11px] h-7 px-2"
                      >
                        Format JSON
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={resetJson}
                        className="text-[11px] h-7 px-2"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={values.metadataJson}
                    onChange={(e) => handleChange("metadataJson", e.target.value)}
                    className={`w-full p-3 font-mono text-xs bg-[var(--muted)]/40 border rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--ring)] ${
                      errors.metadataJson ? "border-[var(--destructive)]" : "border-[var(--border)]"
                    }`}
                  />
                  {errors.metadataJson && (
                    <p className="text-[11px] text-[var(--destructive)] flex items-center gap-1 font-medium">
                      <AlertCircle size={12} /> {errors.metadataJson}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Primary Action Buttons Bar */}
        <div className="pt-5 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3">
          {platform.id === "shopify" && simulatedOAuthState === "idle" ? (
            <Button
              type="button"
              onClick={handleSimulatedOAuth}
              className="flex items-center gap-2"
              data-testid="continue-to-shopify-button"
            >
              Continue to Shopify
              <ExternalLink size={14} />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnectionClick}
              className="flex items-center gap-2"
              data-testid="test-connection-button"
            >
              <CheckCircle2 size={14} className="text-[var(--primary)]" />
              Test connection
            </Button>
          )}

          <Button
            type="submit"
            className="flex items-center gap-1.5"
            data-testid="continue-to-review-main-button"
          >
            {isEditMode ? "Save changes" : "Continue to review"}
            <ChevronRight size={14} />
          </Button>
        </div>
      </form>
    </div>
  );
}
