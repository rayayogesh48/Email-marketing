import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Integrations · Reloopin",
  description:
    "Connect stores and channels to keep customer, order, and loyalty data in sync.",
};

export default function IntegrationsPage() {
  return (
    <Suspense>
      <Dashboard workspace="integrations" integrationView="list" />
    </Suspense>
  );
}
