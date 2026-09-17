import Dashboard from "@/components/dashboard";

export default async function CampaignEmailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = await params;
  return <Dashboard campaignEditorId={campaignId} />;
}
