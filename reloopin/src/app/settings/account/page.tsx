import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Account Settings · Reloopin",
  description: "Manage your personal profile, email, language, timezone, and security password.",
};

export default function AccountSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="account" />
    </Suspense>
  );
}

