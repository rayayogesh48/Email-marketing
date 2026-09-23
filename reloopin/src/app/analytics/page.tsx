import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Analytics · Reloopin",
  description:
    "Understand how your loyalty program affects customer activity and revenue.",
};

export default function AnalyticsPage() {
  return (
    <Suspense>
      <Dashboard workspace="analytics" />
    </Suspense>
  );
}

