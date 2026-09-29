import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Customers · Reloopin",
  description:
    "View customer loyalty members, VIP tiers, point balances, and lifetime value.",
};

export default function CustomersPage() {
  return (
    <Suspense>
      <Dashboard workspace="customers" />
    </Suspense>
  );
}
