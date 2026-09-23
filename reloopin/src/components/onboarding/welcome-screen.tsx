"use client";

import { ShoppingCart, Award, Crown, Palette, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const OVERVIEW_STEPS = [
  {
    step: 1,
    title: "Connect your store",
    description: "Sync customers and orders.",
    icon: ShoppingCart,
  },
  {
    step: 2,
    title: "Create an earning rule",
    description: "Choose how customers collect points.",
    icon: Award,
  },
  {
    step: 3,
    title: "Set up VIP tiers",
    description: "Reward your most loyal customers.",
    icon: Crown,
  },
  {
    step: 4,
    title: "Match your brand",
    description: "Choose how the loyalty widget looks.",
    icon: Palette,
  },
];

export function WelcomeScreen({
  onStartSetup,
}: {
  onStartSetup: () => void;
}) {
  return (
    <div className="max-w-[720px] mx-auto py-8 sm:py-12 px-4">
      {/* Header Badge & Title */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--muted)] border border-[var(--border)] text-xs font-medium text-[var(--muted-foreground)] mb-4">
          <Clock size={13} className="text-[var(--primary)]" />
          <span>Takes about 5-10 minutes</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Set up your loyalty program
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
          Connect your store, choose how customers earn points, create VIP tiers, and match the loyalty widget to your brand.
        </p>
      </div>

      {/* 4 Steps Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10">
        {OVERVIEW_STEPS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-2xs hover:border-[var(--ring)] transition-all flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase tracking-wider">
                  Step {item.step}
                </span>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-normal">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={onStartSetup}
          className="w-full sm:w-auto h-10 px-6 font-semibold text-xs gap-2 shadow-xs"
        >
          <span>Start setup</span>
          <ArrowRight size={14} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-full sm:w-auto h-10 px-4 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <Link href="/dashboard">
            <ArrowLeft size={13} className="mr-1.5" />
            <span>Back to account</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

