import type { Metadata } from "next";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Operational Notifications · Settings · Reloopin",
  description: "Configure operational and team security alerts across email and in-app channels.",
};

export default function NotificationsSettingsPage() {
  return (
    <Suspense>
      <Dashboard workspace="settings" settingsSection="notifications" />
    </Suspense>
  );
}

