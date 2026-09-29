import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Customer Profile · Reloopin",
  description: "View customer loyalty metrics, tier progress, and point ledger activity.",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  return (
    <Suspense>
      <Dashboard workspace="customers" customerId={customerId} />
    </Suspense>
  );
}
