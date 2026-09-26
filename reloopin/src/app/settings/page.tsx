import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";
import { SettingsSection } from "@/lib/settings/settings-types";

export const metadata: Metadata = {
  title: "Account & Team Settings · Reloopin",
  description: "Manage your personal information, store profile, branding, team access, and notifications.",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; state?: string }>;
}) {
  const params = await searchParams;
  const rawSection = params?.section;
  const section: SettingsSection =
    rawSection === "store" ||
    rawSection === "branding" ||
    rawSection === "team" ||
    rawSection === "notifications"
      ? rawSection
      : "account";

  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection={section} />
    </Suspense>
  );
}
