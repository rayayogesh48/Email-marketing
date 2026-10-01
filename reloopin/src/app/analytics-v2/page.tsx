import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Analytics V2 · Reloopin",
  description:
    "Redesigned data reporting experience tracking loyalty program revenue, retention, and points movement.",
};

export default function AnalyticsV2Page() {
  return (
    <Suspense>
      <Dashboard workspace="analytics-v2" />
    </Suspense>
  );
}

