"use client";

import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DashboardAlert,
  DashboardKPICard,
  DashboardPointsDataPoint,
  DashboardRecentActivityItem,
  DashboardRewardItem,
  DashboardVIPTierItem,
} from "@/lib/dashboard/dashboard-types";
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

/* 1. Metric Drilldown Sheet */
export function MetricDetailSheet({
  card,
  open,
  onClose,
}: {
  card: DashboardKPICard | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!card) return null;
  const sheet = card.sheetData;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sheet.title}
      description={sheet.description}
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-6">
          {/* Current Period Card */}
          <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
            <span className="text-xs text-[var(--muted-foreground)] block">
              Current period value
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
                {sheet.currentValue}
              </span>
              {sheet.change && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    sheet.changeDirection === "up"
                      ? "bg-[var(--secondary-container)] text-[var(--secondary)]"
                      : sheet.changeDirection === "down"
                      ? "bg-[var(--destructive-container)] text-[var(--destructive)]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {sheet.changeDirection === "up" && <TrendingUp size={12} />}
                  {sheet.changeDirection === "down" && <TrendingDown size={12} />}
                  {!sheet.changeDirection && <Minus size={12} />}
                  <span>{sheet.change}</span>
                </div>
              )}
            </div>
            {sheet.previousValue && (
              <span className="text-xs text-[var(--muted-foreground)] mt-2 block">
                Compared against previous period ({sheet.previousValue})
              </span>
            )}
          </div>

          {/* Breakdown Items */}
          <div>
            <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Metric Breakdown
            </h4>
            <div className="divide-y divide-[var(--border)] rounded-lg border border-[var(--border)] overflow-hidden">
              {sheet.metrics.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 text-xs bg-[var(--card)] hover:bg-[var(--muted)]/40 transition-colors"
                >
                  <span className="text-[var(--foreground)] font-medium">
                    {row.label}
                  </span>
                  <span className="tabular-nums font-semibold text-[var(--foreground)]">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-[var(--border)] mt-6">
          <Button variant="default" className="w-full text-xs h-9 gap-1.5" asChild>
            <Link href={sheet.actionHref}>
              <span>{sheet.actionLabel}</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 2. Points Date Drilldown Sheet */
export function PointsDateDetailSheet({
  point,
  open,
  onClose,
}: {
  point: DashboardPointsDataPoint | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!point) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Activity for ${point.label}`}
      description="Detailed ledger breakdown of points earned and redeemed during this timeframe."
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-[var(--secondary-container)]/30 border border-[var(--secondary)]/30">
              <span className="text-xs text-[var(--secondary)] block font-medium">
                Points earned
              </span>
              <span className="text-2xl font-bold text-[var(--secondary)] tabular-nums mt-1 block">
                +{point.earned.toLocaleString()}
              </span>
            </div>
            <div className="p-3.5 rounded-lg bg-[#c026d3]/10 border border-[#c026d3]/30">
              <span className="text-xs text-[#c026d3] block font-medium">
                Points redeemed
              </span>
              <span className="text-2xl font-bold text-[#c026d3] tabular-nums mt-1 block">
                -{point.redeemed.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Timeframe Summary
            </h4>
            <div className="space-y-2 text-xs border border-[var(--border)] rounded-lg p-3.5 bg-[var(--card)]">
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Tracking date</span>
                <span className="font-semibold text-[var(--foreground)]">{point.date}</span>
              </div>
              <div className="flex justify-between py-1 border-t border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Net point balance impact</span>
                <span className="font-bold text-[var(--foreground)] tabular-nums">
                  +{point.netChange.toLocaleString()} pts
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-6">
          <Button variant="default" className="w-full text-xs h-9 gap-1.5" asChild>
            <Link href="/analytics?tab=loyalty">
              <span>View full points history in Analytics</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 3. ROI Methodology Sheet */
export function ROIMethodologySheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="How Program ROI is calculated"
      description="Transparent methodology and directional formulas used to estimate your loyalty program financial return."
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4 text-xs space-y-6">
        <div className="space-y-5">
          <div className="p-3.5 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)]">
            <h4 className="font-semibold text-[var(--foreground)] mb-1">
              Return Multiple Formula
            </h4>
            <code className="text-[11px] font-mono block p-2 rounded bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] my-1.5">
              Return Multiple = Incremental Revenue / Program Cost
            </code>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
              For example, $39,600 incremental revenue / $12,000 program cost = <strong>3.3x</strong> return multiple ($3.30 returned per $1 invested).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-1">
              1. Estimated Incremental Revenue ($39,600)
            </h4>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
              Derived from three attributed streams:
            </p>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-[var(--muted-foreground)]">
              <li><strong>Additional repeat purchases ($24,800):</strong> Member repeat order rate lift above matched non-member cohort.</li>
              <li><strong>Reward redemptions ($10,600):</strong> Order cart values on checkout orders where discounts were unlocked.</li>
              <li><strong>VIP spend lift ($4,200):</strong> Incremental basket size gains from tiered customers.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--foreground)] mb-1">
              2. Program Cost ($12,000)
            </h4>
            <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-[var(--muted-foreground)]">
              <li><strong>Points issued liability ($7,200):</strong> Unredeemed points multiplied by baseline unit redemption value ($0.01/pt).</li>
              <li><strong>Redeemed discounts ($4,800):</strong> Actual dollars discounted on checkout orders using reward codes.</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-[var(--warning-container)]/30 border border-[var(--warning)]/30 text-[11px] text-[var(--muted-foreground)] leading-relaxed italic">
            These values are estimates and should be used as directional insights, not audited financial results.
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-4">
          <Button variant="outline" className="w-full text-xs h-9" onClick={onClose}>
            Close methodology
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 4. VIP Tier Detail Sheet */
export function VIPTierDetailSheet({
  tier,
  open,
  onClose,
}: {
  tier: DashboardVIPTierItem | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!tier) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${tier.name} Tier Details`}
      description={`Customer count, threshold criteria, and average order metrics for ${tier.name} members.`}
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tier.color }}
              />
              <span className="text-sm font-bold text-[var(--foreground)]">
                {tier.name} Tier
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[var(--foreground)] tabular-nums">
              {tier.customers.toLocaleString()}
            </div>
            <span className="text-xs text-[var(--muted-foreground)]">
              {tier.percentage}% of active loyalty members
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg overflow-hidden text-xs">
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Entry threshold</span>
              <span className="font-semibold text-[var(--foreground)]">
                {tier.threshold > 0 ? `${tier.threshold.toLocaleString()} points` : "Automatic / 0 points"}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Average customer points</span>
              <span className="font-semibold text-[var(--foreground)] tabular-nums">
                {tier.avgPoints.toLocaleString()} pts
              </span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Average order value</span>
              <span className="font-semibold text-[var(--foreground)] tabular-nums">
                ${tier.avgOrderValue}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-6">
          <Button variant="default" className="w-full text-xs h-9 gap-1.5" asChild>
            <Link href="/analytics?tab=vip">
              <span>View tier customers</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 5. Reward Detail Sheet */
export function RewardDetailSheet({
  reward,
  open,
  onClose,
}: {
  reward: DashboardRewardItem | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!reward) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={reward.name}
      description={`Redemption count, points burned, and campaign details for ${reward.name}.`}
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
            <span className="text-xs text-[var(--muted-foreground)] block">
              Total redemptions
            </span>
            <div className="text-3xl font-extrabold text-[var(--foreground)] tabular-nums mt-1">
              {reward.redemptions.toLocaleString()}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--secondary)] bg-[var(--secondary-container)] px-2 py-0.5 rounded-full mt-2">
              <CheckCircle2 size={11} />
              <span>{reward.status}</span>
            </span>
          </div>

          <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg overflow-hidden text-xs">
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Reward type</span>
              <span className="font-semibold text-[var(--foreground)]">{reward.type}</span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Points used</span>
              <span className="font-semibold text-[var(--foreground)] tabular-nums">
                {reward.pointsUsed.toLocaleString()} pts
              </span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Associated order value</span>
              <span className="font-semibold text-[var(--foreground)] tabular-nums">
                ${reward.associatedOrderValue.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-[var(--card)]">
              <span className="text-[var(--muted-foreground)]">Associated campaign</span>
              <span className="font-semibold text-[var(--foreground)]">{reward.campaign}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-6">
          <Button variant="default" className="w-full text-xs h-9 gap-1.5" asChild>
            <Link href="/rewards">
              <span>View reward configuration</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 6. Activity Event Detail Sheet */
export function ActivityDetailSheet({
  event,
  open,
  onClose,
}: {
  event: DashboardRecentActivityItem | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!event) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Loyalty Event Details"
      description={`Customer event details recorded on ${event.timestamp}.`}
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
            <h4 className="text-base font-bold text-[var(--foreground)]">
              {event.customerName}
            </h4>
            <span className="text-xs text-[var(--muted-foreground)]">
              {event.customerEmail}
            </span>
            <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--foreground)] font-medium">
              {event.description}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
              Event Metadata
            </h4>
            <div className="divide-y divide-[var(--border)] border border-[var(--border)] rounded-lg overflow-hidden text-xs">
              <div className="flex justify-between p-3 bg-[var(--card)]">
                <span className="text-[var(--muted-foreground)]">Event type</span>
                <span className="font-semibold text-[var(--foreground)] capitalize">
                  {event.type.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-[var(--card)]">
                <span className="text-[var(--muted-foreground)]">Time</span>
                <span className="font-semibold text-[var(--foreground)]">{event.timestamp}</span>
              </div>
              {event.relatedEntity && (
                <div className="flex justify-between p-3 bg-[var(--card)]">
                  <span className="text-[var(--muted-foreground)]">Related record</span>
                  <span className="font-semibold text-[var(--foreground)]">{event.relatedEntity}</span>
                </div>
              )}
              {event.details.channel && (
                <div className="flex justify-between p-3 bg-[var(--card)]">
                  <span className="text-[var(--muted-foreground)]">Channel</span>
                  <span className="font-semibold text-[var(--foreground)]">{event.details.channel}</span>
                </div>
              )}
              {event.details.reason && (
                <div className="flex justify-between p-3 bg-[var(--card)]">
                  <span className="text-[var(--muted-foreground)]">Note</span>
                  <span className="font-semibold text-[var(--foreground)]">{event.details.reason}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-6">
          <Button variant="default" className="w-full text-xs h-9 gap-1.5" asChild>
            <Link href="/customers">
              <span>View customer profile</span>
              <ArrowRight size={13} />
            </Link>
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 7. All Alerts Sheet */
export function AllAlertsSheet({
  alerts,
  open,
  onClose,
  onDismissAlert,
}: {
  alerts: DashboardAlert[];
  open: boolean;
  onClose: () => void;
  onDismissAlert: (id: string) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Action Required Items"
      description="Review operational alerts, sync warnings, and configuration actions."
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-[var(--foreground)]">{alert.title}</h4>
                {alert.isDismissible && (
                  <button
                    type="button"
                    onClick={() => onDismissAlert(alert.id)}
                    className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                  >
                    Dismiss
                  </button>
                )}
              </div>
              <p className="text-[var(--muted-foreground)]">{alert.description}</p>
              <div className="pt-2 border-t border-[var(--border)]">
                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                  <Link href={alert.actionHref || "#"}>{alert.actionLabel}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-6">
          <Button variant="outline" className="w-full text-xs h-9" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* 8. All Activity Sheet */
export function AllActivitySheet({
  events,
  open,
  onClose,
  onSelectEvent,
}: {
  events: DashboardRecentActivityItem[];
  open: boolean;
  onClose: () => void;
  onSelectEvent: (event: DashboardRecentActivityItem) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Recent Loyalty Activity Feed"
      description="Chronological log of customer events, points earned, redemptions, and tier upgrades."
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="divide-y divide-[var(--border)] overflow-y-auto pr-1">
          {events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => {
                onClose();
                onSelectEvent(evt);
              }}
              className="py-3 flex items-start justify-between gap-3 hover:bg-[var(--muted)]/40 p-2 rounded cursor-pointer transition-colors"
            >
              <div>
                <span className="text-xs font-semibold text-[var(--foreground)] block">
                  {evt.description}
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  {evt.customerEmail} · {evt.timestamp}
                </span>
              </div>
              <ArrowRight size={13} className="text-[var(--muted-foreground)] shrink-0 mt-1" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--border)] mt-4">
          <Button variant="outline" className="w-full text-xs h-9" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
