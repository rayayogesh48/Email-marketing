"use client";

import { ReactNode } from "react";
import { Flow, StoreData, audienceCount } from "@/lib/model";
import { Button } from "./ui/button";

function DetailSection({
  title,
  rows,
  children,
}: {
  title: string;
  rows: { label: string; value: ReactNode }[];
  children?: ReactNode;
}) {
  return (
    <section className="campaign-detail-section" aria-label={title}>
      <h3>{title}</h3>
      <dl className="campaign-detail-rows">
        {rows.map((row) => (
          <div className="campaign-detail-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {children}
    </section>
  );
}

/** Layout adapted from Figma nDuKhUOTdwysMFxTPtHRws / 170:63380. */
export function CampaignDetails({
  campaign,
  data,
  onPreview,
  onExclusions,
}: {
  campaign: Flow;
  data: StoreData;
  onPreview: () => void;
  onExclusions: () => void;
}) {
  const brand = campaign.brand || data.brand;
  const sender = campaign.sender || data.sender;
  const counts = audienceCount(campaign);
  const audience =
    campaign.audience === "tiers"
      ? campaign.tiers.join(" or ")
      : campaign.audience === "points"
        ? `At least ${campaign.minimum.toLocaleString()} points`
        : "All eligible customers";
  const tone =
    campaign.status === "Sent"
      ? "success"
      : ["Scheduled", "Paused", "Needs attention"].includes(campaign.status)
        ? "warning"
        : campaign.status === "Failed"
          ? "error"
          : "neutral";
  return (
    <div className="campaign-details">
      <DetailSection
        title="Campaign"
        rows={[
          { label: "Name", value: campaign.name },
          { label: "Campaign type", value: "One-time" },
          { label: "Category", value: campaign.type },
          { label: "Sender", value: brand.name },
        ]}
      />
      <DetailSection
        title="Email"
        rows={[
          { label: "Subject", value: campaign.email.subject },
          { label: "From", value: sender.email },
          { label: "Reply-to", value: sender.reply || sender.email },
          {
            label: "Email design",
            value:
              campaign.email.mode === "html" ? "Custom HTML" : "Store branding",
          },
        ]}
      >
        <Button
          className="campaign-detail-link"
          variant="ghost"
          onClick={onPreview}
        >
          Preview email <span aria-hidden="true">→</span>
        </Button>
      </DetailSection>
      <DetailSection
        title="Audience"
        rows={[
          { label: "Audience", value: audience },
          ...(campaign.audience === "tiers" && campaign.minimum > 0
            ? [
                {
                  label: "Minimum points",
                  value: campaign.minimum.toLocaleString(),
                },
              ]
            : []),
          {
            label:
              campaign.status === "Sent"
                ? "Recipient sends"
                : "Eligible estimate",
            value: (campaign.status === "Sent"
              ? campaign.recipients
              : counts.eligible
            ).toLocaleString(),
          },
          {
            label: "Excluded estimate",
            value: counts.excluded.toLocaleString(),
          },
          { label: "Marketing consent", value: "Required" },
        ]}
      >
        <Button
          className="campaign-detail-link"
          variant="ghost"
          onClick={onExclusions}
        >
          View exclusions <span aria-hidden="true">→</span>
        </Button>
      </DetailSection>
      <DetailSection
        title="Activity"
        rows={[
          {
            label: "Status",
            value: (
              <span className="campaign-detail-status" data-tone={tone}>
                {campaign.status}
              </span>
            ),
          },
          { label: "Last updated", value: campaign.updated },
          {
            label: "Scheduled for",
            value: campaign.schedule
              ? campaign.schedule.replace("T", " at ")
              : "Not scheduled",
          },
          { label: "Timezone", value: "UTC+5:45 (Asia/Kathmandu)" },
        ]}
      >
        <p className="campaign-detail-note">
          Demo data ·{" "}
          {campaign.status === "Sent"
            ? "No real emails were sent. Delivery feedback is unavailable."
            : "Audience counts are estimates. No live dispatch service is connected."}
        </p>
      </DetailSection>
    </div>
  );
}
