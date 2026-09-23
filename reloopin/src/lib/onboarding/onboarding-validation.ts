import { EarningRuleConfig, VIPTier } from "./onboarding-types";

// WCAG relative luminance helper
function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const rgb =
    cleanHex.length === 3
      ? cleanHex.split("").map((c) => parseInt(c + c, 16))
      : [
          parseInt(cleanHex.substring(0, 2), 16),
          parseInt(cleanHex.substring(2, 4), 16),
          parseInt(cleanHex.substring(4, 6), 16),
        ];

  const srgb = rgb.map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export function validateHexColor(hex: string): {
  valid: boolean;
  accessible: boolean;
  contrastRatio: number;
  recommendedColor?: string;
  errorMessage?: string;
} {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hex || !hexRegex.test(hex)) {
    return {
      valid: false,
      accessible: false,
      contrastRatio: 1,
      errorMessage: "Enter a valid hex color.",
    };
  }

  const lum = getLuminance(hex);
  // Contrast against pure white (lum = 1.0)
  const contrastWithWhite = (1.0 + 0.05) / (lum + 0.05);

  // Accessible for white text on brand background requires ratio >= 3.0 (large) or 4.5 (normal)
  const isAccessible = contrastWithWhite >= 3.0;

  let recommendedColor: string | undefined;
  if (!isAccessible) {
    // Produce darker version by darkening channels
    const cleanHex = hex.replace("#", "");
    const full =
      cleanHex.length === 3
        ? cleanHex
            .split("")
            .map((c) => c + c)
            .join("")
        : cleanHex;
    const r = Math.max(0, Math.floor(parseInt(full.substring(0, 2), 16) * 0.6));
    const g = Math.max(0, Math.floor(parseInt(full.substring(2, 4), 16) * 0.6));
    const b = Math.max(0, Math.floor(parseInt(full.substring(4, 6), 16) * 0.6));
    recommendedColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  return {
    valid: true,
    accessible: isAccessible,
    contrastRatio: Number(contrastWithWhite.toFixed(1)),
    recommendedColor,
    errorMessage: isAccessible
      ? undefined
      : "This color may be difficult to read. Choose a darker color or use the recommended accessible version.",
  };
}

export function validateTiers(tiers: VIPTier[]): {
  valid: boolean;
  fieldErrors: Record<string, string>;
  generalError?: string;
} {
  const fieldErrors: Record<string, string> = {};

  if (!tiers || tiers.length === 0) {
    return {
      valid: false,
      fieldErrors: {},
      generalError: "At least one VIP tier is required.",
    };
  }

  const seenNames = new Set<string>();
  const seenThresholds = new Set<number>();

  // Check individual tier rules
  tiers.forEach((tier, index) => {
    const trimmedName = tier.name.trim();
    if (!trimmedName) {
      fieldErrors[`${tier.id}-name`] = "Enter a tier name.";
    } else if (seenNames.has(trimmedName.toLowerCase())) {
      fieldErrors[`${tier.id}-name`] = "Use a different tier name.";
    } else {
      seenNames.add(trimmedName.toLowerCase());
    }

    if (tier.minimumPoints < 0) {
      fieldErrors[`${tier.id}-points`] = "Minimum points cannot be negative.";
    } else if (seenThresholds.has(tier.minimumPoints)) {
      fieldErrors[`${tier.id}-points`] =
        "Each tier needs a different points threshold.";
    } else {
      seenThresholds.add(tier.minimumPoints);
    }

    if (index === 0 && tier.minimumPoints !== 0) {
      fieldErrors[`${tier.id}-points`] = "First tier must start at 0 points.";
    }
  });

  // Check ordering progression
  for (let i = 1; i < tiers.length; i++) {
    const prev = tiers[i - 1];
    const curr = tiers[i];
    if (curr.minimumPoints <= prev.minimumPoints) {
      fieldErrors[`${curr.id}-order`] = `${curr.name || "Tier"} must require more points than ${prev.name || "previous tier"}.`;
    }
  }

  const hasErrors =
    Object.keys(fieldErrors).length > 0;

  return {
    valid: !hasErrors,
    fieldErrors,
    generalError: hasErrors ? "Please resolve the tier configuration errors." : undefined,
  };
}

export function validateEarningRule(rule: EarningRuleConfig): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!rule.ruleName || !rule.ruleName.trim()) {
    errors.ruleName = "Rule name is required.";
  }

  if (rule.pointsEarned === undefined || rule.pointsEarned === null || isNaN(rule.pointsEarned)) {
    errors.pointsEarned = "Enter how many points customers earn.";
  } else if (rule.pointsEarned <= 0) {
    errors.pointsEarned = "Points must be greater than 0.";
  }

  if (rule.perOrderSpend === undefined || rule.perOrderSpend === null || isNaN(rule.perOrderSpend)) {
    errors.perOrderSpend = "Enter the order amount required to earn points.";
  } else if (rule.perOrderSpend <= 0) {
    errors.perOrderSpend = "The order amount must be greater than 0.";
  }

  if (rule.minimumOrder !== null && rule.minimumOrder !== undefined) {
    if (isNaN(rule.minimumOrder) || rule.minimumOrder < 0) {
      errors.minimumOrder = "Enter a valid minimum order amount.";
    }
  }

  if (rule.maximumPoints !== null && rule.maximumPoints !== undefined) {
    if (
      isNaN(rule.maximumPoints) ||
      rule.maximumPoints <= 0 ||
      !Number.isInteger(rule.maximumPoints)
    ) {
      errors.maximumPoints =
        "Maximum points must be a whole number greater than 0.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

