"use client";

import { useState } from "react";
import {
  TrendingUp,
  Award,
  Crown,
  Gift,
  Users,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  highlightText: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Program Performance",
    description:
      "Your dashboard home displays live active members, redemption rate, repeat purchase lift, and estimated net ROI at a single glance.",
    icon: TrendingUp,
    highlightText: "Answers 'Is my loyalty program working?' immediately.",
  },
  {
    title: "Points & Earning Rules",
    description:
      "Track points issued vs. redeemed, manage purchase rules, and set up bonus point promotions for events or product categories.",
    icon: Award,
    highlightText: "Points activity chart reconciles daily transactions.",
  },
  {
    title: "VIP Tiers",
    description:
      "View member distribution across Silver, Gold, and Platinum tiers. Track who upgraded and who is close to reaching their next tier.",
    icon: Crown,
    highlightText: "Drive repeat shopper retention with status perks.",
  },
  {
    title: "Rewards & Redemptions",
    description:
      "Monitor the most popular rewards shoppers redeem, from percentage discounts to free shipping and custom products.",
    icon: Gift,
    highlightText: "Keep redemptions attractive without eroding margin.",
  },
  {
    title: "Customers & Loyalty Profiles",
    description:
      "Inspect individual shopper points balances, transaction histories, tier movements, and loyalty activities in real time.",
    icon: Users,
    highlightText: "Manage customer points adjustments and details.",
  },
  {
    title: "In-Depth Analytics",
    description:
      "Explore comprehensive reporting across Loyalty Performance, VIP Tiers, and Program ROI financial ledger with exportable CSVs.",
    icon: BarChart3,
    highlightText: "Detailed charts with period comparisons.",
  },
];

export function DashboardTour({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!open) return null;

  const currentStep = TOUR_STEPS[currentIndex];
  const Icon = currentStep.icon;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl p-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer"
          aria-label="Skip and close tour"
        >
          <X size={16} />
        </button>

        {/* Step Indicator & Category */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-lg bg-[var(--primary-container)] text-[var(--primary)] flex items-center justify-center shadow-xs">
            <Icon size={18} />
          </span>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Dashboard Tour · {currentIndex + 1} of {TOUR_STEPS.length}
            </span>
            <h3 className="text-base font-bold text-[var(--foreground)] leading-tight">
              {currentStep.title}
            </h3>
          </div>
        </div>

        {/* Description & Highlight */}
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mb-4">
          {currentStep.description}
        </p>

        <div className="p-3 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] flex items-center gap-2 mb-6 text-xs font-medium text-[var(--foreground)]">
          <Sparkles size={14} className="text-[var(--primary)] shrink-0" />
          <span>{currentStep.highlightText}</span>
        </div>

        {/* Dots progress indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {TOUR_STEPS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "w-6 bg-[var(--primary)]"
                  : "w-1.5 bg-[var(--border)] hover:bg-[var(--muted-foreground)]"
              }`}
              aria-label={`Go to tour step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Tour Navigation Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            Skip tour
          </Button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="text-xs h-8 px-3 gap-1"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              onClick={handleNext}
              className="text-xs h-8 px-4 font-semibold gap-1.5 bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              {isLast ? (
                <>
                  <Check size={13} />
                  <span>Finish tour</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={13} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

