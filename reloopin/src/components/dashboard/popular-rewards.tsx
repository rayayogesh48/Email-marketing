"use client";

import { Gift, ArrowRight, ChevronRight, Plus } from "lucide-react";
import { DashboardRewardItem } from "@/lib/dashboard/dashboard-types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PopularRewards({
  rewards,
  hasRewards,
  onOpenRewardSheet,
  onViewAllRewards,
}: {
  rewards: DashboardRewardItem[];
  hasRewards: boolean;
  onOpenRewardSheet: (reward: DashboardRewardItem) => void;
  onViewAllRewards: () => void;
}) {
  if (!hasRewards || rewards.length === 0) {
    return (
      <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
            Most redeemed rewards
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Rewards customers used most during this period.
          </p>

          <div className="mt-8 p-6 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-center flex flex-col items-center">
            <div className="p-2 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] mb-2">
              <Gift size={20} />
            </div>
            <h4 className="text-xs font-semibold text-[var(--foreground)]">
              Create your first reward
            </h4>
            <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm leading-relaxed">
              Give customers a reason to use their points and return to your store.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-xs h-7 rounded-md gap-1"
              asChild
            >
              <Link href="/rewards/new">
                <Plus size={12} />
                <span>Create reward</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const topRewards = rewards.slice(0, 3);
  const maxRedemptions = Math.max(...topRewards.map((r) => r.redemptions), 1);

  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[var(--foreground)] tracking-tight">
              Most redeemed rewards
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              Rewards customers used most during this period.
            </p>
          </div>

          <span className="text-xs text-[var(--muted-foreground)]">
            Top 3
          </span>
        </div>

        {/* Reward Items */}
        <div className="space-y-3 mt-4">
          {topRewards.map((reward, idx) => {
            const barWidth = Math.round((reward.redemptions / maxRedemptions) * 100);

            return (
              <div
                key={reward.id}
                role="button"
                tabIndex={0}
                onClick={() => onOpenRewardSheet(reward)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpenRewardSheet(reward);
                  }
                }}
                className="group cursor-pointer p-2.5 -mx-2.5 rounded-lg hover:bg-[var(--muted)]/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                aria-label={`${reward.name}: ${reward.redemptions.toLocaleString()} redemptions, ${reward.pointsUsed.toLocaleString()} points used.`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {reward.name}
                      </h4>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {reward.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold tabular-nums text-[var(--foreground)] block">
                        {reward.redemptions.toLocaleString()} uses
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)] tabular-nums">
                        {reward.pointsUsed.toLocaleString()} pts
                      </span>
                    </div>

                    <ChevronRight
                      size={13}
                      className="text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>

                {/* Proportional Usage Bar */}
                <div className="h-1.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--primary)] transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">
          Total redemptions:{" "}
          <strong className="text-[var(--foreground)] tabular-nums">
            {rewards.reduce((acc, r) => acc + r.redemptions, 0).toLocaleString()}
          </strong>
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAllRewards}
          className="h-7 px-2 text-xs font-medium text-[var(--primary)] gap-1 hover:bg-[var(--primary-container)]/30"
        >
          <span>View all rewards</span>
          <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
}

