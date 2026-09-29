import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Import Customers · Reloopin",
  description:
    "Bulk import customers, map fields, validate data, and set loyalty points.",
};

export default function ImportCustomersPage() {
  return (
    <Suspense>
      <Dashboard workspace="customers" isImport={true} />
    </Suspense>
  );
}
