import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Branding Defaults · Settings · Reloopin",
  description: "Customize your store logo, brand colors with WCAG contrast validation, and sender name.",
};

export default function BrandingSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="branding" />
    </Suspense>
  );
}

