export function validateIntegrationName(
  name: string,
  existingNames: { id: string; name: string }[],
  currentId?: string,
): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Enter an integration name.";
  }
  const isDuplicate = existingNames.some(
    (item) =>
      item.name.toLowerCase() === trimmed.toLowerCase() &&
      item.id !== currentId,
  );
  if (isDuplicate) {
    return "An integration with this name already exists.";
  }
  return null;
}

export function validateStoreUrl(
  url: string,
  platform?: string,
): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return "Enter your store URL.";
  }

  if (platform === "shopify") {
    // Check if it looks like a valid myshopify URL or store domain
    const clean = trimmed.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    if (!clean || clean.length < 3) {
      return "Enter a valid store URL.";
    }
    // If user provided a domain, it should have a period or myshopify.com
    if (!clean.includes(".")) {
      return "Enter a valid store URL, such as your-store.myshopify.com.";
    }
    return null;
  }

  // Generic URL check (WooCommerce, etc.)
  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return "Enter a valid store URL.";
    }
    return null;
  } catch {
    return "Enter a valid store URL.";
  }
}

export function validateStoreAssignment(
  storeIds: string[],
): string | null {
  if (!storeIds || storeIds.length === 0) {
    return "Choose at least one store.";
  }
  return null;
}

export function validateClientKey(
  key: string,
  required: boolean = false,
): string | null {
  const trimmed = key.trim();
  if (!trimmed) {
    return required ? "Enter a valid client key." : null;
  }
  if (trimmed.length < 4) {
    return "Enter a valid client key.";
  }
  return null;
}

export function validateClientSecret(
  secret: string,
  required: boolean = false,
): string | null {
  const trimmed = secret.trim();
  if (!trimmed) {
    return required ? "Enter a valid client secret." : null;
  }
  if (trimmed.length < 4) {
    return "Enter a valid client secret.";
  }
  return null;
}

export function validateEndpointUrl(
  url: string,
  type: "Product" | "Customer" | "Platform",
): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return type === "Platform" ? "Enter a valid platform URL." : null;
  }

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return `Enter a valid ${type} API URL.`;
    }
    return null;
  } catch {
    return `Enter a valid ${type} API URL.`;
  }
}

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  errorLine?: number;
}

export function validateJsonMetadata(jsonStr: string): JsonValidationResult {
  const trimmed = jsonStr.trim();
  if (!trimmed) {
    return { valid: true };
  }

  try {
    JSON.parse(trimmed);
    return { valid: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Syntax error";
    // Try to extract line number from error message
    // e.g., "Unexpected token '}' at line 3 column 1" or "... at position 42"
    let line = 1;
    const lineMatch = errorMessage.match(/line (\d+)/i);
    if (lineMatch) {
      line = parseInt(lineMatch[1], 10);
    } else {
      const posMatch = errorMessage.match(/position (\d+)/i);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        line = jsonStr.slice(0, pos).split("\n").length;
      }
    }
    return {
      valid: false,
      error: "This JSON is not valid. Fix the highlighted error.",
      errorLine: line,
    };
  }
}

export function formatJsonString(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonStr;
  }
}
