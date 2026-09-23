"use client";

import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { ReactNode } from "react";

export interface DetailSheetData {
  title: string;
  description: string;
  currentValue: string;
  previousValue?: string;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  breakdown?: { label: string; value: string | ReactNode }[];
  actionLabel?: string;
  onAction?: () => void;
  extraContent?: ReactNode;
}

export function AnalyticsDetailSheet({
  data,
  open,
  onClose,
}: {
  data: DetailSheetData | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!data) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={data.title}
      description={data.description}
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4">
        <div className="space-y-6">
          {/* Key Metric Numbers Header */}
          <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
            <span className="text-xs text-[var(--muted-foreground)] block">Current period value</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
                {data.currentValue}
              </span>

              {data.change && (
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    data.changeDirection === "up"
                      ? "bg-[#16a34a]/10 text-[#16a34a]"
                      : data.changeDirection === "down"
                      ? "bg-[#ca8a04]/10 text-[#ca8a04]"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {data.changeDirection === "up" && <TrendingUp size={13} />}
                  {data.changeDirection === "down" && <TrendingDown size={13} />}
                  {data.changeDirection === "neutral" && <Minus size={13} />}
                  <span className="tabular-nums">{data.change}</span>
                </div>
              )}
            </div>

            {data.previousValue && (
              <div className="text-xs text-[var(--muted-foreground)] mt-2 pt-2 border-t border-[var(--border)] flex justify-between">
                <span>Previous period:</span>
                <span className="tabular-nums font-medium text-[var(--foreground)]">
                  {data.previousValue}
                </span>
              </div>
            )}
          </div>

          {/* Breakdown Rows */}
          {data.breakdown && data.breakdown.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Breakdown & Details
              </h4>
              <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden bg-[var(--card)]">
                {data.breakdown.map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 text-xs">
                    <span className="text-[var(--muted-foreground)]">{row.label}</span>
                    <span className="font-semibold text-[var(--foreground)] tabular-nums">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.extraContent}
        </div>

        {/* Action Button at bottom */}
        {data.actionLabel && (
          <div className="pt-6 border-t border-[var(--border)] mt-6">
            <Button
              className="w-full justify-center"
              onClick={() => {
                data.onAction?.();
                onClose();
              }}
            >
              {data.actionLabel} <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
