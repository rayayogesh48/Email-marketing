import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Edit Integration · Reloopin",
  description: "Update integration settings, endpoints, and credentials.",
};

export default async function IntegrationEditPage({
  params,
}: {
  params: Promise<{ integrationId: string }>;
}) {
  const { integrationId } = await params;
  return (
    <Suspense>
      <Dashboard
        workspace="integrations"
        integrationView="edit"
        integrationId={integrationId}
      />
    </Suspense>
  );
}
