import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Integration Details · Reloopin",
  description: "View connection status, data sync records, and credentials.",
};

export default async function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ integrationId: string }>;
}) {
  const { integrationId } = await params;
  return (
    <Suspense>
      <Dashboard
        workspace="integrations"
        integrationView="detail"
        integrationId={integrationId}
      />
    </Suspense>
  );
}
