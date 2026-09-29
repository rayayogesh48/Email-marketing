import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Billing & Plans · Reloopin",
  description: "Manage your subscription, usage, payment details, and invoices.",
};

export default function BillingSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="billing" />
    </Suspense>
  );
}
