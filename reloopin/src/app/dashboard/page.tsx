import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Merchant Dashboard · Reloopin",
  description:
    "See how your loyalty and rewards program is performing across active members, points, tiers, and ROI.",
};

export default function DashboardPage() {
  return (
    <Suspense>
      <Dashboard workspace="dashboard" />
    </Suspense>
  );
}

