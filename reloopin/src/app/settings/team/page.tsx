import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Team & Staff Access · Settings · Reloopin",
  description: "Manage team members, roles, store-specific access, seat limits, and invitations.",
};

export default function TeamSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="team" />
    </Suspense>
  );
}

