"use client";

import { Modal } from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function MethodologySheet({
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
      title="How ROI is calculated"
      description="Understanding how Reloopin estimates incremental revenue and program return."
      side={true}
    >
      <div className="campaign-details flex flex-col justify-between h-full pt-4 space-y-6">
        <div className="space-y-5 text-xs text-[var(--foreground)]">
          {/* Methodology Sections */}
          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <h4 className="font-semibold text-sm text-[var(--foreground)]">
              Incremental revenue
            </h4>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Estimated revenue generated above the expected baseline purchase
              behavior of comparable non-loyalty customers. This is computed by
              tracking repurchase rate lift, VIP tier upgrade spend, and orders
              accelerated by reward redemptions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <h4 className="font-semibold text-sm text-[var(--foreground)]">
              Cost of points issued
            </h4>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Total loyalty points added to customer accounts during the period,
              multiplied by the configured liability value per point (for example,
              100 points = $1.00 store credit liability).
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <h4 className="font-semibold text-sm text-[var(--foreground)]">
              Reward discount cost
            </h4>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              The direct dollar discount applied at checkout when customers
              redeemed coupon codes or reward points on completed orders.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <h4 className="font-semibold text-sm text-[var(--foreground)]">
              Net value
            </h4>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Calculated as:{" "}
              <code className="px-1.5 py-0.5 rounded bg-[var(--muted)] font-mono text-[11px]">
                Incremental revenue - Total program cost
              </code>
              . Demonstrates the net monetary benefit retained by the store.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-1.5">
            <h4 className="font-semibold text-sm text-[var(--foreground)]">
              Return multiple
            </h4>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Calculated as:{" "}
              <code className="px-1.5 py-0.5 rounded bg-[var(--muted)] font-mono text-[11px]">
                Incremental revenue / Total program cost
              </code>
              . A 3.3x multiple indicates that each $1.00 allocated to the loyalty
              program returned $3.30 in incremental store revenue.
            </p>
          </div>

          {/* Directional Disclaimer Notice */}
          <div className="p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-start gap-2.5">
            <Info size={16} className="text-[var(--muted-foreground)] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[var(--muted-foreground)] leading-normal">
              These values are estimates and should be used as directional
              insights, not audited financial results. Factors such as storewide
              sales, seasonal promotions, and organic traffic shifts also
              influence customer behavior.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

