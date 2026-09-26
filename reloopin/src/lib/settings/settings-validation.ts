import { ContrastValidation } from "./settings-types";

export function validateFirstName(name: string): string | null {
  if (!name || !name.trim()) {
    return "Enter your first name.";
  }
  return null;
}

export function validateLastName(name: string): string | null {
  if (!name || !name.trim()) {
    return "Enter your last name.";
  }
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return "Enter an email address.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return "Enter a valid email address.";
  }
  return null;
}

export function validateEmailNotUsed(
  email: string,
  existingEmails: string[],
  currentEmail?: string,
): string | null {
  const err = validateEmail(email);
  if (err) return err;

  const trimmed = email.trim().toLowerCase();
  const isUsed = existingEmails.some(
    (e) => e.toLowerCase() === trimmed && e.toLowerCase() !== currentEmail?.toLowerCase(),
  );
  if (isUsed) {
    return "This email is already connected to another account.";
  }
  return null;
}

export function validateImageFile(file: { name: string; size: number; type: string }): string | null {
  // Max 2 MB
  const maxBytes = 2 * 1024 * 1024;
  if (file.size > maxBytes) {
    return "Choose an image smaller than 2 MB.";
  }

  // PNG, JPG, WebP
  const validExtensions = [".png", ".jpg", ".jpeg", ".webp"];
  const fileName = file.name.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => fileName.endsWith(ext));
  const validMime = ["image/png", "image/jpeg", "image/webp"].includes(file.type);

  if (!hasValidExt && !validMime) {
    return "Upload a PNG, JPG, or WebP image.";
  }

  return null;
}

export function evaluatePasswordStrength(password: string): {
  score: number; // 0 (empty), 1 (weak), 2 (good), 3 (strong)
  label: "Weak" | "Good" | "Strong" | "";
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
} {
  if (!password) {
    return { score: 0, label: "", hasMinLength: false, hasNumber: false, hasSpecialChar: false };
  }

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  let label: "Weak" | "Good" | "Strong" = "Weak";
  if (score === 2) label = "Good";
  if (score === 3) label = "Strong";

  return { score, label, hasMinLength, hasNumber, hasSpecialChar };
}

export function validateStoreName(name: string): string | null {
  if (!name || !name.trim()) {
    return "Store name required.";
  }
  return null;
}

export function validateStoreWebsite(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return "Store website required.";
  }
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return "Enter a valid website URL.";
    }
    return null;
  } catch {
    return "Enter a valid website URL.";
  }
}

export function validateSupportEmail(email: string): string | null {
  if (!email || !email.trim()) return null; // Optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "Enter a valid support email address.";
  }
  return null;
}

export function validateSupportPhone(phone: string): string | null {
  if (!phone || !phone.trim()) return null; // Optional
  // Allow digits, spaces, parentheses, hyphens, plus sign
  const clean = phone.replace(/[\s()-]/g, "");
  if (clean.length < 7 || !/^\+?\d+$/.test(clean)) {
    return "Enter a valid phone number.";
  }
  return null;
}

/**
 * Calculates WCAG relative luminance and contrast ratio against white (#fff) and dark (#111827).
 */
export function calculateContrast(hexColor: string): ContrastValidation {
  const cleanHex = hexColor.replace(/^#/, "");
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return {
      ratioWithWhite: 1,
      ratioWithDark: 1,
      isAccessibleOnWhite: false,
      isAccessibleOnDark: false,
      isValid: false,
      message: "Enter a valid 6-digit hex color code.",
    };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  // White luminance is 1.0
  const ratioWithWhite = (1.0 + 0.05) / (L + 0.05);

  // Dark text luminance (#111827) ~ 0.009
  const darkL = 0.009;
  const ratioWithDark = (L + 0.05) / (darkL + 0.05);

  // WCAG AA for normal text requires 4.5:1. For large UI controls/buttons, 3.0:1.
  const isAccessibleOnWhite = ratioWithWhite >= 4.5;
  const isAccessibleOnDark = ratioWithDark >= 4.5;

  // If a color fails to have at least 3.5:1 with white or dark text, it has contrast issues
  const hasGoodContrast = isAccessibleOnWhite || isAccessibleOnDark;

  let recommendedColor: string | undefined;
  let message: string | undefined;

  if (ratioWithWhite < 3.5 && ratioWithDark < 3.5) {
    // Middling washed-out or too light color
    recommendedColor = "#5B50E5";
    message = "This color may be difficult to read. Use the recommended accessible version or choose another color.";
  } else if (!hasGoodContrast) {
    recommendedColor = L > 0.5 ? "#4F46E5" : "#818CF8";
    message = "This color may have low contrast. We recommend an accessible shade.";
  }

  return {
    ratioWithWhite: Math.round(ratioWithWhite * 10) / 10,
    ratioWithDark: Math.round(ratioWithDark * 10) / 10,
    isAccessibleOnWhite,
    isAccessibleOnDark,
    isValid: !message,
    recommendedColor,
    message,
  };
}
