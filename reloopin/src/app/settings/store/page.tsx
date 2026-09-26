import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Store Profile · Settings · Reloopin",
  description: "Manage store information, public contact details, business address, and synced e-commerce settings.",
};

export default function StoreSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="store" />
    </Suspense>
  );
}
