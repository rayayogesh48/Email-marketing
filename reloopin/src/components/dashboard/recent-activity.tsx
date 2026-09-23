"use client";

import {
  Coins,
  Crown,
  Gift,
  UserPlus,
  Share2,
  Sliders,
  Clock,
  ArrowRight,
  ChevronRight,
  Activity,
} from "lucide-react";
import { DashboardRecentActivityItem } from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";

function getEventIcon(type: DashboardRecentActivityItem["type"]) {
  switch (type) {
    case "points_earned":
      return <Coins size={14} className="text-[var(--secondary)]" />;
    case "reward_redeemed":
      return <Gift size={14} className="text-[#c026d3]" />;
    case "tier_upgraded":
      return <Crown size={14} className="text-[#eab308]" />;
    case "referral_completed":
      return <Share2 size={14} className="text-[var(--info)]" />;
    case "customer_joined":
      return <UserPlus size={14} className="text-[var(--primary)]" />;
    case "manual_adjustment":
      return <Sliders size={14} className="text-[var(--muted-foreground)]" />;
    default:
      return <Clock size={14} className="text-[var(--muted-foreground)]" />;
  }
}

export function RecentActivity({
  events,
  onOpenActivitySheet,
  onViewAllActivity,
}: {
  events: DashboardRecentActivityItem[];
  onOpenActivitySheet: (event: DashboardRecentActivityItem) => void;
  onViewAllActivity: () => void;
}) {
  if (events.length === 0) {
    return (
      <div className="p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
        <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
          Recent loyalty activity
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 mb-6">
          Latest customer and loyalty events from this store.
        </p>

        <div className="p-8 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-center flex flex-col items-center">
          <div className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-2">
            <Activity size={20} />
          </div>
          <h4 className="text-xs font-semibold text-[var(--foreground)]">
            No recent activity
          </h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm leading-relaxed">
            New points, rewards, tier changes, and customer activity will appear here.
          </p>
        </div>
      </div>
    );
  }

  const displayedEvents = events.slice(0, 5);

  return (
    <div className="p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
            Recent loyalty activity
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Latest customer and loyalty events from this store.
          </p>
        </div>

        <span className="text-xs text-[var(--muted-foreground)]">
          Live feed
        </span>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-[var(--border)]">
        {displayedEvents.map((evt) => (
          <div
            key={evt.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpenActivitySheet(evt)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenActivitySheet(evt);
              }
            }}
            className="group py-3 flex items-center justify-between gap-3 hover:bg-[var(--muted)]/40 -mx-2 px-2 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
            aria-label={`${evt.description} · ${evt.timestamp}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-full bg-[var(--muted)] shrink-0 group-hover:scale-105 transition-transform">
                {getEventIcon(evt.type)}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                    {evt.customerName}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {evt.description.replace(evt.customerName, "").trim()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)] mt-0.5">
                  {evt.relatedEntity && (
                    <>
                      <span>{evt.relatedEntity}</span>
                      <span>·</span>
                    </>
                  )}
                  <span>{evt.timestamp}</span>
                </div>
              </div>
            </div>

            <ChevronRight
              size={14}
              className="text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">
          Showing {displayedEvents.length} of {events.length} events
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAllActivity}
          className="h-7 px-2 text-xs font-medium text-[var(--primary)] gap-1 hover:bg-[var(--primary-container)]/30"
        >
          <span>View all activity</span>
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
}

