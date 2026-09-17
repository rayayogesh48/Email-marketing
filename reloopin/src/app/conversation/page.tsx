import type { Metadata } from "next";
import Dashboard from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Conversations · Reloopin",
  description: "Customer and seller marketplace conversations.",
};

export default function ConversationRoute() {
  return <Dashboard workspace="conversation" />;
}
