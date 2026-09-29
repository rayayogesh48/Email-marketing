"use client";

import { featureComparisonMatrix } from "@/lib/billing/billing-data";
import { Check, Minus, Info } from "lucide-react";
import { BillingPlanId } from "@/lib/billing/billing-types";

export function PlanComparisonTable({
  currentPlanId,
}: {
  currentPlanId: BillingPlanId;
}) {
  return (
    <div className="mt-12 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Compare plan features
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
          Review complete capabilities, limits, and integrations across each tier.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/40">
                <th className="py-3.5 px-4 font-semibold text-[var(--foreground)] w-1/3">
                  Feature
                </th>
                <th
                  className={`py-3.5 px-4 font-semibold text-center w-2/9 ${
                    currentPlanId === "starter" ? "bg-[var(--primary)]/5 text-[var(--primary)]" : "text-[var(--foreground)]"
                  }`}
                >
                  Starter
                </th>
                <th
                  className={`py-3.5 px-4 font-semibold text-center w-2/9 ${
                    currentPlanId === "growth" ? "bg-[var(--primary)]/5 text-[var(--primary)]" : "text-[var(--foreground)]"
                  }`}
                >
                  Growth
                </th>
                <th
                  className={`py-3.5 px-4 font-semibold text-center w-2/9 ${
                    currentPlanId === "pro" ? "bg-[var(--primary)]/5 text-[var(--primary)]" : "text-[var(--foreground)]"
                  }`}
                >
                  Pro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {featureComparisonMatrix.map((item) => (
                <tr key={item.name} className="hover:bg-[var(--muted)]/20 transition-colors">
                  <td className="py-3 px-4 font-medium text-[var(--foreground)] flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {item.tooltip && (
                      <span
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-help"
                        title={item.tooltip}
                      >
                        <Info size={13} />
                      </span>
                    )}
                  </td>

                  {/* Starter column */}
                  <td
                    className={`py-3 px-4 text-center ${
                      currentPlanId === "starter" ? "bg-[var(--primary)]/5" : ""
                    }`}
                  >
                    {typeof item.starter === "boolean" ? (
                      item.starter ? (
                        <Check size={16} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
                      ) : (
                        <Minus size={16} className="text-[var(--muted-foreground)] opacity-50 mx-auto" />
                      )
                    ) : (
                      <span className="text-[var(--foreground)] font-medium">{item.starter}</span>
                    )}
                  </td>

                  {/* Growth column */}
                  <td
                    className={`py-3 px-4 text-center ${
                      currentPlanId === "growth" ? "bg-[var(--primary)]/5" : ""
                    }`}
                  >
                    {typeof item.growth === "boolean" ? (
                      item.growth ? (
                        <Check size={16} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
                      ) : (
                        <Minus size={16} className="text-[var(--muted-foreground)] opacity-50 mx-auto" />
                      )
                    ) : (
                      <span className="text-[var(--foreground)] font-medium">{item.growth}</span>
                    )}
                  </td>

                  {/* Pro column */}
                  <td
                    className={`py-3 px-4 text-center ${
                      currentPlanId === "pro" ? "bg-[var(--primary)]/5" : ""
                    }`}
                  >
                    {typeof item.pro === "boolean" ? (
                      item.pro ? (
                        <Check size={16} className="text-emerald-600 dark:text-emerald-400 mx-auto" />
                      ) : (
                        <Minus size={16} className="text-[var(--muted-foreground)] opacity-50 mx-auto" />
                      )
                    ) : (
                      <span className="text-[var(--foreground)] font-medium">{item.pro}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
