import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Add Integration · Reloopin",
  description: "Connect a store, POS, or social channel to Reloopin.",
};

export default function NewIntegrationPage() {
  return (
    <Suspense>
      <Dashboard workspace="integrations" integrationView="new" />
    </Suspense>
  );
}
