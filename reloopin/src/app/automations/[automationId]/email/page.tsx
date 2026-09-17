import Dashboard from "@/components/dashboard";

export default async function AutomationEmailPage({
  params,
}: {
  params: Promise<{ automationId: string }>;
}) {
  const { automationId } = await params;
  return <Dashboard automationEditorId={automationId} />;
}
