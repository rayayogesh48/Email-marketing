import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Billing · Reloopin",
  description: "Track monthly order usage, estimated charges, payment details, and invoices.",
};

export default function BillingSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="billing" />
    </Suspense>
  );
}
