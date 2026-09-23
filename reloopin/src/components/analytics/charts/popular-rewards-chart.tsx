"use client";

import { RewardRedemptionItem } from "@/lib/analytics-data";
import { ChevronRight } from "lucide-react";

export function PopularRewardsChart({
  rewards,
  onSelectReward,
}: {
  rewards: RewardRedemptionItem[];
  onSelectReward?: (reward: RewardRedemptionItem) => void;
}) {
  const maxCount = Math.max(...rewards.map((r) => r.redemptions), 1);

  return (
    <div className="w-full space-y-2.5" role="region" aria-label="Most redeemed rewards ranking">
      {rewards.map((reward, index) => {
        const barWidth = Math.round((reward.redemptions / maxCount) * 100);

        return (
          <button
            key={reward.id}
            type="button"
            className="w-full text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--ring)] hover:shadow-xs transition-all group focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
            onClick={() => onSelectReward?.(reward)}
            aria-label={`${reward.name}: ${reward.redemptions} redemptions, ${reward.pointsUsed.toLocaleString()} points used. Click to view reward details.`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2.5 font-semibold text-[var(--foreground)]">
                <span className="w-5 h-5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] font-bold text-[11px] flex items-center justify-center shrink-0 border border-[var(--border)]">
                  {index + 1}
                </span>
                <span className="text-xs sm:text-sm">{reward.name}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-bold text-[var(--foreground)] tabular-nums text-xs sm:text-sm">
                  {reward.redemptions}
                </span>
                <span className="badge font-semibold text-[11px] tabular-nums bg-[var(--primary-container)] text-[var(--primary)] border-transparent">
                  {reward.percentage}%
                </span>
                <ChevronRight
                  size={14}
                  className="text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 transition-transform shrink-0"
                />
              </div>
            </div>

            {/* Horizontal Bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--muted)] overflow-hidden my-1">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500 ease-out"
                style={{ width: `${barWidth}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1.5 text-[11px] text-[var(--muted-foreground)]">
              <span>{reward.pointsUsed.toLocaleString()} pts (${reward.discountValue} value)</span>
              <span className="truncate max-w-[200px]">{reward.campaign}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
